import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MOCK_PRODUCTS, CATEGORIES, CURRENCY } from '../../config/constants.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import { Plus, Edit, Trash2, Eye, Star, Check, X, Sparkles, Image as ImageIcon } from 'lucide-react';
import './ProductsPage.css';

export default function ProductsPage() {
  const { t, i18n } = useTranslation();
  const { showSuccess, showError } = useNotification();
  const isAr = i18n.language === 'ar';
  const currencySymbol = isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en;

  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name_ar: '',
    name_en: '',
    description_ar: '',
    description_en: '',
    price: '',
    sale_price: '',
    category: 'love',
    stock_quantity: 10,
    is_featured: false,
    components_ar: '',
  });

  const handleToggleStock = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, is_available: !p.is_available } : p))
    );
    showSuccess(isAr ? 'تم تحديث حالة توفر البوكيه' : 'Stock status updated');
  };

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showSuccess(isAr ? 'تم حذف البوكيه من الكتالوج' : 'Bouquet deleted from catalog');
  };

  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProduct.name_ar.trim() || !newProduct.price) {
      showError(isAr ? 'يرجى إدخال اسم البوكيه وسعره' : 'Please provide name and price');
      return;
    }

    const created = {
      id: `${Date.now()}`,
      name_ar: newProduct.name_ar,
      name_en: newProduct.name_en || newProduct.name_ar,
      description_ar: newProduct.description_ar,
      description_en: newProduct.description_en || newProduct.description_ar,
      price: parseFloat(newProduct.price),
      sale_price: newProduct.sale_price ? parseFloat(newProduct.sale_price) : null,
      category: newProduct.category,
      images: ['/images/bouquet-save-the-date.jpg'],
      stock_quantity: parseInt(newProduct.stock_quantity) || 10,
      is_available: true,
      is_featured: newProduct.is_featured,
      rating: 5.0,
      reviews_count: 1,
      components_ar: newProduct.components_ar.split(',').map((s) => s.trim()).filter(Boolean),
      components_en: ['Fresh Flowers', 'Silk Ribbon'],
    };

    setProducts([created, ...products]);
    setShowAddModal(false);
    showSuccess(isAr ? 'تمت إضافة البوكيه الجديد إلى الكتالوج بنجاح 🌹' : 'New bouquet added to catalog 🌹');
    setNewProduct({
      name_ar: '',
      name_en: '',
      description_ar: '',
      description_en: '',
      price: '',
      sale_price: '',
      category: 'love',
      stock_quantity: 10,
      is_featured: false,
      components_ar: '',
    });
  };

  return (
    <div className="products-mgmt-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isAr ? 'كتالوج البوكيهات والمنتجات' : 'Bouquets Catalog'}</h1>
          <p className="page-desc">{isAr ? 'إدارة باقات الورد، الأسعار، وحالات التوفر' : 'Manage bouquet designs, pricing & availability'}</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-add-product">
          <Plus size={18} />
          <span>{isAr ? 'إضافة بوكيه جديد' : 'Add New Bouquet'}</span>
        </button>
      </div>

      {/* Grid of Bouquets */}
      <div className="mgmt-products-grid">
        {products.map((p) => {
          const img = p.images?.[0] || '/images/bouquet-save-the-date.jpg';
          const name = isAr ? p.name_ar : p.name_en;

          return (
            <div key={p.id} className="mgmt-product-card glass">
              <div className="mgmt-card-img-wrap">
                <img src={img} alt={name} />
                <button
                  onClick={() => handleToggleStock(p.id)}
                  className={`stock-toggle-btn ${p.is_available ? 'available' : 'unavailable'}`}
                >
                  {p.is_available ? (isAr ? 'متاح للطلب' : 'In Stock') : (isAr ? 'نفد مؤقتاً' : 'Out of Stock')}
                </button>
              </div>

              <div className="mgmt-card-body">
                <div className="mgmt-card-cat">
                  <span>{CATEGORIES.find((c) => c.id === p.category)?.[isAr ? 'name_ar' : 'name_en'] || p.category}</span>
                  {p.is_featured && <span className="featured-tag">★ {isAr ? 'مميز' : 'Featured'}</span>}
                </div>

                <h3 className="mgmt-card-title">{name}</h3>

                <div className="mgmt-pricing-row">
                  <span className="mgmt-price">
                    {p.sale_price || p.price} {currencySymbol}
                  </span>
                  {p.sale_price && (
                    <span className="mgmt-old-price">
                      {p.price} {currencySymbol}
                    </span>
                  )}
                  <span className="mgmt-stock-count">
                    {isAr ? `المخزون: ${p.stock_quantity}` : `Stock: ${p.stock_quantity}`}
                  </span>
                </div>

                <div className="mgmt-card-actions">
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="btn-delete-prod"
                    title={isAr ? 'حذف البوكيه' : 'Delete'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Bouquet Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="add-modal glass animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isAr ? 'إضافة تصميم بوكيه جديد' : 'Add New Bouquet Design'}</h2>
              <button onClick={() => setShowAddModal(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="add-form">
              <div className="form-group">
                <label>{isAr ? 'اسم البوكيه بالعربية *' : 'Bouquet Name (Arabic) *'}</label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'مثال: بوكيه سحر الياسمين' : 'e.g. Jasmine Charm'}
                  value={newProduct.name_ar}
                  onChange={(e) => setNewProduct({ ...newProduct, name_ar: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>{isAr ? 'اسم البوكيه بالإنجليزية' : 'Bouquet Name (English)'}</label>
                <input
                  type="text"
                  placeholder="e.g. Jasmine Charm Bouquet"
                  value={newProduct.name_en}
                  onChange={(e) => setNewProduct({ ...newProduct, name_en: e.target.value })}
                />
              </div>

              <div className="form-row-two">
                <div className="form-group">
                  <label>{isAr ? 'السعر الأساسي (ج.م) *' : 'Price (EGP) *'}</label>
                  <input
                    type="number"
                    required
                    placeholder="250"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>{isAr ? 'سعر الخصم (اختياري)' : 'Sale Price (Optional)'}</label>
                  <input
                    type="number"
                    placeholder="210"
                    value={newProduct.sale_price}
                    onChange={(e) => setNewProduct({ ...newProduct, sale_price: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-two">
                <div className="form-group">
                  <label>{isAr ? 'التصنيف' : 'Category'}</label>
                  <select
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>
                        {isAr ? c.name_ar : c.name_en}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>{isAr ? 'الكمية الجاهزة' : 'Initial Stock'}</label>
                  <input
                    type="number"
                    value={newProduct.stock_quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>{isAr ? 'مكونات الزهور (مفصولة بفاصلة)' : 'Floral Components (comma separated)'}</label>
                <input
                  type="text"
                  placeholder={isAr ? 'ورد جوري، يوكالبتوس، شريط ذهبي' : 'Red roses, Eucalyptus, Gold ribbon'}
                  value={newProduct.components_ar}
                  onChange={(e) => setNewProduct({ ...newProduct, components_ar: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>{isAr ? 'الوصف والتفاصيل' : 'Description'}</label>
                <textarea
                  rows={3}
                  placeholder={isAr ? 'وصف جمال وتنسيق البوكيه...' : 'Describe bouquet styling and elegance...'}
                  value={newProduct.description_ar}
                  onChange={(e) => setNewProduct({ ...newProduct, description_ar: e.target.value })}
                />
              </div>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={newProduct.is_featured}
                  onChange={(e) => setNewProduct({ ...newProduct, is_featured: e.target.checked })}
                />
                <span>{isAr ? 'عرض في واجهة المتجر كبوكيه مميز ✦' : 'Feature on homepage ✦'}</span>
              </label>

              <div className="modal-actions">
                <button type="submit" className="btn-modal-save">
                  <Sparkles size={18} />
                  <span>{isAr ? 'حفظ ونشر البوكيه' : 'Publish Bouquet'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
