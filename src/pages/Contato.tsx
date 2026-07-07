import { useState } from 'react'
import { Camera, Clock, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useConfiguracoes } from '@/hooks/useConfiguracoes'
import { formatTelefoneExibicao } from '@/lib/formatters'

const WHATSAPP_PADRAO = '5569900000000'

export function Contato() {
  const { data: config } = useConfiguracoes()
  const numeroWhats = config?.telefone_whatsapp_principal || WHATSAPP_PADRAO
  const [enviado, setEnviado] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setEnviando(true)
    setErro(null)
    const form = new FormData(e.currentTarget)
    try {
      const { error } = await supabase.from('leads').insert({
        nome: String(form.get('nome') ?? ''),
        telefone: String(form.get('telefone') ?? ''),
        origem: 'formulario_contato',
        mensagem: [form.get('interesse') ? `Interesse: ${form.get('interesse')}` : null, form.get('mensagem')]
          .filter(Boolean)
          .join(' — '),
      })
      if (error) throw error
      setEnviado(true)
      e.currentTarget.reset()
    } catch (err) {
      console.error('Erro ao enviar lead:', err)
      setErro('Não foi possível enviar agora. Tente novamente ou fale pelo WhatsApp.')
    } finally {
      setEnviando(false)
    }
  }

  return (
    <>
      <section className="border-b border-[var(--color-border)] bg-[var(--color-surface)]/30">
        <div className="mx-auto max-w-7xl px-5 py-16 text-center sm:px-6 sm:text-left lg:px-8">
          <p className="font-tech text-[11px] uppercase tracking-[0.3em] text-signal">/contato</p>
          <h1 className="mt-2 display text-4xl tracking-tight sm:text-5xl md:text-6xl">Fale com a gente</h1>
          <p className="mt-3 max-w-xl text-[var(--color-muted-foreground)] sm:mx-0 mx-auto">
            Estamos aqui para tirar dúvidas, agendar test-drive ou avaliar seu veículo.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:px-6 lg:px-8 lg:grid-cols-[1fr_1.1fr]">
        <div className="space-y-4">
          <InfoCard icon={<MessageCircle />} title="WhatsApp" primary value={formatTelefoneExibicao(numeroWhats)} href={`https://wa.me/${numeroWhats}`} />
          <InfoCard icon={<Phone />} title="Telefone" value={formatTelefoneExibicao(numeroWhats)} href={`tel:+${numeroWhats}`} />
          <InfoCard icon={<Mail />} title="E-mail" value="contato@beliniveiculos.com.br" href="mailto:contato@beliniveiculos.com.br" />
          <InfoCard icon={<MapPin />} title="Endereço" value={config?.endereco || 'Ji-Paraná — Rondônia'} />
          <InfoCard icon={<Clock />} title="Horário" value="Seg a Sex 8h–18h · Sáb 8h–13h" />
          <InfoCard icon={<Camera />} title="Instagram" value="@beliniveiculos" href={config?.instagram_url || 'https://www.instagram.com/beliniveiculos'} />
        </div>

        <form onSubmit={handleSubmit} className="rounded-md border border-[var(--color-border)] bg-surface-gradient p-6 shadow-card md:p-8">
          <p className="font-tech text-[10px] uppercase tracking-[0.3em] text-signal">/formulário</p>
          <h2 className="mt-2 display text-3xl tracking-tight">Envie uma mensagem</h2>

          <div className="mt-6 grid gap-4">
            <Field label="Nome" name="nome" required />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Telefone" name="telefone" required />
              <Field label="E-mail" name="email" type="email" />
            </div>
            <Field label="Veículo de interesse" name="interesse" placeholder="Ex: Haval H6 2023" />
            <label className="block">
              <span className="mb-2 block font-tech text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">Mensagem</span>
              <textarea name="mensagem" rows={4} className="w-full rounded-sm border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2.5 text-sm outline-none focus:border-signal" />
            </label>

            {erro && <p className="text-center text-sm text-[var(--color-destructive)]">{erro}</p>}

            <button
              type="submit"
              disabled={enviando}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-sm bg-signal-gradient px-5 py-3 font-semibold text-[var(--color-primary-foreground)] shadow-signal transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {enviando ? 'Enviando...' : enviado ? 'Recebido!' : 'Enviar mensagem'}
            </button>
            {enviado && <p className="text-center font-tech text-xs text-signal">Retornaremos em até 1 dia útil.</p>}
          </div>
        </form>
      </section>
    </>
  )
}

function InfoCard({
  icon, title, value, href, primary,
}: { icon: React.ReactNode; title: string; value: string; href?: string; primary?: boolean }) {
  const inner = (
    <div className={`flex items-center gap-4 rounded-md border p-5 transition-all ${
      primary ? 'border-signal/50 bg-signal/5 shadow-signal' : 'border-[var(--color-border)] bg-surface-gradient hover:border-signal/40'
    }`}>
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-sm border border-[var(--color-border)] bg-[var(--color-background)] text-signal">{icon}</div>
      <div>
        <p className="font-tech text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">{title}</p>
        <p className="font-tech text-sm text-[var(--color-foreground)]">{value}</p>
      </div>
    </div>
  )
  return href ? <a href={href} target="_blank" rel="noreferrer">{inner}</a> : inner
}

function Field({
  label, name, type = 'text', required, placeholder,
}: { label: string; name: string; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="block">
      <span className="mb-2 block font-tech text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">{label}</span>
      <input
        type={type}
        name={name}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-sm border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2.5 text-sm outline-none focus:border-signal"
      />
    </label>
  )
}
