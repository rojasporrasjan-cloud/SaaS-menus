import { Outlet } from 'react-router-dom'
import { ErrorBoundary } from '@shared/ui/components/ErrorBoundary'

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <Outlet />
    </ErrorBoundary>
  )
}
