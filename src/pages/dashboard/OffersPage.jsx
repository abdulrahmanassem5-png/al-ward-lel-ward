import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { MOCK_PRODUCTS, CURRENCY } from '../../config/constants.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import confetti from 'canvas-confetti';
import {
  Tag,
  Plus,
  Clock,
  Trash2,
  Edit3,
  Sparkles,
  Calendar,
  Percent,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Zap,
} from 'lucide-react';
import './OffersPage.css';

// Initial default offers for high aesthetic demonstration
const DEFAULT_OFFERS = [
  {
    id: 'OFFER-1',
    productId: '1',
    productName_ar: 'طقم سيف ذا ديت الملكي مع البوكيه واللؤلؤ',
    productName_en: 'Save The Date Royal Bridal Masterpiece',
    originalPrice: 2000,
    salePrice: 1750,
    badgeText_ar: 'عرض عرسان الموسم الملكي 💍',
    badgeText_en: 'Royal Wedding Season Offer 💍',
    // Expires in 48 hours from now
    expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    isActive: true,
  },
  {
    id: 'OFFER-2',
    productId: '2',
    productName_ar: 'عروس اللؤلؤ الملكي والدانتيل الأبيض',
    productName_en: 'Royal Pearl & Lace Bridal Bouquet',
    originalPrice: 1500,
    salePrice: 1250,
    badgeText_ar: 'تخفيض ملكي محدود ✦',
    badgeText_en: 'Limited Royal Discount ✦',
    // Expires in 24 hours from now
    expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    isActive: true,
  },
];

