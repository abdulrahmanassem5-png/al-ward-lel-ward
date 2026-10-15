import React from 'react';
import { useTranslation } from 'react-i18next';
import { QRCodeSVG } from 'qrcode.react';
import { SOCIAL_COMMUNITY_QRS } from '../../../config/constants.js';
import { Sparkles, ExternalLink, QrCode } from 'lucide-react';
import './SocialQRs.css';

export default function SocialQRs({ showHeader = true }) {
  const { i18n } = useTranslation();
  const isAr = i18n.language === 'ar';

  return (
    <section className="section social-qrs-section" id="community-qrs">
      <div className="container-wide">
        {showHeader && (
          <div className="section-header text-center">
            <span className="section-subtitle">
              <Sparkles size={14} />
              {isAr ? 'تواصل وتفاعل معنا' : 'Connect With Our Community'}
            </span>
            <h2 className="section-title">
              {isAr ? 'مجتمع الورد للورد على منصات التواصل' : 'Join Our Floral Community'}
            </h2>
            <p className="section-desc">
              {isAr
                ? 'امسح الباركود بكاميرا هاتفك أو اضغط على الزر للمتابعة والانضمام لخصوماتنا وعروضنا الحصرية'
                : 'Scan the QR codes with your smartphone camera or click to join our daily floral showcases and exclusive offers'}
            </p>
          </div>
        )}

        <div className="social-qrs-grid">
          {SOCIAL_COMMUNITY_QRS.map((item) => (
            <div key={item.id} className="social-qr-card">
              <div className="social-qr-header">
                <h3 className="social-qr-title">
                  {isAr ? item.title_ar : item.title_en}
                </h3>
                <span className="social-qr-handle">{item.handle}</span>
                <p className="social-qr-desc">
                  {isAr ? item.description_ar : item.description_en}
                </p>
              </div>

              {/* QR Code Container */}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-qr-code-wrapper"
                title={isAr ? `فتح ${item.title_ar}` : `Open ${item.title_en}`}
              >
                <div className="social-qr-white-box">
                  <QRCodeSVG
                    value={item.url}
                    size={144}
                    level="H"
                    includeMargin={false}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                  />
                </div>
                <span className="qr-scan-hint">
                  <QrCode size={13} />
                  <span>{isAr ? 'امسح أو اضغط للفتح' : 'Scan or click to open'}</span>
                </span>
              </a>

              {/* Bottom Pill Action Button */}
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="social-qr-btn"
                style={{ '--brand-color': item.theme_color }}
              >
                <span>{isAr ? item.btn_text_ar : item.btn_text_en}</span>
                <ExternalLink size={14} className="ext-icon" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
