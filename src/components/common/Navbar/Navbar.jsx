import { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../../context/CartContext.jsx';
import { ShoppingBag, Menu, X, Globe, User, Crown, Flower2 } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const { totalItems } = useCart();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isAr = i18n.language === 'ar';
  const isHomePage = location.pathname === '/';
  const showLogoImage = scrolled || !isHomePage;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sync document direction and language with active i18n language
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const currentLang = isAr ? 'ar' : 'en';
      const currentDir = isAr ? 'rtl' : 'ltr';
      document.documentElement.dir = currentDir;
      document.documentElement.lang = currentLang;
      document.body.dir = currentDir;
    }
  }, [isAr]);

  const toggleLang = useCallback(() => {
    const next = isAr ? 'en' : 'ar';
    i18n.changeLanguage(next);
    if (typeof document !== 'undefined') {
      const nextDir = next === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.dir = nextDir;
      document.documentElement.lang = next;
      document.body.dir = nextDir;
    }
    try {
      localStorage.setItem('i18nextLng', next);
    } catch {}
  }, [isAr, i18n]);

  const links = [
    { to: '/', label: t('nav.home') },
    { to: '/shop', label: t('nav.shop') },
    { to: '/about', label: t('nav.about') },
    { to: '/contact', label: t('nav.contact') },
  ];

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : 'at-top'}`}>
      <div className="navbar-inner container-wide">
        {/* 1. Right: Royal Brand Typographical Lockup */}
        <Link
          to="/"
          className="navbar-logo"
          title={isAr ? 'الورد للورد — دار صياغة الزهور الملكية' : 'Al-Ward Lel-Ward — Haute Floristry Atelier'}
        >
          <div className="navbar-brand-badge">
            {showLogoImage ? (
              <img
                src="/images/logo.jpg"
                alt="الورد للورد"
                className="navbar-brand-img animate-fade-in"
              />
            ) : (
              <Flower2 size={18} strokeWidth={1.3} className="navbar-brand-icon" />
            )}
          </div>
          <div className="navbar-brand-text">
            <span className="navbar-brand-title">{isAr ? 'الورد للورد' : 'Al-Ward Lel-Ward'}</span>
            <span className="navbar-brand-sub">
              {isAr ? 'دار صياغة الزهور الملكية' : 'Haute Floristry Atelier'}
            </span>
          </div>
        </Link>

        {/* 2. Center: Centered Pill Navigation */}
        <nav className="nav-center-pill-wrapper">
          <div className="nav-center-pill">
            {links.map((l) => {
              const isActive = location.pathname === l.to;
              return (
                <Link
                  key={l.to}
                  to={l.to}
                  className={`nav-pill-link ${isActive ? 'active' : ''}`}
                >
                  {isActive && <span className="nav-active-diamond" />}
                  <span>{l.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* 3. Left: Actions Group (Admin Ghost + Divider + Tools Capsule) */}
        <div className="navbar-actions">
          {/* Admin Ghost Button */}
          <Link
            to="/dashboard"
            className="nav-ghost-admin-btn"
            title={isAr ? 'لوحة الإدارة الملكية' : 'Admin Dashboard'}
          >
            <Crown size={13} strokeWidth={1.5} className="admin-btn-icon" />
            <span>{isAr ? 'لوحة الإدارة' : 'Dashboard'}</span>
          </Link>

          {/* Subtle Vertical Gold Divider */}
          <span className="nav-action-divider" aria-hidden="true" />

          {/* Unified Tools Pill Capsule */}
          <div className="nav-tools-capsule">
            {/* Language Toggle */}
            <button
              className="nav-tool-btn nav-lang-btn"
              onClick={toggleLang}
              aria-label="Toggle language"
              title={isAr ? 'Switch to English' : 'التحويل إلى العربية'}
            >
              <Globe size={15} strokeWidth={1.5} />
              <span className="lang-label">{isAr ? 'EN' : 'عربي'}</span>
            </button>

            {/* Shopping Bag / Cart */}
            <Link
              to="/cart"
              className="nav-tool-btn nav-cart-btn"
              title={isAr ? 'حقيبة الهدايا' : 'Shopping Cart'}
              aria-label="Shopping Cart"
            >
              <ShoppingBag size={16} strokeWidth={1.5} />
              {totalItems > 0 && <span className="nav-cart-badge">{totalItems}</span>}
            </Link>

            {/* User / Sign In */}
            <Link
              to="/login"
              className="nav-tool-btn nav-user-btn"
              title={isAr ? 'تسجيل الدخول' : 'Sign In'}
              aria-label="Sign In"
            >
              <User size={16} strokeWidth={1.5} />
            </Link>
          </div>

          {/* Mobile Toggle Button */}
          <button
            className="mobile-toggle-btn"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </div>

      {/* Luminous Gold Bottom Border (visible when scrolled) */}
      <div className="navbar-bottom-glow-line" />

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`}>
        <div className="mobile-menu-inner">
          {links.map((l) => {
            const isActive = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`mobile-link ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
              >
                {isActive && <span className="nav-active-diamond" />}
                <span>{l.label}</span>
              </Link>
            );
          })}
          <div className="mobile-menu-footer">
            <Link
              to="/dashboard"
              className="mobile-admin-link"
              onClick={() => setMobileOpen(false)}
            >
              <Crown size={14} strokeWidth={1.5} color="#E5C158" />
              <span>{isAr ? 'لوحة الإدارة الملكية' : 'Admin Dashboard'}</span>
            </Link>
            <button className="mobile-lang-link" onClick={toggleLang}>
              <Globe size={14} strokeWidth={1.5} />
              <span>{isAr ? 'English (EN)' : 'العربية (AR)'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

