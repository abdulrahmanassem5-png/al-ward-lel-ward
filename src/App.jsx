import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { QuickCheckoutProvider } from './context/QuickCheckoutContext.jsx';
import ToastContainer from './components/common/Toast/Toast.jsx';
import FloatingParticles from './components/common/FloatingParticles/FloatingParticles.jsx';
import CustomCursor from './components/common/CustomCursor/CustomCursor.jsx';
import Navbar from './components/common/Navbar/Navbar.jsx';
import Footer from './components/common/Footer/Footer.jsx';
import ScrollProgress from './components/common/ScrollProgress/ScrollProgress.jsx';
import AnnouncementBar from './components/common/AnnouncementBar/AnnouncementBar.jsx';
import WhatsAppConcierge from './components/common/WhatsAppConcierge/WhatsAppConcierge.jsx';
import BackToTop from './components/common/BackToTop/BackToTop.jsx';
import MobileAppDock from './components/common/MobileAppDock/MobileAppDock.jsx';

// Storefront Pages
import HomePage from './pages/storefront/HomePage.jsx';
import ShopPage from './pages/storefront/ShopPage.jsx';
import ProductPage from './pages/storefront/ProductPage.jsx';
import CartPage from './pages/storefront/CartPage.jsx';
import CheckoutPage from './pages/storefront/CheckoutPage.jsx';
import AboutPage from './pages/storefront/AboutPage.jsx';
import ContactPage from './pages/storefront/ContactPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import NotFoundPage from './pages/common/NotFoundPage.jsx';
import ProtectedRoute from './components/common/ProtectedRoute/ProtectedRoute.jsx';

// Dashboard Layout & Pages
import DashboardLayout from './layouts/DashboardLayout.jsx';
import DashboardHome from './pages/dashboard/DashboardHome.jsx';
import OrdersPage from './pages/dashboard/OrdersPage.jsx';
import OffersPage from './pages/dashboard/OffersPage.jsx';
import ProductsPage from './pages/dashboard/ProductsPage.jsx';
import InventoryPage from './pages/dashboard/InventoryPage.jsx';
import AnalyticsPage from './pages/dashboard/AnalyticsPage.jsx';
import CustomersPage from './pages/dashboard/CustomersPage.jsx';
import QRCodesPage from './pages/dashboard/QRCodesPage.jsx';
import SettingsPage from './pages/dashboard/SettingsPage.jsx';

import CinematicBackground from './components/common/CinematicBackground/CinematicBackground.jsx';

// Storefront Layout Wrapper
function StorefrontLayout() {
  return (
    <>
      <CinematicBackground />
      <AnnouncementBar />
      <Navbar />
      <main style={{ minHeight: '80vh', width: '100%', position: 'relative', zIndex: 1 }}>
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

            {/* Global floating toast notification container */}
            <ToastContainer />
          </BrowserRouter>
          </QuickCheckoutProvider>
        </CartProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}
