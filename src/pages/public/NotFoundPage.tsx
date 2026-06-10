import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-svh gap-4">
      <h1 className="text-4xl font-bold text-surface-800">404</h1>
      <p className="text-surface-500">Página no encontrada</p>
      <Link to="/" className="text-brand-500 hover:text-brand-600 underline">
        Volver al inicio
      </Link>
    </div>
  )
}
