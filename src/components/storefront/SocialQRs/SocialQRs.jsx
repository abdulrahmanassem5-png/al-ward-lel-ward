import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { getStoredSocialQRs } from '../../../utils/socialLinksManager.js';
import { Sparkles, QrCode, ArrowUpLeft, ArrowUpRight, Share2 } from 'lucide-react';
import './SocialQRs.css';

// SVG Platform Monoline Icons (stroke-width: 1.6, delicate gold line art)
function PlatformEmblem({ item }) {
  const str = `${item.id || ''} ${item.key || ''} ${item.title_en || ''} ${item.title_ar || ''} ${item.url || ''}`.toLowerCase();

  if (str.includes('face') || str.includes('fb')) {
    return (
      <svg className="platform-svg" viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    );
  }
  if (str.includes('tik')) {
    return (
      <svg className="platform-svg" viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
      </svg>
    );
  }
  if (str.includes('insta')) {
    return (
      <svg className="platform-svg" viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
      </svg>
    );
  }
  if (str.includes('what') || str.includes('wa.me')) {
    return (
      <svg className="platform-svg" viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    );
  }
  if (str.includes('snap')) {
    return (
      <svg className="platform-svg" viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2C8 2 6 5 6 7c0 2-1 3-2 3-1 0-2 1-2 2 0 1 1 1 2 1 1 0 2 1 2 2 0 2-2 3-2 4 0 1 2 1 4 1 2 0 3-1 4-1s2 1 4 1c2 0 4 0 4-1 0-1-2-2-2-4 0-1 1-2 2-2 1 0 2 0 2-1 0-1-1-2-2-2-1 0-2-1-2-3 0-2-2-5-6-5z" />
      </svg>
    );
  }
  if (str.includes('tele') || str.includes('t.me')) {
    return (
      <svg className="platform-svg" viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 2L11 13" />
        <path d="M22 2L15 22L11 13L2 9L22 2Z" />
      </svg>
    );
  }
  if (str.includes('youtu')) {
    return (
      <svg className="platform-svg" viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
        <polygon points="10 15 15 12 10 9 10 15" />
      </svg>
    );
  }
  if (str.includes('twitter') || str.includes('x.com') || str.includes('x')) {
    return (
      <svg className="platform-svg" viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
        <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
      </svg>
    );
  }
  if (str.includes('pin')) {
    return (
      <svg className="platform-svg" viewBox="0 0 24 24" width="22" height="22" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="8" y1="20" x2="12" y2="11" />
        <path d="M10.7 14c.4-1.2 1.3-2 2.3-2 1.4 0 2.2 1 2.2 2.3 0 2.5-1.5 4.7-3.2 4.7-1 0-1.8-.7-1.8-1.5" />
      </svg>
    );
  }
  return <Share2 className="platform-svg" size={20} strokeWidth={1.6} />;
}

// Clean button text from cartoon emojis cleanly
const cleanButtonText = (text, isAr) => {
  if (!text) return isAr ? 'زيارة المنصة' : 'Visit Platform';
  let cleaned = text.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}✦]/gu, '').trim();
  if (cleaned.includes('انضم للجروب') || cleaned.includes('انضم للقروب')) return isAr ? 'الانضمام إلى الجروب' : 'Join Group';
  return cleaned || (isAr ? 'زيارة المنصة' : 'Visit Platform');
};

