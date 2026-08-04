import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft, User } from 'lucide-react'
import { createClient } from '@/lib/supabase-server'
import { updateProfile } from '@/lib/actions/profile'
import FormWrapper from '@/components/admin/FormWrapper'
import ButtonLink from '@/components/admin/ButtonLink'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/admin/login')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <ButtonLink variant="ghost" size="icon" href="/admin">
          <ArrowLeft className="h-4 w-4" />
        </ButtonLink>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi perfil</h1>
          <p className="text-gray-500">Administra tu cuenta de administrador</p>
        </div>
      </div>

      <div className="grid gap-6 max-w-lg">
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-white rounded-t-xl border-b">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-matheo-red/10">
                <User className="h-5 w-5 text-matheo-red" />
              </div>
              <div>
                <CardTitle className="text-gray-900">Datos de la cuenta</CardTitle>
                <CardDescription>Actualiza tu email y contraseña</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <FormWrapper action={updateProfile}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700">Correo electrónico</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    defaultValue={user.email}
                    className="border-gray-200 focus-visible:ring-matheo-red"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700">Nueva contraseña</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Dejar en blanco para no cambiar"
                    className="border-gray-200 focus-visible:ring-matheo-red"
                    minLength={6}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm_password" className="text-gray-700">Confirmar contraseña</Label>
                  <Input
                    id="confirm_password"
                    name="confirm_password"
                    type="password"
                    placeholder="Repetir contraseña"
                    className="border-gray-200 focus-visible:ring-matheo-red"
                    minLength={6}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button type="submit" className="bg-matheo-red hover:bg-matheo-red/90 shadow-lg shadow-matheo-red/25">
                    Guardar cambios
                  </Button>
                  <ButtonLink variant="outline" href="/admin" className="border-gray-200 text-gray-700 hover:bg-gray-50">
                    Cancelar
                  </ButtonLink>
                </div>
              </div>
            </FormWrapper>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
