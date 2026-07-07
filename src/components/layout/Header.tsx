import { Link, NavLink } from 'react-router-dom'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import beliniLogo from '@/assets/belini-logo.png'

const NAV = [
  { to: '/', label: 'Início', end: true },
  { to: '/catalogo', label: 'Estoque', end: false },
  { to: '/sobre', label: 'Sobre', end: false },
  { to: '/contato', label: 'Contato', end: false },
] as const

export function Header() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-border)]/60 bg-[var(--color-background)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-center gap-6 px-5 sm:h-20 sm:px-6 lg:px-8 md:grid md:grid-cols-[auto_1fr_auto] md:gap-4 md:justify-normal">
        {/* Logo (wordmark — substituir por PNG real quando disponível) */}
        <Link to="/" className="flex items-center" aria-label="Belini Veículos — Início">
          <img
            src={beliniLogo}
            alt="Belini Veículos"
            className="h-10 w-auto object-contain sm:h-12"
          />
        </Link>

        <nav className="hidden items-center justify-center gap-1 md:flex">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `rounded-sm px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'text-[var(--color-foreground)]' : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center justify-end">
          <Link
            to="/catalogo"
            className="hidden items-center gap-2 rounded-sm bg-signal-gradient px-4 py-2.5 text-sm font-semibold text-[var(--color-primary-foreground)] shadow-signal transition-transform hover:-translate-y-0.5 md:inline-flex"
          >
            Ver estoque
          </Link>
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-10 w-10 place-items-center rounded-sm border border-[var(--color-border)] md:hidden"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-[var(--color-border)] md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-sm px-3 py-3 text-sm font-medium ${
                    isActive ? 'bg-[var(--color-surface)] text-[var(--color-foreground)]' : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-surface)]'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
            <Link
              to="/catalogo"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-sm bg-signal-gradient px-4 py-3 text-sm font-semibold text-[var(--color-primary-foreground)] shadow-signal"
            >
              Ver estoque
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
