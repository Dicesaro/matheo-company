import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { createBanner } from '@/lib/actions/banners'
import FormWrapper from '@/components/admin/FormWrapper'
import ButtonLink from '@/components/admin/ButtonLink'
import BannerForm from '@/components/admin/BannerForm'

export default function NewBannerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <ButtonLink variant="ghost" size="icon" href="/admin/banners">
          <ArrowLeft className="h-4 w-4" />
        </ButtonLink>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo banner</h1>
          <p className="text-gray-500">Agrega un banner al hero de la página principal</p>
        </div>
      </div>

      <Card className="max-w-lg border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white rounded-t-xl border-b">
          <CardTitle className="text-gray-900">Datos del banner</CardTitle>
          <CardDescription>Ingresa las URLs de las imágenes del slide</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <FormWrapper action={createBanner} redirectOnSuccess="/admin/banners">
            <div className="space-y-4">
              <BannerForm />

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="bg-matheo-red hover:bg-matheo-red/90 shadow-lg shadow-matheo-red/25">Guardar</Button>
                <ButtonLink variant="outline" href="/admin/banners" className="border-gray-200 text-gray-700 hover:bg-gray-50">Cancelar</ButtonLink>
              </div>
            </div>
          </FormWrapper>
        </CardContent>
      </Card>
    </div>
  )
}