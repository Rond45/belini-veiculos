-- =====================================================================
-- Belini Veículos — Schema Inicial
-- Convenção: snake_case, tabelas no plural, toda tabela com id/created_at/updated_at
-- RLS ativo em 100% das tabelas, sem exceção (padrão MRSS Solution)
-- =====================================================================

-- ---------------------------------------------------------------------
-- ADMIN_USERS — perfis administrativos (vinculados ao Supabase Auth)
-- ---------------------------------------------------------------------
create table admin_users (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  role text not null check (role in ('admin', 'gerente', 'vendedor')) default 'vendedor',
  whatsapp text,
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- MARCAS e MODELOS
-- ---------------------------------------------------------------------
create table marcas (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  created_at timestamptz not null default now()
);

create table modelos (
  id uuid primary key default gen_random_uuid(),
  marca_id uuid not null references marcas(id) on delete cascade,
  nome text not null,
  created_at timestamptz not null default now(),
  unique (marca_id, nome)
);

-- ---------------------------------------------------------------------
-- VEICULOS — entidade central do estoque
-- ---------------------------------------------------------------------
create table veiculos (
  id uuid primary key default gen_random_uuid(),
  marca_id uuid not null references marcas(id),
  modelo_id uuid not null references modelos(id),
  versao text,
  ano_fabricacao int not null,
  ano_modelo int not null,
  cor text,
  km int not null default 0,
  preco numeric(12,2) not null,
  combustivel text check (combustivel in ('flex', 'gasolina', 'etanol', 'diesel', 'hibrido', 'eletrico')),
  cambio text check (cambio in ('manual', 'automatico', 'automatizado', 'cvt')),
  portas int,
  descricao text,
  opcionais text[], -- ex: {'ar condicionado','direção elétrica','multimídia'}
  status text not null check (status in ('disponivel', 'reservado', 'vendido')) default 'disponivel',
  destaque boolean not null default false,
  vendedor_id uuid references admin_users(id),
  visualizacoes int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_veiculos_status on veiculos(status);
create index idx_veiculos_marca on veiculos(marca_id);
create index idx_veiculos_destaque on veiculos(destaque) where destaque = true;
create index idx_veiculos_preco on veiculos(preco);

-- ---------------------------------------------------------------------
-- VEICULO_FOTOS — galeria de imagens por veículo
-- ---------------------------------------------------------------------
create table veiculo_fotos (
  id uuid primary key default gen_random_uuid(),
  veiculo_id uuid not null references veiculos(id) on delete cascade,
  url text not null,
  ordem int not null default 0,
  capa boolean not null default false,
  created_at timestamptz not null default now()
);

create index idx_veiculo_fotos_veiculo on veiculo_fotos(veiculo_id, ordem);

-- ---------------------------------------------------------------------
-- LEADS — captação de contatos (WhatsApp, simulador, formulário)
-- ---------------------------------------------------------------------
create table leads (
  id uuid primary key default gen_random_uuid(),
  veiculo_id uuid references veiculos(id) on delete set null,
  nome text,
  telefone text not null,
  origem text not null check (
    origem in ('whatsapp_veiculo', 'whatsapp_geral', 'simulador_financiamento', 'formulario_contato')
  ),
  mensagem text,
  status text not null check (status in ('novo', 'em_atendimento', 'convertido', 'perdido')) default 'novo',
  vendedor_atribuido_id uuid references admin_users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_leads_status on leads(status);
create index idx_leads_created on leads(created_at desc);

-- ---------------------------------------------------------------------
-- POSTS — blog / conteúdo institucional
-- ---------------------------------------------------------------------
create table posts (
  id uuid primary key default gen_random_uuid(),
  titulo text not null,
  slug text not null unique,
  conteudo text not null,
  resumo text,
  imagem_capa_url text,
  publicado boolean not null default false,
  autor_id uuid references admin_users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_posts_publicado on posts(publicado, created_at desc);

-- ---------------------------------------------------------------------
-- CONFIGURACOES — linha única com dados gerais da loja
-- ---------------------------------------------------------------------
create table configuracoes (
  id int primary key default 1,
  nome_loja text not null default 'Belini Veículos',
  endereco text,
  telefone_whatsapp_principal text,
  instagram_url text,
  banner_home_url text,
  sobre_texto text,
  updated_at timestamptz not null default now(),
  constraint singleton_row check (id = 1)
);

insert into configuracoes (id, nome_loja) values (1, 'Belini Veículos');

-- =====================================================================
-- TRIGGERS — updated_at automático
-- =====================================================================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_admin_users_updated before update on admin_users
  for each row execute function set_updated_at();
create trigger trg_veiculos_updated before update on veiculos
  for each row execute function set_updated_at();
create trigger trg_leads_updated before update on leads
  for each row execute function set_updated_at();
create trigger trg_posts_updated before update on posts
  for each row execute function set_updated_at();
create trigger trg_configuracoes_updated before update on configuracoes
  for each row execute function set_updated_at();

-- =====================================================================
-- RLS — ativo em todas as tabelas, sem exceção
-- =====================================================================
alter table admin_users enable row level security;
alter table marcas enable row level security;
alter table modelos enable row level security;
alter table veiculos enable row level security;
alter table veiculo_fotos enable row level security;
alter table leads enable row level security;
alter table posts enable row level security;
alter table configuracoes enable row level security;

-- Função auxiliar: verifica se o usuário autenticado é admin/gerente ativo
create or replace function is_admin_ou_gerente()
returns boolean as $$
  select exists (
    select 1 from admin_users
    where id = auth.uid() and ativo = true and role in ('admin', 'gerente')
  );
$$ language sql security definer stable;

create or replace function is_equipe_ativa()
returns boolean as $$
  select exists (
    select 1 from admin_users
    where id = auth.uid() and ativo = true
  );
$$ language sql security definer stable;

-- ADMIN_USERS: cada um vê o próprio perfil; admin/gerente vê todos
create policy "admin_users_self_read" on admin_users
  for select using (id = auth.uid() or is_admin_ou_gerente());
create policy "admin_users_admin_write" on admin_users
  for all using (is_admin_ou_gerente());

-- MARCAS / MODELOS: leitura pública, escrita só equipe
create policy "marcas_public_read" on marcas for select using (true);
create policy "marcas_equipe_write" on marcas for insert with check (is_equipe_ativa());
create policy "marcas_equipe_update" on marcas for update using (is_equipe_ativa());
create policy "marcas_equipe_delete" on marcas for delete using (is_admin_ou_gerente());

create policy "modelos_public_read" on modelos for select using (true);
create policy "modelos_equipe_write" on modelos for insert with check (is_equipe_ativa());
create policy "modelos_equipe_update" on modelos for update using (is_equipe_ativa());
create policy "modelos_equipe_delete" on modelos for delete using (is_admin_ou_gerente());

-- VEICULOS: leitura pública total (vitrine), escrita só equipe ativa
create policy "veiculos_public_read" on veiculos for select using (true);
create policy "veiculos_equipe_insert" on veiculos for insert with check (is_equipe_ativa());
create policy "veiculos_equipe_update" on veiculos for update using (is_equipe_ativa());
create policy "veiculos_admin_delete" on veiculos for delete using (is_admin_ou_gerente());

-- VEICULO_FOTOS: leitura pública, escrita só equipe
create policy "fotos_public_read" on veiculo_fotos for select using (true);
create policy "fotos_equipe_write" on veiculo_fotos for insert with check (is_equipe_ativa());
create policy "fotos_equipe_update" on veiculo_fotos for update using (is_equipe_ativa());
create policy "fotos_equipe_delete" on veiculo_fotos for delete using (is_equipe_ativa());

-- LEADS: qualquer visitante pode criar (formulário público); só equipe lê/atualiza
create policy "leads_public_insert" on leads for insert with check (true);
create policy "leads_equipe_read" on leads for select using (is_equipe_ativa());
create policy "leads_equipe_update" on leads for update using (is_equipe_ativa());
create policy "leads_admin_delete" on leads for delete using (is_admin_ou_gerente());

-- POSTS: público só vê publicados; equipe vê e edita tudo
create policy "posts_public_read" on posts for select using (publicado = true);
create policy "posts_equipe_read_all" on posts for select using (is_equipe_ativa());
create policy "posts_equipe_write" on posts for insert with check (is_equipe_ativa());
create policy "posts_equipe_update" on posts for update using (is_equipe_ativa());
create policy "posts_admin_delete" on posts for delete using (is_admin_ou_gerente());

-- CONFIGURACOES: leitura pública, escrita só admin
create policy "config_public_read" on configuracoes for select using (true);
create policy "config_admin_write" on configuracoes for update using (is_admin_ou_gerente());
