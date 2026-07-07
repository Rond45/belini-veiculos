import { useState } from 'react'
import { useNavigate, useLocation, Navigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Loading } from '@/components/ui/Loading'

export function AdminLogin() {
  const { user, perfil, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  // Já autenticado e com perfil ativo — manda direto pro admin
  if (!authLoading && user && perfil?.ativo) {
    const destino = (location.state as { from?: string })?.from ?? '/admin'
    return <Navigate to={destino} replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setEnviando(true)
    setErro(null)
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password: senha })
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErro('E-mail ou senha incorretos.')
        } else {
          setErro('Não foi possível entrar. Tente novamente.')
        }
        return
      }
      navigate('/admin', { replace: true })
    } catch (err) {
      console.error('Erro no login:', err)
      setErro('Não foi possível entrar. Tente novamente.')
    } finally {
      setEnviando(false)
    }
  }

  if (authLoading) return <Loading />

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)] px-5">
      <div className="w-full max-w-sm rounded-md border border-[var(--color-border)] bg-surface-gradient p-8 shadow-card">
        <p className="font-tech text-[11px] uppercase tracking-[0.3em] text-signal">/admin</p>
        <h1 className="mt-2 display text-2xl">Acesso administrativo</h1>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          Belini Veículos — painel interno
        </p>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
          <label className="block">
            <span className="mb-2 block font-tech text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">
              E-mail
            </span>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-sm border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2.5 text-sm outline-none focus:border-signal"
            />
          </label>

          <label className="block">
            <span className="mb-2 block font-tech text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">
              Senha
            </span>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full rounded-sm border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2.5 text-sm outline-none focus:border-signal"
            />
          </label>

          {erro && <p className="text-sm text-[var(--color-destructive)]">{erro}</p>}

          <button
            type="submit"
            disabled={enviando}
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-sm bg-signal-gradient px-5 py-3 font-semibold text-[var(--color-primary-foreground)] shadow-signal transition-transform hover:-translate-y-0.5 disabled:opacity-60"
          >
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}
