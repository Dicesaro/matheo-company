'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useFormStatus } from 'react-dom'

function SubmitButton({ label = 'Guardar' }: { label?: string }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
    >
      {pending ? 'Guardando...' : label}
    </button>
  )
}

interface FormWrapperProps {
  action: (formData: FormData) => Promise<{ error?: string; success?: boolean }>
  redirectOnSuccess?: string
  children: React.ReactNode
  submitLabel?: string
}

export default function FormWrapper({
  action,
  redirectOnSuccess,
  children,
  submitLabel,
}: FormWrapperProps) {
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    const result = await action(formData)

    if (result?.error) {
      toast.error(result.error)
      return
    }

    toast.success('Guardado correctamente')
    if (redirectOnSuccess) {
      router.push(redirectOnSuccess)
      router.refresh()
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {children}
    </form>
  )
}
