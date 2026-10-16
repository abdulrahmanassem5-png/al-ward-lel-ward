import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { STORE_INFO } from '../../config/constants.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import SocialQRs from '../../components/storefront/SocialQRs/SocialQRs.jsx';
import SEO from '../../components/SEO.tsx';
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Send,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Crown,
  CheckCircle2,
} from 'lucide-react';
import './ContactPage.css';

const TOPIC_PILLS = [
  { id: 'custom_royal', label_ar: '👑 تنسيق ملكي خاص', label_en: '👑 Bespoke Royal Styling' },
  { id: 'instant_bouquet', label_ar: '💐 طلب بوكيه فوري', label_en: '💐 Instant Bouquet Order' },
  { id: 'event_wedding', label_ar: '💍 تجهيز مناسبة / خطوبة', label_en: '💍 Event & Engagement Florals' },
  { id: 'general_inquiry', label_ar: '💬 استفسار عام', label_en: '💬 General VIP Inquiry' },
];

export default function ContactPage() {
  const { i18n } = useTranslation();
  const { showSuccess } = useNotification();
  const isAr = i18n.language === 'ar';
  const ArrowIcon = isAr ? ChevronLeft : ChevronRight;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [selectedTopic, setSelectedTopic] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTopicSelect = (topic) => {
    const topicLabel = isAr ? topic.label_ar : topic.label_en;
    setSelectedTopic(topic.id);
    setFormData((prev) => ({ ...prev, subject: topicLabel }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      showSuccess(
        isAr
          ? 'تم استلام استشارتكم الملكية بنجاح 🌹✨.. سيتواصل معكم مستشار التنسيق في أسرع وقت.'
          : 'Your royal floral inquiry has been received 🌹✨.. Our concierge will be in touch shortly.'
      );
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setSelectedTopic('');
      setIsSubmitting(false);
    }, 450);
  };

  const handleWhatsAppChat = () => {
    const text = isAr
      ? 'مرحباً دار الورد للورد 🌹✨، يشرفني استشارة مستشار التنسيق الملكي لتفصيل بوكيه خاص لمناسبة سعيدة...'
      : 'Hello Al-Ward Lel-Ward 🌹✨, I would like to consult the royal floral concierge for a special bespoke bouquet...';
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePhoneCall = () => {
    window.location.href = `tel:${STORE_INFO.phone}`;
  };

  const handleEmailClick = () => {
    const subject = encodeURIComponent(isAr ? 'استشارة ملكية - دار الورد للورد' : 'Royal Floral Consultation');
    window.location.href = `mailto:${STORE_INFO.email}?subject=${subject}`;
  };

  const handleMapClick = () => {
    window.open('https://maps.google.com/?q=Cairo,Egypt', '_blank');
  };

  return (
    <div className="contact-page container-wide">
      <SEO
        title={isAr ? 'الكونسيرج الملكي والتواصل | دار الورد للورد' : 'Royal Concierge & Contact | Al-Ward Lel-Ward'}
        description={
          isAr
            ? 'تواصل مباشرة مع مستشاري تنسيق الزهور الملكية وفريق خدمة عملاء دار الورد للورد عبر واتساب والهاتف المباشر للاستشارات وتفصيل البوكيهات الفاخرة.'
            : 'Connect with Al-Ward Lel-Ward royal florists and VIP concierge via WhatsApp and direct lines for bespoke floral curation.'
        }
        canonicalUrl="https://el-ward-ll-ward-store.vercel.app/contact"
      />

      {/* Royal Editorial Header */}
      <div className="contact-header animate-fade-in">
        <div className="contact-badge-capsule">
          <Crown size={14} className="badge-crown" />
          <span>{isAr ? '✦ كونسيرج الزهور الملكي بخدمتكم ✦' : '✦ Royal Floral Concierge at Your Service ✦'}</span>
        </div>

        <h1 className="contact-title">
          {isAr ? 'تواصل مع دار الصياغة' : 'Connect with the Atelier'}
        </h1>

        <p className="contact-desc font-poetic">
          {isAr
            ? '«بين يديك مستشارو التنسيق الملكي.. نُصغي بشغف لأدق تفاصيل مناسبتكم، لنَصوغَ مشاعركم في تحفة نباتية تأسر القلوب وتليق بمقامكم الرفيع»'
            : '"At your command are our royal floral artisans.. We listen attentively to every nuance of your occasion to craft living poetry worthy of your presence."'}
        </p>
      </div>

      {/* Mobile-Only Quick VIP WhatsApp Banner */}
      <div className="contact-mobile-quick-banner glass animate-fade-in">
        <div className="quick-banner-content">
          <div className="quick-banner-avatar">
            <span className="quick-avatar-flower">🌹</span>
            <span className="quick-live-dot" />
          </div>
          <div className="quick-banner-text">
            <h4>{isAr ? 'استشارة فورية مع المنسق الملكي' : 'Instant Master Florist Consultation'}</h4>
            <p>{isAr ? 'رد فوري خلال دقائق عبر واتساب المباشر' : 'Instant reply via direct WhatsApp'}</p>
          </div>
        </div>
        <button onClick={handleWhatsAppChat} className="btn-mobile-quick-wa">
          <MessageCircle size={17} />
          <span>{isAr ? 'محادثة فورية' : 'Chat Live'}</span>
        </button>
      </div>

      {/* Main Luxury Grid: 7 cols Form + 5 cols Sticky Concierge Sidebar */}
      <div className="contact-grid">
        {/* Direct Channels Card (5 cols on Desktop, sticky) */}
        <div className="contact-info-col">
          <div className="contact-card glass">
            <div className="card-header-luxury">
              <span className="card-sparkle-pill">
                <Sparkles size={13} /> {isAr ? 'قنوات فورية' : 'Direct VIP Lines'}
              </span>
              <h3 className="info-box-title">{isAr ? 'قنوات التواصل المباشرة' : 'Direct Channels'}</h3>
              <p className="info-box-subtitle">
                {isAr
                  ? 'اختر القناة المفضلة لديك للتواصل الفوري مع نخبة صائغي الورد'
                  : 'Select your preferred channel to connect with our master artisans'}
              </p>
            </div>

            {/* Interactive 48px+ Touch Rows */}
            <div className="info-list">
              {/* WhatsApp Row */}
              <div
                className="info-interactive-row wa-row"
                onClick={handleWhatsAppChat}
                role="button"
                tabIndex={0}
                title={isAr ? 'انقر لفتح محادثة واتساب فورية' : 'Tap to start WhatsApp chat'}
              >
                <div className="row-icon-box wa-icon-box">
                  <MessageCircle size={22} />
                  <span className="row-live-dot" />
                </div>
                <div className="row-content">
                  <div className="row-label-wrap">
                    <label>{isAr ? 'واتساب المستشار الملكي' : 'Direct WhatsApp Concierge'}</label>
                    <span className="row-badge-live">{isAr ? 'متصل الآن' : 'Active'}</span>
                  </div>
                  <span className="row-val" dir="ltr">{STORE_INFO.phone}</span>
                </div>
                <div className="row-action-arrow">
                  <ArrowIcon size={16} />
                </div>
              </div>

              {/* Direct Phone Call Row */}
              <div
                className="info-interactive-row"
                onClick={handlePhoneCall}
                role="button"
                tabIndex={0}
                title={isAr ? 'انقر للاتصال الهاتفي المباشر' : 'Tap to call directly'}
              >
                <div className="row-icon-box">
                  <Phone size={20} />
                </div>
                <div className="row-content">
                  <label>{isAr ? 'الخط الهاتفي المباشر' : 'Direct Phone Line'}</label>
                  <span className="row-val" dir="ltr">{STORE_INFO.phone}</span>
                </div>
                <div className="row-action-arrow">
                  <ArrowIcon size={16} />
                </div>
              </div>

              {/* Email Row */}
              <div
                className="info-interactive-row"
                onClick={handleEmailClick}
                role="button"
                tabIndex={0}
                title={isAr ? 'انقر لإرسال بريد إلكتروني' : 'Tap to compose email'}
              >
                <div className="row-icon-box">
                  <Mail size={20} />
                </div>
                <div className="row-content">
                  <label>{isAr ? 'البريد الإلكتروني الرسمي' : 'Official VIP Email'}</label>
                  <span className="row-val" dir="ltr">{STORE_INFO.email}</span>
                </div>
                <div className="row-action-arrow">
                  <ArrowIcon size={16} />
                </div>
              </div>

              {/* Location Row */}
              <div
                className="info-interactive-row"
                onClick={handleMapClick}
                role="button"
                tabIndex={0}
                title={isAr ? 'انقر لفتح الموقع على الخريطة' : 'Tap to view location on map'}
              >
                <div className="row-icon-box">
                  <MapPin size={20} />
                </div>
                <div className="row-content">
                  <label>{isAr ? 'دار الصياغة والتوصيل' : 'Atelier & White-Glove Dispatch'}</label>
                  <span className="row-val">{isAr ? 'القاهرة والجيزة وكافة المحافظات' : 'Cairo, Giza & Nationwide'}</span>
                </div>
                <div className="row-action-arrow">
                  <ArrowIcon size={16} />
                </div>
              </div>

              {/* Working Hours Row */}
              <div className="info-interactive-row static-row">
                <div className="row-icon-box">
                  <Clock size={20} />
                </div>
                <div className="row-content">
                  <label>{isAr ? 'ساعات الاستقبال الملكي' : 'Concierge Service Hours'}</label>
                  <span className="row-val">{isAr ? 'يومياً: 9:00 ص – 11:00 م' : 'Daily: 9:00 AM – 11:00 PM'}</span>
                  <span className="row-subval">{isAr ? 'طوال أيام الأسبوع بلا انقطاع' : 'Open 7 days a week'}</span>
                </div>
              </div>
            </div>

            {/* Royal Emerald & Gold Concierge Button (Replaces neon green) */}
            <button onClick={handleWhatsAppChat} className="btn-royal-emerald-chat">
              <span className="btn-emerald-shimmer" />
              <div className="btn-emerald-content">
                <MessageCircle size={20} className="btn-emerald-icon" />
                <span className="btn-emerald-text">
                  {isAr ? 'محادثة فورية مع المنسق الملكي' : 'Consult Royal Florist on WhatsApp'}
                </span>
                <Sparkles size={16} className="btn-emerald-sparkle" />
              </div>
            </button>
          </div>
        </div>

        {/* Message Form Col (7 cols on Desktop) */}
        <div className="contact-form-col">
          <form onSubmit={handleSubmit} className="contact-form-card glass">
            <div className="card-header-luxury">
              <span className="card-sparkle-pill">
                <Crown size={13} /> {isAr ? 'استمارة الطلبات الخاصة' : 'Bespoke Inquiries'}
              </span>
              <h3 className="form-box-title">{isAr ? 'أرسل لنا تفاصيل رغبتك' : 'Send Us a Message'}</h3>
              <p className="form-box-subtitle">
                {isAr
                  ? 'املأ بيانات استفسارك، وسيقوم المنسق المختص بالتواصل معك وتصميم العرض المناسب'
                  : 'Share your requirements and our senior florist will curate the tailored proposal'}
              </p>
            </div>

            <div className="contact-form-group">
              <label>{isAr ? 'الاسم الكريم *' : 'Full Name *'}</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={isAr ? 'اكتب اسمك الكريم' : 'Your esteemed name'}
                autoComplete="name"
              />
            </div>

            <div className="contact-form-row">
              {/* Phone localized for Egypt */}
              <div className="contact-form-group">
                <label>{isAr ? 'رقم الهاتف / واتساب *' : 'Phone / WhatsApp *'}</label>
                <div className="input-with-affix">
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="01XXXXXXXXX"
                    autoComplete="tel"
                    style={{ textAlign: isAr ? 'right' : 'left' }}
                  />
                  <span className="input-country-flag" title="جمهورية مصر العربية">🇪🇬</span>
                </div>
              </div>

              {/* Email */}
              <div className="contact-form-group">
                <label>{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
                <input
                  type="email"
                  dir="ltr"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@mail.com"
                  autoComplete="email"
                  style={{ textAlign: isAr ? 'right' : 'left' }}
                />
              </div>
            </div>

            {/* Quick Topic Selection Pills */}
            <div className="contact-form-group">
              <div className="topic-header-wrap">
                <label>{isAr ? 'موضوع الاستشارة أو الطلب' : 'Inquiry Topic / Occasion'}</label>
                <span className="topic-hint">{isAr ? '(اختر لتعبئة سريعة)' : '(Tap for quick fill)'}</span>
              </div>

              <div className="topic-pills-wrap">
                {TOPIC_PILLS.map((pill) => {
                  const isSelected = selectedTopic === pill.id;
                  return (
                    <button
                      key={pill.id}
                      type="button"
                      onClick={() => handleTopicSelect(pill)}
                      className={`topic-pill-btn ${isSelected ? 'active' : ''}`}
                    >
                      <span>{isAr ? pill.label_ar : pill.label_en}</span>
                      {isSelected && <CheckCircle2 size={13} className="pill-check" />}
                    </button>
                  );
                })}
              </div>

              <input
                type="text"
                value={formData.subject}
                onChange={(e) => {
                  setSelectedTopic('');
                  setFormData({ ...formData, subject: e.target.value });
                }}
                placeholder={isAr ? 'أو اكتب موضوعاً مخصصاً هنا...' : 'Or enter a custom subject...'}
              />
            </div>

            {/* Message Body */}
            <div className="contact-form-group">
              <label>{isAr ? 'تفاصيل الاستفسار أو المناسبة *' : 'Inquiry Details or Special Notes *'}</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={
                  isAr
                    ? 'أخبرنا بتفاصيل ذوقك الرفيع، نوع المناسبة (خطوبة، زفاف، ذكرى سنوية، تقدير خاص)، أو ألوان الزهور المفضلة وتاريخ التسليم المطلوب...'
                    : 'Share the specifics of your occasion, preferred floral palettes, delivery date, or any bespoke requirements...'
                }
              />
            </div>

            {/* Primary Metallic Gold CTA */}
            <div className="submit-wrap">
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-royal-gold-submit"
              >
                <span className="btn-gold-shimmer" />
                <div className="btn-gold-inner">
                  <span>{isSubmitting ? (isAr ? 'جارٍ الإرسال...' : 'Sending...') : (isAr ? 'إرسال الرسالة إلى الكونسيرج' : 'Send Message to Concierge')}</span>
                  <Send size={18} />
                </div>
              </button>
              <p className="privacy-note">
                {isAr
                  ? '🔒 خصوصيتكم مقدسة لدينا، ولن يتم مشاركة بياناتكم مع أي طرف ثالث على الإطلاق.'
                  : '🔒 Your privacy is strictly guarded. Your contact details will never be shared.'}
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Social Community VIP Pass Cards */}
      <div className="contact-social-section">
        <SocialQRs showHeader={true} />
      </div>
    </div>
  );
}

