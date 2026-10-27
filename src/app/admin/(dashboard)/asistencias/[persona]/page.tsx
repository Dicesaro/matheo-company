import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, CalendarDays, Clock, LogIn, LogOut } from 'lucide-react'
import { getAttendanceHistory } from '@/lib/actions/attendances'
import { ATTENDANCE_PEOPLE } from '@/lib/constants/attendance'
import { getLateMinutes, getOvertimeMinutes, formatMinutes } from '@/lib/utils/attendance'
import { Button } from '@/components/ui/button'

function formatDate(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatTime(iso: string | null) {
  if (!iso) return '--'
  return new Date(iso).toLocaleTimeString('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Lima',
  })
}

export default async function AttendanceHistoryPage({
  params,
}: {
  params: Promise<{ persona: string }>
}) {
  const { persona } = await params
  const personName = decodeURIComponent(persona)

  const person = ATTENDANCE_PEOPLE.find((p) => p.name === personName)
  if (!person) notFound()

  const history = await getAttendanceHistory(personName)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between animate-slide-up-fade">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/asistencias"
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a asistencias
            </Link>
          </div>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-900">
            Historial de {person.name}
          </h1>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-500">
            <Clock className="h-3.5 w-3.5" />
            Horario: {person.shiftStart} - {person.shiftEnd}
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-gray-100 bg-white px-4 py-2 shadow-sm">
          <CalendarDays className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {history.length} {history.length === 1 ? 'registro' : 'registros'}
          </span>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm animate-slide-up-fade stagger-1">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Llegada
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Salida
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Tardanza
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Horas extras
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-500 uppercase">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {history.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <CalendarDays className="h-8 w-8 text-gray-300" />
                      <p className="text-sm text-gray-500">
                        Aún no hay historial registrado para esta persona
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                history.map((record) => {
                  const lateMinutes = record.check_in
                    ? getLateMinutes(record.check_in, person.shiftStart, record.attendance_date)
                    : 0
                  const overtimeMinutes =
                    record.check_in && record.check_out
                      ? getOvertimeMinutes(record.check_out, person.shiftEnd, record.attendance_date)
                      : 0
                  const isCompleted = !!(record.check_in && record.check_out)
                  const isPending = !!(record.check_in && !record.check_out)

                  return (
                    <tr key={record.id} className="transition-colors hover:bg-gray-50/50">
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium capitalize text-gray-900">
                            {formatDate(record.attendance_date)}
                          </span>
                          <span className="text-xs text-gray-500">{record.attendance_date}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                          <LogIn className="h-3.5 w-3.5 text-gray-400" />
                          {formatTime(record.check_in)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-700">
                          <LogOut className="h-3.5 w-3.5 text-gray-400" />
                          {formatTime(record.check_out)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {lateMinutes > 0 ? (
                          <span className="inline-flex rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
                            +{formatMinutes(lateMinutes)}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">--</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {overtimeMinutes > 0 ? (
                          <span className="inline-flex rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                            +{formatMinutes(overtimeMinutes)}
                          </span>
                        ) : (
                          <span className="text-sm text-gray-400">--</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {isCompleted && (
                          <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            Completado
                          </span>
                        )}
                        {isPending && (
                          <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                            Pendiente
                          </span>
                        )}
                        {!record.check_in && !record.check_out && (
                          <span className="inline-flex rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                            Sin registro
                          </span>
                        )}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
