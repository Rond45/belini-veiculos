import { useState } from 'react'
import { Trash2, Phone } from 'lucide-react'
import { useAdminLeads } from '@/hooks/useAdminLeads'
import { Loading } from '@/components/ui/Loading'
import { MensagemErro } from '@/components/ui/MensagemErro'
import { EstadoVazio } from '@/components/ui/EstadoVazio'
import type { StatusLead, OrigemLead } from '@/types/database.types'

const STATUS_LABEL: Record<StatusLead, { label: string; cor: string }> = {
  novo: { label: 'Novo', cor: 'text-signal' },
  em_atendimento: { label: 'Em atendimento', cor: 'text-blue-400' },
  convertido: { label: 'Convertido', cor: 'text-green-400' },
  perdido: { label: 'Perdido', cor: 'text-[var(--color-muted-foreground)]' },
}

const ORIGEM_LABEL: Record<OrigemLead, string> = {
  whatsapp_veiculo: 'WhatsApp (veículo)',
  whatsapp_geral: 'WhatsApp (geral)',
  simulador_financiamento: 'Simulador',
  formulario_contato: 'Formulário de contato',
}

export function AdminLeads() {
  const { data: leads, loading, error, atualizarStatus, excluir } = useAdminLeads()
  const [filtro, setFiltro] = useState<StatusLead | 'todos'>('todos')

  const filtrados = filtro === 'todos' ? leads : leads.filter((l) => l.status === filtro)

  async function handleExcluir(id: string) {
    if (!confirm('Excluir este lead definitivamente?')) return
    try {
      await excluir(id)
    } catch (e) {
      console.error(e)
      alert('Não foi possível excluir.')
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="display text-2xl">Leads</h1>
        <div className="flex gap-2 flex-wrap">
          {(['todos', 'novo', 'em_atendimento', 'convertido', 'perdido'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`rounded-sm px-3 py-1.5 text-xs font-tech uppercase tracking-wide border ${
                filtro === f
                  ? 'border-signal bg-signal/10 text-signal'
                  : 'border-[var(--color-border)] text-[var(--color-muted-foreground)] hover:border-signal/40'
              }`}
            >
              {f === 'todos' ? 'Todos' : STATUS_LABEL[f].label}
            </button>
          ))}
        </div>
      </div>

      {loading && <Loading />}
      {error && <MensagemErro mensagem={error} />}
      {!loading && !error && filtrados.length === 0 && (
        <EstadoVazio mensagem="Nenhum lead encontrado com esse filtro." />
      )}

      {!loading && !error && filtrados.length > 0 && (
        <div className="flex flex-col gap-3">
          {filtrados.map((lead) => (
            <div key={lead.id} className="rounded-md border border-[var(--color-border)] bg-surface-gradient p-4 flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="flex items-center gap-2">
                  <p className="font-medium">{lead.nome || 'Sem nome'}</p>
                  <span className="font-tech text-[10px] text-[var(--color-muted-foreground)] uppercase">
                    {ORIGEM_LABEL[lead.origem]}
                  </span>
                </div>
                <p className="font-tech text-sm text-[var(--color-muted-foreground)] flex items-center gap-1 mt-1">
                  <Phone size={12} /> {lead.telefone}
                </p>
                {lead.veiculo && (
                  <p className="text-xs text-[var(--color-muted-foreground)] mt-1">
                    Veículo: {lead.veiculo.marca?.nome} {lead.veiculo.modelo?.nome}
                  </p>
                )}
                {lead.mensagem && (
                  <p className="text-sm mt-2 text-[var(--color-foreground)]/90">{lead.mensagem}</p>
                )}
                <p className="font-tech text-[10px] text-[var(--color-muted-foreground)] mt-2">
                  {new Date(lead.created_at).toLocaleString('pt-BR')}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={lead.status}
                  onChange={(e) => atualizarStatus(lead.id, e.target.value as StatusLead)}
                  className={`rounded-sm border border-[var(--color-input)] bg-[var(--color-background)] px-2 py-2 text-xs font-tech uppercase outline-none focus:border-signal ${STATUS_LABEL[lead.status].cor}`}
                >
                  {Object.entries(STATUS_LABEL).map(([value, { label }]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
                <a
                  href={`https://wa.me/55${lead.telefone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-9 w-9 place-items-center rounded-sm border border-[var(--color-border)] hover:border-green-500/50 hover:text-green-500"
                  aria-label="Abrir WhatsApp"
                >
                  <Phone size={14} />
                </a>
                <button
                  onClick={() => handleExcluir(lead.id)}
                  className="grid h-9 w-9 place-items-center rounded-sm border border-[var(--color-border)] hover:border-[var(--color-destructive)]/50 hover:text-[var(--color-destructive)]"
                  aria-label="Excluir"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
