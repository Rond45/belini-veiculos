import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { User } from '@supabase/supabase-js'
import type { AdminUser } from '@/types/database.types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [perfil, setPerfil] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregarPerfil(userId: string) {
      const { data } = await supabase
        .from('admin_users')
        .select('*')
        .eq('id', userId)
        .single()
      setPerfil(data ?? null)
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) carregarPerfil(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) carregarPerfil(session.user.id)
        else setPerfil(null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return { user, perfil, loading }
}
