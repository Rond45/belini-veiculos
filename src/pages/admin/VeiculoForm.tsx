import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Plus, Star, Trash2, Upload } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useMarcasModelos } from '@/hooks/useMarcasModelos'
import { uploadFotoVeiculo, removerFotoVeiculo, definirCapa } from '@/lib/storage'
import { Loading } from '@/components/ui/Loading'
import { MensagemErro } from '@/components/ui/MensagemErro'
import type { VeiculoComRelacoes, StatusVeiculo, Combustivel, Cambio } from '@/types/database.types'

const COMBUSTIVEIS: { value: Combustivel; label: string }[] = [
  { value: 'flex', label: 'Flex' },
  { value: 'gasolina', label: 'Gasolina' },
  { value: 'etanol', label: 'Etanol' },
  { value: 'diesel', label: 'Diesel' },
  { value: 'hibrido', label: 'Híbrido' },
  { value: 'eletrico', label: 'Elétrico' },
]
const CAMBIOS: { value: Cambio; label: string }[] = [
  { value: 'manual', label: 'Manual' },
  { value: 'automatico', label: 'Automático' },
  { value: 'automatizado', label: 'Automatizado' },
  { value: 'cvt', label: 'CVT' },
]
const STATUS: { value: StatusVeiculo; label: string }[] = [
  { value: 'disponivel', label: 'Disponível' },
  { value: 'reservado', label: 'Reservado' },
  { value: 'vendido', label: 'Vendido' },
]

