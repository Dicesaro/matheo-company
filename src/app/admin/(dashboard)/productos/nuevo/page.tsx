import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase-server'
import ProductForm from '@/components/admin/ProductForm'
import ButtonLink from '@/components/admin/ButtonLink'

export default async function NewProductPage() {
  const supabase = await createClient()

  const [{ data: categories }, { data: brands }] = await Promise.all([
    supabase.from('categories').select('id, name, parent_id').order('name'),
    supabase.from('brands').select('id, name').order('name'),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <ButtonLink variant="ghost" size="icon" href="/admin/productos">
          <ArrowLeft className="h-4 w-4" />
        </ButtonLink>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo producto</h1>
          <p className="text-gray-500">Agrega un nuevo producto al catálogo</p>
        </div>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-linear-to-r from-gray-50 to-white rounded-t-xl border-b">
          <CardTitle className="text-gray-900">Datos del producto</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ProductForm
            categories={categories || []}
            brands={brands || []}
          />
        </CardContent>
      </Card>
    </div>
  )
}
