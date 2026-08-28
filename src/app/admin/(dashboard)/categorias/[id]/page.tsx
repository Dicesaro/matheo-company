import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { updateCategory, getCategories } from '@/lib/actions/categories'
import { createClient } from '@/lib/supabase-server'
import FormWrapper from '@/components/admin/FormWrapper'
import ButtonLink from '@/components/admin/ButtonLink'
import CategoryForm from '@/components/admin/CategoryForm'

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: category } = await supabase
    .from('categories')
    .select('*')
    .eq('id', id)
    .single()

  if (!category) notFound()

  const allCategories = await getCategories()
  const parentOptions = allCategories.filter((c) => !c.parent_id && c.id !== id)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <ButtonLink variant="ghost" size="icon" href="/admin/categorias">
          <ArrowLeft className="h-4 w-4" />
        </ButtonLink>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar categoría</h1>
          <p className="text-gray-500">Modifica los datos de la categoría</p>
        </div>
      </div>

      <Card className="max-w-md border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white rounded-t-xl border-b">
          <CardTitle className="text-gray-900">Datos de la categoría</CardTitle>
          <CardDescription>El nombre debe ser único</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <FormWrapper
            action={updateCategory.bind(null, id)}
            redirectOnSuccess="/admin/categorias"
          >
            <div className="space-y-4">
              <CategoryForm
                defaultName={category.name}
                defaultImageUrl={category.image_url || ''}
              />

              <div className="space-y-2">
                <Label htmlFor="parent_id" className="text-gray-700">Categoría padre</Label>
                <Select name="parent_id" defaultValue={category.parent_id || ''}>
                  <SelectTrigger className="border-gray-200 focus-visible:ring-matheo-red">
                    <SelectValue placeholder="Ninguna (categoría principal)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Ninguna (categoría principal)</SelectItem>
                    {parentOptions.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-400">Selecciona una categoría padre para convertir en subcategoría</p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="bg-matheo-red hover:bg-matheo-red/90 shadow-lg shadow-matheo-red/25">Guardar cambios</Button>
                <ButtonLink variant="outline" href="/admin/categorias" className="border-gray-200 text-gray-700 hover:bg-gray-50">Cancelar</ButtonLink>
              </div>
            </div>
          </FormWrapper>
        </CardContent>
      </Card>
    </div>
  )
}
