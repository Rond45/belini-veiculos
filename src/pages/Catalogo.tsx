import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal } from 'lucide-react'
import { useVeiculos } from '@/hooks/useVeiculos'
import { CardVeiculo } from '@/components/veiculos/CardVeiculo'
import { Loading } from '@/components/ui/Loading'
import { MensagemErro } from '@/components/ui/MensagemErro'
import { COMBUSTIVEL_LABEL } from '@/lib/formatters'

export function Catalogo() {
  const { data: veiculos, loading, error } = useVeiculos()

  const [q, setQ] = useState('')
  const [marca, setMarca] = useState('')
  const [combustivel, setCombustivel] = useState('')
  const [anoMin, setAnoMin] = useState<number | ''>('')
  const [precoMax, setPrecoMax] = useState<number | ''>('')
  const [ordem, setOrdem] = useState<'recentes' | 'menor' | 'maior' | 'km'>('recentes')

  const marcas = useMemo(
    () => Array.from(new Set(veiculos.map((v) => v.marca?.nome).filter(Boolean))).sort() as string[],
    [veiculos]
  )
  const combustiveis = useMemo(
    () => Array.from(new Set(veiculos.map((v) => v.combustivel).filter(Boolean))).sort() as string[],
    [veiculos]
  )

  const filtered = useMemo(() => {
    const list = veiculos.filter((v) => {
      if (marca && v.marca?.nome !== marca) return false
      if (combustivel && v.combustivel !== combustivel) return false
      if (anoMin && v.ano_modelo < Number(anoMin)) return false
      if (precoMax && v.preco > Number(precoMax)) return false
      if (q) {
        const s = `${v.marca?.nome} ${v.modelo?.nome} ${v.versao ?? ''}`.toLowerCase()
        if (!s.includes(q.toLowerCase())) return false
      }
      return true
    })
    switch (ordem) {
      case 'menor': return [...list].sort((a, b) => a.preco - b.preco)
      case 'maior': return [...list].sort((a, b) => b.preco - a.preco)
      case 'km': return [...list].sort((a, b) => a.km - b.km)
      default: return [...list].sort((a, b) => b.ano_modelo - a.ano_modelo)
    }
  }, [veiculos, q, marca, combustivel, anoMin, precoMax, ordem])

  return (
    <>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/30">
        <div className="mx-auto max-w-7xl px-5 py-14 text-center sm:px-6 sm:text-left lg:px-8">
          <p className="font-tech text-[11px] uppercase tracking-[0.3em] text-signal">/estoque</p>
          <h1 className="mt-2 display text-4xl tracking-tight sm:text-5xl md:text-6xl">Nosso estoque</h1>
          <p className="mt-3 max-w-xl text-[var(--color-muted-foreground)] sm:mx-0 mx-auto">
            {veiculos.length} veículos disponíveis. Filtre por marca, combustível, ano e preço.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-md border border-[var(--color-border)] bg-surface-gradient p-5">
            <div className="mb-4 flex items-center gap-2 display tracking-wider">
              <SlidersHorizontal size={16} className="text-signal" /> Filtros
            </div>

            <label className="mb-4 block">
              <span className="mb-2 block font-tech text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">Buscar</span>
              <div className="relative">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-muted-foreground)]" />
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="modelo, versão..."
                  className="w-full rounded-sm border border-[var(--color-input)] bg-[var(--color-background)] px-9 py-2.5 text-sm outline-none focus:border-signal"
                />
              </div>
            </label>

            <Select label="Marca" value={marca} onChange={setMarca} options={marcas} />
            <Select
              label="Combustível"
              value={combustivel}
              onChange={setCombustivel}
              options={combustiveis}
              displayMap={COMBUSTIVEL_LABEL}
            />

            <div className="mb-4 grid grid-cols-2 gap-3">
              <NumberInput label="Ano mínimo" value={anoMin} onChange={setAnoMin} placeholder="2018" />
              <NumberInput label="Preço até" value={precoMax} onChange={setPrecoMax} placeholder="120000" />
            </div>

            <button
              onClick={() => { setQ(''); setMarca(''); setCombustivel(''); setAnoMin(''); setPrecoMax('') }}
              className="mt-2 w-full rounded-sm border border-[var(--color-border)] bg-[var(--color-background)] px-3 py-2 text-sm text-[var(--color-muted-foreground)] hover:border-signal/50 hover:text-[var(--color-foreground)]"
            >
              Limpar filtros
            </button>
          </aside>

          <div>
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-border)] pb-4">
              <p className="font-tech text-sm text-[var(--color-muted-foreground)]">
                <span className="text-signal">{filtered.length}</span> resultados
              </p>
              <label className="flex items-center gap-2 text-sm">
                <span className="font-tech text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">Ordenar</span>
                <select
                  value={ordem}
                  onChange={(e) => setOrdem(e.target.value as typeof ordem)}
                  className="rounded-sm border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2 text-sm outline-none focus:border-signal"
                >
                  <option value="recentes">Mais recentes</option>
                  <option value="menor">Menor preço</option>
                  <option value="maior">Maior preço</option>
                  <option value="km">Menor km</option>
                </select>
              </label>
            </div>

            {loading && <Loading />}
            {error && <MensagemErro mensagem={error} />}

            {!loading && !error && (
              filtered.length === 0 ? (
                <div className="rounded-md border border-dashed border-[var(--color-border)] p-14 text-center text-[var(--color-muted-foreground)]">
                  Nenhum veículo encontrado com esses filtros.
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                  {filtered.map((v) => <CardVeiculo key={v.id} veiculo={v} />)}
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </>
  )
}

function Select({
  label, value, onChange, options, displayMap,
}: { label: string; value: string; onChange: (v: string) => void; options: string[]; displayMap?: Record<string, string> }) {
  return (
    <label className="mb-4 block">
      <span className="mb-2 block font-tech text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-sm border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2.5 text-sm outline-none focus:border-signal"
      >
        <option value="">Todos</option>
        {options.map((o) => <option key={o} value={o}>{displayMap?.[o] ?? o}</option>)}
      </select>
    </label>
  )
}

function NumberInput({
  label, value, onChange, placeholder,
}: { label: string; value: number | ''; onChange: (v: number | '') => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block font-tech text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">{label}</span>
      <input
        type="number"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        className="w-full rounded-sm border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2.5 font-tech text-sm outline-none focus:border-signal"
      />
    </label>
  )
}
