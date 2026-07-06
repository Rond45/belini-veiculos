import { useVeiculos } from '@/hooks/useVeiculos'
import { Loading } from '@/components/ui/Loading'
import { MensagemErro } from '@/components/ui/MensagemErro'
import { EstadoVazio } from '@/components/ui/EstadoVazio'
import { CardVeiculo } from '@/components/veiculos/CardVeiculo'

export function Catalogo() {
  // TODO: conectar filtros laterais (marca, preço, ano, combustível) ao hook useVeiculos
  const { data: veiculos, loading, error } = useVeiculos()

  return (
    <div className="px-6 py-10">
      <h1 className="text-2xl font-semibold mb-6">Estoque completo</h1>

      {loading && <Loading />}
      {error && <MensagemErro mensagem={error} />}
      {!loading && !error && veiculos.length === 0 && (
        <EstadoVazio mensagem="Nenhum veículo encontrado com esses filtros." />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {veiculos.map((veiculo) => (
          <CardVeiculo key={veiculo.id} veiculo={veiculo} />
        ))}
      </div>
    </div>
  )
}
