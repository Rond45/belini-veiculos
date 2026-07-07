import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Configuracoes } from '@/types/database.types'

export function useConfiguracoes() {
  const [data, setData] = useState<Configuracoes | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase.from('configuracoes').select('*').eq('id', 1).single()
      setData(data ?? null)
      setLoading(false)
    }
    carregar()
  }, [])

  return { data, loading }
}
