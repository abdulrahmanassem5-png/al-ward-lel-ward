import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { CURRENCY } from '../../config/constants.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import {
  getBouquetRecipe,
  calculateBouquetFinancials,
  getRawMaterialsInventory,
  getBouquetRecipes,
} from '../../utils/recipeInventoryManager.js';
import {
  getStoredProducts,
  saveStoredProduct,
  deleteStoredProduct,
} from '../../utils/productStorageManager.js';
import BouquetRecipeModal from '../../components/dashboard/BouquetRecipeModal/BouquetRecipeModal.jsx';
import BouquetEditModal from '../../components/dashboard/BouquetEditModal/BouquetEditModal.jsx';
import { Plus, Trash2, Scissors, Edit3, Film, Image as ImageIcon } from 'lucide-react';
import './ProductsPage.css';

export default function ProductsPage() {
  const { i18n } = useTranslation();
  const { showSuccess } = useNotification();
  const isAr = i18n.language === 'ar';
  const currencySymbol = isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en;

  // Initialize products with stored products
  const [products, setProducts] = useState(() => getStoredProducts());

  const [selectedBouquetForRecipe, setSelectedBouquetForRecipe] = useState(null);
  const [editingBouquet, setEditingBouquet] = useState(null);
  const [isCreatingBouquet, setIsCreatingBouquet] = useState(false);

  const computeFinancials = useCallback((prods) => {
    const inv = getRawMaterialsInventory();
    const recipes = getBouquetRecipes();
    const map = {};

    prods.forEach((p) => {
      const rec = recipes[p.id] || getBouquetRecipe(p.id);
      const fin = calculateBouquetFinancials(rec, p.sale_price || p.price, inv);
      map[p.id] = {
        recipe: rec,
        financials: fin,
      };
    });

    return map;
  }, []);

  const [bouquetFinancialsMap, setBouquetFinancialsMap] = useState(() => computeFinancials(products));

  // Listen to product, recipe or inventory changes
  useEffect(() => {
    const handleSync = () => {
      const prods = getStoredProducts();
      setProducts(prods);
      setBouquetFinancialsMap(computeFinancials(prods));
    };
    window.addEventListener('al_ward_bouquet_recipes_updated', handleSync);
    window.addEventListener('al_ward_raw_inventory_updated', handleSync);
    window.addEventListener('al_ward_products_updated', handleSync);
    window.addEventListener('storage', handleSync);
    return () => {
      window.removeEventListener('al_ward_bouquet_recipes_updated', handleSync);
      window.removeEventListener('al_ward_raw_inventory_updated', handleSync);
      window.removeEventListener('al_ward_products_updated', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, [computeFinancials]);

  const handleToggleStock = (id) => {
    const p = products.find((item) => item.id === id);
    if (!p) return;
    const updated = { ...p, is_available: !p.is_available };
    saveStoredProduct(updated);
    setProducts(getStoredProducts());
    showSuccess(isAr ? 'تم تحديث حالة توفر البوكيه' : 'Stock status updated');
  };

  const handleDelete = (id) => {
    deleteStoredProduct(id);
    setProducts(getStoredProducts());
    showSuccess(isAr ? 'تم حذف البوكيه من الكتالوج' : 'Bouquet deleted from catalog');
  };

  const handleRecipeSaveSuccess = ({ price, financials }) => {
    const updated = getStoredProducts();
    setProducts(updated);
    setBouquetFinancialsMap(computeFinancials(updated));
    showSuccess(
      isAr
        ? `تم تحديث تركيبة البوكيه واعتماد السعر (${price} ${currencySymbol}) بصافي ربح ${financials.net_profit} ${currencySymbol} 🌹`
        : `Bouquet recipe & profit saved successfully! 🌹`
    );
  };

  return (
    <div className="products-mgmt-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isAr ? 'كتالوج البوكيهات والمنتجات' : 'Bouquets Catalog'}</h1>
          <p className="page-desc">
            {isAr
              ? 'إدارة باقات الورد، تخصيص الخامات والمواد (كالأوشحة والإسكات)، وحساب الأرباح بدقة'
              : 'Manage bouquet designs, custom materials, recipes & exact net profit calculations'}
          </p>
        </div>
        <button onClick={() => setIsCreatingBouquet(true)} className="btn-add-product">
          <Plus size={18} />
          <span>{isAr ? 'إضافة تصميم بوكيه جديد' : 'Add New Bouquet'}</span>
        </button>
      </div>

      {/* Grid of Bouquets */}
      <div className="mgmt-products-grid">
        {products.map((p) => {
          const img = p.images?.[0] || '/images/bouquet-save-the-date.jpg';
          const name = isAr ? p.name_ar : p.name_en;
          const finData = bouquetFinancialsMap[p.id];
          const fin = finData?.financials;

          return (
            <div key={p.id} className="mgmt-product-card glass">
              <div
                className="mgmt-card-img-wrap clickable"
                onClick={() => setSelectedBouquetForRecipe(p)}
                title={isAr ? 'اضغط لتخصيص الخامات وحساب الأرباح' : 'Click to customize recipe'}
              >
                <img src={img} alt={name} />
                {p.video_url && (
                  <span className="card-video-indicator-badge" title={isAr ? 'يحتوي على فيديو للبوكيه' : 'Has video'}>
                    <Film size={12} />
                    <span>{isAr ? 'فيديو' : 'Video'}</span>
                  </span>
                )}
                {p.images && p.images.length > 1 && (
                  <span className="card-photos-count-badge" title={isAr ? `${p.images.length} صور` : `${p.images.length} photos`}>
                    <ImageIcon size={12} />
                    <span>{p.images.length}</span>
                  </span>
                )}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleStock(p.id);
                  }}
                  className={`stock-toggle-btn ${p.is_available ? 'available' : 'unavailable'}`}
                >
                  {p.is_available ? (isAr ? 'متاح للطلب' : 'In Stock') : (isAr ? 'نفد مؤقتاً' : 'Out of Stock')}
                </button>

                <div className="card-overlay-badge">
                  <Scissors size={14} />
                  <span>{isAr ? 'تخصيص الخامات' : 'Customize Recipe'}</span>
                </div>
              </div>

              <div className="mgmt-card-body">
                <div className="mgmt-card-cat">
                  <span>{CATEGORIES.find((c) => c.id === p.category)?.[isAr ? 'name_ar' : 'name_en'] || p.category}</span>
                  {p.is_featured && <span className="featured-tag">★ {isAr ? 'مميز' : 'Featured'}</span>}
                </div>

                <h3
                  className="mgmt-card-title clickable-title"
                  onClick={() => setSelectedBouquetForRecipe(p)}
                >
                  {name}
                </h3>

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

                {/* Live Recipe & Profit Summary Pill */}
                {fin && (
                  <div
                    className="mgmt-recipe-summary-box"
                    onClick={() => setSelectedBouquetForRecipe(p)}
                  >
                    <div className="recipe-summary-metric">
                      <span className="metric-label">{isAr ? 'تكلفة الخامات:' : 'Material Cost:'}</span>
                      <span className="metric-val cost-text">{fin.total_material_cost} {currencySymbol}</span>
                    </div>
                    <div className="recipe-summary-metric">
                      <span className="metric-label">{isAr ? 'صافي الربح:' : 'Net Profit:'}</span>
                      <span className="metric-val profit-text">
                        +{fin.net_profit} {currencySymbol} ({fin.margin_percent}%)
                      </span>
                    </div>
                  </div>
                )}

                <div className="mgmt-card-actions">
                  <button
                    onClick={() => setEditingBouquet(p)}
                    className="btn-edit-prod"
                    title={isAr ? 'تعديل بيانات وصور وفيديو البوكيه' : 'Edit Bouquet & Media'}
                  >
                    <Edit3 size={15} />
                    <span>{isAr ? 'تعديل والوسائط ✏️' : 'Edit & Media'}</span>
                  </button>

                  <button
                    onClick={() => setSelectedBouquetForRecipe(p)}
                    className="btn-open-recipe"
                    title={isAr ? 'تخصيص الخامات وحساب الأرباح' : 'Customize Recipe & Profit'}
                  >
                    <Scissors size={14} />
                    <span>{isAr ? 'الخامات والربح' : 'Recipe'}</span>
                  </button>

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

      {/* Bouquet Edit or Create Modal */}
      {(editingBouquet || isCreatingBouquet) && (
        <BouquetEditModal
          product={editingBouquet}
          isNew={isCreatingBouquet}
          isOpen={!!editingBouquet || isCreatingBouquet}
          onClose={() => {
            setEditingBouquet(null);
            setIsCreatingBouquet(false);
          }}
          onSaveSuccess={() => {
            setProducts(getStoredProducts());
          }}
        />
      )}

      {/* Bouquet Customization & Recipe Modal */}
      {selectedBouquetForRecipe && (
        <BouquetRecipeModal
          product={selectedBouquetForRecipe}
          initialRecipe={
            bouquetFinancialsMap[selectedBouquetForRecipe.id]?.recipe ||
            getBouquetRecipe(selectedBouquetForRecipe.id)
          }
          isOpen={!!selectedBouquetForRecipe}
          onClose={() => setSelectedBouquetForRecipe(null)}
          onSaveSuccess={handleRecipeSaveSuccess}
        />
      )}
    </div>
  );
}
