'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Tags,
  Building2,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const mainNav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/categorias', label: 'Categorías', icon: Tags },
  { href: '/admin/marcas', label: 'Marcas', icon: Building2 },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const isActive = (href: string) => {
    const current = pathname ?? ''
    return current === href || (href !== '/admin' && current.startsWith(href))
  }

  const sidebarContent = (
    <div className="flex h-full flex-col bg-white shadow-sm">
      <div className="flex h-16 items-center border-b border-gray-100 px-5">
        <Image
          src="https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774823626/MATHEO_logo_qneg7d.svg"
          alt="MATHEO"
          width={140}
          height={47}
          className="h-auto"
          priority
        />
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto p-4">
        <div>
          <p className="mb-2 px-3 text-[11px] font-semibold tracking-[0.12em] text-gray-400 uppercase">
            Menú principal
          </p>
          <div className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-matheo-red text-white shadow-sm shadow-matheo-red/20'
                      : 'text-gray-500 hover:bg-gray-100 hover:text-gray-800'
                  )}
                >
                  <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-white' : 'text-gray-400 group-hover:text-gray-600')} />
                  <span>{item.label}</span>
                  {active && (
                    <ChevronRight className="ml-auto h-3.5 w-3.5 text-white/60" />
                  )}
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 block rounded-xl border border-gray-200 bg-white p-2 text-gray-600 shadow-sm transition-all hover:bg-gray-50 lg:hidden"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 -translate-x-full border-r border-gray-100 transition-all duration-300 lg:static lg:translate-x-0',
          open && 'translate-x-0'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
