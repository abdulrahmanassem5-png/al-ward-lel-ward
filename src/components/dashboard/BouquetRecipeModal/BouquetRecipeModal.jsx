import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CURRENCY } from '../../../config/constants.js';
import {
  calculateBouquetFinancials,
  getRawMaterialsInventory,
  saveBouquetRecipe,
} from '../../../utils/recipeInventoryManager.js';
import {
  X,
  Plus,
  Trash2,
  Sparkles,
  TrendingUp,
  Boxes,
  Flower2,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Scissors,
} from 'lucide-react';
import './BouquetRecipeModal.css';

export default function BouquetRecipeModal({
  product,
  initialRecipe,
  isOpen,
  onClose,
  onSaveSuccess,
}) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const currencySymbol = isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en;

  // Inventory available
  const [inventory, setInventory] = useState(() => getRawMaterialsInventory());

  useEffect(() => {
    if (!isOpen) return;
    const handleUpdate = () => {
      setInventory(getRawMaterialsInventory());
    };
    window.addEventListener('al_ward_raw_inventory_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('al_ward_raw_inventory_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [isOpen]);

  // Local state for bouquet recipe and pricing
  const [recipeItems, setRecipeItems] = useState(() => {
    if (Array.isArray(initialRecipe) && initialRecipe.length > 0) {
      return initialRecipe.map((it) => ({
        raw_id: it.raw_id,
        quantity: Number(it.quantity) || 1,
      }));
    }
    return [
      { raw_id: 'RAW-2', quantity: 12 },
      { raw_id: 'RAW-11', quantity: 2 },
      { raw_id: 'RAW-7', quantity: 2 },
    ];
  });

  const [sellingPrice, setSellingPrice] = useState(
    product.sale_price || product.price || 1000
  );

  // New item selector inputs
  const [selectedRawId, setSelectedRawId] = useState(inventory[0]?.id || 'RAW-1');
  const [selectedQty, setSelectedQty] = useState(1);

  // Live calculation of finances
  const financials = useMemo(() => {
    return calculateBouquetFinancials(recipeItems, sellingPrice, inventory);
  }, [recipeItems, sellingPrice, inventory]);

  if (!isOpen || !product) return null;

  // Handle adding a new raw material to the recipe
  const handleAddItem = (e) => {
    e.preventDefault();
    const qty = Number(selectedQty);
    if (!selectedRawId || qty <= 0) return;

    setRecipeItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.raw_id === selectedRawId);
      if (existingIndex >= 0) {
        // Increment quantity if already exists
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qty,
        };
        return updated;
      }
      return [...prev, { raw_id: selectedRawId, quantity: qty }];
    });
    setSelectedQty(1);
  };

  // Quick preset adder (e.g. quickly add sashes / إسكات or extra flowers)
  const handleAddPreset = (rawId, defaultQty = 1) => {
    setRecipeItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.raw_id === rawId);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + defaultQty,
        };
        return updated;
      }
      return [...prev, { raw_id: rawId, quantity: defaultQty }];
    });
  };

  // Handle changing quantity of an item
  const handleUpdateQty = (rawId, newQty) => {
    const qty = Math.max(1, Number(newQty) || 1);
    setRecipeItems((prev) =>
      prev.map((it) => (it.raw_id === rawId ? { ...it, quantity: qty } : it))
    );
  };

  // Handle removing an item
  const handleRemoveItem = (rawId) => {
    setRecipeItems((prev) => prev.filter((it) => it.raw_id !== rawId));
  };

  // Save changes
  const handleSave = () => {
    const finalPrice = Math.max(1, Number(sellingPrice) || product.price);
    const success = saveBouquetRecipe(product.id, {
      recipe: recipeItems,
      price: finalPrice,
      sale_price: null,
      custom_materials_count: recipeItems.length,
    });

    if (success) {
      if (onSaveSuccess) {
        onSaveSuccess({
          productId: product.id,
          recipe: recipeItems,
          price: finalPrice,
          financials,
        });
      }
      onClose();
    }
  };

  const getMarginBadge = () => {
    const margin = financials.margin_percent;
    if (financials.margin_status === 'loss') {
      return {
        className: 'badge-loss',
        label: isAr ? '⚠️ تنبيه: البيع بخسارة!' : 'Loss Warning!',
      };
    }
    if (margin >= 45) {
      return {
        className: 'badge-royal',
        label: isAr ? '💎 هامش ربح ملكي استثنائي' : 'Royal Profit Margin',
      };
    }
    if (margin >= 30) {
      return {
        className: 'badge-excellent',
        label: isAr ? '✨ ربح ممتاز جداً' : 'Excellent Profit',
      };
    }
    if (margin >= 15) {
      return {
        className: 'badge-moderate',
        label: isAr ? '⚖️ ربح متوسط ومناسب' : 'Fair Margin',
      };
    }
    return {
      className: 'badge-low',
      label: isAr ? '⚠️ هامش ربح منخفض' : 'Low Margin',
    };
  };

  const marginBadge = getMarginBadge();
  const selectedRawObj = inventory.find((m) => m.id === selectedRawId);

  return (
    <div className="modal-overlay recipe-modal-overlay animate-fade-in" onClick={onClose}>
      <div
        className="recipe-modal-container glass"
        onClick={(e) => e.stopPropagation()}
        dir={isAr ? 'rtl' : 'ltr'}
      >
        {/* Modal Header */}
        <div className="recipe-modal-header">
          <div className="recipe-product-meta">
            <div className="product-thumb-wrap">
              <img
                src={product.images?.[0] || '/images/bouquet-save-the-date.jpg'}
                alt={isAr ? product.name_ar : product.name_en}
                className="product-thumb-img"
              />
            </div>
            <div>
              <div className="header-badge-row">
                <span className="recipe-chip">
                  <Scissors size={14} />
                  <span>{isAr ? 'تخصيص تركيبة الخامات والورود' : 'Bouquet Recipe Customizer'}</span>
                </span>
                <span className={`status-pill ${marginBadge.className}`}>
                  {marginBadge.label}
                </span>
              </div>
              <h2 className="recipe-modal-title">
                {isAr ? product.name_ar : product.name_en}
              </h2>
            </div>
          </div>
          <button onClick={onClose} className="modal-close-btn" title={isAr ? 'إغلاق' : 'Close'}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="recipe-modal-body">
          {/* Quick Preset Buttons */}
          <div className="recipe-quick-presets">
            <span className="presets-label">
              <Sparkles size={15} />
              <span>{isAr ? 'إضافات وتخصيصات سريعة:' : 'Quick Custom Additions:'}</span>
            </span>
            <div className="preset-buttons-group">
              <button
                type="button"
                className="preset-btn sash-btn"
                onClick={() => handleAddPreset('RAW-8', 1)}
              >
                <span>🎓 {isAr ? '+ وشاح / إسكات تخرج مطرزة (35 ج)' : '+ Keepsake Sash'}</span>
              </button>
              <button
                type="button"
                className="preset-btn rose-btn"
                onClick={() => handleAddPreset('RAW-2', 5)}
              >
                <span>🌹 {isAr ? '+ 5 سيقان ورد إكوادوري أحمر' : '+ 5 Red Roses'}</span>
              </button>
              <button
                type="button"
                className="preset-btn white-rose-btn"
                onClick={() => handleAddPreset('RAW-9', 5)}
              >
                <span>🤍 {isAr ? '+ 5 سيقان جوري أبيض' : '+ 5 White Roses'}</span>
              </button>
              <button
                type="button"
                className="preset-btn pearl-btn"
                onClick={() => handleAddPreset('RAW-3', 1)}
              >
                <span>🦪 {isAr ? '+ عقد لؤلؤ عرائس' : '+ Bridal Pearl'}</span>
              </button>
              <button
                type="button"
                className="preset-btn topper-btn"
                onClick={() => handleAddPreset('RAW-12', 1)}
              >
                <span>✨ {isAr ? '+ توبر أكريليك مذهب' : '+ Gold Topper'}</span>
              </button>
            </div>
          </div>

          {/* Add Material Form */}
          <div className="add-material-section glass-subtle">
            <h4 className="section-subtitle">
              <Plus size={16} />
              <span>{isAr ? 'إضافة خامة أو ورود جديدة للبوكيه من المخزون' : 'Add Raw Material / Flowers to Recipe'}</span>
            </h4>
            <form onSubmit={handleAddItem} className="add-material-form">
              <div className="form-field raw-select-field">
                <label>{isAr ? 'اختر الخامة أو نوع الورد:' : 'Select Material or Flower:'}</label>
                <select
                  value={selectedRawId}
                  onChange={(e) => setSelectedRawId(e.target.value)}
                  className="recipe-select"
                >
                  {inventory.map((mat) => (
                    <option key={mat.id} value={mat.id}>
                      {isAr ? mat.name_ar : mat.name_en} — ({mat.cost_per_unit} {currencySymbol} / {isAr ? mat.unit_ar : mat.unit_en}) [متوفر: {mat.quantity}]
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-field qty-field">
                <label>
                  {isAr ? 'الكمية المستخدمة:' : 'Quantity:'}{' '}
                  <span className="unit-hint">({isAr ? selectedRawObj?.unit_ar : selectedRawObj?.unit_en})</span>
                </label>
                <div className="qty-input-group">
                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={selectedQty}
                    onChange={(e) => setSelectedQty(e.target.value)}
                    className="recipe-input qty-input"
                  />
                </div>
              </div>

              <button type="submit" className="btn-add-material">
                <Plus size={16} />
                <span>{isAr ? 'إضافة للبوكيه' : 'Add Material'}</span>
              </button>
            </form>
          </div>

          {/* Current Materials Table */}
          <div className="materials-table-section">
            <div className="section-header-flex">
              <h4 className="section-subtitle">
                <Boxes size={16} />
                <span>
                  {isAr ? 'الخامات والورود المكونة لهذا البوكيه' : 'Current Bouquet Recipe Items'}{' '}
                  ({financials.items_breakdown.length})
                </span>
              </h4>
              <span className="materials-total-cost-chip">
                {isAr ? 'إجمالي تكلفة الخامات:' : 'Material Cost:'}{' '}
                <strong>{financials.total_material_cost} {currencySymbol}</strong>
              </span>
            </div>

            {financials.items_breakdown.length === 0 ? (
              <div className="empty-recipe-box">
                <Flower2 size={36} />
                <p>{isAr ? 'لم تتم إضافة أي خامات بعد. اختر من القائمة بالأعلى لإضافة مواد البوكيه.' : 'No materials added yet. Select from above.'}</p>
              </div>
            ) : (
              <div className="recipe-table-wrap">
                <table className="recipe-table">
                  <thead>
                    <tr>
                      <th>{isAr ? 'الخامة / الوردة' : 'Material'}</th>
                      <th>{isAr ? 'تكلفة الوحدة' : 'Unit Cost'}</th>
                      <th>{isAr ? 'الكمية بالبوكيه' : 'Quantity'}</th>
                      <th>{isAr ? 'إجمالي التكلفة' : 'Total Cost'}</th>
                      <th>{isAr ? 'رصيد المخزون' : 'Stock'}</th>
                      <th className="th-action">{isAr ? 'حذف' : 'Remove'}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {financials.items_breakdown.map((row) => (
                      <tr key={row.raw_id}>
                        <td>
                          <div className="material-cell-info">
                            <span className="material-dot" />
                            <strong>{isAr ? row.name_ar : row.name_en}</strong>
                          </div>
                        </td>
                        <td>
                          <span className="cost-tag">
                            {row.cost_per_unit} {currencySymbol} / {isAr ? row.unit_ar : row.unit_en}
                          </span>
                        </td>
                        <td>
                          <div className="qty-control-row">
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => handleUpdateQty(row.raw_id, row.quantity - 1)}
                              disabled={row.quantity <= 1}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={row.quantity}
                              onChange={(e) => handleUpdateQty(row.raw_id, e.target.value)}
                              className="qty-cell-input"
                            />
                            <button
                              type="button"
                              className="qty-btn"
                              onClick={() => handleUpdateQty(row.raw_id, row.quantity + 1)}
                            >
                              +
                            </button>
                            <span className="unit-label">{isAr ? row.unit_ar : row.unit_en}</span>
                          </div>
                        </td>
                        <td>
                          <strong className="total-cost-val">
                            {row.total_cost} {currencySymbol}
                          </strong>
                        </td>
                        <td>
                          <span
                            className={`stock-badge ${
                              row.available_stock <= 10 ? 'stock-critical' : 'stock-ok'
                            }`}
                          >
                            {row.available_stock} {isAr ? row.unit_ar : row.unit_en}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(row.raw_id)}
                            className="btn-remove-material"
                            title={isAr ? 'حذف من البوكيه' : 'Remove item'}
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Pricing & Profit Calculator */}
          <div className="recipe-financial-dashboard glass-gold">
            <div className="price-input-row">
              <div className="price-field">
                <label htmlFor="selling-price-input">
                  <DollarSign size={16} />
                  <span>{isAr ? 'سعر البيع للعميل بعد التعديل (' + currencySymbol + ') *' : 'Bouquet Selling Price *'}</span>
                </label>
                <div className="price-input-wrap">
                  <input
                    id="selling-price-input"
                    type="number"
                    min="1"
                    step="10"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value)}
                    className="selling-price-input"
                  />
                  <span className="currency-addon">{currencySymbol}</span>
                </div>
              </div>
              <div className="price-note">
                {isAr
                  ? '💡 يمكنك تعديل سعر البيع مباشرة وستتم إعادة حساب صافي الربح وهامش الربح فوراً وبدقة.'
                  : '💡 Adjust selling price to immediately see net profit and margin recalculation.'}
              </div>
            </div>

            {/* Financial Stat Cards */}
            <div className="financial-cards-grid">
              {/* Material Cost */}
              <div className="fin-card card-cost">
                <div className="fin-card-icon">
                  <Scissors size={20} />
                </div>
                <div className="fin-card-content">
                  <span className="fin-card-label">{isAr ? 'إجمالي تكلفة الخامات' : 'Raw Material Cost'}</span>
                  <div className="fin-card-value">
                    <span>{financials.total_material_cost}</span>
                    <small>{currencySymbol}</small>
                  </div>
                  <span className="fin-card-sub">
                    {financials.items_breakdown.length} {isAr ? 'خامات محددة' : 'materials'}
                  </span>
                </div>
              </div>

              {/* Selling Price */}
              <div className="fin-card card-revenue">
                <div className="fin-card-icon">
                  <DollarSign size={20} />
                </div>
                <div className="fin-card-content">
                  <span className="fin-card-label">{isAr ? 'سعر البيع النهائي' : 'Selling Price'}</span>
                  <div className="fin-card-value">
                    <span>{financials.selling_price}</span>
                    <small>{currencySymbol}</small>
                  </div>
                  <span className="fin-card-sub">{isAr ? 'السعر المعروض للطلب' : 'Final Order Price'}</span>
                </div>
              </div>

              {/* Net Profit */}
              <div className={`fin-card card-profit ${financials.net_profit < 0 ? 'card-negative' : ''}`}>
                <div className="fin-card-icon">
                  <TrendingUp size={20} />
                </div>
                <div className="fin-card-content">
                  <span className="fin-card-label">{isAr ? 'صافي الربح الدقيق' : 'Net Profit'}</span>
                  <div className="fin-card-value profit-value">
                    <span>{financials.net_profit > 0 ? `+${financials.net_profit}` : financials.net_profit}</span>
                    <small>{currencySymbol}</small>
                  </div>
                  <span className="fin-card-sub">
                    {isAr ? 'سعر البيع - تكلفة الخامات' : 'Revenue - Materials'}
                  </span>
                </div>
              </div>

              {/* Profit Margin */}
              <div className={`fin-card card-margin ${financials.margin_status}`}>
                <div className="fin-card-icon">
                  <Sparkles size={20} />
                </div>
                <div className="fin-card-content">
                  <span className="fin-card-label">{isAr ? 'نسبة هامش الربح' : 'Profit Margin'}</span>
                  <div className="fin-card-value margin-value">
                    <span>{financials.margin_percent}%</span>
                  </div>
                  <span className="fin-card-sub">
                    {marginBadge.label}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="recipe-modal-footer">
          <div className="footer-summary-text">
            {financials.net_profit > 0 ? (
              <span className="summary-ok">
                <CheckCircle2 size={16} />
                <span>
                  {isAr
                    ? `صافي الربح المتوقع عند بيع كل بوكيه: ${financials.net_profit} ${currencySymbol} (هامش ${financials.margin_percent}%)`
                    : `Expected profit per bouquet: ${financials.net_profit} ${currencySymbol} (${financials.margin_percent}%)`}
                </span>
              </span>
            ) : (
              <span className="summary-warn">
                <AlertCircle size={16} />
                <span>{isAr ? 'يرجى مراجعة سعر البيع لتفادي الخسارة' : 'Selling price is lower than cost!'}</span>
              </span>
            )}
          </div>

          <div className="footer-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              {isAr ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="btn-save-recipe"
              disabled={financials.items_breakdown.length === 0}
            >
              <Sparkles size={16} />
              <span>{isAr ? 'حفظ التعديلات واعتماد السعر والتركيبة 🌹' : 'Save & Update Bouquet'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
