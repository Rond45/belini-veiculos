import { supabase } from '@/lib/supabase'
import type { VeiculoFoto } from '@/types/database.types'

const BUCKET = 'veiculos-fotos'

export async function uploadFotoVeiculo(veiculoId: string, arquivo: File, ordem: number, capa: boolean): Promise<VeiculoFoto> {
  const extensao = arquivo.name.split('.').pop() ?? 'jpg'
  const caminho = `${veiculoId}/${crypto.randomUUID()}.${extensao}`

  const { error: uploadError } = await supabase.storage.from(BUCKET).upload(caminho, arquivo, {
    cacheControl: '3600',
    upsert: false,
  })
  if (uploadError) throw uploadError

  const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(caminho)

  const { data, error } = await supabase
    .from('veiculo_fotos')
    .insert({ veiculo_id: veiculoId, url: urlData.publicUrl, ordem, capa })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function removerFotoVeiculo(foto: VeiculoFoto): Promise<void> {
  // Extrai o caminho dentro do bucket a partir da URL pública
  const marcador = `/object/public/${BUCKET}/`
  const indice = foto.url.indexOf(marcador)
  if (indice !== -1) {
    const caminho = foto.url.slice(indice + marcador.length)
    await supabase.storage.from(BUCKET).remove([caminho])
  }
  const { error } = await supabase.from('veiculo_fotos').delete().eq('id', foto.id)
  if (error) throw error
}

export async function definirCapa(veiculoId: string, fotoId: string): Promise<void> {
  await supabase.from('veiculo_fotos').update({ capa: false }).eq('veiculo_id', veiculoId)
  const { error } = await supabase.from('veiculo_fotos').update({ capa: true }).eq('id', fotoId)
  if (error) throw error
}
