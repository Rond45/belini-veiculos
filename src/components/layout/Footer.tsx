import { Link } from 'react-router-dom'
import { Camera, MapPin, Phone } from 'lucide-react'
import beliniLogo from '@/assets/belini-logo.png'
import { useConfiguracoes } from '@/hooks/useConfiguracoes'
import { formatTelefoneExibicao } from '@/lib/formatters'

const WHATSAPP_PADRAO = '5569900000000'

export function Footer() {
  const { data: config } = useConfiguracoes()
  const numeroWhats = config?.telefone_whatsapp_principal || WHATSAPP_PADRAO

  return (
    <footer className="mt-24 border-t border-[var(--color-border)] bg-[var(--color-surface)]/40">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 lg:px-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <img src={beliniLogo} alt="Belini Veículos" className="h-14 w-auto object-contain" />
          <p className="mt-4 max-w-md text-sm text-[var(--color-muted-foreground)]">
            Concessionária de veículos seminovos selecionados em Ji-Paraná/RO. Direto,
            sem enrolação, com procedência e laudo.
          </p>
        </div>

        <div>
          <h4 className="display text-sm tracking-widest text-[var(--color-muted-foreground)]">Navegação</h4>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/" className="hover:text-signal">Início</Link></li>
            <li><Link to="/catalogo" className="hover:text-signal">Estoque</Link></li>
            <li><Link to="/sobre" className="hover:text-signal">Sobre</Link></li>
            <li><Link to="/contato" className="hover:text-signal">Contato</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="display text-sm tracking-widest text-[var(--color-muted-foreground)]">Contato</h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 text-signal" />
              <span>{config?.endereco || 'Ji-Paraná — Rondônia'}</span>
            </li>
            <li className="flex items-start gap-2">
              <Phone size={16} className="mt-0.5 text-signal" />
              <a href={`https://wa.me/${numeroWhats}`} target="_blank" rel="noreferrer" className="font-tech hover:text-signal">
                {formatTelefoneExibicao(numeroWhats)}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Camera size={16} className="mt-0.5 text-signal" />
              <a href={config?.instagram_url || 'https://www.instagram.com/beliniveiculos'} target="_blank" rel="noreferrer" className="hover:text-signal">
                @beliniveiculos
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--color-border)]">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-5 py-6 text-xs text-[var(--color-muted-foreground)] sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {config?.nome_loja || 'Belini Veículos'}. Todos os direitos reservados.</p>
          <p className="font-tech">Ji-Paraná/RO</p>
        </div>
      </div>
    </footer>
  )
}
