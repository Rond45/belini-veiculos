interface MensagemErroProps {
  mensagem: string
  onRetry?: () => void
}

export function MensagemErro({ mensagem, onRetry }: MensagemErroProps) {
  return (
    <div className="rounded-lg bg-red-500/10 p-4 text-red-400">
      <p>{mensagem}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-2 text-sm underline">
          Tentar novamente
        </button>
      )}
    </div>
  )
}
