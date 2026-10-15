import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../../context/CartContext.jsx';
import { useNotification } from '../../../context/NotificationContext.jsx';
import { useQuickCheckout } from '../../../context/QuickCheckoutContext.jsx';
import { X, ShoppingBag, MessageCircle, Star, Sparkles, Check, ArrowRight, ArrowLeft } from 'lucide-react';
import { CURRENCY } from '../../../config/constants.js';
import confetti from 'canvas-confetti';
import './QuickViewModal.css';

export default function QuickViewModal({ product, onClose }) {
  const { i18n } = useTranslation();
  const { addItem } = useCart();
  const { showSuccess } = useNotification();
  const { openQuickCheckout } = useQuickCheckout();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const isAr = i18n.language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const name = isAr ? product.name_ar : product.name_en;
  const desc = isAr ? product.description_ar : product.description_en;
  const currencySymbol = isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en;
  const components = isAr ? product.components_ar : product.components_en;
  const currentPrice = product.sale_price || product.price;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#D4A853', '#E8C87A', '#C4546D', '#FFFFFF'],
    });
    showSuccess(
      isAr ? `تمت إضافة (${quantity}) من "${name}" إلى السلة 🌹` : `Added ${quantity} of "${name}" to your cart 🌹`
    );
    setTimeout(() => setAdded(false), 2000);
  };

  const handleWhatsAppOrder = () => {
    onClose();
    openQuickCheckout({
      ...product,
      price: currentPrice * quantity,
    });
  };

  return (
    <div className="quick-view-overlay" onClick={onClose}>
      <div className="quick-view-card glass" onClick={(e) => e.stopPropagation()}>
        <button className="quick-view-close" onClick={onClose} aria-label="Close modal">
          <X size={20} />
        </button>

        <div className="quick-view-layout">
          {/* Image Column */}
          <div className="quick-view-image-col">
            <img
              src={product.images?.[0] || '/images/bouquet-save-the-date.jpg'}
              alt={name}
              className="quick-view-img"
            />
            <div className="quick-view-badge">
              <Sparkles size={13} />
              <span>{isAr ? 'صناعة يدوية فاخرة' : 'Handcrafted Luxury'}</span>
            </div>
          </div>

          {/* Details Column */}
          <div className="quick-view-details-col">
            <div className="qv-rating-row">
              <div className="qv-stars">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} fill="#D4A853" color="#D4A853" />
                ))}
              </div>
              <span className="qv-rating-text">{product.rating || 5.0}</span>
              <span className="qv-reviews">({product.reviews_count || 30} {isAr ? 'تقييم موثق' : 'reviews'})</span>
            </div>

            <h2 className="qv-title">{name}</h2>

            <div className="qv-price-row">
              <span className="qv-current-price">
                {currentPrice} <small>{currencySymbol}</small>
              </span>
              {product.sale_price && (
                <span className="qv-old-price">
                  {product.price} {currencySymbol}
                </span>
              )}
              <span className="qv-tax-tag">{isAr ? 'شامل كافة الرسوم' : 'All-inclusive'}</span>
            </div>

            <p className="qv-desc">{desc}</p>

            {/* Components Tags */}
            {components && components.length > 0 && (
              <div className="qv-components">
                <span className="qv-comp-title">{isAr ? 'مكونات البوكيه:' : 'Bouquet Stems:'}</span>
                <div className="qv-comp-tags">
                  {components.map((comp, idx) => (
                    <span key={idx} className="qv-tag">
                      <span className="tag-dot" /> {comp}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="qv-qty-row">
              <span className="qty-label">{isAr ? 'الكمية المطلوبة:' : 'Quantity:'}</span>
              <div className="qty-controls">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="qty-btn"
                >
                  -
                </button>
                <span className="qty-value">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="qty-btn"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="qv-actions-grid">
              <button
                onClick={handleAddToCart}
                className={`qv-cart-btn ${added ? 'added' : ''}`}
              >
                {added ? (
                  <>
                    <Check size={18} />
                    <span>{isAr ? 'تمت الإضافة بنجاح!' : 'Added to Cart!'}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>{isAr ? 'إضافة إلى السلة' : 'Add to Cart'}</span>
                  </>
                )}
              </button>

              <button onClick={handleWhatsAppOrder} className="qv-wa-btn">
                <MessageCircle size={18} />
                <span>{isAr ? 'طلب عبر واتساب' : 'WhatsApp Order'}</span>
              </button>
            </div>

            <div className="qv-footer-link">
              <Link to={`/product/${product.id}`} onClick={onClose} className="qv-full-link">
                <span>{isAr ? 'الانتقال لصفحة البوكيه الكاملة' : 'View Full Bouquet Page'}</span>
                <ArrowIcon size={15} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
