import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { toPng } from 'html-to-image';
import { MOCK_PRODUCTS, STORE_INFO, CURRENCY } from '../../config/constants.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import CinematicBackground from '../../components/common/CinematicBackground/CinematicBackground.jsx';
import {
  Printer,
  QrCode,
  Sparkles,
  Copy,
  Check,
  Flower2,
  Heart,
  Award,
  Film,
  Mic,
  Image as ImageIcon,
  Link as LinkIcon,
  CheckCircle2,
  Crown,
  Download,
} from 'lucide-react';
import './QRCodesPage.css';

export default function QRCodesPage() {
  const { t, i18n } = useTranslation();
  const { showSuccess } = useNotification();
  const isAr = i18n.language === 'ar';
  const currencySymbol = isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en;

  const [qrValue, setQrValue] = useState('https://alwardlelward.com/dedication/123');
  const [recipient, setRecipient] = useState('سارة الغالية');
  const [sender, setSender] = useState('محمد');
  const [personalNote, setPersonalNote] = useState(
    'كل عام وأنتِ زهرة أيامي وسر سعادتي، عهدٌ محفورٌ بالورد أن تبقي دائماً الأغلى والأقرب لقلبي 🌹✨'
  );
  const [selectedProduct, setSelectedProduct] = useState(MOCK_PRODUCTS[0]?.id || '1');
  const [colorTheme, setColorTheme] = useState('gold'); // 'gold' | 'ivory' | 'burgundy' | 'parchment'
  const [cardFormat, setCardFormat] = useState('tag'); // 'tag' | 'card'
  const [dedicationType, setDedicationType] = useState('video'); // 'video' | 'audio' | 'album' | 'link'
  const [showWaxSeal, setShowWaxSeal] = useState(true);
  const [showLogo, setShowLogo] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const bouquet = MOCK_PRODUCTS.find((p) => p.id === selectedProduct) || MOCK_PRODUCTS[0];

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadImage = async () => {
    const cardElement = document.getElementById('printable-card');
    if (!cardElement) return;

    try {
      setIsDownloading(true);
      const dataUrl = await toPng(cardElement, {
        quality: 0.98,
        pixelRatio: 2, // 2x retina high-resolution
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `al-ward-dedication-card-${colorTheme}.png`;
      link.href = dataUrl;
      link.click();
      showSuccess(isAr ? 'تم حفظ بطاقة الإهداء كصورة فائقة الدقة بنجاح' : 'Card image saved successfully');
    } catch (err) {
      console.error('Failed to export card image:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(qrValue);
    setCopied(true);
    showSuccess(isAr ? 'تم نسخ رابط الإهداء بنجاح' : 'Dedication link copied');
    setTimeout(() => setCopied(false), 2000);
  };

  // QR theme colors
  const getThemeColors = () => {
    switch (colorTheme) {
      case 'ivory':
        return { bg: '#FDFBF7', fg: '#1A141C' };
      case 'burgundy':
        return { bg: '#231219', fg: '#E8C87A' };
      case 'parchment':
        return { bg: '#F4ECE1', fg: '#2C1D11' };
      case 'gold':
      default:
        return { bg: '#0A070C', fg: '#E8C87A' };
    }
  };

  const { bg, fg } = getThemeColors();

  return (
    <div className="qrcodes-page-wrapper">
      {/* Photorealistic Velvety Rose Cinematic Background */}
      <CinematicBackground
        imageSrc="/images/background/rose-bouquet-cinematic.jpg"
        petalCount={26}
        interactive={true}
      />

      <div className="qrcodes-page">
        {/* Page Top Header */}
        <div className="page-header qrcodes-header glass-header">
          <div className="header-text-group">
            <div className="header-tag-chip">
              <Crown size={14} />
              <span>{isAr ? 'قسم بطاقات الهدايا الملكية' : 'Royal Gift Tags Atelier'}</span>
            </div>
            <h1 className="page-title">
              {isAr ? 'مولد بطاقات وباركود الإهداء التفاعلي' : 'Interactive QR Presentation Tag Generator'}
            </h1>
            <p className="page-desc">
              {isAr
                ? 'تصميم وطباعة كروت الإهداء الفاخرة المرفقة مع البوكيهات برابط فيديو أو صوت مع ختم الشمع الملكي'
                : 'Design and print luxury presentation tags with interactive video/audio QR code & royal wax seal'}
            </p>
          </div>

          <div className="header-actions">
            <button
              onClick={handleDownloadImage}
              disabled={isDownloading}
              className="btn-download-tag"
              title={isAr ? 'حفظ البطاقة كصورة PNG عالية الدقة' : 'Download High-Res PNG Image'}
            >
              <Download size={18} />
              <span>
                {isDownloading
                  ? (isAr ? 'جاري التجهيز...' : 'Preparing...')
                  : (isAr ? 'حفظ كصورة عالية الدقة' : 'Download Card Image')}
              </span>
            </button>

            <button onClick={handlePrint} className="btn-print-tag">
              <Printer size={18} />
              <span>{isAr ? 'طباعة بطاقة التقديم الآن' : 'Print Presentation Tag'}</span>
            </button>
          </div>
        </div>


        {/* Workspace: Customizer Controls + Live Presentation Card Preview */}
        <div className="qr-generator-grid">
          {/* Controls Column */}
          <div className="qr-controls-card glass">
            <div className="controls-header">
              <div className="controls-title-row">
                <Sparkles size={18} className="gold-icon" />
                <h3 className="section-title-sm">{isAr ? 'تخصيص بطاقة التقديم' : 'Card Customization'}</h3>
              </div>
              <span className="controls-subtitle">
                {isAr ? 'اضبط بيانات الإهداء ومظهر الكرت التفاعلي' : 'Configure tag content & luxury styling'}
              </span>
            </div>

            {/* Bouquet Selector */}
            <div className="qr-field">
              <label>{isAr ? 'البوكيه المرفق بالكرت' : 'Associated Bouquet'}</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="qr-select"
              >
                {MOCK_PRODUCTS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {isAr ? p.name_ar : p.name_en} ({p.sale_price || p.price} {currencySymbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Dedication Type */}
            <div className="qr-field">
              <label>{isAr ? 'نوع المحتوى التفاعلي في الـ QR' : 'Interactive Content Type'}</label>
              <div className="type-buttons-grid">
                {[
                  { id: 'video', label_ar: 'فيديو خاص', label_en: 'Video', icon: Film },
                  { id: 'audio', label_ar: 'تسجيل صوتي', label_en: 'Audio Note', icon: Mic },
                  { id: 'album', label_ar: 'ألبوم صور', label_en: 'Photo Album', icon: ImageIcon },
                  { id: 'link', label_ar: 'رابط مباشر', label_en: 'Custom URL', icon: LinkIcon },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setDedicationType(item.id)}
                      className={`type-btn ${dedicationType === item.id ? 'active' : ''}`}
                    >
                      <Icon size={14} />
                      <span>{isAr ? item.label_ar : item.label_en}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interactive URL */}
            <div className="qr-field">
              <label>{isAr ? 'رابط الإهداء التفاعلي (QR Destination URL)' : 'QR Code URL'}</label>
              <div className="input-with-action">
                <input
                  type="text"
                  value={qrValue}
                  onChange={(e) => setQrValue(e.target.value)}
                  placeholder="https://alwardlelward.com/dedication/..."
                  className="qr-input-field"
                />
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="btn-field-action"
                  title={isAr ? 'نسخ الرابط' : 'Copy URL'}
                >
                  {copied ? <Check size={16} className="text-emerald" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            {/* Names: Recipient & Sender */}
            <div className="qr-fields-row">
              <div className="qr-field">
                <label>{isAr ? 'إلى (اسم المستلم / المهدى إليه)' : 'To (Recipient)'}</label>
                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder={isAr ? 'مثال: سارة الغالية' : 'e.g. Sarah'}
                  className="qr-input-field"
                />
              </div>
              <div className="qr-field">
                <label>{isAr ? 'من (اسم صاحب الإهداء)' : 'From (Sender)'}</label>
                <input
                  type="text"
                  value={sender}
                  onChange={(e) => setSender(e.target.value)}
                  placeholder={isAr ? 'مثال: محمد' : 'e.g. Mohamed'}
                  className="qr-input-field"
                />
              </div>
            </div>

            {/* Personal Note */}
            <div className="qr-field">
              <label>{isAr ? 'رسالة الإهداء المطبوعة داخل البطاقة' : 'Printed Dedication Message'}</label>
              <textarea
                rows={3}
                value={personalNote}
                onChange={(e) => setPersonalNote(e.target.value)}
                placeholder={isAr ? 'اكتب كلماتك من القلب...' : 'Write your heartfelt message...'}
                className="qr-textarea"
              />
            </div>

            {/* Theme Selector */}
            <div className="qr-field">
              <label>{isAr ? 'خامة وثيم البطاقة الملكية' : 'Luxury Tag Material & Theme'}</label>
              <div className="theme-chips">
                <button
                  type="button"
                  onClick={() => setColorTheme('gold')}
                  className={`theme-chip chip-gold ${colorTheme === 'gold' ? 'active' : ''}`}
                >
                  <span className="chip-dot dot-gold" />
                  <span>{isAr ? 'المخمل الأسود والذهب' : 'Black Velvet & Gold'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setColorTheme('burgundy')}
                  className={`theme-chip chip-burgundy ${colorTheme === 'burgundy' ? 'active' : ''}`}
                >
                  <span className="chip-dot dot-burgundy" />
                  <span>{isAr ? 'العقيق القرمزي والذهب' : 'Velvet Crimson'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setColorTheme('ivory')}
                  className={`theme-chip chip-ivory ${colorTheme === 'ivory' ? 'active' : ''}`}
                >
                  <span className="chip-dot dot-ivory" />
                  <span>{isAr ? 'العاجي اللؤلؤي' : 'Royal Ivory'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setColorTheme('parchment')}
                  className={`theme-chip chip-parchment ${colorTheme === 'parchment' ? 'active' : ''}`}
                >
                  <span className="chip-dot dot-parchment" />
                  <span>{isAr ? 'الورق القطني المعتق' : 'Cotton Parchment'}</span>
                </button>
              </div>
            </div>

            {/* Format & Details Switches */}
            <div className="qr-field-switches">
              <label className="switch-row">
                <input
                  type="checkbox"
                  checked={showLogo}
                  onChange={(e) => setShowLogo(e.target.checked)}
                />
                <span>{isAr ? 'إظهار لوجو دار "الورد للورد" في أعلى الكرت' : 'Show Brand Logo at Top'}</span>
              </label>

              <label className="switch-row">
                <input
                  type="checkbox"
                  checked={showWaxSeal}
                  onChange={(e) => setShowWaxSeal(e.target.checked)}
                />
                <span>{isAr ? 'ختم الشمع الملكي في أسفل الكرت' : 'Royal Wax Seal Stamp'}</span>
              </label>
            </div>
          </div>

          {/* Live Printable Presentation Card Preview */}
          <div className="qr-preview-col">
            <div className="preview-label-bar">
              <span className="live-pulse-dot" />
              <span>{isAr ? 'معاينة بطاقة التقديم المطبوعة (Live Presentation Tag Preview)' : 'Live Tag Preview'}</span>
            </div>

            {/* The Master Luxury Presentation Tag */}
            <div
              className={`printable-gift-card theme-${colorTheme} format-${cardFormat}`}
              id="printable-card"
              dir={isAr ? 'rtl' : 'ltr'}
            >
              {/* Luxury Ribbon Hanger Notch */}
              <div className="tag-hanger-notch">
                <span className="grommet-ring" />
                <span className="grommet-hole" />
                <div className="silk-ribbon-bow">
                  <span className="bow-ribbon-left" />
                  <span className="bow-center" />
                  <span className="bow-ribbon-right" />
                </div>
              </div>

              {/* Ornate Gold Border Frame */}
              <div className="tag-border-frame">
                {/* Corner Accents */}
                <span className="frame-corner corner-tl">❖</span>
                <span className="frame-corner corner-tr">❖</span>
                <span className="frame-corner corner-bl">❖</span>
                <span className="frame-corner corner-br">❖</span>

                {/* Brand Logo & Crown Header at the Top */}
                <div className="card-brand-top">
                  {showLogo && (
                    <div className="card-logo-crest-wrap">
                      <div className="crest-gold-ring">
                        <img
                          src="/images/logo.jpg"
                          alt="الورد للورد"
                          className="card-brand-logo-img"
                        />
                      </div>
                    </div>
                  )}

                  <div className="brand-text-block">
                    <span className="brand-crown-icon">👑</span>
                    <h2 className="brand-text">{isAr ? STORE_INFO.name_ar : STORE_INFO.name_en}</h2>
                    <span className="brand-atelier-tag">
                      {isAr ? 'دار الزهور الطبيعية الراقية والتذكارات الملكية' : 'Haute Floristry & Royal Keepsakes'}
                    </span>
                  </div>

                  {/* Ornate Filigree Line */}
                  <div className="card-filigree-divider">
                    <span className="filigree-line" />
                    <span className="filigree-diamond">✦ ❖ ✦</span>
                    <span className="filigree-line" />
                  </div>
                </div>

                {/* Recipient Line */}
                <div className="card-recipient-line">
                  <span className="label-to">{isAr ? 'إلــى حضــرة:' : 'To:'}</span>
                  <span className="name-to">{recipient || (isAr ? 'المهدى إليه' : 'Recipient')}</span>
                </div>

                {/* Heartfelt Dedication Message */}
                <div className="card-message-wrapper">
                  <span className="quote-mark quote-start">❝</span>
                  <p className="card-message">
                    {personalNote || (isAr ? 'رسالة الإهداء الخاصة...' : 'Your message...')}
                  </p>
                  <span className="quote-mark quote-end">❞</span>
                </div>

                {/* Sender Line */}
                <div className="card-sender-line">
                  <span className="label-from">{isAr ? 'مع أسمى مشاعر الود والتقدير من:' : 'With all love from:'}</span>
                  <span className="name-from">{sender || (isAr ? 'صاحب الإهداء' : 'Sender')}</span>
                </div>

                {/* Interactive QR Code Showcase Section */}
                <div className="card-qr-section">
                  <div className="qr-container-luxury">
                    <div className="qr-box">
                      <QRCodeSVG
                        value={qrValue || 'https://alwardlelward.com'}
                        size={110}
                        bgColor={bg}
                        fgColor={fg}
                        level="H"
                        includeMargin={false}
                      />
                    </div>
                  </div>

                  <div className="qr-multimedia-badge">
                    {dedicationType === 'video' && <Film size={13} className="badge-icon" />}
                    {dedicationType === 'audio' && <Mic size={13} className="badge-icon" />}
                    {dedicationType === 'album' && <ImageIcon size={13} className="badge-icon" />}
                    {dedicationType === 'link' && <QrCode size={13} className="badge-icon" />}
                    <span>
                      {dedicationType === 'video' && (isAr ? 'امسح الباركود لمشاهدة فيديو الإهداء الخاص' : 'Scan to view private video')}
                      {dedicationType === 'audio' && (isAr ? 'امسح الباركود للاستماع للرسالة الصوتية' : 'Scan to listen to voice note')}
                      {dedicationType === 'album' && (isAr ? 'امسح الباركود لمشاهدة ألبوم الذكريات' : 'Scan to view photo album')}
                      {dedicationType === 'link' && (isAr ? 'امسح الباركود لفتح صفحة التهنئة التفاعلية' : 'Scan to open dedication')}
                    </span>
                  </div>
                </div>

                {/* Bottom Authenticity Strip & Wax Seal */}
                <div className="card-footer-strip">
                  <div className="footer-meta-info">
                    <span className="bouquet-mark-title">
                      {isAr ? bouquet.name_ar : bouquet.name_en}
                    </span>
                    <span className="craft-certificate">
                      {isAr
                        ? 'تحفة زهور طبيعية صُنعت يدوياً بحرفية • دار الورد للورد'
                        : 'Handcrafted Haute Floristry Masterpiece • Al-Ward'}
                    </span>
                  </div>

                  {showWaxSeal && (
                    <div className="royal-wax-seal" title={isAr ? 'ختم شمع ملكي أصلي' : 'Royal Wax Seal'}>
                      <div className="wax-seal-inner">
                        <span className="wax-emblem">🌹</span>
                        <span className="wax-text">{isAr ? 'خُتم بالحب' : 'Sealed'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
