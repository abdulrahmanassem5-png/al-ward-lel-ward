import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeroSection from '../../components/storefront/HeroSection/HeroSection.jsx';
import ProductCard from '../../components/storefront/ProductCard/ProductCard.jsx';
import SocialQRs from '../../components/storefront/SocialQRs/SocialQRs.jsx';
import QuickViewModal from '../../components/storefront/QuickViewModal/QuickViewModal.jsx';
import TiltCard from '../../components/common/TiltCard/TiltCard.jsx';
import SEO from '../../components/SEO.tsx';
import { useQuickCheckout } from '../../context/QuickCheckoutContext.jsx';
import confetti from 'canvas-confetti';
import { MOCK_PRODUCTS, CATEGORIES, MOCK_TESTIMONIALS, STORE_INFO, CURRENCY } from '../../config/constants.js';
import { getStoredProducts } from '../../utils/productStorageManager.js';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Flower2,
  Gift,
  Truck,
  Star,
  CheckCircle,
  MessageCircle,
  Zap,
  Clock,
  Crown,
  Heart,
  MoonStar,
  Home,
} from 'lucide-react';
import './HomePage.css';

const CATEGORY_ICONS = {
  Crown,
  Sparkles,
  Heart,
  MoonStar,
  Home,
  Gift,
};

