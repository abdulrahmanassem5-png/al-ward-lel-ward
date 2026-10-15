import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../../context/CartContext.jsx';
import { STORE_INFO } from '../../../config/constants.js';
import { Home, Flower2, ShoppingBag, MessageCircle, Crown } from 'lucide-react';
import './MobileAppDock.css';

export default function MobileAppDock() {
  const { i18n } = useTranslation();
  const { totalItems } = useCart();
  const isAr = i18n.language === 'ar';

  const handleWhatsAppClick = (e) => {
    e.preventDefault();
    const text = isAr
      ? 'مرحباً، أود استشارة منسق الزهور بمتجر "الورد للورد" 🌹'
      : 'Hello, I would like to consult the florist at Al-Ward Lel-Ward 🌹';
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <nav className="mobile-app-dock" aria-label="Mobile Navigation">
      <NavLink
        to="/"
        className={({ isActive }) => `dock-item ${isActive ? 'active' : ''}`}
        end
      >
        <Home size={20} className="dock-icon" />
        <span className="dock-label">{isAr ? 'الرئيسية' : 'Home'}</span>
      </NavLink>

      <NavLink
        to="/shop"
        className={({ isActive }) => `dock-item ${isActive ? 'active' : ''}`}
      >
        <Flower2 size={20} className="dock-icon" />
        <span className="dock-label">{isAr ? 'المتجر' : 'Shop'}</span>
      </NavLink>

      <NavLink
        to="/cart"
        className={({ isActive }) => `dock-item dock-cart-item ${isActive ? 'active' : ''}`}
      >
        <div className="dock-icon-wrap">
          <ShoppingBag size={20} className="dock-icon" />
          {totalItems > 0 && <span className="dock-badge">{totalItems}</span>}
        </div>
        <span className="dock-label">{isAr ? 'السلة' : 'Cart'}</span>
      </NavLink>

      <button onClick={handleWhatsAppClick} className="dock-item dock-whatsapp-item" type="button">
        <div className="dock-icon-wrap">
          <MessageCircle size={20} className="dock-icon wa-icon" />
          <span className="wa-pulse-dot" />
        </div>
        <span className="dock-label">{isAr ? 'واتساب' : 'WhatsApp'}</span>
      </button>

      <NavLink
        to="/dashboard"
        className={({ isActive }) => `dock-item ${isActive ? 'active' : ''}`}
      >
        <Crown size={20} className="dock-icon gold-crown" />
        <span className="dock-label">{isAr ? 'الإدارة' : 'Admin'}</span>
      </NavLink>
    </nav>
  );
}
