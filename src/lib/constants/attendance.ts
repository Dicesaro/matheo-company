export const ATTENDANCE_PEOPLE = [
  { id: 'cesar', name: 'Cesar', shiftStart: '08:00', shiftEnd: '17:00' },
  { id: 'lucia', name: 'Leonel', shiftStart: '08:00', shiftEnd: '17:00' },
  { id: 'kevin', name: 'Patty', shiftStart: '09:00', shiftEnd: '18:00' },
] as const

export type AttendancePersonName = (typeof ATTENDANCE_PEOPLE)[number]['name']
