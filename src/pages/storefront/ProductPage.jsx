import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { useQuickCheckout } from '../../context/QuickCheckoutContext.jsx';
import { MOCK_PRODUCTS, CURRENCY, STORE_INFO } from '../../config/constants.js';
import ProductCard from '../../components/storefront/ProductCard/ProductCard.jsx';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import {
  ShoppingBag,
  MessageCircle,
  Star,
  ShieldCheck,
  Truck,
  Heart,
  Share2,
  Check,
  QrCode,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Info,
} from 'lucide-react';
import './ProductPage.css';

export default function ProductPage() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const { openQuickCheckout } = useQuickCheckout();
  const { addItem } = useCart();
  const { showSuccess, showInfo } = useNotification();

  const isAr = i18n.language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  const product = useMemo(() => {
    return MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0];
  }, [id]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('medium'); // small, medium, large
  const [quantity, setQuantity] = useState(1);
  const [giftNote, setGiftNote] = useState('');
  const [includeQR, setIncludeQR] = useState(false);
  const [qrMessage, setQrMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const name = isAr ? product.name_ar : product.name_en;
  const desc = isAr ? product.description_ar : product.description_en;
  const currencySymbol = isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en;
  const componentsList = isAr ? product.components_ar : product.components_en;

  // Size price modifier (EGP adjusted)
  const sizePriceAdjustment = selectedSize === 'small' ? -50 : selectedSize === 'large' ? 100 : 0;
  const basePrice = product.sale_price || product.price;
  const finalUnitPrice = Math.max(10, basePrice + sizePriceAdjustment);
  const totalPrice = finalUnitPrice * quantity;

  const handleAddToCart = () => {
    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D4A853', '#F3E5AB', '#ffffff', '#25D366'],
      });
    } catch {
      // safe fallback
    }

    const itemWithOptions = {
      ...product,
      price: finalUnitPrice,
      selectedSize,
      giftNote: giftNote.trim(),
      includeQR,
      qrMessage: includeQR ? qrMessage : '',
    };
    addItem(itemWithOptions, quantity);
    showSuccess(
      isAr
        ? `تمت إضافة (${name}) إلى سلتك بنجاح! 🌹`
        : `Added (${name}) to your cart! 🌹`
    );
  };

  const handleWhatsAppOrder = () => {
    openQuickCheckout({
      ...product,
      price: totalPrice,
      selectedSize,
      giftNote,
      includeQR,
      qrMessage,
    });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      showInfo(isAr ? 'تم نسخ رابط البوكيه إلى الحافظة' : 'Bouquet link copied to clipboard');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const relatedProducts = useMemo(() => {
    return MOCK_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);
  }, [product.id]);

  const images = product.images && product.images.length > 0 ? product.images : ['/images/bouquet-save-the-date.jpg'];
  const activeImage = images[activeImageIndex] || images[0];

  return (
    <div className="product-page container-wide">
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">{isAr ? 'الرئيسية' : 'Home'}</Link>
        <span className="separator">/</span>
        <Link to="/shop">{isAr ? 'المتجر' : 'Shop'}</Link>
        <span className="separator">/</span>
        <span className="current">{name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="product-grid-main">
        {/* Gallery */}
        <div className="product-gallery">
          <div className="main-image-wrap glass">
            <img src={activeImage} alt={name} className="gallery-main-img" />
            <button onClick={handleShare} className="share-btn glass" title={isAr ? 'مشاركة' : 'Share'}>
              {copiedLink ? <Check size={18} color="#34D399" /> : <Share2 size={18} />}
            </button>
          </div>

          {images.length > 1 && (
            <div className="gallery-thumbs">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`thumb-btn ${idx === activeImageIndex ? 'active' : ''}`}
                >
                  <img src={img} alt={`thumb-${idx}`} />
                </button>
              ))}
            </div>
          )}

          {/* QR Code Feature Box */}
          <div className="qr-preview-box glass">
            <div className="qr-header">
              <QrCode size={20} className="qr-icon" />
              <div>
                <h4>{isAr ? 'خدمة الباركود التفاعلي' : 'Interactive QR Dedication'}</h4>
                <p>{isAr ? 'إهداء فيديو أو تسجيل صوتي يفتح بمسح الباركود المرفق مع البوكيه' : 'Attach video or audio message via printed QR tag'}</p>
              </div>
            </div>

            <label className="qr-checkbox-label">
              <input
                type="checkbox"
                checked={includeQR}
                onChange={(e) => setIncludeQR(e.target.checked)}
              />
              <span>{isAr ? 'نعم، أضف باركود إهداء خاص للبوكيه (+مجاناً)' : 'Yes, include a custom QR gift tag (+Free)'}</span>
            </label>

            {includeQR && (
              <div className="qr-input-zone animate-fade-in">
                <input
                  type="text"
                  value={qrMessage}
                  onChange={(e) => setQrMessage(e.target.value)}
                  placeholder={isAr ? 'ضع رابط فيديو YouTube / صوت / رسالة خاصة هنا' : 'Paste YouTube link, voice URL or sweet message'}
                  className="qr-input"
                />
                <div className="qr-display">
                  <QRCodeSVG
                    value={qrMessage.trim() || window.location.href}
                    size={80}
                    bgColor="#0A0A0A"
                    fgColor="#D4A853"
                    level="M"
                  />
                  <small>{isAr ? 'معاينة الباركود المطبوع على بطاقة الورد' : 'Preview of printed gift tag QR'}</small>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info & Options */}
        <div className="product-info-col">
          <div className="info-badge">
            <Sparkles size={14} />
            <span>{isAr ? 'تنسيق يدوي حسب الطلب' : 'Handcrafted Made-to-Order'}</span>
          </div>

          <h1 className="product-main-title">{name}</h1>

          <div className="product-rating-row">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={16}
                  fill={i < Math.floor(product.rating || 5) ? '#D4A853' : 'transparent'}
                  color="#D4A853"
                />
              ))}
            </div>
            <span className="rating-value">{product.rating || 4.9}</span>
            <span className="reviews-num">({product.reviews_count || 24} {isAr ? 'تقييم موثق' : 'reviews'})</span>
          </div>

          {/* Pricing */}
          <div className="product-price-block">
            <div className="price-tag">
              <span className="price-number">{finalUnitPrice}</span>
              <span className="price-curr">{currencySymbol}</span>
            </div>
            {product.sale_price && (
              <span className="price-original">
                {product.price + sizePriceAdjustment} {currencySymbol}
              </span>
            )}
            <span className="vat-notice">{isAr ? 'شامل ضريبة القيمة المضافة' : 'VAT Included'}</span>
          </div>

          <p className="product-description">{desc}</p>

          {/* Components / Flowers inside */}
          {componentsList && componentsList.length > 0 && (
            <div className="components-section">
              <h4>{isAr ? 'محتويات وتفاصيل البوكيه:' : 'Bouquet Ingredients:'}</h4>
              <div className="components-tags">
                {componentsList.map((comp, idx) => (
                  <span key={idx} className="comp-tag glass">
                    🌸 {comp}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          <div className="option-group">
            <label className="option-label">{isAr ? 'اختر حجم البوكيه:' : 'Select Size:'}</label>
            <div className="size-selector">
              {[
                { id: 'small', label_ar: 'صغير (بسيط وناعم)', label_en: 'Small (Delicate)', delta: '-50' },
                { id: 'medium', label_ar: 'متوسط (كلاسيك مميز)', label_en: 'Medium (Standard)', delta: '0' },
                { id: 'large', label_ar: 'كبير (ملكي فاخر)', label_en: 'Large (Royal Luxury)', delta: '+100' },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedSize(s.id)}
                  className={`size-btn ${selectedSize === s.id ? 'active' : ''}`}
                >
                  <span className="size-title">{isAr ? s.label_ar : s.label_en}</span>
                  {s.delta !== '0' && (
                    <span className="size-delta">
                      {s.delta} {currencySymbol}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Gift Note */}
          <div className="option-group">
            <label className="option-label">
              {isAr ? 'نص بطاقة الإهداء (اختياري):' : 'Gift Card Message (Optional):'}
            </label>
            <textarea
              value={giftNote}
              onChange={(e) => setGiftNote(e.target.value)}
              placeholder={
                isAr
                  ? 'اكتب هنا كلماتك الطيبة التي ستُطبع على كرت أنيق يرافق البوكيه...'
                  : 'Write your warm words to be printed on a luxury gift card...'
              }
              rows={3}
              className="gift-note-textarea"
            />
          </div>

          {/* Quantity & Action Buttons */}
          <div className="purchase-controls">
            <div className="quantity-counter glass">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="qty-btn"
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="qty-number">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="qty-btn"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <button onClick={handleAddToCart} className="btn-add-cart">
              <ShoppingBag size={20} />
              <span>{isAr ? `إضافة للسلة • ${totalPrice} ${currencySymbol}` : `Add to Cart • ${totalPrice} ${currencySymbol}`}</span>
            </button>
          </div>

          {/* WhatsApp Direct Order Button */}
          <button onClick={handleWhatsAppOrder} className="btn-whatsapp-direct">
            <MessageCircle size={22} />
            <span>{isAr ? 'طلب وتأكيد فوري عبر واتساب' : 'Instant WhatsApp Order'}</span>
          </button>

          {/* Guarantees */}
          <div className="product-perks glass">
            <div className="perk">
              <ShieldCheck size={20} className="perk-icon" />
              <span>{isAr ? 'ضمان نضارة الزهور لمدة 5 أيام على الأقل' : '5-Day Freshness Guarantee'}</span>
            </div>
            <div className="perk">
              <Truck size={20} className="perk-icon" />
              <span>{isAr ? 'توصيل مبرد وسريع بنفس اليوم في القاهرة والجيزة' : 'Express Temperature-Controlled Delivery in Cairo & Giza'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="related-section">
        <h2 className="related-title">
          {isAr ? 'قد يعجبك أيضاً' : 'You May Also Like'}
        </h2>
        <div className="related-grid">
          {relatedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
