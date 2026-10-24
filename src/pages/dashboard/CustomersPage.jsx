import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CURRENCY, STORE_INFO } from '../../config/constants.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import {
  Users,
  Search,
  MessageCircle,
  TrendingUp,
  Star,
  Plus,
  X,
} from 'lucide-react';
import './CustomersPage.css';

const MOCK_CUSTOMERS = [
  {
    id: 'CUST-1',
    name: 'سارة أحمد الشافعي',
    phone: '01012345678',
    email: 'sarah.ahmed@example.com',
    city: 'القاهرة - المعادي',
    orders_count: 5,
    total_spent: 3450,
    last_order: '2026-10-15',
    is_vip: true,
  },
  {
    id: 'CUST-2',
    name: 'محمد عبدالله الشرقاوي',
    phone: '01123456789',
    email: 'm.elsharkawy@example.com',
    city: 'الجيزة - الشيخ زايد',
    orders_count: 3,
    total_spent: 2190,
    last_order: '2026-10-14',
    is_vip: false,
  },
  {
    id: 'CUST-3',
    name: 'دينا فهد المنشاوي',
    phone: '01234567890',
    email: 'dina.f@example.com',
    city: 'القاهرة - مصر الجديدة',
    orders_count: 7,
    total_spent: 5400,
    last_order: '2026-10-14',
    is_vip: true,
  },
  {
    id: 'CUST-4',
    name: 'كريم عبدالعزيز حسني',
    phone: '01512345678',
    email: 'karim.h@example.com',
    city: 'القاهرة - التجمع الخامس',
    orders_count: 2,
    total_spent: 1300,
    last_order: '2026-10-12',
    is_vip: false,
  },
  {
    id: 'CUST-5',
    name: 'مريم ناصر الباز',
    phone: '01098765432',
    email: 'mariam.elbaz@example.com',
    city: 'الجيزة - الدقي',
    orders_count: 4,
    total_spent: 2850,
    last_order: '2026-10-10',
    is_vip: false,
  },
];

