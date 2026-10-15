import { useTranslation } from 'react-i18next';
import { STORE_INFO } from '../../config/constants.js';
import { Sparkles, Heart, Award, Flower2, Users, ShieldCheck } from 'lucide-react';
import './AboutPage.css';

export default function AboutPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <div className="about-page container-wide">
      {/* Hero */}
      <div className="about-hero">
        <span className="about-badge">
          <Sparkles size={14} /> {isAr ? 'قصتنا وشغفنا' : 'Our Story & Passion'}
        </span>
        <h1 className="about-title">
          {isAr ? 'الورد للورد | قصة إلهام وشغف' : 'Al-Ward Lel-Ward | An Inspiring Story'}
        </h1>
        <p className="about-tagline">
          "{isAr ? STORE_INFO.tagline_ar : STORE_INFO.tagline_en}"
        </p>
      </div>

      {/* Story Sections */}
      <div className="story-grid">
        <div className="story-card glass">
          <div className="story-icon"><Flower2 size={32} /></div>
          <h2>{isAr ? 'البداية والفلسفة' : 'The Beginning & Philosophy'}</h2>
          <p>
            {isAr
              ? 'انطلق مشروع "الورد للورد" من إيمان عميق بأن كل زهرة تحمل صوتاً ومشاعر تعجز الكلمات أحياناً عن ترجمتها. لم نرد أن نكون مجرد متجر ورود، بل صانعي ذكريات حية تلامس الوجدان.'
              : 'Al-Ward Lel-Ward began from a profound belief that every blossom carries feelings that words sometimes fail to convey. We aspire to craft lasting emotional memories.'}
          </p>
        </div>

        <div className="story-card glass">
          <div className="story-icon"><Award size={32} /></div>
          <h2>{isAr ? 'حرفية وتنسيق استثنائي' : 'Exceptional Artistry'}</h2>
          <p>
            {isAr
              ? 'ننتقي زهورنا الطبيعية يدوياً من أفضل مزارع هولندا والإكوادور. كل بتلة وكل فرع يوكالبتوس يمر عبر أيدي أمهر منسقي الزهور لدينا ليصلك عملاً فنياً يفيض بالأناقة والفخامة.'
              : 'Our blooms are handpicked from top Dutch and Ecuadorian farms. Each stem and leaf is meticulously assembled into a timeless bespoke arrangement.'}
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="values-section">
        <h2 className="values-header-title">{isAr ? 'قيمنا التي نلتزم بها' : 'Our Core Values'}</h2>
        <div className="values-grid">
          <div className="value-item glass">
            <ShieldCheck size={28} className="val-icon" />
            <h3>{isAr ? 'نضارة مضمونة 100%' : '100% Guaranteed Freshness'}</h3>
            <p>{isAr ? 'نضمن وصول الزهور في أبهى حالاتها مع التوصيل المبرد المتطور.' : 'We ensure your bouquet arrives in pristine condition with temperature control.'}</p>
          </div>
          <div className="value-item glass">
            <Heart size={28} className="val-icon" />
            <h3>{isAr ? 'اهتمام بأدق التفاصيل' : 'Attention to Every Detail'}</h3>
            <p>{isAr ? 'من تغليف الساتان وحتى بطاقات الإهداء الصوتية بالباركود التفاعلي.' : 'From hand-tied satin wraps to audio QR cards and personal dedications.'}</p>
          </div>
          <div className="value-item glass">
            <Users size={28} className="val-icon" />
            <h3>{isAr ? 'علاقة وثيقة مع عملائنا' : 'Dedicated Concierge'}</h3>
            <p>{isAr ? 'تواصل فوري واستشارة مباشرة لتخصيص البوكيه الذي يناسب مناسبتك بدقة.' : 'Direct instant consultation with our master florists via WhatsApp.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
