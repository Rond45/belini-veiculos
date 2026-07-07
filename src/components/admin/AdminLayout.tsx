import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Car, Users, FileText, Settings, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'

const NAV = [
  { to: '/admin', label: 'Painel', icon: LayoutDashboard, end: true },
  { to: '/admin/veiculos', label: 'Veículos', icon: Car, end: false },
  { to: '/admin/leads', label: 'Leads', icon: Users, end: false },
  { to: '/admin/posts', label: 'Posts', icon: FileText, end: false },
  { to: '/admin/configuracoes', label: 'Configurações', icon: Settings, end: false },
] as const

export function AdminLayout() {
  const { perfil } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="min-h-screen flex bg-[var(--color-background)]">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-r border-[var(--color-border)] bg-[var(--color-surface)]/40">
        <div className="p-5 border-b border-[var(--color-border)]">
          <span className="display text-sm">
            BELINI <span className="text-signal">ADMIN</span>
          </span>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {NAV.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-signal/10 text-signal'
                      : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-surface)] hover:text-[var(--color-foreground)]'
                  }`
                }
              >
                <Icon size={16} /> {item.label}
              </NavLink>
            )
          })}
        </nav>
        <div className="p-3 border-t border-[var(--color-border)]">
          <p className="px-3 text-xs text-[var(--color-muted-foreground)] truncate">
            {perfil?.nome} · {perfil?.role}
          </p>
          <button
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm font-medium text-[var(--color-muted-foreground)] hover:bg-[var(--color-surface)] hover:text-[var(--color-destructive)]"
          >
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex items-center justify-between border-b border-[var(--color-border)] p-4">
          <span className="display text-sm">BELINI <span className="text-signal">ADMIN</span></span>
          <button onClick={handleLogout} className="text-sm text-[var(--color-muted-foreground)]">Sair</button>
        </header>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
