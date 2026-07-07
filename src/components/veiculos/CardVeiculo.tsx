import { Link } from 'react-router-dom'
import { ArrowUpRight, Fuel, Gauge, Settings2 } from 'lucide-react'
import type { VeiculoComRelacoes } from '@/types/database.types'
import { formatBRL, formatKM, COMBUSTIVEL_LABEL, CAMBIO_LABEL } from '@/lib/formatters'

interface CardVeiculoProps {
  veiculo: VeiculoComRelacoes
}

export function CardVeiculo({ veiculo }: CardVeiculoProps) {
  const capa = veiculo.fotos?.find((f) => f.capa) ?? veiculo.fotos?.[0]
  const combustivelLabel = veiculo.combustivel ? COMBUSTIVEL_LABEL[veiculo.combustivel] : '—'
  const cambioLabel = veiculo.cambio ? CAMBIO_LABEL[veiculo.cambio] : '—'

  return (
    <Link
      to={`/veiculo/${veiculo.id}`}
      className="group relative flex flex-col overflow-hidden rounded-md border border-[var(--color-border)] bg-surface-gradient shadow-card transition-all hover:-translate-y-1 hover:border-signal/50"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-black">
        {capa ? (
          <img
            src={capa.url}
            alt={`${veiculo.marca?.nome} ${veiculo.modelo?.nome}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <span className="font-tech text-xs text-[var(--color-muted-foreground)]">SEM FOTO</span>
          </div>
        )}
        <div className="absolute inset-x-0 top-0 flex items-start justify-between p-3">
          {veiculo.destaque && (
            <span className="rounded-sm bg-signal-gradient px-2 py-1 display text-[10px] font-semibold tracking-widest text-[var(--color-primary-foreground)] shadow-signal">
              DESTAQUE
            </span>
          )}
          <span className="ml-auto font-tech text-[11px] text-[var(--color-foreground)]/80 backdrop-blur-md bg-black/40 rounded-sm px-2 py-1">
            {veiculo.ano_fabricacao}/{veiculo.ano_modelo}
          </span>
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div>
          <p className="font-tech text-[11px] uppercase tracking-widest text-[var(--color-muted-foreground)]">
            {veiculo.marca?.nome}
          </p>
          <h3 className="mt-1 display text-xl leading-tight tracking-wide">
            {veiculo.modelo?.nome}
          </h3>
          <p className="mt-1 line-clamp-1 text-sm text-[var(--color-muted-foreground)]">{veiculo.versao}</p>
        </div>

        <dl className="grid grid-cols-3 gap-2 border-y border-[var(--color-border)] py-3 text-center">
          <Spec icon={<Gauge size={14} />} label="KM" value={formatKM(veiculo.km)} />
          <Spec icon={<Fuel size={14} />} label="Comb." value={combustivelLabel} />
          <Spec icon={<Settings2 size={14} />} label="Câmbio" value={cambioLabel.slice(0, 4)} />
        </dl>

        <div className="mt-auto flex items-end justify-between">
          <div>
            <p className="font-tech text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">À vista</p>
            <p className="font-tech text-xl font-semibold text-signal">{formatBRL(veiculo.preco)}</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-sm border border-[var(--color-border)] text-[var(--color-muted-foreground)] transition-all group-hover:border-signal group-hover:text-signal">
            <ArrowUpRight size={16} />
          </span>
        </div>
      </div>
    </Link>
  )
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="flex items-center gap-1 font-tech text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">
        {icon} {label}
      </span>
      <span className="font-tech text-xs text-[var(--color-foreground)]">{value}</span>
    </div>
  )
}
