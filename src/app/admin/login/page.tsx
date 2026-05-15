'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { createBrowserClient } from '@supabase/ssr'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from '@/components/ui/card'
import { AlertCircle, HardHat } from 'lucide-react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()!

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

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
    <form onSubmit={handleLogin} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-gray-700">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="admin@matheo.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border-gray-200 focus-visible:ring-matheo-red"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-gray-700">Contraseña</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border-gray-200 focus-visible:ring-matheo-red"
          required
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-matheo-red hover:bg-matheo-red/90 shadow-lg shadow-matheo-red/25"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <HardHat className="h-4 w-4 animate-bounce" />
            Ingresando...
          </span>
        ) : (
          'Ingresar'
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-900 to-black p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-matheo-red/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-matheo-blue/10 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-sm border-0 bg-white/95 shadow-2xl backdrop-blur-sm">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex items-center justify-center">
            <Image
              src="https://res.cloudinary.com/ddtmb8l1k/image/upload/v1774823626/MATHEO_logo_qneg7d.svg"
              alt="MATHEO"
              width={180}
              height={60}
              className="h-auto"
              priority
            />
          </div>
          <CardTitle className="text-xl text-gray-900">Panel de Administración</CardTitle>
          <CardDescription>Ingresa tus credenciales</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  )
}
