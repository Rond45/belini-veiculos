import { useVeiculos } from '@/hooks/useVeiculos'
import { Loading } from '@/components/ui/Loading'
import { MensagemErro } from '@/components/ui/MensagemErro'
import { EstadoVazio } from '@/components/ui/EstadoVazio'
import { CardVeiculo } from '@/components/veiculos/CardVeiculo'

export function Home() {
  const { data: veiculos, loading, error } = useVeiculos()
  const destaques = veiculos.filter((v) => v.destaque).slice(0, 8)
  const totalDisponivel = veiculos.length

  return (
    <div>
      <section className="relative overflow-hidden border-b border-[var(--color-aco)]">
        {/* Assinatura: bloco diagonal de sinalização, sutil, atrás do conteúdo */}
        <div className="faixa-cautela absolute -right-24 -top-24 w-72 h-72 opacity-[0.07] rotate-12 pointer-events-none" />

        <div className="relative px-6 py-20 max-w-4xl mx-auto text-center">
          <p className="font-specs text-xs tracking-[0.2em] text-[var(--color-cautela)] mb-4">
            JI-PARANÁ · RO — COMPRA · VENDA · CONSIGNADO
          </p>
          <h1 className="display text-5xl sm:text-6xl leading-[0.95]">
            VEÍCULOS SELECIONADOS
            <br />
            <span className="text-[var(--color-cautela)]">PARA QUEM NÃO QUER ERRAR</span>
          </h1>
          <p className="mt-6 text-[var(--color-cinza-medio)] text-lg">
            Cada carro passa por inspeção antes de chegar ao pátio. Sem letras miúdas, sem surpresa na entrega.
          </p>

          {!loading && !error && (
            <div className="mt-10 inline-flex items-center gap-3 border border-[var(--color-aco)] rounded-full px-5 py-2.5">
              <span className="font-specs text-2xl text-[var(--color-cautela)] font-bold">{totalDisponivel}</span>
              <span className="text-sm text-[var(--color-cinza-medio)]">veículos disponíveis agora no pátio</span>
            </div>
          )}
        </div>
      </section>

      <div className="divisor-diagonal" />

      <section className="px-6 py-14 max-w-7xl mx-auto">
        <h2 className="display text-2xl mb-8">Destaques do estoque</h2>

        {loading && <Loading />}
        {error && <MensagemErro mensagem={error} />}
        {!loading && !error && destaques.length === 0 && (
          <EstadoVazio mensagem="Nenhum veículo em destaque no momento." />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destaques.map((veiculo) => (
            <CardVeiculo key={veiculo.id} veiculo={veiculo} />
          ))}
        </div>
      </section>
    </div>
  )
}
