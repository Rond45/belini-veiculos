import { Link } from 'react-router-dom'
import { ArrowRight, Fuel, Gauge, Settings2 } from 'lucide-react'
import { useVeiculos } from '@/hooks/useVeiculos'
import { CardVeiculo } from '@/components/veiculos/CardVeiculo'
import { Loading } from '@/components/ui/Loading'
import { MensagemErro } from '@/components/ui/MensagemErro'
import { EstadoVazio } from '@/components/ui/EstadoVazio'
import { formatBRL, formatKM, COMBUSTIVEL_LABEL, CAMBIO_LABEL } from '@/lib/formatters'
import featureProcedencia from '@/assets/feature-procedencia.png'
import featureLaudo from '@/assets/feature-laudo.png'
import featureFinanciamento from '@/assets/feature-financiamento.png'
import featureRevisado from '@/assets/feature-revisado.png'

export function Home() {
  const { data: veiculos, loading, error } = useVeiculos()
  const total = veiculos.length

  // Destaque da semana: usa o marcado explicitamente; se nenhum, cai pro primeiro
  // veículo em destaque geral que tenha foto — nunca mostra caixa vazia sem propósito.
  const destaqueSemana =
    veiculos.find((v) => v.destaque_semana && v.fotos?.length) ??
    veiculos.find((v) => v.destaque && v.fotos?.length)
  const fotoDestaqueSemana = destaqueSemana?.fotos?.find((f) => f.capa) ?? destaqueSemana?.fotos?.[0]

  // A grade de destaques abaixo nunca repete o carro que já está no hero
  const destaques = veiculos
    .filter((v) => v.destaque && v.id !== destaqueSemana?.id)
    .slice(0, 3)

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden bg-hero">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--color-background)] to-transparent" />

        <div className={`relative mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-6 lg:px-8 md:py-28 lg:py-32 ${
          fotoDestaqueSemana ? 'md:grid-cols-[1.05fr_1fr] md:items-center' : ''
        }`}>
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)]/60 px-3 py-1.5 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-signal shadow-signal" />
              <span className="font-tech text-[11px] uppercase tracking-[0.25em] text-[var(--color-muted-foreground)]">
                Ji-Paraná · Rondônia
              </span>
            </div>

            <h1 className="mt-6 display text-4xl leading-[1.02] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Veículos <span className="text-signal">selecionados</span><br />
              para quem não quer<br />errar na compra.
            </h1>

            <p className="mt-6 max-w-lg text-base text-[var(--color-muted-foreground)]">
              Estoque com procedência, laudo cautelar e revisão documentada.
              Sem enrolação, sem letra miúda — só carro bom.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/catalogo"
                className="group inline-flex items-center gap-2 rounded-sm bg-signal-gradient px-5 py-3 font-semibold text-[var(--color-primary-foreground)] shadow-signal transition-transform hover:-translate-y-0.5"
              >
                Ver o estoque
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                to="/contato"
                className="inline-flex items-center gap-2 rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-3 font-semibold hover:border-signal/50"
              >
                Falar com um consultor
              </Link>
            </div>

            <div className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-[var(--color-border)] pt-6">
              <Stat value={String(total).padStart(2, '0')} label="No estoque agora" />
              <Stat value="100%" label="Com laudo cautelar" />
              <Stat value="15+" label="Anos em Ji-Paraná" />
            </div>
          </div>

          {/* Só renderiza a coluna da foto se existir um destaque real — evita caixa vazia */}
          {fotoDestaqueSemana && destaqueSemana && (
            <div className="hidden md:block">
              <Link to={`/veiculo/${destaqueSemana.id}`} className="group relative block">
                <div className="absolute -inset-6 rounded-lg bg-signal/10 blur-3xl" />
                <div className="relative overflow-hidden rounded-lg border border-[var(--color-border)] shadow-card">
                  <span className="absolute left-4 top-4 z-10 rounded-sm bg-signal-gradient px-2.5 py-1 font-tech text-[10px] font-bold uppercase tracking-widest text-[var(--color-primary-foreground)] shadow-signal">
                    Destaque da semana
                  </span>
                  <img
                    src={fotoDestaqueSemana.url}
                    alt={`${destaqueSemana.marca?.nome} ${destaqueSemana.modelo?.nome}`}
                    className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    <p className="font-tech text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]">{destaqueSemana.marca?.nome}</p>
                    <p className="display text-xl">{destaqueSemana.modelo?.nome}</p>
                  </div>
                </div>
              </Link>

              {/* Ficha técnica resumida — ocupa o espaço abaixo da foto de forma útil, não decorativa */}
              <div className="relative mt-4 rounded-lg border border-[var(--color-border)] bg-surface-gradient p-5 shadow-card">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-[var(--color-muted-foreground)]">{destaqueSemana.versao}</p>
                    <p className="mt-0.5 font-tech text-2xl font-semibold text-signal">{formatBRL(destaqueSemana.preco)}</p>
                  </div>
                  <Link
                    to={`/veiculo/${destaqueSemana.id}`}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-sm border border-signal/40 px-3 py-2 font-tech text-xs font-semibold text-signal hover:bg-signal/10"
                  >
                    Ver detalhes <ArrowRight size={12} />
                  </Link>
                </div>

                <dl className="mt-4 grid grid-cols-4 gap-2 border-t border-[var(--color-border)] pt-4 text-center">
                  <SpecMini label="Ano" value={`${destaqueSemana.ano_fabricacao}/${destaqueSemana.ano_modelo}`} />
                  <SpecMini icon={<Gauge size={13} />} label="KM" value={formatKM(destaqueSemana.km)} />
                  <SpecMini icon={<Fuel size={13} />} label="Comb." value={destaqueSemana.combustivel ? COMBUSTIVEL_LABEL[destaqueSemana.combustivel] : '—'} />
                  <SpecMini icon={<Settings2 size={13} />} label="Câmbio" value={destaqueSemana.cambio ? CAMBIO_LABEL[destaqueSemana.cambio].slice(0, 4) : '—'} />
                </dl>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* WHY */}
      <section className="relative mx-auto max-w-7xl overflow-hidden px-5 py-20 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-signal/10 blur-3xl" />
        <div className="flex flex-wrap items-end justify-between gap-4 text-center sm:text-left">
          <div className="w-full sm:w-auto">
            <p className="font-tech text-[11px] uppercase tracking-[0.3em] text-signal">/ficha_técnica</p>
            <h2 className="mt-2 display text-4xl tracking-tight md:text-5xl">O jeito Belini de vender</h2>
          </div>
          <p className="max-w-md text-sm text-[var(--color-muted-foreground)]">
            Cada carro que entra no nosso pátio passa por curadoria. O que não é bom, nem chega aqui.
          </p>
        </div>

        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Feature image={featureProcedencia} title="Procedência" desc="Histórico veicular checado, sem sinistro nem golpe." />
          <Feature image={featureLaudo} title="Laudo cautelar" desc="Inspeção técnica documentada em 100% do estoque." />
          <Feature image={featureFinanciamento} title="Financiamento" desc="Aprovação rápida com os principais bancos do país." />
          <Feature image={featureRevisado} title="Revisado" desc="Entrega com revisão, higienização e tanque cheio." />
        </div>
      </section>

      {/* DESTAQUES */}
      <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4 text-center sm:text-left">
          <div className="w-full sm:w-auto">
            <p className="font-tech text-[11px] uppercase tracking-[0.3em] text-signal">/destaques</p>
            <h2 className="mt-2 display text-4xl tracking-tight md:text-5xl">Selecionados agora</h2>
          </div>
          <Link to="/catalogo" className="group inline-flex items-center gap-2 font-tech text-sm text-signal">
            Ver estoque completo
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {loading && <Loading />}
        {error && <MensagemErro mensagem={error} />}
        {!loading && !error && destaques.length === 0 && (
          <EstadoVazio mensagem="Nenhum veículo em destaque no momento." />
        )}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {destaques.map((v) => <CardVeiculo key={v.id} veiculo={v} />)}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden border-y border-[var(--color-border)] bg-[var(--color-surface)]/40">
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-signal/10 blur-3xl" />
        <div className="absolute inset-0 bg-grid opacity-30" />
        <div className="relative mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-5 py-14 sm:px-6 lg:px-8 md:flex-row md:items-center">
          <div>
            <h3 className="display text-3xl tracking-tight md:text-4xl">Tem um carro pra vender?</h3>
            <p className="mt-2 max-w-lg text-sm text-[var(--color-muted-foreground)]">
              A gente avalia na hora, com transparência. Pagamento à vista ou entrada em outro veículo do estoque.
            </p>
          </div>
          <Link
            to="/contato"
            className="inline-flex items-center gap-2 rounded-sm bg-signal-gradient px-6 py-3 font-semibold text-[var(--color-primary-foreground)] shadow-signal"
          >
            Avaliar meu veículo <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  )
}

function SpecMini({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="flex items-center gap-1 font-tech text-[9px] uppercase tracking-widest text-[var(--color-muted-foreground)]">
        {icon} {label}
      </span>
      <span className="font-tech text-xs">{value}</span>
    </div>
  )
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="display text-3xl tracking-tight text-signal">{value}</p>
      <p className="mt-1 font-tech text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">{label}</p>
    </div>
  )
}

function Feature({ image, title, desc }: { image: string; title: string; desc: string }) {
  return (
    <div className="group relative overflow-hidden rounded-md border border-[var(--color-border)] bg-surface-gradient p-6 text-center transition-colors hover:border-signal/40 sm:text-left">
      <div className="mx-auto grid h-11 w-11 place-items-center overflow-hidden rounded-sm border border-[var(--color-border)] bg-[var(--color-background)] sm:mx-0">
        <img src={image} alt={title} className="h-full w-full object-contain" />
      </div>
      <h3 className="mt-5 display text-xl tracking-wide">{title}</h3>
      <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">{desc}</p>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-signal/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
    </div>
  )
}
