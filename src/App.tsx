import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { FavoritesProvider } from './contexts/FavoritesContext'
import { CartProvider } from './contexts/CartContext'
import { AuthProvider } from './contexts/AuthContext'
import { MainLayout } from './layouts/MainLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { HomePage } from './pages/HomePage'
import { ProductsPage } from './pages/ProductsPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { CategoriesPage } from './pages/CategoriesPage'
import { AboutPage } from './pages/AboutPage'
import { ContactPage } from './pages/ContactPage'
import { FavoritesPage } from './pages/FavoritesPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { OrderConfirmationPage } from './pages/OrderConfirmationPage'
import { NotFoundPage } from './components/ui/ErrorPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminProductsPage } from './pages/admin/AdminProductsPage'
import { AdminCategoriesPage } from './pages/admin/AdminCategoriesPage'
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage'
import { AdminMessagesPage } from './pages/admin/AdminMessagesPage'
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage'
import { HelmetProvider } from './components/ui/HelmetProvider'
import { ProtectedRoute } from './components/ui/ProtectedRoute'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <FavoritesProvider>
        <CartProvider>
          <AuthProvider>
            <BrowserRouter>
              <HelmetProvider />
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/produkter" element={<ProductsPage />} />
                  <Route path="/produkter/:id" element={<ProductDetailPage />} />
                  <Route path="/kategorier" element={<CategoriesPage />} />
                  <Route path="/om-oss" element={<AboutPage />} />
                  <Route path="/kontakt" element={<ContactPage />} />
                  <Route path="/favoriter" element={<FavoritesPage />} />
                  <Route path="/varukorg" element={<CartPage />} />
                  <Route path="/kassa" element={<CheckoutPage />} />
                  <Route path="/orderbekraftelse/:token" element={<OrderConfirmationPage />} />
                </Route>

                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="produkter" element={<AdminProductsPage />} />
                  <Route path="kategorier" element={<AdminCategoriesPage />} />
                  <Route path="bestallningar" element={<AdminOrdersPage />} />
                  <Route path="meddelanden" element={<AdminMessagesPage />} />
                  <Route path="installningar" element={<AdminSettingsPage />} />
                </Route>

                <Route path="*" element={<MainLayout />}>
                  <Route path="*" element={<NotFoundPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#1f2937',
                  color: '#f3f4f6',
                  borderRadius: '12px',
                },
                success: {
                  iconTheme: { primary: '#C9A227', secondary: '#fff' },
                },
              }}
            />
          </AuthProvider>
        </CartProvider>
      </FavoritesProvider>
    </QueryClientProvider>
  )
}
