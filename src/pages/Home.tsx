import { useVeiculos } from '@/hooks/useVeiculos'
import { Loading } from '@/components/ui/Loading'
import { MensagemErro } from '@/components/ui/MensagemErro'
import { EstadoVazio } from '@/components/ui/EstadoVazio'
import { CardVeiculo } from '@/components/veiculos/CardVeiculo'

export function Home() {
  const { data: destaques, loading, error } = useVeiculos()

  return (
    <div>
      <section className="border-b border-[var(--color-border)] px-6 py-16 text-center">
        <h1 className="text-4xl font-bold">
          BELINI <span className="text-[var(--color-primary)]">VEÍCULOS</span>
        </h1>
        <p className="mt-3 text-neutral-400">
          Veículos selecionados para quem não quer errar na compra.
        </p>
      </section>

      <section className="px-6 py-10">
        <h2 className="text-xl font-semibold mb-6">Destaques do estoque</h2>

        {loading && <Loading />}
        {error && <MensagemErro mensagem={error} />}
        {!loading && !error && destaques.length === 0 && (
          <EstadoVazio mensagem="Nenhum veículo disponível no momento." />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {destaques.slice(0, 8).map((veiculo) => (
            <CardVeiculo key={veiculo.id} veiculo={veiculo} />
          ))}
        </div>
      </section>
    </div>
  )
}
