import { Suspense } from 'react'
import NotFoundPage from '@/pages/NotFoundPage'

export default function NotFound() {
  return (
    <Suspense fallback={null}>
      <NotFoundPage />
    </Suspense>
  )
}
