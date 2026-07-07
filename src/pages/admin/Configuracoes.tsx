import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loading } from '@/components/ui/Loading'
import { MensagemErro } from '@/components/ui/MensagemErro'
import type { Configuracoes } from '@/types/database.types'

export function AdminConfiguracoes() {
  const [config, setConfig] = useState<Configuracoes | null>(null)
  const [loading, setLoading] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [salvo, setSalvo] = useState(false)

  useEffect(() => {
    async function carregar() {
      const { data, error } = await supabase.from('configuracoes').select('*').eq('id', 1).single()
      if (error) {
        setErro('Não foi possível carregar as configurações.')
      } else {
        setConfig(data)
      }
      setLoading(false)
    }
    carregar()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!config) return
    setSalvando(true)
    setErro(null)
    setSalvo(false)
    try {
      const { error } = await supabase
        .from('configuracoes')
        .update({
          nome_loja: config.nome_loja,
          endereco: config.endereco,
          telefone_whatsapp_principal: config.telefone_whatsapp_principal,
          instagram_url: config.instagram_url,
          sobre_texto: config.sobre_texto,
        })
        .eq('id', 1)
      if (error) throw error
      setSalvo(true)
    } catch (err) {
      console.error('Erro ao salvar configurações:', err)
      setErro('Não foi possível salvar. Tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  if (loading) return <Loading />
  if (!config) return <MensagemErro mensagem={erro ?? 'Configurações não encontradas.'} />

  return (
    <div className="max-w-2xl">
      <h1 className="display text-2xl mb-6">Configurações gerais</h1>

      {erro && <div className="mb-4"><MensagemErro mensagem={erro} /></div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <Label>Nome da loja</Label>
          <input
            value={config.nome_loja}
            onChange={(e) => setConfig({ ...config, nome_loja: e.target.value })}
            className={campoClasse}
          />
        </div>

        <div>
          <Label>Endereço</Label>
          <input
            value={config.endereco ?? ''}
            onChange={(e) => setConfig({ ...config, endereco: e.target.value })}
            placeholder="Av. Transcontinental, 794 — Primavera, Ji-Paraná/RO"
            className={campoClasse}
          />
        </div>

        <div>
          <Label>WhatsApp principal (com DDD, só números)</Label>
          <input
            value={config.telefone_whatsapp_principal ?? ''}
            onChange={(e) => setConfig({ ...config, telefone_whatsapp_principal: e.target.value })}
            placeholder="5569900000000"
            className={campoClasse}
          />
          <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
            Este número já alimenta o botão flutuante de WhatsApp em todo o site público.
          </p>
        </div>

        <div>
          <Label>Instagram (URL completa)</Label>
          <input
            value={config.instagram_url ?? ''}
            onChange={(e) => setConfig({ ...config, instagram_url: e.target.value })}
            placeholder="https://www.instagram.com/beliniveiculos"
            className={campoClasse}
          />
        </div>

        <div>
          <Label>Texto institucional (usado na página Sobre)</Label>
          <textarea
            value={config.sobre_texto ?? ''}
            onChange={(e) => setConfig({ ...config, sobre_texto: e.target.value })}
            rows={4}
            className={campoClasse}
          />
        </div>

        {salvo && <p className="text-sm text-signal">Configurações salvas com sucesso.</p>}

        <div className="pt-2">
          <button
            type="submit"
            disabled={salvando}
            className="inline-flex items-center gap-2 rounded-sm bg-signal-gradient px-5 py-3 font-semibold text-[var(--color-primary-foreground)] shadow-signal disabled:opacity-60"
          >
            {salvando ? 'Salvando...' : 'Salvar configurações'}
          </button>
        </div>
      </form>
    </div>
  )
}

const campoClasse = 'w-full rounded-sm border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2.5 text-sm outline-none focus:border-signal'

function Label({ children }: { children: React.ReactNode }) {
  return <span className="mb-2 block font-tech text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">{children}</span>
}
