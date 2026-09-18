import { notFound } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { updateBanner } from '@/lib/actions/banners'
import { createClient } from '@/lib/supabase-server'
import FormWrapper from '@/components/admin/FormWrapper'
import ButtonLink from '@/components/admin/ButtonLink'
import BannerForm from '@/components/admin/BannerForm'

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: banner } = await supabase
    .from('banners')
    .select('*')
    .eq('id', id)
    .single()

  if (!banner) notFound()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <ButtonLink variant="ghost" size="icon" href="/admin/banners">
          <ArrowLeft className="h-4 w-4" />
        </ButtonLink>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Editar banner</h1>
          <p className="text-gray-500">Modifica los datos del banner</p>
        </div>
      </div>

      <Card className="max-w-lg border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white rounded-t-xl border-b">
          <CardTitle className="text-gray-900">Datos del banner</CardTitle>
          <CardDescription>Actualiza las URLs de las imágenes del slide</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <FormWrapper
            action={updateBanner.bind(null, id)}
            redirectOnSuccess="/admin/banners"
          >
            <div className="space-y-4">
              <BannerForm
                defaultTitle={banner.title}
                defaultImageUrl={banner.image_url || ''}
                defaultMobileImageUrl={banner.mobile_image_url || ''}
                defaultLinkUrl={banner.link_url || ''}
                defaultPosition={banner.position || 0}
                defaultActive={banner.active ?? true}
              />

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="bg-matheo-red hover:bg-matheo-red/90 shadow-lg shadow-matheo-red/25">Guardar cambios</Button>
                <ButtonLink variant="outline" href="/admin/banners" className="border-gray-200 text-gray-700 hover:bg-gray-50">Cancelar</ButtonLink>
              </div>
            </div>
          </FormWrapper>
        </CardContent>
      </Card>
    </div>
  )
}