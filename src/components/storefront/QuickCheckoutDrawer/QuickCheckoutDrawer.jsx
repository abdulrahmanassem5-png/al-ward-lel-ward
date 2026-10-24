import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CURRENCY } from '../../../config/constants.js';
import { useNotification } from '../../../context/NotificationContext.jsx';
import { deductMaterialsForOrder } from '../../../utils/recipeInventoryManager.js';
import {
  getStoreSettings,
  isValidEgyptianPhone,
  formatPhoneForWhatsApp,
} from '../../../utils/storeSettingsManager.js';
import confetti from 'canvas-confetti';
import {
  X,
  Sparkles,
  MessageCircle,
  MapPin,
  User,
  Phone,
  Gift,
  ShieldCheck,
  Check,
  Truck,
} from 'lucide-react';
import './QuickCheckoutDrawer.css';

export default function QuickCheckoutDrawer({ product, isOpen, onClose }) {
  const { i18n } = useTranslation();
  const { showSuccess, showError } = useNotification();
  const isAr = i18n.language === 'ar';
  const currencySymbol = isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en;

  const storeSettings = getStoreSettings();
  const vipThreshold = Number(storeSettings.vipChilledDeliveryThreshold) || 1500;

  const [selectedSize, setSelectedSize] = useState('medium');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    district: 'القاهرة - التجمع الخامس',
    isGift: false,
    recipientName: '',
    recipientPhone: '',
    giftNote: '',
    deliveryTime: 'evening',
  });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const name = isAr ? product.name_ar : product.name_en;
  const image = product.images?.[0] || '/images/bouquet-save-the-date.jpg';

  const sizePriceAdjustment =
    selectedSize === 'small' ? -50 : selectedSize === 'large' ? 100 : 0;
  const basePrice = product.price || 1200;
  const finalPrice = Math.max(100, basePrice + sizePriceAdjustment);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      showError(isAr ? 'يرجى كتابة الاسم ورقم الهاتف للتواصل' : 'Please enter your name and phone number');
      return;
    }

    if (!isValidEgyptianPhone(formData.phone)) {
      showError(
        isAr
          ? 'يرجى إدخال رقم هاتف مصري صحيح (مثال: 01012345678)'
          : 'Please enter a valid Egyptian mobile number (e.g. 01012345678)'
      );
      return;
    }

    if (formData.isGift) {
      if (!formData.recipientName.trim()) {
        showError(isAr ? 'يرجى كتابة اسم مستلم الهدية' : 'Please provide recipient name');
        return;
      }
      if (formData.recipientPhone.trim() && !isValidEgyptianPhone(formData.recipientPhone)) {
        showError(
          isAr
            ? 'يرجى إدخال رقم هاتف مصري صحيح لمستلم الهدية (مثال: 01012345678)'
            : 'Please enter a valid Egyptian mobile number for the recipient'
        );
        return;
      }
    }

    const orderId = `ORD-QK-${Math.floor(100000 + Math.random() * 900000)}`;

    // Save order in localStorage so it dynamically shows in Admin Dashboard!
    const newOrderRecord = {
      id: orderId,
      customer_name: formData.name.trim(),
      customer_phone: formData.phone.trim(),
      city: formData.district,
      district: formData.district,
      total_price: finalPrice,
      status: 'new',
      source: 'quick_checkout_drawer',
      items: [
        {
          id: product.id,
          name: name,
          quantity: 1,
          price: finalPrice,
          size: selectedSize,
        },
      ],
      created_at: new Date().toISOString(),
      is_gift: formData.isGift || !!formData.giftNote.trim(),
      recipient_name: formData.recipientName.trim() || (formData.giftNote.trim() ? (isAr ? 'مستلم الهدية' : 'Gift Recipient') : ''),
      recipient_phone: formData.recipientPhone.trim(),
      payment_method: 'طلب سريع عبر واتساب (Quick WhatsApp)',
      is_inventory_deducted: false,
    };

    try {
      deductMaterialsForOrder(newOrderRecord);
    } catch (e) {
      console.error('Error auto-deducting raw materials in QuickCheckout:', e);
    }

    try {
      const existing = JSON.parse(localStorage.getItem('al_ward_orders') || '[]');
      existing.unshift(newOrderRecord);
      localStorage.setItem('al_ward_orders', JSON.stringify(existing));
      window.dispatchEvent(new CustomEvent('al_ward_orders_updated', { detail: { order: newOrderRecord } }));
    } catch (err) {
      console.error('Error storing quick checkout order:', err);
    }

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#D4A853', '#E8C87A', '#34D399', '#FFFFFF'],
      });
    } catch {
      // ignore
    }

    // Prepare WhatsApp Message
    const sizeName =
      selectedSize === 'small'
        ? (isAr ? 'الباقة الناعمة (Petite Charm) — لمسة رقيقة وأنيقة' : 'Petite Charm — Subtle Elegance')
        : selectedSize === 'large'
        ? (isAr ? 'الباقة الملكية الفاخرة (Royal VIP Grandeur) — ضعف كثافة الورد وحضور استثنائي' : 'Royal VIP Grandeur — Double Density & Grand Presence')
        : (isAr ? 'الباقة الكلاسيكية (Signature Collection) — الحجم الأصلي المتوازن' : 'Signature Collection — Balanced Signature Classic');

    const deliveryTimeName =
      formData.deliveryTime === 'morning'
        ? (isAr ? 'موكب صباحي (10ص - 2ظ)' : 'Morning (10AM - 2PM)')
        : formData.deliveryTime === 'rush'
        ? (isAr ? 'موكب فوري عاجل (خلال 3 ساعات)' : 'Rush (Within 3 Hours)')
        : (isAr ? 'موكب مسائي (4ع - 9م)' : 'Evening (4PM - 9PM)');

    const text = isAr
      ? `تحية طيبة تعبق بشذا الورد والريحان، دار «الورد للورد» الملكية 🌹✨\n` +
        `يشرفني اعتماد طلب إهداء وصياغة تحفة زهور خاصة عبر المتجر:\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `👑 تفاصيل الإهداء الملكي:\n` +
        `• رقم المرجع المعتمد: ${orderId}\n` +
        `• التحفة النباتية: ${product.name_ar}\n` +
        `• مقاس الباقة ومستوى الكثافة: ${sizeName}\n` +
        `• القيمة الإجمالية الفاخرة: ${finalPrice} ${currencySymbol}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 بيانات صاحب الإهداء الكريم:\n` +
        `• الاسم: ${formData.name}\n` +
        `• رقم الهاتف: ${formData.phone}\n` +
        `• وجهة موكب التوصيل: ${formData.district}\n` +
        `• موعد التسليم المفضل: ${deliveryTimeName}\n` +
        (formData.isGift && formData.recipientName ? `• إهداء خاص للمستلم: ${formData.recipientName} (${formData.recipientPhone || 'بدون هاتف'})\n` : '') +
        (formData.giftNote.trim() ? `• بطاقة الإهداء الملكية: «${formData.giftNote.trim()}»\n` : '') +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `أرجو التكرم من مستشار التنسيق الملكي بتأكيد بدء قطف الزهور وتجهيز الموكب، مع فائق الامتنان والتقدير لمقامكم الرفيع.`
      : `Greetings with the essence of fresh blooms, Al-Ward Lel-Ward Royal Atelier 🌹✨\n` +
        `I would like to confirm a royal floral dedication:\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `👑 Royal Dedication Details:\n` +
        `• Reference ID: ${orderId}\n` +
        `• Masterpiece: ${product.name_en}\n` +
        `• Size & Density: ${sizeName}\n` +
        `• Total Value: ${finalPrice} ${currencySymbol}\n` +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `👤 Client Information:\n` +
        `• Name: ${formData.name}\n` +
        `• Phone: ${formData.phone}\n` +
        `• Delivery Destination: ${formData.district}\n` +
        `• Preferred Delivery Window: ${deliveryTimeName}\n` +
        (formData.isGift && formData.recipientName ? `• Surprise Gift to: ${formData.recipientName} (${formData.recipientPhone || 'N/A'})\n` : '') +
        (formData.giftNote.trim() ? `• Dedication Note: «${formData.giftNote.trim()}»\n` : '') +
        `━━━━━━━━━━━━━━━━━━━━━━━━━\n` +
        `Kindly have the master florist confirm preparation. Thank you for your distinguished service.`;

    const targetPhone = formatPhoneForWhatsApp(storeSettings.whatsapp);
    window.open(`https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`, '_blank');

    showSuccess(isAr ? 'تم إرسال تفاصيل طلبك الملكي لمستشار الزهور عبر واتساب! 🌹' : 'Order sent to florist on WhatsApp! 🌹');
    onClose();
  };

  return (
    <div className="quick-drawer-overlay" onClick={onClose}>
      <div
        className="quick-drawer-panel glass animate-slide-left"
        onClick={(e) => e.stopPropagation()}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        <div className="quick-drawer-header">
          <div className="header-info">
            <span className="quick-tag">
              <Sparkles size={14} /> {isAr ? 'خدمة الكونسيرج الملكية' : 'Royal Concierge Service'}
            </span>
            <h2 className="drawer-title">{isAr ? 'تأكيد الإهداء مع مستشار التنسيق' : 'Royal Concierge Order'}</h2>
          </div>
          <button onClick={onClose} className="btn-close-drawer" title={isAr ? 'إغلاق' : 'Close'}>
            <X size={20} />
          </button>
        </div>

        {/* Selected Bouquet Snapshot */}
        <div className="drawer-bouquet-card">
          <div className="drawer-img-wrap">
            <img src={image} alt={name} />
          </div>
          <div className="drawer-bouquet-details">
            <h3 className="drawer-bouquet-name">{name}</h3>
            <div className="drawer-price-row">
              <span className="drawer-final-price">
                {finalPrice} <small>{currencySymbol}</small>
              </span>
              <span className="drawer-badge-express">
                {isAr ? 'موكب مبرّد يحفظ النضارة' : 'Climate-Controlled Delivery'}
              </span>
            </div>
          </div>
        </div>

        {/* VIP Free Chilled Delivery Progress Bar */}
        <div className="drawer-free-shipping-bar glass">
          <div className="free-shipping-text-row">
            <span className="free-shipping-label">
              <Truck size={15} className="truck-gold-icon" />
              <span>
                {finalPrice >= vipThreshold
                  ? (isAr ? 'تهانينا! هديتك مؤهلة لموكب التوصيل المبرّد VIP مجاناً 🚚✨' : 'Eligible for Complimentary VIP Chilled Delivery! 🚚✨')
                  : (isAr ? `متبقي ${vipThreshold - finalPrice} ${currencySymbol} للتأهل لموكب التوصيل المبرّد المجاني` : `Add ${vipThreshold - finalPrice} ${currencySymbol} for Free VIP Delivery`)}
              </span>
            </span>
            <span className="free-shipping-pct">{Math.min(100, Math.round((finalPrice / vipThreshold) * 100))}%</span>
          </div>
          <div className="free-shipping-track">
            <div
              className="free-shipping-fill"
              style={{ width: `${Math.min(100, Math.round((finalPrice / vipThreshold) * 100))}%` }}
            />
          </div>
        </div>

        {/* Quick Order Form */}
        <form onSubmit={handleSubmit} className="drawer-form">
          {/* Size Choice */}
          <div className="drawer-field-group">
            <label className="drawer-label">{isAr ? 'فئة الحجم والكثافة الملكية:' : 'Royal Size & Density Tier:'}</label>
            <div className="drawer-size-chips">
              {[
                {
                  id: 'small',
                  title_ar: 'الباقة الناعمة (Petite Charm)',
                  desc_ar: 'لمسة رقيقة وأنيقة (-50 ج.م)',
                  title_en: 'Petite Charm',
                  desc_en: 'Subtle elegance (-50 EGP)',
                },
                {
                  id: 'medium',
                  title_ar: 'الباقة الكلاسيكية (Signature Collection)',
                  desc_ar: 'الحجم الأصلي المتوازن',
                  title_en: 'Signature Collection',
                  desc_en: 'Original balanced size',
                },
                {
                  id: 'large',
                  title_ar: 'الباقة الملكية الفاخرة (Royal VIP Grandeur)',
                  desc_ar: 'ضعف كثافة الورد وحضور استثنائي (+100 ج.م)',
                  title_en: 'Royal VIP Grandeur',
                  desc_en: 'Double density & grandeur (+100 EGP)',
                },
              ].map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setSelectedSize(s.id)}
                  className={`drawer-chip ${selectedSize === s.id ? 'active' : ''}`}
                >
                  <div className="chip-header">
                    {selectedSize === s.id && <Check size={14} className="chip-check" />}
                    <strong className="chip-title">{isAr ? s.title_ar : s.title_en}</strong>
                  </div>
                  <span className="chip-desc">{isAr ? s.desc_ar : s.desc_en}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Customer Name */}
          <div className="drawer-field-group">
            <label className="drawer-label">{isAr ? 'الاسم بالكامل *' : 'Your Full Name *'}</label>
            <div className="drawer-input-wrap">
              <User size={16} className="input-icon" />
              <input
                type="text"
                required
                placeholder={isAr ? 'مثال: سارة الشافعي' : 'e.g. Sarah Ahmed'}
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="drawer-field-group">
            <label className="drawer-label">{isAr ? 'رقم الهاتف (واتساب) *' : 'Phone Number *'}</label>
            <div className="drawer-input-wrap">
              <Phone size={16} className="input-icon" />
              <input
                type="tel"
                required
                placeholder="01xxxxxxxxx"
                value={formData.phone}
                onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              />
            </div>
          </div>

          {/* District Area */}
          <div className="drawer-field-group">
            <label className="drawer-label">{isAr ? 'وجهة موكب التوصيل (القاهرة والجيزة):' : 'Delivery Destination:'}</label>
            <div className="drawer-input-wrap">
              <MapPin size={16} className="input-icon" />
              <select
                value={formData.district}
                onChange={(e) => setFormData((prev) => ({ ...prev, district: e.target.value }))}
              >
                <option value="القاهرة - التجمع الخامس">{isAr ? 'القاهرة - التجمع الخامس والتجمع الأول' : 'Cairo - New Cairo (5th / 1st Sett.)'}</option>
                <option value="الجيزة - الشيخ زايد و 6 أكتوبر">{isAr ? 'الجيزة - الشيخ زايد و 6 أكتوبر' : 'Giza - Sheikh Zayed & 6th of Oct'}</option>
                <option value="القاهرة - مصر الجديدة ومدينة نصر">{isAr ? 'القاهرة - مصر الجديدة ومدينة نصر' : 'Cairo - Heliopolis & Nasr City'}</option>
                <option value="القاهرة - المعادي ودجلة">{isAr ? 'القاهرة - المعادي ودجلة' : 'Cairo - Maadi & Degla'}</option>
                <option value="الجيزة - الدقي والمهندسين والزمالك">{isAr ? 'الجيزة - الدقي والمهندسين والزمالك' : 'Giza - Dokki, Mohandessin & Zamalek'}</option>
                <option value="القاهرة - الشروق ومدينتي">{isAr ? 'القاهرة - الشروق ومدينتي' : 'Cairo - Madinaty & El Shorouk'}</option>
              </select>
            </div>
          </div>

          {/* Delivery Time Window as Luxury Chips */}
          <div className="drawer-field-group">
            <label className="drawer-label">{isAr ? 'موعد انطلاق موكب التوصيل المفضل:' : 'Preferred Delivery Time Window:'}</label>
            <div className="drawer-delivery-chips">
              {[
                {
                  id: 'morning',
                  icon: '🌅',
                  title_ar: 'موكب صباحي (10ص - 2ظ)',
                  sub_ar: 'قطف الصباح في ذروة النضارة',
                  title_en: 'Morning (10AM - 2PM)',
                  sub_en: 'Dewy morning harvest',
                },
                {
                  id: 'evening',
                  icon: '🌙',
                  title_ar: 'موكب مسائي (4ع - 9م)',
                  sub_ar: 'لحظات الغروب والاحتفال الدافئة',
                  title_en: 'Evening (4PM - 9PM)',
                  sub_en: 'Sunset celebrations & surprises',
                },
                {
                  id: 'rush',
                  icon: '⚡',
                  title_ar: 'موكب VIP عاجل (3 ساعات)',
                  sub_ar: 'تجهيز فوري وانطلاق استثنائي',
                  title_en: 'VIP Express Rush (3h)',
                  sub_en: 'Immediate priority dispatch',
                },
              ].map((slot) => (
                <button
                  type="button"
                  key={slot.id}
                  onClick={() => setFormData((prev) => ({ ...prev, deliveryTime: slot.id }))}
                  className={`drawer-delivery-chip ${formData.deliveryTime === slot.id ? 'active' : ''}`}
                >
                  <span className="delivery-chip-icon">{slot.icon}</span>
                  <div className="delivery-chip-text">
                    <strong className="delivery-chip-title">{isAr ? slot.title_ar : slot.title_en}</strong>
                    <small className="delivery-chip-sub">{isAr ? slot.sub_ar : slot.sub_en}</small>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Gift Dedication Input */}
          <div className="drawer-field-group">
            <label className="drawer-label">{isAr ? 'نص بطاقة الإهداء الملكية (اختياري):' : 'Gift Card Dedication (Optional):'}</label>
            <div className="drawer-input-wrap">
              <Gift size={16} className="input-icon" />
              <textarea
                rows={2}
                placeholder={isAr ? 'اكتب ما يفيض به قلبك من كلمات وسنخطّها بمداد أنيق على ورق قطني...' : 'Write your heartfelt message and we will script it with elegance on cotton stationery...'}
                value={formData.giftNote}
                onChange={(e) => setFormData((prev) => ({ ...prev, giftNote: e.target.value }))}
                className="drawer-gift-textarea font-poetic"
              />
            </div>

            {/* Live Royal Cotton Stationery & Wax Seal Preview */}
            <div className="drawer-stationery-preview-wrap">
              <div className="stationery-card">
                <div className="stationery-card-header">
                  <span className="stationery-header-title">
                    <Sparkles size={12} />
                    {isAr ? 'معاينة بطاقة الإهداء الملكية المذهبة (ورق قطني)' : 'Royal Stationery Dedication Preview'}
                  </span>
                  <span className="stationery-watermark">Al-Ward Atelier</span>
                </div>
                <div className="stationery-card-body font-poetic">
                  <p className="stationery-card-text">
                    «{formData.giftNote.trim() || (isAr ? 'نص إهدائكم الملكي سيُخط هنا بمداد ذهبي يليق بصدق مشاعركم...' : 'Your royal dedication will be inscribed here in gold calligraphy...')}»
                  </p>
                </div>
                <div className="stationery-card-footer">
                  <div className="wax-seal-badge" title={isAr ? 'ختم الشمع الملكي المعتمد' : 'Royal Wax Seal'}>
                    <span>🌹</span>
                  </div>
                  <div className="stationery-seal-info">
                    <span className="seal-title">{isAr ? 'مختومة بختم الشمع الملكي المذهب' : 'Sealed with Hand-Pressed Royal Wax'}</span>
                    <small className="seal-sub">{isAr ? 'يُغلق به الظرف القطني لحفظ حرمة المشاعر' : 'Preserving feelings in velvet confidentiality'}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Gift Toggle & Recipient Fields */}
          <div className="drawer-field-group">
            <label className="gift-toggle-row" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--gold-light)', fontSize: '0.9rem' }}>
              <input
                type="checkbox"
                checked={formData.isGift}
                onChange={(e) => setFormData((prev) => ({ ...prev, isGift: e.target.checked }))}
              />
              <span>{isAr ? '🎁 إرسال الباقة كهدية لشخص آخر (تحديد المستلم)' : '🎁 Send as a surprise gift to someone else'}</span>
            </label>
          </div>

          {formData.isGift && (
            <div className="drawer-recipient-fields animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(212, 168, 83, 0.05)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(212, 168, 83, 0.2)', marginBottom: '16px' }}>
              <div className="drawer-field-group" style={{ margin: 0 }}>
                <label className="drawer-label">{isAr ? 'اسم المستلم *' : 'Recipient Name *'}</label>
                <div className="drawer-input-wrap">
                  <User size={16} className="input-icon" />
                  <input
                    type="text"
                    placeholder={isAr ? 'اسم المستلم الكريم' : 'Recipient name'}
                    value={formData.recipientName}
                    onChange={(e) => setFormData((prev) => ({ ...prev, recipientName: e.target.value }))}
                  />
                </div>
              </div>

              <div className="drawer-field-group" style={{ margin: 0 }}>
                <label className="drawer-label">{isAr ? 'رقم هاتف المستلم (اختياري / للتنسيق)' : 'Recipient Phone (Optional)'}</label>
                <div className="drawer-input-wrap">
                  <Phone size={16} className="input-icon" />
                  <input
                    type="tel"
                    placeholder="01xxxxxxxxx"
                    value={formData.recipientPhone}
                    onChange={(e) => setFormData((prev) => ({ ...prev, recipientPhone: e.target.value }))}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Submit Direct Button */}
          <button type="submit" className="btn-drawer-whatsapp">
            <MessageCircle size={20} />
            <span>{isAr ? `اعتماد موكب الإهداء عبر واتساب • ${finalPrice} ${currencySymbol}` : `Confirm via WhatsApp • ${finalPrice} ${currencySymbol}`}</span>
          </button>

          <div className="drawer-guarantee-note">
            <ShieldCheck size={16} color="#34D399" />
            <span>{isAr ? 'تأكيد فوري مع مستشار التنسيق وموكب مبرّد يحفظ نضارة الورد' : 'Live florist assistance & temperature-controlled delivery'}</span>
          </div>
        </form>
      </div>
    </div>
  );
}
