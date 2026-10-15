import { useState } from 'react';
import { Outlet, NavLink, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext.jsx';
import {
  LayoutDashboard,
  ShoppingBag,
  PackageCheck,
  Flower2,
  Boxes,
  TrendingUp,
  QrCode,
  LogOut,
  Globe,
  ExternalLink,
  Menu,
  X,
  Bell,
  Sparkles,
  ChevronRight,
  Users,
  Settings,
} from 'lucide-react';
import './DashboardLayout.css';

export default function DashboardLayout() {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAr = i18n.language === 'ar';

  const toggleLang = () => {
    const next = isAr ? 'en' : 'ar';
    i18n.changeLanguage(next);
    document.body.dir = next === 'ar' ? 'rtl' : 'ltr';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const currentUser = user || {
    name: isAr ? 'أحمد السعيد' : 'Ahmed Al-Saeed',
    role: 'admin',
    email: 'admin@alward.com',
  };

  const navItems = [
    { to: '/dashboard', label_ar: 'نظرة عامة', label_en: 'Overview', icon: <LayoutDashboard size={20} />, exact: true },
    { to: '/dashboard/orders', label_ar: 'إدارة الطلبات', label_en: 'Orders', icon: <ShoppingBag size={20} />, badge: '3' },
    { to: '/dashboard/products', label_ar: 'كتالوج البوكيهات', label_en: 'Bouquets Catalog', icon: <Flower2 size={20} /> },
    { to: '/dashboard/inventory', label_ar: 'المخزون والمواد', label_en: 'Raw Inventory', icon: <Boxes size={20} /> },
    { to: '/dashboard/analytics', label_ar: 'المبيعات والأداء', label_en: 'Analytics', icon: <TrendingUp size={20} /> },
    { to: '/dashboard/customers', label_ar: 'سجل العملاء', label_en: 'Customers', icon: <Users size={20} /> },
    { to: '/dashboard/qr-codes', label_ar: 'طباعة الباركود QR', label_en: 'QR Tag Generator', icon: <QrCode size={20} /> },
    { to: '/dashboard/settings', label_ar: 'إعدادات المتجر', label_en: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className="dashboard-container">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`dashboard-sidebar glass ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <Link to="/" className="sidebar-logo">
            <span className="brand-flower">🌹</span>
            <div>
              <span className="brand-name">{isAr ? 'الورد للورد' : 'Al-Ward'}</span>
              <span className="brand-tag">{isAr ? 'لوحة الإدارة' : 'Admin Portal'}</span>
            </div>
          </Link>
          <button className="sidebar-close-btn" onClick={() => setSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{isAr ? item.label_ar : item.label_en}</span>
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="sidebar-link link-storefront" target="_blank">
            <ExternalLink size={18} />
            <span>{isAr ? 'زيارة المتجر' : 'Visit Storefront'}</span>
          </Link>

          <div className="user-profile-widget glass">
            <div className="user-avatar">
              {(currentUser.name || 'A').charAt(0)}
            </div>
            <div className="user-info">
              <span className="user-name">{currentUser.name}</span>
              <span className="user-role">{isAr ? 'صلاحيات كاملة' : 'Super Admin'}</span>
            </div>
            <button onClick={handleLogout} className="btn-logout" title={isAr ? 'تسجيل الخروج' : 'Logout'}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* Top Header */}
        <header className="dashboard-topbar glass">
          <div className="topbar-start">
            <button
              className="mobile-sidebar-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>
            <div className="topbar-welcome">
              <h3>{isAr ? 'مرحباً، مدير المتجر' : 'Welcome, Florist Admin'} ✦</h3>
              <p>{isAr ? 'متابعة الطلبات ونضارة الزهور والمخزون' : 'Tracking orders, stems freshness & inventory'}</p>
            </div>
          </div>

          <div className="topbar-actions">
            <button onClick={toggleLang} className="topbar-btn" title="Toggle Language">
              <Globe size={18} />
              <span>{isAr ? 'English' : 'عربي'}</span>
            </button>

            <Link to="/dashboard/orders" className="topbar-btn notif-btn">
              <Bell size={18} />
              <span className="notif-dot" />
            </Link>

            <Link to="/" className="btn-view-store">
              <ExternalLink size={16} />
              <span>{isAr ? 'المتجر' : 'Store'}</span>
            </Link>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="dashboard-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
