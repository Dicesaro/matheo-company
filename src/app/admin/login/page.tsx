'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { getBrowserClient } from '@/lib/supabase-browser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card'
import { AlertCircle, HardHat, Lock } from 'lucide-react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()!

  const supabase = getBrowserClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(
        authError.message === 'Invalid login credentials'
          ? 'Credenciales inválidas'
          : 'Error al iniciar sesión',
      )
      setLoading(false)
      return
    }

    sessionStorage.setItem('admin_session_start', Date.now().toString())

    const redirectTo = searchParams?.get('redirect') || '/admin'
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <form onSubmit={handleLogin} className="space-y-5">
      {error && (
        <div className="flex items-center gap-2.5 rounded-xl bg-red-50/80 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium text-gray-700">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="correo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-gray-200 bg-white/80 focus-visible:ring-matheo-red/30 rounded-xl"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-medium text-gray-700">
          Contraseña
        </Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-gray-200 bg-white/80 focus-visible:ring-matheo-red/30 rounded-xl"
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full rounded-xl bg-matheo-red py-2.5 text-sm font-semibold text-white shadow-sm shadow-matheo-red/20 transition-all duration-200 hover:bg-matheo-red/90 hover:shadow-md hover:shadow-matheo-red/30"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <HardHat className="h-4 w-4 animate-bounce" />
            Ingresando...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Ingresar
          </span>
        )}
      </Button>
    </form>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageContent />
    </Suspense>
  )
}

function LoginPageContent() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#f6f8fc] p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-rose-200/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-sm animate-slide-up-fade border border-gray-100 bg-white/80 shadow-xl shadow-gray-200/50 backdrop-blur-xl rounded-2xl">
        <CardHeader className="text-center pt-8 pb-2">
          <div className="mx-auto mb-5 flex items-center justify-center">
            <Image
              src="https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774823626/MATHEO_logo_qneg7d.svg"
              alt="MATHEO"
              width={180}
              height={60}
              className="h-auto"
              priority
            />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            Panel de Administración
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Ingresa tus credenciales para acceder
          </CardDescription>
        </CardHeader>
        <CardContent className="px-7 pb-7 pt-3">
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
