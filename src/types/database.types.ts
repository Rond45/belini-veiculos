// Types manuais espelhando supabase/migrations/0001_schema_inicial.sql
// Quando o projeto Supabase real estiver criado, substituir por:
// npx supabase gen types typescript --project-id <ref> > src/types/database.types.ts

export type StatusVeiculo = 'disponivel' | 'reservado' | 'vendido'
export type Combustivel = 'flex' | 'gasolina' | 'etanol' | 'diesel' | 'hibrido' | 'eletrico'
export type Cambio = 'manual' | 'automatico' | 'automatizado' | 'cvt'
export type OrigemLead = 'whatsapp_veiculo' | 'whatsapp_geral' | 'simulador_financiamento' | 'formulario_contato'
export type StatusLead = 'novo' | 'em_atendimento' | 'convertido' | 'perdido'
export type RoleAdmin = 'admin' | 'gerente' | 'vendedor'

export interface AdminUser {
  id: string
  nome: string
  role: RoleAdmin
  whatsapp: string | null
  ativo: boolean
  created_at: string
  updated_at: string
}

export interface Marca {
  id: string
  nome: string
  created_at: string
}

export interface Modelo {
  id: string
  marca_id: string
  nome: string
  created_at: string
}

export interface Veiculo {
  id: string
  marca_id: string
  modelo_id: string
  versao: string | null
  ano_fabricacao: number
  ano_modelo: number
  cor: string | null
  km: number
  preco: number
  combustivel: Combustivel | null
  cambio: Cambio | null
  portas: number | null
  descricao: string | null
  opcionais: string[] | null
  status: StatusVeiculo
  destaque: boolean
  destaque_semana: boolean
  vendedor_id: string | null
  visualizacoes: number
  created_at: string
  updated_at: string
}

export interface VeiculoComRelacoes extends Veiculo {
  marca: Marca
  modelo: Modelo
  fotos: VeiculoFoto[]
}

export interface VeiculoFoto {
  id: string
  veiculo_id: string
  url: string
  ordem: number
  capa: boolean
  created_at: string
}

export interface Lead {
  id: string
  veiculo_id: string | null
  nome: string | null
  telefone: string
  origem: OrigemLead
  mensagem: string | null
  status: StatusLead
  vendedor_atribuido_id: string | null
  created_at: string
  updated_at: string
}

export interface Post {
  id: string
  titulo: string
  slug: string
  conteudo: string
  resumo: string | null
  imagem_capa_url: string | null
  publicado: boolean
  autor_id: string | null
  created_at: string
  updated_at: string
}

export interface Configuracoes {
  id: number
  nome_loja: string
  endereco: string | null
  telefone_whatsapp_principal: string | null
  instagram_url: string | null
  banner_home_url: string | null
  sobre_texto: string | null
  updated_at: string
}

// Assinatura mínima usada pelo createClient<Database>() do supabase-js
export interface Database {
  public: {
    Tables: {
      admin_users: { Row: AdminUser; Insert: Partial<AdminUser>; Update: Partial<AdminUser> }
      marcas: { Row: Marca; Insert: Partial<Marca>; Update: Partial<Marca> }
      modelos: { Row: Modelo; Insert: Partial<Modelo>; Update: Partial<Modelo> }
      veiculos: { Row: Veiculo; Insert: Partial<Veiculo>; Update: Partial<Veiculo> }
      veiculo_fotos: { Row: VeiculoFoto; Insert: Partial<VeiculoFoto>; Update: Partial<VeiculoFoto> }
      leads: { Row: Lead; Insert: Partial<Lead>; Update: Partial<Lead> }
      posts: { Row: Post; Insert: Partial<Post>; Update: Partial<Post> }
      configuracoes: { Row: Configuracoes; Insert: Partial<Configuracoes>; Update: Partial<Configuracoes> }
    }
  }
}
