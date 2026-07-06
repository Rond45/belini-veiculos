import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { VeiculoComRelacoes } from '@/types/database.types'

export interface FiltrosVeiculos {
  marcaId?: string
  precoMin?: number
  precoMax?: number
  anoMin?: number
  combustivel?: string
  busca?: string
}

export function useVeiculos(filtros?: FiltrosVeiculos) {
  const [data, setData] = useState<VeiculoComRelacoes[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function buscar() {
      setLoading(true)
      setError(null)
      try {
        let query = supabase
          .from('veiculos')
          .select('*, marca:marcas(*), modelo:modelos(*), fotos:veiculo_fotos(*)')
          .neq('status', 'vendido')
          .order('destaque', { ascending: false })
          .order('created_at', { ascending: false })

        if (filtros?.marcaId) query = query.eq('marca_id', filtros.marcaId)
        if (filtros?.precoMin) query = query.gte('preco', filtros.precoMin)
        if (filtros?.precoMax) query = query.lte('preco', filtros.precoMax)
        if (filtros?.anoMin) query = query.gte('ano_modelo', filtros.anoMin)
        if (filtros?.combustivel) query = query.eq('combustivel', filtros.combustivel)

        const { data, error } = await query
        if (error) throw error
        setData((data as unknown as VeiculoComRelacoes[]) ?? [])
      } catch (e) {
        console.error('Erro ao buscar veículos:', e)
        setError('Não foi possível carregar os veículos. Tente novamente.')
      } finally {
        setLoading(false)
      }
    }
    buscar()
  }, [JSON.stringify(filtros)])

  return { data, loading, error }
}
