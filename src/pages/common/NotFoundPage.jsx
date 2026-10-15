import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react';
import './NotFoundPage.css';

export default function NotFoundPage() {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === 'ar';
  const ArrowIcon = isAr ? ArrowLeft : ArrowRight;

  return (
    <div className="not-found-page container-wide">
      <div className="not-found-card glass animate-fade-in">
        <div className="flower-404">🌹</div>
        <h1 className="code-404">404</h1>
        <h2 className="title-404">
          {isAr ? 'عذراً، الصفحة غير موجودة' : 'Page Not Found'}
        </h2>
        <p className="desc-404">
          {isAr
            ? 'يبدو أن الرابط الذي تبحث عنه قد تغير أو أن هذه الباقة المميزة لم تعد متوفرة في هذا المسار.'
            : 'The page or bouquet you are looking for does not exist or has been relocated.'}
        </p>

        <div className="actions-404">
          <Link to="/" className="btn-home-404">
            <span>{isAr ? 'العودة للرئيسية' : 'Return to Home'}</span>
          </Link>
          <Link to="/shop" className="btn-shop-404">
            <ShoppingBag size={18} />
            <span>{isAr ? 'تصفح البوكيهات' : 'Explore Bouquets'}</span>
            <ArrowIcon size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
