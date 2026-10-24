import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../../context/CartContext.jsx';
import { useNotification } from '../../../context/NotificationContext.jsx';
import { useQuickCheckout } from '../../../context/QuickCheckoutContext.jsx';
import TiltCard from '../../common/TiltCard/TiltCard.jsx';
import { ShoppingBag, Star, MessageCircle, Eye, Zap, Clock } from 'lucide-react';
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
  const [countdownText, setCountdownText] = useState('');

  const isAr = i18n.language === 'ar';
  const name = isAr ? product.name_ar : product.name_en;
  const desc = isAr ? product.description_ar : product.description_en;
  const currencySymbol = isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en;

  // 1. Detect Real-Time Active Offer
  const [activeOffer, setActiveOffer] = useState(() => {
    try {
      const saved = localStorage.getItem('al_ward_offers');
      if (saved) {
        const list = JSON.parse(saved);
        const found = list.find(
          (o) => o.productId === product.id && o.isActive && new Date(o.expiresAt).getTime() > Date.now()
        );
        if (found) return found;
      }
    } catch {}
    return null;
  });

  // 2. Detect Live Stock Quantity
  const [stockQty, setStockQty] = useState(() => {
    try {
      const saved = localStorage.getItem('al_ward_products_stock');
      if (saved) {
        const map = JSON.parse(saved);
        if (map && typeof map === 'object') {
          if (Array.isArray(map)) {
            const found = map.find((item) => String(item.productId || item.id) === String(product.id));
            if (found && found.quantity !== undefined) return Number(found.quantity);
          } else if (map[product.id] !== undefined) {
            return Number(map[product.id]);
          }
        }
      }
    } catch {}
    return product.stock_quantity ?? 10;
  });

  // Live stock sync across tabs and inventory events
  useEffect(() => {
    const handleStockSync = () => {
      try {
        const saved = localStorage.getItem('al_ward_products_stock');
        if (saved) {
          const map = JSON.parse(saved);
          if (map && typeof map === 'object') {
            if (Array.isArray(map)) {
              const found = map.find((item) => String(item.productId || item.id) === String(product.id));
              if (found && found.quantity !== undefined) {
                setStockQty(Number(found.quantity));
                return;
              }
            } else if (map[product.id] !== undefined) {
              setStockQty(Number(map[product.id]));
              return;
            }
          }
        }
      } catch {}
    };

    window.addEventListener('storage', handleStockSync);
    window.addEventListener('al_ward_raw_inventory_updated', handleStockSync);
    window.addEventListener('al_ward_products_updated', handleStockSync);
    return () => {
      window.removeEventListener('storage', handleStockSync);
      window.removeEventListener('al_ward_raw_inventory_updated', handleStockSync);
      window.removeEventListener('al_ward_products_updated', handleStockSync);
    };
  }, [product.id]);

  // Live Countdown Timer
  useEffect(() => {
    if (!activeOffer) return;

    const updateTimer = () => {
      const diff = new Date(activeOffer.expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setCountdownText('');
        setActiveOffer(null);
        return;
      }

      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      const pad = (n) => String(n).padStart(2, '0');
      setCountdownText(`${pad(h)}:${pad(m)}:${pad(s)}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeOffer]);

  const currentPrice = activeOffer ? activeOffer.salePrice : (product.sale_price || product.price);
  const hasDiscount = Boolean(activeOffer || (product.sale_price && product.sale_price < product.price));
  const isOutOfStock = stockQty === 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    const productToAdd = {
      ...product,
      price: currentPrice,
      sale_price: hasDiscount ? currentPrice : null,
    };

    addItem(productToAdd, 1);
    confetti({
      particleCount: 45,
      spread: 55,
      origin: { y: 0.7 },
      colors: ['#D4A853', '#E8C87A', '#C4546D', '#FFFFFF'],
    });
    showSuccess(
      isAr ? `تمت إضافة "${name}" إلى حقيبة الهدايا الملكية 🌹` : `Added "${name}" to your gift bag 🌹`
    );
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView({
        ...product,
        price: currentPrice,
        sale_price: hasDiscount ? currentPrice : null,
      });
    }
  };

  const handleWhatsAppQuickOrder = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    openQuickCheckout({
      ...product,
      price: currentPrice,
      sale_price: hasDiscount ? currentPrice : null,
    });
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

        {/* Live Countdown Badge for Active Deals */}
        {activeOffer && countdownText && (
          <span className="card-badge countdown-live-badge">
            <Clock size={12} />
            <span>{countdownText} ⏳</span>
          </span>
        )}

        {/* Promo Badge */}
        {activeOffer ? (
          <span className="card-badge discount-badge">
            {isAr ? activeOffer.badgeText_ar : activeOffer.badgeText_en}
          </span>
        ) : hasDiscount ? (
          <span className="card-badge discount-badge">
            {isAr ? 'عرض ملكي خاص' : 'Special Offer'}
          </span>
        ) : product.is_featured ? (
          <span className="card-badge featured-badge">
            {isAr ? 'تحفة حصرية ✦' : 'Signature ✦'}
          </span>
        ) : null}
      </div>

      <div className="card-content">
        <div className="card-meta">
          <div className="card-rating">
            <Star size={14} className="star-icon" fill="currentColor" />
            <span>{product.rating || 4.9}</span>
            <span className="reviews-count">({product.reviews_count || 12})</span>
          </div>

          {/* Dynamic Real-time Stock Health Indicator */}
          {isOutOfStock ? (
            <span className="stock-status out-of-stock">
              <span className="pulse-dot-red" />
              <span>{isAr ? 'نفد من القطف مؤقتاً' : 'Out of Stock'}</span>
            </span>
          ) : stockQty <= 3 ? (
            <span className="stock-status low-stock">
              <span className="pulse-dot-amber" />
              <span>{isAr ? `متبقي ${stockQty} باقات فقط ⚠️` : `Only ${stockQty} Left ⚠️`}</span>
            </span>
          ) : (
            <span className="stock-status in-stock">
              <span className="pulse-dot" />
              <span>{isAr ? 'قطف صباحي وتجهيز فوري' : 'Fresh Morning Harvest'}</span>
            </span>
          )}
        </div>

        <h3 className="product-title">
          <Link to={`/product/${product.id}`}>{name}</Link>
        </h3>

        {/* Sensory Luxury Pills Row */}
        <div className="card-sensory-row">
          {product.components_ar && product.components_ar.length > 0 && (
            <span className="sensory-pill scent" title={isAr ? 'المكون الزهري الرئيسي' : 'Primary Botanical Component'}>
              <span>🌸</span>
              <span>{isAr ? product.components_ar[0] : (product.components_en?.[0] || 'Rare Peonies')}</span>
            </span>
          )}
          <span className="sensory-pill" title={isAr ? 'مستوى الصياغة' : 'Craftsmanship'}>
            <span>✦</span>
            <span>{isAr ? 'صياغة يدوية خاصة' : 'Bespoke Atelier'}</span>
          </span>
        </div>

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
              disabled={isOutOfStock}
              className={`action-btn wa-btn ${isOutOfStock ? 'disabled' : ''}`}
              title={isOutOfStock ? (isAr ? 'المنتج غير متوفر حالياً' : 'Out of stock') : (isAr ? 'موكب طلب فوري عبر واتساب ⚡' : '1-Click Quick WhatsApp Order ⚡')}
              aria-label="1-Click WhatsApp Quick Order"
            >
              <Zap size={14} className="wa-zap-icon" />
              <MessageCircle size={17} />
            </button>
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`action-btn cart-add-btn ${isOutOfStock ? 'disabled' : ''}`}
              title={isOutOfStock ? (isAr ? 'نفد من القطف' : 'Out of stock') : (isAr ? 'إضافة إلى حقيبة الهدايا' : 'Add to Gift Bag')}
              aria-label="Add to cart"
            >
              <ShoppingBag size={18} />
              <span className="btn-text">{isOutOfStock ? (isAr ? 'نفد' : 'Sold Out') : (isAr ? 'اقتناء' : 'Acquire')}</span>
            </button>
          </div>
        </div>
      </div>
      </div>
    </TiltCard>
  );
}
