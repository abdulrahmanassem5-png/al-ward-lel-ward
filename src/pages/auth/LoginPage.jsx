import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext.jsx';
import { useNotification } from '../../context/NotificationContext.jsx';
import { Lock, Mail, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import './LoginPage.css';

export default function LoginPage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const { showSuccess, showError } = useNotification();

  const isAr = i18n.language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;
  const redirectTarget = location.state?.from || '/dashboard';

  const [email, setEmail] = useState('admin@alward.com');
  const [password, setPassword] = useState('ward2026');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      showSuccess(isAr ? 'مرحباً بك مجدداً في لوحة إدارة الورد للورد 👑' : 'Welcome back to the Admin Dashboard 👑');
      navigate(redirectTarget, { replace: true });
    } catch (err) {
      showError(err.message || (isAr ? 'بيانات الدخول غير صحيحة' : 'Invalid login credentials'));
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAdmin = async () => {
    setLoading(true);
    try {
      const currentPass = localStorage.getItem('alward_admin_password') || 'ward2026';
      await login('admin@alward.com', currentPass);
      showSuccess(isAr ? 'تم تسجيل الدخول السريع كمدير المتجر 👑' : 'Quick Admin Demo login successful 👑');
      navigate(redirectTarget, { replace: true });
    } catch (err) {
      showError(err.message || 'Error logging in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page container-wide">
      <div className="login-card glass animate-fade-in">
        <div className="login-brand">
          <span className="brand-flower">🌹</span>
          <h1 className="brand-title">{isAr ? 'الورد للورد' : 'Al-Ward'}</h1>
          <p className="brand-subtitle">
            {isAr ? 'بوابة إدارة وصناعة البوكيهات' : 'Bouquet Crafting & Management Portal'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="login-field">
            <label>{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
            <div className="input-wrap">
              <Mail size={18} className="field-icon" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@alward.com"
              />
            </div>
          </div>

          <div className="login-field">
            <label>{isAr ? 'كلمة المرور' : 'Password'}</label>
            <div className="input-wrap">
              <Lock size={18} className="field-icon" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-login-submit">
            <span>{isAr ? 'تسجيل الدخول' : 'Sign In'}</span>
            <ArrowIcon size={16} />
          </button>
        </form>

        <div className="quick-demo-divider">
          <span>{isAr ? 'أو الوصول الفوري' : 'Or Quick Access'}</span>
        </div>

        <button onClick={handleQuickDemoAdmin} className="btn-quick-admin">
          <Sparkles size={18} color="#D4A853" />
          <span>{isAr ? 'الدخول كمدير المتجر (تجربة فورية)' : 'Enter as Admin (Instant Demo)'}</span>
        </button>

        <div className="login-footer-links">
          <Link to="/" className="link-back-store">
            <ArrowIcon size={14} />
            <span>{isAr ? 'العودة لصفحة المتجر الرئيسية' : 'Return to Storefront'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
