import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { createMovement } from '@/lib/actions/account-movements'
import { getCustomers } from '@/lib/actions/customers'
import FormWrapper from '@/components/admin/FormWrapper'
import ButtonLink from '@/components/admin/ButtonLink'
import MovementForm from '@/components/admin/MovementForm'

export default async function NewMovementPage() {
  const customers = await getCustomers()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <ButtonLink variant="ghost" size="icon" href="/admin/cuenta-corriente">
          <ArrowLeft className="h-4 w-4" />
        </ButtonLink>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo movimiento</h1>
          <p className="text-gray-500">Registra un ingreso o egreso en la cuenta</p>
        </div>
      </div>

      <Card className="max-w-2xl border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white rounded-t-xl border-b">
          <CardTitle className="text-gray-900">Datos del movimiento</CardTitle>
          <CardDescription>El saldo se recalcula automáticamente</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <FormWrapper action={createMovement} redirectOnSuccess="/admin/cuenta-corriente">
            <div className="space-y-4">
              <MovementForm customers={customers} ledger="general" />

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="bg-matheo-red hover:bg-matheo-red/90 shadow-lg shadow-matheo-red/25">Guardar</Button>
                <ButtonLink variant="outline" href="/admin/cuenta-corriente" className="border-gray-200 text-gray-700 hover:bg-gray-50">Cancelar</ButtonLink>
              </div>
            </div>
          </FormWrapper>
        </CardContent>
      </Card>
    </div>
  )
}