export default function OffersPage() {
  const { i18n } = useTranslation();
  const { showSuccess, showError } = useNotification();
  const isAr = i18n.language === 'ar';
  const currencySymbol = isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en;

  const [offers, setOffers] = useState(() => {
    try {
      const saved = localStorage.getItem('al_ward_offers');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_OFFERS;
  });

  const [showModal, setShowModal] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Form State
  const [formState, setFormState] = useState({
    productId: MOCK_PRODUCTS[0]?.id || '1',
    salePrice: '',
    discountPercent: 15,
    badgeText: 'تخفيض ملكي لفترة محدودة ✦',
    durationHours: 48,
    customExpiry: '',
  });

  // Keep live timer updating every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Save offers to localStorage whenever changed
  useEffect(() => {
    try {
      localStorage.setItem('al_ward_offers', JSON.stringify(offers));
    } catch {
      // ignore
    }
  }, [offers]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showModal) {
        setShowModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal]);

  const selectedProduct = MOCK_PRODUCTS.find((p) => p.id === formState.productId) || MOCK_PRODUCTS[0];

  const handleOpenCreate = () => {
    const defaultProduct = MOCK_PRODUCTS[0];
    const originalPrice = defaultProduct.price;
    const calcSalePrice = Math.round(originalPrice * 0.85);

    setEditingOfferId(null);
    setFormState({
      productId: defaultProduct.id,
      salePrice: calcSalePrice,
      discountPercent: 15,
      badgeText: isAr ? 'تخفيض ملكي لفترة محدودة ✦' : 'Limited Royal Offer ✦',
      durationHours: 48,
      customExpiry: new Date(Date.now() + 48 * 3600 * 1000).toISOString().slice(0, 16),
    });
    setShowModal(true);
  };

  const handleOpenEdit = (offer) => {
    setEditingOfferId(offer.id);
    const original = offer.originalPrice;
    const sale = offer.salePrice;
    const pct = Math.round(((original - sale) / original) * 100);

    setFormState({
      productId: offer.productId,
      salePrice: offer.salePrice,
      discountPercent: pct,
      badgeText: isAr ? offer.badgeText_ar : offer.badgeText_en,
      durationHours: 24,
      customExpiry: new Date(offer.expiresAt).toISOString().slice(0, 16),
    });
    setShowModal(true);
  };

  const handleProductChange = (productId) => {
    const p = MOCK_PRODUCTS.find((item) => item.id === productId);
    if (!p) return;
    const original = p.price;
    const sale = Math.round(original * (1 - formState.discountPercent / 100));
    setFormState((prev) => ({
      ...prev,
      productId,
      salePrice: sale,
    }));
  };

  const handleDiscountPercentChange = (pct) => {
    const p = selectedProduct;
    const original = p ? p.price : 1000;
    const sale = Math.round(original * (1 - pct / 100));
    setFormState((prev) => ({
      ...prev,
      discountPercent: pct,
      salePrice: sale,
    }));
  };

  const handlePresetDuration = (hours) => {
    const expiry = new Date(Date.now() + hours * 3600 * 1000).toISOString().slice(0, 16);
    setFormState((prev) => ({
      ...prev,
      durationHours: hours,
      customExpiry: expiry,
    }));
  };

  const handleSaveOffer = (e) => {
    e.preventDefault();

    const product = selectedProduct;
    const sale = parseFloat(formState.salePrice);
    if (!sale || sale >= product.price) {
      showError(isAr ? 'يجب أن يكون السعر المخفض أقل من السعر الأصلي' : 'Sale price must be lower than original price');
      return;
    }

    const expiryDate = formState.customExpiry ? new Date(formState.customExpiry) : new Date(Date.now() + formState.durationHours * 3600 * 1000);
    if (expiryDate.getTime() <= Date.now()) {
      showError(isAr ? 'يرجى تحديد وقت انتهاء في المستقبل' : 'Please select an expiry date in the future');
      return;
    }

    if (editingOfferId) {
      setOffers((prev) =>
        prev.map((o) =>
          o.id === editingOfferId
            ? {
                ...o,
                productId: product.id,
                productName_ar: product.name_ar,
                productName_en: product.name_en,
                originalPrice: product.price,
                salePrice: sale,
                badgeText_ar: formState.badgeText,
                badgeText_en: formState.badgeText,
                expiresAt: expiryDate.toISOString(),
                isActive: true,
              }
            : o
        )
      );
      showSuccess(isAr ? 'تم تحديث العرض الملكي بنجاح ✦' : 'Royal deal updated successfully ✦');
    } else {
      const newOffer = {
        id: `OFFER-${Date.now().toString().slice(-4)}`,
        productId: product.id,
        productName_ar: product.name_ar,
        productName_en: product.name_en,
        originalPrice: product.price,
        salePrice: sale,
        badgeText_ar: formState.badgeText,
        badgeText_en: formState.badgeText,
        expiresAt: expiryDate.toISOString(),
        isActive: true,
      };
      setOffers([newOffer, ...offers]);
      showSuccess(isAr ? 'تم تفعيل العرض الملكي وإطلاقه في المتجر! 🌹✨' : 'Royal offer activated and launched! 🌹✨');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4A853', '#E8C87A', '#34D399', '#FFFFFF'],
      });
    }

    setShowModal(false);
  };

  const handleToggleOffer = (id) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === id ? { ...o, isActive: !o.isActive } : o))
    );
    showSuccess(isAr ? 'تم تعديل حالة تشغيل العرض' : 'Offer status updated');
  };

  const handleDeleteOffer = (id) => {
    setOffers((prev) => prev.filter((o) => o.id !== id));
    showSuccess(isAr ? 'تم حذف العرض بنجاح' : 'Offer deleted successfully');
  };

  // Helper to format remaining countdown
  const getRemainingTime = (expiresAt) => {
    const diff = new Date(expiresAt).getTime() - currentTime;
    if (diff <= 0) return { expired: true, text: isAr ? 'انتهى العرض' : 'Expired' };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n) => String(n).padStart(2, '0');
    return {
      expired: false,
      text: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
      hours,
      minutes,
      seconds,
    };
  };

  const activeOffersCount = offers.filter((o) => o.isActive && new Date(o.expiresAt).getTime() > currentTime).length;

  return (
    <div className="offers-mgmt-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Tag size={26} className="title-icon-gold" />
            <span>{isAr ? 'العروض الملكية والمؤقت التنازلي' : 'Royal Deals & Flash Countdown'}</span>
          </h1>
          <p className="page-desc">
            {isAr
              ? 'إنشاء حملات تخفيض مخصصة على البوكيهات مع عدّاد زمني حي يظهر في المتجر لتحفيز الاقتناء الفوري'
              : 'Launch bespoke promotional prices with live countdown timers in the storefront'}
          </p>
        </div>
        <button onClick={handleOpenCreate} className="btn-royal-gold">
          <Plus size={18} />
          <span>{isAr ? 'إنشاء عرض ملكي جديد' : 'New Royal Offer'}</span>
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="offers-stats-grid">
        <div className="offer-stat-card glass">
          <span className="stat-label">{isAr ? 'العروض النشطة حالياً' : 'Active Live Deals'}</span>
          <div className="stat-value-row">
            <span className="stat-number">{activeOffersCount}</span>
            <span className="stat-badge live">
              <span className="pulse-dot-green" />
              <span>{isAr ? 'نشط في المتجر' : 'Live on Storefront'}</span>
            </span>
          </div>
        </div>

        <div className="offer-stat-card glass">
          <span className="stat-label">{isAr ? 'إجمالي الحملات' : 'Total Campaigns'}</span>
          <div className="stat-value-row">
            <span className="stat-number">{offers.length}</span>
            <span className="stat-sub">{isAr ? 'عروض مسجلة' : 'Registered'}</span>
          </div>
        </div>

        <div className="offer-stat-card glass">
          <span className="stat-label">{isAr ? 'أعلى نسبة خصم نشطة' : 'Top Active Discount'}</span>
          <div className="stat-value-row">
            <span className="stat-number">
              {offers.length > 0
                ? `${Math.max(...offers.map((o) => Math.round(((o.originalPrice - o.salePrice) / o.originalPrice) * 100)))}%`
                : '0%'}
            </span>
            <span className="stat-sub text-gold">✦ {isAr ? 'توفير مباشر' : 'Direct Savings'}</span>
          </div>
        </div>
      </div>

      {/* Offers Cards Grid */}
      <div className="offers-cards-grid">
        {offers.length === 0 ? (
          <div className="no-offers-card glass text-center">
            <Clock size={40} className="empty-icon" />
            <h3>{isAr ? 'لا توجد عروض نشطة حالياً' : 'No active offers'}</h3>
            <p>{isAr ? 'اضغط على زر «إنشاء عرض ملكي جديد» لاختيار بوكيه وتحديد الخصم والتايمر' : 'Create a new offer to start a flash deal'}</p>
          </div>
        ) : (
          offers.map((offer) => {
            const product = MOCK_PRODUCTS.find((p) => p.id === offer.productId);
            const img = product?.images?.[0] || '/images/bouquet-save-the-date.jpg';
            const countdown = getRemainingTime(offer.expiresAt);
            const discountPct = Math.round(((offer.originalPrice - offer.salePrice) / offer.originalPrice) * 100);
            const isLive = offer.isActive && !countdown.expired;

            return (
              <div key={offer.id} className={`offer-item-card glass-royal-card ${isLive ? 'is-live' : 'is-inactive'}`}>
                {/* Header ribbon */}
                <div className="offer-card-topbar">
                  <span className={`offer-status-badge ${isLive ? 'badge-active' : 'badge-paused'}`}>
                    {isLive ? <CheckCircle2 size={13} /> : <AlertCircle size={13} />}
                    <span>{isLive ? (isAr ? 'نشط في المتجر' : 'Live') : (isAr ? 'متوقف / منتهي' : 'Inactive')}</span>
                  </span>
                  <span className="offer-discount-pill">-{discountPct}%</span>
                </div>

                <div className="offer-body-layout">
                  <div className="offer-thumb-wrap">
                    <img src={img} alt={offer.productName_ar} className="offer-thumb" />
                    {isLive && (
                      <span className="offer-live-pill countdown-pill-badge">
                        <Clock size={12} />
                        <span>{countdown.text}</span>
                      </span>
                    )}
                  </div>

                  <div className="offer-info-col">
                    <span className="offer-promo-badge">{isAr ? offer.badgeText_ar : offer.badgeText_en}</span>
                    <h3 className="offer-product-name">{isAr ? offer.productName_ar : offer.productName_en}</h3>

                    <div className="offer-pricing-row">
                      <span className="offer-sale-price">
                        {offer.salePrice} <small>{currencySymbol}</small>
                      </span>
                      <span className="offer-original-price">
                        {offer.originalPrice} {currencySymbol}
                      </span>
                      <span className="offer-savings-text">
                        {isAr ? `(توفير ${offer.originalPrice - offer.salePrice} ${currencySymbol})` : `(Save ${offer.originalPrice - offer.salePrice} ${currencySymbol})`}
                      </span>
                    </div>

                    <div className="offer-expiry-row">
                      <Calendar size={14} className="cal-icon" />
                      <span>{isAr ? 'ينتهي في:' : 'Expires:'}</span>
                      <strong>{new Date(offer.expiresAt).toLocaleString(isAr ? 'ar-EG' : 'en-US')}</strong>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="offer-card-footer">
                  <button
                    onClick={() => handleToggleOffer(offer.id)}
                    className={`btn-offer-action toggle ${offer.isActive ? 'btn-pause' : 'btn-resume'}`}
                    title={offer.isActive ? (isAr ? 'إيقاف مؤقت' : 'Pause') : (isAr ? 'تفعيل العرض' : 'Activate')}
                  >
                    {offer.isActive ? (isAr ? 'إيقاف مؤقت' : 'Pause') : (isAr ? 'تنشيط العرض' : 'Activate')}
                  </button>

                  <div className="offer-secondary-actions">
                    <button
                      onClick={() => handleOpenEdit(offer)}
                      className="btn-offer-icon edit"
                      title={isAr ? 'تعديل العرض' : 'Edit Deal'}
                    >
                      <Edit3 size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="btn-offer-icon delete"
                      title={isAr ? 'حذف العرض' : 'Delete Deal'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Fortified Royal Modal for Creating/Editing Offers */}
      {showModal && (
        <div className="royal-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="royal-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="royal-modal-header">
              <h2 className="royal-modal-title">
                <Sparkles size={20} color="#D4A853" />
                <span>{editingOfferId ? (isAr ? 'تعديل العرض الملكي' : 'Edit Royal Offer') : (isAr ? 'إنشاء وتفعيل عرض ملكي جديد' : 'New Royal Offer')}</span>
              </h2>
              <button onClick={() => setShowModal(false)} className="royal-modal-close" aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveOffer} className="royal-modal-form">
              {/* Product Selection */}
              <div className="royal-form-group">
                <label className="royal-label">{isAr ? 'اختر البوكيه المراد تطبيق العرض عليه:' : 'Select Bouquet:'}</label>
                <div className="royal-input-wrap">
                  <select
                    className="royal-select"
                    value={formState.productId}
                    onChange={(e) => handleProductChange(e.target.value)}
                  >
                    {MOCK_PRODUCTS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {isAr ? p.name_ar : p.name_en} ({p.price} {currencySymbol})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Selected Bouquet Preview Banner */}
              {selectedProduct && (
                <div className="modal-product-snapshot glass">
                  <img
                    src={selectedProduct.images?.[0] || '/images/bouquet-save-the-date.jpg'}
                    alt="Bouquet snapshot"
                    className="modal-snapshot-img"
                  />
                  <div className="modal-snapshot-info">
                    <strong>{isAr ? selectedProduct.name_ar : selectedProduct.name_en}</strong>
                    <span className="snapshot-orig-price">
                      {isAr ? 'السعر الأصلي المعروض:' : 'Original Price:'} {selectedProduct.price} {currencySymbol}
                    </span>
                  </div>
                </div>
              )}

              {/* Pricing Controls: Quick Discount Chips & Exact Sale Price */}
              <div className="royal-form-group">
                <label className="royal-label">{isAr ? 'نسبة الخصم السريعة:' : 'Quick Discount %:'}</label>
                <div className="discount-chips-row">
                  {[10, 15, 20, 25, 30].map((pct) => (
                    <button
                      type="button"
                      key={pct}
                      onClick={() => handleDiscountPercentChange(pct)}
                      className={`discount-chip-btn ${formState.discountPercent === pct ? 'active' : ''}`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="royal-form-group">
                <label className="royal-label">{isAr ? 'السعر المخفض النهائي (ج.م) *' : 'Final Sale Price *'}</label>
                <div className="royal-input-wrap">
                  <input
                    type="number"
                    required
                    className="royal-input"
                    value={formState.salePrice}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      const orig = selectedProduct ? selectedProduct.price : 1000;
                      const pct = Math.max(0, Math.round(((orig - val) / orig) * 100));
                      setFormState((prev) => ({
                        ...prev,
                        salePrice: e.target.value,
                        discountPercent: pct,
                      }));
                    }}
                  />
                </div>
                <small className="field-hint text-gold">
                  {selectedProduct && formState.salePrice && (
                    <span>
                      {isAr
                        ? `العميل سيوفر ${selectedProduct.price - parseFloat(formState.salePrice)} ${currencySymbol} (خصم ${formState.discountPercent}%)`
                        : `Customer saves ${selectedProduct.price - parseFloat(formState.salePrice)} ${currencySymbol} (${formState.discountPercent}% off)`}
                    </span>
                  )}
                </small>
              </div>

              {/* Offer Expiration Presets & Date/Time */}
              <div className="royal-form-group">
                <label className="royal-label">{isAr ? 'مدة صلاحية العرض (المؤقت التنازلي):' : 'Offer Duration (Countdown):'}</label>
                <div className="duration-presets-row">
                  {[
                    { hours: 24, label_ar: '24 ساعة', label_en: '24 Hours' },
                    { hours: 48, label_ar: '48 ساعة (يومان)', label_en: '48 Hours' },
                    { hours: 72, label_ar: '3 أيام', label_en: '3 Days' },
                    { hours: 168, label_ar: 'أسبوع كامل', label_en: '1 Week' },
                  ].map((preset) => (
                    <button
                      type="button"
                      key={preset.hours}
                      onClick={() => handlePresetDuration(preset.hours)}
                      className={`duration-preset-btn ${formState.durationHours === preset.hours ? 'active' : ''}`}
                    >
                      <Clock size={13} />
                      <span>{isAr ? preset.label_ar : preset.label_en}</span>
                    </button>
                  ))}
                </div>

                <div className="royal-input-wrap" style={{ marginTop: '8px' }}>
                  <input
                    type="datetime-local"
                    required
                    className="royal-input"
                    value={formState.customExpiry}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        customExpiry: e.target.value,
                        durationHours: 0,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Promotional Ribbon Text */}
              <div className="royal-form-group">
                <label className="royal-label">{isAr ? 'وسم العرض الترويجي (يظهر على صورة الباقة):' : 'Promotional Badge Text:'}</label>
                <div className="royal-input-wrap">
                  <input
                    type="text"
                    required
                    className="royal-input"
                    placeholder={isAr ? 'مثال: عرض عرسان الموسم 💍' : 'e.g. Royal Wedding Season Deal 💍'}
                    value={formState.badgeText}
                    onChange={(e) => setFormState((prev) => ({ ...prev, badgeText: e.target.value }))}
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="royal-modal-actions">
                <button type="button" onClick={() => setShowModal(false)} className="btn-royal-outline">
                  <span>{isAr ? 'إلغاء' : 'Cancel'}</span>
                </button>
                <button type="submit" className="btn-royal-gold">
                  <Zap size={16} />
                  <span>{editingOfferId ? (isAr ? 'حفظ تعديلات العرض' : 'Save Changes') : (isAr ? 'إطلاق العرض في المتجر 🚀' : 'Launch Offer 🚀')}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
