'use client'
import {
  Menu,
  X,
  Search,
  ChevronLeft,
  ChevronDown,
  Mail,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useCustomSearchParams } from '@/hooks/useCustomSearchParams'
import Link from 'next/link'
import { cn, generateSlug } from '@/lib/utils'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { Marquee } from '@/components/ui/marquee'

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
  { name: 'Inicio', href: '/' },
  { name: 'Productos', href: '/productos' },
  { name: 'Categorías', href: '/categorias', hasMega: 'categorias' },
  { name: 'Marcas', href: '/marcas' },
  { name: 'Favoritos', href: '/favoritos' },
  { name: 'Nosotros', href: '/nosotros' },
  { name: 'Contacto', href: '/contacto' },
  { name: 'Ver Catálogo 📙', href: '/catalogo.pdf' },
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

  const [subcategoryMap, setSubcategoryMap] = useState<
    Record<string, { name: string; image: string | null }[]>
  >({})
  const [isMobileProdsOpen, setIsMobileProdsOpen] = useState(false)
  const [isMobileCatsOpen, setIsMobileCatsOpen] = useState(false)
  const [isMobileMarcasOpen, setIsMobileMarcasOpen] = useState(false)
  const [expandedMobileCat, setExpandedMobileCat] = useState<
    string | null
  >(null)
  const [products, setProducts] = useState<
    { id: string; name: string; image_url: string | null; category: string }[]
  >([])
  const [dbBrands, setDbBrands] = useState<{ name: string; image: string | null }[]>([])
  const [allProductNames, setAllProductNames] = useState<string[]>([])

  const searchTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null)
  const lastPushedSearch = useRef(searchParams.get('q') || '')

  const pathname = usePathname()
  const router = useRouter()

  const [prevLocation, setPrevLocation] = useState(pathname)
  const [favCount, setFavCount] = useState(0)
  if (pathname !== prevLocation) {
    setPrevLocation(pathname)
    setIsOpen(false)
  }

  useEffect(() => {
    function updateFavCount() {
      try {
        const stored = localStorage.getItem('favorites')
        const ids: string[] = stored ? JSON.parse(stored) : []
        setFavCount(ids.length)
      } catch { setFavCount(0) }
    }
    updateFavCount()
    window.addEventListener('storage', updateFavCount)
    window.addEventListener('favoritesUpdated', updateFavCount)
    return () => {
      window.removeEventListener('storage', updateFavCount)
      window.removeEventListener('favoritesUpdated', updateFavCount)
    }
  }, [])

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

        const { data: brandsData } = await supabase
          .from('brands')
          .select('name, image_url')
          .order('name')

        if (brandsData) {
          setDbBrands(brandsData.map((b) => ({ name: b.name, image: b.image_url ?? null })))
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

  const hasFetchedNames = useRef(false)
  useEffect(() => {
    if (hasFetchedNames.current) return
    hasFetchedNames.current = true
    supabase
      .from('categories')
      .select('name')
      .not('parent_id', 'is', null)
      .order('name')
      .then(({ data }) => {
        if (data) setAllProductNames(data.map((c) => c.name))
      })
  }, [])

  const isHome = pathname === '/'

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
            .ilike('name', `%${term}%`)
            .limit(10)

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
          'sticky top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled || !isHome
            ? 'bg-white shadow-lg'
            : 'bg-white/95 backdrop-blur-sm',
        )}
      >
        {/* Red Top Bar */}
        <div className="bg-matheo-red text-white font-medium w-full overflow-hidden">
          <Marquee pauseOnHover repeat={3} className="py-1.5 [--duration:180s] [--gap:0px]">
            {allProductNames.length > 0
              ? allProductNames.map((name) => (
                  <span key={name} className="flex items-center gap-0 mx-4">
                    <span className="text-white/70 mx-2">•</span>
                    <Link
                      href={`/productos/${generateSlug(name)}`}
                      className="text-sm font-semibold tracking-wide hover:text-white/80 transition-colors"
                    >
                      {name}
                    </Link>
                  </span>
                ))
              : Array.from({ length: 6 }).map((_, i) => (
                  <span key={i} className="text-sm font-semibold tracking-wide text-white/60 mx-4">
                    Cargando categorías...
                  </span>
                ))}
          </Marquee>
        </div>

        {/* White Bar: Logo, Search, Email, Social */}
        <div className="bg-white border-b border-gray-100">
          <div className="container mx-auto px-4">
            {/* ── MOBILE LAYOUT ── */}
            <div className="flex items-center justify-between mlg:hidden h-20 relative">
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
                        className="w-full pl-4 pr-10 py-2.5 bg-white border-2 border-matheo-red/20 focus:border-matheo-red focus:outline-none transition-all text-sm"
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
                                    <span className="text-xs">
                                      🗂️
                                    </span>
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
                      alt="Industrial Company MATHEO"
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

            <div className="hidden mlg:flex items-center justify-center h-24 ">
              {/* Logo */}
              <Link href={'/'} className="shrink-0">
                <Image
                  width={100}
                  height={100}
                  src="https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774823626/MATHEO_logo_qneg7d.svg"
                  alt="Industrial Company MATHEO"
                  className="h-20 w-auto cursor-pointer hover:opacity-90 transition-opacity"
                />
              </Link>

              {/* Search */}
              <div className="flex-1 flex justify-center max-w-lg mx-6">
                <div
                  id="navbar-search-wrapper-desktop"
                  className="relative w-full"
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
                      className="w-full pl-11 pr-10 py-2 bg-white border-2 border-gray-200 focus:border-matheo-red focus:shadow-lg focus:shadow-matheo-red/10 focus:outline-none transition-all text-sm font-medium shadow-sm"
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

              {/* Email */}
              <div className="hidden xl:flex items-center gap-3 shrink-0 ml-2">
                <div className="w-10 h-10 rounded-full bg-white border-2 border-matheo-red text-matheo-red hover:bg-matheo-red hover:text-white flex items-center justify-center shrink-0 transition-all duration-300">
                  <Mail size={16} />
                </div>
                <div className="flex flex-col leading-tight">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Escribenos
                  </span>
                  <a
                    href="mailto:ventas@matheocompany.com"
                    className="text-xs font-semibold text-gray-700 hover:text-matheo-red transition-colors"
                  >
                    ventas@matheocompany.com
                  </a>
                </div>
              </div>

              {/* Separator */}
              <div className="hidden xl:block w-px h-8 bg-gray-300 ml-4 shrink-0"></div>

              {/* Social Icons + Text */}
              <div className="hidden xl:flex items-center gap-2 shrink-0 ml-4">
                <a
                  href="https://www.facebook.com/IndustrialCompanyMatheo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white border-2 border-matheo-red text-matheo-red hover:bg-matheo-red hover:text-white flex items-center justify-center transition-all duration-300"
                  aria-label="Facebook"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@industrialcompanymatheo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-white border-2 border-matheo-red text-matheo-red hover:bg-matheo-red hover:text-white flex items-center justify-center transition-all duration-300"
                  aria-label="TikTok"
                >
                  <svg
                    width="18"
                    height="18"
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
                <div className="flex flex-col leading-tight ml-1">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Siguenos
                  </span>
                  <span className="text-[9px] text-gray-400">
                    Visita nuestras redes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Red Bar: Navigation */}
        <div className="bg-matheo-red">
          <div className="container mx-auto px-4">
            <div className="hidden mlg:flex items-center pl-12 pr-12 h-12 gap-1">
              <div className="flex items-center gap-1">
                {navItems
                  .filter((i) => i.name !== 'Favoritos' && i.name !== 'Ver Catálogo 📙')
                  .map((item) => {
                    if (item.name === 'Marcas') {
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={cn(
                            'px-3 py-1 text-sm font-semibold text-white hover:text-white/80 transition-colors',
                            pathname === item.href &&
                              'text-white/80 underline underline-offset-4',
                          )}
                        >
                          {item.name}
                        </Link>
                      )
                    }

                    if (item.name === 'Ver Catálogo 📙') {
                      return (
                        <a
                          key={item.name}
                          href={item.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 text-sm font-semibold text-white hover:text-white/80 transition-colors whitespace-nowrap"
                        >
                          {item.name}
                        </a>
                      )
                    }

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          'px-3 py-1 text-sm font-semibold text-white hover:text-white/80 transition-colors',
                          pathname === item.href &&
                            'text-white/80 underline underline-offset-4',
                        )}
                      >
                        {item.name}
                      </Link>
                    )
                  })}
              </div>

              <a
                href="/catalogo.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="ml-auto px-3 py-1 text-sm font-semibold text-white hover:text-white/80 transition-colors whitespace-nowrap"
              >
                Ver Catálogo 📙
              </a>
              <Link
                href="/favoritos"
                className={cn(
                  'px-3 py-1 text-sm font-semibold text-white hover:text-white/80 transition-colors',
                  pathname === '/favoritos' &&
                    'text-white/80 underline underline-offset-4',
                )}
              >
                Favoritos{favCount > 0 && ` (${favCount})`}
              </Link>
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
          <span className="font-bold text-lg text-matheo-blue">
            Menú
          </span>
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
                                  <span className="text-base">
                                    🔧
                                  </span>
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
                      isMobileCatsOpen ? 'max-h-150 mb-2' : 'max-h-0',
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
                        : categories
                            .filter((c) => c.isParent)
                            .slice(0, 6)
                            .map((cat) => {
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
                                            expandedMobileCat ===
                                              cat.name
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
                                            expandedMobileCat ===
                                              cat.name &&
                                              'rotate-180',
                                          )}
                                        />
                                      </button>
                                    )}
                                  </div>
                                  {hasSub &&
                                    expandedMobileCat ===
                                      cat.name && (
                                      <div className="ml-4 pl-4 border-l-2 border-gray-100 space-y-0.5 py-1 mb-1">
                                        {subs.map((sub) => (
                                          <Link
                                            key={sub.name}
                                            href={`/productos/${generateSlug(sub.name)}`}
                                            onClick={() =>
                                              setIsOpen(false)
                                            }
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
                      {categories.filter((c) => c.isParent).length >
                        6 && (
                        <Link
                          href="/productos"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 py-2 px-3 text-sm font-semibold text-matheo-blue hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          Ver más categorías →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )
            }

            if (item.name === 'Marcas') {
              return (
                <div key={item.name}>
                  <div className="flex items-center">
                    <Link
                      href="/marcas"
                      onClick={() => setIsOpen(false)}
                      className="flex-1 py-3 px-4 text-gray-700 hover:text-matheo-red hover:bg-gray-50 rounded-lg transition-colors font-medium"
                    >
                      {item.name}
                    </Link>
                    <button
                      onClick={() =>
                        setIsMobileMarcasOpen(!isMobileMarcasOpen)
                      }
                      className="p-3 text-gray-500 hover:text-matheo-red transition-colors"
                      aria-label="Ver marcas"
                    >
                      <ChevronDown
                        size={18}
                        className={cn(
                          'transition-transform duration-300',
                          isMobileMarcasOpen && 'rotate-180',
                        )}
                      />
                    </button>
                  </div>

                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-300',
                      isMobileMarcasOpen
                        ? 'max-h-150 mb-2'
                        : 'max-h-0',
                    )}
                  >
                    <div className="ml-4 pl-4 border-l-2 border-gray-200/60 space-y-1 py-2">
                      {dbBrands.slice(0, 6).map((brand) => (
                        <Link
                          key={brand.name}
                          href={`/productos?brand=${encodeURIComponent(brand.name)}`}
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-3 py-2 px-3 text-sm text-gray-600 hover:text-matheo-blue hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                            {brand.image ? (
                              <Image
                                src={brand.image}
                                alt={brand.name}
                                width={24}
                                height={24}
                                className="w-full h-full object-contain"
                              />
                            ) : (
                              <span className="text-[10px] font-bold text-matheo-blue uppercase">
                                {brand.name.charAt(0)}
                              </span>
                            )}
                          </div>
                          <span className="font-medium">
                            {brand.name}
                          </span>
                        </Link>
                      ))}
                      {dbBrands.length > 6 && (
                        <Link
                          href="/marcas"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2 py-2 px-3 text-sm font-semibold text-matheo-blue hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          Ver más marcas →
                        </Link>
                      )}
                    </div>
                  </div>
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
                  onClick={() => setIsOpen(false)}
                  className="block py-3 text-gray-700 hover:text-matheo-red hover:bg-gray-50 px-4 rounded-lg transition-colors"
                >
                  {item.name}
                </a>
              )
            }

            const isHashLink = item.href.includes('#')
            if (isHashLink) {
              return (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
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
