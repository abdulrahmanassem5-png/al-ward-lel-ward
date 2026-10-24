import { Sparkles, Crown } from 'lucide-react';
import './RoyalLoadingFallback.css';

/**
 * RoyalLoadingFallback
 * Premium dark & gold full-screen transition fallback.
 * Eliminates white flashes and preserves the Royal Atelier brand immersion.
 */
export default function RoyalLoadingFallback({
  message = 'جاري تجهيز التجربة الملكية...',
  brandName = 'الورد للورد',
}) {
  return (
    <div className="royal-loading-fallback" role="status" aria-live="polite">
      {/* Background ambient lighting */}
      <div className="royal-loading-backdrop">
        <div className="royal-halo royal-halo-gold" />
        <div className="royal-halo royal-halo-rose" />
      </div>

      <div className="royal-loading-content">
        {/* Pulsing Royal Emblem */}
        <div className="royal-spinner-stage">
          <div className="royal-spin-ring" />
          <div className="royal-spin-ring-inner" />
          <div className="royal-emblem-icon">
            <Crown size={24} />
          </div>
        </div>

        {/* Brand Title */}
        <h2 className="royal-loading-brand">{brandName}</h2>

        {/* Atelier Badge */}
        <div className="royal-loading-badge">
          <Sparkles size={12} />
          <span>بوتيك الزهور والتصميم الفاخر ✦</span>
        </div>

        {/* Subtitle / Status message */}
        <p className="royal-loading-text">{message}</p>

        {/* Shimmer progress bar */}
        <div className="royal-progress-track">
          <div className="royal-progress-fill" />
        </div>
      </div>
    </div>
  );
}
