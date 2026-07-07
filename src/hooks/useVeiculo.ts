import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { VeiculoComRelacoes } from '@/types/database.types'

export function useVeiculo(id: string | undefined) {
  const [data, setData] = useState<VeiculoComRelacoes | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!id) return
    let ativo = true

    async function buscar() {
      setLoading(true)
      setError(null)
      setNotFound(false)
      try {
        const { data, error } = await supabase
          .from('veiculos')
          .select('*, marca:marcas(*), modelo:modelos(*), fotos:veiculo_fotos(*)')
          .eq('id', id)
          .maybeSingle()

        if (error) throw error
        if (!ativo) return

        if (!data) {
          setNotFound(true)
        } else {
          setData(data as unknown as VeiculoComRelacoes)
        }
      } catch (e) {
        console.error('Erro ao buscar veículo:', e)
        if (ativo) setError('Não foi possível carregar este veículo.')
      } finally {
        if (ativo) setLoading(false)
      }
    }
    buscar()
    return () => { ativo = false }
  }, [id])

  return { data, loading, error, notFound }
}
