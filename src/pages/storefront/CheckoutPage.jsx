import { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { CURRENCY, STORE_INFO } from '../../config/constants.js';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  ShieldCheck,
  CreditCard,
  Truck,
  Building,
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  MessageCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const { items, totalPrice, clearCart } = useCart();
  const { showSuccess, showError } = useNotification();

  const isAr = i18n.language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const currencySymbol = isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en;

  const discountAmount = location.state?.discountAmount || 0;
  const appliedPromo = location.state?.appliedPromo || '';
  const shippingFee = totalPrice >= 300 ? 0 : 25;
  const finalPayable = Math.max(0, totalPrice - discountAmount + shippingFee);

  // Form states
  const [formData, setFormData] = useState({
    senderName: '',
    senderPhone: '',
    city: 'القاهرة',
    district: '',
    deliveryDate: '',
    deliveryTime: 'evening', // morning, afternoon, evening
    isGift: false,
    recipientName: '',
    recipientPhone: '',
    paymentMethod: 'whatsapp', // 'whatsapp', 'cod', 'card', 'bank'
    notes: '',
  });

  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [generatedOrderNumber, setGeneratedOrderNumber] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    if (!formData.senderName.trim() || !formData.senderPhone.trim()) {
      showError(isAr ? 'يرجى كتابة الاسم ورقم الهاتف للتواصل' : 'Please provide name and phone number');
      return;
    }

    if (!formData.district.trim()) {
      showError(isAr ? 'يرجى كتابة الحي أو عنوان التوصيل' : 'Please provide delivery address/district');
      return;
    }

    // Generate Order ID
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedOrderNumber(orderId);

    // Save order in localStorage so it dynamically shows in Admin Dashboard!
    const newOrderRecord = {
      id: orderId,
      customer_name: formData.senderName,
      customer_phone: formData.senderPhone,
      city: formData.city,
      district: formData.district,
      total_price: finalPayable,
      status: 'new',
      items: items.map((i) => ({
        id: i.id,
        name: isAr ? i.name_ar : i.name_en,
        quantity: i.quantity,
        price: i.price,
      })),
      created_at: new Date().toISOString(),
      is_gift: formData.isGift,
      recipient_name: formData.recipientName,
      recipient_phone: formData.recipientPhone,
      payment_method: formData.paymentMethod,
    };

    const existingOrders = JSON.parse(localStorage.getItem('al_ward_orders') || '[]');
    localStorage.setItem('al_ward_orders', JSON.stringify([newOrderRecord, ...existingOrders]));

    // Trigger celebration confetti
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#D4A853', '#E8C87A', '#C4546D', '#FFFFFF'],
    });

    setOrderSubmitted(true);
    clearCart();
    showSuccess(isAr ? 'تم استلام طلبك بنجاح! 🌹' : 'Order placed successfully! 🌹');
  };

  const handleWhatsAppConfirmation = () => {
    let message = isAr
      ? `مرحباً، تم تأكيد الطلب رقم (${generatedOrderNumber}) عبر المتجر:\n` +
        `• العميل: ${formData.senderName} (${formData.senderPhone})\n` +
        `• العنوان: ${formData.city} - ${formData.district}\n` +
        `• الإجمالي: ${finalPayable} ${currencySymbol}\n` +
        `• طريقة الدفع: ${formData.paymentMethod}\n`
      : `Hello, order placed (#${generatedOrderNumber}) on the store:\n` +
        `• Customer: ${formData.senderName} (${formData.senderPhone})\n` +
        `• Address: ${formData.city} - ${formData.district}\n` +
        `• Total: ${finalPayable} ${currencySymbol}\n`;

    if (formData.isGift) {
      message += isAr
        ? `• هدية للمستلم: ${formData.recipientName} (${formData.recipientPhone})\n`
        : `• Gift for: ${formData.recipientName} (${formData.recipientPhone})\n`;
    }

    message += isAr ? `شكراً لكم ونرجو المتابعة!` : `Thank you, please confirm!`;
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (orderSubmitted) {
    return (
      <div className="order-success-page container-wide">
        <div className="order-success-card glass animate-fade-in">
          <div className="success-icon-wrap">
            <CheckCircle size={56} color="#34D399" />
          </div>
          <span className="success-tag">
            <Sparkles size={14} /> {isAr ? 'تم تأكيد طلبك' : 'Order Confirmed'}
          </span>
          <h1 className="success-title">
            {isAr ? 'شكراً لثقتكم بالورد للورد' : 'Thank You For Choosing Al-Ward'}
          </h1>
          <p className="order-number-line">
            {isAr ? 'رقم الطلب:' : 'Order ID:'} <strong>{generatedOrderNumber}</strong>
          </p>
          <p className="success-desc">
            {isAr
              ? 'سيقوم منسق الزهور بالبدء بتجهيز بوكيهك بكل شغف وعناية، وسيتم التواصل معك مباشرة لتأكيد تفاصيل وموعد التوصيل.'
              : 'Our florists will craft your bouquet with utmost passion. We will contact you soon with delivery updates.'}
          </p>

          <div className="success-actions">
            <button onClick={handleWhatsAppConfirmation} className="btn-confirm-wa">
              <MessageCircle size={20} />
              <span>{isAr ? 'تأكيد الطلب الفوري عبر واتساب' : 'Confirm on WhatsApp'}</span>
            </button>
            <Link to="/shop" className="btn-back-home">
              <span>{isAr ? 'العودة للمتجر' : 'Return to Shop'}</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="order-success-page container-wide">
        <div className="order-success-card glass">
          <h2>{isAr ? 'السلة فارغة' : 'Your cart is empty'}</h2>
          <p>{isAr ? 'يرجى اختيار بوكيه أولاً قبل التوجه للدفع.' : 'Please add a bouquet before proceeding.'}</p>
          <Link to="/shop" className="btn-back-home">
            {isAr ? 'تصفح المتجر' : 'Browse Shop'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page container-wide">
      <div className="checkout-header">
        <h1 className="checkout-title">
          {isAr ? 'إتمام الطلب والتوصيل' : 'Checkout & Delivery'}
        </h1>
        <p className="checkout-subtitle">
          {isAr ? 'أدخل تفاصيل المستلم وموعد التوصيل المفضل' : 'Enter recipient details and delivery preferences'}
        </p>
      </div>

      <form onSubmit={handlePlaceOrder} className="checkout-layout">
        {/* Form Fields */}
        <div className="checkout-form-col">
          {/* Customer Details */}
          <div className="form-card glass">
            <h3 className="card-section-title">
              <User size={18} className="title-icon" />
              {isAr ? 'بيانات المشتري (المرسل)' : 'Sender Details'}
            </h3>

            <div className="form-grid">
              <div className="form-group">
                <label>{isAr ? 'الاسم الكامل *' : 'Full Name *'}</label>
                <input
                  type="text"
                  name="senderName"
                  required
                  placeholder={isAr ? 'مثال: سارة محمد' : 'e.g. Sarah Ahmed'}
                  value={formData.senderName}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>{isAr ? 'رقم الجوال *' : 'Phone Number *'}</label>
                <input
                  type="tel"
                  name="senderPhone"
                  required
                  placeholder={isAr ? '01XXXXXXXXX' : '+20 1X XXXX XXXX'}
                  value={formData.senderPhone}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Delivery Details */}
          <div className="form-card glass">
            <h3 className="card-section-title">
              <MapPin size={18} className="title-icon" />
              {isAr ? 'عنوان وتوقيت التوصيل' : 'Delivery Address & Timing'}
            </h3>

            <div className="form-grid">
              <div className="form-group">
                <label>{isAr ? 'المدينة / المنطقة' : 'City / Governorate'}</label>
                <select name="city" value={formData.city} onChange={handleChange}>
                  <option value="القاهرة">{isAr ? 'القاهرة' : 'Cairo'}</option>
                  <option value="الجيزة">{isAr ? 'الجيزة' : 'Giza'}</option>
                  <option value="الإسكندرية">{isAr ? 'الإسكندرية' : 'Alexandria'}</option>
                  <option value="التجمع الخامس والقاهرة الجديدة">{isAr ? 'التجمع الخامس والقاهرة الجديدة' : 'New Cairo / 5th Settlement'}</option>
                  <option value="الشيخ زايد و 6 أكتوبر">{isAr ? 'الشيخ زايد و 6 أكتوبر' : 'Sheikh Zayed & 6th October'}</option>
                  <option value="المعادي">{isAr ? 'المعادي' : 'Maadi'}</option>
                  <option value="مصر الجديدة ومدينة نصر">{isAr ? 'مصر الجديدة ومدينة نصر' : 'Heliopolis & Nasr City'}</option>
                  <option value="مدينتي والشروق">{isAr ? 'مدينتي والشروق' : 'Madinaty & El Shorouk'}</option>
                </select>
              </div>

              <div className="form-group">
                <label>{isAr ? 'الحي والشارع وتفاصيل العنوان *' : 'District & Street Details *'}</label>
                <input
                  type="text"
                  name="district"
                  required
                  placeholder={isAr ? 'مثال: التجمع الخامس، شارع التسعين / المعادي، دجلة' : 'e.g. 5th Settlement, North 90th / Degla'}
                  value={formData.district}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>{isAr ? 'تاريخ التوصيل المفضل' : 'Preferred Delivery Date'}</label>
                <input
                  type="date"
                  name="deliveryDate"
                  value={formData.deliveryDate}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>{isAr ? 'الفترة الزمنية المفضلة' : 'Preferred Delivery Slot'}</label>
                <select name="deliveryTime" value={formData.deliveryTime} onChange={handleChange}>
                  <option value="morning">{isAr ? 'صباحاً (10:00 ص - 01:00 م)' : 'Morning (10am - 1pm)'}</option>
                  <option value="afternoon">{isAr ? 'عصراً (02:00 م - 05:00 م)' : 'Afternoon (2pm - 5pm)'}</option>
                  <option value="evening">{isAr ? 'مساءً (06:00 م - 10:00 م)' : 'Evening (6pm - 10pm)'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Gift Toggle */}
          <div className="form-card glass">
            <label className="gift-toggle-row">
              <input
                type="checkbox"
                name="isGift"
                checked={formData.isGift}
                onChange={handleChange}
              />
              <span>{isAr ? '🎁 هل الطلب هدية مفاجئة لشخص آخر؟' : '🎁 Is this a surprise gift for someone else?'}</span>
            </label>

            {formData.isGift && (
              <div className="recipient-fields animate-fade-in">
                <div className="form-grid">
                  <div className="form-group">
                    <label>{isAr ? 'اسم المستلم' : 'Recipient Name'}</label>
                    <input
                      type="text"
                      name="recipientName"
                      placeholder={isAr ? 'اسم مستلم الهدية' : 'Recipient Name'}
                      value={formData.recipientName}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>{isAr ? 'جوال المستلم' : 'Recipient Phone'}</label>
                    <input
                      type="tel"
                      name="recipientPhone"
                      placeholder={isAr ? '01XXXXXXXXX' : '+20 1X XXXX XXXX'}
                      value={formData.recipientPhone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Payment Method */}
          <div className="form-card glass">
            <h3 className="card-section-title">
              <CreditCard size={18} className="title-icon" />
              {isAr ? 'طريقة الدفع والتأكيد' : 'Payment & Confirmation'}
            </h3>

            <div className="payment-options">
              {[
                {
                  id: 'whatsapp',
                  title_ar: 'تأكيد مباشر عبر واتساب (الأكثر تفضيلاً)',
                  title_en: 'Direct WhatsApp Confirmation (Recommended)',
                  desc_ar: 'تأكيد سريع مع المنسق، إرسال صورة البوكيه قبل خروجه، وخيارات دفع مرنة',
                  desc_en: 'Instant confirmation, preview bouquet photos before delivery, flexible payment',
                },
                {
                  id: 'cod',
                  title_ar: 'الدفع عند الاستلام',
                  title_en: 'Cash on Delivery',
                  desc_ar: 'الدفع كاش أو شبكة لمندوب التوصيل عند استلام البوكيه',
                  desc_en: 'Pay by cash or POS machine upon delivery',
                },
                {
                  id: 'bank',
                  title_ar: 'تحويل بنكي / إنستاباي (InstaPay / الأهلي / CIB)',
                  title_en: 'Bank Transfer / InstaPay (NBE / CIB / Banque Misr)',
                  desc_ar: 'إرسال إيصال التحويل عبر واتساب بعد إتمام الطلب مباشرة',
                  desc_en: 'Send transfer receipt via WhatsApp after ordering',
                },
              ].map((p) => (
                <label
                  key={p.id}
                  className={`payment-option-card ${formData.paymentMethod === p.id ? 'active' : ''}`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={p.id}
                    checked={formData.paymentMethod === p.id}
                    onChange={handleChange}
                  />
                  <div className="payment-opt-info">
                    <h4>{isAr ? p.title_ar : p.title_en}</h4>
                    <p>{isAr ? p.desc_ar : p.desc_en}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order Review Sticky Col */}
        <div className="checkout-summary-col">
          <div className="checkout-summary-card glass">
            <h3 className="summary-title">{isAr ? 'محتويات طلبك' : 'Your Order'}</h3>

            <div className="summary-items-list">
              {items.map((i) => (
                <div key={i.cartId || i.id} className="summary-mini-item">
                  <div className="mini-item-info">
                    <span className="mini-name">
                      {isAr ? i.name_ar : i.name_en} <small>x{i.quantity}</small>
                    </span>
                    {i.selectedSize && <span className="mini-size">({i.selectedSize})</span>}
                  </div>
                  <span className="mini-price">
                    {i.price * i.quantity} {currencySymbol}
                  </span>
                </div>
              ))}
            </div>

            <div className="summary-calc">
              <div className="calc-row">
                <span>{isAr ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span>{totalPrice} {currencySymbol}</span>
              </div>
              {discountAmount > 0 && (
                <div className="calc-row discount-row">
                  <span>{isAr ? `خصم الكوبون ${appliedPromo ? `(${appliedPromo})` : ''}` : `Discount ${appliedPromo ? `(${appliedPromo})` : ''}`}</span>
                  <span>-{discountAmount} {currencySymbol}</span>
                </div>
              )}
              <div className="calc-row">
                <span>{isAr ? 'رسوم التوصيل' : 'Delivery'}</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="free-badge">{isAr ? 'مجاني' : 'Free'}</span>
                  ) : (
                    `${shippingFee} ${currencySymbol}`
                  )}
                </span>
              </div>
              <div className="calc-row total-row">
                <span>{isAr ? 'المجموع المطلوب' : 'Total Amount'}</span>
                <span className="final-price">
                  {finalPayable} {currencySymbol}
                </span>
              </div>
            </div>

            <button type="submit" className="btn-submit-order">
              <Sparkles size={18} />
              <span>{isAr ? 'تأكيد وإرسال الطلب الآن' : 'Place Order Now'}</span>
              <ArrowIcon size={16} />
            </button>

            <div className="secure-badge">
              <ShieldCheck size={16} color="#34D399" />
              <span>{isAr ? 'طلب موثوق مع متابعة مستمرة حتى التسليم' : 'Guaranteed fulfillment & live updates'}</span>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
