import { Suspense } from 'react'
import { Plus, Wallet, CalendarDays } from 'lucide-react'
import {
  getAccountMovements,
  getMonthBalance,
  deleteMovement,
} from '@/lib/actions/account-movements'
import { getCustomers } from '@/lib/actions/customers'
import MovementTable from '@/components/admin/MovementTable'
import MovementFilters from '@/components/admin/MovementFilters'
import InitialBalanceForm from '@/components/admin/InitialBalanceForm'
import MonthSelector, { MONTHS } from '@/components/admin/MonthSelector'
import ClientPagination from '@/components/admin/ClientPagination'
import ButtonLink from '@/components/admin/ButtonLink'

const PAGE_SIZE = 12

function formatMoney(value: number) {
  return `S/ ${Number(value).toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function Header() {
  return (
    <div className="flex items-center justify-between animate-slide-up-fade">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">
          Cuenta corriente
        </h1>
        <p className="mt-0.5 text-sm text-gray-500">
          Movimientos de ingreso y egreso de la cuenta
        </p>
      </div>
      <ButtonLink
        href="/admin/cuenta-corriente/nuevo"
        className="bg-matheo-red text-white shadow-sm shadow-matheo-red/20 transition-all duration-200 hover:bg-matheo-red/90 hover:shadow-md hover:shadow-matheo-red/30"
      >
        <Plus className="mr-2 h-4 w-4" />
        Nuevo movimiento
      </ButtonLink>
    </div>
  )
}

export default async function CuentaCorrientePage({
  searchParams,
}: {
  searchParams: Promise<{
    year?: string
    month?: string
    page?: string
    q?: string
    type?: string
    customer?: string
  }>
}) {
  const {
    year: yearStr,
    month: monthStr,
    page: pageStr,
    q,
    type,
    customer,
  } = await searchParams

  const year = Number(yearStr)
  const month = Number(monthStr)
  const hasPeriod =
    Number.isInteger(year) &&
    year > 2000 &&
    Number.isInteger(month) &&
    month >= 1 &&
    month <= 12

  if (!hasPeriod) {
    return (
      <div className="space-y-6">
        <Header />

        <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm animate-slide-up-fade">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-matheo-red/10">
            <CalendarDays className="h-7 w-7 text-matheo-red" />
          </div>
          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Selecciona un periodo
          </h2>
          <p className="mt-1 max-w-sm text-sm text-gray-500">
            Elige el año y mes para cargar solo los movimientos de ese periodo.
          </p>
          <div className="mt-6">
            <Suspense>
              <MonthSelector />
            </Suspense>
          </div>
        </div>
      </div>
    )
  }

  const currentPage = Math.max(1, Number(pageStr) || 1)
  const from = `${year}-${String(month).padStart(2, '0')}-01`
  const lastDay = new Date(year, month, 0).getDate()
  const to = `${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

  const [movements, monthBalance, customers] = await Promise.all([
    getAccountMovements({ q, type, customerId: customer, from, to, ledger: 'general' }),
    getMonthBalance(year, month, from, to, 'general'),
    getCustomers(),
  ])

  const totalPages = Math.ceil(movements.length / PAGE_SIZE)
  const start = (currentPage - 1) * PAGE_SIZE
  const paginated = movements.slice(start, start + PAGE_SIZE)
  const hasFilters = !!(q || type || customer)

  return (
    <div className="space-y-6">
      <Header />

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white px-5 py-4 shadow-sm animate-slide-up-fade">
        <div>
          <div className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Periodo
          </div>
          <div className="text-lg font-bold text-gray-900">
            {MONTHS[month - 1]} {year}
          </div>
        </div>
        <Suspense>
          <MonthSelector year={year} month={month} />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-gray-400 uppercase">
            <Wallet className="h-3.5 w-3.5" />
            Monto inicial del mes
          </div>
          <div className="mt-2 text-lg font-bold text-gray-900">
            {formatMoney(monthBalance.opening)}
          </div>
          <div className="mt-3">
            <InitialBalanceForm
              initialBalance={monthBalance.opening}
              year={year}
              month={month}
              ledger="general"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Monto actual (cierre del mes)
          </div>
          <div className="mt-2 text-2xl font-bold text-matheo-red">
            {formatMoney(monthBalance.closing)}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
            Movimientos del mes
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900">
            {movements.length}
            {hasFilters ? ' (filtrado)' : ''}
          </div>
        </div>
      </div>

      <div className="animate-slide-up-fade stagger-1">
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <div className="border-b border-gray-100 px-6 py-4">
            <Suspense>
              <MovementFilters customers={customers} />
            </Suspense>
          </div>

          <MovementTable movements={paginated} deleteAction={deleteMovement} />

          <ClientPagination
            currentPage={currentPage}
            totalPages={totalPages}
            basePath="/admin/cuenta-corriente"
          />
        </div>
      </div>
    </div>
  )
}