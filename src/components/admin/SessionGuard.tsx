'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getBrowserClient } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import { LogOut, Clock } from 'lucide-react'

const SESSION_DURATION_MS = 60 * 60 * 1000
const CHECK_INTERVAL_MS = 30 * 1000

export default function SessionGuard({ children }: { children: React.ReactNode }) {
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const loginTimeRef = useRef<number>(0)
  const router = useRouter()

  useEffect(() => {
    const supabase = getBrowserClient()

    let ended = false

    async function endSession() {
      if (ended) return
      ended = true
      await supabase.auth.signOut()
      sessionStorage.removeItem('admin_session_start')
      setShowModal(true)
    }

    function init() {
      const storedLoginTime = sessionStorage.getItem('admin_session_start')

      if (!storedLoginTime) {
        endSession()
        return
      }

      loginTimeRef.current = parseInt(storedLoginTime, 10)
      const elapsed = Date.now() - loginTimeRef.current
      const remaining = Math.max(0, SESSION_DURATION_MS - elapsed)

      if (remaining <= 0) {
        endSession()
        return
      }

      timerRef.current = setTimeout(endSession, remaining)

      intervalRef.current = setInterval(() => {
        if (Date.now() - loginTimeRef.current >= SESSION_DURATION_MS) {
          endSession()
        }
      }, CHECK_INTERVAL_MS)

      setLoading(false)
    }

    init()

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  const handleRedirect = () => {
    setShowModal(false)
    router.push('/admin/login')
  }

  if (loading) return null

  if (showModal) {
    return (
      <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full mx-4 p-8 text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
            <Clock className="h-8 w-8 text-matheo-red" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Sesión Caducada
          </h2>
          <p className="text-gray-500 mb-8 text-sm">
            Tu sesión ha expirado. Inicia sesión nuevamente para continuar.
          </p>
          <Button
            onClick={handleRedirect}
            className="w-full bg-matheo-red hover:bg-matheo-red/90 text-white shadow-lg shadow-matheo-red/25"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Iniciar Sesión
          </Button>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
