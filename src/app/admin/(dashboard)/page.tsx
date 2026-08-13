import { createClient } from '@/lib/supabase-server'
import {
  Package, Tags, Building2, FileText, ArrowUpRight,
} from 'lucide-react'
import Link from 'next/link'

async function getStats() {
  const supabase = await createClient()

  const [
    { count: totalProducts },
    { count: totalCategories },
    { count: totalBrands },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('brands').select('*', { count: 'exact', head: true }),
  ])

  return {
    totalProducts: totalProducts ?? 0,
    totalCategories: totalCategories ?? 0,
    totalBrands: totalBrands ?? 0,
  }
}

const cards = [
  {
    title: 'Productos',
    subtitle: 'Total de productos registrados',
    icon: Package,
    href: '/admin/productos',
    gradient: 'from-rose-50 to-white',
    iconWrapper: 'bg-rose-100 text-rose-600',
    badgeBg: 'bg-rose-50 text-rose-500',
  },
  {
    title: 'Categorías',
    subtitle: 'Total de categorías',
    icon: Tags,
    href: '/admin/categorias',
    gradient: 'from-sky-50 to-white',
    iconWrapper: 'bg-sky-100 text-sky-600',
    badgeBg: 'bg-sky-50 text-sky-500',
  },
  {
    title: 'Marcas',
    subtitle: 'Total de marcas',
    icon: Building2,
    href: '/admin/marcas',
    gradient: 'from-emerald-50 to-white',
    iconWrapper: 'bg-emerald-100 text-emerald-600',
    badgeBg: 'bg-emerald-50 text-emerald-500',
  },
  {
    title: 'Facturas',
    subtitle: 'Total de facturas',
    icon: FileText,
    href: '/admin/facturas',
    gradient: 'from-amber-50 to-white',
    iconWrapper: 'bg-amber-100 text-amber-600',
    badgeBg: 'bg-amber-50 text-amber-500',
  },
]

export default async function AdminDashboardPage() {
  const stats = await getStats()

  const values = [stats.totalProducts, stats.totalCategories, stats.totalBrands, 0]

  return (
    <div className="space-y-8">
      <div className="animate-slide-up-fade">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Resumen del panel de administración
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => {
          const Icon = card.icon
          const value = values[i]
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group animate-slide-up-fade"
              style={{ animationDelay: `${(i + 1) * 0.1}s` }}
            >
              <div
                className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-linear-to-br ${card.gradient} p-6 shadow-sm transition-all duration-300 group-hover:shadow-md group-hover:-translate-y-0.5`}
              >
                <div className="flex items-start justify-between">
                  <div className={`rounded-xl p-3 ${card.iconWrapper}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${card.badgeBg}`}>
                    <span>Ver todo</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </div>
                </div>
                <div className="mt-5">
                  <p className="text-3xl font-extrabold tracking-tight text-gray-900">
                    {value}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-700">
                    {card.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {card.subtitle}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
