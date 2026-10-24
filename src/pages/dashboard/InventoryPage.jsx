import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CURRENCY } from '../../config/constants.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import { getRawMaterialsInventory } from '../../utils/recipeInventoryManager.js';
import { getStoredProducts } from '../../utils/productStorageManager.js';
import confetti from 'canvas-confetti';
import {
  Boxes,
  Plus,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Search,
  X,
  Flower2,
  Layers,
  Sparkles,
} from 'lucide-react';
import './InventoryPage.css';

export default function InventoryPage() {
  const { i18n } = useTranslation();
  const { showSuccess, showError } = useNotification();
  const isAr = i18n.language === 'ar';
  const currencySymbol = isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en;

  // Active Tab: 'bouquets' | 'raw'
  const [activeTab, setActiveTab] = useState('bouquets');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Dynamic products list from stored products atelier
  const [productsList, setProductsList] = useState(() => getStoredProducts());

  useEffect(() => {
    const handleProductsUpdate = () => {
      setProductsList(getStoredProducts());
    };
    window.addEventListener('al_ward_products_updated', handleProductsUpdate);
    window.addEventListener('storage', handleProductsUpdate);
    return () => {
      window.removeEventListener('al_ward_products_updated', handleProductsUpdate);
      window.removeEventListener('storage', handleProductsUpdate);
    };
  }, []);

  // 1. Ready Bouquets Stock (persisted in localStorage)
  const [bouquetsStock, setBouquetsStock] = useState(() => {
    try {
      const saved = localStorage.getItem('al_ward_products_stock');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // initialize from stored products
    const initial = {};
    const prods = getStoredProducts();
    prods.forEach((p) => {
      initial[p.id] = p.stock_quantity ?? 12;
    });
    return initial;
  });

  // 2. Raw Materials Inventory (persisted in localStorage with master defaults)
  const [rawInventory, setRawInventory] = useState(() => {
    return getRawMaterialsInventory();
  });

  // Listen to external deductions from orders or recipes
  useEffect(() => {
    const handleInvUpdated = (e) => {
      if (e?.detail) {
        setRawInventory(e.detail);
      } else {
        setRawInventory(getRawMaterialsInventory());
      }
    };
    window.addEventListener('al_ward_raw_inventory_updated', handleInvUpdated);
    return () => window.removeEventListener('al_ward_raw_inventory_updated', handleInvUpdated);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    try {
      localStorage.setItem('al_ward_products_stock', JSON.stringify(bouquetsStock));
    } catch {
      // ignore
    }
  }, [bouquetsStock]);

  useEffect(() => {
    try {
      localStorage.setItem('al_ward_raw_inventory', JSON.stringify(rawInventory));
    } catch {
      // ignore
    }
  }, [rawInventory]);

  // Handle ESC key for modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && showAddModal) {
        setShowAddModal(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showAddModal]);

  // Form State for Adding New Material
  const [newItem, setNewItem] = useState({
    name_ar: '',
    name_en: '',
    quantity: '',
    unit_ar: 'ساق',
    unit_en: 'stem',
    reorder_level: 20,
    cost_per_unit: '',
    supplier_ar: '',
    supplier_en: '',
  });

  // ── Bouquet Stock Adjustments ──
  const handleAdjustBouquetStock = (productId, delta) => {
    setBouquetsStock((prev) => {
      const current = prev[productId] ?? 10;
      const next = Math.max(0, current + delta);
      return { ...prev, [productId]: next };
    });
    showSuccess(isAr ? 'تم تعديل كمية مخزون البوكيه' : 'Bouquet stock adjusted');
  };

  const handleSetExactBouquetStock = (productId, value) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    setBouquetsStock((prev) => ({
      ...prev,
      [productId]: num,
    }));
  };

  // ── Raw Materials Stock Adjustments ──
  const handleAdjustRawQuantity = (id, delta) => {
    setRawInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = Math.max(0, item.quantity + delta);
          return { ...item, quantity: next };
        }
        return item;
      })
    );
    showSuccess(isAr ? 'تم تعديل كمية المادة الخام' : 'Material quantity adjusted');
  };

  const handleSetExactRawQuantity = (id, value) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    setRawInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: num } : item))
    );
  };

  const handleAddRawItem = (e) => {
    e.preventDefault();
    if (!newItem.name_ar.trim() || !newItem.quantity) {
      showError(isAr ? 'يرجى إدخال اسم المادة والكمية' : 'Please provide material name and quantity');
      return;
    }

    const created = {
      id: `RAW-${Date.now().toString().slice(-4)}`,
      name_ar: newItem.name_ar.trim(),
      name_en: newItem.name_en.trim() || newItem.name_ar.trim(),
      quantity: parseInt(newItem.quantity, 10) || 0,
      unit_ar: newItem.unit_ar || 'قطعة',
      unit_en: newItem.unit_en || 'piece',
      reorder_level: parseInt(newItem.reorder_level, 10) || 15,
      cost_per_unit: parseFloat(newItem.cost_per_unit) || 20,
      supplier_ar: newItem.supplier_ar.trim() || (isAr ? 'مورد معتمد' : 'Verified Florist'),
      supplier_en: newItem.supplier_en.trim() || 'Verified Supplier',
    };

    setRawInventory([created, ...rawInventory]);
    setShowAddModal(false);
    showSuccess(isAr ? 'تمت إضافة المادة إلى المخزون الملكي بنجاح ✦' : 'Material added to royal inventory ✦');
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#D4A853', '#E8C87A', '#34D399'],
    });

    setNewItem({
      name_ar: '',
      name_en: '',
      quantity: '',
      unit_ar: 'ساق',
      unit_en: 'stem',
      reorder_level: 20,
      cost_per_unit: '',
      supplier_ar: '',
      supplier_en: '',
    });
  };

  // Filtered lists based on search
  const filteredBouquets = productsList.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (p.name_ar || '').toLowerCase().includes(q) ||
      (p.name_en || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q)
    );
  });

  const filteredRawItems = rawInventory.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (item.name_ar || '').toLowerCase().includes(q) ||
      (item.name_en || '').toLowerCase().includes(q) ||
      (item.supplier_ar || '').toLowerCase().includes(q)
    );
  });

  // Metrics
  const lowBouquetCount = productsList.filter((p) => (bouquetsStock[p.id] ?? 10) <= 3).length;
  const outOfStockBouquetCount = productsList.filter((p) => (bouquetsStock[p.id] ?? 10) === 0).length;
  const lowRawCount = rawInventory.filter((i) => i.quantity <= i.reorder_level).length;

  return (
    <div className="inventory-mgmt-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Boxes size={26} className="title-icon-gold" />
            <span>{isAr ? 'المخزون الملكي وصلاحيات التحكم' : 'Inventory & Stock Management'}</span>
          </h1>
          <p className="page-desc">
            {isAr
              ? 'متابعة وتعديل رصيد البوكيهات الجاهزة والمواد الخام بأزرار إضافة ونقصان سريعة مع تحديث فوري لحالة المتجر'
              : 'Control ready bouquet stock and raw materials with quick increment/decrement buttons'}
          </p>
        </div>

        {activeTab === 'raw' && (
          <button onClick={() => setShowAddModal(true)} className="btn-royal-gold">
            <Plus size={18} />
            <span>{isAr ? 'إضافة مادة خام جديدة' : 'Add Raw Material'}</span>
          </button>
        )}
      </div>

      {/* Inventory Navigation Tabs */}
      <div className="inventory-tabs-bar glass">
        <button
          className={`inv-tab-btn ${activeTab === 'bouquets' ? 'active' : ''}`}
          onClick={() => setActiveTab('bouquets')}
        >
          <Flower2 size={18} />
          <span>{isAr ? 'مخزون البوكيهات والتحف الجاهزة' : 'Ready Bouquets Stock'}</span>
          <span className="inv-tab-count">({productsList.length})</span>
          {lowBouquetCount > 0 && <span className="inv-tab-alert-badge">{lowBouquetCount}</span>}
        </button>

        <button
          className={`inv-tab-btn ${activeTab === 'raw' ? 'active' : ''}`}
          onClick={() => setActiveTab('raw')}
        >
          <Layers size={18} />
          <span>{isAr ? 'المواد الخام والسيقان والتغليف' : 'Raw Materials & Stems'}</span>
          <span className="inv-tab-count">({rawInventory.length})</span>
          {lowRawCount > 0 && <span className="inv-tab-alert-badge">{lowRawCount}</span>}
        </button>
      </div>

      {/* Metrics Banner */}
      <div className="inventory-stats-grid">
        <div className="inv-stat-card glass">
          <span className="stat-label">
            {activeTab === 'bouquets'
              ? (isAr ? 'إجمالي البوكيهات في الكتالوج' : 'Total Catalog Designs')
              : (isAr ? 'إجمالي المواد الخام المسجلة' : 'Total Raw Materials')}
          </span>
          <span className="stat-number">
            {activeTab === 'bouquets' ? productsList.length : rawInventory.length}
          </span>
        </div>

        <div className="inv-stat-card glass warning">
          <span className="stat-label">{isAr ? 'مواد منخفضة المخزون' : 'Low Stock Warning'}</span>
          <div className="stat-value-row">
            <span className="stat-number text-warning">
              {activeTab === 'bouquets' ? lowBouquetCount : lowRawCount}
            </span>
            <span className="stat-badge warning">
              <AlertTriangle size={12} />
              <span>{isAr ? 'تحت حد التنبيه' : 'Below Threshold'}</span>
            </span>
          </div>
        </div>

        <div className="inv-stat-card glass">
          <span className="stat-label">
            {activeTab === 'bouquets'
              ? (isAr ? 'باقات نفدت من القطف' : 'Out of Stock')
              : (isAr ? 'حالة التوريد الملكي' : 'Supply Chain Status')}
          </span>
          <div className="stat-value-row">
            {activeTab === 'bouquets' ? (
              <span className={`stat-number ${outOfStockBouquetCount > 0 ? 'text-error' : 'text-success'}`}>
                {outOfStockBouquetCount}
              </span>
            ) : (
              <span className="stat-badge success">
                <CheckCircle2 size={12} />
                <span>{isAr ? 'المزارع نشطة 100%' : '100% Operational'}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Search Toolbar */}
      <div className="inventory-toolbar glass">
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder={
              activeTab === 'bouquets'
                ? (isAr ? 'ابحث باسم البوكيه أو المناسبة...' : 'Search bouquet name or occasion...')
                : (isAr ? 'ابحث باسم الزهرة، المورّد، مستلزمات التغليف...' : 'Search stem, supplier, packaging...')
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ── TAB 1: Bouquets Stock Management ── */}
      {activeTab === 'bouquets' && (
        <div className="inventory-table-card glass-royal-card">
          <div className="table-responsive">
            <table className="royal-inventory-table">
              <thead>
                <tr>
                  <th>{isAr ? 'التحفة والبوكيه' : 'Masterpiece / Bouquet'}</th>
                  <th>{isAr ? 'الفئة والتنسيق' : 'Category'}</th>
                  <th>{isAr ? 'السعر' : 'Price'}</th>
                  <th>{isAr ? 'المخزون المتوفر' : 'Current Stock'}</th>
                  <th>{isAr ? 'حالة العرض' : 'Status'}</th>
                  <th>{isAr ? 'صلاحيات الإضافة والنقصان السريعة' : 'Quick Stock Controls'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredBouquets.map((product) => {
                  const qty = bouquetsStock[product.id] ?? 10;
                  const isOut = qty === 0;
                  const isLow = qty > 0 && qty <= 3;
                  const img = product.images?.[0] || '/images/bouquet-save-the-date.jpg';

                  return (
                    <tr key={product.id} className={isOut ? 'row-out-of-stock' : ''}>
                      <td>
                        <div className="product-table-cell">
                          <img src={img} alt={product.name_ar} className="table-product-thumb" />
                          <div className="product-cell-text">
                            <strong className="table-product-title">{isAr ? product.name_ar : product.name_en}</strong>
                            <small className="table-product-id">ID: #{product.id}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="table-cat-badge">{product.category}</span>
                      </td>
                      <td>
                        <strong className="table-price">
                          {product.price} {currencySymbol}
                        </strong>
                      </td>
                      <td>
                        <div className="stock-qty-display">
                          <span className={`qty-indicator-num ${isOut ? 'out' : isLow ? 'low' : 'good'}`}>
                            {qty}
                          </span>
                          <span className="qty-unit-label">{isAr ? 'بوكيه' : 'bouquets'}</span>
                        </div>
                      </td>
                      <td>
                        {isOut ? (
                          <span className="stock-pill pill-out">
                            <XCircle size={13} />
                            <span>{isAr ? 'نفد من القطف' : 'Out of Stock'}</span>
                          </span>
                        ) : isLow ? (
                          <span className="stock-pill pill-low">
                            <AlertTriangle size={13} />
                            <span>{isAr ? `متبقي ${qty} فقط ⚠️` : `Only ${qty} Left ⚠️`}</span>
                          </span>
                        ) : (
                          <span className="stock-pill pill-ok">
                            <CheckCircle2 size={13} />
                            <span>{isAr ? 'متوفر للطلب' : 'Available'}</span>
                          </span>
                        )}
                      </td>
                      <td>
                        {/* Quick Increment/Decrement Buttons & Direct Input */}
                        <div className="stock-control-buttons">
                          <button
                            type="button"
                            onClick={() => handleAdjustBouquetStock(product.id, -5)}
                            className="btn-stock-adj minus-bulk"
                            title={isAr ? 'نقص 5 باقات' : '-5'}
                          >
                            -5
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAdjustBouquetStock(product.id, -1)}
                            className="btn-stock-adj minus-one"
                            title={isAr ? 'نقص باقة واحدة' : '-1'}
                          >
                            -1
                          </button>

                          <input
                            type="number"
                            className="stock-direct-input"
                            value={qty}
                            onChange={(e) => handleSetExactBouquetStock(product.id, e.target.value)}
                            min="0"
                          />

                          <button
                            type="button"
                            onClick={() => handleAdjustBouquetStock(product.id, 1)}
                            className="btn-stock-adj plus-one"
                            title={isAr ? 'إضافة باقة واحدة' : '+1'}
                          >
                            +1
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAdjustBouquetStock(product.id, 5)}
                            className="btn-stock-adj plus-bulk"
                            title={isAr ? 'إضافة 5 باقات' : '+5'}
                          >
                            +5
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── TAB 2: Raw Materials & Stems Management ── */}
      {activeTab === 'raw' && (
        <div className="inventory-table-card glass-royal-card">
          <div className="table-responsive">
            <table className="royal-inventory-table">
              <thead>
                <tr>
                  <th>{isAr ? 'المادة الخام' : 'Raw Material'}</th>
                  <th>{isAr ? 'الكمية الحالية' : 'Current Quantity'}</th>
                  <th>{isAr ? 'حد إعادة الطلب' : 'Reorder Alert'}</th>
                  <th>{isAr ? 'تكلفة الوحدة' : 'Unit Cost'}</th>
                  <th>{isAr ? 'المورّد المعتمد' : 'Supplier'}</th>
                  <th>{isAr ? 'حالة التوفر' : 'Health'}</th>
                  <th>{isAr ? 'صلاحيات الإضافة والنقصان' : 'Adjust Stock'}</th>
                </tr>
              </thead>
              <tbody>
                {filteredRawItems.map((item) => {
                  const isLow = item.quantity <= item.reorder_level;
                  const isOut = item.quantity === 0;

                  return (
                    <tr key={item.id} className={isOut ? 'row-out-of-stock' : ''}>
                      <td>
                        <div className="mat-name-cell">
                          <strong className="mat-title">{isAr ? item.name_ar : item.name_en}</strong>
                          <span className="mat-unit-badge">{isAr ? item.unit_ar : item.unit_en}</span>
                        </div>
                      </td>
                      <td>
                        <div className="stock-qty-display">
                          <span className={`qty-indicator-num ${isOut ? 'out' : isLow ? 'low' : 'good'}`}>
                            {item.quantity}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="reorder-num">
                          {item.reorder_level} {isAr ? item.unit_ar : item.unit_en}
                        </span>
                      </td>
                      <td>
                        <span className="cost-num">
                          {item.cost_per_unit} {currencySymbol}
                        </span>
                      </td>
                      <td>
                        <span className="supplier-text">{isAr ? item.supplier_ar : item.supplier_en}</span>
                      </td>
                      <td>
                        {isOut ? (
                          <span className="stock-pill pill-out">
                            <XCircle size={13} />
                            <span>{isAr ? 'نفدت الكمية' : 'Depleted'}</span>
                          </span>
                        ) : isLow ? (
                          <span className="stock-pill pill-low">
                            <AlertTriangle size={13} />
                            <span>{isAr ? 'تحت حد الطلب' : 'Restock Soon'}</span>
                          </span>
                        ) : (
                          <span className="stock-pill pill-ok">
                            <CheckCircle2 size={13} />
                            <span>{isAr ? 'وفرة كافية' : 'Optimal'}</span>
                          </span>
                        )}
                      </td>
                      <td>
                        <div className="stock-control-buttons">
                          <button
                            type="button"
                            onClick={() => handleAdjustRawQuantity(item.id, -5)}
                            className="btn-stock-adj minus-bulk"
                            title="-5"
                          >
                            -5
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAdjustRawQuantity(item.id, -1)}
                            className="btn-stock-adj minus-one"
                            title="-1"
                          >
                            -1
                          </button>

                          <input
                            type="number"
                            className="stock-direct-input"
                            value={item.quantity}
                            onChange={(e) => handleSetExactRawQuantity(item.id, e.target.value)}
                            min="0"
                          />

                          <button
                            type="button"
                            onClick={() => handleAdjustRawQuantity(item.id, 1)}
                            className="btn-stock-adj plus-one"
                            title="+1"
                          >
                            +1
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAdjustRawQuantity(item.id, 10)}
                            className="btn-stock-adj plus-bulk"
                            title="+10"
                          >
                            +10
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Fortified Royal Modal for Adding Raw Material */}
      {showAddModal && (
        <div className="royal-modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="royal-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="royal-modal-header">
              <h2 className="royal-modal-title">
                <Sparkles size={20} color="#D4A853" />
                <span>{isAr ? 'إضافة مادة خام جديدة إلى المخزون الملكي' : 'Add New Raw Material'}</span>
              </h2>
              <button onClick={() => setShowAddModal(false)} className="royal-modal-close" aria-label="Close modal">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddRawItem} className="royal-modal-form">
              <div className="royal-form-group">
                <label className="royal-label">{isAr ? 'اسم المادة الخام (بالعربية) *' : 'Material Name (Arabic) *'}</label>
                <div className="royal-input-wrap">
                  <input
                    type="text"
                    required
                    className="royal-input"
                    placeholder={isAr ? 'مثال: سيقان زهور الأوركيد التايلاندية' : 'e.g. Thai Orchid Stems'}
                    value={newItem.name_ar}
                    onChange={(e) => setNewItem({ ...newItem, name_ar: e.target.value })}
                  />
                </div>
              </div>

              <div className="royal-form-group">
                <label className="royal-label">{isAr ? 'اسم المادة الخام (بالإنجليزية):' : 'Material Name (English):'}</label>
                <div className="royal-input-wrap">
                  <input
                    type="text"
                    className="royal-input"
                    placeholder="e.g. Exotic Thai Orchids"
                    value={newItem.name_en}
                    onChange={(e) => setNewItem({ ...newItem, name_en: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="royal-form-group">
                  <label className="royal-label">{isAr ? 'الكمية المتوفرة حالياً *' : 'Current Quantity *'}</label>
                  <div className="royal-input-wrap">
                    <input
                      type="number"
                      required
                      className="royal-input"
                      placeholder="100"
                      value={newItem.quantity}
                      onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                    />
                  </div>
                </div>

                <div className="royal-form-group">
                  <label className="royal-label">{isAr ? 'وحدة القياس:' : 'Measurement Unit:'}</label>
                  <div className="royal-input-wrap">
                    <input
                      type="text"
                      className="royal-input"
                      placeholder={isAr ? 'ساق / رول / كرتون / قالب' : 'stem / roll / box'}
                      value={newItem.unit_ar}
                      onChange={(e) => setNewItem({ ...newItem, unit_ar: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="form-row-two" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="royal-form-group">
                  <label className="royal-label">{isAr ? 'حد التنبيه (إعادة الطلب):' : 'Reorder Level:'}</label>
                  <div className="royal-input-wrap">
                    <input
                      type="number"
                      className="royal-input"
                      value={newItem.reorder_level}
                      onChange={(e) => setNewItem({ ...newItem, reorder_level: e.target.value })}
                    />
                  </div>
                </div>

                <div className="royal-form-group">
                  <label className="royal-label">{isAr ? 'تكلفة الوحدة (ج.م):' : 'Unit Cost (EGP):'}</label>
                  <div className="royal-input-wrap">
                    <input
                      type="number"
                      className="royal-input"
                      placeholder="25"
                      value={newItem.cost_per_unit}
                      onChange={(e) => setNewItem({ ...newItem, cost_per_unit: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="royal-form-group">
                <label className="royal-label">{isAr ? 'المورّد المعتمد:' : 'Supplier Name:'}</label>
                <div className="royal-input-wrap">
                  <input
                    type="text"
                    className="royal-input"
                    placeholder={isAr ? 'مثال: مزارع هولندا الدولية' : 'e.g. Dutch Flora Direct'}
                    value={newItem.supplier_ar}
                    onChange={(e) => setNewItem({ ...newItem, supplier_ar: e.target.value })}
                  />
                </div>
              </div>

              <div className="royal-modal-actions">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn-royal-outline">
                  <span>{isAr ? 'إلغاء' : 'Cancel'}</span>
                </button>
                <button type="submit" className="btn-royal-gold">
                  <Plus size={16} />
                  <span>{isAr ? 'حفظ وإضافة للمخزون' : 'Save to Inventory'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
