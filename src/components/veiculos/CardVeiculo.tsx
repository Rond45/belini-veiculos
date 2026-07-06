import { Link } from 'react-router-dom'
import type { VeiculoComRelacoes } from '@/types/database.types'

interface CardVeiculoProps {
  veiculo: VeiculoComRelacoes
}

function formatarPreco(preco: number) {
  return preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatarKm(km: number) {
  return `${km.toLocaleString('pt-BR')} km`
}

export function CardVeiculo({ veiculo }: CardVeiculoProps) {
  const capa = veiculo.fotos?.find((f) => f.capa) ?? veiculo.fotos?.[0]

  return (
    <Link
      to={`/veiculo/${veiculo.id}`}
      className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] overflow-hidden hover:border-[var(--color-primary)] transition-colors block"
    >
      <div className="aspect-video bg-neutral-800 flex items-center justify-center overflow-hidden">
        {capa ? (
          <img src={capa.url} alt={`${veiculo.marca?.nome} ${veiculo.modelo?.nome}`} className="w-full h-full object-cover" />
        ) : (
          <span className="text-neutral-500 text-sm">Sem foto</span>
        )}
      </div>
      <div className="p-4">
        {veiculo.status === 'reservado' && (
          <span className="text-xs font-medium text-[var(--color-primary)] uppercase">Reservado</span>
        )}
        <h3 className="font-semibold mt-1">
          {veiculo.marca?.nome} {veiculo.modelo?.nome}
        </h3>
        <p className="text-sm text-neutral-400">{veiculo.versao}</p>
        <div className="flex items-center justify-between mt-3 text-sm text-neutral-400">
          <span>{veiculo.ano_fabricacao}/{veiculo.ano_modelo}</span>
          <span>{formatarKm(veiculo.km)}</span>
        </div>
        <p className="text-lg font-bold text-[var(--color-primary)] mt-2">
          {formatarPreco(veiculo.preco)}
        </p>
      </div>
    </Link>
  )
}
