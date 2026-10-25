import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { createCustomer } from '@/lib/actions/customers'
import FormWrapper from '@/components/admin/FormWrapper'
import ButtonLink from '@/components/admin/ButtonLink'
import CustomerForm from '@/components/admin/CustomerForm'

export default function NewCustomerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <ButtonLink variant="ghost" size="icon" href="/admin/clientes">
          <ArrowLeft className="h-4 w-4" />
        </ButtonLink>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Nuevo cliente</h1>
          <p className="text-gray-500">Registra un nuevo cliente o empresa</p>
        </div>
      </div>

      <Card className="max-w-md border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-white rounded-t-xl border-b">
          <CardTitle className="text-gray-900">Datos del cliente</CardTitle>
          <CardDescription>El RUC debe ser único</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <FormWrapper action={createCustomer} redirectOnSuccess="/admin/clientes">
            <div className="space-y-4">
              <CustomerForm />

              <div className="flex gap-2 pt-2">
                <Button type="submit" className="bg-matheo-red hover:bg-matheo-red/90 shadow-lg shadow-matheo-red/25">Guardar</Button>
                <ButtonLink variant="outline" href="/admin/clientes" className="border-gray-200 text-gray-700 hover:bg-gray-50">Cancelar</ButtonLink>
              </div>
            </div>
          </FormWrapper>
        </CardContent>
      </Card>
    </div>
  )
}