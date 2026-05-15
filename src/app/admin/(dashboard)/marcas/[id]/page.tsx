import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { updateBrand } from '@/lib/actions/brands'
import { createClient } from '@/lib/supabase-server'
import FormWrapper from '@/components/admin/FormWrapper'
import ButtonLink from '@/components/admin/ButtonLink'

export default async function EditBrandPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: brand } = await supabase
    .from('brands')
    .select('*')
    .eq('id', id)
    .single()

  if (!brand) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <ButtonLink variant="ghost" size="icon" href="/admin/marcas">
          <ArrowLeft className="h-4 w-4" />
        </ButtonLink>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar marca</h1>
          <p className="text-gray-500">Modifica los datos de la marca</p>
        </div>
      </div>

      <Card className="max-w-md border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white rounded-t-xl border-b">
          <CardTitle className="text-gray-900">Datos de la marca</CardTitle>
          <CardDescription>El nombre debe ser único</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <FormWrapper
            action={(formData) => updateBrand(id, formData)}
            redirectOnSuccess="/admin/marcas"
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  defaultValue={brand.name}
                  className="border-gray-200 focus-visible:ring-matheo-red"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="bg-matheo-red hover:bg-matheo-red/90 shadow-lg shadow-matheo-red/25">Guardar cambios</Button>
                <ButtonLink variant="outline" href="/admin/marcas" className="border-gray-200 text-gray-700 hover:bg-gray-50">Cancelar</ButtonLink>
              </div>
            </div>
          </FormWrapper>
        </CardContent>
      </Card>
    </div>
  )
}
