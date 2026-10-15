import { useTranslation } from 'react-i18next';
import { CURRENCY, MOCK_PRODUCTS } from '../../config/constants.js';
import { TrendingUp, Award, ArrowUpRight } from 'lucide-react';
import './AnalyticsPage.css';

export default function AnalyticsPage() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const currencySymbol = isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en;

  const categoryPerformance = [
    { name_ar: 'أعراس ومناسبات ملكية', name_en: 'Weddings & Royal', percent: 45, count: 54, color: '#D4A853' },
    { name_ar: 'تخرج واحتفالات سنوية', name_en: 'Graduation & Celebrations', percent: 30, count: 36, color: '#C4546D' },
    { name_ar: 'حب وتقدير خاص', name_en: 'Love & Appreciation', percent: 15, count: 18, color: '#34D399' },
    { name_ar: 'أساور وهدايا مميزة', name_en: 'Corsages & Gifts', percent: 10, count: 12, color: '#60A5FA' },
  ];

  const topBouquets = [...MOCK_PRODUCTS].sort((a, b) => (b.reviews_count || 0) - (a.reviews_count || 0)).slice(0, 4);

  return (
    <div className="analytics-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isAr ? 'التحليلات والمبيعات' : 'Sales & Performance Analytics'}</h1>
          <p className="page-desc">{isAr ? 'مؤشرات الأداء الرئيسية وتفضيلات العملاء للبوكيهات' : 'Key metrics, bouquet popularity & customer trends'}</p>
        </div>
      </div>

      {/* KPI Row */}
      <div className="analytics-kpi-grid">
        <div className="kpi-card glass">
          <span className="kpi-title">{isAr ? 'إجمالي المبيعات الشهرية' : 'Monthly Sales'}</span>
          <div className="kpi-number">
            128,450 <small>{currencySymbol}</small>
          </div>
          <span className="kpi-trend positive">
            <ArrowUpRight size={14} /> +24.8% {isAr ? 'مقارنة بالشهر السابق' : 'vs last month'}
          </span>
        </div>

        <div className="kpi-card glass">
          <span className="kpi-title">{isAr ? 'متوسط قيمة الطلب (AOV)' : 'Average Order Value'}</span>
          <div className="kpi-number">
            1,380 <small>{currencySymbol}</small>
          </div>
          <span className="kpi-trend positive">
            <ArrowUpRight size={14} /> +12.5% {isAr ? 'زيادة في أطقم الأعراس الفاخرة' : 'increase in luxury sets'}
          </span>
        </div>

        <div className="kpi-card glass">
          <span className="kpi-title">{isAr ? 'معدل رضا العملاء' : 'Customer Satisfaction'}</span>
          <div className="kpi-number">99.4%</div>
          <span className="kpi-trend positive">
            <Award size={14} /> 4.9/5 {isAr ? 'تقييم عام' : 'overall rating'}
          </span>
        </div>

        <div className="kpi-card glass">
          <span className="kpi-title">{isAr ? 'طلبات عبر واتساب المباشر' : 'WhatsApp Direct Conversion'}</span>
          <div className="kpi-number">76%</div>
          <span className="kpi-subtitle">
            {isAr ? 'تأكيد مباشر واستشارات سريعة' : 'Direct confirmation rate'}
          </span>
        </div>
      </div>

      {/* Charts Layout */}
      <div className="analytics-charts-grid">
        {/* Category Breakdown */}
        <div className="analytics-card glass">
          <h3 className="card-title">{isAr ? 'توزيع المبيعات حسب فئات البوكيهات' : 'Sales Distribution by Category'}</h3>
          <div className="category-bars">
            {categoryPerformance.map((cat, idx) => (
              <div key={idx} className="category-bar-item">
                <div className="cat-bar-header">
                  <span className="cat-bar-name">{isAr ? cat.name_ar : cat.name_en}</span>
                  <span className="cat-bar-val">{cat.percent}% ({cat.count} {isAr ? 'بوكيه' : 'sold'})</span>
                </div>
                <div className="cat-progress-bg">
                  <div
                    className="cat-progress-fill"
                    style={{ width: `${cat.percent}%`, backgroundColor: cat.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Bouquets Leaderboard */}
        <div className="analytics-card glass">
          <h3 className="card-title">{isAr ? 'البوكيهات الأكثر طلباً' : 'Best Selling Bouquets'}</h3>
          <div className="top-bouquets-list">
            {topBouquets.map((b, idx) => (
              <div key={b.id} className="top-bouquet-item">
                <div className="rank-badge">#{idx + 1}</div>
                <div className="b-img-wrap">
                  <img src={b.images?.[0] || '/images/bouquet-save-the-date.jpg'} alt="" />
                </div>
                <div className="b-info">
                  <h4>{isAr ? b.name_ar : b.name_en}</h4>
                  <span>★ {b.rating} ({b.reviews_count} {isAr ? 'طلب موثق' : 'orders'})</span>
                </div>
                <span className="b-price">
                  {b.sale_price || b.price} {currencySymbol}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
