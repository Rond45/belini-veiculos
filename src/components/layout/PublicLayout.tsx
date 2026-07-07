import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { WhatsAppFloat } from './WhatsAppFloat'
import { useConfiguracoes } from '@/hooks/useConfiguracoes'

export function PublicLayout() {
  const { data: config } = useConfiguracoes()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat numero={config?.telefone_whatsapp_principal || undefined} />
    </div>
  )
}
