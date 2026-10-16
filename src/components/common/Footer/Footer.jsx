import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { STORE_INFO } from '../../../config/constants.js';
import './Footer.css';

export default function Footer() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-badge">
                <img src="/images/logo.jpg" alt="الورد للورد" className="footer-logo-img" />
              </div>
              <span className="footer-logo-name">{isAr ? STORE_INFO.name_ar : STORE_INFO.name_en}</span>
            </div>
            <p className="footer-tagline">{t('footer.tagline')}</p>
            <div className="footer-socials">
              <a href={STORE_INFO.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" title="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href={STORE_INFO.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" title="TikTok">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/>
                </svg>
              </a>
              <a href={STORE_INFO.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" title="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href={STORE_INFO.whatsappGroup} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Community" title="WhatsApp Community">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-heading">{t('footer.quick_links')}</h4>
            <nav className="footer-nav">
              <Link to="/">{t('nav.home')}</Link>
              <Link to="/shop">{t('nav.shop')}</Link>
              <Link to="/about">{t('nav.about')}</Link>
              <Link to="/contact">{t('nav.contact')}</Link>
            </nav>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4 className="footer-heading">{t('footer.contact_us')}</h4>
            <div className="footer-contact">
              <p>{STORE_INFO.phone}</p>
              <p>{STORE_INFO.email}</p>
              <p>{isAr ? STORE_INFO.address_ar : STORE_INFO.address_en}</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom-bar">
          <div className="footer-divider-line"></div>
          <p className="footer-copyright">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
