import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useAdminAuthStore } from '../../store/adminAuthStore'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading, checkAuth } = useAdminAuthStore()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500">Verifying session...</div>
      </div>
    )
  }

  if (!isLoggedIn) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}
