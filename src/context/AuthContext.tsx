import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { AdminUser } from '@/types/database.types'

interface AuthContextValue {
  user: User | null
  perfil: AdminUser | null
  loading: boolean
}

const AuthContext = createContext<AuthContextValue>({ user: null, perfil: null, loading: true })

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [perfil, setPerfil] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let ativo = true

    async function carregarPerfil(userId: string) {
      const { data } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', userId)
        .single()
      if (ativo) setPerfil(data ?? null)
    }

    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!ativo) return
      setUser(session?.user ?? null)
      if (session?.user) {
        await carregarPerfil(session.user.id)
      }
      if (ativo) setLoading(false)
    }
    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await carregarPerfil(session.user.id)
        } else {
          setPerfil(null)
        }
        if (ativo) setLoading(false)
      }
    )

    return () => {
      ativo = false
      subscription.unsubscribe()
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, perfil, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
