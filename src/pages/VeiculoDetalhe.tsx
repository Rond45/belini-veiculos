import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Check, MessageCircle, Phone } from 'lucide-react'
import { useVeiculo } from '@/hooks/useVeiculo'
import { useConfiguracoes } from '@/hooks/useConfiguracoes'
import { Loading } from '@/components/ui/Loading'
import { MensagemErro } from '@/components/ui/MensagemErro'
import { formatBRL, formatKM, COMBUSTIVEL_LABEL, CAMBIO_LABEL, formatTelefoneExibicao } from '@/lib/formatters'

const WHATSAPP_PADRAO = '5569900000000'

export function VeiculoDetalhe() {
  const { id } = useParams<{ id: string }>()
  const { data: v, loading, error, notFound } = useVeiculo(id)
  const { data: config } = useConfiguracoes()
  const [foto, setFoto] = useState(0)

  if (loading) return <Loading />
  if (error) return <div className="mx-auto max-w-2xl px-5 py-24"><MensagemErro mensagem={error} /></div>

  if (notFound || !v) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-24 text-center">
        <p className="font-tech text-xs uppercase tracking-widest text-signal">Erro 404</p>
        <h1 className="mt-3 display text-4xl">Veículo indisponível</h1>
        <p className="mt-3 text-[var(--color-muted-foreground)]">Ele pode já ter sido vendido.</p>
        <Link to="/catalogo" className="mt-6 inline-flex rounded-sm bg-signal-gradient px-5 py-2.5 font-semibold text-[var(--color-primary-foreground)] shadow-signal">
          Ver estoque
        </Link>
      </div>
    )
  }

  const fotos = v.fotos?.length ? v.fotos : []
  const parcela = Math.round(v.preco / 60)
  const numeroWhats = config?.telefone_whatsapp_principal || WHATSAPP_PADRAO
  const whatsMsg = `Olá! Tenho interesse no ${v.marca?.nome} ${v.modelo?.nome} ${v.versao ?? ''} ${v.ano_fabricacao}/${v.ano_modelo}.`
  const whatsUrl = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(whatsMsg)}`

  return (
    <>
      <div className="mx-auto max-w-7xl px-5 pt-8 sm:px-6 lg:px-8">
        <Link to="/catalogo" className="inline-flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-signal">
          <ArrowLeft size={14} /> Voltar ao estoque
        </Link>
      </div>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-8 sm:px-6 lg:px-8 lg:grid-cols-[1.35fr_1fr]">
        {/* Galeria */}
        <div className="flex flex-col gap-3">
          <div className="relative overflow-hidden rounded-md border border-[var(--color-border)] bg-black shadow-card">
            {fotos.length ? (
              <img src={fotos[foto].url} alt={`${v.marca?.nome} ${v.modelo?.nome}`} className="aspect-[4/3] w-full object-cover" />
            ) : (
              <div className="aspect-[4/3] w-full flex items-center justify-center">
                <span className="font-tech text-sm text-[var(--color-muted-foreground)]">SEM FOTO</span>
              </div>
            )}
            {fotos.length > 0 && (
              <span className="absolute left-4 top-4 rounded-sm bg-black/60 px-2 py-1 font-tech text-[11px] backdrop-blur">
                {foto + 1} / {fotos.length}
              </span>
            )}
          </div>
          {fotos.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {fotos.map((f, i) => (
                <button
                  key={f.id}
                  onClick={() => setFoto(i)}
                  className={`overflow-hidden rounded-sm border transition-all ${i === foto ? 'border-signal' : 'border-[var(--color-border)] hover:border-signal/50'}`}
                >
                  <img src={f.url} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <aside className="flex flex-col gap-5">
          <div>
            <p className="font-tech text-[11px] uppercase tracking-[0.3em] text-[var(--color-muted-foreground)]">{v.marca?.nome}</p>
            <h1 className="mt-1 display text-3xl leading-tight tracking-tight sm:text-4xl md:text-5xl">{v.modelo?.nome}</h1>
            <p className="mt-2 text-lg text-[var(--color-muted-foreground)]">{v.versao}</p>
          </div>

          <div className="rounded-md border border-[var(--color-border)] bg-surface-gradient p-5 shadow-card">
            <p className="font-tech text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">À vista</p>
            <p className="font-tech text-3xl font-semibold text-signal sm:text-4xl break-words">{formatBRL(v.preco)}</p>
            <p className="mt-1 font-tech text-xs text-[var(--color-muted-foreground)]">ou 60x de {formatBRL(parcela)}*</p>

            <div className="mt-5 flex flex-col gap-2">
              <a href={whatsUrl} target="_blank" rel="noreferrer" className="inline-flex w-full items-center justify-center gap-2 rounded-sm bg-[#25D366] px-5 py-3 font-semibold text-black transition-transform hover:-translate-y-0.5">
                <MessageCircle size={18} /> Falar no WhatsApp
              </a>
              <a href={`tel:+${numeroWhats}`} className="inline-flex w-full items-center justify-center gap-2 rounded-sm border border-[var(--color-border)] bg-[var(--color-background)] px-5 py-3 font-semibold hover:border-signal/50">
                <Phone size={16} /> {formatTelefoneExibicao(numeroWhats)}
              </a>
            </div>
          </div>

          <div className="rounded-md border border-[var(--color-border)] bg-surface-gradient p-5">
            <p className="mb-4 font-tech text-[10px] uppercase tracking-[0.3em] text-signal">/ficha_técnica</p>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
              <Spec label="Ano" value={`${v.ano_fabricacao}/${v.ano_modelo}`} />
              <Spec label="KM" value={formatKM(v.km)} />
              <Spec label="Combustível" value={v.combustivel ? COMBUSTIVEL_LABEL[v.combustivel] : '—'} />
              <Spec label="Câmbio" value={v.cambio ? CAMBIO_LABEL[v.cambio] : '—'} />
              <Spec label="Cor" value={v.cor ?? '—'} />
              <Spec label="Portas" value={v.portas ? String(v.portas) : '—'} />
            </dl>
          </div>
        </aside>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 pb-24 sm:px-6 lg:px-8 lg:grid-cols-2">
        <div>
          <p className="font-tech text-[10px] uppercase tracking-[0.3em] text-signal">/descrição</p>
          <h2 className="mt-2 display text-3xl tracking-tight">Sobre este veículo</h2>
          <p className="mt-4 text-[var(--color-muted-foreground)]">{v.descricao ?? 'Descrição em breve.'}</p>
        </div>
        {v.opcionais && v.opcionais.length > 0 && (
          <div>
            <p className="font-tech text-[10px] uppercase tracking-[0.3em] text-signal">/opcionais</p>
            <h2 className="mt-2 display text-3xl tracking-tight">Itens de série</h2>
            <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {v.opcionais.map((op) => (
                <li key={op} className="flex items-center gap-2 rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)]/50 px-3 py-2 text-sm">
                  <Check size={14} className="text-signal" /> {op}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </>
  )
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col border-b border-[var(--color-border)] pb-2">
      <dt className="font-tech text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">{label}</dt>
      <dd className="font-tech text-sm text-[var(--color-foreground)]">{value}</dd>
    </div>
  )
}
