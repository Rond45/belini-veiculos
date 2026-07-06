import { Link } from 'react-router-dom'
import type { VeiculoComRelacoes } from '@/types/database.types'

interface CardVeiculoProps {
  veiculo: VeiculoComRelacoes
}

function formatarPreco(preco: number) {
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

function formatarKm(km: number) {
  return `${km.toLocaleString('pt-BR')} km`
}

const rotuloStatus: Record<string, { label: string; cor: string }> = {
  reservado: { label: 'Reservado', cor: 'text-[var(--color-cautela)]' },
  vendido: { label: 'Vendido', cor: 'text-[var(--color-cinza-medio)]' },
}

export function CardVeiculo({ veiculo }: CardVeiculoProps) {
  const capa = veiculo.fotos?.find((f) => f.capa) ?? veiculo.fotos?.[0]
  const status = rotuloStatus[veiculo.status]

  return (
    <Link
      to={`/veiculo/${veiculo.id}`}
      className="group rounded-md border border-[var(--color-aco)] bg-[var(--color-pneu)] overflow-hidden hover:border-[var(--color-cautela)] transition-colors block"
    >
      <div className="relative aspect-video bg-[var(--color-asfalto)] flex items-center justify-center overflow-hidden">
        {capa ? (
          <img
            src={capa.url}
            alt={`${veiculo.marca?.nome} ${veiculo.modelo?.nome}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-[var(--color-cinza-medio)] text-sm font-specs">SEM FOTO</span>
        )}

        {veiculo.destaque && (
          <div className="absolute top-3 -left-9 -rotate-45 faixa-cautela text-[var(--color-asfalto)] text-[10px] font-bold font-display tracking-wider w-32 text-center py-0.5">
            DESTAQUE
          </div>
        )}
      </div>

      <div className="p-4">
        {status && (
          <span className={`font-specs text-xs uppercase tracking-wide ${status.cor}`}>{status.label}</span>
        )}
        <h3 className="display text-base leading-tight mt-1">
          {veiculo.marca?.nome} {veiculo.modelo?.nome}
        </h3>
        <p className="text-sm text-[var(--color-cinza-medio)] truncate">{veiculo.versao}</p>

        <div className="flex items-center justify-between mt-3 font-specs text-xs text-[var(--color-cinza-medio)] border-t border-[var(--color-aco)] pt-3">
          <span>{veiculo.ano_fabricacao}/{veiculo.ano_modelo}</span>
          <span>{formatarKm(veiculo.km)}</span>
        </div>

        <p className="font-specs text-xl font-bold text-[var(--color-cautela)] mt-3">
          {formatarPreco(veiculo.preco)}
        </p>
      </div>
    </Link>
  )
}
