interface EstadoVazioProps {
  mensagem: string
  acao?: { label: string; onClick: () => void }
}

export function EstadoVazio({ mensagem, acao }: EstadoVazioProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-neutral-400">
      <p>{mensagem}</p>
      {acao && (
        <button
          onClick={acao.onClick}
          className="mt-4 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] px-4 py-2 rounded-md font-medium hover:opacity-90"
        >
          {acao.label}
        </button>
      )}
    </div>
  )
}
