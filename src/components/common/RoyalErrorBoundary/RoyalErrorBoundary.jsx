import { Component } from 'react';
import { RefreshCw, Wrench, ShieldAlert, ChevronDown, ChevronUp, CheckCircle, AlertTriangle } from 'lucide-react';
import './RoyalErrorBoundary.css';

/**
 * RoyalErrorBoundary
 * Catches runtime React errors, isolates failure, and protects business data.
 * Provides instant reload and safe storage reset options.
 */
export default class RoyalErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      showDetails: false,
      isResetModalOpen: false,
      includeERPOrdersReset: false,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('RoyalErrorBoundary caught an unhandled exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleOpenResetModal = () => {
    this.setState({ isResetModalOpen: true });
  };

  handleCloseResetModal = () => {
    this.setState({ isResetModalOpen: false, includeERPOrdersReset: false });
  };

  handleExecuteSafeReset = () => {
    try {
      if (typeof localStorage !== 'undefined') {
        if (this.state.includeERPOrdersReset) {
          // Explicit full factory reset requested with confirmation
          localStorage.clear();
        } else {
          // Safe storage reset: Preserve business critical ERP data
          const keysToPreserve = [
            'al_ward_orders',
            'al_ward_raw_materials',
            'al_ward_raw_inventory',
            'al_ward_bouquet_recipes',
            'al_ward_products',
            'al_ward_products_stock',
            'al_ward_offers',
            'al_ward_customers',
            'al_ward_store_settings',
            'al_ward_social_links',
          ];

          const preserved = {};
          keysToPreserve.forEach((k) => {
            const val = localStorage.getItem(k);
            if (val !== null) preserved[k] = val;
          });

          // Clear potentially corrupted UI / cache / draft state
          localStorage.clear();

          // Restore business data back safely
          Object.entries(preserved).forEach(([k, v]) => {
            localStorage.setItem(k, v);
          });
        }
      }

      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.clear();
      }

      // Safely navigate back to home
      window.location.href = '/';
    } catch (err) {
      console.error('Safe reset failed:', err);
      window.location.href = '/';
    }
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, showDetails, isResetModalOpen, includeERPOrdersReset } = this.state;

      return (
        <div className="royal-error-boundary-screen" role="alert">
          <div className="royal-error-backdrop">
            <div className="royal-error-halo royal-error-halo-gold" />
          </div>

          <div className="royal-error-card">
            <div className="royal-error-emblem-wrap">
              <ShieldAlert size={38} />
            </div>

            <h1 className="royal-error-title">درع الحماية الملكي للورد للورد</h1>
            <p className="royal-error-desc">
              حدث خطأ غير متوقع في واجهة العرض أثناء معالجة البيانات.
              تم عزل الخطأ وحماية سجلاتك وبيانات المتجر بنجاح.
            </p>

            <div className="royal-error-actions">
              <button
                type="button"
                onClick={this.handleReload}
                className="btn-royal-action btn-royal-primary"
              >
                <RefreshCw size={18} />
                <span>إعادة تحميل المنصة</span>
              </button>

              <button
                type="button"
                onClick={this.handleOpenResetModal}
                className="btn-royal-action btn-royal-secondary"
              >
                <Wrench size={18} />
                <span>إصلاح وتصفير ذاكرة التخزين المؤقتة</span>
              </button>
            </div>

            {/* Technical details toggle for debugging */}
            <div className="royal-error-details-box">
              <button
                type="button"
                onClick={() => this.setState({ showDetails: !showDetails })}
                className="royal-error-details-toggle"
              >
                {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                <span>{showDetails ? 'إخفاء التفاصيل الفنية للخطأ' : 'عرض التفاصيل الفنية للمطورين'}</span>
              </button>

              {showDetails && (
                <div className="royal-error-stack">
                  <strong>{error?.toString()}</strong>
                  {errorInfo?.componentStack && (
                    <div style={{ marginTop: '0.5rem', opacity: 0.85 }}>
                      {errorInfo.componentStack}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Safe Reset Confirmation Modal */}
          {isResetModalOpen && (
            <div className="safe-reset-modal-overlay">
              <div className="safe-reset-modal-content">
                <h3 className="safe-reset-modal-title">
                  <Wrench size={22} />
                  <span>إصلاح وتصفير التخزين المؤقت الآمن</span>
                </h3>

                <p className="safe-reset-modal-desc">
                  سيقوم النظام بمسح الجلسات المؤقتة والملفات المعطوبة وإعادة توجيهك للصفحة الرئيسية.
                </p>

                <div className="safe-reset-notice">
                  <CheckCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>حماية السجلات:</strong> افتراضياً، لن يتم مسح طلبات الـ ERP، المخزون، أو الوصفات، وسيتم الحفاظ عليها بأمان.
                  </div>
                </div>

                <label className="safe-reset-checkbox-label">
                  <input
                    type="checkbox"
                    checked={includeERPOrdersReset}
                    onChange={(e) => this.setState({ includeERPOrdersReset: e.target.checked })}
                  />
                  <span>
                    <AlertTriangle size={14} style={{ display: 'inline', marginInlineEnd: '4px' }} />
                    تصفير شامل للمتجر بما في ذلك الطلبات والمخزون (Factory Reset)
                  </span>
                </label>

                <div className="safe-reset-btn-row">
                  <button
                    type="button"
                    onClick={this.handleCloseResetModal}
                    className="btn-royal-action btn-royal-secondary"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    onClick={this.handleExecuteSafeReset}
                    className="btn-royal-action btn-royal-primary"
                  >
                    تأكيد وإصلاح الذاكرة
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
