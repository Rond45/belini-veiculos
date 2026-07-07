import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Car, Users, TrendingUp } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Kpis {
  totalVeiculos: number
  disponiveis: number
  leadsNovos: number
}

export function AdminDashboard() {
  const [kpis, setKpis] = useState<Kpis | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      const [veiculos, disponiveis, leadsNovos] = await Promise.all([
        supabase.from('veiculos').select('id', { count: 'exact', head: true }),
        supabase.from('veiculos').select('id', { count: 'exact', head: true }).eq('status', 'disponivel'),
        supabase.from('leads').select('id', { count: 'exact', head: true }).eq('status', 'novo'),
      ])
      setKpis({
        totalVeiculos: veiculos.count ?? 0,
        disponiveis: disponiveis.count ?? 0,
        leadsNovos: leadsNovos.count ?? 0,
      })
      setLoading(false)
    }
    carregar()
  }, [])

  return (
    <div>
      <h1 className="display text-2xl mb-6">Painel administrativo</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <KpiCard icon={<Car size={20} />} label="Veículos no estoque" value={loading ? '—' : kpis?.totalVeiculos} />
        <KpiCard icon={<TrendingUp size={20} />} label="Disponíveis agora" value={loading ? '—' : kpis?.disponiveis} />
        <KpiCard icon={<Users size={20} />} label="Leads novos" value={loading ? '—' : kpis?.leadsNovos} destaque={!loading && (kpis?.leadsNovos ?? 0) > 0} />
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/admin/veiculos" className="rounded-sm bg-signal-gradient px-4 py-2.5 text-sm font-semibold text-[var(--color-primary-foreground)] shadow-signal">
          Gerenciar veículos
        </Link>
        <Link to="/admin/leads" className="rounded-sm border border-[var(--color-border)] px-4 py-2.5 text-sm font-semibold hover:border-signal/50">
          Ver leads
        </Link>
      </div>
    </div>
  )
}

function KpiCard({ icon, label, value, destaque }: { icon: React.ReactNode; label: string; value?: number | string; destaque?: boolean }) {
  return (
    <div className={`rounded-md border p-5 ${destaque ? 'border-signal/50 bg-signal/5' : 'border-[var(--color-border)] bg-surface-gradient'}`}>
      <div className="flex items-center gap-2 text-[var(--color-muted-foreground)]">
        {icon}
        <span className="font-tech text-[10px] uppercase tracking-widest">{label}</span>
      </div>
      <p className="mt-3 font-tech text-3xl font-bold text-signal">{value}</p>
    </div>
  )
}
