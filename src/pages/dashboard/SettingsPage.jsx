import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { STORE_INFO, CURRENCY } from '../../config/constants.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { QRCodeSVG } from 'qrcode.react';
import {
  PLATFORM_PRESETS,
  getStoredSocialQRs,
  saveStoredSocialQRs,
  addSocialQR,
  updateSocialQR,
  deleteSocialQR,
  resetSocialQRsToDefault,
} from '../../utils/socialLinksManager.js';
import {
  Settings,
  Save,
  Store,
  Truck,
  Bell,
  Lock,
  KeyRound,
  Share2,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  QrCode,
  Check,
  RefreshCw,
  Sparkles,
  Globe,
  Link as LinkIcon,
  X,
  Eye,
  CheckCircle,
} from 'lucide-react';
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

  // Store profile & settings with local storage persistence
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('al_ward_store_settings');
      if (stored) return JSON.parse(stored);
    } catch {}
    return {
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
    };
  });

  // Social QRs state
  const [socialQRs, setSocialQRs] = useState(() => getStoredSocialQRs());
  const [editingQR, setEditingQR] = useState(null);
  const [isAddingQR, setIsAddingQR] = useState(false);

  // Form state for adding/editing a social QR
  const [formQR, setFormQR] = useState({
    id: '',
    title_ar: '',
    title_en: '',
    handle: '',
    description_ar: '',
    description_en: '',
    url: '',
    btn_text_ar: '',
    btn_text_en: '',
    theme_color: '#D4AF37',
  });

  // Sync social QRs if updated externally
  useEffect(() => {
    const handleSync = (e) => {
      if (e.detail?.items) {
        setSocialQRs(e.detail.items);
      } else {
        setSocialQRs(getStoredSocialQRs());
      }
    };
    window.addEventListener('al_ward_social_qrs_updated', handleSync);
    return () => window.removeEventListener('al_ward_social_qrs_updated', handleSync);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = (e) => {
    e?.preventDefault();
    try {
      localStorage.setItem('al_ward_store_settings', JSON.stringify(settings));
      saveStoredSocialQRs(socialQRs);
      showSuccess(
        isAr
          ? 'تم حفظ وتحديث إعدادات المتجر ومنصات التواصل بنجاح 🌹'
          : 'Store settings and social QRs saved successfully 🌹'
      );
    } catch (err) {
      console.error(err);
      showError(isAr ? 'حدث خطأ أثناء حفظ الإعدادات' : 'Error saving settings');
    }
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

  // Preset Selection for adding/editing a platform
  const handleSelectPreset = (presetKey) => {
    const preset = PLATFORM_PRESETS.find((p) => p.key === presetKey);
    if (!preset) return;
    setFormQR((prev) => ({
      ...prev,
      title_ar: preset.name_ar,
      title_en: preset.name_en,
      handle: preset.handle,
      description_ar: preset.description_ar,
      description_en: preset.description_en,
      url: prev.url || preset.default_url,
      btn_text_ar: preset.btn_text_ar,
      btn_text_en: preset.btn_text_en,
      theme_color: preset.theme_color,
    }));
  };

  const handleStartAddQR = () => {
    const defaultPreset = PLATFORM_PRESETS[0]; // snapchat as starter
    setFormQR({
      id: `social_${Date.now()}`,
      title_ar: defaultPreset.name_ar,
      title_en: defaultPreset.name_en,
      handle: defaultPreset.handle,
      description_ar: defaultPreset.description_ar,
      description_en: defaultPreset.description_en,
      url: defaultPreset.default_url,
      btn_text_ar: defaultPreset.btn_text_ar,
      btn_text_en: defaultPreset.btn_text_en,
      theme_color: defaultPreset.theme_color,
    });
    setIsAddingQR(true);
    setEditingQR(null);
  };

  const handleStartEditQR = (item) => {
    setFormQR({
      id: item.id,
      title_ar: item.title_ar || '',
      title_en: item.title_en || item.title_ar || '',
      handle: item.handle || '',
      description_ar: item.description_ar || '',
      description_en: item.description_en || item.description_ar || '',
      url: item.url || '',
      btn_text_ar: item.btn_text_ar || (isAr ? 'زيارة الرابط ✦' : 'Visit ✦'),
      btn_text_en: item.btn_text_en || 'Visit ✦',
      theme_color: item.theme_color || '#D4AF37',
    });
    setEditingQR(item);
    setIsAddingQR(false);
  };

  const handleCancelQRForm = () => {
    setEditingQR(null);
    setIsAddingQR(false);
  };

  const handleSaveQR = (e) => {
    e.preventDefault();
    if (!formQR.title_ar.trim() || !formQR.url.trim()) {
      showError(isAr ? 'يرجى إدخال اسم المنصة ورابطها' : 'Please provide platform name and URL');
      return;
    }

    if (isAddingQR) {
      const updated = addSocialQR(formQR);
      setSocialQRs(updated);
      showSuccess(isAr ? `تمت إضافة منصة «${formQR.title_ar}» بنجاح ✦` : `Platform added successfully ✦`);
    } else if (editingQR) {
      const updated = updateSocialQR(editingQR.id, formQR);
      setSocialQRs(updated);
      showSuccess(isAr ? `تم تحديث منصة «${formQR.title_ar}» بنجاح ✦` : `Platform updated successfully ✦`);
    }

    handleCancelQRForm();
  };

  const handleDeleteQR = (id, title) => {
    if (socialQRs.length <= 1) {
      showError(isAr ? 'يجب الإبقاء على منصة تواصل واحدة على الأقل في المتجر' : 'Keep at least one platform');
      return;
    }
    const updated = deleteSocialQR(id);
    setSocialQRs(updated);
    showSuccess(isAr ? `تم حذف منصة «${title}» من المتجر` : `Platform deleted`);
  };

  const handleResetSocialDefaults = () => {
    const updated = resetSocialQRsToDefault();
    setSocialQRs(updated);
    showSuccess(isAr ? 'تم استعادة منصات التواصل الافتراضية بنجاح 🌹' : 'Reset to default platforms');
  };

  return (
    <div className="settings-page">
      {/* Top Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">{isAr ? 'إعدادات المنصة والمتجر' : 'Store & System Settings'}</h1>
          <p className="page-desc">
            {isAr
              ? 'تخصيص بيانات المتجر، سياسات التوصيل، روابط السوشيال ميديا وأكواد QR التفاعلية'
              : 'Store profile, delivery fees, social media channels & interactive QR codes'}
          </p>
        </div>
        <button onClick={handleSave} className="btn-save-settings">
          <Save size={18} />
          <span>{isAr ? 'حفظ التغييرات' : 'Save Changes'}</span>
        </button>
      </div>

      <div className="settings-content-flow">
        {/* ========================================================
            ROYAL SOCIAL COMMUNITY QRS MANAGEMENT SECTION
            ======================================================== */}
        <div className="settings-card full-width-card glass-luxury-card social-qrs-manager-card">
          <div className="social-manager-header">
            <div className="social-title-group">
              <div className="social-badge">
                <Sparkles size={14} />
                <span>{isAr ? 'مجتمع الدار التفاعلي' : 'Royal Community Channels'}</span>
              </div>
              <h2 className="social-section-title">
                <Share2 size={22} className="gold-icon" />
                <span>{isAr ? 'إدارة منصات التواصل والباركود التفاعلي (Social Community QRs) ✦' : 'Social Community & QR Codes Atelier'}</span>
              </h2>
              <p className="social-section-desc">
                {isAr
                  ? 'هذه المنصات والباركودات تظهر مباشرة في قسم مجتمع الدار بالصفحة الرئيسية للمتجر وصفحة التواصل، يمكنك تعديل أي رابط، أو إضافة منصات جديدة وتوليد أكواد QR فورية لها.'
                  : 'Manage the social community cards and real-time QR codes displayed on the homepage and contact page.'}
              </p>
            </div>

            <div className="social-header-actions">
              <button
                type="button"
                onClick={handleResetSocialDefaults}
                className="btn-reset-defaults"
                title={isAr ? 'استعادة الروابط الافتراضية (فيسبوك، تيك توك، إنستغرام، واتساب)' : 'Reset to defaults'}
              >
                <RefreshCw size={15} />
                <span>{isAr ? 'استعادة الافتراضية' : 'Reset Defaults'}</span>
              </button>

              <button
                type="button"
                onClick={handleStartAddQR}
                className="btn-add-social-qr"
              >
                <Plus size={16} />
                <span>{isAr ? 'إضافة منصة أو رابط QR جديد ✦' : 'Add New Platform / QR ✦'}</span>
              </button>
            </div>
          </div>

          {/* ── Interactive Add / Edit Form Modal / Panel ── */}
          {(isAddingQR || editingQR) && (
            <div className="social-qr-edit-panel animate-fade-in">
              <div className="panel-header">
                <div className="panel-title-wrap">
                  <QrCode size={18} className="gold-icon" />
                  <h4>
                    {isAddingQR
                      ? (isAr ? 'إضافة منصة أو رابط QR جديد للدار' : 'Add New Platform QR')
                      : (isAr ? `تعديل منصة: ${editingQR.title_ar}` : `Edit: ${editingQR.title_en || editingQR.title_ar}`)}
                  </h4>
                </div>
                <button type="button" onClick={handleCancelQRForm} className="btn-close-panel">
                  <X size={18} />
                </button>
              </div>

              {/* Quick Presets Pills */}
              <div className="presets-selector-box">
                <span className="presets-label">{isAr ? 'اختر قالباً سريعاً للمنصة:' : 'Quick Platform Preset:'}</span>
                <div className="presets-pills-row">
                  {PLATFORM_PRESETS.map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => handleSelectPreset(p.key)}
                      className={`preset-pill-btn ${formQR.theme_color === p.theme_color ? 'selected' : ''}`}
                      style={{ '--preset-color': p.theme_color }}
                    >
                      <span className="preset-dot" style={{ background: p.theme_color }}></span>
                      <span>{isAr ? p.name_ar : p.name_en}</span>
                    </button>
                  ))}
                </div>
              </div>

              <form onSubmit={handleSaveQR} className="social-edit-form">
                <div className="social-form-body-grid">
                  {/* Left Column: Form Fields */}
                  <div className="social-fields-col">
                    <div className="form-row-two">
                      <div className="settings-field-group">
                        <label>{isAr ? 'اسم المنصة بالعربية *' : 'Platform Name (Arabic) *'}</label>
                        <input
                          type="text"
                          required
                          value={formQR.title_ar}
                          onChange={(e) => setFormQR({ ...formQR, title_ar: e.target.value })}
                          placeholder={isAr ? 'مثال: سناب شات' : 'Arabic Name'}
                        />
                      </div>

                      <div className="settings-field-group">
                        <label>{isAr ? 'اسم المنصة بالإنجليزية' : 'Platform Name (English)'}</label>
                        <input
                          type="text"
                          value={formQR.title_en}
                          onChange={(e) => setFormQR({ ...formQR, title_en: e.target.value })}
                          placeholder="e.g. Snapchat"
                        />
                      </div>
                    </div>

                    <div className="settings-field-group mt-3">
                      <label>{isAr ? 'الرابط المستهدف (URL) * — يولّد كود الـ QR تلقائياً' : 'Target URL * — Generates QR Code'}</label>
                      <div className="url-input-container">
                        <LinkIcon size={16} className="url-field-icon" />
                        <input
                          type="url"
                          required
                          value={formQR.url}
                          onChange={(e) => setFormQR({ ...formQR, url: e.target.value })}
                          placeholder="https://..."
                          className="url-field-input"
                        />
                      </div>
                    </div>

                    <div className="form-row-two mt-3">
                      <div className="settings-field-group">
                        <label>{isAr ? 'اسم المعرف أو الحساب (Handle)' : 'Handle / Subtitle'}</label>
                        <input
                          type="text"
                          value={formQR.handle}
                          onChange={(e) => setFormQR({ ...formQR, handle: e.target.value })}
                          placeholder="@elward_roses"
                        />
                      </div>

                      <div className="settings-field-group">
                        <label>{isAr ? 'نص الزر التفاعلي' : 'Button Text'}</label>
                        <input
                          type="text"
                          value={formQR.btn_text_ar}
                          onChange={(e) => setFormQR({ ...formQR, btn_text_ar: e.target.value })}
                          placeholder={isAr ? 'زيارة المنصة ✦' : 'Visit ✦'}
                        />
                      </div>
                    </div>

                    <div className="settings-field-group mt-3">
                      <label>{isAr ? 'الوصف الترويجي في البطاقة' : 'Card Description'}</label>
                      <input
                        type="text"
                        value={formQR.description_ar}
                        onChange={(e) => setFormQR({ ...formQR, description_ar: e.target.value })}
                        placeholder={isAr ? 'كواليس صياغة البوكيهات ومتابعة أول بأول' : 'Description'}
                      />
                    </div>

                    <div className="settings-field-group mt-3">
                      <label>{isAr ? 'اللون المميز للمنصة (Theme Color)' : 'Brand Color'}</label>
                      <div className="color-picker-row">
                        <input
                          type="color"
                          value={formQR.theme_color || '#D4AF37'}
                          onChange={(e) => setFormQR({ ...formQR, theme_color: e.target.value })}
                          className="color-picker-input"
                        />
                        <span className="color-hex-tag">{formQR.theme_color}</span>
                        <div className="quick-colors-row">
                          {['#FFFC00', '#0088CC', '#FF0000', '#1877F2', '#EE1D52', '#E4405F', '#25D366', '#000000', '#D4AF37'].map((c) => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setFormQR({ ...formQR, theme_color: c })}
                              className="quick-color-dot"
                              style={{ background: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live QR Code Preview */}
                  <div className="social-qr-preview-col">
                    <div className="live-qr-preview-box">
                      <div className="qr-preview-badge">
                        <Eye size={13} />
                        <span>{isAr ? 'معاينة الباركود الحية ✦' : 'Live QR Preview'}</span>
                      </div>

                      <div className="qr-scannable-white-card">
                        <QRCodeSVG
                          value={formQR.url.trim() || 'https://alwardlelward.com'}
                          size={140}
                          level="H"
                          includeMargin={false}
                          bgColor="#FFFFFF"
                          fgColor="#000000"
                        />
                      </div>

                      <span className="qr-preview-hint">
                        {isAr ? 'امسح بهاتفك للتجربة المباشرة' : 'Scan with your camera'}
                      </span>

                      <div className="qr-preview-btn-mock" style={{ '--mock-color': formQR.theme_color }}>
                        <span>{formQR.btn_text_ar || (isAr ? 'فتح الرابط' : 'Open')}</span>
                        <ExternalLink size={14} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="social-form-footer">
                  <button type="button" onClick={handleCancelQRForm} className="btn-cancel-social">
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button type="submit" className="btn-save-social-qr">
                    <CheckCircle size={16} />
                    <span>
                      {isAddingQR
                        ? (isAr ? 'إضافة المنصة ونشر الباركود ✦' : 'Add Platform & QR ✦')
                        : (isAr ? 'حفظ تعديلات المنصة ✦' : 'Save Platform Changes ✦')}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── Active Social QRs Grid Display ── */}
          <div className="social-qrs-dashboard-grid">
            {socialQRs.map((item) => (
              <div key={item.id} className="social-dashboard-card" style={{ '--card-theme': item.theme_color }}>
                <div className="card-top-indicator" style={{ background: item.theme_color }}></div>

                <div className="card-header-row">
                  <div className="card-title-wrap">
                    <h3 className="social-card-title">{isAr ? item.title_ar : item.title_en}</h3>
                    <span className="social-card-handle">{item.handle}</span>
                  </div>
                  <span
                    className="platform-color-chip"
                    style={{ background: `${item.theme_color}25`, color: item.theme_color, borderColor: item.theme_color }}
                  >
                    ● {isAr ? 'نشط' : 'Active'}
                  </span>
                </div>

                <p className="social-card-desc">{isAr ? item.description_ar : item.description_en}</p>

                {/* Scannable QR Code */}
                <div className="social-qr-display-box">
                  <div className="qr-white-frame">
                    <QRCodeSVG
                      value={item.url || 'https://alwardlelward.com'}
                      size={120}
                      level="H"
                      includeMargin={false}
                      bgColor="#FFFFFF"
                      fgColor="#000000"
                    />
                  </div>
                  <span className="qr-scan-tagline">
                    <QrCode size={12} />
                    <span>{isAr ? 'كود QR صالح للمسح' : 'Scannable QR'}</span>
                  </span>
                </div>

                {/* URL preview */}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-url-link truncate"
                  title={item.url}
                >
                  <ExternalLink size={13} />
                  <span className="truncate">{item.url}</span>
                </a>

                {/* Action Buttons */}
                <div className="social-card-actions">
                  <button
                    type="button"
                    onClick={() => handleStartEditQR(item)}
                    className="btn-edit-social"
                    title={isAr ? 'تعديل الرابط والبيانات والـ QR' : 'Edit link & QR'}
                  >
                    <Edit2 size={14} />
                    <span>{isAr ? 'تعديل ✏️' : 'Edit'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteQR(item.id, isAr ? item.title_ar : item.title_en)}
                    className="btn-delete-social"
                    title={isAr ? 'حذف هذه المنصة' : 'Delete'}
                  >
                    <Trash2 size={14} />
                    <span>{isAr ? 'حذف' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================
            ORIGINAL GENERAL SETTINGS FORMS (Store, Delivery, Security)
            ======================================================== */}
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
    </div>
  );
}
