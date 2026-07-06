interface WhatsAppFloatProps {
  numero: string
  mensagem?: string
}

export function WhatsAppFloat({ numero, mensagem = 'Olá! Vim pelo site da Belini Veículos.' }: WhatsAppFloatProps) {
  const link = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg z-20"
      aria-label="Falar no WhatsApp"
    >
      WA
    </a>
  )
}
