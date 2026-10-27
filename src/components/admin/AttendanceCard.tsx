'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { markAttendance } from '@/lib/actions/attendances'
import { getLateMinutes, getOvertimeMinutes, formatMinutes } from '@/lib/utils/attendance'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Clock, LogIn, LogOut, CheckCircle2, CalendarDays } from 'lucide-react'

interface AttendanceCardProps {
  personName: string
  shiftStart: string
  shiftEnd: string
  attendanceDate: string
  checkIn: string | null
  checkOut: string | null
}

export default function AttendanceCard({
  personName,
  shiftStart,
  shiftEnd,
  attendanceDate,
  checkIn,
  checkOut,
}: AttendanceCardProps) {
  const [isPending, startTransition] = useTransition()

  const lateMinutes = checkIn ? getLateMinutes(checkIn, shiftStart, attendanceDate) : 0
  const overtimeMinutes = checkIn && checkOut ? getOvertimeMinutes(checkOut, shiftEnd, attendanceDate) : 0

  const handleClick = () => {
    startTransition(async () => {
      const result = await markAttendance(personName)
      if (result?.error) {
        toast.error(result.error)
        return
      }
      toast.success('Registrado correctamente')
    })
  }

  const formatTime = (iso: string | null) => {
    if (!iso) return null
    return new Date(iso).toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Lima',
    })
  }

  const isCompleted = !!(checkIn && checkOut)
  const hasCheckedIn = !!checkIn
  const hasCheckedOut = !!checkOut

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{personName}</h3>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-gray-500">
            <Clock className="h-3.5 w-3.5" />
            <span>
              Horario: {shiftStart} - {shiftEnd}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {isCompleted && (
            <div className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Completado
            </div>
          )}
          <Link
            href={`/admin/asistencias/${encodeURIComponent(personName)}`}
            title="Ver historial"
            className="inline-flex h-8 w-8 items-center justify-center rounded-md text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
          >
            <CalendarDays className="h-4 w-4" />
          </Link>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {hasCheckedIn && (
          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <LogIn className="h-4 w-4 text-gray-400" />
              <span>Entrada</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">{formatTime(checkIn)}</span>
              {lateMinutes > 0 && (
                <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-700">
                  Tardanza: +{formatMinutes(lateMinutes)}
                </span>
              )}
            </div>
          </div>
        )}

        {hasCheckedOut && (
          <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <LogOut className="h-4 w-4 text-gray-400" />
              <span>Salida</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">{formatTime(checkOut)}</span>
              {overtimeMinutes > 0 && (
                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                  Horas extras: +{formatMinutes(overtimeMinutes)}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-4">
        {!hasCheckedIn && (
          <Button
            onClick={handleClick}
            disabled={isPending}
            className="w-full bg-matheo-red text-white hover:bg-matheo-red/90"
          >
            <LogIn className="mr-2 h-4 w-4" />
            {isPending ? 'Marcando...' : 'Marcar llegada'}
          </Button>
        )}

        {hasCheckedIn && !hasCheckedOut && (
          <Button
            onClick={handleClick}
            disabled={isPending}
            className="w-full bg-gray-900 text-white hover:bg-gray-800"
          >
            <LogOut className="mr-2 h-4 w-4" />
            {isPending ? 'Marcando...' : 'Marcar salida'}
          </Button>
        )}

        {isCompleted && (
          <Button disabled className="w-full" variant="outline">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Completado
          </Button>
        )}
      </div>
    </div>
  )
}
