import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { STORE_INFO } from '../../../config/constants.js';
import { Sparkles, ShoppingBag, MessageCircle, ArrowRight, ArrowLeft, ShieldCheck, HeartHandshake, Clock } from 'lucide-react';
import './HeroSection.css';

export default function HeroSection() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const handleWhatsAppCustom = () => {
    const text = isAr
      ? `مرحباً، أود تفصيل بوكيه ورد يدوي خاص بتصميم مميز 🌹`
      : `Hello, I would like to customize a handcrafted bouquet 🌹`;
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <section className="hero-section">
      {/* Visual Ambient Glows */}
      <div className="hero-glow-gold" />
      <div className="hero-glow-rose" />

      <div className="hero-container container-wide">
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge animate-fade-in">
            <span className="badge-sparkle"><Sparkles size={14} /></span>
            <span>{isAr ? 'حرفية يدوية فاخرة بأعلى معايير الجودة' : 'Luxury Handcrafted Floral Artistry'}</span>
          </div>

          {/* Heading */}
          <h1 className="hero-headline">
            <span className="headline-sub">{isAr ? 'الورد للورد' : 'Al-Ward Lel-Ward'}</span>
            <span className="headline-main gradient-text-gold">
              {isAr ? 'نصنع من الورد ذكرى' : 'We Craft Memories From Flowers'}
            </span>
          </h1>

          {/* Description */}
          <p className="hero-description">
            {isAr
              ? 'نختار أجود الزهور الطبيعية الهولندية والإكوادورية لنصيغ منها تحفاً فنية تلهم قلوبكم وتخلد أجمل اللحظات والمناسبات السعيدة.'
              : 'Hand-selected premium blossoms curated into bespoke floral masterpieces, immortalizing your most cherished moments with timeless elegance.'}
          </p>

          {/* Actions */}
          <div className="hero-actions">
            <Link to="/shop" className="hero-btn primary-btn">
              <ShoppingBag size={18} />
              <span>{isAr ? 'تصفح البوكيهات' : 'Explore Bouquets'}</span>
              <ArrowIcon size={16} className="btn-arrow" />
            </Link>

            <button onClick={handleWhatsAppCustom} className="hero-btn secondary-btn">
              <MessageCircle size={18} className="wa-icon-glow" />
              <span>{isAr ? 'طلب بوكيه مخصص' : 'Custom Bouquet'}</span>
            </button>
          </div>

          {/* Trust Metrics */}
          <div className="hero-metrics">
            <div className="metric-item">
              <div className="metric-icon-wrap">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4>100%</h4>
                <p>{isAr ? 'زهور طبيعية طازجة' : 'Fresh Natural Blooms'}</p>
              </div>
            </div>

            <div className="metric-item">
              <div className="metric-icon-wrap">
                <HeartHandshake size={20} />
              </div>
              <div>
                <h4>+5,000</h4>
                <p>{isAr ? 'بوكيه مصنوع بشغف' : 'Bouquets Crafted'}</p>
              </div>
            </div>

            <div className="metric-item">
              <div className="metric-icon-wrap">
                <Clock size={20} />
              </div>
              <div>
                <h4>{isAr ? 'نفس اليوم' : 'Same Day'}</h4>
                <p>{isAr ? 'توصيل مبرد سريع' : 'Chilled Express Delivery'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Visual Card */}
        <div className="hero-visual">
          <div className="hero-visual-card glass">
            <div className="visual-image-wrapper">
              <img
                src="/images/bouquet-save-the-date.jpg"
                alt="Save The Date Luxury Bouquet"
                className="hero-bouquet-img"
              />
              <div className="visual-overlay" />
            </div>

            <div className="floating-card-tag top-tag glass">
              <span className="dot-pulse" />
              <span>{isAr ? 'طلب مباشر وفوري' : 'Live Ordering Available'}</span>
            </div>

            <div className="floating-card-tag bottom-tag glass">
              <div className="tag-details">
                <span className="tag-title">{isAr ? 'طقم سيف ذا ديت الملكي' : 'Save The Date Luxury Set'}</span>
                <span className="tag-rating">★ 5.0 (42 {isAr ? 'تقييم' : 'reviews'})</span>
              </div>
              <Link to="/product/1" className="tag-link">
                <ArrowIcon size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
