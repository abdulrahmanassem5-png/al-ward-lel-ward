import { useTranslation } from 'react-i18next';
import { CATEGORIES } from '../../../config/constants.js';
import { Crown, Sparkles, Heart, MoonStar, Home, Gift, LayoutGrid } from 'lucide-react';
import './CategoryFilter.css';

const ICON_MAP = {
  Crown,
  Sparkles,
  Heart,
  MoonStar,
  Home,
  Gift,
};

export default function CategoryFilter({ activeCategory, onSelectCategory }) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const allOption = {
    id: 'all',
    iconName: 'all',
    name_ar: 'الكل',
    name_en: 'All Bouquets',
  };

  const categories = [allOption, ...CATEGORIES];

  return (
    <div className="category-filter-wrapper">
      <div className="category-filter-container">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          const name = isAr ? cat.name_ar : cat.name_en;
          const IconComponent = cat.id === 'all' ? LayoutGrid : (ICON_MAP[cat.iconName] || Sparkles);

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`cat-pill ${isActive ? 'active' : ''}`}
            >
              <span className="cat-icon">
                <IconComponent size={16} strokeWidth={1.4} />
              </span>
              <span className="cat-name">{name}</span>
              {isActive && <span className="cat-active-indicator" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

