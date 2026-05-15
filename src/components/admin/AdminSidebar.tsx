'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  Tags,
  Building2,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { createBrowserClient } from '@supabase/ssr'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/productos', label: 'Productos', icon: Package },
  { href: '/admin/categorias', label: 'Categorías', icon: Tags },
  { href: '/admin/marcas', label: 'Marcas', icon: Building2 },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  const sidebarContent = (
    <div className="flex h-full flex-col bg-linear-to-b from-gray-900 to-black">
      <div className="flex h-16 items-center border-b border-white/10 px-4">
        <Image
          src="https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774823626/MATHEO_logo_qneg7d.svg"
          alt="MATHEO"
          width={140}
          height={47}
          className="h-auto brightness-0 invert"
          priority
        />
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const Icon = item.icon
          const currentPath = pathname ?? ''
          const isActive = currentPath === item.href ||
            (item.href !== '/admin' && currentPath.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                isActive
                  ? 'bg-matheo-red text-white shadow-lg shadow-matheo-red/25'
                  : 'text-gray-400 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className={cn('h-4 w-4', isActive && 'text-white')} />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition-all hover:bg-white/10 hover:text-white"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </div>
  )

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed top-4 left-4 z-50 block rounded-md border border-white/20 bg-gray-900 p-2 text-white shadow-lg lg:hidden"
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 -translate-x-full border-r border-white/10 transition-transform lg:static lg:translate-x-0',
          open && 'translate-x-0'
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
