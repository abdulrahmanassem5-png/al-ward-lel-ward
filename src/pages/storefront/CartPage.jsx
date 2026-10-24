import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { CURRENCY } from '../../config/constants.js';
import { getStoreSettings, formatPhoneForWhatsApp } from '../../utils/storeSettingsManager.js';
import { deductMaterialsForOrder } from '../../utils/recipeInventoryManager.js';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ArrowLeft,
  MessageCircle,
  CreditCard,
  Tag,
  ShieldCheck,
  QrCode,
} from 'lucide-react';
import './CartPage.css';

export default function CartPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, totalPrice, totalItems } = useCart();
  const { showSuccess, showError } = useNotification();

  const isAr = i18n.language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const currencySymbol = isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en;

  const storeSettings = getStoreSettings();
  const freeThreshold = Number(storeSettings.freeDeliveryThreshold) || 300;
  const standardFee = Number(storeSettings.deliveryFee) || 25;

  const [promoInput, setPromoInput] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState('');

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === 'WARD10' || code === 'ROSE10') {
      setDiscountPercent(10);
      setAppliedPromo(code);
      showSuccess(isAr ? 'تم تطبيق كود الخصم بنجاح (10%) 🎉' : 'Promo code applied successfully (10%) 🎉');
    } else if (code === 'GOLD20') {
      setDiscountPercent(20);
      setAppliedPromo(code);
      showSuccess(isAr ? 'تم تطبيق كود الخصم الذهبي (20%) 🌟' : 'Golden promo applied (20%) 🌟');
    } else {
      showError(isAr ? 'كود الخصم غير صالح' : 'Invalid promo code');
    }
  };

  const discountAmount = Math.round((totalPrice * discountPercent) / 100);
  const shippingFee = totalPrice >= freeThreshold ? 0 : standardFee;
  const finalPayable = Math.max(0, totalPrice - discountAmount + shippingFee);

  const handleWhatsAppCartOrder = () => {
    const orderId = `ORD-WA-${Date.now().toString().slice(-6)}`;

    let message = isAr
      ? `مرحباً بكم دار الورد للورد 🌹✨\nأود اعتماد موكب إهداء ملكي من حقيبة الهدايا:\n━━━━━━━━━━━━━━━━━━\n`
      : `Hello Al-Ward Lel-Ward Atelier 🌹✨\nI would like to place an order from my Royal Gift Bag:\n━━━━━━━━━━━━━━━━━━\n`;

    message += `رقم الطلب المرجعي: ${orderId}\n`;

    items.forEach((item, idx) => {
      const name = isAr ? item.name_ar : item.name_en;
      message += `${idx + 1}. ${name} (${item.quantity}x) - ${item.price * item.quantity} ${currencySymbol}\n`;
      if (item.selectedSize) {
        message += `   • فئة الحجم: ${item.selectedSize}\n`;
      }
      if (item.giftNote) {
        message += `   • بطاقة الإهداء الملكية: «${item.giftNote}»\n`;
      }
      if (item.includeQR) {
        message += `   • باركود صوتي/مرئي تفاعلي: نعم\n`;
      }
    });

    message += `━━━━━━━━━━━━━━━━━━\nالمجموع الفرعي: ${totalPrice} ${currencySymbol}\n`;
    if (discountAmount > 0) {
      message += `الخصم الملكي: -${discountAmount} ${currencySymbol} (كود: ${appliedPromo})\n`;
    }
    message += `التوصيل: ${shippingFee === 0 ? (isAr ? 'موكب مبرّد مجاني' : 'Free Climate-Controlled') : `${shippingFee} ${currencySymbol}`}\n`;
    message += `إجمالي القيمة الفاخرة: ${finalPayable} ${currencySymbol}\n\n`;
    message += `أرجو التكرم باعتماد التجهيز وتأكيد موعد الموكب، شاكرين لكم حسن ذوقكم!`;

    // Create official ERP order record
    const newOrder = {
      id: orderId,
      customer_name: isAr ? 'عميل واتساب (حقيبة الهدايا)' : 'WhatsApp Bag Client',
      customer_phone: storeSettings.whatsapp || '01221120701',
      delivery_address: isAr ? 'طلب سريع عبر واتساب - يتم التأكيد في المحادثة' : 'WhatsApp Express - Pending chat confirmation',
      delivery_date: new Date().toISOString().split('T')[0],
      delivery_time: '18:00 - 21:00',
      status: 'new',
      source: 'whatsapp_cart',
      items: items.map((it) => ({
        product_id: it.id,
        product_name_ar: it.name_ar,
        product_name_en: it.name_en,
        quantity: it.quantity,
        unit_price: it.price,
        selectedSize: it.selectedSize,
        giftNote: it.giftNote,
        includeQR: it.includeQR,
      })),
      subtotal: totalPrice,
      discount: discountAmount,
      delivery_fee: shippingFee,
      total_amount: finalPayable,
      payment_method: 'whatsapp',
      payment_status: 'pending',
      promo_code: appliedPromo || null,
      created_at: new Date().toISOString(),
      is_inventory_deducted: false,
    };

    try {
      const existingOrders = JSON.parse(localStorage.getItem('al_ward_orders') || '[]');
      existingOrders.unshift(newOrder);
      localStorage.setItem('al_ward_orders', JSON.stringify(existingOrders));
      window.dispatchEvent(new CustomEvent('al_ward_orders_updated', { detail: { order: newOrder } }));
      
      // Automatically deduct recipe ingredients for the recorded order
      deductMaterialsForOrder(newOrder);
    } catch (err) {
      console.error('Failed to register WhatsApp order in ERP:', err);
    }

    showSuccess(
      isAr
        ? `تم تسجيل طلبك برقم (${orderId}) في المنصة، ويتم تحويلك للواتساب الآن ✨`
        : `Order (${orderId}) registered in system, opening WhatsApp now ✨`
    );

    const whatsappPhone = formatPhoneForWhatsApp(storeSettings.whatsapp);
    window.open(`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`, '_blank');
    clearCart();
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty-page container-wide">
        <div className="empty-cart-card glass">
          <div className="empty-cart-icon">✨🌹</div>
          <h2 className="empty-title">{isAr ? 'حقيبتك بانتظار أولى لمساتك الفاخرة' : 'Your Royal Gift Bag is Awaiting Your Touch'}</h2>
          <p className="font-poetic" style={{ fontSize: '1.15rem', color: 'var(--gold-light)' }}>
            {isAr
              ? '«لم تودع في حقيبتك تحفة نباتية بعد .. استكشف تشكيلاتنا الملكية واختر ما يعبر عن أسمى عهودك»'
              : '«Explore our curated royal masterpieces and select the creation that speaks to the heart»'}
          </p>
          <Link to="/shop" className="btn-explore-shop">
            <ShoppingBag size={18} />
            <span>{isAr ? 'استكشف الروائع الملكية' : 'Explore Masterpieces'}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container-wide">
      <div className="cart-header">
        <h1 className="cart-title">
          {isAr ? 'حقيبة الهدايا الملكية' : 'Royal Gift Bag'}
        </h1>
        <span className="cart-items-count">
          ({totalItems} {isAr ? 'تحف مختارة' : 'creations'})
        </span>
      </div>

      <div className="cart-layout">
        {/* Items List */}
        <div className="cart-items-col">
          <div className="cart-items-list">
            {items.map((item) => {
              const name = isAr ? item.name_ar : item.name_en;
              const img = item.images?.[0] || '/images/bouquet-save-the-date.jpg';

              return (
                <div key={item.cartId || item.id} className="cart-item-card glass">
                  <div className="item-img-wrap">
                    <img src={img} alt={name} />
                  </div>

                  <div className="item-info">
                    <div className="item-header">
                      <h3 className="item-title">
                        <Link to={`/product/${item.id}`}>{name}</Link>
                      </h3>
                      <button
                        onClick={() => removeItem(item.cartId || item.id)}
                        className="btn-remove-item"
                        title={isAr ? 'حذف' : 'Remove'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="item-options-badges">
                      {item.selectedSize && (
                        <span className="badge-option">
                          {isAr ? 'الحجم:' : 'Size:'} {item.selectedSize}
                        </span>
                      )}
                      {item.includeQR && (
                        <span className="badge-option qr-badge">
                          <QrCode size={12} /> {isAr ? 'باركود إهداء' : 'QR Tag'}
                        </span>
                      )}
                    </div>

                    {item.giftNote && (
                      <p className="item-gift-note">
                        <strong>{isAr ? 'الإهداء:' : 'Dedication:'}</strong> "{item.giftNote}"
                      </p>
                    )}

                    <div className="item-bottom-row">
                      <div className="item-price">
                        <span className="price-val">{item.price * item.quantity}</span>
                        <span className="price-curr">{currencySymbol}</span>
                        {item.quantity > 1 && (
                          <small className="unit-price">
                            ({item.price} {currencySymbol} {isAr ? 'للقطعة' : 'each'})
                          </small>
                        )}
                      </div>

                      <div className="cart-qty-ctrl glass">
                        <button
                          onClick={() => updateQuantity(item.cartId || item.id, item.quantity - 1)}
                          className="qty-btn"
                        >
                          -
                        </button>
                        <span className="qty-val">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartId || item.id, item.quantity + 1)}
                          className="qty-btn"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-bottom-actions">
            <Link to="/shop" className="btn-continue-shopping">
              <ArrowIcon size={16} />
              <span>{isAr ? 'مواصلة استكشاف الروائع' : 'Continue Exploring'}</span>
            </Link>
            <button onClick={clearCart} className="btn-clear-cart">
              <Trash2 size={16} />
              <span>{isAr ? 'إفراغ الحقيبة' : 'Clear Bag'}</span>
            </button>
          </div>
        </div>

        {/* Order Summary & Checkout */}
        <div className="cart-summary-col">
          <div className="cart-summary-card glass">
            <h2 className="summary-title">{isAr ? 'ملخص موكب الإهداء' : 'Order Summary'}</h2>

            {/* Promo Code Input */}
            <div className="promo-box">
              <div className="promo-input-row">
                <Tag size={16} className="promo-icon" />
                <input
                  type="text"
                  placeholder={isAr ? 'كود الخصم (جرب WARD10)' : 'Promo Code (try WARD10)'}
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="promo-input"
                />
                <button onClick={handleApplyPromo} className="btn-apply-promo">
                  {isAr ? 'تطبيق' : 'Apply'}
                </button>
              </div>
              {discountPercent > 0 && (
                <div className="applied-promo-tag">
                  <span>
                    ✓ {isAr ? `تم خصم ${discountPercent}% بكود ${appliedPromo}` : `${discountPercent}% off with code ${appliedPromo}`}
                  </span>
                </div>
              )}
            </div>

            {/* Calculations */}
            <div className="summary-rows">
              <div className="summary-row">
                <span>{isAr ? 'المجموع الفرعي' : 'Subtotal'}</span>
                <span>{totalPrice} {currencySymbol}</span>
              </div>

              {discountAmount > 0 && (
                <div className="summary-row discount-row">
                  <span>{isAr ? 'الخصم الترويجي' : 'Discount'}</span>
                  <span>-{discountAmount} {currencySymbol}</span>
                </div>
              )}

              <div className="summary-row">
                <span>{isAr ? 'رسوم التوصيل' : 'Delivery Fee'}</span>
                <span>
                  {shippingFee === 0 ? (
                    <span className="free-shipping">{isAr ? `موكب مبرّد مجاني (للطلبات +${freeThreshold} ج.م)` : `Free Climate-Controlled (+${freeThreshold} EGP)`}</span>
                  ) : (
                    `${shippingFee} ${currencySymbol}`
                  )}
                </span>
              </div>

              <div className="summary-total-row">
                <span>{isAr ? 'إجمالي القيمة الفاخرة' : 'Total'}</span>
                <span className="total-num">
                  {finalPayable} <small>{currencySymbol}</small>
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="summary-buttons">
              <button
                onClick={() => navigate('/checkout', { state: { discountAmount, appliedPromo } })}
                className="btn-checkout-flow"
              >
                <CreditCard size={18} />
                <span>{isAr ? 'المتابعة لإتمام الإهداء الملكي' : 'Proceed to Royal Checkout'}</span>
                <ArrowIcon size={16} />
              </button>

              <button onClick={handleWhatsAppCartOrder} className="btn-whatsapp-cart">
                <MessageCircle size={20} />
                <span>{isAr ? 'اعتماد موكب الحقيبة عبر واتساب' : 'Order via WhatsApp'}</span>
              </button>
            </div>

            <div className="summary-perks">
              <div className="perk-line">
                <ShieldCheck size={16} color="#D4A853" />
                <span>{isAr ? 'سداد موثوق وتأكيد فوري من مستشار التنسيق الملكي' : 'Secure and verified royal coordination'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
