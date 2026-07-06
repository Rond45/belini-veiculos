# Belini Veículos — Site + Admin

Sistema de vitrine digital + painel administrativo para a Belini Veículos (Ji-Paraná/RO).

## Stack
React 19 + Vite + TypeScript · Tailwind CSS v4 · Supabase (Auth, DB, Storage) · React Router

## Status atual (scaffold inicial)

**Feito:**
- Estrutura de projeto completa (`src/components`, `pages`, `hooks`, `lib`, `types`, `context`, `services`)
- Tema visual aplicado (preto/amarelo, identidade Belini)
- Schema completo do banco em `supabase/migrations/0001_schema_inicial.sql`:
  `admin_users`, `marcas`, `modelos`, `veiculos`, `veiculo_fotos`, `leads`, `posts`, `configuracoes`
  — RLS ativo em 100% das tabelas, triggers de `updated_at`, índices nas colunas de filtro
- Roteamento público (Home, Catálogo, Detalhe, Sobre, Contato) e admin (Login, Dashboard) com proteção de rota
- Hook `useVeiculos` com filtros (marca, preço, ano, combustível) já ligado ao Supabase
- Hook `useAuth` + `ProtectedRoute` com controle de role (admin/gerente/vendedor)
- Componente `CardVeiculo` para o catálogo
- Build de produção validado (`npm run build` limpo, sem erros de TypeScript)

**Pendente (próximas entregas):**
- [ ] Provisionar o projeto Supabase real e aplicar a migration
- [ ] Página de detalhe do veículo (galeria, ficha técnica, simulador de financiamento)
- [ ] CRUD completo de veículos no admin (upload múltiplo de fotos)
- [ ] Gestão de leads no admin
- [ ] Editor de posts (blog)
- [ ] Tela de configurações gerais (WhatsApp, banners, redes sociais)
- [ ] Login administrativo funcional
- [ ] Definição do fluxo de WhatsApp (link direto vs. atendimento automatizado) — aguardando alinhamento com o cliente
- [ ] Deploy de staging na VPS (EasyPanel) para aprovação do cliente
- [ ] Domínio definitivo

## Rodando localmente

```bash
npm install
cp .env.example .env.local   # preencher com as credenciais do projeto Supabase
npm run dev
```

## Aplicando a migration no Supabase

```bash
supabase link --project-ref <ref-do-projeto>
supabase db push
```
