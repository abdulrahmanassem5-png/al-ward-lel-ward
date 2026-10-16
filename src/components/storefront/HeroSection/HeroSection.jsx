import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { STORE_INFO } from '../../../config/constants.js';
import TiltCard from '../../common/TiltCard/TiltCard.jsx';
import { Sparkles, ShoppingBag, MessageCircle, ArrowRight, ArrowLeft, ShieldCheck, HeartHandshake, Clock } from 'lucide-react';
import './HeroSection.css';

export default function HeroSection() {
  const { i18n } = useTranslation();
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
          {/* Royal Brand Crest / Full Emblem */}
          <div className="hero-full-emblem-badge animate-fade-in">
            <div className="emblem-glow-ring" />
            <img
              src="/images/logo.jpg"
              alt="الورد للورد - نصنع من الورد ذكرى"
              className="hero-full-emblem-img"
            />
          </div>

          {/* Badge */}
          <div className="hero-badge animate-fade-in">
            <span className="badge-sparkle"><Sparkles size={14} /></span>
            <span>{isAr ? '✦ حيث تلتقي فخامة الورد الإكوادوري بعراقة الصياغة الملكية ✦' : '✦ Luxury Handcrafted Floral Artistry ✦'}</span>
          </div>

          {/* Heading */}
          <h1 className="hero-headline">
            <span className="headline-sub">{isAr ? 'الورد للورد • دار صياغة الزهور والمشاعر' : 'Al-Ward Lel-Ward • Haute Floristry Atelier'}</span>
            <span className="headline-main gradient-text-gold">
              {isAr ? 'حين تَنطقُ الزهورُ بما يَعجزُ عنه البيان' : 'When Blooms Articulate What Words Cannot'}
            </span>
          </h1>

          {/* Poetic Verse */}
          <div className="hero-poetic-quote font-poetic">
            {isAr
              ? '«أتـاكَ الـوردُ مُختـالاً بأنـفـاسِ الصَّـباحِ ... ليـحكـي فـي سـكـونِ الـقلـبِ مـا عـجـزَ الـبيـان»'
              : '«Where nature’s rarest wonders are sculpted into eternal sentiments»'}
          </div>

          {/* Description */}
          <p className="hero-description">
            {isAr
              ? 'تحفٌ نباتية صِيغت بأنامل أمهر فناني التنسيق لتخليد أبهى لحظات العمر؛ ننتقي من أعالي جبال الإكوادور وبساتين هولندا أندر البتلات، لتهديها لمن يستحق بأناقة ملكية تليق بمقامكم.'
              : 'Hand-selected premium blossoms from Ecuador and Holland curated into bespoke floral masterpieces, immortalizing your most cherished moments with timeless elegance.'}
          </p>

          {/* Actions */}
          <div className="hero-actions">
            <Link to="/shop" className="hero-btn primary-btn">
              <ShoppingBag size={18} />
              <span>{isAr ? 'استكشف الروائع الملكية' : 'Explore Bouquets'}</span>
              <ArrowIcon size={16} className="btn-arrow" />
            </Link>

            <button onClick={handleWhatsAppCustom} className="hero-btn secondary-btn">
              <MessageCircle size={18} className="wa-icon-glow" />
              <span>{isAr ? 'تحدث مع مستشار التنسيق' : 'Floral Concierge'}</span>
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
                <p>{isAr ? 'زهور طبيعية وقطف الصباح' : 'Fresh Natural Blooms'}</p>
              </div>
            </div>

            <div className="metric-item">
              <div className="metric-icon-wrap">
                <HeartHandshake size={20} />
              </div>
              <div>
                <h4>+5,000</h4>
                <p>{isAr ? 'تحفة صِيغت بأعلى معايير الشغف' : 'Bouquets Crafted'}</p>
              </div>
            </div>

            <div className="metric-item">
              <div className="metric-icon-wrap">
                <Clock size={20} />
              </div>
              <div>
                <h4>{isAr ? 'موكب مبرّد' : 'Same Day'}</h4>
                <p>{isAr ? 'توصيل مكيّف يحفظ نضارة البتلات' : 'Chilled Express Delivery'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Visual Card with 3D Parallax Tilt */}
        <div className="hero-visual">
          <TiltCard maxTilt={6} glare={true} className="hero-tilt-wrapper">
            <div className="hero-visual-card glass-royal-card shimmer-active">
              <div className="visual-image-wrapper">
                <img
                  src="/images/bouquet-save-the-date.jpg"
                  alt="Save The Date Luxury Bouquet"
                  className="hero-bouquet-img"
                  onError={(e) => {
                    e.target.src = 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80';
                  }}
                />
                <div className="visual-overlay" />
              </div>

              <div className="floating-card-tag top-tag glass">
                <span className="dot-pulse" />
                <span>{isAr ? 'قطف صباحي وتجهيز ملكي فوري ✦' : 'Fresh Harvest & Immediate VIP Prep ✦'}</span>
              </div>

              <div className="floating-card-tag bottom-tag glass">
                <div className="tag-details">
                  <span className="tag-title">{isAr ? 'طقم سيف ذا ديت الملكي' : 'Save The Date Luxury Set'}</span>
                  <span className="tag-rating">★ 5.0 (42 {isAr ? 'تقييم موثق من النخبة' : 'elite reviews'})</span>
                </div>
                <Link to="/product/1" className="tag-link" title={isAr ? 'اكتشف التحفة' : 'Explore Masterpiece'}>
                  <ArrowIcon size={16} />
                </Link>
              </div>
            </div>
          </TiltCard>
        </div>
      </div>
    </section>
  );
}
