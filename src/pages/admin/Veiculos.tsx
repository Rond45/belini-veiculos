import { Link } from 'react-router-dom'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useAdminVeiculos } from '@/hooks/useAdminVeiculos'
import { Loading } from '@/components/ui/Loading'
import { MensagemErro } from '@/components/ui/MensagemErro'
import { EstadoVazio } from '@/components/ui/EstadoVazio'
import { formatBRL, formatKM } from '@/lib/formatters'

const STATUS_LABEL: Record<string, { label: string; cor: string }> = {
  disponivel: { label: 'Disponível', cor: 'text-[var(--color-signal)]' },
  reservado: { label: 'Reservado', cor: 'text-yellow-400' },
  vendido: { label: 'Vendido', cor: 'text-[var(--color-muted-foreground)]' },
}

export function AdminVeiculos() {
  const { data: veiculos, loading, error, excluir } = useAdminVeiculos()
  const [excluindo, setExcluindo] = useState<string | null>(null)

  async function handleExcluir(id: string, nome: string) {
    if (!confirm(`Excluir "${nome}" definitivamente? Essa ação não pode ser desfeita.`)) return
    setExcluindo(id)
    try {
      await excluir(id)
    } catch (e) {
      console.error(e)
      alert('Não foi possível excluir. Tente novamente.')
    } finally {
      setExcluindo(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="display text-2xl">Veículos</h1>
        <Link
          to="/admin/veiculos/novo"
          className="inline-flex items-center gap-2 rounded-sm bg-signal-gradient px-4 py-2.5 text-sm font-semibold text-[var(--color-primary-foreground)] shadow-signal"
        >
          <Plus size={16} /> Novo veículo
        </Link>
      </div>

      {loading && <Loading />}
      {error && <MensagemErro mensagem={error} />}
      {!loading && !error && veiculos.length === 0 && (
        <EstadoVazio mensagem="Nenhum veículo cadastrado ainda." />
      )}

      {!loading && !error && veiculos.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/50 text-left">
                <th className="p-3 font-tech text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">Foto</th>
                <th className="p-3 font-tech text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">Veículo</th>
                <th className="p-3 font-tech text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">Ano/KM</th>
                <th className="p-3 font-tech text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">Preço</th>
                <th className="p-3 font-tech text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">Status</th>
                <th className="p-3 font-tech text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">Destaque</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {veiculos.map((v) => {
                const capa = v.fotos?.find((f) => f.capa) ?? v.fotos?.[0]
                const status = STATUS_LABEL[v.status]
                return (
                  <tr key={v.id} className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-surface)]/30">
                    <td className="p-3">
                      <div className="h-12 w-16 rounded-sm overflow-hidden bg-[var(--color-surface)] flex items-center justify-center">
                        {capa ? (
                          <img src={capa.url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="font-tech text-[9px] text-[var(--color-muted-foreground)]">SEM FOTO</span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      <p className="font-medium">{v.marca?.nome} {v.modelo?.nome}</p>
                      <p className="text-xs text-[var(--color-muted-foreground)]">{v.versao}</p>
                    </td>
                    <td className="p-3 font-tech text-xs whitespace-nowrap">
                      {v.ano_fabricacao}/{v.ano_modelo} · {formatKM(v.km)}
                    </td>
                    <td className="p-3 font-tech text-sm text-signal whitespace-nowrap">{formatBRL(v.preco)}</td>
                    <td className="p-3">
                      <span className={`font-tech text-xs uppercase ${status?.cor}`}>{status?.label}</span>
                    </td>
                    <td className="p-3">{v.destaque ? '★' : '—'}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/admin/veiculos/${v.id}`}
                          className="grid h-8 w-8 place-items-center rounded-sm border border-[var(--color-border)] hover:border-signal/50 hover:text-signal"
                          aria-label="Editar"
                        >
                          <Pencil size={14} />
                        </Link>
                        <button
                          onClick={() => handleExcluir(v.id, `${v.marca?.nome} ${v.modelo?.nome}`)}
                          disabled={excluindo === v.id}
                          className="grid h-8 w-8 place-items-center rounded-sm border border-[var(--color-border)] hover:border-[var(--color-destructive)]/50 hover:text-[var(--color-destructive)] disabled:opacity-40"
                          aria-label="Excluir"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
