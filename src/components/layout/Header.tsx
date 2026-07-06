import { Link } from 'react-router-dom'

export function Header() {
  return (
    <header className="border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between sticky top-0 bg-[var(--color-background)] z-10">
      <Link to="/" className="font-bold text-lg tracking-tight">
        BELINI <span className="text-[var(--color-primary)]">VEÍCULOS</span>
      </Link>
      <nav className="flex gap-6 text-sm text-neutral-300">
        <Link to="/catalogo" className="hover:text-[var(--color-primary)]">Estoque</Link>
        <Link to="/sobre" className="hover:text-[var(--color-primary)]">Sobre</Link>
        <Link to="/contato" className="hover:text-[var(--color-primary)]">Contato</Link>
      </nav>
    </header>
  )
}
