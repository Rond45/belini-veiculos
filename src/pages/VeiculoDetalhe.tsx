import { useParams } from 'react-router-dom'

export function VeiculoDetalhe() {
  const { id } = useParams()
  // TODO: buscar veículo por id, galeria de fotos, simulador de financiamento, botão WhatsApp fixo
  return (
    <div className="px-6 py-10">
      <p className="text-neutral-400">Detalhe do veículo {id} — em construção.</p>
    </div>
  )
}
