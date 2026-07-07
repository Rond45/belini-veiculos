// Re-exporta o hook a partir do AuthContext centralizado.
// Motivo: useAuth() não pode mais ser um hook independente — precisa ler
// de uma única fonte de verdade compartilhada (ver src/context/AuthContext.tsx),
// senão login e proteção de rota podem discordar sobre o estado da sessão
// no instante entre a autenticação e o carregamento do perfil.
export { useAuth } from '@/context/AuthContext'
