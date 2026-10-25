'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface FormWrapperProps {
  action: (formData: FormData) => Promise<{
    error?: string
    success?: boolean
    redirectTo?: string
  }>
  redirectOnSuccess?: string
  children: React.ReactNode
  submitLabel?: string
}

export default function FormWrapper({
  action,
  redirectOnSuccess,
  children,
}: FormWrapperProps) {
  const router = useRouter()
  const lock = useRef(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (lock.current) return
    lock.current = true
    setSubmitting(true)

    const formData = new FormData(e.currentTarget)

    try {
      const result = await action(formData)

      if (result?.error) {
        toast.error(result.error)
        return
      }

      toast.success('Guardado correctamente')
      const destination = result?.redirectTo ?? redirectOnSuccess
      if (destination) {
        router.push(destination)
        router.refresh()
      }
    } finally {
      lock.current = false
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <fieldset disabled={submitting} className="m-0 min-w-0 border-0 p-0">
        {children}
      </fieldset>
    </form>
  )
}
