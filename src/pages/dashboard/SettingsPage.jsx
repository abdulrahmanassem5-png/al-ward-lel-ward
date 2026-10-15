import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { STORE_INFO, CURRENCY } from '../../config/constants.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { Settings, Save, Store, Truck, Bell, Shield, Lock, KeyRound } from 'lucide-react';
import './SettingsPage.css';

export default function SettingsPage() {
  const { i18n } = useTranslation();
  const { changePassword } = useAuth();
  const { showSuccess, showError } = useNotification();
  const isAr = i18n.language === 'ar';

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [settings, setSettings] = useState({
    name_ar: STORE_INFO.name_ar,
    name_en: STORE_INFO.name_en,
    tagline_ar: STORE_INFO.tagline_ar,
    whatsapp: STORE_INFO.whatsapp,
    email: STORE_INFO.email,
    address_ar: STORE_INFO.address_ar,
    deliveryFee: 25,
    freeDeliveryThreshold: 300,
    vatRate: 15,
    currencySymbol: CURRENCY.symbol_ar,
    enableSameDay: true,
    enableWhatsAppDirect: true,
    soundNotifications: true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    showSuccess(isAr ? 'تم حفظ إعدادات المتجر بنجاح 🌹' : 'Store settings saved successfully 🌹');
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showError(isAr ? 'كلمة المرور الجديدة وتأكيدها غير متطابقين' : 'New passwords do not match');
      return;
    }
    try {
      changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      showSuccess(isAr ? 'تم تحديث كلمة مرور الداش بورد بنجاح 🔐' : 'Dashboard password updated successfully 🔐');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showError(err.message || (isAr ? 'فشل تحديث كلمة المرور' : 'Failed to update password'));
    }
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isAr ? 'إعدادات المنصة والمتجر' : 'Store & System Settings'}</h1>
          <p className="page-desc">{isAr ? 'تخصيص بيانات المتجر، سياسات التوصيل، وقنوات واتساب' : 'Store profile, delivery fees & WhatsApp configuration'}</p>
        </div>
        <button onClick={handleSave} className="btn-save-settings">
          <Save size={18} />
          <span>{isAr ? 'حفظ التغييرات' : 'Save Changes'}</span>
        </button>
      </div>

      <form onSubmit={handleSave} className="settings-form-grid">
        {/* Store Profile Card */}
        <div className="settings-card glass">
          <h3 className="section-title">
            <Store size={18} className="sec-icon" />
            {isAr ? 'بيانات وهوية المتجر' : 'Store Identity'}
          </h3>

          <div className="settings-field-group">
            <label>{isAr ? 'اسم المتجر بالعربية' : 'Store Name (Arabic)'}</label>
            <input
              type="text"
              name="name_ar"
              value={settings.name_ar}
              onChange={handleChange}
            />
          </div>

          <div className="settings-field-group">
            <label>{isAr ? 'اسم المتجر بالإنجليزية' : 'Store Name (English)'}</label>
            <input
              type="text"
              name="name_en"
              value={settings.name_en}
              onChange={handleChange}
            />
          </div>

          <div className="settings-field-group">
            <label>{isAr ? 'شعار المتجر (Tagline)' : 'Brand Tagline'}</label>
            <input
              type="text"
              name="tagline_ar"
              value={settings.tagline_ar}
              onChange={handleChange}
            />
          </div>

          <div className="settings-field-group">
            <label>{isAr ? 'رقم واتساب المعتمد للطلبات المباشرة' : 'WhatsApp Orders Number'}</label>
            <input
              type="text"
              name="whatsapp"
              value={settings.whatsapp}
              onChange={handleChange}
            />
          </div>

          <div className="settings-field-group">
            <label>{isAr ? 'البريد الإلكتروني للإشعارات' : 'Store Email'}</label>
            <input
              type="email"
              name="email"
              value={settings.email}
              onChange={handleChange}
            />
          </div>

          <div className="settings-field-group">
            <label>{isAr ? 'موقع الفرع الرئيسي' : 'Store Location'}</label>
            <input
              type="text"
              name="address_ar"
              value={settings.address_ar}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Pricing & Delivery Policy */}
        <div className="settings-card glass">
          <h3 className="section-title">
            <Truck size={18} className="sec-icon" />
            {isAr ? 'سياسات التوصيل والأسعار' : 'Delivery & Pricing Rules'}
          </h3>

          <div className="settings-field-group">
            <label>{isAr ? 'رسوم التوصيل الافتراضية (ج.م)' : 'Standard Delivery Fee (EGP)'}</label>
            <input
              type="number"
              name="deliveryFee"
              value={settings.deliveryFee}
              onChange={handleChange}
            />
          </div>

          <div className="settings-field-group">
            <label>{isAr ? 'الحد الأدنى للتوصيل المجاني (ج.م)' : 'Free Delivery Minimum (EGP)'}</label>
            <input
              type="number"
              name="freeDeliveryThreshold"
              value={settings.freeDeliveryThreshold}
              onChange={handleChange}
            />
          </div>

          <div className="settings-field-group">
            <label>{isAr ? 'نسبة ضريبة القيمة المضافة (VAT %)' : 'VAT Rate (%)'}</label>
            <input
              type="number"
              name="vatRate"
              value={settings.vatRate}
              onChange={handleChange}
            />
          </div>

          <h3 className="section-title" style={{ marginTop: '20px' }}>
            <Bell size={18} className="sec-icon" />
            {isAr ? 'خيارات التشغيل الفوري' : 'Live Operations'}
          </h3>

          <div className="toggle-list">
            <label className="toggle-item">
              <input
                type="checkbox"
                name="enableSameDay"
                checked={settings.enableSameDay}
                onChange={handleChange}
              />
              <div>
                <span className="toggle-label">{isAr ? 'تفعيل التوصيل بنفس اليوم' : 'Enable Same-Day Delivery'}</span>
                <span className="toggle-hint">{isAr ? 'إتاحة خيار استلام البوكيه خلال 4 ساعات' : 'Allow 4-hour rush orders'}</span>
              </div>
            </label>

            <label className="toggle-item">
              <input
                type="checkbox"
                name="enableWhatsAppDirect"
                checked={settings.enableWhatsAppDirect}
                onChange={handleChange}
              />
              <div>
                <span className="toggle-label">{isAr ? 'تفعيل الطلب المباشر عبر واتساب' : 'Enable Direct WhatsApp Ordering'}</span>
                <span className="toggle-hint">{isAr ? 'توليد رسالة تفصيلية فورية لكل بوكيه' : 'Prefill rich messages per bouquet'}</span>
              </div>
            </label>

            <label className="toggle-item">
              <input
                type="checkbox"
                name="soundNotifications"
                checked={settings.soundNotifications}
                onChange={handleChange}
              />
              <div>
                <span className="toggle-label">{isAr ? 'تنبيهات صوتية للطلبات الجديدة' : 'Sound Alerts on New Orders'}</span>
                <span className="toggle-hint">{isAr ? 'تشغيل رنين خفيف عند استقبال طلب جديد في الداش بورد' : 'Chime when an order arrives'}</span>
              </div>
            </label>
          </div>
        </div>

        {/* Security & Dashboard Password Card */}
        <div className="settings-card glass">
          <h3 className="section-title">
            <Lock size={18} className="sec-icon" />
            {isAr ? 'أمان لوحة التحكم وكلمة المرور' : 'Dashboard Security & Password'}
          </h3>

          <p style={{ color: '#9CA3AF', fontSize: '0.85rem', marginBottom: '16px' }}>
            {isAr
              ? 'تأمين الدخول للوحة إدارة المتجر. حساب المدير الحالي: admin@alward.com'
              : 'Secure access to store management. Current admin: admin@alward.com'}
          </p>

          <div className="settings-field-group">
            <label>{isAr ? 'كلمة المرور الحالية' : 'Current Password'}</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))
              }
            />
          </div>

          <div className="settings-field-group">
            <label>{isAr ? 'كلمة المرور الجديدة' : 'New Password'}</label>
            <input
              type="password"
              placeholder={isAr ? '4 خانات أو أكثر' : '4+ characters'}
              value={passwordForm.newPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))
              }
            />
          </div>

          <div className="settings-field-group">
            <label>{isAr ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}</label>
            <input
              type="password"
              placeholder="••••••••"
              value={passwordForm.confirmPassword}
              onChange={(e) =>
                setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))
              }
            />
          </div>

          <button
            type="button"
            onClick={handlePasswordSubmit}
            className="btn-save-settings"
            style={{ width: '100%', marginTop: '14px', justifyContent: 'center' }}
          >
            <KeyRound size={16} />
            <span>{isAr ? 'تحديث كلمة مرور الداش بورد' : 'Update Dashboard Password'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
