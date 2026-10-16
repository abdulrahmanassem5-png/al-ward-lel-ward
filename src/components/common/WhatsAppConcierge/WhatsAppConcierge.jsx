import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X, Sparkles, Send } from 'lucide-react';
import { STORE_INFO } from '../../../config/constants.js';
import './WhatsAppConcierge.css';

export default function WhatsAppConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const handleStartChat = () => {
    const text = isAr
      ? 'مرحباً بكم دار الورد للورد 🌹✨، يشرفني استشارة مستشار التنسيق الملكي لتفصيل بوكيه خاص لمناسبة سعيدة...'
      : 'Hello Al-Ward Lel-Ward 🌹✨, I would like to consult the royal floral concierge for a special occasion...';
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className={`whatsapp-concierge ${isOpen ? 'open' : ''}`}>
      {/* Floating Popover Chat Bubble */}
      {isOpen && (
        <div className="concierge-popover glass animate-scale-up">
          <div className="concierge-header">
            <div className="concierge-avatar">
              <span className="avatar-icon">🌹</span>
              <span className="live-status-dot" />
            </div>
            <div className="concierge-meta">
              <h4 className="concierge-title">
                {isAr ? 'مستشار التنسيق الملكي ✦ الورد للورد' : 'Royal Floral Concierge'}
              </h4>
              <span className="concierge-status">
                <Sparkles size={11} /> {isAr ? 'في خدمة ذوقكم الرفيع الآن' : 'At your distinguished service'}
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="concierge-close"
              aria-label="Close"
            >
              <X size={15} />
            </button>
          </div>

          <div className="concierge-body">
            <p className="concierge-bubble font-poetic" style={{ fontSize: '1rem', lineHeight: '1.7' }}>
              {isAr
                ? 'مرحباً بك في دار «الورد للورد» الملكية 🌹✨.. يُسعدني مرافقتك لاختيار أو صياغة التحفة النباتية التي تعبر عن أسمى مشاعرك وتليق بمقام مناسبتك.'
                : 'Welcome to Al-Ward Lel-Ward Atelier 🌹✨.. It is my honor to assist you in curating the floral masterpiece that articulates your deepest sentiments.'}
            </p>
          </div>

          <div className="concierge-footer">
            <button onClick={handleStartChat} className="concierge-send-btn">
              <span>{isAr ? 'بدء محادثة الكونسيرج الفورية' : 'Start Royal Consultation'}</span>
              <Send size={15} />
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="concierge-trigger"
        aria-label="Floral Concierge WhatsApp"
      >
        <span className="trigger-pulse-ring" />
        <span className="trigger-icon-wrap">
          {isOpen ? <X size={22} /> : <MessageCircle size={24} />}
        </span>
        <span className="trigger-online-dot" />
      </button>
    </div>
  );
}
