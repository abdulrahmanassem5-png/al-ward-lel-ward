import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { MOCK_PRODUCTS, STORE_INFO, CURRENCY } from '../../config/constants.js';
import { Printer, QrCode, Sparkles, Copy, Check, Download, Flower2 } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext.jsx';
import './QRCodesPage.css';

export default function QRCodesPage() {
  const { t, i18n } = useTranslation();
  const { showSuccess } = useNotification();
  const isAr = i18n.language === 'ar';

  const [qrValue, setQrValue] = useState('https://alwardlelward.com/dedication/123');
  const [recipient, setRecipient] = useState('سارة الغالية');
  const [sender, setSender] = useState('محمد');
  const [personalNote, setPersonalNote] = useState('كل عام وأنتِ زهرة أيامي وسر سعادتي 🌹');
  const [selectedProduct, setSelectedProduct] = useState(MOCK_PRODUCTS[0]?.id || '1');
  const [colorTheme, setColorTheme] = useState('gold'); // 'gold', 'white', 'rose'

  const bouquet = MOCK_PRODUCTS.find((p) => p.id === selectedProduct) || MOCK_PRODUCTS[0];

  const handlePrint = () => {
    window.print();
  };

  const getThemeColors = () => {
    switch (colorTheme) {
      case 'white':
        return { bg: '#FFFFFF', fg: '#0A0A0A' };
      case 'rose':
        return { bg: '#1A1A1A', fg: '#C4546D' };
      default:
        return { bg: '#0A0A0A', fg: '#D4A853' };
    }
  };

  const { bg, fg } = getThemeColors();

  return (
    <div className="qrcodes-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isAr ? 'مولد بطاقات وباركود الإهداء QR' : 'Interactive QR Gift Tag Generator'}</h1>
          <p className="page-desc">
            {isAr
              ? 'توليد وطباعة بطاقات الإهداء الفاخرة المرفقة بالبوكيهات مع الباركود التفاعلي'
              : 'Generate and print luxury gift tags with interactive video/audio QR codes'}
          </p>
        </div>
        <button onClick={handlePrint} className="btn-print-tag">
          <Printer size={18} />
          <span>{isAr ? 'طباعة كرت الإهداء الآن' : 'Print Gift Card'}</span>
        </button>
      </div>

      <div className="qr-generator-grid">
        {/* Controls Column */}
        <div className="qr-controls-card glass">
          <h3 className="section-title-sm">{isAr ? 'تخصيص بطاقة الإهداء' : 'Card Customization'}</h3>

          <div className="qr-field">
            <label>{isAr ? 'اختر البوكيه المرتبط' : 'Select Associated Bouquet'}</label>
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="qr-select"
            >
              {MOCK_PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {isAr ? p.name_ar : p.name_en} ({p.price} {isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en})
                </option>
              ))}
            </select>
          </div>

          <div className="qr-field">
            <label>{isAr ? 'رابط الإهداء التفاعلي (فيديو / صوت / رابط خاص)' : 'Interactive URL (Video / Audio / Link)'}</label>
            <input
              type="text"
              value={qrValue}
              onChange={(e) => setQrValue(e.target.value)}
              placeholder="https://..."
              className="qr-input-field"
            />
          </div>

          <div className="qr-fields-row">
            <div className="qr-field">
              <label>{isAr ? 'إلى (اسم المستلم)' : 'To (Recipient)'}</label>
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="qr-input-field"
              />
            </div>
            <div className="qr-field">
              <label>{isAr ? 'من (اسم المرسل)' : 'From (Sender)'}</label>
              <input
                type="text"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="qr-input-field"
              />
            </div>
          </div>

          <div className="qr-field">
            <label>{isAr ? 'رسالة الإهداء المطبوعة' : 'Printed Dedication Note'}</label>
            <textarea
              rows={3}
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              className="qr-textarea"
            />
          </div>

          <div className="qr-field">
            <label>{isAr ? 'ثيم ولون الباركود' : 'QR Color Theme'}</label>
            <div className="theme-chips">
              <button
                onClick={() => setColorTheme('gold')}
                className={`theme-chip ${colorTheme === 'gold' ? 'active' : ''}`}
              >
                {isAr ? 'ذهبي ملكي' : 'Royal Gold'}
              </button>
              <button
                onClick={() => setColorTheme('white')}
                className={`theme-chip ${colorTheme === 'white' ? 'active' : ''}`}
              >
                {isAr ? 'أبيض ناصع' : 'Crisp White'}
              </button>
              <button
                onClick={() => setColorTheme('rose')}
                className={`theme-chip ${colorTheme === 'rose' ? 'active' : ''}`}
              >
                {isAr ? 'وردي مخملي' : 'Velvet Rose'}
              </button>
            </div>
          </div>
        </div>

        {/* Live Printable Card Preview */}
        <div className="qr-preview-col">
          <div className="printable-gift-card" id="printable-card">
            <div className="tag-border-frame">
              <div className="card-brand-top">
                <span className="flower-icon">🌹</span>
                <span className="brand-text">{isAr ? STORE_INFO.name_ar : STORE_INFO.name_en}</span>
                <span className="tagline">{isAr ? STORE_INFO.tagline_ar : STORE_INFO.tagline_en}</span>
              </div>

              <div className="card-recipient-line">
                <span className="label-to">{isAr ? 'إلى:' : 'To:'}</span>
                <span className="name-to">{recipient || '...'}</span>
              </div>

              <p className="card-message">
                "{personalNote || '...'}"
              </p>

              <div className="card-sender-line">
                <span className="label-from">{isAr ? 'مع كل الحب من:' : 'With all love from:'}</span>
                <span className="name-from">{sender || '...'}</span>
              </div>

              <div className="card-qr-section">
                <div className="qr-box">
                  <QRCodeSVG
                    value={qrValue || 'https://alwardlelward.com'}
                    size={96}
                    bgColor={bg}
                    fgColor={fg}
                    level="H"
                  />
                </div>
                <div className="qr-hint">
                  <QrCode size={14} />
                  <span>{isAr ? 'امسح الباركود لسماع/مشاهدة الإهداء الخاص' : 'Scan to view interactive dedication'}</span>
                </div>
              </div>

              <div className="card-footer-mark">
                <span>{isAr ? bouquet.name_ar : bouquet.name_en} • {isAr ? 'صنع يدوياً بحب' : 'Handcrafted with Love'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
