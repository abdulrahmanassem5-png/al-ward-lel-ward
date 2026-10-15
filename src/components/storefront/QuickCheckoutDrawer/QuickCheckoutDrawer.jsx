import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CURRENCY, STORE_INFO } from '../../../config/constants.js';
import { useNotification } from '../../../context/NotificationContext.jsx';
import confetti from 'canvas-confetti';
import {
  X,
  Sparkles,
  MessageCircle,
  MapPin,
  User,
  Phone,
  Gift,
  Clock,
  ShieldCheck,
  Check,
} from 'lucide-react';
import './QuickCheckoutDrawer.css';

export default function QuickCheckoutDrawer({ product, isOpen, onClose }) {
  const { i18n } = useTranslation();
  const { showSuccess, showError } = useNotification();
  const isAr = i18n.language === 'ar';
  const currencySymbol = isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en;

  const [selectedSize, setSelectedSize] = useState('medium');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    district: 'القاهرة - التجمع الخامس',
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

    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;

    // Save order in localStorage so it dynamically shows in Admin Dashboard!
    const newOrderRecord = {
      id: orderId,
      customer_name: formData.name.trim(),
      customer_phone: formData.phone.trim(),
      city: formData.district,
      district: formData.district,
      total_price: finalPrice,
      status: 'new',
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
      is_gift: !!formData.giftNote.trim(),
      recipient_name: formData.giftNote.trim() ? (isAr ? 'مستلم الهدية' : 'Gift Recipient') : '',
      recipient_phone: '',
      payment_method: 'طلب سريع عبر واتساب (Quick WhatsApp)',
    };

    try {
      const existing = JSON.parse(localStorage.getItem('al_ward_orders') || '[]');
      localStorage.setItem('al_ward_orders', JSON.stringify([newOrderRecord, ...existing]));
    } catch {
      // ignore
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
        ? (isAr ? 'صغير' : 'Small')
        : selectedSize === 'large'
        ? (isAr ? 'كبير (ملكي)' : 'Large (Royal)')
        : (isAr ? 'متوسط (كلاسيك)' : 'Medium (Classic)');

    const deliveryTimeName =
      formData.deliveryTime === 'morning'
        ? (isAr ? 'صباحي (10ص - 2ظ)' : 'Morning (10AM - 2PM)')
        : formData.deliveryTime === 'rush'
        ? (isAr ? 'فوري عاجل (خلال 3 ساعات)' : 'Rush (Within 3 Hours)')
        : (isAr ? 'مسائي (4ع - 9م)' : 'Evening (4PM - 9PM)');

    const text = isAr
      ? `مرحباً، أود تأكيد طلب سريع للبوكيه من المتجر 🌹:\n` +
        `• رقم الطلب: ${orderId}\n` +
        `• البوكيه: ${product.name_ar}\n` +
        `• الحجم: ${sizeName}\n` +
        `• السعر الإجمالي: ${finalPrice} ${currencySymbol}\n` +
        `• العميل: ${formData.name} (${formData.phone})\n` +
        `• منطقة التوصيل: ${formData.district}\n` +
        `• موعد التسليم: ${deliveryTimeName}\n` +
        (formData.giftNote.trim() ? `• بطاقة الإهداء: "${formData.giftNote.trim()}"\n` : '') +
        `\nأرجو تأكيد الاستلام والتجهيز، شكراً لكم!`
      : `Hello, I'd like to confirm a quick bouquet order 🌹:\n` +
        `• Order ID: ${orderId}\n` +
        `• Bouquet: ${product.name_en}\n` +
        `• Size: ${sizeName}\n` +
        `• Total: ${finalPrice} ${currencySymbol}\n` +
        `• Customer: ${formData.name} (${formData.phone})\n` +
        `• Delivery Area: ${formData.district}\n` +
        `• Delivery Window: ${deliveryTimeName}\n` +
        (formData.giftNote.trim() ? `• Gift Note: "${formData.giftNote.trim()}"\n` : '');

    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');

    showSuccess(isAr ? 'تم إرسال تفاصيل طلبك للمنسق عبر واتساب! 🌹' : 'Order sent to florist on WhatsApp! 🌹');
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
              <Sparkles size={14} /> {isAr ? 'طلب سريع بنقرة واحدة' : '1-Click Quick Order'}
            </span>
            <h2 className="drawer-title">{isAr ? 'تأكيد البوكيه عبر واتساب' : 'WhatsApp Bouquet Order'}</h2>
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
                {isAr ? 'توصيل مبرد سريع' : 'Express Delivery'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Order Form */}
        <form onSubmit={handleSubmit} className="drawer-form">
          {/* Size Choice */}
          <div className="drawer-field-group">
            <label className="drawer-label">{isAr ? 'حجم البوكيه:' : 'Bouquet Size:'}</label>
            <div className="drawer-size-chips">
              {[
                { id: 'small', label_ar: 'صغير (-50 ج.م)', label_en: 'Small (-50)' },
                { id: 'medium', label_ar: 'كلاسيك (متوسط)', label_en: 'Classic' },
                { id: 'large', label_ar: 'ملكي كبير (+100 ج.م)', label_en: 'Royal (+100)' },
              ].map((s) => (
                <button
                  type="button"
                  key={s.id}
                  onClick={() => setSelectedSize(s.id)}
                  className={`drawer-chip ${selectedSize === s.id ? 'active' : ''}`}
                >
                  {selectedSize === s.id && <Check size={14} className="chip-check" />}
                  <span>{isAr ? s.label_ar : s.label_en}</span>
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
            <label className="drawer-label">{isAr ? 'منطقة التوصيل (القاهرة والجيزة)' : 'Delivery Area'}</label>
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

          {/* Delivery Time Slot */}
          <div className="drawer-field-group">
            <label className="drawer-label">{isAr ? 'موعد التوصيل المفضل:' : 'Delivery Time Window:'}</label>
            <div className="drawer-input-wrap">
              <Clock size={16} className="input-icon" />
              <select
                value={formData.deliveryTime}
                onChange={(e) => setFormData((prev) => ({ ...prev, deliveryTime: e.target.value }))}
              >
                <option value="evening">{isAr ? 'مسائي (4 عصراً - 9 مساءً)' : 'Evening (4PM - 9PM)'}</option>
                <option value="morning">{isAr ? 'صباحي (10 صباحاً - 2 ظهراً)' : 'Morning (10AM - 2PM)'}</option>
                <option value="rush">{isAr ? 'توصيل عاجل بنفس اليوم (خلال 3 ساعات)' : 'Express Rush (within 3 hours)'}</option>
              </select>
            </div>
          </div>

          {/* Gift Dedication */}
          <div className="drawer-field-group">
            <label className="drawer-label">{isAr ? 'نص كارت الإهداء (اختياري):' : 'Gift Card Dedication (Optional):'}</label>
            <div className="drawer-input-wrap">
              <Gift size={16} className="input-icon" />
              <textarea
                rows={2}
                placeholder={isAr ? 'اكتب عبارة تهنئة رقيقة أو إهداء خاص يُرفق مع البوكيه...' : 'Write your sweet message or dedication...'}
                value={formData.giftNote}
                onChange={(e) => setFormData((prev) => ({ ...prev, giftNote: e.target.value }))}
              />
            </div>
          </div>

          {/* Submit Direct Button */}
          <button type="submit" className="btn-drawer-whatsapp">
            <MessageCircle size={20} />
            <span>{isAr ? `تأكيد وإرسال عبر واتساب • ${finalPrice} ${currencySymbol}` : `Confirm via WhatsApp • ${finalPrice} ${currencySymbol}`}</span>
          </button>

          <div className="drawer-guarantee-note">
            <ShieldCheck size={16} color="#34D399" />
            <span>{isAr ? 'تأكيد مباشر مع منسق الزهور وتوصيل مبرد مضمون' : 'Live florist assistance & temperature-controlled delivery'}</span>
          </div>
        </form>
      </div>
    </div>
  );
}
