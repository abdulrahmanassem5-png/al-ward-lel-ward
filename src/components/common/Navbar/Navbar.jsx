import { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../../context/CartContext.jsx';
import { ShoppingBag, Menu, X, Globe, User } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { totalItems } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAr = i18n.language === 'ar';

  const toggleLang = useCallback(() => {
    const next = isAr ? 'en' : 'ar';
    i18n.changeLanguage(next);
    document.body.dir = next === 'ar' ? 'rtl' : 'ltr';
  }, [isAr, i18n]);

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/shop', label: t('nav.shop') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
    { to: '/dashboard', label: isAr ? 'لوحة الإدارة 👑' : 'Dashboard 👑' },
  ];

  return (
    <header className="navbar glass">
      <div className="navbar-inner container-wide">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">🌹</span>
          <span className="logo-text">{isAr ? 'الورد للورد' : 'Al-Ward'}</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-links">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`nav-link ${location.pathname === l.to ? 'active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="navbar-actions">
          <Link to="/dashboard" className="nav-dashboard-badge">
            <span>👑 {isAr ? 'لوحة الإدارة' : 'Dashboard'}</span>
          </Link>

          <button className="nav-action-btn" onClick={toggleLang} aria-label="Toggle language">
            <Globe size={18} />
            <span className="lang-label">{isAr ? 'EN' : 'عربي'}</span>
          </button>

          <Link to="/cart" className="nav-action-btn cart-btn">
            <ShoppingBag size={18} />
            {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
          </Link>

          <Link to="/login" className="nav-action-btn" title={isAr ? 'تسجيل الدخول' : 'Sign In'}>
            <User size={18} />
          </Link>

          <button
            className="nav-action-btn mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        {links.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="mobile-link"
            onClick={() => setMobileOpen(false)}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
