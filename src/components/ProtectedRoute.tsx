import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Loading } from '@/components/ui/Loading'
import type { RoleAdmin } from '@/types/database.types'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: RoleAdmin[]
}

export function ProtectedRoute({ children, requiredRoles }: ProtectedRouteProps) {
  const { user, perfil, loading } = useAuth()

  if (loading) return <Loading />
  if (!user) return <Navigate to="/admin/login" replace />
  if (!perfil?.ativo) return <Navigate to="/admin/login" replace />
  if (requiredRoles && !requiredRoles.includes(perfil.role)) {
    return <Navigate to="/admin" replace />
  }

  return <>{children}</>
}