export default function SocialQRs({ showHeader = true }) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  const [socialList, setSocialList] = useState(() => getStoredSocialQRs());

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail?.items) {
        setSocialList(e.detail.items);
      } else {
        setSocialList(getStoredSocialQRs());
      }
    };

    const handleStorage = (e) => {
      if (e.key === 'al_ward_social_qrs_v1') {
        setSocialList(getStoredSocialQRs());
      }
    };

    window.addEventListener('al_ward_social_qrs_updated', handleUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('al_ward_social_qrs_updated', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  return (
    <section className="section social-qrs-section relative py-20 overflow-hidden" id="community-qrs">
      {/* Subtle ambient luxury backdrop glow */}
      <div className="social-ambient-glow" />

      <div className="container-wide relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="social-header-block text-center max-w-3xl mx-auto mb-14">
            {/* Top Golden Badge */}
            <div className="social-vip-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#E5C158] text-xs font-semibold tracking-wider mb-4 shadow-[0_0_20px_rgba(212,175,55,0.15)]">
              <Sparkles size={13} className="text-[#D4AF37]" />
              <span>{isAr ? '✦ المحافل الرقمية ومجتمع النخبة ✦' : '✦ Digital Salons & Elite Society ✦'}</span>
            </div>

            {/* Main Luxury Title */}
            <h2 className="social-main-title text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FFF6D6] tracking-tight mb-4 drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
              {isAr ? 'كواليس الصياغة الملكية بين يديك' : 'Royal Floral Craftsmanship at Your Fingertips'}
            </h2>

            {/* Description */}
            <p className="social-main-desc text-[#C4B7A6] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
              {isAr
                ? 'امسح الرمز الملكي بكاميرا هاتفك أو انقر للانضمام إلى مجتمع النخبة، حيث نشارككم كواليس القطف الصباحي وصياغة البوكيهات اليومية والخصومات الحصرية.'
                : 'Scan the royal code with your smartphone camera or click to join our elite circle, where we share daily dawn harvests, bespoke floristry, and private offerings.'}
            </p>
          </div>
        )}

        <div className="social-qrs-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {socialList.map((item) => {
            const btnText = cleanButtonText(isAr ? item.btn_text_ar : item.btn_text_en, isAr);
            const title = isAr ? item.title_ar : item.title_en;
            const desc = isAr ? item.description_ar : item.description_en;

            return (
              <div
                key={item.id}
                className="social-qr-card group relative flex flex-col items-center text-center p-6 sm:p-7 rounded-[28px] bg-gradient-to-b from-[#161112]/90 via-[#100C0D]/95 to-[#0A0708]/95 backdrop-blur-2xl border border-[#D4AF37]/20 hover:border-[#D4AF37]/70 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_25px_60px_-15px_rgba(212,175,55,0.22)] overflow-hidden"
                style={{
                  '--brand-color': item.theme_color || '#D4AF37',
                  '--brand-text-color': item.text_color || '#FFFFFF',
                }}
              >
                {/* Top Subtle Golden Gradient Line */}
                <div className="top-gold-line absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-1/2 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-60 group-hover:opacity-100 group-hover:w-3/4 transition-all duration-500" />

                {/* Subtle Inner Radial Glow on Hover */}
                <div className="card-ambient-hover-glow absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Platform Emblem Medallion */}
                <div className="platform-emblem-medallion w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C158] shadow-[0_0_15px_rgba(212,175,55,0.15)] group-hover:scale-110 group-hover:border-[#D4AF37]/60 group-hover:bg-[#D4AF37]/15 transition-all duration-300 mb-4">
                  <PlatformEmblem item={item} />
                </div>

                {/* Platform Title */}
                <h3 className="social-qr-title text-2xl font-bold text-[#FFF6D6] tracking-tight mb-2">
                  {title}
                </h3>

                {/* Handle Monospace Gold Capsule */}
                <div dir="ltr" className="handle-capsule-wrapper mb-2.5">
                  <span className="handle-capsule inline-block bg-[#1E1714] border border-[#D4AF37]/25 text-[#E5C158] text-xs px-3.5 py-1 rounded-full tracking-wider font-mono shadow-sm">
                    {item.handle}
                  </span>
                </div>

                {/* Card Description */}
                <p className="social-qr-desc text-neutral-300 text-xs leading-relaxed min-h-[36px] line-clamp-2 mb-5">
                  {desc}
                </p>

                {/* Royal Gold Scanner Frame Container */}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-qr-code-wrapper relative flex flex-col items-center mb-6 text-decoration-none group/scanner cursor-pointer"
                  title={isAr ? `فتح ${title}` : `Open ${title}`}
                >
                  {/* Outer Frame with Double Border Effect & 4 Golden Camera Corner Brackets */}
                  <div className="qr-scanner-frame relative p-2.5 rounded-[22px] border border-[#D4AF37]/35 bg-[#0D090B]/90 shadow-[0_8px_30px_rgba(0,0,0,0.6)] group-hover:border-[#D4AF37]/70 transition-all duration-500">
                    {/* 4 Golden Corner Brackets */}
                    <span className="corner-bracket corner-tr absolute -top-1 -right-1 w-3.5 h-3.5 border-t-2 border-r-2 border-[#E5C158] rounded-tr-[5px] pointer-events-none" />
                    <span className="corner-bracket corner-tl absolute -top-1 -left-1 w-3.5 h-3.5 border-t-2 border-l-2 border-[#E5C158] rounded-tl-[5px] pointer-events-none" />
                    <span className="corner-bracket corner-br absolute -bottom-1 -right-1 w-3.5 h-3.5 border-b-2 border-r-2 border-[#E5C158] rounded-br-[5px] pointer-events-none" />
                    <span className="corner-bracket corner-bl absolute -bottom-1 -left-1 w-3.5 h-3.5 border-b-2 border-l-2 border-[#E5C158] rounded-bl-[5px] pointer-events-none" />

                    {/* Warm Papyrus / Ivory QR Box Container */}
                    <div className="qr-papyrus-box relative bg-[#F6EFE0] p-3 rounded-2xl shadow-inner sepia-[.22] contrast-125 overflow-hidden flex items-center justify-center">
                      <QRCodeSVG
                        value={item.url || 'https://alwardlelward.com'}
                        size={142}
                        level="H"
                        includeMargin={false}
                        bgColor="#F6EFE0"
                        fgColor="#160F0C"
                      />
                      {/* Laser Scan Line */}
                      <div className="laser-scan-line" />
                    </div>
                  </div>

                  {/* Scan Instruction Hint */}
                  <span className="qr-scan-hint mt-2.5 inline-flex items-center gap-1.5 text-[11px] text-[#C4B7A6] group-hover:text-[#E5C158] transition-colors">
                    <QrCode size={13} className="text-[#D4AF37]" />
                    <span>{isAr ? 'امسح بالكاميرا أو اضغط للفتح' : 'Scan with camera or click to open'}</span>
                  </span>
                </a>

                {/* Luxury CTA Button */}
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="social-qr-btn luxury-cta-btn w-full py-3.5 px-5 rounded-2xl bg-gradient-to-r from-[#211A16] via-[#2A2019] to-[#211A16] hover:from-[#D4AF37] hover:to-[#B8860B] text-[#F3E5AB] hover:text-[#090707] font-bold text-sm border border-[#D4AF37]/30 hover:border-transparent transition-all duration-300 flex items-center justify-center gap-2 shadow-lg group/btn mt-auto"
                >
                  <span>{btnText}</span>
                  {isAr ? (
                    <ArrowUpLeft
                      size={16}
                      className="btn-arrow text-[#D4AF37] group-hover/btn:text-[#090707] transition-all duration-300 transform group-hover/btn:-translate-x-1 group-hover/btn:-translate-y-0.5"
                    />
                  ) : (
                    <ArrowUpRight
                      size={16}
                      className="btn-arrow text-[#D4AF37] group-hover/btn:text-[#090707] transition-all duration-300 transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-0.5"
                    />
                  )}
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

