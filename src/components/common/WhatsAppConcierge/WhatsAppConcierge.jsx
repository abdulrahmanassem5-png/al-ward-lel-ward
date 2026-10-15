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
      ? 'مرحباً، أود استشارة منسق الزهور لمساعدتي في اختيار بوكيه مميز 🌹'
      : 'Hello, I would like floral concierge advice for a special bouquet 🌹';
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
                {isAr ? 'منسق زهور الورد للورد' : 'Master Floral Concierge'}
              </h4>
              <span className="concierge-status">
                <Sparkles size={11} /> {isAr ? 'متصل الآن وجاهز لمساعدتك' : 'Online & ready to assist'}
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
            <p className="concierge-bubble">
              {isAr
                ? 'أهلاً بك في "الورد للورد"! 🌸 هل تحتاج مساعدة في اختيار البوكيه المثالي لمناسبتك أو حجز موعد توصيل؟'
                : 'Welcome to Al-Ward Lel-Ward! 🌸 Need help choosing the perfect bouquet for your celebration?'}
            </p>
          </div>

          <div className="concierge-footer">
            <button onClick={handleStartChat} className="concierge-send-btn">
              <span>{isAr ? 'تحدث معنا عبر واتساب' : 'Chat on WhatsApp'}</span>
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
