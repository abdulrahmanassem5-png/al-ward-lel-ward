import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MOCK_ORDERS, MOCK_INVENTORY, CURRENCY } from '../../config/constants.js';
import {
  TrendingUp,
  ShoppingBag,
  Flower2,
  AlertTriangle,
  ChevronRight,
  ArrowUpRight,
  QrCode,
  Plus,
  Boxes,
} from 'lucide-react';
import './DashboardHome.css';

export default function DashboardHome() {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const currencySymbol = isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en;

  const [orders, setOrders] = useState(() => {
    try {
      const localOrders = JSON.parse(localStorage.getItem('al_ward_orders') || '[]');
      const combined = [
        ...(Array.isArray(localOrders) ? localOrders : []),
        ...(Array.isArray(MOCK_ORDERS) ? MOCK_ORDERS : []),
      ];
      return combined.slice(0, 5);
    } catch {
      return Array.isArray(MOCK_ORDERS) ? MOCK_ORDERS.slice(0, 5) : [];
    }
  });

  const updateOrderStatus = (orderId, newStatus) => {
    const updated = orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o));
    setOrders(updated);
    try {
      const local = JSON.parse(localStorage.getItem('al_ward_orders') || '[]');
      const modifiedLocal = Array.isArray(local)
        ? local.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        : [];
      localStorage.setItem('al_ward_orders', JSON.stringify(modifiedLocal));
    } catch {
      // ignore
    }
  };

  const lowStockItems = (Array.isArray(MOCK_INVENTORY) ? MOCK_INVENTORY : []).filter(
    (item) => (item.quantity ?? 0) <= (item.reorder_level ?? 10)
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case 'new':
        return <span className="status-badge badge-new">{isAr ? 'جديد' : 'New'}</span>;
      case 'processing':
        return <span className="status-badge badge-processing">{isAr ? 'قيد التنسيق' : 'Crafting'}</span>;
      case 'completed':
        return <span className="status-badge badge-completed">{isAr ? 'مكتمل' : 'Completed'}</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  return (
    <div className="dashboard-home">
      {/* KPI Cards Row */}
      <div className="kpi-grid">
        <div className="kpi-card glass">
          <div className="kpi-header">
            <span className="kpi-title">{isAr ? 'مبيعات اليوم' : "Today's Sales"}</span>
            <div className="kpi-icon-wrap gold">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="kpi-number">
            3,850 <small>{currencySymbol}</small>
          </div>
          <span className="kpi-trend positive">
            <ArrowUpRight size={14} /> +18.4% {isAr ? 'مقارنة بالأمس' : 'vs yesterday'}
          </span>
        </div>

        <div className="kpi-card glass">
          <div className="kpi-header">
            <span className="kpi-title">{isAr ? 'الطلبات النشطة' : 'Active Orders'}</span>
            <div className="kpi-icon-wrap rose">
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="kpi-number">
            12 <small>{isAr ? 'طلب' : 'orders'}</small>
          </div>
          <span className="kpi-subtitle">
            3 {isAr ? 'طلبات جديدة تحتاج تأكيد' : 'new orders awaiting confirmation'}
          </span>
        </div>

        <div className="kpi-card glass">
          <div className="kpi-header">
            <span className="kpi-title">{isAr ? 'بوكيهات صُنعت هذا الأسبوع' : 'Bouquets Crafted'}</span>
            <div className="kpi-icon-wrap green">
              <Flower2 size={20} />
            </div>
          </div>
          <div className="kpi-number">
            54 <small>{isAr ? 'بوكيه' : 'stems'}</small>
          </div>
          <span className="kpi-trend positive">
            <ArrowUpRight size={14} /> +12% {isAr ? 'عن الأسبوع الماضي' : 'vs last week'}
          </span>
        </div>

        <div className="kpi-card glass">
          <div className="kpi-header">
            <span className="kpi-title">{isAr ? 'تنبيهات المواد والمخزون' : 'Inventory Alerts'}</span>
            <div className="kpi-icon-wrap amber">
              <AlertTriangle size={20} />
            </div>
          </div>
          <div className="kpi-number">
            {lowStockItems.length} <small>{isAr ? 'مواد منخفضة' : 'low stock'}</small>
          </div>
          <span className="kpi-subtitle warning-text">
            {isAr ? 'يلزم إعادة طلب أشرطة وزهور' : 'Reorder ribbons & stems'}
          </span>
        </div>
      </div>

      {/* Charts & Quick Actions Row */}
      <div className="dashboard-grid-two">
        {/* Visual Weekly Sales SVG Chart */}
        <div className="chart-card glass">
          <div className="chart-card-header">
            <div>
              <h3>{isAr ? 'منحنى الإيرادات الأسبوعية' : 'Weekly Revenue Curve'}</h3>
              <p>{isAr ? 'توزيع المبيعات خلال الأيام السبعة الماضية' : 'Sales performance over the past 7 days'}</p>
            </div>
            <span className="chart-total-pill">
              {isAr ? 'إجمالي الأسبوع: 24,150 ج.م' : 'Week Total: 24,150 EGP'}
            </span>
          </div>

          <div className="chart-svg-container">
            <svg viewBox="0 0 600 200" className="revenue-svg">
              <defs>
                <linearGradient id="goldCurve" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4A853" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#D4A853" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="40" x2="600" y2="40" stroke="rgba(255,255,255,0.05)" />
              <line x1="0" y1="90" x2="600" y2="90" stroke="rgba(255,255,255,0.05)" />
              <line x1="0" y1="140" x2="600" y2="140" stroke="rgba(255,255,255,0.05)" />

              {/* Area */}
              <polygon
                points="20,160 100,120 180,140 260,80 340,95 420,50 500,65 580,30 580,180 20,180"
                fill="url(#goldCurve)"
              />
              {/* Line */}
              <polyline
                fill="none"
                stroke="#D4A853"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points="20,160 100,120 180,140 260,80 340,95 420,50 500,65 580,30"
              />
              {/* Coordinate Dots */}
              {[
                [20, 160, 'السبت'],
                [100, 120, 'الأحد'],
                [180, 140, 'الاثنين'],
                [260, 80, 'الثلاثاء'],
                [340, 95, 'الأربعاء'],
                [420, 50, 'الخميس'],
                [500, 65, 'الجمعة'],
                [580, 30, 'اليوم'],
              ].map(([x, y, day], i) => (
                <g key={i}>
                  <circle cx={x} cy={y} r="5" fill="#E8C87A" stroke="#0A0A0A" strokeWidth="2" />
                  <text x={x} y="195" fill="rgba(255,255,255,0.5)" fontSize="11" textAnchor="middle">
                    {day}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Quick Operations & Low Stock */}
        <div className="operations-card glass">
          <h3 className="section-title-sm">{isAr ? 'إجراءات سريعة' : 'Quick Actions'}</h3>
          <div className="quick-actions-list">
            <Link to="/dashboard/products" className="quick-action-btn">
              <Plus size={18} />
              <span>{isAr ? 'إضافة بوكيه جديد للكتالوج' : 'Add New Bouquet'}</span>
            </Link>
            <Link to="/dashboard/qr-codes" className="quick-action-btn">
              <QrCode size={18} />
              <span>{isAr ? 'توليد وطباعة باركود إهداء' : 'Print Dedicated QR Tag'}</span>
            </Link>
            <Link to="/dashboard/inventory" className="quick-action-btn">
              <Boxes size={18} />
              <span>{isAr ? 'تعديل جرد المواد الخام' : 'Update Raw Materials'}</span>
            </Link>
          </div>

          <h3 className="section-title-sm" style={{ marginTop: '20px' }}>
            {isAr ? 'تنبيهات نقص المواد' : 'Low Stock Alerts'}
          </h3>
          <div className="low-stock-list">
            {lowStockItems.map((item) => (
              <div key={item.id} className="stock-alert-item">
                <div>
                  <span className="item-name">{isAr ? item.name_ar : item.name_en}</span>
                  <span className="item-supplier">{isAr ? item.supplier_ar : item.supplier_en}</span>
                </div>
                <div className="item-qty-warning">
                  {item.quantity} {isAr ? item.unit_ar : item.unit_en}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="recent-orders-card glass">
        <div className="recent-orders-header">
          <div>
            <h3>{isAr ? 'أحدث الطلبات الواردة' : 'Recent Inbound Orders'}</h3>
            <p>{isAr ? 'متابعة وتحديث حالة الطلبات المباشرة' : 'Track and update live order fulfillment'}</p>
          </div>
          <Link to="/dashboard/orders" className="view-all-orders-btn">
            <span>{isAr ? 'عرض كافة الطلبات' : 'All Orders'}</span>
            <ChevronRight size={16} />
          </Link>
        </div>

        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>{isAr ? 'رقم الطلب' : 'Order ID'}</th>
                <th>{isAr ? 'العميل' : 'Customer'}</th>
                <th>{isAr ? 'المدينة والحي' : 'Location'}</th>
                <th>{isAr ? 'المجموع' : 'Total'}</th>
                <th>{isAr ? 'الحالة الحالية' : 'Current Status'}</th>
                <th>{isAr ? 'تغيير الحالة' : 'Quick Action'}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((ord) => (
                <tr key={ord.id}>
                  <td className="order-id-cell">{ord.id}</td>
                  <td>
                    <div className="customer-cell">
                      <span className="cust-name">{ord.customer_name}</span>
                      <span className="cust-phone">{ord.customer_phone}</span>
                    </div>
                  </td>
                  <td>
                    {ord.city} {ord.district ? `- ${ord.district}` : ''}
                  </td>
                  <td className="order-total-cell">
                    {ord.total_price} {currencySymbol}
                  </td>
                  <td>{getStatusBadge(ord.status)}</td>
                  <td>
                    <select
                      value={ord.status}
                      onChange={(e) => updateOrderStatus(ord.id, e.target.value)}
                      className="status-select-quick"
                    >
                      <option value="new">{isAr ? 'جديد' : 'New'}</option>
                      <option value="processing">{isAr ? 'قيد التنسيق' : 'Processing'}</option>
                      <option value="completed">{isAr ? 'مكتمل' : 'Completed'}</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
