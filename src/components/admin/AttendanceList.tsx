import { ATTENDANCE_PEOPLE } from '@/lib/constants/attendance'
import { getTodayAttendances } from '@/lib/actions/attendances'
import AttendanceCard from '@/components/admin/AttendanceCard'

function getTodayDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export default async function AttendanceList() {
  const today = getTodayDate()
  const attendances = await getTodayAttendances()

  const byName = new Map(attendances.map((a) => [a.person_name, a]))

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {ATTENDANCE_PEOPLE.map((person) => {
        const record = byName.get(person.name)
        return (
          <AttendanceCard
            key={person.id}
            personName={person.name}
            shiftStart={person.shiftStart}
            shiftEnd={person.shiftEnd}
            attendanceDate={today}
            checkIn={record?.check_in ?? null}
            checkOut={record?.check_out ?? null}
          />
        )
      })}
    </div>
  )
}
