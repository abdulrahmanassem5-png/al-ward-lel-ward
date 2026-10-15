import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import ProductCard from '../../components/storefront/ProductCard/ProductCard.jsx';
import CategoryFilter from '../../components/storefront/CategoryFilter/CategoryFilter.jsx';
import QuickViewModal from '../../components/storefront/QuickViewModal/QuickViewModal.jsx';
import { MOCK_PRODUCTS, CATEGORIES } from '../../config/constants.js';
import { Search, SlidersHorizontal, Sparkles, X, ArrowUpDown } from 'lucide-react';
import './ShopPage.css';

export default function ShopPage() {
  const { t, i18n } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const isAr = i18n.language === 'ar';

  const categoryParam = searchParams.get('category') || 'all';
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'rating'
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const handleCategoryChange = (catId) => {
    setActiveCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = useMemo(() => {
    let result = [...MOCK_PRODUCTS];

    // Filter by Category
    if (activeCategory !== 'all') {
      result = result.filter((p) => p.category === activeCategory);
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter((p) => {
        const nameAr = (p.name_ar || '').toLowerCase();
        const nameEn = (p.name_en || '').toLowerCase();
        const descAr = (p.description_ar || '').toLowerCase();
        const descEn = (p.description_en || '').toLowerCase();
        return nameAr.includes(q) || nameEn.includes(q) || descAr.includes(q) || descEn.includes(q);
      });
    }

    // Sort
    if (sortBy === 'price-low') {
      result.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
    } else if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else {
      // Featured first
      result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
    }

    return result;
  }, [activeCategory, searchQuery, sortBy]);

  return (
    <div className="shop-page container-wide">
      {/* Header */}
      <div className="shop-header">
        <span className="shop-subtitle">
          <Sparkles size={14} />
          {isAr ? 'كتالوج متجر الورد' : 'The Flower Catalog'}
        </span>
        <h1 className="shop-title">
          {isAr ? 'تشكيلة البوكيهات الفاخرة' : 'Luxury Flower Bouquets'}
        </h1>
        <p className="shop-desc">
          {isAr
            ? 'تصفح باقاتنا المصنوعة يدوياً بحب وعناية، مع إمكانية التخصيص الكامل والطلب المباشر.'
            : 'Handcrafted floral collections tailored with care, elegance, and express delivery.'}
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="shop-toolbar glass">
        {/* Search */}
        <div className="search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={isAr ? 'ابحث عن بوكيه، نوع ورد، أو مناسبة...' : 'Search by bouquet, flower type, or occasion...'}
            className="search-input"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="search-clear-btn">
              <X size={16} />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="sort-box">
          <ArrowUpDown size={16} className="sort-icon" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="featured">{isAr ? 'الأكثر تميزاً ✦' : 'Featured First ✦'}</option>
            <option value="rating">{isAr ? 'الأعلى تقييماً ★' : 'Top Rated ★'}</option>
            <option value="price-low">{isAr ? 'السعر: من الأقل للأعلى' : 'Price: Low to High'}</option>
            <option value="price-high">{isAr ? 'السعر: من الأعلى للأقل' : 'Price: High to Low'}</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <CategoryFilter
        activeCategory={activeCategory}
        onSelectCategory={handleCategoryChange}
      />

      {/* Results Info */}
      <div className="results-count-bar">
        <span>
          {isAr
            ? `عرض ${filteredProducts.length} من أصل ${MOCK_PRODUCTS.length} بوكيه متاح`
            : `Showing ${filteredProducts.length} of ${MOCK_PRODUCTS.length} bouquets`}
        </span>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="shop-products-grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={setQuickViewProduct}
            />
          ))}
        </div>
      ) : (
        <div className="no-products glass">
          <div className="no-products-icon">🌸</div>
          <h3>{isAr ? 'لم نعثر على بوكيهات تطابق بحثك' : 'No Bouquets Match Your Search'}</h3>
          <p>
            {isAr
              ? 'جرب البحث بكلمات أخرى أو اختر تصنيفاً مختلفاً'
              : 'Try searching with different terms or selecting another category'}
          </p>
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
            }}
            className="reset-filter-btn"
          >
            {isAr ? 'إعادة ضبط التصفية' : 'Reset Filters'}
          </button>
        </div>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
