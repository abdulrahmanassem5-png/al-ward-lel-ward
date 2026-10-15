import { useTranslation } from 'react-i18next';
import { CATEGORIES } from '../../../config/constants.js';
import { Sparkles } from 'lucide-react';
import './CategoryFilter.css';

export default function CategoryFilter({ activeCategory, onSelectCategory }) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const allOption = {
    id: 'all',
    icon: '✨',
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

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`cat-pill ${isActive ? 'active' : ''}`}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{name}</span>
              {isActive && <span className="cat-active-indicator" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
