import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Lead, StatusLead } from '@/types/database.types'

export interface LeadComVeiculo extends Lead {
  veiculo: { id: string; marca: { nome: string } | null; modelo: { nome: string } | null } | null
}

export function useAdminLeads() {
  const [data, setData] = useState<LeadComVeiculo[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const recarregar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*, veiculo:veiculos(id, marca:marcas(nome), modelo:modelos(nome))')
        .order('created_at', { ascending: false })
      if (error) throw error
      setData((data as unknown as LeadComVeiculo[]) ?? [])
    } catch (e) {
      console.error('Erro ao listar leads:', e)
      setError('Não foi possível carregar os leads.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { recarregar() }, [recarregar])

  async function atualizarStatus(id: string, status: StatusLead) {
    const { error } = await supabase.from('leads').update({ status }).eq('id', id)
    if (error) throw error
    await recarregar()
  }

  async function excluir(id: string) {
    const { error } = await supabase.from('leads').delete().eq('id', id)
    if (error) throw error
    await recarregar()
  }

  return { data, loading, error, recarregar, atualizarStatus, excluir }
}
