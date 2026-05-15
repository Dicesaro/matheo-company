import { createClient } from '@/lib/supabase-server'
import { Card, CardContent } from '@/components/ui/card'
import { Package, Tags, Building2, ArrowUpRight } from 'lucide-react'
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

export default async function AdminDashboardPage() {
  const stats = await getStats()

  const cards = [
    {
      title: 'Productos',
      value: stats.totalProducts,
      icon: Package,
      description: 'Total de productos registrados',
      href: '/admin/productos',
      color: 'from-matheo-red/20 to-matheo-red/5',
      iconBg: 'bg-matheo-red/10 text-matheo-red',
    },
    {
      title: 'Categorías',
      value: stats.totalCategories,
      icon: Tags,
      description: 'Total de categorías',
      href: '/admin/categorias',
      color: 'from-matheo-blue/20 to-matheo-blue/5',
      iconBg: 'bg-matheo-blue/10 text-matheo-blue',
    },
    {
      title: 'Marcas',
      value: stats.totalBrands,
      icon: Building2,
      description: 'Total de marcas',
      href: '/admin/marcas',
      color: 'from-emerald-500/20 to-emerald-500/5',
      iconBg: 'bg-emerald-500/10 text-emerald-600',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Resumen del panel de administración</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 items-start">
        {cards.map((card) => {
          const Icon = card.icon
          return (
            <Link
              key={card.title}
              href={card.href}
              className="group block"
            >
              <Card className="relative overflow-hidden border-0 bg-linear-to-br shadow-lg">
                <div
                  className={`absolute inset-0 bg-linear-to-br ${card.color} opacity-50`}
                />
                <CardContent className="relative p-6">
                  <div className="flex items-start justify-between">
                    <div className={`rounded-xl p-3 ${card.iconBg}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-gray-300 transition-all" />
                  </div>
                  <div className="mt-4">
                    <div className="text-3xl font-bold text-gray-900">
                      {card.value}
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-500">
                      {card.title}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-400">
                      {card.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
