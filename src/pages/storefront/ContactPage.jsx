import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { STORE_INFO } from '../../config/constants.js';
import { useNotification } from '../../context/NotificationContext.jsx';
import SocialQRs from '../../components/storefront/SocialQRs/SocialQRs.jsx';
import { Phone, Mail, MapPin, MessageCircle, Send, Clock, Sparkles } from 'lucide-react';
import './ContactPage.css';

export default function ContactPage() {
  const { t, i18n } = useTranslation();
  const { showSuccess } = useNotification();
  const isAr = i18n.language === 'ar';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    showSuccess(
      isAr ? 'شكراً لتواصلك معنا! سنرد عليك في أقرب وقت 🌹' : 'Thank you for reaching out! We will reply shortly 🌹'
    );
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleWhatsAppChat = () => {
    const text = isAr ? 'مرحباً، أود الاستفسار والتواصل معكم بخصوص متجر الورد للورد 🌹' : 'Hello, I have an inquiry about Al-Ward Lel-Ward 🌹';
    window.open(`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="contact-page container-wide">
      <div className="contact-header">
        <span className="contact-badge">
          <Sparkles size={14} /> {isAr ? 'يسعدنا تواصلكم' : 'Get In Touch'}
        </span>
        <h1 className="contact-title">
          {isAr ? 'تواصل معنا' : 'Contact Us'}
        </h1>
        <p className="contact-desc">
          {isAr
            ? 'فريق منسقي الزهور وخدمة العملاء جاهزون دائماً للرد على كافة استفساراتكم وتلبية طلباتكم الخاصة.'
            : 'Our florists and concierge team are at your service for inquiries and bespoke requests.'}
        </p>
      </div>

      <div className="contact-grid">
        {/* Info Col */}
        <div className="contact-info-col">
          <div className="contact-card glass">
            <h3 className="info-box-title">{isAr ? 'قنوات التواصل المباشرة' : 'Direct Channels'}</h3>

            <div className="info-list">
              <div className="info-entry" onClick={handleWhatsAppChat} style={{ cursor: 'pointer' }}>
                <div className="info-icon-box wa-box">
                  <MessageCircle size={20} />
                </div>
                <div>
                  <label>{isAr ? 'واتساب مباشر' : 'Direct WhatsApp'}</label>
                  <span>{STORE_INFO.phone}</span>
                </div>
              </div>

              <div className="info-entry">
                <div className="info-icon-box">
                  <Mail size={20} />
                </div>
                <div>
                  <label>{isAr ? 'البريد الإلكتروني' : 'Email Address'}</label>
                  <span>{STORE_INFO.email}</span>
                </div>
              </div>

              <div className="info-entry">
                <div className="info-icon-box">
                  <MapPin size={20} />
                </div>
                <div>
                  <label>{isAr ? 'الموقع' : 'Location'}</label>
                  <span>{isAr ? STORE_INFO.address_ar : STORE_INFO.address_en}</span>
                </div>
              </div>

              <div className="info-entry">
                <div className="info-icon-box">
                  <Clock size={20} />
                </div>
                <div>
                  <label>{isAr ? 'ساعات العمل' : 'Working Hours'}</label>
                  <span>{isAr ? 'يومياً من 9:00 صباحاً حتى 11:00 مساءً' : 'Daily 9:00 AM – 11:00 PM'}</span>
                </div>
              </div>
            </div>

            <button onClick={handleWhatsAppChat} className="btn-chat-wa">
              <MessageCircle size={20} />
              <span>{isAr ? 'محادثة فورية مع المنسق' : 'Chat Live on WhatsApp'}</span>
            </button>
          </div>
        </div>

        {/* Message Form Col */}
        <div className="contact-form-col">
          <form onSubmit={handleSubmit} className="contact-form-card glass">
            <h3 className="form-box-title">{isAr ? 'أرسل لنا رسالة' : 'Send us a Message'}</h3>

            <div className="contact-form-group">
              <label>{isAr ? 'الاسم الكامل *' : 'Full Name *'}</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={isAr ? 'اسمك الكريم' : 'Your name'}
              />
            </div>

            <div className="contact-form-row">
              <div className="contact-form-group">
                <label>{isAr ? 'رقم الجوال *' : 'Phone Number *'}</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="05XXXXXXXX"
                />
              </div>

              <div className="contact-form-group">
                <label>{isAr ? 'البريد الإلكتروني' : 'Email'}</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="example@mail.com"
                />
              </div>
            </div>

            <div className="contact-form-group">
              <label>{isAr ? 'موضوع الرسالة' : 'Subject'}</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder={isAr ? 'استفسار عن بوكيه، طلب خاص، مناسبة...' : 'Inquiry, custom request, event...'}
              />
            </div>

            <div className="contact-form-group">
              <label>{isAr ? 'نص الرسالة *' : 'Message *'}</label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={isAr ? 'اكتب تفاصيل استفسارك هنا...' : 'Write your inquiry here...'}
              />
            </div>

            <button type="submit" className="btn-send-message">
              <Send size={18} />
              <span>{isAr ? 'إرسال الرسالة' : 'Send Message'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Social Community QR Codes */}
      <div style={{ marginTop: '50px' }}>
        <SocialQRs showHeader={true} />
      </div>
    </div>
  );
}
