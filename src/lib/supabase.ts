import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Variáveis de ambiente Supabase não configuradas. Copie .env.example para .env.local e preencha.'
  )
}

// Nota: não usamos o generic <Database> aqui de propósito — o arquivo
// src/types/database.types.ts serve como referência/documentação dos tipos,
// mas os hooks (useVeiculos, useVeiculo) já fazem o cast explícito do retorno
// para VeiculoComRelacoes, o que evita conflitos de inferência do supabase-js
// com um Database type escrito à mão.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
