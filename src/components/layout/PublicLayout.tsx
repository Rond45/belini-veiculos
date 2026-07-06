import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { WhatsAppFloat } from './WhatsAppFloat'

export function PublicLayout() {
  // TODO: número puxado de `configuracoes.telefone_whatsapp_principal`
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat numero="5569999999999" />
    </div>
  )
}
