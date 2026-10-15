import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Sparkles, Truck, Phone, X } from 'lucide-react';
import { STORE_INFO } from '../../../config/constants.js';
import './AnnouncementBar.css';

export default function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  if (!visible) return null;

  return (
    <div className="announcement-bar">
      <div className="announcement-inner container-wide">
        <div className="announcement-items">
          <span className="announce-item">
            <Truck size={14} className="announce-icon" />
            <span>
              {isAr
                ? 'توصيل مجاني وسريع لكافة مناطق القاهرة والجيزة للطلبات فوق 300 ج.م'
                : 'Free express delivery across Cairo & Giza for orders over 300 EGP'}
            </span>
          </span>

          <span className="announce-divider">✦</span>

          <span className="announce-item hide-mobile">
            <Sparkles size={14} className="announce-icon" />
            <span>
              {isAr
                ? 'بوكيهات يدوية فاخرة تُصنع بحب لكل مناسبة'
                : 'Handcrafted luxury bouquets made with love'}
            </span>
          </span>

          <span className="announce-divider hide-mobile">✦</span>

          <a
            href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(
              isAr ? 'مرحباً، أود استشارة منسق الزهور لطلب بوكيه 🌹' : 'Hello, I would like floral assistance 🌹'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="announce-item announce-link"
          >
            <Phone size={13} className="announce-icon" />
            <span>{isAr ? `استشارة فورية: ${STORE_INFO.phone}` : `Concierge: ${STORE_INFO.phone}`}</span>
          </a>
        </div>

        <button
          onClick={() => setVisible(false)}
          className="announce-close-btn"
          aria-label="Close announcement"
        >
          <X size={13} />
        </button>
      </div>
    </div>
  );
}
