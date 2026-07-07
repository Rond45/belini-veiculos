import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { VeiculoComRelacoes, Veiculo } from '@/types/database.types'

export function useAdminVeiculos() {
  const [data, setData] = useState<VeiculoComRelacoes[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const recarregar = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data, error } = await supabase
        .from('veiculos')
        .select('*, marca:marcas(*), modelo:modelos(*), fotos:veiculo_fotos(*)')
        .order('created_at', { ascending: false })
      if (error) throw error
      setData((data as unknown as VeiculoComRelacoes[]) ?? [])
    } catch (e) {
      console.error('Erro ao listar veículos (admin):', e)
      setError('Não foi possível carregar o estoque.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { recarregar() }, [recarregar])

  async function criar(payload: Partial<Veiculo>) {
    const { data, error } = await supabase.from('veiculos').insert(payload).select().single()
    if (error) throw error
    await recarregar()
    return data
  }

  async function atualizar(id: string, payload: Partial<Veiculo>) {
    const { error } = await supabase.from('veiculos').update(payload).eq('id', id)
    if (error) throw error
    await recarregar()
  }

  async function excluir(id: string) {
    const { error } = await supabase.from('veiculos').delete().eq('id', id)
    if (error) throw error
    await recarregar()
  }

  async function definirDestaqueSemana(id: string) {
    // Garante que só exista um "destaque da semana" por vez
    const { error: erroLimpar } = await supabase.from('veiculos').update({ destaque_semana: false }).eq('destaque_semana', true)
    if (erroLimpar) throw erroLimpar
    const { error } = await supabase.from('veiculos').update({ destaque_semana: true }).eq('id', id)
    if (error) throw error
    await recarregar()
  }

  async function removerDestaqueSemana(id: string) {
    const { error } = await supabase.from('veiculos').update({ destaque_semana: false }).eq('id', id)
    if (error) throw error
    await recarregar()
  }

  return { data, loading, error, recarregar, criar, atualizar, excluir, definirDestaqueSemana, removerDestaqueSemana }
}
