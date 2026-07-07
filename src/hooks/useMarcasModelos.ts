import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Marca, Modelo } from '@/types/database.types'

export function useMarcasModelos() {
  const [marcas, setMarcas] = useState<Marca[]>([])
  const [modelos, setModelos] = useState<Modelo[]>([])
  const [loading, setLoading] = useState(true)

  const recarregar = useCallback(async () => {
    setLoading(true)
    const [m, mo] = await Promise.all([
      supabase.from('marcas').select('*').order('nome'),
      supabase.from('modelos').select('*').order('nome'),
    ])
    setMarcas(m.data ?? [])
    setModelos(mo.data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { recarregar() }, [recarregar])

  async function criarMarca(nome: string): Promise<Marca | null> {
    const { data, error } = await supabase.from('marcas').insert({ nome }).select().single()
    if (error) {
      console.error('Erro ao criar marca:', error)
      return null
    }
    await recarregar()
    return data
  }

  async function criarModelo(marcaId: string, nome: string): Promise<Modelo | null> {
    const { data, error } = await supabase.from('modelos').insert({ marca_id: marcaId, nome }).select().single()
    if (error) {
      console.error('Erro ao criar modelo:', error)
      return null
    }
    await recarregar()
    return data
  }

  return { marcas, modelos, loading, criarMarca, criarModelo, recarregar }
}
