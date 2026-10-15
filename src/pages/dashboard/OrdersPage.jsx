import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MOCK_ORDERS, CURRENCY, ORDER_STATUSES, STORE_INFO } from '../../config/constants.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import {
  Search,
  Eye,
  MessageCircle,
  Printer,
  X,
} from 'lucide-react';
import './OrdersPage.css';

export default function OrdersPage() {
  const { i18n } = useTranslation();
  const { showSuccess } = useNotification();
  const isAr = i18n.language === 'ar';
  const currencySymbol = isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en;

  const [orders, setOrders] = useState(() => {
    try {
      const local = JSON.parse(localStorage.getItem('al_ward_orders') || '[]');
      return [
        ...(Array.isArray(local) ? local : []),
        ...(Array.isArray(MOCK_ORDERS) ? MOCK_ORDERS : []),
      ];
    } catch {
      return Array.isArray(MOCK_ORDERS) ? MOCK_ORDERS : [];
    }
  });
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleStatusChange = (orderId, newStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    setOrders(updated);

    // Update in selected order modal if open
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }

    const local = JSON.parse(localStorage.getItem('al_ward_orders') || '[]');
    const modifiedLocal = local.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    localStorage.setItem('al_ward_orders', JSON.stringify(modifiedLocal));

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
          <h1 className="page-title">{isAr ? 'إدارة ومتابعة الطلبات' : 'Order Management'}</h1>
          <p className="page-desc">{isAr ? 'عرض وتنسيق وحالات كافة طلبات البوكيهات' : 'Fulfill and track customer bouquet requests'}</p>
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
                <th>{isAr ? 'العنوان' : 'Delivery Address'}</th>
                <th>{isAr ? 'التاريخ' : 'Date'}</th>
                <th>{isAr ? 'المجموع' : 'Total'}</th>
                <th>{isAr ? 'الحالة' : 'Status'}</th>
                <th>{isAr ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((ord) => (
                  <tr key={ord.id}>
                    <td className="cell-id">{ord.id}</td>
                    <td>
                      <div className="cell-customer">
                        <span className="c-name">{ord.customer_name}</span>
                        <span className="c-phone">{ord.customer_phone}</span>
                      </div>
                    </td>
                    <td>
                      <span className="c-loc">{ord.city} {ord.district ? `- ${ord.district}` : ''}</span>
                    </td>
                    <td className="cell-date">
                      {ord.created_at ? new Date(ord.created_at).toLocaleDateString(isAr ? 'ar-EG' : 'en-US') : (isAr ? 'اليوم' : 'Today')}
                    </td>
                    <td className="cell-total">
                      {ord.total_price} {currencySymbol}
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
                          title={isAr ? 'عرض التفاصيل' : 'View Details'}
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
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="no-orders-row">
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
                <h2>{isAr ? 'تفاصيل الطلب والبوكيه' : 'Order & Bouquet Details'}</h2>
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
