import { MessageCircle } from 'lucide-react'

interface WhatsAppFloatProps {
  numero?: string
  mensagem?: string
}

export function WhatsAppFloat({
  numero = '5569900000000',
  mensagem = 'Olá, tenho interesse em um veículo do estoque Belini.',
}: WhatsAppFloatProps) {
  const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-4 right-4 z-30 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 font-semibold text-black shadow-[0_15px_40px_-10px_rgba(37,211,102,0.7)] transition-transform hover:-translate-y-0.5 sm:bottom-6 sm:right-6 sm:px-5"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle size={18} />
      <span className="hidden sm:inline">WhatsApp</span>
    </a>
  )
}
