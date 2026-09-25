'use client'

import { useState } from 'react'
import { FileText, Lock, Loader2, ShieldAlert } from 'lucide-react'
import { verifyDocPin } from '@/lib/actions/documento'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const DOCUMENT_URL = '/api/documento'

export default function PrivadoView() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Se abre antes del await para que el navegador no lo bloquee como popup
    const tab = window.open('', '_blank')

    const formData = new FormData()
    formData.append('pin', pin)

    const result = await verifyDocPin(formData)

    setLoading(false)
    setPin('')

    if (result?.error) {
      tab?.close()
      setError(result.error)
      return
    }

    if (tab) {
      tab.location.href = DOCUMENT_URL
    } else {
      window.location.href = DOCUMENT_URL
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#f6f8fc] p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-rose-200/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-sky-200/30 blur-3xl" />
      </div>

      <Card className="relative w-full max-w-sm animate-slide-up-fade border border-gray-100 bg-white/80 shadow-xl shadow-gray-200/50 backdrop-blur-xl rounded-2xl">
        <CardHeader className="text-center pt-8 pb-2">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-matheo-red/10">
            <FileText className="h-6 w-6 text-matheo-red" />
          </div>
          <CardTitle className="text-xl font-bold text-gray-900">
            Documento restringido
          </CardTitle>
          <CardDescription className="text-sm text-gray-500">
            Ingresá el PIN de 6 dígitos para ver el documento
          </CardDescription>
        </CardHeader>

        <CardContent className="px-7 pb-7 pt-3">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2.5 rounded-xl bg-red-50/80 px-4 py-3 text-sm text-red-700 ring-1 ring-red-100">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="pin" className="text-sm font-medium text-gray-700">
                PIN de acceso
              </Label>
              <Input
                id="pin"
                type="password"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="[0-9]{6}"
                maxLength={6}
                placeholder="••••••"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="text-center text-lg tracking-[0.5em] border-gray-200 bg-white/80 focus-visible:ring-matheo-red/30 rounded-xl"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full rounded-xl bg-matheo-red py-2.5 text-sm font-semibold text-white shadow-sm shadow-matheo-red/20 transition-all duration-200 hover:bg-matheo-red/90 hover:shadow-md hover:shadow-matheo-red/30"
              disabled={loading || pin.length !== 6}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verificando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Lock className="h-4 w-4" />
                  Ver documento
                </span>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
