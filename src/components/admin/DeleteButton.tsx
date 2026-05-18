'use client'

import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { toast } from 'sonner'
import { useState } from 'react'

interface DeleteButtonProps {
  id: string
  action: (id: string) => Promise<{ error?: string; success?: boolean }>
  label?: string
}

export default function DeleteButton({ id, action, label }: DeleteButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleDelete = async () => {
    setLoading(true)
    const result = await action(id)

    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
      return
    }

    toast.success('Eliminado correctamente')
    setOpen(false)
    router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="ghost" size="icon" />}>
        <Trash2 className="h-4 w-4 text-gray-400 transition-colors hover:text-red-500" />
      </DialogTrigger>
      <DialogContent className="rounded-2xl border border-gray-100 shadow-xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-gray-900">
            Confirmar eliminación
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {label
              ? `¿Estás seguro de eliminar "${label}"? Esta acción no se puede deshacer.`
              : '¿Estás seguro de eliminar este elemento? Esta acción no se puede deshacer.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="rounded-xl border-gray-200"
          >
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
            className="rounded-xl"
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
