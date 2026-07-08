import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
import { PublicLayout } from '@/components/layout/PublicLayout'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { ScrollToTop } from '@/components/ScrollToTop'
import { AdminLayout } from '@/components/admin/AdminLayout'
import { Home } from '@/pages/Home'
import { Catalogo } from '@/pages/Catalogo'
import { VeiculoDetalhe } from '@/pages/VeiculoDetalhe'
import { Sobre } from '@/pages/Sobre'
import { Contato } from '@/pages/Contato'
import { NotFound } from '@/pages/NotFound'
import { AdminLogin } from '@/pages/admin/Login'
import { AdminDashboard } from '@/pages/admin/Dashboard'
import { AdminVeiculos } from '@/pages/admin/Veiculos'
import { VeiculoForm } from '@/pages/admin/VeiculoForm'
import { AdminLeads } from '@/pages/admin/Leads'
import { AdminPosts } from '@/pages/admin/Posts'
import { AdminConfiguracoes } from '@/pages/admin/Configuracoes'

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Site público */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/catalogo" element={<Catalogo />} />
            <Route path="/veiculo/:id" element={<VeiculoDetalhe />} />
            <Route path="/sobre" element={<Sobre />} />
            <Route path="/contato" element={<Contato />} />
          </Route>

          {/* Admin */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/veiculos" element={<AdminVeiculos />} />
            <Route path="/admin/veiculos/novo" element={<VeiculoForm />} />
            <Route path="/admin/veiculos/:id" element={<VeiculoForm />} />
            <Route path="/admin/leads" element={<AdminLeads />} />
            <Route path="/admin/posts" element={<AdminPosts />} />
            <Route path="/admin/configuracoes" element={<AdminConfiguracoes />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
