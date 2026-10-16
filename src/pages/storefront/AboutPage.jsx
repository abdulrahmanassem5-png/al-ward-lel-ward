import { useTranslation } from 'react-i18next';
import SEO from '../../components/SEO.tsx';
import {
  Sparkles,
  Flower2,
  Crown,
  ShieldCheck,
  Heart,
  Users,
  Truck,
  Compass,
  Gem,
} from 'lucide-react';
import './AboutPage.css';

export default function AboutPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const storyCards = [
    {
      num: '01',
      numLabel_ar: 'الرؤية',
      numLabel_en: 'Vision',
      icon: Flower2,
      image: '/images/about-vision.jpg',
      title_ar: 'الرؤية وفلسفة الصياغة',
      title_en: 'The Vision & Philosophy',
      desc_ar:
        'انطلقت دار "الورد للورد" من إيمان راسخ بأن الزهور ليست مجرد نباتات عابرة، بل هي لغة المشاعر الأرقى وعهد المودة الأبقى. لا نبيع مجرد باقات، بل نصوغ تحفاً نباتية حية تخلد أثمن المشاعر الإنسانية وتليق بأرفع المقامات.',
      desc_en:
        'Al-Ward Lel-Ward began from a profound conviction that blooms are not mere ephemeral plants, but the highest articulation of emotion and enduring devotion. We do not sell simple bouquets; we sculpt living botanical masterpieces that celebrate life’s most precious bonds.',
      tags_ar: ['تحف نباتية حية', 'خلود المشاعر', 'مقام مَلكي'],
      tags_en: ['Living Botanical Art', 'Eternal Emotions', 'Royal Stature'],
    },
    {
      num: '02',
      numLabel_ar: 'الحرفية',
      numLabel_en: 'Craftsmanship',
      icon: Crown,
      image: '/images/about-craft.jpg',
      title_ar: 'صياغة ملكية وحرفية عالمية',
      title_en: 'Haute Floristry Artistry',
      desc_ar:
        'ننتقي زهورنا الطبيعية يدوياً من أعالي جبال كيتو بالإكوادور وبساتين أمستردام بهولندا. كل بتلة وكل لمسة لؤلؤ وتول فرنسي وحرير هولندي تمر عبر أنامل أمهر فناني التنسيق لتصلكم تحفة تفيض هيبة وأناقة.',
      desc_en:
        'We hand-select our natural blooms from the high volcanic soils of Quito, Ecuador and historic estates in Amsterdam. Every petal, pearl trim, French tulle, and Dutch silk ribbon is sculpted by master florists to reach you as a breathtaking regal statement.',
      tags_ar: ['ورد إكوادوري نادر', 'لؤلؤ وتول فرنسي', 'حرير هولندي'],
      tags_en: ['Rare Ecuadorian Roses', 'French Tulle & Pearls', 'Dutch Silk Ribbon'],
    },
  ];

  const royalPillars = [
    {
      icon: Sparkles,
      value_ar: '100% قطف صباحي طازج',
      value_en: '100% Morning Harvest',
      sub_ar: 'نضارة لا تضاهى',
      sub_en: 'Pristine Living Blooms',
    },
    {
      icon: Compass,
      value_ar: 'مزارع كيتو وأمستردام',
      value_en: 'Quito & Amsterdam',
      sub_ar: 'أندر السلالات العالمية',
      sub_en: 'World-Renowned Estates',
    },
    {
      icon: Gem,
      value_ar: 'صياغة يدوية بالطلب',
      value_en: 'Bespoke Atelier Craft',
      sub_ar: 'تفصيل لكل مناسبة',
      sub_en: 'Tailored to Each Moment',
    },
    {
      icon: Truck,
      value_ar: 'توصيل ملكي خاص',
      value_en: 'Royal Concierge Fleet',
      sub_ar: 'موكب مكيّف ومبرّد',
      sub_en: 'Chilled Express Delivery',
    },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title_ar: 'موكب مبرّد ونضارة 100%',
      title_en: '100% Chilled Freshness',
      desc_ar: 'موكب توصيل مبرّد يحفظ نضارة كل بتلة كأنها قُطفت في ذات لحظة الإهداء.',
      desc_en: 'Temperature-controlled bespoke transport ensuring every petal arrives in dewdrop perfection.',
    },
    {
      icon: Heart,
      title_ar: 'عناية فائقة بأدق التفاصيل',
      title_en: 'Meticulous Attention',
      desc_ar: 'تغليف حريري فاخر، بطاقات إهداء مذهبة تُخط بمداد أنيق، وباركود صوتي ومرئي تفاعلي.',
      desc_en: 'From hand-tied satin wraps to audio QR cards and personal golden calligraphed dedications.',
    },
    {
      icon: Users,
      title_ar: 'خدمة الكونسيرج الملكية',
      title_en: 'Royal Concierge Service',
      desc_ar: 'مستشار تنسيق شخصي متاح لمرافقة ذوقكم الرفيع وصياغة بوكيه استثنائي لمناسباتكم الكبرى.',
      desc_en: 'Dedicated bespoke floral stylist guiding your gifting etiquette for momentous celebrations.',
    },
  ];

  return (
    <div className="about-editorial-page container-wide">
      <SEO
        title={isAr ? 'فلسفتنا وإرثُ الأناقة' : 'Our Philosophy & Heritage'}
        description={
          isAr
            ? 'تعرف على قصة دار الورد للورد، فلسفة صياغة التحف النباتية النادرة، وميثاق الجودة الملكية لقطف وتنسيق أجود زهور العالم.'
            : 'Discover the heritage of Al-Ward Lel-Ward, our fine floristry philosophy, and bespoke botanical curation.'
        }
        canonicalUrl="https://el-ward-ll-ward-store.vercel.app/about"
      />
      {/* 1. Editorial Header */}
      <section className="about-editorial-hero">
        <div className="about-hero-badge-capsule">
          <Sparkles size={13} className="about-hero-badge-icon" />
          <span>{isAr ? '✦ إرثُ الأناقة وفلسفةُ الإهداء ✦' : '✦ The Heritage of Elegance & Gifting Philosophy ✦'}</span>
        </div>

        <h1 className="about-hero-title">
          {isAr
            ? 'دار الورد للورد | صياغة الزهور والمشاعر الملكية'
            : 'Al-Ward Lel-Ward | Haute Floristry Atelier'}
        </h1>

        <p className="about-hero-quote font-poetic">
          {isAr
            ? '«لا نَقطفُ الزَّهرَ لنَبيعَه.. بل نَستنطِقُ البَتلاتِ لتُخلِّدَ ما يَعجزُ عنهُ البَيان»'
            : '«We do not pick flowers to sell them; we sculpt petals to immortalize what words cannot convey»'}
        </p>

        {/* Vertical Gold Gradient Divider */}
        <div className="about-hero-divider" aria-hidden="true" />
      </section>

      {/* 2. Editorial Visual Story Cards */}
      <section className="about-story-section">
        <div className="story-editorial-grid">
          {storyCards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <article key={idx} className="story-editorial-card group">
                {/* Top Half: Cinematic Image */}
                <div className="story-card-image-box">
                  <img
                    src={card.image}
                    alt={isAr ? card.title_ar : card.title_en}
                    className="story-card-image"
                    loading="lazy"
                  />
                  <div className="story-card-image-overlay" />

                  {/* Floating Number Badge in Corner */}
                  <div className="story-card-number-badge">
                    <span className="num-digits">{card.num}</span>
                    <span className="num-sep">/</span>
                    <span className="num-label">{isAr ? card.numLabel_ar : card.numLabel_en}</span>
                  </div>

                  {/* Floating Glass Icon Badge at Seam */}
                  <div className="story-card-seam-badge">
                    <IconComponent size={22} strokeWidth={1.3} color="#D4AF37" />
                  </div>
                </div>

                {/* Bottom Half: Editorial Content */}
                <div className="story-card-content">
                  <h2 className="story-card-title">
                    {isAr ? card.title_ar : card.title_en}
                  </h2>
                  <p className="story-card-desc">
                    {isAr ? card.desc_ar : card.desc_en}
                  </p>

                  {/* 3 Pillar Tags */}
                  <div className="story-card-tags">
                    {(isAr ? card.tags_ar : card.tags_en).map((tag, tIdx) => (
                      <span key={tIdx} className="story-pill-tag">
                        <span className="pill-dot">✦</span>
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 3. Royal Pillars Strip */}
      <section className="royal-pillars-strip-section">
        <div className="royal-pillars-strip">
          {royalPillars.map((p, idx) => {
            const PIcon = p.icon;
            return (
              <div key={idx} className="pillar-item">
                <div className="pillar-icon-box">
                  <PIcon size={20} strokeWidth={1.4} color="#D4AF37" />
                </div>
                <h3 className="pillar-value">{isAr ? p.value_ar : p.value_en}</h3>
                <span className="pillar-sub">{isAr ? p.sub_ar : p.sub_en}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Royal Pledges (Values) */}
      <section className="about-values-section">
        <div className="section-header text-center">
          <span className="section-subtitle">
            <Sparkles size={14} />
            {isAr ? 'ميثاق الثقة الملكية' : 'The Royal Charter'}
          </span>
          <h2 className="section-title">
            {isAr ? 'العهود الملكية التي نلتزم بها' : 'Our Royal Pledges'}
          </h2>
        </div>

        <div className="about-values-grid">
          {values.map((val, idx) => {
            const VIcon = val.icon;
            return (
              <div key={idx} className="about-value-card">
                <div className="value-card-icon-box">
                  <VIcon size={24} strokeWidth={1.3} color="#D4AF37" />
                </div>
                <h3 className="value-card-title">{isAr ? val.title_ar : val.title_en}</h3>
                <p className="value-card-desc">{isAr ? val.desc_ar : val.desc_en}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

