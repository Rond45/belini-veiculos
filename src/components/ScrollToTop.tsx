import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Sem isso, uma SPA mantém a posição de rolagem da página anterior ao navegar —
 * diferente de um site tradicional, onde cada página nova sempre abre do topo.
 * Este componente corrige isso, resetando a rolagem toda vez que a rota muda.
 */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
