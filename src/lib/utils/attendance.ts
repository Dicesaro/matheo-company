function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return (h || 0) * 60 + (m || 0)
}

function minutesToDate(dateStr: string, timeStr: string): Date {
  const [y, mo, d] = dateStr.split('-').map(Number)
  const mins = parseTimeToMinutes(timeStr)
  const h = Math.floor(mins / 60)
  const mm = mins % 60
  return new Date(y, mo - 1, d, h, mm, 0, 0)
}

function getMinutesSinceMidnightInLima(iso: string): number {
  try {
    const date = new Date(iso)
    const formatter = new Intl.DateTimeFormat('es-PE', {
      timeZone: 'America/Lima',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
    const parts = formatter.formatToParts(date)
    const hour = Number(parts.find((p) => p.type === 'hour')?.value || '0')
    const minute = Number(parts.find((p) => p.type === 'minute')?.value || '0')
    return hour * 60 + minute
  } catch {
    const date = new Date(iso)
    const utc = date.getTime() + date.getTimezoneOffset() * 60000
    const lima = new Date(utc - 5 * 60 * 60000)
    return lima.getHours() * 60 + lima.getMinutes()
  }
}

export function getLateMinutes(checkInIso: string, shiftStart: string, dateStr: string): number {
  const checkInMins = getMinutesSinceMidnightInLima(checkInIso)
  const shiftStartMins = parseTimeToMinutes(shiftStart)
  const diff = checkInMins - shiftStartMins
  if (diff <= 0) return 0
  return diff
}

export function getOvertimeMinutes(checkOutIso: string | null, shiftEnd: string, dateStr: string): number {
  if (!checkOutIso) return 0
  const checkOutMins = getMinutesSinceMidnightInLima(checkOutIso)
  const shiftEndMins = parseTimeToMinutes(shiftEnd)
  const diff = checkOutMins - shiftEndMins
  if (diff <= 0) return 0
  return diff
}

export function formatMinutes(minutes: number): string {
  if (minutes <= 0) return '0 min'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h}h`
  return `${h}h ${m} min`
}
