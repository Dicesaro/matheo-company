import { notFound } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase-server'
import ProductForm from '@/components/admin/ProductForm'
import ButtonLink from '@/components/admin/ButtonLink'

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: categories }, { data: brands }, { data: product }] =
    await Promise.all([
      supabase.from('categories').select('id, name, parent_id').order('name'),
      supabase.from('brands').select('id, name').order('name'),
      supabase.from('products').select('*').eq('id', id).single(),
    ])

  if (!product) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <ButtonLink variant="ghost" size="icon" href="/admin/productos">
          <ArrowLeft className="h-4 w-4" />
        </ButtonLink>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar producto</h1>
          <p className="text-gray-500">Modifica los datos del producto</p>
        </div>
      </div>

      <Card className="border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white rounded-t-xl border-b">
          <CardTitle className="text-gray-900">{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ProductForm
            categories={categories || []}
            brands={brands || []}
            defaultValues={{
              id: product.id,
              name: product.name,
              description: product.description,
              long_description: product.long_description,
              image_url: product.image_url,
              images_gallery: product.images_gallery,
              price: product.price,
              original_price: product.original_price,
              discount: product.discount,
              rating: product.rating,
              featured: product.featured || false,
              category_id: product.category_id,
              brand_id: product.brand_id,
              features: product.features,
              benefits: product.benefits,
              work_materials: product.work_materials,
              specifications: product.specifications,
            }}
          />
        </CardContent>
      </Card>
    </div>
  )
}
