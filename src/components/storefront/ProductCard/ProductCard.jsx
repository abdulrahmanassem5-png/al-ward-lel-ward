import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../../context/CartContext.jsx';
import { useNotification } from '../../../context/NotificationContext.jsx';
import { useQuickCheckout } from '../../../context/QuickCheckoutContext.jsx';
import TiltCard from '../../common/TiltCard/TiltCard.jsx';
import { ShoppingBag, Star, MessageCircle, Eye, Zap } from 'lucide-react';
import { CURRENCY } from '../../../config/constants.js';
import confetti from 'canvas-confetti';
import './ProductCard.css';

export default function ProductCard({ product, onQuickView }) {
  const { i18n } = useTranslation();
  const { addItem } = useCart();
  const { showSuccess } = useNotification();
  const { openQuickCheckout } = useQuickCheckout();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const isAr = i18n.language === 'ar';
  const name = isAr ? product.name_ar : product.name_en;
  const desc = isAr ? product.description_ar : product.description_en;
  const currencySymbol = isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en;

  const currentPrice = product.sale_price || product.price;
  const hasDiscount = Boolean(product.sale_price && product.sale_price < product.price);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    confetti({
      particleCount: 45,
      spread: 55,
      origin: { y: 0.7 },
      colors: ['#D4A853', '#E8C87A', '#C4546D', '#FFFFFF'],
    });
    showSuccess(
      isAr ? `تمت إضافة "${name}" إلى السلة بنجاح 🌹` : `Added "${name}" to your cart 🌹`
    );
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  const handleWhatsAppQuickOrder = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickCheckout(product);
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80';
  const displayImage = imageError ? fallbackImage : (product.images?.[0] || fallbackImage);

  return (
    <TiltCard className="product-tilt-wrapper">
      <div className="product-card glass">
      <div className="card-image-wrap">
        <Link to={`/product/${product.id}`} className="card-image-link">
          <img
            src={displayImage}
            alt={name}
            className={`product-thumb ${imageLoaded ? 'loaded' : ''}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
            loading="lazy"
          />
          <div className="card-image-overlay">
            <button
              type="button"
              onClick={handleQuickViewClick}
              className="quick-view-overlay-btn"
              title={isAr ? 'معاينة سريعة' : 'Quick View'}
            >
              <Eye size={15} />
              <span>{isAr ? 'معاينة سريعة' : 'Quick View'}</span>
            </button>
          </div>
        </Link>

        {hasDiscount && (
          <span className="card-badge discount-badge">
            {isAr ? 'خصم خاص' : 'Special Offer'}
          </span>
        )}

        {product.is_featured && !hasDiscount && (
          <span className="card-badge featured-badge">
            {isAr ? 'فاخر ✦' : 'Featured ✦'}
          </span>
        )}
      </div>

      <div className="card-content">
        <div className="card-meta">
          <div className="card-rating">
            <Star size={14} className="star-icon" fill="currentColor" />
            <span>{product.rating || 4.9}</span>
            <span className="reviews-count">({product.reviews_count || 12})</span>
          </div>
          <span className="stock-status in-stock">
            <span className="pulse-dot" />
            <span>{isAr ? 'متوفر للتوصيل اليوم' : 'Available Today'}</span>
          </span>
        </div>

        <h3 className="product-title">
          <Link to={`/product/${product.id}`}>{name}</Link>
        </h3>

        <p className="product-snippet">{desc}</p>

        <div className="card-footer">
          <div className="product-pricing">
            <span className="current-price">
              {currentPrice} <small>{currencySymbol}</small>
            </span>
            {hasDiscount && (
              <span className="old-price">
                {product.price} {currencySymbol}
              </span>
            )}
          </div>

          <div className="card-actions">
            <button
              onClick={handleWhatsAppQuickOrder}
              className="action-btn wa-btn"
              title={isAr ? 'طلب سريع بنقرة واحدة عبر واتساب ⚡' : '1-Click Quick WhatsApp Order ⚡'}
              aria-label="1-Click WhatsApp Quick Order"
            >
              <Zap size={14} className="wa-zap-icon" />
              <MessageCircle size={17} />
            </button>
            <button
              onClick={handleAddToCart}
              className="action-btn cart-add-btn"
              title={isAr ? 'إضافة إلى السلة' : 'Add to Cart'}
              aria-label="Add to cart"
            >
              <ShoppingBag size={18} />
              <span className="btn-text">{isAr ? 'أضف' : 'Add'}</span>
            </button>
          </div>
        </div>
      </div>
      </div>
    </TiltCard>
  );
}
