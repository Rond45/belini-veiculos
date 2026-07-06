import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="sticky top-0 z-10 bg-[var(--color-asfalto)]/95 backdrop-blur border-b border-[var(--color-aco)]">
      <div className="h-[3px] faixa-cautela" />
      <div className="px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <Link to="/" className="display text-xl">
          BELINI <span className="text-[var(--color-cautela)]">VEÍCULOS</span>
        </Link>
        <nav className="flex gap-8 text-sm font-medium text-[var(--color-cinza-medio)]">
          <Link to="/catalogo" className="hover:text-[var(--color-cautela)] transition-colors">Estoque</Link>
          <Link to="/sobre" className="hover:text-[var(--color-cautela)] transition-colors">Sobre</Link>
          <Link to="/contato" className="hover:text-[var(--color-cautela)] transition-colors">Contato</Link>
        </nav>
      </div>
    </header>
  )
}
