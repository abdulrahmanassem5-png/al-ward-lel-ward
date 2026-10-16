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
                ? 'موكب توصيل مبرّد ومكيّف يحفظ نضارة الورد لكافة مناطق القاهرة والجيزة'
                : 'Chilled luxury express delivery across Cairo & Giza preserving fresh blooms'}
            </span>
          </span>

          <span className="announce-divider">✦</span>

          <span className="announce-item hide-mobile">
            <Sparkles size={14} className="announce-icon" />
            <span>
              {isAr
                ? 'تحف نباتية تُصاغ بأنامل أمهر فناني التنسيق الملكي'
                : 'Handcrafted luxury floral masterpieces made with royal artistry'}
            </span>
          </span>

          <span className="announce-divider hide-mobile">✦</span>

          <a
            href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(
              isAr ? 'مرحباً بكم دار الورد للورد، أود استشارة مستشار التنسيق الملكي 🌹✨' : 'Hello Al-Ward Lel-Ward, I would like concierge assistance 🌹✨'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="announce-item announce-link"
          >
            <Phone size={13} className="announce-icon" />
            <span>{isAr ? `كونسيرج الزهور الملكي: ${STORE_INFO.phone}` : `Royal Concierge: ${STORE_INFO.phone}`}</span>
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
