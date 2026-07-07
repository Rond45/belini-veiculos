export const formatBRL = (v: number) =>
  v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })

export const formatKM = (v: number) => `${v.toLocaleString('pt-BR')} km`

export const COMBUSTIVEL_LABEL: Record<string, string> = {
  flex: 'Flex',
  gasolina: 'Gasolina',
  etanol: 'Etanol',
  diesel: 'Diesel',
  hibrido: 'Híbrido',
  eletrico: 'Elétrico',
}

export const CAMBIO_LABEL: Record<string, string> = {
  manual: 'Manual',
  automatico: 'Automático',
  automatizado: 'Automatizado',
  cvt: 'CVT',
}

/** Formata um número bruto (ex: 5569900000000, padrão salvo em `configuracoes`) para exibição (ex: (69) 9 0000-0000). */
export function formatTelefoneExibicao(numero: string): string {
  const digitos = numero.replace(/\D/g, '')
  // 55 + DDD (2) + 9 + 8 dígitos = 13 no total
  const semPais = digitos.startsWith('55') && digitos.length >= 12 ? digitos.slice(2) : digitos
  if (semPais.length === 11) {
    return `(${semPais.slice(0, 2)}) ${semPais.slice(2, 3)} ${semPais.slice(3, 7)}-${semPais.slice(7)}`
  }
  if (semPais.length === 10) {
    return `(${semPais.slice(0, 2)}) ${semPais.slice(2, 6)}-${semPais.slice(6)}`
  }
  return numero
}
