import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import HeroSection from '../../components/storefront/HeroSection/HeroSection.jsx';
import ProductCard from '../../components/storefront/ProductCard/ProductCard.jsx';
import SocialQRs from '../../components/storefront/SocialQRs/SocialQRs.jsx';
import QuickViewModal from '../../components/storefront/QuickViewModal/QuickViewModal.jsx';
import { MOCK_PRODUCTS, CATEGORIES, MOCK_TESTIMONIALS, STORE_INFO } from '../../config/constants.js';
import { Sparkles, ArrowRight, ArrowLeft, Heart, Flower2, Gift, Truck, Star, CheckCircle, MessageCircle, SlidersHorizontal } from 'lucide-react';
import './HomePage.css';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const [activeCategory, setActiveCategory] = useState('all');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const homeFilterTabs = [
    { id: 'all', name_ar: 'كافة الروائع (10)', name_en: 'All Creations (10)', icon: '✦' },
    { id: 'wedding', name_ar: 'أعراس وخطوبة 💍', name_en: 'Weddings 💍', icon: '💍' },
    { id: 'occasions', name_ar: 'تخرج واحتفالات 🎓', name_en: 'Graduations 🎓', icon: '🎓' },
  ];

  const displayedProducts = activeCategory === 'all'
    ? MOCK_PRODUCTS
    : MOCK_PRODUCTS.filter((p) => p.category === activeCategory);

  const handleWhatsAppInquiry = () => {
    const text = isAr
      ? 'مرحباً، أود استشارة منسق الزهور لاختيار بوكيه مناسب لمناسبة خاصة 💐'
      : 'Hello, I would like a floral consultation for a special occasion 💐';
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const steps = [
    {
      num: '01',
      icon: <Flower2 size={28} />,
      title_ar: 'اختر أو خصّص بوكيهك',
      title_en: 'Choose or Customize',
      desc_ar: 'تصفح تشكيلة بوكيهاتنا الفاخرة أو اختر باقة مخصصة بالورود والألوان والملحقات التي تفضلها.',
      desc_en: 'Explore our luxury bouquets or request a customized arrangement with your chosen stems.',
    },
    {
      num: '02',
      icon: <Gift size={28} />,
      title_ar: 'أضف لمستك وبطاقتك',
      title_en: 'Personalize & Card',
      desc_ar: 'اكتب رسالتك الخاصة وطباعة إهداء فاخر أو باركود صوتي/فيديو يرافق هديتك.',
      desc_en: 'Write your heartfelt message and include a luxury card or audio QR code.',
    },
    {
      num: '03',
      icon: <Truck size={28} />,
      title_ar: 'توصيل مبرد وسريع',
      title_en: 'Chilled Express Delivery',
      desc_ar: 'سيارات مجهزة تحافظ على نضارة كل ورقة ورد لتصل هديتك كأنها قُطفت في ذات اللحظة.',
      desc_en: 'Climate-controlled delivery preserving every petal as if freshly picked.',
    },
  ];

  return (
    <div className="home-page">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Featured Bouquets */}
      <section className="section featured-section">
        <div className="container-wide">
          <div className="section-header">
            <div>
              <span className="section-subtitle">
                <Sparkles size={14} />
                {isAr ? 'روائع مختارة وحصرية' : 'Curated Masterpieces'}
              </span>
              <h2 className="section-title">
                {isAr ? 'أحدث وأرقى إبداعاتنا الحقيقية' : 'Featured Handcrafted Bouquets'}
              </h2>
            </div>
            <Link to="/shop" className="view-all-link">
              <span>{isAr ? 'عرض جميع البوكيهات (10)' : 'View All Bouquets (10)'}</span>
              <ArrowIcon size={16} />
            </Link>
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
              {isAr ? 'تناغم لكل مناسبة' : 'For Every Occasion'}
            </span>
            <h2 className="section-title">
              {isAr ? 'تصفح حسب المناسبة' : 'Explore By Occasion'}
            </h2>
            <p className="section-desc">
              {isAr
                ? 'لكل لحظة بوكيه يحكي تفاصيلها بجمال لا يُنسى'
                : 'Every precious moment has a bouquet that narrates its beauty'}
            </p>
          </div>

          <div className="categories-grid">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                className="category-card glass"
              >
                <div className="cat-card-icon">{cat.icon}</div>
                <h3 className="cat-card-title">{isAr ? cat.name_ar : cat.name_en}</h3>
                <span className="cat-card-arrow">
                  <ArrowIcon size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section className="section how-it-works-section">
        <div className="container-wide">
          <div className="section-header text-center">
            <span className="section-subtitle">
              <Sparkles size={14} />
              {isAr ? 'رحلة البوكيه' : 'The Bouquet Journey'}
            </span>
            <h2 className="section-title">
              {isAr ? 'كيف نصنع بوكيهاتكم' : 'How We Craft Your Gift'}
            </h2>
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
              {isAr ? 'شهادات نعتز بها' : 'Customer Stories'}
            </span>
            <h2 className="section-title">
              {isAr ? 'ماذا يقول عملاؤنا' : 'What Our Clients Say'}
            </h2>
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
                      <CheckCircle size={12} /> {isAr ? 'عميل معتمد' : 'Verified Buyer'}
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
                {isAr ? 'طلب خاص واستشارة مباشرة' : 'Bespoke Order Consultation'}
              </span>
              <h2 className="cta-title">
                {isAr
                  ? 'هل تبحث عن تصميم بوكيه استثنائي لمناسبتك؟'
                  : 'Looking for a one-of-a-kind bouquet for your event?'}
              </h2>
              <p className="cta-desc">
                {isAr
                  ? 'تحدث مباشرة مع فريق التنسيق الحرفي لدينا عبر واتساب لتنفيذ باقة أحلامك بأدق التفاصيل والرسائل التذكارية.'
                  : 'Connect directly with our master florists via WhatsApp to tailor your dream floral arrangement.'}
              </p>
              <button onClick={handleWhatsAppInquiry} className="cta-btn">
                <MessageCircle size={20} />
                <span>{isAr ? 'تواصل معنا عبر واتساب الآن' : 'Chat with Master Florist'}</span>
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