export function VeiculoForm() {
  const { id } = useParams<{ id: string }>()
  const modoEdicao = id !== undefined && id !== 'novo'
  const navigate = useNavigate()
  const { marcas, modelos, criarMarca, criarModelo } = useMarcasModelos()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [carregando, setCarregando] = useState(modoEdicao)
  const [salvando, setSalvando] = useState(false)
  const [enviandoFoto, setEnviandoFoto] = useState(false)
  const [erro, setErro] = useState<string | null>(null)
  const [veiculo, setVeiculo] = useState<VeiculoComRelacoes | null>(null)

  const [marcaId, setMarcaId] = useState('')
  const [modeloId, setModeloId] = useState('')
  const [versao, setVersao] = useState('')
  const [anoFabricacao, setAnoFabricacao] = useState('')
  const [anoModelo, setAnoModelo] = useState('')
  const [cor, setCor] = useState('')
  const [km, setKm] = useState('')
  const [preco, setPreco] = useState('')
  const [combustivel, setCombustivel] = useState<Combustivel>('flex')
  const [cambio, setCambio] = useState<Cambio>('manual')
  const [portas, setPortas] = useState('4')
  const [descricao, setDescricao] = useState('')
  const [opcionais, setOpcionais] = useState('')
  const [status, setStatus] = useState<StatusVeiculo>('disponivel')
  const [destaque, setDestaque] = useState(false)

  const [novaMarca, setNovaMarca] = useState('')
  const [novoModelo, setNovoModelo] = useState('')

  useEffect(() => {
    if (!modoEdicao) return
    async function carregar() {
      const { data, error } = await supabase
        .from('veiculos')
        .select('*, marca:marcas(*), modelo:modelos(*), fotos:veiculo_fotos(*)')
        .eq('id', id)
        .single()
      if (error || !data) {
        setErro('Veículo não encontrado.')
        setCarregando(false)
        return
      }
      const v = data as unknown as VeiculoComRelacoes
      setVeiculo(v)
      setMarcaId(v.marca_id)
      setModeloId(v.modelo_id)
      setVersao(v.versao ?? '')
      setAnoFabricacao(String(v.ano_fabricacao))
      setAnoModelo(String(v.ano_modelo))
      setCor(v.cor ?? '')
      setKm(String(v.km))
      setPreco(String(v.preco))
      setCombustivel((v.combustivel as Combustivel) ?? 'flex')
      setCambio((v.cambio as Cambio) ?? 'manual')
      setPortas(v.portas ? String(v.portas) : '4')
      setDescricao(v.descricao ?? '')
      setOpcionais((v.opcionais ?? []).join(', '))
      setStatus(v.status)
      setDestaque(v.destaque)
      setCarregando(false)
    }
    carregar()
  }, [id, modoEdicao])

  const modelosFiltrados = modelos.filter((m) => m.marca_id === marcaId)

  async function handleAdicionarMarca() {
    if (!novaMarca.trim()) return
    const nova = await criarMarca(novaMarca.trim())
    if (nova) { setMarcaId(nova.id); setNovaMarca('') }
  }

  async function handleAdicionarModelo() {
    if (!novoModelo.trim() || !marcaId) return
    const novo = await criarModelo(marcaId, novoModelo.trim())
    if (novo) { setModeloId(novo.id); setNovoModelo('') }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErro(null)
    if (!marcaId || !modeloId) {
      setErro('Selecione marca e modelo.')
      return
    }
    setSalvando(true)
    const payload = {
      marca_id: marcaId,
      modelo_id: modeloId,
      versao: versao || null,
      ano_fabricacao: Number(anoFabricacao),
      ano_modelo: Number(anoModelo),
      cor: cor || null,
      km: Number(km) || 0,
      preco: Number(preco) || 0,
      combustivel,
      cambio,
      portas: portas ? Number(portas) : null,
      descricao: descricao || null,
      opcionais: opcionais.split(',').map((o) => o.trim()).filter(Boolean),
      status,
      destaque,
    }
    try {
      if (modoEdicao) {
        const { error } = await supabase.from('veiculos').update(payload).eq('id', id)
        if (error) throw error
        navigate('/admin/veiculos')
      } else {
        const { data, error } = await supabase.from('veiculos').insert(payload).select().single()
        if (error) throw error
        // Redireciona para edição, onde o upload de fotos fica disponível
        navigate(`/admin/veiculos/${data.id}`, { replace: true })
      }
    } catch (err) {
      console.error('Erro ao salvar veículo:', err)
      setErro('Não foi possível salvar. Confira os campos e tente novamente.')
    } finally {
      setSalvando(false)
    }
  }

  async function handleUploadFotos(files: FileList | null) {
    if (!files || !id || !modoEdicao) return
    setEnviandoFoto(true)
    try {
      const fotosAtuais = veiculo?.fotos?.length ?? 0
      for (let i = 0; i < files.length; i++) {
        const capa = fotosAtuais === 0 && i === 0
        const foto = await uploadFotoVeiculo(id, files[i], fotosAtuais + i, capa)
        setVeiculo((v) => v ? { ...v, fotos: [...(v.fotos ?? []), foto] } : v)
      }
    } catch (err) {
      console.error('Erro ao enviar foto:', err)
      alert('Não foi possível enviar uma ou mais fotos.')
    } finally {
      setEnviandoFoto(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  async function handleRemoverFoto(fotoId: string) {
    const foto = veiculo?.fotos?.find((f) => f.id === fotoId)
    if (!foto) return
    if (!confirm('Remover esta foto?')) return
    try {
      await removerFotoVeiculo(foto)
      setVeiculo((v) => v ? { ...v, fotos: (v.fotos ?? []).filter((f) => f.id !== fotoId) } : v)
    } catch (err) {
      console.error(err)
      alert('Não foi possível remover a foto.')
    }
  }

  async function handleDefinirCapa(fotoId: string) {
    if (!id) return
    try {
      await definirCapa(id, fotoId)
      setVeiculo((v) => v ? { ...v, fotos: (v.fotos ?? []).map((f) => ({ ...f, capa: f.id === fotoId })) } : v)
    } catch (err) {
      console.error(err)
      alert('Não foi possível definir a capa.')
    }
  }

  async function handleDefinirDestaqueSemana() {
    if (!id) return
    try {
      await supabase.from('veiculos').update({ destaque_semana: false }).eq('destaque_semana', true)
      const { error } = await supabase.from('veiculos').update({ destaque_semana: true }).eq('id', id)
      if (error) throw error
      setVeiculo((v) => v ? { ...v, destaque_semana: true } : v)
    } catch (err) {
      console.error(err)
      alert('Não foi possível definir o destaque da semana.')
    }
  }

  async function handleRemoverDestaqueSemana() {
    if (!id) return
    try {
      const { error } = await supabase.from('veiculos').update({ destaque_semana: false }).eq('id', id)
      if (error) throw error
      setVeiculo((v) => v ? { ...v, destaque_semana: false } : v)
    } catch (err) {
      console.error(err)
      alert('Não foi possível remover o destaque da semana.')
    }
  }

  if (carregando) return <Loading />

  return (
    <div className="max-w-3xl">
      <Link to="/admin/veiculos" className="inline-flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] hover:text-signal mb-6">
        <ArrowLeft size={14} /> Voltar aos veículos
      </Link>

      <h1 className="display text-2xl mb-6">{modoEdicao ? 'Editar veículo' : 'Novo veículo'}</h1>

      {erro && <div className="mb-4"><MensagemErro mensagem={erro} /></div>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Marca</Label>
            <select value={marcaId} onChange={(e) => { setMarcaId(e.target.value); setModeloId('') }} required className={campoClasse}>
              <option value="">Selecione</option>
              {marcas.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
            </select>
            <div className="mt-2 flex gap-2">
              <input value={novaMarca} onChange={(e) => setNovaMarca(e.target.value)} placeholder="Nova marca..." className={`${campoClasse} text-xs`} />
              <button type="button" onClick={handleAdicionarMarca} className="shrink-0 grid h-9 w-9 place-items-center rounded-sm border border-[var(--color-border)] hover:border-signal/50">
                <Plus size={14} />
              </button>
            </div>
          </div>

          <div>
            <Label>Modelo</Label>
            <select value={modeloId} onChange={(e) => setModeloId(e.target.value)} required disabled={!marcaId} className={campoClasse}>
              <option value="">Selecione</option>
              {modelosFiltrados.map((m) => <option key={m.id} value={m.id}>{m.nome}</option>)}
            </select>
            <div className="mt-2 flex gap-2">
              <input value={novoModelo} onChange={(e) => setNovoModelo(e.target.value)} placeholder="Novo modelo..." disabled={!marcaId} className={`${campoClasse} text-xs`} />
              <button type="button" onClick={handleAdicionarModelo} disabled={!marcaId} className="shrink-0 grid h-9 w-9 place-items-center rounded-sm border border-[var(--color-border)] hover:border-signal/50 disabled:opacity-40">
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>

        <div>
          <Label>Versão</Label>
          <input value={versao} onChange={(e) => setVersao(e.target.value)} placeholder="Ex: XLT 3.2 Diesel 4x4" className={campoClasse} />
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <div>
            <Label>Ano fabricação</Label>
            <input type="number" value={anoFabricacao} onChange={(e) => setAnoFabricacao(e.target.value)} required className={campoClasse} />
          </div>
          <div>
            <Label>Ano modelo</Label>
            <input type="number" value={anoModelo} onChange={(e) => setAnoModelo(e.target.value)} required className={campoClasse} />
          </div>
          <div>
            <Label>KM</Label>
            <input type="number" value={km} onChange={(e) => setKm(e.target.value)} className={campoClasse} />
          </div>
          <div>
            <Label>Portas</Label>
            <input type="number" value={portas} onChange={(e) => setPortas(e.target.value)} className={campoClasse} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label>Cor</Label>
            <input value={cor} onChange={(e) => setCor(e.target.value)} className={campoClasse} />
          </div>
          <div>
            <Label>Combustível</Label>
            <select value={combustivel} onChange={(e) => setCombustivel(e.target.value as Combustivel)} className={campoClasse}>
              {COMBUSTIVEIS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <div>
            <Label>Câmbio</Label>
            <select value={cambio} onChange={(e) => setCambio(e.target.value as Cambio)} className={campoClasse}>
              {CAMBIOS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <Label>Preço (R$)</Label>
          <input type="number" step="0.01" value={preco} onChange={(e) => setPreco(e.target.value)} required className={campoClasse} />
        </div>

        <div>
          <Label>Descrição</Label>
          <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} rows={3} className={campoClasse} />
        </div>

        <div>
          <Label>Opcionais (separados por vírgula)</Label>
          <input value={opcionais} onChange={(e) => setOpcionais(e.target.value)} placeholder="Ar condicionado, Direção elétrica, Multimídia" className={campoClasse} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Status</Label>
            <select value={status} onChange={(e) => setStatus(e.target.value as StatusVeiculo)} className={campoClasse}>
              {STATUS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-2 mt-6">
            <input type="checkbox" checked={destaque} onChange={(e) => setDestaque(e.target.checked)} className="h-4 w-4" />
            <span className="text-sm">Destacar na home (grade de destaques)</span>
          </label>
        </div>

        {/* Destaque da semana — foto única do hero, controle separado do destaque geral */}
        <div>
          <Label>Destaque da semana (foto grande do topo da Home)</Label>
          {!modoEdicao ? (
            <p className="text-sm text-[var(--color-muted-foreground)] rounded-sm border border-dashed border-[var(--color-border)] p-4">
              Salve o veículo primeiro para poder marcá-lo como destaque da semana.
            </p>
          ) : (
            <div className="flex items-center gap-3 rounded-sm border border-[var(--color-border)] p-4">
              {veiculo?.destaque_semana ? (
                <>
                  <span className="font-tech text-xs text-signal uppercase">✓ Este é o destaque da semana atual</span>
                  <button
                    type="button"
                    onClick={handleRemoverDestaqueSemana}
                    className="ml-auto text-xs text-[var(--color-muted-foreground)] hover:text-[var(--color-destructive)] underline"
                  >
                    Remover
                  </button>
                </>
              ) : (
                <>
                  <span className="text-sm text-[var(--color-muted-foreground)]">
                    Só um veículo pode ser o destaque da semana por vez.
                  </span>
                  <button
                    type="button"
                    onClick={handleDefinirDestaqueSemana}
                    className="ml-auto rounded-sm border border-signal/50 px-3 py-1.5 text-xs font-semibold text-signal hover:bg-signal/10"
                  >
                    Definir como destaque da semana
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Fotos — só disponível depois que o veículo existe */}
        <div>
          <Label>Fotos</Label>
          {!modoEdicao ? (
            <p className="text-sm text-[var(--color-muted-foreground)] rounded-sm border border-dashed border-[var(--color-border)] p-4">
              Salve o veículo primeiro para poder enviar fotos.
            </p>
          ) : (
            <div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
                {(veiculo?.fotos ?? []).map((f) => (
                  <div key={f.id} className="relative group rounded-sm overflow-hidden border border-[var(--color-border)] aspect-square">
                    <img src={f.url} alt="" className="h-full w-full object-cover" />
                    {f.capa && (
                      <span className="absolute top-1 left-1 bg-signal-gradient text-[var(--color-primary-foreground)] text-[9px] font-bold px-1.5 py-0.5 rounded-sm">CAPA</span>
                    )}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {!f.capa && (
                        <button type="button" onClick={() => handleDefinirCapa(f.id)} className="grid h-7 w-7 place-items-center rounded-sm bg-[var(--color-surface)] hover:text-signal" aria-label="Definir como capa">
                          <Star size={13} />
                        </button>
                      )}
                      <button type="button" onClick={() => handleRemoverFoto(f.id)} className="grid h-7 w-7 place-items-center rounded-sm bg-[var(--color-surface)] hover:text-[var(--color-destructive)]" aria-label="Remover">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <label className="inline-flex items-center gap-2 rounded-sm border border-dashed border-[var(--color-border)] px-4 py-2.5 text-sm cursor-pointer hover:border-signal/50">
                <Upload size={14} />
                {enviandoFoto ? 'Enviando...' : 'Enviar fotos'}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  disabled={enviandoFoto}
                  onChange={(e) => handleUploadFotos(e.target.files)}
                  className="hidden"
                />
              </label>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={salvando}
            className="inline-flex items-center gap-2 rounded-sm bg-signal-gradient px-5 py-3 font-semibold text-[var(--color-primary-foreground)] shadow-signal disabled:opacity-60"
          >
            {salvando ? 'Salvando...' : modoEdicao ? 'Salvar alterações' : 'Cadastrar veículo'}
          </button>
        </div>
      </form>
    </div>
  )
}

const campoClasse = 'w-full rounded-sm border border-[var(--color-input)] bg-[var(--color-background)] px-3 py-2.5 text-sm outline-none focus:border-signal'

function Label({ children }: { children: React.ReactNode }) {
  return <span className="mb-2 block font-tech text-[10px] uppercase tracking-widest text-[var(--color-muted-foreground)]">{children}</span>
}
