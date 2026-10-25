import { Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { createMovement } from "@/lib/actions/account-movements"
import { getCustomers } from "@/lib/actions/customers"
import FormWrapper from "@/components/admin/FormWrapper"
import MovementForm from "@/components/admin/MovementForm"

const LEDGER = "wuardadito_mercaderia"
const TITLE = "Wuardadito Mercadería"

export default async function Page() {
  const customers = await getCustomers()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-slide-up-fade">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin/wuardadito-mercaderia" className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900">
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Link>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">Nuevo movimiento - {TITLE}</h1>
          <p className="mt-0.5 text-sm text-gray-500">Registrar ingreso o egreso</p>
        </div>
      </div>

      <div className="max-w-2xl animate-slide-up-fade stagger-1">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-gray-100 px-6 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-matheo-red/10">
              <Plus className="h-4 w-4 text-matheo-red" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">Datos del movimiento</h2>
              <p className="text-sm text-gray-500">Completa la información requerida</p>
            </div>
          </div>
          <div className="p-6">
            <FormWrapper action={createMovement}>
              <MovementForm customers={customers} ledger={LEDGER} />
              <div className="mt-6 flex justify-end">
                <button type="submit" className="inline-flex items-center justify-center rounded-xl bg-matheo-red px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-matheo-red/20 transition-all duration-200 hover:bg-matheo-red/90 hover:shadow-md hover:shadow-matheo-red/30">Guardar</button>
              </div>
            </FormWrapper>
          </div>
        </div>
      </div>
    </div>
  )
}
