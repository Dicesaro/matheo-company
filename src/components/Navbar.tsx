'use client'
import {
  Menu,
  X,
  Mail,
  Search,
  ChevronLeft,
  ChevronDown,
  ArrowRight,
  LayoutGrid,
} from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useCustomSearchParams } from '../hooks/useCustomSearchParams'
import Link from 'next/link'
import { cn, generateSlug } from '../lib/utils'
import { supabase } from '../lib/supabase'

const navItems = [
  { name: 'Inicio', href: '/' },
  { name: 'Productos', href: '/productos', hasMega: true },
  { name: 'Nosotros', href: '/nosotros' },
  { name: 'Contacto', href: '/contacto' },
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
  const [categories, setCategories] = useState<
    { name: string; image: string | null }[]
  >([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)
  const [isMegaOpen, setIsMegaOpen] = useState(false)
  const [isMobileCatsOpen, setIsMobileCatsOpen] = useState(false)
  const megaRef = useRef<HTMLDivElement>(null)
  const megaTimeout = useRef<ReturnType<typeof setTimeout> | null>(
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
    setIsMegaOpen(false)
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
  // Fetch categories and an example product image for each
  useEffect(() => {
    if (hasFetchedNav.current) return
    hasFetchedNav.current = true

    async function fetchNavData() {
      try {
        const { data: cats } = await supabase
          .from('categories')
          .select('name')
          .order('name')

        if (cats) {
          // Fetch products to extract an image for each category
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

          setCategories(
            cats.map((c: { name: string }) => ({
              name: c.name,
              image: imgMap[c.name] || null,
            })),
          )
        }
      } finally {
        setIsLoadingCategories(false)
      }
    }
    fetchNavData()
  }, [])

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isHome = pathname === '/'

  const handleMegaEnter = () => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current)
    setIsMegaOpen(true)
  }

  const handleMegaLeave = () => {
    megaTimeout.current = setTimeout(() => setIsMegaOpen(false), 150)
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

    searchTimeoutRef.current = setTimeout(async () => {
      if (value.length >= 2) {
        try {
          const { data, error } = await supabase
            .from('products')
            .select(
              `id, name, image_url, brands (name), categories(name)`,
            )
            .or(`name.ilike.%${value}%,description.ilike.%${value}%`)
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
    }, 600) // Increased debounce to 600ms to group typing better
  }

  const handleResultClick = (
    productName: string,
    category: string,
  ) => {
    router.push(
      `/productos/${generateSlug(category)}/${generateSlug(productName)}`,
    )
    setSearchResults([])
    setSearchValue('')
    setIsSearchExpanded(false)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = () => setSearchResults([])
    window.addEventListener('click', handleClickOutside)
    return () =>
      window.removeEventListener('click', handleClickOutside)
  }, [])

  // No longer need columns — using grid cards layout

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled || !isHome
          ? 'bg-white shadow-lg'
          : 'bg-white/95 backdrop-blur-sm',
      )}
    >
      {/* Top Bar */}
      <div className="bg-matheo-red text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <a
              href="mailto:ventas@matheocompany.com"
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <Mail size={14} />
              <span className="hidden sm:inline">
                ventas@matheocompany.com
              </span>
            </a>
          </div>
          <div className="text-xs hidden md:block">
            Importador y Distribuidor de Herramientas para la
            Industria Metalmecánica
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20 relative">
          {/* Mobile Search State - ACTIVE */}
          {isSearchExpanded ? (
            <div className="flex items-center w-full gap-3 md:hidden animate-in fade-in slide-in-from-right-4 duration-300">
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
              <div className="relative flex-1">
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
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-60 animate-in fade-in zoom-in-95 duration-200">
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() =>
                          handleResultClick(
                            product.name,
                            product.category,
                          )
                        }
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-0 transition-colors"
                      >
                        {product.image ? (
                          <div className="w-10 h-10 rounded text-center border border-gray-100 bg-white flex items-center justify-center shrink-0 overflow-hidden">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain mix-blend-multiply"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded border border-transparent flex items-center justify-center shrink-0">
                            <Search
                              size={16}
                              className="text-gray-400"
                            />
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-700 truncate min-w-0">
                          {product.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Mobile Menu Button - LEFT */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-matheo-red"
                aria-label="Toggle menu"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>

              {/* Logo - CENTERED ON MOBILE, LEFT ON DESKTOP */}
              <Link
                href={'/'}
                className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 shrink-0"
              >
                <img
                  src="https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774823626/MATHEO_logo_qneg7d.svg"
                  alt="MATHEO Industrial Company"
                  className="h-16 md:h-14 w-auto cursor-pointer hover:opacity-90 transition-opacity"
                />
              </Link>

              {/* Search Bar (Middle) - DESKTOP ONLY */}
              {/* <div className="hidden lg:flex flex-1 max-w-md mx-8 relative">
                <form
                  onSubmit={handleSearch}
                  className="relative w-full group"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-matheo-red transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="¿Qué herramienta buscas?"
                    value={searchValue}
                    onChange={handleSearchChange}
                    className="w-full pl-11 pr-4 py-2.5 bg-gray-50/50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-matheo-red focus:shadow-lg focus:shadow-matheo-red/5 focus:outline-none transition-all text-sm font-medium"
                  />
                </form>
                {searchResults.length > 0 && (
                  <div
                    className="absolute top-full left-0 right-0 mt-3 bg-white border-2 border-gray-100 rounded-2xl shadow-2xl overflow-hidden z-60 animate-in fade-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {searchResults.map((product) => (
                      <button
                        key={product.id}
                        onClick={() =>
                          handleResultClick(
                            product.name,
                            product.category,
                          )
                        }
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 border-b border-gray-50 last:border-0 transition-colors"
                      >
                        {product.image ? (
                          <div className="w-10 h-10 rounded text-center border border-gray-100 bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-sm">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain mix-blend-multiply"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded flex items-center justify-center shrink-0">
                            <Search
                              size={16}
                              className="text-gray-400"
                            />
                          </div>
                        )}
                        <span className="text-sm font-medium text-gray-700 truncate min-w-0 flex-1">
                          {product.name}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div> */}

              {/* Desktop Navigation - RIGHT */}
              <div className="hidden md:flex items-center gap-8 shrink-0">
                {navItems.map((item) => {
                  if (item.hasMega) {
                    return (
                      <div
                        key={item.name}
                        className="relative"
                        onMouseEnter={handleMegaEnter}
                        onMouseLeave={handleMegaLeave}
                        ref={megaRef}
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
                              isMegaOpen
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

                  const isHashLink = item.href.includes('#')
                  if (isHashLink) {
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
                        pathname === item.href && 'text-matheo-red',
                      )}
                    >
                      {item.name}
                      <span
                        className={cn(
                          'absolute bottom-0 left-0 h-0.5 bg-matheo-red transition-all group-hover:w-full',
                          pathname === item.href ? 'w-full' : 'w-0',
                        )}
                      />
                    </Link>
                  )
                })}
              </div>

              {/* Mobile Search Button - RIGHT */}
              {/* <button
                onClick={() => {
                  setIsSearchExpanded(true)
                  setIsOpen(false)
                }}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-matheo-red"
              >
                <Search size={28} />
              </button> */}
            </>
          )}
        </div>
      </div>

      {/* ── MEGA MENU (Desktop) ── */}
      <div
        onMouseEnter={handleMegaEnter}
        onMouseLeave={handleMegaLeave}
        className={cn(
          'hidden md:block absolute left-0 right-0 bg-white border-t border-gray-100 shadow-2xl z-40 overflow-hidden transition-all duration-300 ease-in-out',
          isMegaOpen
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-2 pointer-events-none',
        )}
        style={{ top: '100%' }}
      >
        <div className="container mx-auto px-6 py-8">
          <div className="flex gap-8">
            {/* Category list — Escalable para múltiples categorías */}
            <div className="flex-1 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {isLoadingCategories
                  ? Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={`skeleton-${i}`}
                        className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 animate-pulse"
                      >
                        <div className="w-14 h-14 shrink-0 rounded-2xl bg-gray-200"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </div>
                      </div>
                    ))
                  : categories.map((cat) => (
                      <Link
                        key={cat.name}
                        href={`/productos/${generateSlug(cat.name)}`}
                        onClick={() => setIsMegaOpen(false)}
                        className="group relative flex items-center gap-4 p-4 rounded-2xl bg-white border border-gray-100 hover:border-matheo-blue/30 hover:bg-blue-50/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-0.5"
                      >
                        <div
                          className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center ${cat.image ? 'bg-white border border-gray-100 p-1.5' : 'bg-linear-to-br from-gray-600 to-gray-800'} shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all duration-300 overflow-hidden`}
                        >
                          {cat.image ? (
                            <img
                              src={cat.image}
                              alt={cat.name}
                              className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                              onError={(e) => {
                                ;(
                                  e.target as HTMLImageElement
                                ).style.display = 'none'
                              }}
                            />
                          ) : (
                            <span className="text-xl drop-shadow-md transform group-hover:rotate-12 transition-transform duration-300 text-white">
                              🔧
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block font-bold text-gray-800 text-sm group-hover:text-matheo-blue transition-colors truncate leading-tight">
                            {cat.name}
                          </span>
                          <span className="block text-[11px] text-gray-400 mt-1 font-black uppercase tracking-wider group-hover:text-matheo-blue/70 transition-colors">
                            Explorar
                          </span>
                        </div>
                      </Link>
                    ))}
              </div>
            </div>

            {/* Divider */}
            <div className="w-px bg-gray-100 self-stretch" />

            {/* Right panel — CTA */}
            <div className="w-52 shrink-0 flex flex-col justify-start gap-5">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <LayoutGrid
                    size={18}
                    className="text-matheo-blue"
                  />
                  <span className="text-xs font-black uppercase tracking-widest text-matheo-blue">
                    Catálogo
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">
                  Explora toda nuestra gama de herramientas
                  industriales y de precisión.
                </p>
              </div>

              <Link
                href={'/productos'}
                onClick={() => setIsMegaOpen(false)}
                className="group inline-flex items-center justify-center gap-2 w-full bg-matheo-blue hover:bg-blue-800 text-white font-bold text-sm py-3 px-5 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Ver todos los productos
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>

              <div className="mt-6 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  <span className="font-bold text-matheo-blue">
                    {categories.length}
                  </span>{' '}
                  categorías disponibles
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

      {/* ── MOBILE NAVIGATION ── */}
      <div
        className={cn(
          'md:hidden overflow-hidden transition-all duration-300',
          isOpen ? 'max-h-[600px] border-t' : 'max-h-0',
        )}
      >
        <div className="container mx-auto px-4 py-6 bg-white space-y-1">
          {navItems.map((item) => {
            if (item.hasMega) {
              return (
                <div key={item.name}>
                  {/* Header row: link + toggle chevron */}
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

                  {/* Category accordion */}
                  <div
                    className={cn(
                      'overflow-hidden transition-all duration-300',
                      isMobileCatsOpen
                        ? 'max-h-[400px] mb-2'
                        : 'max-h-0',
                    )}
                  >
                    <div className="ml-4 pl-4 border-l-2 border-matheo-blue/20 space-y-1 py-2">
                      {isLoadingCategories
                        ? Array.from({ length: 5 }).map((_, i) => (
                            <div
                              key={`mob-skeleton-${i}`}
                              className="flex items-center gap-3 py-2 px-3 animate-pulse"
                            >
                              <div className="w-6 h-6 shrink-0 rounded bg-gray-200"></div>
                              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            </div>
                          ))
                        : categories.map((cat) => (
                            <Link
                              key={cat.name}
                              href={`/productos?category=${encodeURIComponent(cat.name)}`}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-3 py-2 px-3 text-sm text-gray-600 hover:text-matheo-blue hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <div className="w-6 h-6 shrink-0 flex items-center justify-center overflow-hidden">
                                {cat.image ? (
                                  <img
                                    src={cat.image}
                                    alt={cat.name}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  <span className="text-base">
                                    🔧
                                  </span>
                                )}
                              </div>
                              <span className="font-medium">
                                {cat.name}
                              </span>
                            </Link>
                          ))}
                    </div>
                  </div>
                </div>
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
        </div>
      </div>
    </nav>
  )
}
