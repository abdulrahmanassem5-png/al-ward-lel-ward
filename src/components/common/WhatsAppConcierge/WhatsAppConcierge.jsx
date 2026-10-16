import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { MessageCircle, X, Sparkles, Send, GripVertical } from 'lucide-react';
import { STORE_INFO } from '../../../config/constants.js';
import './WhatsAppConcierge.css';

const BTN_HEIGHT = 58;
const MIN_TOP = 80;       // Minimum 80px from top header
const MIN_BOTTOM = 24;    // Minimum 24px from bottom edge
const DRAG_THRESHOLD = 5; // Pixels to distinguish click vs. drag
const STORAGE_KEY = 'alward_whatsapp_y_pos';

export default function WhatsAppConcierge() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  // Compute clamped position within safe viewport boundaries
  const clampY = (y) => {
    if (typeof window === 'undefined') return 500;
    const maxY = Math.max(MIN_TOP, window.innerHeight - BTN_HEIGHT - MIN_BOTTOM);
    return Math.max(MIN_TOP, Math.min(y, maxY));
  };

  // Initial position: from localStorage or default to 28px from bottom
  const [posY, setPosY] = useState(() => {
    if (typeof window === 'undefined') return 500;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = parseFloat(saved);
        if (!isNaN(parsed)) {
          return clampY(parsed);
        }
      }
    } catch {}
    return Math.max(MIN_TOP, window.innerHeight - BTN_HEIGHT - 28);
  });

  const dragRef = useRef(null);
  const justDraggedRef = useRef(false);

  // Recalculate and re-clamp position on window resize or mobile orientation change
  useEffect(() => {
    const handleResize = () => {
      setPosY((prevY) => clampY(prevY));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Pointer drag events: smooth 60fps tracking across both Mobile Touch and Desktop Mouse
  const handlePointerDown = (e) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    dragRef.current = {
      startY: e.clientY,
      initialY: posY,
      hasMoved: false,
    };
    setIsDragging(true);

    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e) => {
    if (!dragRef.current) return;
    const deltaY = e.clientY - dragRef.current.startY;

    if (Math.abs(deltaY) > DRAG_THRESHOLD) {
      dragRef.current.hasMoved = true;
    }

    const nextY = clampY(dragRef.current.initialY + deltaY);
    setPosY(nextY);
  };

  const handlePointerUp = (e) => {
    if (!dragRef.current) return;

    const didMove = dragRef.current.hasMoved;
    setIsDragging(false);

    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}

    if (didMove) {
      justDraggedRef.current = true;
      try {
        localStorage.setItem(STORAGE_KEY, String(posY));
      } catch {}
      // Prevent accidental toggle if user was repositioning
      setTimeout(() => {
        justDraggedRef.current = false;
      }, 140);
    }

    dragRef.current = null;
  };

  const handleTriggerClick = (e) => {
    if (justDraggedRef.current) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    setIsOpen((prev) => !prev);
  };

  const handleStartChat = () => {
    const text = isAr
      ? 'مرحباً بكم دار الورد للورد 🌹✨، يشرفني استشارة مستشار التنسيق الملكي لتفصيل بوكيه خاص لمناسبة سعيدة...'
      : 'Hello Al-Ward Lel-Ward 🌹✨, I would like to consult the royal floral concierge for a special occasion...';
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Smart placement for popover: if button is near top half, open downwards; else upwards
  const popoverPlacement = posY < 360 ? 'place-below' : 'place-above';

  return (
    <div
      className={`whatsapp-concierge ${isOpen ? 'open' : ''} ${isDragging ? 'is-dragging-active' : ''}`}
      style={{ top: `${posY}px` }}
    >
      {/* Floating Popover Chat Bubble */}
      {isOpen && (
        <div className={`concierge-popover glass animate-scale-up ${popoverPlacement}`}>
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

      {/* Main Floating Trigger Button with Vertical Dragging Support */}
      <div className="concierge-trigger-wrapper">
        <button
          onClick={handleTriggerClick}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className={`concierge-trigger ${isDragging ? 'is-dragging' : ''}`}
          aria-label="Floral Concierge WhatsApp"
          title={isAr ? 'اسحب للأعلى أو للأسفل لتغيير المكان' : 'Drag vertically to reposition'}
        >
          <span className="trigger-pulse-ring" />
          <span className="trigger-icon-wrap">
            {isOpen ? <X size={22} /> : <MessageCircle size={24} />}
          </span>
          <span className="trigger-online-dot" />

          {/* Luxury drag grip indicator */}
          <span className="trigger-drag-handle" aria-hidden="true" title="سحب عمودي">
            <GripVertical size={11} />
          </span>
        </button>
      </div>
    </div>
  );
}
