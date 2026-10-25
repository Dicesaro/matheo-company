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

export function getLateMinutes(checkInIso: string, shiftStart: string, dateStr: string): number {
  const checkIn = new Date(checkInIso)
  const shiftStartDate = minutesToDate(dateStr, shiftStart)
  const diffMs = checkIn.getTime() - shiftStartDate.getTime()
  if (diffMs <= 0) return 0
  return Math.round(diffMs / 60000)
}

export function getOvertimeMinutes(checkOutIso: string | null, shiftEnd: string, dateStr: string): number {
  if (!checkOutIso) return 0
  const checkOut = new Date(checkOutIso)
  const shiftEndDate = minutesToDate(dateStr, shiftEnd)
  const diffMs = checkOut.getTime() - shiftEndDate.getTime()
  if (diffMs <= 0) return 0
  return Math.round(diffMs / 60000)
}

export function formatMinutes(minutes: number): string {
  if (minutes <= 0) return '0 min'
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h}h`
  return `${h}h ${m} min`
}
