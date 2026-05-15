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
  Tag,
} from 'lucide-react'
import { cn, generateSlug, slugToCategory } from '../lib/utils'
import { useCustomSearchParams } from '../hooks/useCustomSearchParams'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'
import CardProduct from '../components/CardProduct'
import FilterSection from '../components/FilterSection'

interface ProductsPageProps {
  categorySlug?: string
  subcategorySlug?: string
}

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

interface RawProduct {
  id: string
  name: string
  description: string
  image_url: string
  price?: number
  rating?: number
  categories?: { name: string } | null
  brands?: { name: string } | null
}

export default function ProductsPage({
  categorySlug,
  subcategorySlug,
}: ProductsPageProps) {
  const [searchParams, setSearchParams] = useCustomSearchParams()
  const searchTerm = searchParams.get('q') || ''
  const router = useRouter()

  const [products, setProducts] = useState<Product[]>([])
  const [dbCategories, setDbCategories] = useState<string[]>([])
  const [dbBrands, setDbBrands] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [parentNameMap, setParentNameMap] = useState<Record<string, string[]>>({})

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

  const [categorySearchTerm, setCategorySearchTerm] = useState('')
  const [brandSearchTerm, setBrandSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isDesktopView, setIsDesktopView] = useState(true)
  const [expandedFilters, setExpandedFilters] = useState({
    categories: !!searchParams.get('category') || false,
    brands: !!searchParams.get('brand') || false,
    price: false,
    rating: false,
  })
  const [expandedParents, setExpandedParents] = useState<string[]>([])
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
    async function fetchData() {
      setLoading(true)
      try {
        const { data: cats } = await supabase
          .from('categories')
          .select('id, name, parent_id')
          .order('name')

        if (cats) {
          const allCats = cats.map((c) => c.name)
          setDbCategories(allCats)

          const idToName: Record<string, string> = {}
          for (const c of cats) idToName[c.id] = c.name

          const childrenOf: Record<string, string[]> = {}
          const parents: string[] = []
          for (const c of cats) {
            if (c.parent_id) {
              const parentName = idToName[c.parent_id]
              if (parentName) {
                if (!childrenOf[parentName]) childrenOf[parentName] = []
                childrenOf[parentName].push(c.name)
              }
            } else {
              parents.push(c.name)
            }
          }
          setParentNameMap(childrenOf)

          if (subcategorySlug) {
            const resolved = slugToCategory(subcategorySlug, allCats)
            if (resolved) {
              setSelectedCategories([resolved])
              const parentName = Object.entries(childrenOf).find(([, children]) =>
                children.includes(resolved)
              )?.[0]
              if (parentName) setExpandedParents([parentName])
            }
          } else if (categorySlug) {
            const resolved = slugToCategory(categorySlug, allCats)
            if (resolved) {
              if (childrenOf[resolved]) {
                setExpandedParents([resolved])
              } else {
                setSelectedCategories([resolved])
              }
            }
          }
        }

        const { data: brandsData } = await supabase
          .from('brands')
          .select('name')
          .order('name')

        if (brandsData) {
          setDbBrands(brandsData.map((b) => b.name))
        }

        const { data: prods, error } = await supabase.from('products')
          .select(`
            id,
            name,
            description,
            image_url,
            price,
            rating,
            categories (name),
            brands (name)
          `)

        if (error) throw error

        if (prods) {
          const formatted = (prods as unknown as RawProduct[]).map(
            (p) => ({
              id: p.id,
              slug: generateSlug(p.name),
              categorySlug: generateSlug(
                p.categories?.name || 'General',
              ),
              name: p.name,
              description: p.description,
              image: p.image_url,
              price: p.price,
              rating: p.rating,
              category: p.categories?.name || 'General',
              brand: p.brands?.name || 'Varios',
            }),
          )
          setProducts(formatted)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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
        setExpandedParents((prev) =>
          prev.includes(category)
            ? prev.filter((p) => p !== category)
            : [...prev, category],
        )
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
        ? selectedBrands.filter((b) => b !== brand)
        : [...selectedBrands, brand]

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
    <div className="min-h-screen bg-gray-50/30 pt-32 md:pt-40 pb-20">
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="flex flex-col lg:flex-row gap-12">
            <aside className="w-full lg:w-80 shrink-0">
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden sticky top-32 animate-pulse">
                <div className="bg-gray-50/50 px-8 py-6 border-b border-gray-100">
                  <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="px-8 py-6 space-y-4">
                  <div className="h-10 bg-gray-200 rounded w-full mb-6"></div>
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-md bg-gray-200"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
            <main className="flex-1">
              <div className="mb-6 animate-pulse">
                <div className="h-8 md:h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="h-4 md:h-5 bg-gray-200 rounded w-2/3"></div>
              </div>
              <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col animate-pulse"
                  >
                    <div className="w-full aspect-square bg-gray-200 shrink-0"></div>
                    <div className="p-4 flex flex-col flex-1 h-50">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                      <div className="mt-auto space-y-2">
                        <div className="h-9 bg-gray-200 rounded"></div>
                        <div className="h-9 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            <aside className="w-full lg:w-80 shrink-0">
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden sticky top-32">
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
                    <div className="mb-4 relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400 group-focus-within:text-matheo-blue transition-colors" />
                      </div>
                      <input
                        type="text"
                        placeholder="Buscar categoría..."
                        value={categorySearchTerm}
                        onChange={(e) =>
                          setCategorySearchTerm(e.target.value)
                        }
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50/50 text-gray-600 placeholder-gray-400 appearance-none outline-none focus:border-gray-200"
                      />
                    </div>
                    <div className="space-y-1 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                      {dbCategories
                        .filter((cat) => !Object.values(subcategoryMap).flat().includes(cat))
                        .filter((cat) =>
                          cat
                            .toLowerCase()
                            .includes(
                              categorySearchTerm.toLowerCase(),
                            ),
                        )
                        .map((parentName) => {
                          const children = subcategoryMap[parentName] || []
                          const isExpanded = expandedParents.includes(parentName)
                          const hasFilteredChildren = children.some((child) =>
                            child.toLowerCase().includes(categorySearchTerm.toLowerCase()),
                          )
                          const showChildren = isExpanded && hasFilteredChildren

                          return (
                            <div key={parentName}>
                              <button
                                onClick={() => toggleCategory(parentName)}
                                className={`w-full flex items-center gap-2 py-1.5 rounded-lg transition-colors text-left ${
                                  selectedCategories.includes(parentName)
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
                                      selectedCategories.includes(parentName)
                                        ? 'text-matheo-blue'
                                        : 'text-gray-400'
                                    }`}
                                  />
                                )}
                                {children.length === 0 && <div className="w-3.5 shrink-0" />}
                                <span className="text-sm font-bold">{parentName}</span>
                                {children.length > 0 && (
                                  <span
                                    className={`text-xs ml-auto ${
                                      isExpanded ? 'text-matheo-blue' : 'text-gray-400'
                                    }`}
                                  >
                                    {isExpanded ? '−' : '+'}
                                  </span>
                                )}
                              </button>
                              {showChildren && (
                                <div className="ml-4 pl-3 border-l-2 border-gray-100 space-y-0.5">
                                  {children
                                    .filter((child) =>
                                      child.toLowerCase().includes(categorySearchTerm.toLowerCase()),
                                    )
                                    .map((child) => (
                                      <label
                                        key={child}
                                        className="flex items-center gap-2 group cursor-pointer py-1 rounded-lg hover:bg-gray-50 px-2"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={selectedCategories.includes(child)}
                                          onChange={() => toggleCategory(child)}
                                          className="w-4 h-4 text-matheo-blue rounded border-2 border-gray-200 focus:ring-matheo-blue transition-all"
                                        />
                                        <span className="text-gray-600 group-hover:text-matheo-blue transition-colors text-xs font-medium">
                                          {child}
                                        </span>
                                      </label>
                                    ))}
                                </div>
                              )}
                            </div>
                          )
                        })}
                    </div>
                  </FilterSection>

                  {/* Filtro Marca */}
                  <FilterSection
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
                    <div className="mb-4 relative group">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400 group-focus-within:text-matheo-blue transition-colors" />
                      </div>
                      <input
                        type="text"
                        placeholder="Buscar marca..."
                        value={brandSearchTerm}
                        onChange={(e) =>
                          setBrandSearchTerm(e.target.value)
                        }
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50/50 text-gray-600 placeholder-gray-400 appearance-none outline-none focus:border-gray-200"
                      />
                    </div>
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                      {dbBrands
                        .filter((brand) =>
                          brand
                            .toLowerCase()
                            .includes(brandSearchTerm.toLowerCase()),
                        )
                        .map((brand) => (
                          <label
                            key={brand}
                            className="flex items-center gap-3 group cursor-pointer"
                          >
                            <div className="relative flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedBrands.includes(
                                  brand,
                                )}
                                onChange={() => toggleBrand(brand)}
                                className="w-5 h-5 text-matheo-blue rounded-md border-2 border-gray-200 focus:ring-matheo-blue transition-all"
                              />
                            </div>
                            <span className="text-gray-600 group-hover:text-matheo-blue transition-colors text-sm font-bold">
                              {brand}
                            </span>
                          </label>
                        ))}
                    </div>
                  </FilterSection>
                </div>
              </div>
            </aside>

            <main className="flex-1">
              <div className="mb-6">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight mb-2">
                  {activeCategory
                    ? `Catálogo de ${activeCategory}`
                    : 'Catálogo de Herramientas Industriales'}
                </h1>
                <p className="text-gray-600 text-sm md:text-base max-w-2xl">
                  {pageDescription}
                </p>
              </div>

              <div className="flex justify-between items-center mb-6">
                <p className="text-gray-500 font-medium">
                  Encontramos{' '}
                  <span className="text-matheo-blue font-bold">
                    {filteredProducts.length}
                  </span>{' '}
                  productos
                </p>
                <div className="hidden sm:flex bg-gray-100 p-1 rounded-xl">
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

              <div
                className={cn(
                  'grid gap-4 md:gap-6',
                  viewMode === 'grid'
                    ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
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
        )}
      </div>
    </div>
  )
}
