import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MOCK_ORDERS, CURRENCY, ORDER_STATUSES, STORE_INFO } from '../../config/constants.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import {
  calculateOrderFinancials,
  deductMaterialsForOrder,
  restoreMaterialsForOrder,
  checkOrderStockAvailability,
  calculateOrdersAnalytics,
} from '../../utils/recipeInventoryManager.js';
import {
  Search,
  Eye,
  MessageCircle,
  Printer,
  X,
  TrendingUp,
  Scissors,
  DollarSign,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import './OrdersPage.css';

export default function OrdersPage() {
  const { i18n } = useTranslation();
  const { showSuccess, showError } = useNotification();
  const isAr = i18n.language === 'ar';
  const currencySymbol = isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en;

  const [orders, setOrders] = useState(() => {
    try {
      const local = JSON.parse(localStorage.getItem('al_ward_orders') || '[]');
      const combined = [
        ...(Array.isArray(local) ? local : []),
        ...(Array.isArray(MOCK_ORDERS) ? MOCK_ORDERS : []),
      ];
      // Enrich each order with accurate financials
      return combined.map((ord) => {
        const fin = ord.financials || calculateOrderFinancials(ord);
        return {
          ...ord,
          financials: fin,
        };
      });
    } catch {
      return (Array.isArray(MOCK_ORDERS) ? MOCK_ORDERS : []).map((ord) => ({
        ...ord,
        financials: calculateOrderFinancials(ord),
      }));
    }
  });

  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Overall financial summary for all active orders
  const analytics = useMemo(() => {
    return calculateOrdersAnalytics(orders);
  }, [orders]);

  const handleManualDeduct = (orderId) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    if (targetOrder.is_inventory_deducted) {
      showError(isAr ? 'تم خصم خامات هذا الطلب مسبقاً من المخزون' : 'Materials already deducted');
      return;
    }

    const availability = checkOrderStockAvailability(targetOrder);
    if (!availability.isAvailable) {
      const shortageNames = availability.shortages
        .map((s) => `${isAr ? s.name_ar : s.name_en} (عجز: ${s.shortage})`)
        .join('، ');
      showError(
        isAr
          ? `رصيد المستودع غير كافٍ لإنتاج هذا الطلب: ${shortageNames}`
          : `Insufficient stock for order: ${shortageNames}`
      );
      return;
    }

    const res = deductMaterialsForOrder(targetOrder);
    if (res.success) {
      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId
            ? { ...o, is_inventory_deducted: true, financials: res.financials }
            : o
        )
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev) => ({
          ...prev,
          is_inventory_deducted: true,
          financials: res.financials,
        }));
      }
      showSuccess(
        isAr
          ? `تم خصم خامات الطلب (#${orderId}) من رصيد المستودع بنجاح 🌿`
          : `Order #${orderId} raw materials deducted from inventory! 🌿`
      );
    } else {
      showError(res.reason || (isAr ? 'تعذر خصم الخامات' : 'Failed to deduct materials'));
    }
  };

  const handleStatusChange = (orderId, newStatus) => {
    const targetOrder = orders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    let updatedOrder = { ...targetOrder, status: newStatus };

    // 1. If cancelling an order that was previously deducted, restore materials to inventory
    if (newStatus === 'cancelled' && targetOrder.is_inventory_deducted) {
      const rollbackRes = restoreMaterialsForOrder(targetOrder);
      if (rollbackRes.success) {
        updatedOrder.is_inventory_deducted = false;
        showSuccess(
          isAr
            ? `تم إلغاء الطلب واسترجاع كافة الخامات المخصومة (${rollbackRes.restorations?.length || 0}) إلى رصيد المستودع 🌿`
            : `Order cancelled and materials restored to inventory! 🌿`
        );
      }
    }

    // 2. If moving to processing/completed and not yet deducted, check availability & auto-deduct
    if ((newStatus === 'processing' || newStatus === 'completed') && !targetOrder.is_inventory_deducted) {
      const availability = checkOrderStockAvailability(targetOrder);
      if (!availability.isAvailable) {
        const shortageNames = availability.shortages
          .map((s) => `${isAr ? s.name_ar : s.name_en} (-${s.shortage})`)
          .join('، ');
        showError(
          isAr
            ? `تنبيه نقص المخزون: لا توجد خامات كافية لتجهيز الطلب (${shortageNames})`
            : `Warning: Insufficient materials (${shortageNames})`
        );
      } else {
        const deductRes = deductMaterialsForOrder(targetOrder);
        if (deductRes.success) {
          updatedOrder.is_inventory_deducted = true;
          updatedOrder.financials = deductRes.financials;
          showSuccess(
            isAr
              ? `تم تحديث الحالة لـ (${newStatus}) وخصم الخامات من المستودع بنجاح 🌿`
              : `Order status set to ${newStatus} & materials deducted!`
          );
        }
      }
    }

    const updated = orders.map((o) => (o.id === orderId ? updatedOrder : o));
    setOrders(updated);

    // Update in selected order modal if open
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(updatedOrder);
    }

    try {
      const local = JSON.parse(localStorage.getItem('al_ward_orders') || '[]');
      const modifiedLocal = local.map((o) => (o.id === orderId ? { ...o, ...updatedOrder } : o));
      localStorage.setItem('al_ward_orders', JSON.stringify(modifiedLocal));
    } catch (e) {
      console.error('Error saving updated order status:', e);
    }

    showSuccess(isAr ? `تم تحديث حالة الطلب إلى (${newStatus}) بنجاح` : `Order status updated to ${newStatus}`);
  };

  const handleWhatsAppCustomer = (order) => {
    const text = isAr
      ? `مرحباً أستاذ/ة ${order.customer_name}، نتواصل معكم من متجر "الورد للورد" بخصوص طلبكم رقم (${order.id}) 🌹\nحالة الطلب الحالية: ${ORDER_STATUSES[order.status]?.label_ar || order.status}`
      : `Hello ${order.customer_name}, contacting you from Al-Ward regarding order #${order.id} 🌹`;
    const cleanDigits = (order.customer_phone || '').replace(/\D/g, '');
    const waPhone = cleanDigits.startsWith('0') ? `2${cleanDigits}` : cleanDigits;
    window.open(`https://wa.me/${waPhone || STORE_INFO.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredOrders = orders.filter((o) => {
    // Tab filter
    if (activeTab !== 'all' && o.status !== activeTab) return false;
    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = (o.customer_name || '').toLowerCase().includes(q);
      const matchPhone = (o.customer_phone || '').toLowerCase().includes(q);
      const matchId = (o.id || '').toLowerCase().includes(q);
      return matchName || matchPhone || matchId;
    }
    return true;
  });

  return (
    <div className="orders-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isAr ? 'إدارة ومتابعة الطلبات والأرباح' : 'Order & Profit Management'}</h1>
          <p className="page-desc">
            {isAr
              ? 'متابعة الطلبات، خصم الخامات من المخزون، وحساب صافي الربح الحقيقي لكل بوكيه'
              : 'Fulfill orders, deduct bouquet materials from inventory & track net profit accurately'}
          </p>
        </div>
      </div>

      {/* Top Financial KPI Summary Cards */}
      <div className="orders-financial-kpis-grid">
        <div className="orders-kpi-card glass">
          <div className="kpi-icon-wrap revenue-icon">
            <DollarSign size={22} />
          </div>
          <div className="kpi-data">
            <span className="kpi-label">{isAr ? 'إجمالي المبيعات' : 'Total Revenue'}</span>
            <div className="kpi-val">
              <span>{analytics.total_revenue}</span>
              <small>{currencySymbol}</small>
            </div>
            <span className="kpi-sub">{orders.length} {isAr ? 'طلب مسجل' : 'orders'}</span>
          </div>
        </div>

        <div className="orders-kpi-card glass">
          <div className="kpi-icon-wrap cost-icon">
            <Scissors size={22} />
          </div>
          <div className="kpi-data">
            <span className="kpi-label">{isAr ? 'إجمالي تكلفة الخامات' : 'Raw Materials Cost'}</span>
            <div className="kpi-val">
              <span>{analytics.total_material_cost}</span>
              <small>{currencySymbol}</small>
            </div>
            <span className="kpi-sub">{isAr ? 'خامات وورود وأوشحة مستهلكة' : 'Deducted inventory items'}</span>
          </div>
        </div>

        <div className="orders-kpi-card glass highlight-profit">
          <div className="kpi-icon-wrap profit-icon">
            <TrendingUp size={22} />
          </div>
          <div className="kpi-data">
            <span className="kpi-label">{isAr ? 'صافي الربح الفعلي' : 'Net Realized Profit'}</span>
            <div className="kpi-val profit-val">
              <span>+{analytics.total_net_profit}</span>
              <small>{currencySymbol}</small>
            </div>
            <span className="kpi-sub">{isAr ? 'صافي الأرباح بعد خصم كافة الخامات' : 'Revenue minus material cost'}</span>
          </div>
        </div>

        <div className="orders-kpi-card glass">
          <div className="kpi-icon-wrap margin-icon">
            <Sparkles size={22} />
          </div>
          <div className="kpi-data">
            <span className="kpi-label">{isAr ? 'متوسط هامش الربح' : 'Average Margin'}</span>
            <div className="kpi-val margin-val">
              <span>{analytics.avg_margin}%</span>
            </div>
            <span className="kpi-sub">{isAr ? 'مؤشر ربحية ممتاز' : 'Healthy atelier margins'}</span>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="orders-toolbar glass">
        <div className="orders-tabs">
          {[
            { id: 'all', label_ar: 'كافة الطلبات', label_en: 'All Orders' },
            { id: 'new', label_ar: 'جديدة', label_en: 'New' },
            { id: 'processing', label_ar: 'قيد التنسيق', label_en: 'Processing' },
            { id: 'completed', label_ar: 'مكتملة', label_en: 'Completed' },
            { id: 'cancelled', label_ar: 'ملغاة', label_en: 'Cancelled' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            >
              <span>{isAr ? tab.label_ar : tab.label_en}</span>
              <span className="tab-count">
                {tab.id === 'all' ? orders.length : orders.filter((o) => o.status === tab.id).length}
              </span>
            </button>
          ))}
        </div>

        <div className="orders-search-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder={isAr ? 'ابحث بالاسم، الجوال، أو رقم الطلب...' : 'Search by name, phone, or order ID...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="orders-card glass">
        <div className="table-responsive">
          <table className="orders-data-table">
            <thead>
              <tr>
                <th>{isAr ? 'رقم الطلب' : 'Order ID'}</th>
                <th>{isAr ? 'العميل' : 'Customer'}</th>
                <th>{isAr ? 'التاريخ' : 'Date'}</th>
                <th>{isAr ? 'قيمة الطلب' : 'Revenue'}</th>
                <th>{isAr ? 'تكلفة الخامات' : 'Materials Cost'}</th>
                <th>{isAr ? 'صافي الربح' : 'Net Profit'}</th>
                <th>{isAr ? 'خصم المخزون' : 'Inventory'}</th>
                <th>{isAr ? 'الحالة' : 'Status'}</th>
                <th>{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((ord) => {
                  const fin = ord.financials || calculateOrderFinancials(ord);
                  return (
                    <tr key={ord.id}>
                      <td className="cell-id">{ord.id}</td>
                      <td>
                        <div className="cell-customer">
                          <span className="c-name">{ord.customer_name}</span>
                          <span className="c-phone">{ord.customer_phone}</span>
                          <span className="c-loc-sub">{ord.city}</span>
                        </div>
                      </td>
                      <td className="cell-date">
                        {ord.created_at
                          ? new Date(ord.created_at).toLocaleDateString(isAr ? 'ar-EG' : 'en-US')
                          : (isAr ? 'اليوم' : 'Today')}
                      </td>
                      <td className="cell-total">
                        <strong>{ord.total_price} {currencySymbol}</strong>
                      </td>
                      <td className="cell-cost">
                        <span className="order-cost-chip">
                          {fin.total_material_cost} {currencySymbol}
                        </span>
                      </td>
                      <td className="cell-profit">
                        <span className="order-profit-badge">
                          +{fin.net_profit} {currencySymbol}
                          <small>({fin.margin_percent}%)</small>
                        </span>
                      </td>
                      <td className="cell-inventory-status">
                        {ord.is_inventory_deducted ? (
                          <span className="deduction-badge-done" title={isAr ? 'تم خصم الخامات من المخزون' : 'Deducted'}>
                            <CheckCircle2 size={13} />
                            <span>{isAr ? 'تم الخصم' : 'Deducted'}</span>
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleManualDeduct(ord.id)}
                            className="btn-deduct-inline"
                            title={isAr ? 'خصم خامات هذا الطلب من المخزون' : 'Deduct materials now'}
                          >
                            <Scissors size={12} />
                            <span>{isAr ? 'خصم الخامات' : 'Deduct'}</span>
                          </button>
                        )}
                      </td>
                      <td>
                        <span className={`status-pill pill-${ord.status}`}>
                          {ORDER_STATUSES[ord.status]?.[isAr ? 'label_ar' : 'label_en'] || ord.status}
                        </span>
                      </td>
                      <td>
                        <div className="cell-actions">
                          <button
                            onClick={() => setSelectedOrder(ord)}
                            className="table-action-btn view-btn"
                            title={isAr ? 'عرض تفاصيل الطلب والخامات' : 'View Details & Materials'}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleWhatsAppCustomer(ord)}
                            className="table-action-btn wa-action-btn"
                            title={isAr ? 'تواصل عبر واتساب' : 'WhatsApp Customer'}
                          >
                            <MessageCircle size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={9} className="no-orders-row">
                    {isAr ? 'لا توجد طلبات تطابق معايير البحث الحالية' : 'No orders found matching criteria'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-modal glass animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-id">{selectedOrder.id}</span>
                <h2>{isAr ? 'تفاصيل الطلب والبوكيه وتحليل الأرباح' : 'Order & Profit Breakdown'}</h2>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Customer Info */}
              <div className="modal-info-section">
                <h3>{isAr ? 'معلومات العميل والتسليم' : 'Customer & Delivery'}</h3>
                <div className="info-grid">
                  <div>
                    <label>{isAr ? 'الاسم:' : 'Name:'}</label>
                    <span>{selectedOrder.customer_name}</span>
                  </div>
                  <div>
                    <label>{isAr ? 'الجوال:' : 'Phone:'}</label>
                    <span>{selectedOrder.customer_phone}</span>
                  </div>
                  <div>
                    <label>{isAr ? 'المدينة والحي:' : 'Location:'}</label>
                    <span>{selectedOrder.city} {selectedOrder.district ? `- ${selectedOrder.district}` : ''}</span>
                  </div>
                  <div>
                    <label>{isAr ? 'طريقة الدفع:' : 'Payment:'}</label>
                    <span>{selectedOrder.payment_method || (isAr ? 'تأكيد واتساب' : 'WhatsApp')}</span>
                  </div>
                </div>

                {selectedOrder.is_gift && (
                  <div className="gift-alert-box">
                    <strong>🎁 {isAr ? 'طلب هدية خاصة' : 'Surprise Gift Order'}</strong>
                    <p>{isAr ? `المستلم: ${selectedOrder.recipient_name || 'غير محدد'} (${selectedOrder.recipient_phone || ''})` : `Recipient: ${selectedOrder.recipient_name}`}</p>
                  </div>
                )}
              </div>

              {/* Status Switcher in Modal */}
              <div className="modal-status-section">
                <label>{isAr ? 'تحديث حالة الطلب:' : 'Update Order Status:'}</label>
                <div className="status-buttons-row">
                  {Object.entries(ORDER_STATUSES).map(([key, info]) => (
                    <button
                      key={key}
                      onClick={() => handleStatusChange(selectedOrder.id, key)}
                      className={`status-chip ${selectedOrder.status === key ? 'active' : ''}`}
                    >
                      {isAr ? info.label_ar : info.label_en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Items List */}
              <div className="modal-items-section">
                <h3>{isAr ? 'البوكيهات المطلوبة' : 'Items Ordered'}</h3>
                <div className="modal-items-list">
                  {(selectedOrder.items || []).map((it, idx) => (
                    <div key={idx} className="modal-item-row">
                      <span>{it.name || it.id} x{it.quantity}</span>
                      <span>{it.price * it.quantity} {currencySymbol}</span>
                    </div>
                  ))}
                </div>
                <div className="modal-total-row">
                  <span>{isAr ? 'المجموع الإجمالي' : 'Total Price'}</span>
                  <span>{selectedOrder.total_price} {currencySymbol}</span>
                </div>
              </div>

              {/* Raw Materials Deducted & Net Profit Breakdown Section */}
              <div className="modal-profit-section glass-gold">
                <div className="profit-section-header">
                  <div>
                    <h3 className="section-gold-title">
                      <Scissors size={18} />
                      <span>{isAr ? 'تحليل استهلاك الخامات وصافي الربح الدقيق' : 'Raw Materials & Net Profit Analysis'}</span>
                    </h3>
                    <p className="section-gold-desc">
                      {isAr
                        ? 'تفاصيل كل خامة ووردة وأوشحة تم استهلاكها من المخزون لهذا الطلب'
                        : 'Exact breakdown of raw materials consumed from inventory for this order'}
                    </p>
                  </div>

                  <div className="deduction-status-pill-wrap">
                    {selectedOrder.is_inventory_deducted ? (
                      <span className="deduction-badge-done large">
                        <CheckCircle2 size={16} />
                        <span>{isAr ? 'تم خصم الخامات من المخزون ✓' : 'Inventory Deducted ✓'}</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleManualDeduct(selectedOrder.id)}
                        className="btn-deduct-now"
                      >
                        <Scissors size={14} />
                        <span>{isAr ? 'خصم الخامات من المخزون الآن 🌿' : 'Deduct from Inventory Now'}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Materials Breakdown Table */}
                {selectedOrder.financials?.materials_deducted?.length > 0 ? (
                  <div className="modal-materials-table-wrap">
                    <table className="modal-materials-table">
                      <thead>
                        <tr>
                          <th>{isAr ? 'الخامة / الوردة' : 'Material'}</th>
                          <th>{isAr ? 'الكمية المستهلكة' : 'Consumed Qty'}</th>
                          <th>{isAr ? 'تكلفة الوحدة' : 'Unit Cost'}</th>
                          <th>{isAr ? 'إجمالي التكلفة' : 'Total Cost'}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.financials.materials_deducted.map((mat, mIdx) => (
                          <tr key={mIdx}>
                            <td>
                              <strong>{isAr ? mat.raw_name_ar : mat.raw_name_en}</strong>
                              <span className="mat-source-bouquet">{mat.bouquet_name}</span>
                            </td>
                            <td>
                              <span className="mat-qty-chip">
                                {mat.quantity} {mat.unit_ar}
                              </span>
                            </td>
                            <td>
                              {mat.cost_per_unit} {currencySymbol}
                            </td>
                            <td>
                              <strong>{mat.total_cost} {currencySymbol}</strong>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="no-mat-hint">
                    {isAr
                      ? 'يتم احتساب الخامات تلقائياً بناءً على تركيبة البوكيه المحددة في الكتالوج.'
                      : 'Materials calculated based on catalog bouquet recipes.'}
                  </p>
                )}

                {/* Final Order Net Profit Summary Box */}
                <div className="order-net-profit-summary">
                  <div className="profit-box-item">
                    <span className="box-item-label">{isAr ? 'إجمالي قيمة الطلب' : 'Order Revenue'}</span>
                    <strong className="box-item-val revenue-val">
                      {selectedOrder.total_price} {currencySymbol}
                    </strong>
                  </div>
                  <div className="profit-box-item minus">
                    <span className="box-item-label">{isAr ? 'إجمالي تكلفة الخامات' : 'Material Cost'}</span>
                    <strong className="box-item-val cost-val">
                      -{selectedOrder.financials?.total_material_cost || 0} {currencySymbol}
                    </strong>
                  </div>
                  <div className="profit-box-item equal">
                    <span className="box-item-label">{isAr ? 'صافي الربح الدقيق' : 'Net Realized Profit'}</span>
                    <strong className="box-item-val profit-val-highlight">
                      +{selectedOrder.financials?.net_profit || 0} {currencySymbol}
                    </strong>
                  </div>
                  <div className="profit-box-item margin">
                    <span className="box-item-label">{isAr ? 'نسبة هامش الربح' : 'Margin %'}</span>
                    <strong className="box-item-val margin-val-highlight">
                      {selectedOrder.financials?.margin_percent || 0}%
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                onClick={() => handleWhatsAppCustomer(selectedOrder)}
                className="btn-modal-wa"
              >
                <MessageCircle size={18} />
                <span>{isAr ? 'مراسلة العميل عبر واتساب' : 'Chat via WhatsApp'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="btn-modal-print"
              >
                <Printer size={18} />
                <span>{isAr ? 'طباعة الفاتورة' : 'Print Invoice'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

