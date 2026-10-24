import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { useQuickCheckout } from '../../context/QuickCheckoutContext.jsx';
import { MOCK_PRODUCTS, CURRENCY } from '../../config/constants.js';
import {
  getStoredProductById,
  getStoredProducts,
  parseVideoUrl,
} from '../../utils/productStorageManager.js';
import ProductCard from '../../components/storefront/ProductCard/ProductCard.jsx';
import SEO from '../../components/SEO.tsx';
import { QRCodeSVG } from 'qrcode.react';
import confetti from 'canvas-confetti';
import {
  ShoppingBag,
  MessageCircle,
  Star,
  ShieldCheck,
  Truck,
  Share2,
  Check,
  QrCode,
  Sparkles,
  Clock,
  Zap,
  Film,
  Play,
  Image as ImageIcon,
} from 'lucide-react';
import './ProductPage.css';

export default function ProductPage() {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const { openQuickCheckout } = useQuickCheckout();
  const { addItem } = useCart();
  const { showSuccess, showInfo } = useNotification();

  const isAr = i18n.language === 'ar';

  const [product, setProduct] = useState(() => {
    return (
      getStoredProductById(id) ||
      MOCK_PRODUCTS.find((p) => String(p.id) === String(id)) ||
      MOCK_PRODUCTS[0]
    );
  });
  const [allProducts, setAllProducts] = useState(() => getStoredProducts());

  // Live listener to any updates made from dashboard or other tabs
  useEffect(() => {
    const handleSync = () => {
      setProduct(
        getStoredProductById(id) ||
        MOCK_PRODUCTS.find((p) => String(p.id) === String(id)) ||
        MOCK_PRODUCTS[0]
      );
      setAllProducts(getStoredProducts());
    };
    handleSync();
    window.addEventListener('al_ward_products_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('al_ward_products_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [id]);

  const [activeMediaMode, setActiveMediaMode] = useState('image'); // 'image' | 'video'
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('medium'); // small, medium, large
  const [quantity, setQuantity] = useState(1);
  const [giftNote, setGiftNote] = useState('');
  const [includeQR, setIncludeQR] = useState(false);
  const [qrMessage, setQrMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  const parsedVideo = useMemo(() => {
    return product.video_url ? parseVideoUrl(product.video_url) : null;
  }, [product.video_url]);

  // Active Offer & Stock Live Sync
  const [activeOffer, setActiveOffer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [stockInfo, setStockInfo] = useState({ stock: 15, status: 'good' });

  useEffect(() => {
    const updateOfferAndStock = () => {
      // 1. Check Offers
      try {
        const storedOffers = localStorage.getItem('al_ward_offers');
        if (storedOffers) {
          const offers = JSON.parse(storedOffers);
          if (Array.isArray(offers)) {
            const currentOffer = offers.find(
              (o) => String(o.productId) === String(product.id) && (o.isActive === true || o.status === 'active')
            );
            if (currentOffer) {
              const expiryDate = currentOffer.expiresAt || currentOffer.endDate;
              const end = expiryDate ? new Date(expiryDate).getTime() : 0;
              const now = Date.now();
              const diff = end - now;

              if (diff > 0) {
                const hours = Math.floor(diff / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                const pad = (n) => String(n).padStart(2, '0');
                setTimeLeft(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
                setActiveOffer(currentOffer);
              } else {
                setActiveOffer(null);
                setTimeLeft(null);
              }
            } else {
              setActiveOffer(null);
              setTimeLeft(null);
            }
          }
        }
      } catch (err) {
        console.error('Error reading offers:', err);
      }

      // 2. Check Stock (Safely handles both Object Map { [id]: qty } and Array of items)
      try {
        const storedStock = localStorage.getItem('al_ward_products_stock');
        if (storedStock) {
          const parsedStock = JSON.parse(storedStock);
          let qty = product.stock_quantity ?? 12;

          if (Array.isArray(parsedStock)) {
            const found = parsedStock.find((item) => String(item.id) === String(product.id));
            if (found) qty = found.stock ?? found.quantity ?? qty;
          } else if (parsedStock && typeof parsedStock === 'object') {
            if (parsedStock[product.id] !== undefined) {
              qty = Number(parsedStock[product.id]);
            }
          }

          setStockInfo({
            stock: qty,
            status: qty <= 0 ? 'out' : qty <= 3 ? 'low' : 'good',
          });
        }
      } catch (err) {
        console.error('Error reading stock:', err);
      }
    };

    updateOfferAndStock();
    const interval = setInterval(updateOfferAndStock, 1000);
    return () => clearInterval(interval);
  }, [product.id, product.stock_quantity]);

  const name = isAr ? product.name_ar : product.name_en;
  const desc = isAr ? product.description_ar : product.description_en;
  const currencySymbol = isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en;
  const componentsList = isAr ? product.components_ar : product.components_en;

  // Size price modifier (EGP adjusted)
  const sizePriceAdjustment = selectedSize === 'small' ? -50 : selectedSize === 'large' ? 100 : 0;
  const effectiveBasePrice = activeOffer ? activeOffer.salePrice : (product.sale_price || product.price);
  const originalDisplayPrice = product.price + sizePriceAdjustment;
  const finalUnitPrice = Math.max(10, effectiveBasePrice + sizePriceAdjustment);
  const totalPrice = finalUnitPrice * quantity;

  const isOutOfStock = stockInfo.stock === 0;

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
        ? `تمت إضافة (${name}) إلى حقيبة الهدايا الملكية بنجاح! 🌹`
        : `Added (${name}) to your gift bag! 🌹`
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
      showInfo(isAr ? 'تم نسخ رابط التحفة النباتية إلى الحافظة' : 'Bouquet link copied to clipboard');
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const relatedProducts = allProducts.filter((p) => String(p.id) !== String(product.id)).slice(0, 3);

  const images = product.images && product.images.length > 0 ? product.images : ['/images/bouquet-save-the-date.jpg'];
  const activeImage = images[activeImageIndex] || images[0];

  return (
    <div className="product-page container-wide">
      <SEO
        title={name}
        description={desc}
        canonicalUrl={`https://el-ward-ll-ward-store.vercel.app/product/${product.id}`}
        ogImage={product.image?.startsWith('http') ? product.image : `https://el-ward-ll-ward-store.vercel.app${product.image}`}
        ogType="product"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: name,
          image: product.image?.startsWith('http') ? product.image : `https://el-ward-ll-ward-store.vercel.app${product.image}`,
          description: desc,
          sku: `ALWARD-${product.id}`,
          offers: {
            '@type': 'Offer',
            price: product.price,
            priceCurrency: 'EGP',
            availability: product.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            url: `https://el-ward-ll-ward-store.vercel.app/product/${product.id}`,
          },
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.rating || 5,
            reviewCount: product.reviewsCount || 42,
          },
        }}
      />
      {/* Breadcrumb */}
      <nav className="breadcrumb">
        <Link to="/">{isAr ? 'الرئيسية' : 'Home'}</Link>
        <span className="separator">/</span>
        <Link to="/shop">{isAr ? 'المتجر الملكي' : 'Shop'}</Link>
        <span className="separator">/</span>
        <span className="current">{name}</span>
      </nav>

      {/* Main Product Showcase */}
      <div className="product-grid-main">
        {/* Gallery */}
        <div className="product-gallery">
          <div className="main-image-wrap glass">
            {activeMediaMode === 'video' && parsedVideo ? (
              <div className="gallery-video-player-frame animate-fade-in">
                {parsedVideo.type === 'youtube' || parsedVideo.type === 'vimeo' ? (
                  <iframe
                    src={parsedVideo.embedUrl}
                    title={name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="gallery-video-iframe"
                  />
                ) : (
                  <video
                    src={parsedVideo.embedUrl}
                    controls
                    autoPlay
                    className="gallery-video-element"
                  />
                )}
                <button
                  type="button"
                  onClick={() => setActiveMediaMode('image')}
                  className="btn-exit-video-mode"
                  title={isAr ? 'العودة لصور البوكيه' : 'Return to Photos'}
                >
                  <ImageIcon size={14} />
                  <span>{isAr ? 'عرض الصور 📷' : 'View Photos'}</span>
                </button>
              </div>
            ) : (
              <>
                <img src={activeImage} alt={name} className="gallery-main-img" />
                {parsedVideo && (
                  <button
                    type="button"
                    onClick={() => setActiveMediaMode('video')}
                    className="floating-watch-video-btn animate-fade-in"
                    title={isAr ? 'مشاهدة فيديو استعراض البوكيه' : 'Watch Bouquet Video'}
                  >
                    <Play size={16} className="play-icon-pulse" />
                    <span>{isAr ? 'مشاهدة فيديو البوكيه 🎬' : 'Watch Video 🎬'}</span>
                  </button>
                )}
              </>
            )}

            <button onClick={handleShare} className="share-btn glass" title={isAr ? 'مشاركة' : 'Share'}>
              {copiedLink ? <Check size={18} color="#34D399" /> : <Share2 size={18} />}
            </button>
          </div>

          {/* Thumbnails Row: All Photos + Video Button if present */}
          {(images.length > 1 || parsedVideo) && (
            <div className="gallery-thumbs">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setActiveImageIndex(idx);
                    setActiveMediaMode('image');
                  }}
                  className={`thumb-btn ${activeMediaMode === 'image' && idx === activeImageIndex ? 'active' : ''}`}
                >
                  <img src={img} alt={`thumb-${idx}`} />
                </button>
              ))}

              {parsedVideo && (
                <button
                  type="button"
                  onClick={() => setActiveMediaMode('video')}
                  className={`thumb-btn thumb-video-btn ${activeMediaMode === 'video' ? 'active' : ''}`}
                  title={isAr ? 'تشغيل فيديو البوكيه' : 'Play Video'}
                >
                  <div className="thumb-video-content">
                    <Film size={20} className="thumb-video-icon" />
                    <span className="thumb-video-text">{isAr ? 'فيديو 🎬' : 'Video'}</span>
                  </div>
                </button>
              )}
            </div>
          )}

          {/* QR Code Feature Box */}
          <div className="qr-preview-box glass">
            <div className="qr-header">
              <QrCode size={20} className="qr-icon" />
              <div>
                <h4>{isAr ? 'خدمة الباركود التفاعلي الصوتي والمرئي' : 'Interactive QR Dedication'}</h4>
                <p>{isAr ? 'إهداء فيديو أو تسجيل صوتي يفتح بمسح الباركود المطبوع على بطاقة الورد' : 'Attach video or audio message via printed QR tag'}</p>
              </div>
            </div>

            <label className="qr-checkbox-label">
              <input
                type="checkbox"
                checked={includeQR}
                onChange={(e) => setIncludeQR(e.target.checked)}
              />
              <span>{isAr ? 'نعم، أضف باركود إهداء خاص للبوكيه (إهداء مجاني من الدار)' : 'Yes, include a custom QR gift tag (+Free)'}</span>
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
            <span>{isAr ? 'صياغة يدوية ملكية حسب الطلب' : 'Handcrafted Made-to-Order'}</span>
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
            <span className="reviews-num">({product.reviews_count || 24} {isAr ? 'تقييم موثق من النخبة' : 'reviews'})</span>
          </div>

          {/* Active Promotional Offer Banner */}
          {activeOffer && timeLeft && (
            <div className="product-offer-banner royal-card-gold animate-fade-in">
              <div className="offer-banner-row">
                <span className="offer-pill-badge">
                  <Zap size={14} />
                  <span>{activeOffer.badgeText || (isAr ? `عرض ملكي حصري -${activeOffer.discountPercent}%` : `Exclusive Royal Offer -${activeOffer.discountPercent}%`)}</span>
                </span>
                <span className="offer-timer-pill">
                  <Clock size={14} />
                  <span>{isAr ? `ينتهي خلال: ${timeLeft}` : `Expires in: ${timeLeft}`}</span>
                </span>
              </div>
              <div className="offer-savings-text font-tajawal">
                {isAr
                  ? `وفّر ${product.price - activeOffer.salePrice} ${currencySymbol} عند تأكيد الاقتناء قبل انتهاء العد التنازلي ⏳`
                  : `Save ${product.price - activeOffer.salePrice} ${currencySymbol} when securing before the timer expires ⏳`}
              </div>
            </div>
          )}

          {/* Pricing */}
          <div className="product-price-block">
            <div className="price-tag">
              <span className="price-number">{finalUnitPrice}</span>
              <span className="price-curr">{currencySymbol}</span>
            </div>
            {(activeOffer || product.sale_price) && (
              <span className="price-original">
                {originalDisplayPrice} {currencySymbol}
              </span>
            )}
            {activeOffer && (
              <span className="product-discount-chip">
                -{activeOffer.discountPercent}%
              </span>
            )}
            <span className="vat-notice">{isAr ? 'شامل التغليف الملكي الفاخر' : 'Luxury Packaging Included'}</span>
          </div>

          {/* Stock Health Status */}
          <div className="product-stock-row font-tajawal">
            {stockInfo.stock === 0 ? (
              <div className="stock-pill-badge out">
                <span className="pulse-dot-red" />
                <span>{isAr ? '⚠️ نفد مخزون القطف لليوم مؤقتاً — تواصل معنا للحجز المسبق' : '⚠️ Sold out for today — Contact us for advance reservation'}</span>
              </div>
            ) : stockInfo.stock <= 3 ? (
              <div className="stock-pill-badge low">
                <span className="pulse-dot-amber" />
                <span>{isAr ? `⚡ متبقي ${stockInfo.stock} باقات فقط من قطاف اليوم في دار الورد!` : `⚡ Only ${stockInfo.stock} bouquets remaining from today's harvest!`}</span>
              </div>
            ) : (
              <div className="stock-pill-badge good">
                <span className="pulse-dot" />
                <span>{isAr ? `✓ متوفر في مشتل اليوم (${stockInfo.stock} باقة جاهزة للتنسيق الفوري)` : `✓ In Stock (${stockInfo.stock} ready for prompt handcrafted delivery)`}</span>
              </div>
            )}
          </div>

          <p className="product-description">{desc}</p>

          {/* Components / Flowers inside */}
          {componentsList && componentsList.length > 0 && (
            <div className="components-section">
              <h4>{isAr ? 'مكونات الزهور الطبيعية النادرة:' : 'Bouquet Ingredients:'}</h4>
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
            <label className="option-label">{isAr ? 'فئة الحجم والكثافة:' : 'Select Size:'}</label>
            <div className="size-selector">
              {[
                { id: 'small', label_ar: 'الباقة الناعمة (Petite Charm) — لمسة رقيقة وأنيقة', label_en: 'Petite Charm — Subtle Elegance', delta: '-50' },
                { id: 'medium', label_ar: 'الباقة الكلاسيكية (Signature Collection) — الحجم الأصلي المتوازن', label_en: 'Signature Collection — Balanced Classic', delta: '0' },
                { id: 'large', label_ar: 'الباقة الملكية الفاخرة (Royal VIP Grandeur) — ضعف كثافة الورد وحضور استثنائي', label_en: 'Royal VIP Grandeur — Double Density', delta: '+100' },
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
              {isAr ? 'نص بطاقة الإهداء الملكية (اختياري):' : 'Gift Card Message (Optional):'}
            </label>
            <textarea
              value={giftNote}
              onChange={(e) => setGiftNote(e.target.value)}
              placeholder={
                isAr
                  ? 'اكتب ما يفيض به قلبك من كلمات وسنخطّها بمداد أنيق...'
                  : 'Write your heartfelt message and we will script it with elegance...'
              }
              rows={3}
              className="gift-note-textarea font-poetic"
              style={{ fontSize: '1.05rem', lineHeight: '1.6' }}
            />
          </div>

          {/* Quantity & Action Buttons */}
          <div className="purchase-controls">
            <div className="quantity-counter glass">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="qty-btn"
                aria-label="Decrease quantity"
                disabled={isOutOfStock}
              >
                -
              </button>
              <span className="qty-number">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="qty-btn"
                aria-label="Increase quantity"
                disabled={isOutOfStock}
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              className={`btn-add-cart ${isOutOfStock ? 'disabled' : ''}`}
              disabled={isOutOfStock}
            >
              <ShoppingBag size={20} />
              <span>
                {isOutOfStock
                  ? (isAr ? 'نفد من القطف مؤقتاً' : 'Out of Stock')
                  : (isAr ? `إضافة لحقيبة الهدايا • ${totalPrice} ${currencySymbol}` : `Add to Gift Bag • ${totalPrice} ${currencySymbol}`)}
              </span>
            </button>
          </div>

          {/* WhatsApp Direct Order Button */}
          <button
            onClick={handleWhatsAppOrder}
            className={`btn-whatsapp-direct ${isOutOfStock ? 'btn-whatsapp-reserve' : ''}`}
          >
            <MessageCircle size={22} />
            <span>
              {isOutOfStock
                ? (isAr ? 'استشارة المستشار لحجز قطاف الغد' : 'Contact Florist for Advance Reservation')
                : (isAr ? 'اعتماد موكب الإهداء عبر واتساب' : 'Instant WhatsApp Order')}
            </span>
          </button>

          {/* Guarantees */}
          <div className="product-perks glass">
            <div className="perk">
              <ShieldCheck size={20} className="perk-icon" />
              <span>{isAr ? 'ضمان نضارة الزهور الطبيعية وملمسها المخملي' : 'Freshness & Velvet Texture Guarantee'}</span>
            </div>
            <div className="perk">
              <Truck size={20} className="perk-icon" />
              <span>{isAr ? 'موكب توصيل مبرّد ومكيّف يحفظ نضارة الورد في القاهرة والجيزة' : 'Chilled Express Delivery in Cairo & Giza'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <div className="related-section">
        <h2 className="related-title">
          {isAr ? 'روائع أخرى قد تأسر قلبك' : 'You May Also Like'}
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
