import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { CURRENCY, STORE_INFO } from '../../config/constants.js';
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
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, totalPrice, totalItems } = useCart();
  const { showSuccess, showError } = useNotification();

  const isAr = i18n.language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const currencySymbol = isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en;

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
  const shippingFee = totalPrice >= 300 ? 0 : 25;
  const finalPayable = Math.max(0, totalPrice - discountAmount + shippingFee);

  const handleWhatsAppCartOrder = () => {
    let message = isAr
      ? `مرحباً، أود إرسال طلب جديد من سلة متجر الورد للورد 🌹:\n\n`
      : `Hello, I'd like to place an order from my Al-Ward shopping cart 🌹:\n\n`;

    items.forEach((item, idx) => {
      const name = isAr ? item.name_ar : item.name_en;
      message += `${idx + 1}. ${name} (${item.quantity}x) - ${item.price * item.quantity} ${currencySymbol}\n`;
      if (item.selectedSize) {
        message += `   • الحجم: ${item.selectedSize}\n`;
      }
      if (item.giftNote) {
        message += `   • الإهداء: "${item.giftNote}"\n`;
      }
      if (item.includeQR) {
        message += `   • باركود تفاعلي: نعم\n`;
      }
    });

    message += `\nالمجموع الفرعي: ${totalPrice} ${currencySymbol}\n`;
    if (discountAmount > 0) {
      message += `الخصم: -${discountAmount} ${currencySymbol} (كود: ${appliedPromo})\n`;
    }
    message += `التوصيل: ${shippingFee === 0 ? (isAr ? 'مجاني' : 'Free') : `${shippingFee} ${currencySymbol}`}\n`;
    message += `المجموع النهائي: ${finalPayable} ${currencySymbol}\n\n`;
    message += `أرجو تأكيد الطلب وتحديد موعد التوصيل، شكراً لكم!`;

    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty-page container-wide">
        <div className="empty-cart-card glass">
          <div className="empty-cart-icon">🛒</div>
          <h2>{isAr ? 'سلتك فارغة حالياً' : 'Your Shopping Cart is Empty'}</h2>
          <p>
            {isAr
              ? 'لم تقم بإضافة أي بوكيه بعد. استكشف تشكيلاتنا الفاخرة واختر ما يعبر عن مشاعرك.'
              : 'You have not added any bouquets yet. Explore our luxury collections today.'}
          </p>
          <Link to="/shop" className="btn-explore-shop">
            <ShoppingBag size={18} />
            <span>{isAr ? 'تصفح المتجر الآن' : 'Explore Bouquets'}</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page container-wide">
      <div className="cart-header">
        <h1 className="cart-title">
          {isAr ? 'سلة المشتريات' : 'Shopping Cart'}
        </h1>
        <span className="cart-items-count">
          ({totalItems} {isAr ? 'عناصر' : 'items'})
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
              <span>{isAr ? 'متابعة التسوق' : 'Continue Shopping'}</span>
            </Link>
            <button onClick={clearCart} className="btn-clear-cart">
              <Trash2 size={16} />
              <span>{isAr ? 'إفراغ السلة' : 'Clear Cart'}</span>
            </button>
          </div>
        </div>

        {/* Order Summary & Checkout */}
        <div className="cart-summary-col">
          <div className="cart-summary-card glass">
            <h2 className="summary-title">{isAr ? 'ملخص الطلب' : 'Order Summary'}</h2>

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
                    <span className="free-shipping">{isAr ? 'مجاني (للطلبات +300 ج.م)' : 'Free (+300 EGP)'}</span>
                  ) : (
                    `${shippingFee} ${currencySymbol}`
                  )}
                </span>
              </div>

              <div className="summary-total-row">
                <span>{isAr ? 'المجموع النهائي' : 'Total'}</span>
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
                <span>{isAr ? 'متابعة الدفع والتوصيل' : 'Proceed to Checkout'}</span>
                <ArrowIcon size={16} />
              </button>

              <button onClick={handleWhatsAppCartOrder} className="btn-whatsapp-cart">
                <MessageCircle size={20} />
                <span>{isAr ? 'طلب كامل السلة عبر واتساب' : 'Order via WhatsApp'}</span>
              </button>
            </div>

            <div className="summary-perks">
              <div className="perk-line">
                <ShieldCheck size={16} color="#D4A853" />
                <span>{isAr ? 'دفع آمن وتأكيد فوري من المنسق' : 'Secure and verified coordination'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
