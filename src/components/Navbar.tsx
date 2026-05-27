'use client'
import {
  Menu,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ArrowRight,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useCustomSearchParams } from '../hooks/useCustomSearchParams'
import Link from 'next/link'
import { cn, generateSlug } from '../lib/utils'
import { supabase } from '../lib/supabase'
import Image from 'next/image'

interface NavProductRow {
  id: string
  name: string
  image_url: string | null
  categories: { name: string } | { name: string }[] | null
}

interface NavProduct {
  id: string
  name: string
  image_url: string | null
  category: string
}

const navItems = [
  { name: 'Productos', href: '/productos', hasMega: 'productos' },
  { name: 'Categorías', href: '/productos', hasMega: 'categorias' },
  { name: 'Nosotros', href: '/nosotros' },
  { name: 'Contacto', href: '/contacto' },
  {
    name: 'Ver Catálogo 📙',
    href: '/catalogo.pdf',
    isExternal: true,
  },
]

interface SearchResult {
  id: string
  name: string
  brand: string
  category: string
  image?: string
}

interface SearchResultRaw {
  id: string
  name: string
  image_url?: string
  categories: { name: string } | { name: string }[] | null
  brands: { name: string } | { name: string }[] | null
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [searchParams, setSearchParams] = useCustomSearchParams()
  const [searchValue, setSearchValue] = useState(
    searchParams.get('q') || '',
  )
  const [searchResults, setSearchResults] = useState<SearchResult[]>(
    [],
  )
  const [categoryResults, setCategoryResults] = useState<
    { name: string; image: string | null }[]
  >([])
  const [categories, setCategories] = useState<
    { id: string; name: string; image: string | null; isParent: boolean }[]
  >([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isLoadingProducts, setIsLoadingProducts] = useState(true)
  const [activeMega, setActiveMega] = useState<string | null>(null)
  const [isCategoriasOpen, setIsCategoriasOpen] = useState(false)
  const [hoveredParentCat, setHoveredParentCat] = useState<
    string | null
  >(null)
  const [subcategoryMap, setSubcategoryMap] = useState<
    Record<string, { name: string; image: string | null }[]>
  >({})
  const [isMobileProdsOpen, setIsMobileProdsOpen] = useState(false)
  const [isMobileCatsOpen, setIsMobileCatsOpen] = useState(false)
  const [expandedMobileCat, setExpandedMobileCat] = useState<
    string | null
  >(null)
  const [products, setProducts] = useState<
    { id: string; name: string; image_url: string | null; category: string }[]
  >([])

  const promoMessages = [
    '🚀 Importador directo — sin intermediarios, mejor precio',
    '🔧 +150 productos en stock para entrega inmediata',
    '🏭 Herramientas de precisión para la industria metalmecánica',
    '📦 Despacho a todo el Perú — consulta disponibilidad',
    '⚙️ Brocas, fresas, insertos y más — catálogo completo disponible',
    '💼 Atención a empresas y talleres industriales',
    '📞 Cotiza ahora: ventas@matheocompany.com',
    '✅ Distribución al por mayor y menor',
  ]
  const [promoIndex, setPromoIndex] = useState(0)
  const [promoVisible, setPromoVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setPromoVisible(false)
      setTimeout(() => {
        setPromoIndex((prev) => (prev + 1) % promoMessages.length)
        setPromoVisible(true)
      }, 400)
    }, 4000)
    return () => clearInterval(interval)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )
  const catTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  )
  const searchTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null)
  const lastPushedSearch = useRef(searchParams.get('q') || '')

  const pathname = usePathname()
  const router = useRouter()

  const [prevLocation, setPrevLocation] = useState(pathname)
  if (pathname !== prevLocation) {
    setPrevLocation(pathname)
    setIsOpen(false)
    setActiveMega(null)
  }

  useEffect(() => {
    const currentQuery = searchParams.get('q') || ''
    if (currentQuery !== lastPushedSearch.current) {
      setSearchValue(currentQuery)
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
      setSearchResults([])
      setIsSearchExpanded(false)
      lastPushedSearch.current = currentQuery
    }
  }, [searchParams])

  const hasFetchedNav = useRef(false)
  const hasFetchedProducts = useRef(false)

  // Fetch categories and an example product image for each
  useEffect(() => {
    if (hasFetchedNav.current) return
    hasFetchedNav.current = true

    async function fetchNavData() {
      try {
        const { data: cats } = await supabase
          .from('categories')
          .select('id, name, parent_id')
          .order('name')

        if (cats) {
          const subcatNames = new Set(
            cats.filter((c) => c.parent_id).map((c) => c.name),
          )

          const { data: prods } = await supabase
            .from('products')
            .select('image_url, categories(name)')
            .not('image_url', 'is', null)

          const imgMap: Record<string, string> = {}
          if (prods) {
            prods.forEach(
              (p: {
                categories:
                  | { name: string }
                  | { name: string }[]
                  | null
                image_url: string
              }) => {
                const catName = Array.isArray(p.categories)
                  ? p.categories[0]?.name
                  : p.categories?.name

                if (catName && p.image_url && !imgMap[catName]) {
                  imgMap[catName] = p.image_url
                }
              },
            )
          }

          const idToName: Record<string, string> = {}
          cats.forEach(
            (c: { id?: string; name: string }) => {
              if (c.id) idToName[c.id] = c.name
            },
          )

          const subMap: Record<
            string,
            { name: string; image: string | null }[]
          > = {}
          cats.forEach(
            (c: {
              id?: string
              name: string
              parent_id?: string | null
            }) => {
              if (c.parent_id) {
                const parentName = idToName[c.parent_id]
                if (parentName) {
                  if (!subMap[parentName]) subMap[parentName] = []
                  subMap[parentName].push({
                    name: c.name,
                    image: imgMap[c.name] || null,
                  })
                }
              }
            },
          )
          setSubcategoryMap(subMap)

          setCategories(
            cats.map(
              (c: {
                id?: string
                name: string
                parent_id?: string | null
              }) => ({
                id: c.id ?? '',
                name: c.name,
                image: imgMap[c.name] || null,
                isParent: !subcatNames.has(c.name),
              }),
            ),
          )
        }
      } finally {
        setIsLoadingCategories(false)
      }
    }
    fetchNavData()
  }, [])

  // Fetch products for the Productos mega menu
  useEffect(() => {
    if (hasFetchedProducts.current) return
    hasFetchedProducts.current = true

    async function fetchProductsData() {
      try {
        let result: NavProduct[] = []

        const { data: featuredData } = await supabase
          .from('products')
          .select('id, name, image_url, categories(name)')
          .eq('featured', true)
          .not('image_url', 'is', null)
          .limit(12)

        if (featuredData) {
          result = featuredData.map((p: NavProductRow) => ({
            id: p.id,
            name: p.name,
            image_url: p.image_url,
            category: Array.isArray(p.categories)
              ? p.categories[0]?.name || ''
              : p.categories?.name || '',
          }))
        }

        if (result.length < 12) {
          const needed = 12 - result.length
          const excludeIds = result.map((p) => p.id)
          let fallbackData: NavProductRow[] | null

          if (excludeIds.length > 0) {
            const res = await supabase
              .from('products')
              .select('id, name, image_url, categories(name)')
              .not('image_url', 'is', null)
              .not('id', 'in', `(${excludeIds.join(',')})`)
              .limit(needed)
            fallbackData = res.data
          } else {
            const res = await supabase
              .from('products')
              .select('id, name, image_url, categories(name)')
              .not('image_url', 'is', null)
              .limit(needed)
            fallbackData = res.data
          }

          if (fallbackData) {
            result.push(
              ...fallbackData.map((p: NavProductRow) => ({
                id: p.id,
                name: p.name,
                image_url: p.image_url,
                category: Array.isArray(p.categories)
                  ? p.categories[0]?.name || ''
                  : p.categories?.name || '',
              })),
            )
          }
        }

        setProducts(result)
      } finally {
        setIsLoadingProducts(false)
      }
    }
    fetchProductsData()
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHome = pathname === '/'

  const handleMegaEnter = (target: string) => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current)
    setActiveMega(target)
  }

  const handleMegaLeave = () => {
    megaTimeout.current = setTimeout(() => setActiveMega(null), 150)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (pathname !== '/productos') {
      router.push(`/productos?q=${encodeURIComponent(searchValue)}`)
    } else {
      const params = new URLSearchParams(searchParams)
      if (searchValue) {
        params.set('q', searchValue)
      } else {
        params.delete('q')
      }
      lastPushedSearch.current = searchValue
      setSearchParams(params)
    }
  }

  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value
    setSearchValue(value)

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Filtrar categorías en el cliente (ya están cargadas)
    if (value.trim().length >= 2) {
      const lower = value.trim().toLowerCase()
      setCategoryResults(
        categories
          .filter((c) => c.name.toLowerCase().includes(lower))
          .slice(0, 4),
      )
    } else {
      setCategoryResults([])
    }

    searchTimeoutRef.current = setTimeout(async () => {
      if (value.length >= 2) {
        // ilike en Supabase/Postgres es case-insensitive por defecto
        const term = value.trim()
        try {
          const { data, error } = await supabase
            .from('products')
            .select(
              `id, name, image_url, brands (name), categories(name)`,
            )
            .or(`name.ilike.%${term}%,description.ilike.%${term}%`)
            .limit(6)

          if (data && !error) {
            setSearchResults(
              data.map((p: SearchResultRaw) => ({
                id: p.id,
                name: p.name,
                brand: Array.isArray(p.brands)
                  ? p.brands[0]?.name || ''
                  : p.brands?.name || '',
                category: Array.isArray(p.categories)
                  ? p.categories[0]?.name || ''
                  : p.categories?.name || '',
                image: p.image_url,
              })),
            )
          }
        } catch (err) {
          // ignore
        }
      } else {
        setSearchResults([])
        setCategoryResults([])
      }

      if (pathname === '/productos') {
        const params = new URLSearchParams(searchParams)
        if (value) {
          params.set('q', value)
        } else {
          params.delete('q')
        }
        lastPushedSearch.current = value
        setSearchParams(params, { replace: true })
      }
    }, 200) // 200ms debounce para resultados más rápidos
  }

  const handleResultClick = (
    productName: string,
    category: string,
  ) => {
    router.push(
      `/producto/${generateSlug(category)}/${generateSlug(productName)}`,
    )
    setSearchResults([])
    setCategoryResults([])
    setSearchValue('')
    setIsSearchExpanded(false)
    setIsOpen(false)
  }

  const handleCategoryClick = (catName: string) => {
    router.push(`/productos/${generateSlug(catName)}`)
    setSearchResults([])
    setCategoryResults([])
    setSearchValue('')
    setIsSearchExpanded(false)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      const desktopSearch = document.getElementById(
        'navbar-search-wrapper-desktop',
      )
      const mobileSearch = document.getElementById(
        'navbar-search-wrapper-mobile',
      )
      const isInsideDesktop = desktopSearch?.contains(target) ?? false
      const isInsideMobile = mobileSearch?.contains(target) ?? false
      if (!isInsideDesktop && !isInsideMobile) {
        setSearchResults([])
        setCategoryResults([])
      }
    }
    window.addEventListener('mousedown', handleClickOutside)
    return () =>
      window.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled || !isHome
          ? 'bg-white shadow-lg'
          : 'bg-white/95 backdrop-blur-sm',
      )}
    >
      {/* Top Bar */}
      <div className="bg-matheo-red text-white py-2 min-h-9 flex items-center">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm relative">
          <div className="hidden mlg:flex items-center gap-4 z-10">
            <a
              href="/redes"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-matheo-blue transition-colors flex items-center gap-1.5 opacity-90 hover:opacity-100"
              aria-label="Redes Sociales"
            >
              <span className="text-[11px] font-medium tracking-wide underline underline-offset-2">
                Nuestras Redes Sociales
              </span>
            </a>
          </div>

          <div
            className="hidden mlg:block text-xs select-none text-center absolute left-0 right-0 pointer-events-none"
            style={{
              opacity: promoVisible ? 1 : 0,
              transform: promoVisible
                ? 'translateY(0)'
                : 'translateY(-4px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            {promoMessages[promoIndex]}
          </div>

          <div className="hidden mlg:block w-32"></div>

          <div
            className="mlg:hidden text-[11px] select-none text-center w-full pl-3"
            style={{
              opacity: promoVisible ? 1 : 0,
              transform: promoVisible
                ? 'translateY(0)'
                : 'translateY(-4px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            {promoMessages[promoIndex]}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        {/* ── MOBILE LAYOUT ── */}
        <div className="flex items-center justify-between mlg:hidden h-20 relative">
          {/* Mobile Search State - ACTIVE */}
          {isSearchExpanded ? (
            <div className="flex items-center w-full gap-3 animate-in fade-in slide-in-from-right-4 duration-300">
              <button
                onClick={() => {
                  setIsSearchExpanded(false)
                  setSearchResults([])
                  setSearchValue('')
                }}
                className="p-2 text-matheo-red hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChevronLeft size={28} />
              </button>
              <div
                id="navbar-search-wrapper-mobile"
                className="relative flex-1"
              >
                <form
                  onSubmit={handleSearch}
                  className="relative group"
                >
                  <input
                    type="text"
                    autoFocus
                    placeholder="Buscar productos..."
                    value={searchValue}
                    onChange={handleSearchChange}
                    className="w-full pl-4 pr-10 py-2.5 bg-white border-2 border-matheo-red/20 rounded-xl focus:border-matheo-red focus:outline-none transition-all text-sm"
                  />
                  <Search
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-matheo-red"
                    size={20}
                  />
                </form>
                {searchValue && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchValue('')
                      setSearchResults([])
                      setCategoryResults([])
                    }}
                    className="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 hover:text-matheo-red transition-colors p-0.5"
                    aria-label="Borrar búsqueda"
                  >
                    <X size={18} />
                  </button>
                )}
                {(searchResults.length > 0 ||
                  categoryResults.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-60">
                    {categoryResults.length > 0 && (
                      <>
                        <div className="px-3 pt-2 pb-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-matheo-blue">
                            Categorías
                          </span>
                        </div>
                        {categoryResults.map((cat) => (
                          <button
                            key={cat.name}
                            onClick={() =>
                              handleCategoryClick(cat.name)
                            }
                            className="w-full text-left px-3 py-1.5 hover:bg-blue-50/60 flex items-center gap-2 transition-colors"
                          >
                            <div className="w-6 h-6 rounded border border-gray-100 bg-white flex items-center justify-center shrink-0 overflow-hidden">
                              {cat.image ? (
                                <Image
                                  width={40}
                                  height={40}
                                  src={cat.image}
                                  alt={cat.name}
                                  className="w-full h-full object-contain mix-blend-multiply"
                                />
                              ) : (
                                <span className="text-xs">🗂️</span>
                              )}
                            </div>
                            <span className="text-sm font-semibold text-matheo-blue truncate min-w-0">
                              {cat.name}
                            </span>
                          </button>
                        ))}
                        {searchResults.length > 0 && (
                          <div className="mx-3 border-t border-gray-100" />
                        )}
                      </>
                    )}
                    {searchResults.length > 0 && (
                      <>
                        <div className="px-3 pt-2 pb-0.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            Productos
                          </span>
                        </div>
                        {searchResults.map((product) => (
                          <button
                            key={product.id}
                            onClick={() =>
                              handleResultClick(
                                product.name,
                                product.category,
                              )
                            }
                            className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-50 last:border-0 transition-colors"
                          >
                            {product.image ? (
                              <div className="w-6 h-6 rounded border border-gray-100 bg-white flex items-center justify-center shrink-0 overflow-hidden">
                                <Image
                                  width={40}
                                  height={40}
                                  src={product.image}
                                  alt={product.name}
                                  className="w-full h-full object-contain mix-blend-multiply"
                                />
                              </div>
                            ) : (
                              <div className="w-6 h-6 rounded border border-transparent flex items-center justify-center shrink-0">
                                <Search
                                  size={14}
                                  className="text-gray-400"
                                />
                              </div>
                            )}
                            <span className="text-sm font-medium text-gray-700 truncate min-w-0">
                              {product.name}
                            </span>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-matheo-red"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>

              <Link
                href={'/'}
                className="absolute left-1/2 -translate-x-1/2 shrink-0"
              >
                <Image
                  width={100}
                  height={100}
                  src="https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774823626/MATHEO_logo_qneg7d.svg"
                  alt="MATHEO Industrial Company"
                  className="h-16 w-auto cursor-pointer hover:opacity-90 transition-opacity"
                />
              </Link>

              <button
                id="navbar-search-mobile-btn"
                onClick={() => {
                  setIsSearchExpanded(true)
                  setIsOpen(false)
                }}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-matheo-red"
                aria-label="Buscar productos"
              >
                <Search size={28} />
              </button>
            </>
          )}
        </div>

        {/* ── DESKTOP LAYOUT ── */}
        <div className="hidden mlg:flex items-center h-20">
          {/* Left: Logo + Categorías */}
          <div className="flex items-center gap-6 shrink-0">
            <Link href={'/'}>
              <Image
                width={100}
                height={100}
                src="https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774823626/MATHEO_logo_qneg7d.svg"
                alt="MATHEO Industrial Company"
                className="h-14 w-auto cursor-pointer hover:opacity-90 transition-opacity"
              />
            </Link>
            <div
              className="relative"
              onMouseEnter={() => {
                if (catTimeout.current) clearTimeout(catTimeout.current)
                setIsCategoriasOpen(true)
              }}
              onMouseLeave={() => {
                catTimeout.current = setTimeout(() => {
                  setIsCategoriasOpen(false)
                  setHoveredParentCat(null)
                }, 150)
              }}
            >
              <button
                className={cn(
                  'flex items-center gap-1 py-1 font-medium transition-colors',
                  isCategoriasOpen
                    ? 'text-matheo-red'
                    : 'text-gray-700 hover:text-matheo-red',
                )}
              >
                Categorías
                <ChevronDown
                  size={16}
                  className={cn(
                    'transition-transform duration-200',
                    isCategoriasOpen && 'rotate-180',
                  )}
                />
              </button>

              {isCategoriasOpen && (
                <div className="absolute top-full left-0 mt-1 min-w-55 bg-white border border-gray-200 shadow-2xl z-50 py-2">
                  {isLoadingCategories
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={`cat-sk-${i}`}
                          className="h-9 mx-2 bg-gray-100 rounded-lg animate-pulse"
                        />
                      ))
                    : categories
                        .filter((c) => c.isParent)
                        .slice(0, 15)
                        .map((cat) => {
                          const subs = subcategoryMap[cat.name]
                          const hasSub = subs?.length > 0
                          return (
                            <div
                              key={cat.name}
                              className="relative px-2 rounded-lg hover:bg-gray-50 transition-colors"
                              onMouseEnter={() =>
                                setHoveredParentCat(cat.name)
                              }
                            >
                              <Link
                                href={`/productos/${generateSlug(cat.name)}`}
                                onClick={() => {
                                  setIsCategoriasOpen(false)
                                  setActiveMega(null)
                                }}
                                className="flex items-center justify-between px-3 py-2 text-sm text-gray-700 hover:text-matheo-blue transition-colors"
                              >
                                <span className="font-medium">
                                  {cat.name}
                                </span>
                                {hasSub && (
                                  <ChevronRight
                                    size={14}
                                    className="shrink-0 text-gray-300"
                                  />
                                )}
                              </Link>

                              {/* Sub-flyout */}
                              {hasSub &&
                                hoveredParentCat === cat.name && (
                                  <div
                                    className="absolute left-full top-0 ml-1 min-w-50 bg-white border border-gray-200 shadow-2xl z-50 py-2"
                                    onMouseEnter={() =>
                                      setHoveredParentCat(cat.name)
                                    }
                                  >
                                    {subs.map((sub) => (
                                      <Link
                                        key={sub.name}
                                        href={`/productos/${generateSlug(sub.name)}`}
                                        onClick={() => {
                                          setIsCategoriasOpen(false)
                                          setActiveMega(null)
                                        }}
                                        className="block px-4 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-matheo-blue transition-colors"
                                      >
                                        {sub.name}
                                      </Link>
                                    ))}
                                  </div>
                                )}
                            </div>
                          )
                        })}

                  {!isLoadingCategories && (
                    <>
                      <hr className="my-2 mx-2 border-gray-100" />
                      <div className="px-2">
                        <Link
                          href="/productos"
                          onClick={() => {
                            setIsCategoriasOpen(false)
                            setActiveMega(null)
                          }}
                          className="block px-3 py-2 text-sm font-semibold text-matheo-blue hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          Conoce más categorías
                        </Link>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Center: Search Bar */}
          <div className="flex-1 flex justify-center px-8">
            <div
              id="navbar-search-wrapper-desktop"
              className="relative w-full max-w-sm"
            >
              <form
                onSubmit={handleSearch}
                className="relative w-full group"
              >
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-matheo-red transition-colors"
                  size={18}
                />
                <input
                  id="navbar-search-desktop"
                  type="text"
                  placeholder="¿Qué herramienta buscas?"
                  value={searchValue}
                  onChange={handleSearchChange}
                  className="w-full pl-11 pr-10 py-2.5 bg-white border-2 border-gray-200 rounded-xl focus:border-matheo-red focus:shadow-lg focus:shadow-matheo-red/10 focus:outline-none transition-all text-sm font-medium shadow-sm"
                />
                {searchValue && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchValue('')
                      setSearchResults([])
                      setCategoryResults([])
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-matheo-red transition-colors p-0.5"
                    aria-label="Borrar búsqueda"
                  >
                    <X size={16} />
                  </button>
                )}
              </form>
              {(searchResults.length > 0 ||
                categoryResults.length > 0) && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-60">
                  {categoryResults.length > 0 && (
                    <>
                      <div className="px-3 pt-2 pb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-matheo-blue">
                          Categorías
                        </span>
                      </div>
                      {categoryResults.map((cat) => (
                        <button
                          key={cat.name}
                          onClick={() =>
                            handleCategoryClick(cat.name)
                          }
                          className="w-full text-left px-3 py-1.5 hover:bg-blue-50/60 flex items-center gap-2 transition-colors"
                        >
                          <div className="w-6 h-6 rounded border border-gray-100 bg-white flex items-center justify-center shrink-0 overflow-hidden">
                            {cat.image ? (
                              <Image
                                width={40}
                                height={40}
                                src={cat.image}
                                alt={cat.name}
                                className="w-full h-full object-contain mix-blend-multiply"
                              />
                            ) : (
                              <span className="text-xs">🗂️</span>
                            )}
                          </div>
                          <span className="text-sm font-semibold text-matheo-blue truncate min-w-0 flex-1">
                            {cat.name}
                          </span>
                        </button>
                      ))}
                      {searchResults.length > 0 && (
                        <div className="mx-3 border-t border-gray-100" />
                      )}
                    </>
                  )}
                  {searchResults.length > 0 && (
                    <>
                      <div className="px-3 pt-2 pb-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                          Productos
                        </span>
                      </div>
                      {searchResults.map((product) => (
                        <button
                          key={product.id}
                          onClick={() =>
                            handleResultClick(
                              product.name,
                              product.category,
                            )
                          }
                          className="w-full text-left px-3 py-1.5 hover:bg-gray-50 flex items-center gap-2 border-b border-gray-50 last:border-0 transition-colors"
                        >
                          {product.image ? (
                            <div className="w-6 h-6 rounded border border-gray-100 bg-white flex items-center justify-center shrink-0 overflow-hidden">
                              <Image
                                width={40}
                                height={40}
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain mix-blend-multiply"
                              />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded flex items-center justify-center shrink-0">
                              <Search
                                size={14}
                                className="text-gray-400"
                              />
                            </div>
                          )}
                          <span className="text-sm font-medium text-gray-700 truncate min-w-0 flex-1">
                            {product.name}
                          </span>
                        </button>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Inicio, Productos, Nosotros, Contacto, Ver Catálogo */}
          <div className="flex items-center gap-6 shrink-0">
            {navItems
              .filter((i) => i.name !== 'Categorías')
              .map((item) => {
                if (item.hasMega) {
                  return (
                    <div
                      key={item.name}
                      className="relative"
                      onMouseEnter={() =>
                        handleMegaEnter(item.hasMega!)
                      }
                      onMouseLeave={handleMegaLeave}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center gap-1 text-gray-700 hover:text-matheo-red font-medium transition-colors relative group py-1',
                          pathname === item.href &&
                            'text-matheo-red',
                        )}
                      >
                        {item.name}
                        <ChevronDown
                          size={16}
                          className={cn(
                            'transition-transform duration-200',
                            activeMega === item.hasMega
                              ? 'rotate-180 text-matheo-red'
                              : '',
                          )}
                        />
                        <span
                          className={cn(
                            'absolute bottom-0 left-0 h-0.5 bg-matheo-red transition-all group-hover:w-full',
                            pathname === item.href
                              ? 'w-full'
                              : 'w-0',
                          )}
                        />
                      </Link>
                    </div>
                  )
                }

                if (item.name === 'Ver Catálogo 📙') {
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 hover:text-matheo-red font-medium transition-colors relative group whitespace-nowrap"
                    >
                      {item.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-matheo-red transition-all group-hover:w-full" />
                    </a>
                  )
                }

                if (item.href.includes('#')) {
                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      className="text-gray-700 hover:text-matheo-red font-medium transition-colors relative group"
                    >
                      {item.name}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-matheo-red transition-all group-hover:w-full" />
                    </a>
                  )
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'text-gray-700 hover:text-matheo-red font-medium transition-colors relative group',
                      pathname === item.href &&
                        'text-matheo-red',
                    )}
                  >
                    {item.name}
                    <span
                      className={cn(
                        'absolute bottom-0 left-0 h-0.5 bg-matheo-red transition-all group-hover:w-full',
                        pathname === item.href
                          ? 'w-full'
                          : 'w-0',
                      )}
                    />
                  </Link>
                )
              })}
          </div>
        </div>
      </div>

      {/* ── MEGA MENU: Productos ── */}
      <div
        onMouseEnter={() => handleMegaEnter('productos')}
        onMouseLeave={handleMegaLeave}
        className={cn(
          'hidden mlg:block absolute left-0 right-0 bg-white border-t border-gray-100 shadow-2xl z-40 overflow-hidden transition-all duration-300 ease-in-out',
          activeMega === 'productos'
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none',
        )}
        style={{ top: '100%' }}
      >
        <div className="container mx-auto px-6 py-8">
          <div className="flex gap-8">
            <div className="flex-1 flex flex-col gap-4">
              <span className="text-xs font-black uppercase tracking-widest text-matheo-red">
                Destacados
              </span>
              <div className="max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                <div className="grid grid-cols-1 mlg:grid-cols-2 xl:grid-cols-3 gap-4 mt-1">
                  {isLoadingProducts
                    ? Array.from({ length: 9 }).map((_, i) => (
                        <div
                          key={`prod-skeleton-${i}`}
                          className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 animate-pulse"
                        >
                          <div className="w-14 h-14 shrink-0 rounded-2xl bg-gray-200"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                          </div>
                        </div>
                      ))
                    : products.slice(0, 12).map((prod) => (
                        <Link
                          key={prod.id}
                          href={`/producto/${generateSlug(prod.category)}/${generateSlug(prod.name)}`}
                          onClick={() => setActiveMega(null)}
                          className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-matheo-red/30 hover:bg-red-50/50 transition-all duration-300 hover:shadow-xl hover:shadow-red-900/5 hover:-translate-y-0.5"
                        >
                          <div className="w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center bg-white border border-gray-100 p-1.5 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300 overflow-hidden">
                            {prod.image_url ? (
                              <Image
                                width={100}
                                height={100}
                                src={prod.image_url}
                                alt={prod.name}
                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                              />
                            ) : (
                              <span className="text-xl">🔧</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="block font-bold text-gray-800 text-sm group-hover:text-matheo-red transition-colors truncate leading-tight">
                              {prod.name}
                            </span>
                          </div>
                        </Link>
                      ))}
                </div>
              </div>
            </div>

            <div className="w-px bg-gray-100 self-stretch" />

            <div className="w-52 shrink-0 flex flex-col justify-start gap-5">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-black uppercase tracking-widest text-matheo-red">
                    Productos
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                  Productos destacados de nuestra línea de herramientas
                  industriales y de precisión.
                </p>
              </div>

              <Link
                href="/productos"
                onClick={() => setActiveMega(null)}
                className="group inline-flex items-center justify-center gap-2 w-full bg-matheo-red hover:bg-red-800 text-white font-bold text-sm py-3 px-5 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Ver todos los productos
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <a
                href="/catalogo.pdf"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setActiveMega(null)}
                className="group inline-flex items-center justify-center gap-2 w-full bg-white text-matheo-red border-2 border-matheo-red hover:bg-red-50 font-bold text-sm py-2.5 px-5 rounded-xl transition-all"
              >
                Descargar en PDF
              </a>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  <span className="font-bold text-matheo-red">
                    {products.length}
                  </span>{' '}
                  productos destacados
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Importador y distribuidor de herramientas
                  industriales
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </nav>

      {/* ── BACKDROP ── */}
      <div
        className={cn(
          'fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 mlg:hidden',
          isOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none',
        )}
        onClick={() => setIsOpen(false)}
      />

      {/* ── MOBILE DRAWER (left) ── */}
      <div
        className={cn(
          'fixed left-0 top-0 bottom-0 z-50 w-full sm:w-96 bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col mlg:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <span className="font-bold text-lg text-matheo-blue">Menú</span>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
          {navItems.map((item) => {
            if (item.hasMega === 'productos') {
              return (
                <div key={item.name}>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex-1 py-3 px-4 text-gray-700 hover:text-matheo-red hover:bg-gray-50 rounded-lg transition-colors font-medium',
                        pathname === item.href &&
                          'text-matheo-red bg-gray-50',
                      )}
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() =>
                        setIsMobileProdsOpen(!isMobileProdsOpen)
                      }
                      className="p-3 text-gray-500 hover:text-matheo-red transition-colors"
                      aria-label="Ver productos"
                    >
                      <ChevronDown
                        size={18}
                        className={cn(
                          'transition-transform duration-300',
                          isMobileProdsOpen && 'rotate-180',
                        )}
                      />
                    </button>
                  </div>

                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-300',
                      isMobileProdsOpen
                        ? 'max-h-150 mb-2'
                        : 'max-h-0',
                    )}
                  >
                    <div className="ml-4 pl-4 border-l-2 border-matheo-red/20 space-y-1 py-2">
                      {isLoadingProducts
                        ? Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={`mob-prod-skeleton-${i}`}
                              className="flex items-center gap-3 py-2 px-3 animate-pulse"
                            >
                              <div className="w-6 h-6 shrink-0 rounded bg-gray-200"></div>
                              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                          ))
                        : products.slice(0, 10).map((prod) => (
                            <Link
                              key={prod.id}
                              href={`/producto/${generateSlug(prod.category)}/${generateSlug(prod.name)}`}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-3 py-2 px-3 text-sm text-gray-600 hover:text-matheo-red hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <div className="w-6 h-6 shrink-0 flex items-center justify-center overflow-hidden">
                                {prod.image_url ? (
                                  <Image
                                    width={100}
                                    height={100}
                                    src={prod.image_url}
                                    alt={prod.name}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <span className="text-base">🔧</span>
                                )}
                              </div>
                              <span className="font-medium">
                                {prod.name}
                              </span>
                            </Link>
                          ))}
                    </div>
                  </div>
                </div>
              )
            }

            if (item.hasMega === 'categorias') {
              return (
                <div key={item.name}>
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex-1 py-3 px-4 text-gray-700 hover:text-matheo-red hover:bg-gray-50 rounded-lg transition-colors font-medium',
                        pathname === item.href &&
                          'text-matheo-red bg-gray-50',
                      )}
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() =>
                        setIsMobileCatsOpen(!isMobileCatsOpen)
                      }
                      className="p-3 text-gray-500 hover:text-matheo-red transition-colors"
                      aria-label="Ver categorías"
                    >
                      <ChevronDown
                        size={18}
                        className={cn(
                          'transition-transform duration-300',
                          isMobileCatsOpen && 'rotate-180',
                        )}
                      />
                    </button>
                  </div>

                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-300',
                      isMobileCatsOpen
                        ? 'max-h-150 mb-2'
                        : 'max-h-0',
                    )}
                  >
                    <div className="ml-4 pl-4 border-l-2 border-matheo-blue/20 space-y-1 py-2">
                      {isLoadingCategories
                        ? Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={`mob-cat-skeleton-${i}`}
                              className="flex items-center gap-3 py-2 px-3 animate-pulse"
                            >
                              <div className="w-6 h-6 shrink-0 rounded bg-gray-200"></div>
                              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                          ))
                        : categories.filter((c) => c.isParent).slice(0, 15).map((cat) => {
                            const subs = subcategoryMap[cat.name]
                            const hasSub = subs?.length > 0
                            return (
                              <div key={cat.name}>
                                <div className="flex items-center">
                                  <Link
                                    href={`/productos/${generateSlug(cat.name)}`}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center gap-3 py-2 px-3 text-sm text-gray-600 hover:text-matheo-blue hover:bg-blue-50 rounded-lg transition-colors flex-1"
                                  >
                                    <div className="w-6 h-6 shrink-0 flex items-center justify-center overflow-hidden">
                                      {cat.image ? (
                                        <Image
                                          width={100}
                                          height={100}
                                          src={cat.image}
                                          alt={cat.name}
                                          className="w-full h-full object-contain"
                                        />
                                      ) : (
                                        <div className="h-3 w-3 rounded-full bg-green-400 shadow-[0_0_8px_2px_rgba(74,222,128,0.6)]" />
                                      )}
                                    </div>
                                    <span className="font-medium">
                                      {cat.name}
                                    </span>
                                  </Link>
                                  {hasSub && (
                                    <button
                                      onClick={() =>
                                        setExpandedMobileCat(
                                          expandedMobileCat === cat.name
                                            ? null
                                            : cat.name,
                                        )
                                      }
                                      className="p-2 text-gray-500 hover:text-matheo-red transition-colors"
                                      aria-label="Ver subcategorías"
                                    >
                                      <ChevronDown
                                        size={16}
                                        className={cn(
                                          'transition-transform duration-300',
                                          expandedMobileCat === cat.name &&
                                            'rotate-180',
                                        )}
                                      />
                                    </button>
                                  )}
                                </div>
                                {hasSub &&
                                  expandedMobileCat === cat.name && (
                                    <div className="ml-4 pl-4 border-l-2 border-gray-100 space-y-0.5 py-1 mb-1">
                                      {subs.map((sub) => (
                                        <Link
                                          key={sub.name}
                                          href={`/productos/${generateSlug(sub.name)}`}
                                          onClick={() => setIsOpen(false)}
                                          className="block py-1.5 px-3 text-sm text-gray-500 hover:text-matheo-blue hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                          {sub.name}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                              </div>
                            )
                          })}
                    </div>
                  </div>
                </div>
              )
            }

            const isHashLink = item.href.includes('#')
            if (isHashLink || item.isExternal) {
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  target={item.isExternal ? '_blank' : undefined}
                  rel={
                    item.isExternal
                      ? 'noopener noreferrer'
                      : undefined
                  }
                  className="block py-3 text-gray-700 hover:text-matheo-red hover:bg-gray-50 px-4 rounded-lg transition-colors"
                >
                  {item.name}
                </a>
              )
            }
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'block py-3 text-gray-700 hover:text-matheo-red hover:bg-gray-50 px-4 rounded-lg transition-colors',
                  pathname === item.href &&
                    'text-matheo-red bg-gray-50',
                )}
              >
                {item.name}
              </Link>
            )
          })}

          {/* Social Links */}
          <div className="flex items-center gap-4 px-4 py-4 mt-2 border-t border-gray-100">
            <a
              href="https://www.facebook.com/IndustrialCompanyMatheo"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-50 text-gray-600 hover:text-white hover:bg-matheo-red rounded-lg flex items-center justify-center transition-colors shadow-sm border border-gray-100"
              aria-label="Facebook"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a
              href="https://www.tiktok.com/@industrialcompanymatheo"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 bg-gray-50 text-gray-600 hover:text-white hover:bg-matheo-red rounded-lg flex items-center justify-center transition-colors shadow-sm border border-gray-100"
              aria-label="TikTok"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
