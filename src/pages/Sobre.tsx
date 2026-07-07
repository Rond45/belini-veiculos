import { Link } from 'react-router-dom'
import { ArrowRight, Award, MapPin, Users } from 'lucide-react'

export function Sobre() {
  return (
    <>
      <section className="border-b border-[var(--color-border)] bg-hero">
        <div className="mx-auto max-w-4xl px-5 py-24 text-center sm:px-6 sm:text-left lg:px-8">
          <p className="font-tech text-[11px] uppercase tracking-[0.3em] text-signal">/sobre</p>
          <h1 className="mt-3 display text-4xl leading-tight tracking-tight sm:text-5xl md:text-7xl">
            Uma loja construída pela<br />
            <span className="text-signal">confiança</span> de quem volta.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-[var(--color-muted-foreground)] sm:mx-0 mx-auto">
            A Belini Veículos nasceu em Ji-Paraná com uma proposta simples: vender só
            aquilo que a gente compraria. Nada de vitrine cheia — pátio enxuto,
            veículos com procedência e conversa reta.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-20 sm:px-6 lg:px-8 md:grid-cols-3">
        <Item icon={<Award size={22} />} title="Curadoria" desc="Cada veículo é escolhido a dedo. Reprovamos o que não passa no nosso próprio filtro." />
        <Item icon={<Users size={22} />} title="Relação" desc="Cliente Belini é cliente para a vida. Pós-venda e revisão continuam depois da chave entregue." />
        <Item icon={<MapPin size={22} />} title="Raiz" desc="Somos de Ji-Paraná/RO. Atendemos toda a região com a mesma seriedade." />
      </section>

      <section className="mx-auto max-w-4xl px-5 pb-24 sm:px-6 lg:px-8">
        <div className="rounded-md border border-[var(--color-border)] bg-surface-gradient p-8 shadow-card md:p-12">
          <p className="font-tech text-[10px] uppercase tracking-[0.3em] text-signal">/manifesto</p>
          <p className="mt-4 display text-2xl leading-snug tracking-wide md:text-3xl">
            &ldquo;Preferimos vender menos, mas vender certo. Um cliente satisfeito
            traz outros dez — um decepcionado tira cem.&rdquo;
          </p>
          <p className="mt-6 font-tech text-xs uppercase tracking-widest text-[var(--color-muted-foreground)]">— Equipe Belini</p>
        </div>

        <div className="mt-10 flex justify-center">
          <Link to="/catalogo" className="inline-flex items-center gap-2 rounded-sm bg-signal-gradient px-6 py-3 font-semibold text-[var(--color-primary-foreground)] shadow-signal">
            Ver estoque atual <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  )
}

function Item({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="rounded-md border border-[var(--color-border)] bg-surface-gradient p-6 text-center sm:text-left">
      <div className="mx-auto grid h-11 w-11 place-items-center rounded-sm border border-[var(--color-border)] bg-[var(--color-background)] text-signal sm:mx-0">{icon}</div>
      <h3 className="mt-5 display text-xl tracking-wide">{title}</h3>
      <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">{desc}</p>
    </div>
  )
}