function getMergedCustomers() {
  const manualCustomers = (() => {
    try {
      const saved = localStorage.getItem('al_ward_customers');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  })();

  const orders = (() => {
    try {
      const saved = localStorage.getItem('al_ward_orders');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [];
  })();

  const map = new Map();

  // Seed default atelier mock customers
  MOCK_CUSTOMERS.forEach((c) => {
    map.set(c.phone || c.id, { ...c });
  });

  // Merge manual stored customers
  if (Array.isArray(manualCustomers)) {
    manualCustomers.forEach((c) => {
      const key = c.phone || c.id;
      map.set(key, { ...c });
    });
  }

  // Aggregate live customers from orders
  if (Array.isArray(orders)) {
    orders.forEach((o) => {
      const phone = o.customer_phone || o.phone || '';
      const name = o.customer_name || o.senderName || o.name || 'عميل المتجر';
      const total = Number(o.total_price || o.total_amount || 0);
      const date = (o.created_at || '').split('T')[0] || '2026-10-24';
      const city = o.city ? `${o.city}${o.district ? ` - ${o.district}` : ''}` : (o.delivery_address || 'القاهرة');

      const key = phone || `ORDER-${o.id}`;
      if (map.has(key)) {
        const existing = map.get(key);
        existing.orders_count = (existing.orders_count || 1) + 1;
        existing.total_spent = (existing.total_spent || 0) + total;
        existing.last_order = date;
        if (existing.total_spent > 3000 || existing.orders_count >= 3) {
          existing.is_vip = true;
        }
      } else {
        map.set(key, {
          id: `CUST-${o.id || Math.floor(1000 + Math.random() * 9000)}`,
          name,
          phone,
          email: o.email || `${phone || 'client'}@alward.vip`,
          city,
          orders_count: 1,
          total_spent: total,
          last_order: date,
          is_vip: total > 2000,
        });
      }
    });
  }

  return Array.from(map.values());
}

export default function CustomersPage() {
  const { i18n } = useTranslation();
  const { showSuccess } = useNotification();
  const isAr = i18n.language === 'ar';
  const currencySymbol = isAr ? CURRENCY.symbol_ar : CURRENCY.symbol_en;

  const [customers, setCustomers] = useState(() => getMergedCustomers());
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    city: 'القاهرة',
  });

  useEffect(() => {
    const refreshCustomers = () => {
      setCustomers(getMergedCustomers());
    };
    window.addEventListener('al_ward_orders_updated', refreshCustomers);
    window.addEventListener('al_ward_customers_updated', refreshCustomers);
    window.addEventListener('storage', refreshCustomers);
    return () => {
      window.removeEventListener('al_ward_orders_updated', refreshCustomers);
      window.removeEventListener('al_ward_customers_updated', refreshCustomers);
      window.removeEventListener('storage', refreshCustomers);
    };
  }, []);

  const handleWhatsAppCustomer = (customer) => {
    const text = isAr
      ? `مرحباً أستاذ/ة ${customer.name}، يسعدنا تواصلك مع متجر "الورد للورد" 🌹\nهل تود الاستفسار عن باقات أو مناسبات جديدة؟`
      : `Hello ${customer.name}, greeting from Al-Ward Lel-Ward 🌹 How can we assist you today?`;
    const cleanDigits = (customer.phone || '').replace(/\D/g, '');
    const waPhone = cleanDigits.startsWith('0') ? `2${cleanDigits}` : cleanDigits;
    window.open(`https://wa.me/${waPhone || STORE_INFO.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleCreateCustomer = (e) => {
    e.preventDefault();
    const created = {
      id: `CUST-${Date.now().toString().slice(-4)}`,
      name: newCustomer.name,
      phone: newCustomer.phone,
      email: newCustomer.email,
      city: newCustomer.city,
      orders_count: 0,
      total_spent: 0,
      last_order: isAr ? 'جديد' : 'New',
      is_vip: false,
    };

    try {
      const existing = JSON.parse(localStorage.getItem('al_ward_customers') || '[]');
      const updated = [created, ...existing];
      localStorage.setItem('al_ward_customers', JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('al_ward_customers_updated', { detail: created }));
    } catch (err) {
      console.error('Failed to save customer in storage:', err);
    }

    setCustomers(getMergedCustomers());
    setShowAddModal(false);
    showSuccess(isAr ? 'تمت إضافة العميل الجديد بنجاح وحفظه في النظام' : 'New customer added and saved successfully');
    setNewCustomer({ name: '', phone: '', email: '', city: 'القاهرة' });
  };

  const filteredCustomers = customers.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  });

  const totalSpentAll = customers.reduce((acc, c) => acc + c.total_spent, 0);

  return (
    <div className="customers-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isAr ? 'إدارة العملاء وVIP' : 'Customer & VIP Directory'}</h1>
          <p className="page-desc">{isAr ? 'سجل عملاء المتجر، سجل الطلبات، والتواصل المباشر' : 'Customer profiles, order frequency & direct CRM'}</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-add-customer">
          <Plus size={18} />
          <span>{isAr ? 'إضافة عميل جديد' : 'Add New Customer'}</span>
        </button>
      </div>

      {/* KPI Row */}
      <div className="cust-kpi-grid">
        <div className="kpi-card glass">
          <span className="kpi-title">{isAr ? 'إجمالي العملاء' : 'Total Customers'}</span>
          <div className="kpi-number">{customers.length} <small>{isAr ? 'عميل' : 'clients'}</small></div>
          <span className="kpi-trend positive"><Users size={14} /> +8 {isAr ? 'هذا الأسبوع' : 'this week'}</span>
        </div>

        <div className="kpi-card glass">
          <span className="kpi-title">{isAr ? 'عملاء النخبة VIP' : 'VIP Customers'}</span>
          <div className="kpi-number">{customers.filter((c) => c.is_vip).length} <small>{isAr ? 'عميل ذهبي' : 'VIPs'}</small></div>
          <span className="kpi-trend positive"><Star size={14} /> {isAr ? 'أكثر من 3 طلبات' : '3+ orders'}</span>
        </div>

        <div className="kpi-card glass">
          <span className="kpi-title">{isAr ? 'إجمالي المشتريات التراكمية' : 'Lifetime Value'}</span>
          <div className="kpi-number">{totalSpentAll.toLocaleString()} <small>{currencySymbol}</small></div>
          <span className="kpi-trend positive"><TrendingUp size={14} /> {isAr ? 'معدل ولاء مرتفع' : 'High retention'}</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="cust-toolbar glass">
        <div className="search-wrap">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder={isAr ? 'ابحث بالاسم، الجوال، المدينة...' : 'Search by name, phone, city...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <span className="cust-count-badge">
          {isAr ? `عرض ${filteredCustomers.length} عميل` : `Showing ${filteredCustomers.length} customers`}
        </span>
      </div>

      {/* Table */}
      <div className="cust-card glass">
        <div className="table-responsive">
          <table className="cust-table">
            <thead>
              <tr>
                <th>{isAr ? 'العميل' : 'Customer'}</th>
                <th>{isAr ? 'الجوال والبريد' : 'Contact'}</th>
                <th>{isAr ? 'المدينة والحي' : 'Location'}</th>
                <th>{isAr ? 'عدد الطلبات' : 'Orders'}</th>
                <th>{isAr ? 'إجمالي المشتريات' : 'Total Spent'}</th>
                <th>{isAr ? 'آخر طلب' : 'Last Order'}</th>
                <th>{isAr ? 'تواصل فوري' : 'Action'}</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="c-name-cell">
                      <span className="cust-full-name">{c.name}</span>
                      {c.is_vip && <span className="vip-chip">👑 VIP</span>}
                    </div>
                  </td>
                  <td>
                    <div className="c-contact-cell">
                      <span className="c-phone">{c.phone}</span>
                      <span className="c-email">{c.email}</span>
                    </div>
                  </td>
                  <td>{c.city}</td>
                  <td>
                    <span className="c-orders-count">{c.orders_count} {isAr ? 'طلبات' : 'orders'}</span>
                  </td>
                  <td className="c-spent-cell">
                    {c.total_spent} {currencySymbol}
                  </td>
                  <td className="c-date-cell">{c.last_order}</td>
                  <td>
                    <button
                      onClick={() => handleWhatsAppCustomer(c)}
                      className="btn-chat-cust"
                      title={isAr ? 'محادثة عبر واتساب' : 'Chat on WhatsApp'}
                    >
                      <MessageCircle size={16} />
                      <span>{isAr ? 'واتساب' : 'WhatsApp'}</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="add-modal glass animate-fade-in" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{isAr ? 'إضافة عميل جديد' : 'Add New Customer'}</h2>
              <button onClick={() => setShowAddModal(false)} className="modal-close-btn">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCustomer} className="add-form">
              <div className="form-group">
                <label>{isAr ? 'الاسم الكامل *' : 'Full Name *'}</label>
                <input
                  type="text"
                  required
                  placeholder={isAr ? 'مثال: نورة السعيد' : 'e.g. Noura Al-Saeed'}
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>{isAr ? 'رقم الجوال *' : 'Phone Number *'}</label>
                <input
                  type="tel"
                  required
                  placeholder="05XXXXXXXX"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
                <input
                  type="email"
                  placeholder="example@mail.com"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>{isAr ? 'المدينة والحي' : 'Location / District'}</label>
                <input
                  type="text"
                  placeholder={isAr ? 'القاهرة - المعادي' : 'Cairo - Maadi'}
                  value={newCustomer.city}
                  onChange={(e) => setNewCustomer({ ...newCustomer, city: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-modal-save">
                <span>{isAr ? 'حفظ العميل' : 'Save Customer'}</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
