import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { QuickCheckoutProvider } from './context/QuickCheckoutContext.jsx';
import ToastContainer from './components/common/Toast/Toast.jsx';
import CustomCursor from './components/common/CustomCursor/CustomCursor.jsx';
import Navbar from './components/common/Navbar/Navbar.jsx';
import Footer from './components/common/Footer/Footer.jsx';
import ScrollProgress from './components/common/ScrollProgress/ScrollProgress.jsx';
import AnnouncementBar from './components/common/AnnouncementBar/AnnouncementBar.jsx';
import WhatsAppConcierge from './components/common/WhatsAppConcierge/WhatsAppConcierge.jsx';
import BackToTop from './components/common/BackToTop/BackToTop.jsx';
import MobileAppDock from './components/common/MobileAppDock/MobileAppDock.jsx';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute.jsx';
import CinematicBackground from './components/common/CinematicBackground/CinematicBackground.jsx';
import RoyalLoadingFallback from './components/common/RoyalLoadingFallback/RoyalLoadingFallback.jsx';

// Lazy Loaded Storefront Pages
const HomePage = lazy(() => import('./pages/storefront/HomePage.jsx'));
const ShopPage = lazy(() => import('./pages/storefront/ShopPage.jsx'));
const ProductPage = lazy(() => import('./pages/storefront/ProductPage.jsx'));
const CartPage = lazy(() => import('./pages/storefront/CartPage.jsx'));
const CheckoutPage = lazy(() => import('./pages/storefront/CheckoutPage.jsx'));
const AboutPage = lazy(() => import('./pages/storefront/AboutPage.jsx'));
const ContactPage = lazy(() => import('./pages/storefront/ContactPage.jsx'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage.jsx'));
const NotFoundPage = lazy(() => import('./pages/common/NotFoundPage.jsx'));

// Lazy Loaded Dashboard Layout & Management Pages
const DashboardLayout = lazy(() => import('./layouts/DashboardLayout.jsx'));
const DashboardHome = lazy(() => import('./pages/dashboard/DashboardHome.jsx'));
const OrdersPage = lazy(() => import('./pages/dashboard/OrdersPage.jsx'));
const OffersPage = lazy(() => import('./pages/dashboard/OffersPage.jsx'));
const ProductsPage = lazy(() => import('./pages/dashboard/ProductsPage.jsx'));
const InventoryPage = lazy(() => import('./pages/dashboard/InventoryPage.jsx'));
const AnalyticsPage = lazy(() => import('./pages/dashboard/AnalyticsPage.jsx'));
const CustomersPage = lazy(() => import('./pages/dashboard/CustomersPage.jsx'));
const QRCodesPage = lazy(() => import('./pages/dashboard/QRCodesPage.jsx'));
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage.jsx'));

// Storefront Layout Wrapper
function StorefrontLayout() {
  return (
    <>
      <CinematicBackground />
      <AnnouncementBar />
      <Navbar />
      <main className="storefront-main-content">
        <Outlet />
      </main>
      <WhatsAppConcierge />
      <BackToTop />
      <MobileAppDock />
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <CartProvider>
          <QuickCheckoutProvider>
            <BrowserRouter>
              {/* Luxury gold interactive cursor */}
              <CustomCursor />
              {/* Top viewport scroll progress */}
              <ScrollProgress />

              {/* Royal Suspense fallback preventing white flashes during page transitions */}
              <Suspense fallback={<RoyalLoadingFallback />}>
                <Routes>
                  {/* Public Storefront Routes */}
                  <Route element={<StorefrontLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/product/:id" element={<ProductPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/checkout" element={<CheckoutPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/login" element={<LoginPage />} />
                  </Route>

                  {/* Management Dashboard Routes Protected by Password */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <DashboardLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<DashboardHome />} />
                    <Route path="orders" element={<OrdersPage />} />
                    <Route path="offers" element={<OffersPage />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="inventory" element={<InventoryPage />} />
                    <Route path="analytics" element={<AnalyticsPage />} />
                    <Route path="customers" element={<CustomersPage />} />
                    <Route path="qr-codes" element={<QRCodesPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>

                  {/* 404 Catch All */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Suspense>

              {/* Global floating toast notification container */}
              <ToastContainer />
            </BrowserRouter>
          </QuickCheckoutProvider>
        </CartProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
