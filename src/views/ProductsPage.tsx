'use client'
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react'
import {
  Search,
  List,
  Grid3x3,
  SlidersHorizontal,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
} from 'lucide-react'
import { cn, generateSlug, slugToCategory } from '@/lib/utils'
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams'
import { useRouter } from 'next/navigation'
import CardProduct from '@/components/sections/products/CardProduct'
import FilterSection from '@/components/sections/products/FilterSection'


interface Product {
  id: string
  slug: string
  categorySlug: string
  name: string
  category: string
  brand: string
  image: string
  description: string
  price?: number
  rating?: number
}

interface ProductsPageProps {
  categorySlug?: string
  subcategorySlug?: string
  initialProducts: Product[]
  initialCategories: string[]
  initialBrands: string[]
  initialParentNameMap: Record<string, string[]>
}

export default function ProductsPage({
  categorySlug,
  subcategorySlug,
  initialProducts,
  initialCategories,
  initialBrands,
  initialParentNameMap,
}: ProductsPageProps) {
  const [searchParams, setSearchParams] = useCustomSearchParams()
  const searchTerm = searchParams.get('q') || ''
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [dbCategories, setDbCategories] = useState<string[]>(initialCategories)
  const [dbBrands, setDbBrands] = useState<string[]>(initialBrands)
  const [parentNameMap, setParentNameMap] = useState<Record<string, string[]>>(initialParentNameMap)

  const [selectedCategories, setSelectedCategories] = useState<
    string[]
  >(
    searchParams.get('category')
      ? searchParams.get('category')!.split(',')
      : [],
  )
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get('brand')
      ? searchParams.get('brand')!.split(',')
      : [],
  )

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isDesktopView, setIsDesktopView] = useState(true)
  const [expandedFilters, setExpandedFilters] = useState({
    categories: !!searchParams.get('category') || false,
    brands: !!searchParams.get('brand') || false,
    price: false,
    rating: false,
  })
  const [expandedParent, setExpandedParent] = useState<string | null>(null)
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(
    searchParams.get('page')
      ? parseInt(searchParams.get('page')!)
      : 1,
  )
  const ITEMS_PER_PAGE = 16

  const categoryFromSlug = categorySlug
    ? slugToCategory(categorySlug, dbCategories)
    : null
  const subcategoryFromSlug = subcategorySlug
    ? slugToCategory(subcategorySlug, dbCategories)
    : null
  const activeCategory =
    subcategoryFromSlug ??
    categoryFromSlug ??
    (selectedCategories.length === 1 ? selectedCategories[0] : null)
  const subcategoryMap = parentNameMap

  useEffect(() => {
    if (subcategorySlug) {
      const resolved = slugToCategory(subcategorySlug, dbCategories)
      if (resolved) {
        setSelectedCategories([resolved])
        const parentName = Object.entries(parentNameMap).find(([, children]) =>
          children.includes(resolved)
        )?.[0]
        if (parentName) setExpandedParent(parentName)
      }
    } else if (categorySlug) {
      const resolved = slugToCategory(categorySlug, dbCategories)
      if (resolved) {
        if (parentNameMap[resolved]) {
          setExpandedParent(resolved)
        } else {
          const parentName = Object.entries(parentNameMap).find(([, children]) =>
            children.includes(resolved)
          )?.[0]
          if (parentName) setExpandedParent(parentName)
        }
        setSelectedCategories([resolved])
      }
    }
  }, [])

  useEffect(() => {
    const isDesktop = window.innerWidth >= 1024
    setIsDesktopView(isDesktop)
    if (!searchParams.get('category')) {
      setExpandedFilters((prev) => ({
        ...prev,
        categories: isDesktop,
      }))
    }
  }, [])

  const getEffectiveCategoryFilter = useCallback((): string[] => {
    if (selectedCategories.length > 0) {
      return selectedCategories.flatMap((name) => {
        const children = subcategoryMap[name]
        return children && children.length > 0 ? children : [name]
      })
    }
    if (categoryFromSlug && activeCategory === categoryFromSlug && subcategoryMap[categoryFromSlug]) {
      return subcategoryMap[categoryFromSlug]
    }
    return []
  }, [selectedCategories, categoryFromSlug, activeCategory, subcategoryMap])

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
    const effectiveFilter = getEffectiveCategoryFilter()
    const matchesCategory =
      effectiveFilter.length === 0 ||
      effectiveFilter.includes(product.category)
    const matchesBrand =
      selectedBrands.length === 0 ||
      selectedBrands.includes(product.brand)
    return matchesSearch && matchesCategory && matchesBrand
  })

  const totalPages = Math.ceil(
    filteredProducts.length / ITEMS_PER_PAGE,
  )
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  )

  useEffect(() => {
    const brandParam = searchParams.get('brand')
    const pageParam = searchParams.get('page')

    if (!categorySlug) {
      const categoryParam = searchParams.get('category')
      setSelectedCategories(
        categoryParam ? categoryParam.split(',') : [],
      )
    }

    setSelectedBrands(brandParam ? brandParam.split(',') : [])
    setCurrentPage(pageParam ? parseInt(pageParam) : 1)

    if (brandParam)
      setExpandedFilters((prev) => ({ ...prev, brands: true }))
  }, [searchParams])

  const clearAllFilters = () => {
    router.push('/productos')
    setSelectedCategories([])
    setSelectedBrands([])
    setCurrentPage(1)
  }

  const toggleCategory = useCallback(
    (category: string) => {
      const isAlreadySelected = selectedCategories.includes(category)
      const isParent = !!subcategoryMap[category]

      if (isAlreadySelected) {
        router.push('/productos')
      } else if (isParent) {
        setExpandedParent((prev) => (prev === category ? null : category))
      } else {
        const parentName = Object.entries(subcategoryMap).find(([, children]) =>
          children.includes(category)
        )?.[0]
        if (parentName) {
          router.push(`/productos/${generateSlug(parentName)}/${generateSlug(category)}`)
        } else {
          router.push(`/productos/${generateSlug(category)}`)
        }
      }

      if (!isDesktopView) {
        setExpandedFilters((prev) => ({ ...prev, categories: false }))
      }
    },
    [selectedCategories, subcategoryMap, isDesktopView, router],
  )

  const toggleBrand = useCallback(
    (brand: string) => {
      const updated = selectedBrands.includes(brand)
        ? []
        : [brand]

      setSelectedBrands(updated)

      const params = new URLSearchParams(searchParams)
      if (updated.length > 0) {
        params.set('brand', updated.join(','))
      } else {
        params.delete('brand')
      }
      params.delete('page')
      setSearchParams(params)
    },
    [selectedBrands, searchParams, setSearchParams],
  )

  const setPage = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    setSearchParams(params)
  }

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentPage])

  const pageDescription = activeCategory
    ? `Venta y distribución de ${activeCategory} para la industria metalmecánica. Cotiza precios de herramientas de alta precisión en Lima, Perú.`
    : 'Catálogo completo de herramientas industriales metalmecánicas en Perú: brocas, machos de roscado, fresas e insertos. Importación directa y distribución al por mayor y menor.'

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50/30 pb-20 pt-6">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="hidden lg:block lg:w-80 shrink-0">
            <div className="bg-white shadow-xl shadow-gray-200/50 border border-gray-100 overflow-y-auto sticky top-0 max-h-[calc(100vh-8rem)]">
              <div className="bg-gray-50/50 px-8 py-6 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <SlidersHorizontal
                    size={22}
                    className="text-matheo-blue"
                  />
                  <span className="font-black text-matheo-blue uppercase tracking-wider">
                    Filtros
                  </span>
                </div>
                {(selectedCategories.length > 0 ||
                  selectedBrands.length > 0 ||
                  searchTerm) && (
                  <button
                    onClick={clearAllFilters}
                    className="text-xs text-red-500 font-bold hover:underline"
                  >
                    Limpiar
                  </button>
                )}
              </div>

              <div className="px-8">
                {/* Filtro Categoría */}
                <FilterSection
                  title="Categoría"
                  icon={LayoutGrid}
                  isOpen={expandedFilters.categories}
                  onToggle={() =>
                    setExpandedFilters((p) => ({
                      ...p,
                      categories: !p.categories,
                    }))
                  }
                >
                  <div className="space-y-1">
                    {dbCategories
                      .filter(
                        (cat) =>
                          !Object.values(subcategoryMap)
                            .flat()
                            .includes(cat),
                      )
                      .map((parentName) => {
                        const children =
                          subcategoryMap[parentName] || []
                        const isExpanded =
                          expandedParent === parentName

                        return (
                          <div key={parentName}>
                            <button
                              onClick={() =>
                                toggleCategory(parentName)
                              }
                              className={`w-full flex items-center gap-2 py-1.5 rounded-lg transition-colors text-left ${
                                selectedCategories.includes(
                                  parentName,
                                )
                                  ? 'text-matheo-blue'
                                  : 'text-gray-600 hover:text-matheo-blue'
                              }`}
                            >
                              {children.length > 0 && (
                                <ChevronRight
                                  size={14}
                                  className={`shrink-0 transition-transform duration-200 ${
                                    isExpanded ? 'rotate-90' : ''
                                  } ${
                                    selectedCategories.includes(
                                      parentName,
                                    )
                                      ? 'text-matheo-blue'
                                      : 'text-gray-400'
                                  }`}
                                />
                              )}
                              {children.length === 0 && (
                                <div className="w-3.5 shrink-0" />
                              )}
                              <span className="text-sm font-bold">
                                {parentName}
                              </span>
                              {children.length > 0 && (
                                <span
                                  className={`text-xs ml-auto ${
                                    isExpanded
                                      ? 'text-matheo-blue'
                                      : 'text-gray-400'
                                  }`}
                                >
                                  {isExpanded ? '−' : '+'}
                                </span>
                              )}
                            </button>
                            <div
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                isExpanded
                                  ? 'max-h-[9999px] opacity-100'
                                  : 'max-h-0 opacity-0'
                              }`}
                            >
                              <div className="ml-4 pl-3 border-l-2 border-gray-100 space-y-0.5 pt-0.5">
                                {children.map((child) => (
                                  <label
                                    key={child}
                                    className="flex items-center gap-2 group cursor-pointer py-1 rounded-lg hover:bg-gray-50 px-2"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedCategories.includes(
                                        child,
                                      )}
                                      onChange={() =>
                                        toggleCategory(child)
                                      }
                                      className="w-4 h-4 text-matheo-blue rounded border-2 border-gray-200 focus:ring-matheo-blue transition-all"
                                    />
                                    <span className="text-gray-600 group-hover:text-matheo-blue transition-colors text-xs font-medium">
                                      {child}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </FilterSection>

                {/* Filtro Marca */}
                {/* <FilterSection
                    title="Marca"
                    icon={Tag}
                    isOpen={expandedFilters.brands}
                    onToggle={() =>
                      setExpandedFilters((p) => ({
                        ...p,
                        brands: !p.brands,
                      }))
                    }
                  >
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                      {dbBrands.map((brand) => (
                          <label
                            key={brand}
                            className="flex items-center gap-3 group cursor-pointer"
                          >
                            <div className="relative flex items-center">
                              <input
                                type="radio"
                                name="brand"
                                checked={selectedBrands.includes(
                                  brand,
                                )}
                                onChange={() => toggleBrand(brand)}
                                className="w-5 h-5 text-matheo-blue border-2 border-gray-200 focus:ring-matheo-blue transition-all"
                              />
                            </div>
                            <span className="text-gray-600 group-hover:text-matheo-blue transition-colors text-sm font-bold">
                              {brand}
                            </span>
                          </label>
                        ))}
                    </div>
                  </FilterSection> */}
              </div>
            </div>
          </aside>

          <main className="flex-1 mx-2">
            <div className="mb-6">
              <h1 className="hidden text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight mb-2">
                {activeCategory
                  ? `${activeCategory}`
                  : 'Catálogo de Herramientas Industriales'}
              </h1>
              <p className="hidden text-gray-600 text-sm md:text-base max-w-2xl">
                {pageDescription}
              </p>
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-matheo-blue text-white text-sm font-bold hover:bg-blue-700 transition-all active:scale-95"
                >
                  <SlidersHorizontal size={16} />
                  Filtros
                  {(selectedCategories.length > 0 ||
                    selectedBrands.length > 0) && (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  )}
                </button>
                <div className="lg:hidden flex bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'p-2 rounded-lg transition-all',
                      viewMode === 'grid'
                        ? 'bg-white shadow-sm text-matheo-blue'
                        : 'text-gray-400 hover:text-gray-600',
                    )}
                  >
                    <Grid3x3 size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'p-2 rounded-lg transition-all',
                      viewMode === 'list'
                        ? 'bg-white shadow-sm text-matheo-blue'
                        : 'text-gray-400 hover:text-gray-600',
                    )}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </div>
            <div
              className={cn(
                'grid gap-4 md:gap-6',
                viewMode === 'grid'
                  ? 'grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4'
                  : 'grid-cols-1 lg:grid-cols-2',
              )}
            >
              {paginatedProducts.map((product) => {
                const handleWhatsAppQuote = (prod: Product) => {
                  const message = encodeURIComponent(
                    `${prod.image}\n\n*${prod.name.toUpperCase()}*\n\nHola , quisiera cotizar su producto`,
                  )
                  window.open(
                    `https://wa.me/51922922766?text=${message}`,
                    '_blank',
                  )
                }

                return (
                  <CardProduct
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    onWhatsAppQuote={handleWhatsAppQuote}
                  />
                )
              })}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  onClick={() =>
                    setPage(Math.max(1, currentPage - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-xl bg-white border border-gray-100 shadow-sm text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>

                <div className="flex items-center gap-1">
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1
                    const shouldShow =
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 &&
                        page <= currentPage + 1)

                    if (!shouldShow) {
                      if (page === 2 || page === totalPages - 1) {
                        return (
                          <span
                            key={page}
                            className="px-1 text-gray-400"
                          >
                            ...
                          </span>
                        )
                      }
                      return null
                    }

                    return (
                      <button
                        key={page}
                        onClick={() => setPage(page)}
                        className={cn(
                          'w-10 h-10 rounded-xl font-bold transition-all',
                          currentPage === page
                            ? 'bg-matheo-blue text-white shadow-lg shadow-blue-200'
                            : 'bg-white text-gray-600 border border-gray-100 hover:bg-gray-50',
                        )}
                      >
                        {page}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() =>
                    setPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-xl bg-white border border-gray-100 shadow-sm text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-24 bg-gray-50 rounded-3xl">
                <Search
                  size={64}
                  className="mx-auto text-gray-200 mb-4"
                />
                <h3 className="text-2xl font-bold text-gray-700 mb-2">
                  Sin resultados
                </h3>
                <p className="text-gray-500">
                  Intenta con otros filtros o términos de búsqueda
                </p>
                <button
                  onClick={clearAllFilters}
                  className="mt-6 text-matheo-blue font-bold hover:underline"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </main>
        </div>

        {/* ── MOBILE FILTER DRAWER ── */}
        <div className="lg:hidden">
          {/* Backdrop */}
          <div
            className={cn(
              'fixed inset-0 z-50 bg-black/40 transition-opacity duration-300',
              isMobileFilterOpen
                ? 'opacity-100 pointer-events-auto'
                : 'opacity-0 pointer-events-none',
            )}
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer panel */}
          <div
            className={cn(
              'fixed right-0 top-0 bottom-0 z-50 w-full sm:w-96 bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col',
              isMobileFilterOpen
                ? 'translate-x-0'
                : 'translate-x-full',
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal
                  size={20}
                  className="text-matheo-blue"
                />
                <span className="font-bold text-lg text-matheo-blue">
                  Filtros
                </span>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
              >
                <X size={22} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {/* ── Categorías ── */}
              <div className="mb-4">
                <button
                  onClick={() =>
                    setExpandedFilters((p) => ({
                      ...p,
                      categories: !p.categories,
                    }))
                  }
                  className="w-full flex items-center justify-between py-3"
                >
                  <div className="flex items-center gap-3">
                    <LayoutGrid
                      size={20}
                      className="text-matheo-blue"
                      strokeWidth={1.5}
                    />
                    <span className="font-bold text-gray-900">
                      Categoría
                    </span>
                  </div>
                  <ChevronDown
                    size={18}
                    className={cn(
                      'text-gray-400 transition-transform duration-200',
                      expandedFilters.categories && 'rotate-180',
                    )}
                  />
                </button>

                <div
                  className={cn(
                    'overflow-hidden transition-all duration-200',
                    expandedFilters.categories
                      ? 'max-h-[9999px] pb-2'
                      : 'max-h-0',
                  )}
                >
                  <div className="space-y-0.5">
                    {dbCategories
                      .filter(
                        (cat) =>
                          !Object.values(subcategoryMap)
                            .flat()
                            .includes(cat),
                      )
                      .map((parentName) => {
                        const children =
                          subcategoryMap[parentName] || []
                        const isExpanded =
                          expandedParent === parentName

                        return (
                          <div key={parentName}>
                            <button
                              onClick={() => {
                                setExpandedParent((prev) =>
                                  prev === parentName
                                    ? null
                                    : parentName,
                                )
                              }}
                              className={`w-full flex items-center gap-2 py-2 rounded-lg transition-colors text-left ${
                                selectedCategories.includes(
                                  parentName,
                                )
                                  ? 'text-matheo-blue'
                                  : 'text-gray-600 hover:text-matheo-blue'
                              }`}
                            >
                              {children.length > 0 && (
                                <ChevronRight
                                  size={14}
                                  className={`shrink-0 transition-transform duration-200 ${
                                    isExpanded ? 'rotate-90' : ''
                                  } ${
                                    selectedCategories.includes(
                                      parentName,
                                    )
                                      ? 'text-matheo-blue'
                                      : 'text-gray-400'
                                  }`}
                                />
                              )}
                              {children.length === 0 && (
                                <div className="w-3.5 shrink-0" />
                              )}
                              <span className="text-sm font-bold">
                                {parentName}
                              </span>
                              {children.length > 0 && (
                                <span
                                  className={`text-xs ml-auto ${
                                    isExpanded
                                      ? 'text-matheo-blue'
                                      : 'text-gray-400'
                                  }`}
                                >
                                  {isExpanded ? '−' : '+'}
                                </span>
                              )}
                            </button>
                            <div
                              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                isExpanded
                                  ? 'max-h-96 opacity-100'
                                  : 'max-h-0 opacity-0'
                              }`}
                            >
                              <div className="ml-4 pl-3 border-l-2 border-gray-100 space-y-0.5">
                                {children.map((child) => (
                                  <label
                                    key={child}
                                    className="flex items-center gap-2 group cursor-pointer py-1.5 rounded-lg hover:bg-gray-50 px-2"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={selectedCategories.includes(
                                        child,
                                      )}
                                      onChange={() => {
                                        toggleCategory(child)
                                        setIsMobileFilterOpen(false)
                                      }}
                                      className="w-4 h-4 text-matheo-blue rounded border-2 border-gray-200 focus:ring-matheo-blue transition-all"
                                    />
                                    <span className="text-gray-600 group-hover:text-matheo-blue transition-colors text-sm font-medium">
                                      {child}
                                    </span>
                                  </label>
                                ))}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            {(selectedCategories.length > 0 ||
              selectedBrands.length > 0) && (
              <div className="shrink-0 border-t border-gray-100 px-5 py-4">
                <button
                  onClick={() => {
                    clearAllFilters()
                    setIsMobileFilterOpen(false)
                  }}
                  className="w-full py-2.5 rounded-xl bg-red-50 text-red-600 font-bold text-sm hover:bg-red-100 transition-colors"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
