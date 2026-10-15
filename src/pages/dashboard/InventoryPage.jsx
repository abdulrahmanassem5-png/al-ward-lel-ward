import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MOCK_INVENTORY, CURRENCY } from '../../config/constants.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import { Boxes, Plus, AlertTriangle, CheckCircle2, XCircle, Search, RefreshCw, X } from 'lucide-react';
import './InventoryPage.css';

export default function InventoryPage() {
  const { t, i18n } = useTranslation();
  const { showSuccess } = useNotification();
  const isAr = i18n.language === 'ar';
  const currencySymbol = isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en;

  const [inventory, setInventory] = useState(() => (Array.isArray(MOCK_INVENTORY) ? MOCK_INVENTORY : []));
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
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

  const handleAdjustQuantity = (id, delta) => {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const next = Math.max(0, item.quantity + delta);
          return { ...item, quantity: next };
        }
        return item;
      })
    );
    showSuccess(isAr ? 'تم تعديل كمية المخزون' : 'Inventory adjusted');
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    const created = {
      id: `${Date.now()}`,
      name_ar: newItem.name_ar,
      name_en: newItem.name_en || newItem.name_ar,
      quantity: parseInt(newItem.quantity) || 0,
      unit_ar: newItem.unit_ar,
      unit_en: newItem.unit_en,
      reorder_level: parseInt(newItem.reorder_level) || 10,
      cost_per_unit: parseFloat(newItem.cost_per_unit) || 5,
      supplier_ar: newItem.supplier_ar || 'مورد محلي',
      supplier_en: newItem.supplier_en || 'Local Supplier',
    };
    setInventory([created, ...inventory]);
    setShowAddModal(false);
    showSuccess(isAr ? 'تمت إضافة المادة إلى المخزون' : 'Item added to inventory');
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

  const filteredItems = inventory.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      (item.name_ar || '').toLowerCase().includes(q) ||
      (item.name_en || '').toLowerCase().includes(q) ||
      (item.supplier_ar || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="inventory-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isAr ? 'المخزون والمواد الخام' : 'Raw Materials & Inventory'}</h1>
          <p className="page-desc">
            {isAr ? 'متابعة نضارة السيقان، التغليف، الأشرطة، وإعادة الطلب' : 'Track stems, packaging, ribbons & restock alerts'}
          </p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-add-inventory">
          <Plus size={18} />
          <span>{isAr ? 'إضافة مادة خام' : 'Add Material'}</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="inventory-toolbar glass">
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder={isAr ? 'ابحث عن سيقان زهور، تغليف، مورد...' : 'Search flowers, packaging, supplier...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="inventory-summary-pills">
          <span className="pill-metric">
            {isAr ? `إجمالي المواد: ${inventory.length}` : `Total Items: ${inventory.length}`}
          </span>
          <span className="pill-metric warning">
            {isAr
              ? `منخفضة المخزون: ${inventory.filter((i) => i.quantity <= i.reorder_level).length}`
              : `Low Stock: ${inventory.filter((i) => i.quantity <= i.reorder_level).length}`}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="inventory-card glass">
        <div className="table-responsive">
          <table className="inventory-table">
            <thead>
              <tr>
                <th>{isAr ? 'اسم المادة' : 'Material'}</th>
                <th>{isAr ? 'الكمية المتوفرة' : 'Current Stock'}</th>
                <th>{isAr ? 'حد إعادة الطلب' : 'Reorder Level'}</th>
                <th>{isAr ? 'التكلفة للوحدة' : 'Unit Cost'}</th>
                <th>{isAr ? 'المورّد' : 'Supplier'}</th>
                <th>{isAr ? 'الحالة' : 'Status'}</th>
                <th>{isAr ? 'تعديل سريع' : 'Adjust'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const isLow = item.quantity <= item.reorder_level;
                const isOut = item.quantity === 0;

                return (
                  <tr key={item.id}>
                    <td>
                      <div className="mat-name-cell">
                        <span className="mat-title">{isAr ? item.name_ar : item.name_en}</span>
                        <span className="mat-unit">{isAr ? item.unit_ar : item.unit_en}</span>
                      </div>
                    </td>
                    <td>
                      <span className="mat-qty">{item.quantity}</span>
                    </td>
                    <td>{item.reorder_level}</td>
                    <td>
                      {item.cost_per_unit} {currencySymbol}
                    </td>
                    <td>{isAr ? item.supplier_ar : item.supplier_en}</td>
                    <td>
                      {isOut ? (
                        <span className="inv-badge badge-out">{isAr ? 'نفد' : 'Out of Stock'}</span>
                      ) : isLow ? (
                        <span className="inv-badge badge-low">{isAr ? 'منخفض' : 'Low Stock'}</span>
                      ) : (
                        <span className="inv-badge badge-ok">{isAr ? 'متوفر' : 'In Stock'}</span>
                      )}
                    </td>
                    <td>
                      <div className="adjust-buttons">
                        <button
                          onClick={() => handleAdjustQuantity(item.id, -5)}
                          className="btn-adj minus"
                          title="-5"
                        >
                          -5
                        </button>
                        <button
                          onClick={() => handleAdjustQuantity(item.id, 10)}
                          className="btn-adj plus"
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

      {/* Add Material Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="add-modal glass animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isAr ? 'إضافة مادة خام جديدة' : 'Add Raw Material'}</h2>
              <button onClick={() => setShowAddModal(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddItem} className="add-form">
              <div className="form-group">
                <label>{isAr ? 'اسم المادة بالعربية *' : 'Material Name (Arabic) *'}</label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'مثال: ورق تغليف أسود مذهب' : 'e.g. Black gold wrapper'}
                  value={newItem.name_ar}
                  onChange={(e) => setNewItem({ ...newItem, name_ar: e.target.value })}
                />
              </div>

              <div className="form-row-two">
                <div className="form-group">
                  <label>{isAr ? 'الكمية المتوفرة' : 'Current Quantity'}</label>
                  <input
                    type="number"
                    required
                    placeholder="50"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>{isAr ? 'الوحدة' : 'Unit'}</label>
                  <input
                    type="text"
                    placeholder={isAr ? 'ساق / رول / كرتون' : 'stem / roll'}
                    value={newItem.unit_ar}
                    onChange={(e) => setNewItem({ ...newItem, unit_ar: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row-two">
                <div className="form-group">
                  <label>{isAr ? 'حد التنبيه (إعادة الطلب)' : 'Reorder Level'}</label>
                  <input
                    type="number"
                    value={newItem.reorder_level}
                    onChange={(e) => setNewItem({ ...newItem, reorder_level: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>{isAr ? 'تكلفة الوحدة (ج.م)' : 'Unit Cost (EGP)'}</label>
                  <input
                    type="number"
                    placeholder="8.5"
                    value={newItem.cost_per_unit}
                    onChange={(e) => setNewItem({ ...newItem, cost_per_unit: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>{isAr ? 'اسم المورّد' : 'Supplier Name'}</label>
                <input
                  type="text"
                  placeholder={isAr ? 'مثال: مؤسسة الزهور الهولندية' : 'e.g. Dutch Flowers Co'}
                  value={newItem.supplier_ar}
                  onChange={(e) => setNewItem({ ...newItem, supplier_ar: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-modal-save">
                <span>{isAr ? 'إضافة للمخزون' : 'Save to Inventory'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