export default function HomePage() {
  const { i18n } = useTranslation();
  const { openQuickCheckout } = useQuickCheckout();
  const isAr = i18n.language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [activeCategory, setActiveCategory] = useState('all');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [allProducts, setAllProducts] = useState(() => getStoredProducts());

  useEffect(() => {
    const handleSync = () => setAllProducts(getStoredProducts());
    window.addEventListener('al_ward_products_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('al_ward_products_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const flagshipProduct = allProducts[0] || MOCK_PRODUCTS[0];

  // Live active offer on flagship spotlight
  const [spotlightOffer, setSpotlightOffer] = useState(null);
  const [spotlightTimeLeft, setSpotlightTimeLeft] = useState(null);

  useEffect(() => {
    const checkSpotlightOffer = () => {
      try {
        const stored = localStorage.getItem('al_ward_offers');
        if (stored) {
          const offers = JSON.parse(stored);
          if (Array.isArray(offers)) {
            const active = offers.find(
              (o) => String(o.productId) === String(flagshipProduct.id) && (o.isActive === true || o.status === 'active')
            );
            if (active) {
              const expiryDate = active.expiresAt || active.endDate;
              const end = expiryDate ? new Date(expiryDate).getTime() : 0;
              const now = Date.now();
              const diff = end - now;
              if (diff > 0) {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                const pad = (n) => String(n).padStart(2, '0');
                setSpotlightTimeLeft(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
                setSpotlightOffer(active);
              } else {
                setSpotlightOffer(null);
                setSpotlightTimeLeft(null);
              }
            } else {
              setSpotlightOffer(null);
              setSpotlightTimeLeft(null);
            }
          }
        }
      } catch (err) {
        console.error('Error in checkSpotlightOffer:', err);
      }
    };

    checkSpotlightOffer();
    const interval = setInterval(checkSpotlightOffer, 1000);
    return () => clearInterval(interval);
  }, [flagshipProduct.id]);

  const homeFilterTabs = [
    { id: 'all', name_ar: 'كافة التحف النباتية (10)', name_en: 'All Creations (10)', icon: '✦' },
    { id: 'wedding', name_ar: 'أعراس وخطوبة ملكية 💍', name_en: 'Weddings 💍', icon: '💍' },
    { id: 'occasions', name_ar: 'تتويج وتخرج ومناسبات 🎓', name_en: 'Graduations 🎓', icon: '🎓' },
  ];

  const displayedProducts = activeCategory === 'all'
    ? allProducts
    : allProducts.filter((p) => p.category === activeCategory);

  const handleWhatsAppInquiry = () => {
    const text = isAr
      ? 'مرحباً بكم دار الورد للورد، أود استشارة مستشار التنسيق الملكي لتفصيل بوكيه استثنائي لمناسبة خاصة 💐🌹'
      : 'Hello Al-Ward Lel-Ward, I would like a consultation with the master florist for a bespoke luxury bouquet 💐🌹';
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const steps = [
    {
      num: '01',
      icon: <Flower2 size={28} />,
      title_ar: '01: اختَر تحفتك أو فصّلها على مقاس مشاعرك',
      title_en: '01: Choose or Customize Masterpiece',
      desc_ar: 'تأمل تشكيلتنا المختارة من البوكيهات الفاخرة أو نسق مع مستشارنا باقة تعبر عن نبض قلبك.',
      desc_en: 'Explore our curated luxury collections or coordinate a bespoke bouquet that articulates your heartbeat.',
    },
    {
      num: '02',
      icon: <Gift size={28} />,
      title_ar: '02: دوّن عهدك في بطاقة إهداء مذهبة',
      title_en: '02: Inscribe Dedication in Gold',
      desc_ar: 'اكتب رسالتك وسنطبعها على ورق قطني فاخر، أو أرفق باركود صوتي/فيديو يخلد صوتك.',
      desc_en: 'Pen your heartfelt message scripted on cotton stationery, or attach an audio/video QR code.',
    },
    {
      num: '03',
      icon: <Truck size={28} />,
      title_ar: '03: موكب توصيل مبرّد يحفظ نضارة كل بتلة',
      title_en: '03: Chilled Climate-Controlled Procession',
      desc_ar: 'تصل هديتك في أوج نضارتها كأنها قُطفت في ذات اللحظة داخل سيارات مجهزة لحماية الزهور.',
      desc_en: 'Your floral gift arrives at peak dewy freshness within specialized climate-controlled delivery vehicles.',
    },
  ];

  return (
    <div className="home-page">
      <SEO
        title={isAr ? 'الرئيسية — دار صياغة الزهور والمشاعر الملكية' : 'Home — Royal Floristry Atelier'}
        description={
          isAr
            ? 'الورد للورد — دار صياغة الزهور والتحف النباتية الملكية. اكتشف تشكيلات البوكيهات النادرة وتصاميم الأعراس والمناسبات الفاخرة.'
            : 'Al-Ward Lel-Ward — Royal Floristry Atelier. Discover rare botanical masterpieces and bespoke floral gifts.'
        }
      />
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Featured Bouquets */}
      <section className="section featured-section">
        <div className="container-wide">
          <div className="section-header">
            <div>
              <span className="section-subtitle">
                <Sparkles size={14} />
                {isAr ? 'روائع حصرية منتقاة' : 'Curated Masterpieces'}
              </span>
              <h2 className="section-title">
                {isAr ? 'أحدث وأرقى إبداعات الدار الملكية' : 'Featured Handcrafted Bouquets'}
              </h2>
              <p className="section-poetic-quote font-poetic">
                {isAr
                  ? '«تخيّرنا لك من أصلابِ البساتينِ درراً ... تُهدي إلى الروحِ عِطراً لا يُواريهِ نسيان»'
                  : 'Crafted from rare blossoms to immortalize your finest moments'}
              </p>
            </div>
            <Link to="/shop" className="view-all-link">
              <span>{isAr ? 'استعراض كافة التحف (10)' : 'View All Bouquets (10)'}</span>
              <ArrowIcon size={16} />
            </Link>
          </div>

          {/* ✦ Masterpiece of the Season Spotlight ✦ */}
          <div className="masterpiece-spotlight-card glass-royal-card shimmer-active">
            <div className="spotlight-visual-col">
              <TiltCard maxTilt={5} glare={true} className="spotlight-tilt">
                <div className="spotlight-img-wrap">
                  <img
                    src={flagshipProduct.images?.[0] || '/images/bouquet-save-the-date.jpg'}
                    alt={isAr ? flagshipProduct.name_ar : flagshipProduct.name_en}
                    className="spotlight-img"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <span className="spotlight-badge">
                    <Sparkles size={14} />
                    <span>{isAr ? 'تحفة الموسم الأيقونية ✦' : 'Masterpiece of the Season ✦'}</span>
                  </span>
                </div>
              </TiltCard>
            </div>

            <div className="spotlight-details-col">
              <div className="spotlight-tag-row">
                {spotlightOffer && spotlightTimeLeft && (
                  <>
                    <span className="countdown-pill-badge">
                      <Clock size={12} />
                      <span>{isAr ? `ينتهي العرض [${spotlightTimeLeft}] ⏳` : `Deal Ends [${spotlightTimeLeft}] ⏳`}</span>
                    </span>
                    <span className="sensory-pill" style={{ background: 'rgba(239, 68, 68, 0.15)', borderColor: 'rgba(239, 68, 68, 0.4)', color: '#F87171' }}>
                      <span>🔥</span>
                      <span>{spotlightOffer.badgeText || (isAr ? `خصم -${spotlightOffer.discountPercent}%` : `-${spotlightOffer.discountPercent}% OFF`)}</span>
                    </span>
                  </>
                )}
                <span className="sensory-pill">
                  <span>👑</span>
                  <span>{isAr ? 'مجموعة كبار الشخصيات VIP' : 'VIP High Haute Floristry'}</span>
                </span>
                <span className="sensory-pill scent">
                  <span>🌸</span>
                  <span>{isAr ? 'عبير البيوني والمسك الأبيض' : 'Peony & White Musk Notes'}</span>
                </span>
                <span className="sensory-pill provenance">
                  <span>🌍</span>
                  <span>{isAr ? 'زهور أمستردام وإكوادور النادرة' : 'Rare Amsterdam & Quito Blooms'}</span>
                </span>
              </div>

              <h3 className="spotlight-title">
                <Link to={`/product/${flagshipProduct.id}`}>
                  {isAr ? flagshipProduct.name_ar : flagshipProduct.name_en}
                </Link>
              </h3>

              <p className="spotlight-desc">
                {isAr ? flagshipProduct.description_ar : flagshipProduct.description_en}
              </p>

              {/* Composition Provenance */}
              <div className="spotlight-provenance-grid">
                <div className="provenance-item">
                  <span className="prov-label">{isAr ? 'البتلات المختارة' : 'Rare Blooms'}:</span>
                  <span className="prov-val">{isAr ? 'بيوني هولندي أبيض ناصع' : 'Royal Dutch White Peonies'}</span>
                </div>
                <div className="provenance-item">
                  <span className="prov-label">{isAr ? 'التطريز والحفظ' : 'Craft & Accent'}:</span>
                  <span className="prov-val">{isAr ? 'حبات لؤلؤ وتول فرنسي منسدل' : 'Natural Pearls & French Tulle'}</span>
                </div>
                <div className="provenance-item">
                  <span className="prov-label">{isAr ? 'التغليف الملكي' : 'Included Box'}:</span>
                  <span className="prov-val">{isAr ? 'صندوق أرز تذكاري مخصص بالصورة' : 'Personalized Keepsake Box'}</span>
                </div>
              </div>

              <div className="spotlight-footer">
                <div className="spotlight-price-box">
                  <span className="spotlight-price-label">{isAr ? 'قيمة الاقتناء الملكي' : 'Acquisition Price'}:</span>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                    <span className="spotlight-price-num">
                      {spotlightOffer ? spotlightOffer.salePrice : flagshipProduct.price} <small>{isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en}</small>
                    </span>
                    {spotlightOffer && (
                      <span style={{ textDecoration: 'line-through', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                        {flagshipProduct.price} {isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en}
                      </span>
                    )}
                  </div>
                </div>

                <div className="spotlight-actions">
                  <button
                    onClick={() => {
                      const itemToOrder = spotlightOffer
                        ? { ...flagshipProduct, price: spotlightOffer.salePrice, originalPrice: flagshipProduct.price }
                        : flagshipProduct;
                      openQuickCheckout(itemToOrder);
                      confetti({
                        particleCount: 50,
                        spread: 60,
                        origin: { y: 0.6 },
                        colors: ['#D4A853', '#E8C87A', '#FFFFFF'],
                      });
                    }}
                    className="btn-royal-gold"
                  >
                    <Zap size={16} />
                    <span>{isAr ? 'اقتناء سريع ومباشر ⚡' : 'Instant Acquisition ⚡'}</span>
                  </button>

                  <Link to={`/product/${flagshipProduct.id}`} className="btn-royal-outline">
                    <span>{isAr ? 'تأمل التفاصيل الكاملة' : 'View Full Details'}</span>
                    <ArrowIcon size={16} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Luxury Filter Pills Bar */}
          <div className="home-filter-pills-bar">
            {homeFilterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`filter-pill-btn ${activeCategory === tab.id ? 'active' : ''}`}
              >
                <span>{isAr ? tab.name_ar : tab.name_en}</span>
              </button>
            ))}
          </div>

          <div className="products-grid">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={setQuickViewProduct}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Categories Showcase */}
      <section className="section categories-section">
        <div className="container-wide">
          <div className="section-header text-center">
            <span className="section-subtitle">
              <Sparkles size={14} />
              {isAr ? 'تناغم لكل عهد ومناسبة' : 'For Every Occasion'}
            </span>
            <h2 className="section-title">
              {isAr ? 'روائع تليق بمقام مناسباتكم' : 'Explore By Occasion'}
            </h2>
            <p className="section-poetic-quote font-poetic">
              {isAr
                ? '«لكل عهدٍ ومناسبةٍ تحفةٌ تُصاغ ... تفيضُ بوقارِ الحضورِ ونبضِ الشُّعور»'
                : 'Every precious moment has a bouquet that narrates its beauty'}
            </p>
          </div>

          <div className="categories-grid">
            {CATEGORIES.map((cat) => {
              const IconComp = CATEGORY_ICONS[cat.iconName] || Sparkles;
              return (
                <Link
                  key={cat.id}
                  to={`/shop?category=${cat.id}`}
                  className="category-card"
                >
                  <div className="cat-card-ambient-glow" />

                  {/* Circular Rose Showcase with Monoline Icon Badge */}
                  <div className="cat-card-media-wrapper">
                    <div className="cat-card-image-ring">
                      <img
                        src={cat.image}
                        alt={isAr ? cat.name_ar : cat.name_en}
                        className="cat-card-image"
                        loading="lazy"
                      />
                    </div>
                    <div className="cat-card-icon-badge" title={isAr ? cat.name_ar : cat.name_en}>
                      <IconComp size={16} strokeWidth={1.25} color="#D4AF37" />
                    </div>
                  </div>

                  {/* Title & Subtitle */}
                  <div className="cat-card-content">
                    <h3 className="cat-card-title">{isAr ? cat.name_ar : cat.name_en}</h3>
                    <p className="cat-card-subtitle">
                      {isAr ? cat.subtitle_ar : cat.subtitle_en}
                    </p>
                  </div>

                  {/* Explore Link with Directional Arrow */}
                  <div className="cat-card-action">
                    <span className="cat-card-action-text">
                      {isAr ? 'استكشف' : 'Explore'}
                    </span>
                    <span className="cat-card-arrow">
                      <ArrowIcon size={14} strokeWidth={1.5} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. How It Works */}
      <section className="section how-it-works-section">
        <div className="container-wide">
          <div className="section-header text-center">
            <span className="section-subtitle">
              <Sparkles size={14} />
              {isAr ? 'فلسفة الصياغة والقطف' : 'The Bouquet Journey'}
            </span>
            <h2 className="section-title">
              {isAr ? 'من بساتين القطف إلى وجدان من تحب' : 'From Bloom to Heart'}
            </h2>
            <p className="section-poetic-quote font-poetic">
              {isAr
                ? '«رحلةٌ من عبقِ البساتينِ إلى خفوقِ القلب ... تُحفظُ فيها النَّضارةُ وتُخلَّدُ فيها الأماني»'
                : 'A royal journey of care from the cradle of the bloom to an unforgettable smile'}
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((s, idx) => (
              <div key={idx} className="step-card glass">
                <div className="step-num">{s.num}</div>
                <div className="step-icon-box">{s.icon}</div>
                <h3 className="step-title">{isAr ? s.title_ar : s.title_en}</h3>
                <p className="step-desc">{isAr ? s.desc_ar : s.desc_en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Testimonials */}
      <section className="section testimonials-section">
        <div className="container-wide">
          <div className="section-header text-center">
            <span className="section-subtitle">
              <Sparkles size={14} />
              {isAr ? 'أصداء اعتزاز ووفاء' : 'Customer Stories'}
            </span>
            <h2 className="section-title">
              {isAr ? 'شهادات من منحناهم شرف تخليد لحظاتهم الأغلى' : 'What Our Clients Say'}
            </h2>
            <p className="section-poetic-quote font-poetic">
              {isAr
                ? '«ثقةٌ نعتزُّ بها .. حين تُصبحُ مشاعرُكم أمانةً في محرابِ إتقانِنا»'
                : 'When our blooms touch hearts, gratitude transcends words'}
            </p>
          </div>

          <div className="testimonials-grid">
            {MOCK_TESTIMONIALS.map((t) => (
              <div key={t.id} className="testimonial-card glass">
                <div className="testi-stars">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#D4A853" color="#D4A853" />
                  ))}
                </div>
                <p className="testi-quote">"{isAr ? t.text_ar : t.text_en}"</p>
                <div className="testi-author">
                  <div className="author-avatar">
                    {(isAr ? t.name_ar : t.name_en).charAt(0)}
                  </div>
                  <div>
                    <h4 className="author-name">{isAr ? t.name_ar : t.name_en}</h4>
                    <span className="author-badge">
                      <CheckCircle size={12} /> {isAr ? (t.title_ar || 'عميل معتمد') : 'Verified Buyer'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Social Community QR Codes (Facebook, TikTok, Instagram, WhatsApp) */}
      <SocialQRs />

      {/* 7. CTA Consultation Banner */}
      <section className="section cta-section">
        <div className="container-wide">
          <div className="cta-banner glass">
            <div className="cta-content">
              <span className="cta-tag">
                <Sparkles size={14} />
                {isAr ? 'استشارة الذوق وتفصيل التحف الخاصة' : 'Bespoke Order Consultation'}
              </span>
              <h2 className="cta-title">
                {isAr
                  ? 'هل تبحث عن تحفة زهور فريدة تُصاغ خصيصاً لمناسبتك؟'
                  : 'Looking for a one-of-a-kind bouquet for your event?'}
              </h2>
              <p className="cta-desc">
                {isAr
                  ? 'تحدث مباشرة مع مستشار التنسيق الملكي عبر واتساب لتنفيذ باقة أحلامك بأدق معايير الإتقان وبطاقات الإهداء المذهبة والرموز الصوتية.'
                  : 'Connect directly with our master florists via WhatsApp to tailor your dream floral arrangement.'}
              </p>
              <button onClick={handleWhatsAppInquiry} className="cta-btn">
                <MessageCircle size={20} />
                <span>{isAr ? 'بدء محادثة الكونسيرج الفورية ✦' : 'Chat with Master Florist'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
