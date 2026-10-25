import { Clock } from 'lucide-react'
import AttendanceList from '@/components/admin/AttendanceList'

function getTodayLabel() {
  return new Date().toLocaleDateString('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function AsistenciasPage() {
  const todayLabel = getTodayLabel()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-slide-up-fade">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            Asistencias
          </h1>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-500">
            <Clock className="h-3.5 w-3.5" />
            {todayLabel}
          </p>
        </div>
      </div>

      <div className="animate-slide-up-fade stagger-1">
        <AttendanceList />
      </div>
    </div>
  )
}
