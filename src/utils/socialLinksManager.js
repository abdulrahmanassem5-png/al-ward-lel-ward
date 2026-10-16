import { SOCIAL_COMMUNITY_QRS } from '../config/constants.js';

const STORAGE_KEY = 'al_ward_social_qrs_v1';
const UPDATE_EVENT = 'al_ward_social_qrs_updated';

// Popular platform templates with verified brand colors and presets
export const PLATFORM_PRESETS = [
  {
    key: 'snapchat',
    name_ar: 'سناب شات',
    name_en: 'Snapchat',
    handle: '@elward_roses',
    description_ar: 'كواليس الستوري واليوميات الحية للدار',
    description_en: 'Live stories & backstage floral moments',
    default_url: 'https://www.snapchat.com/add/elward_roses',
    btn_text_ar: 'متابعة السناب',
    btn_text_en: 'Follow Snapchat',
    theme_color: '#FFFC00',
    text_color: '#000000',
  },
  {
    key: 'telegram',
    name_ar: 'تيليجرام VIP',
    name_en: 'Telegram VIP',
    handle: '@elward_vip',
    description_ar: 'قناة العروض الحصرية والأولوية في الحجز',
    description_en: 'Exclusive VIP deals & priority bookings',
    default_url: 'https://t.me/elward_vip',
    btn_text_ar: 'الانضمام للقناة',
    btn_text_en: 'Join Channel',
    theme_color: '#0088CC',
    text_color: '#FFFFFF',
  },
  {
    key: 'youtube',
    name_ar: 'يوتيوب',
    name_en: 'YouTube',
    handle: 'Al-Ward Lel-Ward',
    description_ar: 'فيديوهات وتجهيزات الأعراس والمناسبات',
    description_en: 'Bridal showcases & documentary films',
    default_url: 'https://youtube.com/@elward_roses',
    btn_text_ar: 'الاشتراك في القناة',
    btn_text_en: 'Subscribe',
    theme_color: '#FF0000',
    text_color: '#FFFFFF',
  },
  {
    key: 'x',
    name_ar: 'إكس (تويتر)',
    name_en: 'X (Twitter)',
    handle: '@elward_roses',
    description_ar: 'أحدث الأخبار والإعلانات الرسمية',
    description_en: 'Official announcements & brand news',
    default_url: 'https://x.com/elward_roses',
    btn_text_ar: 'متابعة الحساب',
    btn_text_en: 'Follow on X',
    theme_color: '#000000',
    text_color: '#FFFFFF',
  },
  {
    key: 'pinterest',
    name_ar: 'بنترست',
    name_en: 'Pinterest',
    handle: 'alward_roses',
    description_ar: 'لوحات إلهام وتنسيقات البوكيهات الملكية',
    description_en: 'Floral inspiration & bridal boards',
    default_url: 'https://pinterest.com/alward_roses',
    btn_text_ar: 'تصفح الأفكار',
    btn_text_en: 'Explore Boards',
    theme_color: '#E60023',
    text_color: '#FFFFFF',
  },
  {
    key: 'facebook',
    name_ar: 'فيسبوك',
    name_en: 'Facebook',
    handle: 'facebook.com/elward',
    description_ar: 'الصفحة الرسمية لـ الورد للورد',
    description_en: 'Official Facebook page of Al-Ward Lel-Ward',
    default_url: 'https://facebook.com/elward',
    btn_text_ar: 'زيارة الصفحة',
    btn_text_en: 'Visit Page',
    theme_color: '#1877F2',
    text_color: '#FFFFFF',
  },
  {
    key: 'tiktok',
    name_ar: 'تيك توك',
    name_en: 'TikTok',
    handle: '@flowers.house23',
    description_ar: 'كواليس تنسيق البوكيهات والشحن',
    description_en: 'Behind-the-scenes bouquet styling & shipping',
    default_url: 'https://www.tiktok.com/@flowers.house23',
    btn_text_ar: 'مشاهدة الفيديوهات',
    btn_text_en: 'Watch Videos',
    theme_color: '#EE1D52',
    text_color: '#FFFFFF',
  },
  {
    key: 'instagram',
    name_ar: 'إنستغرام',
    name_en: 'Instagram',
    handle: '@ELWARD_LELWARD',
    description_ar: 'صور وفيديوهات البوكيهات اليومية',
    description_en: 'Daily bouquet showcases & video reels',
    default_url: 'https://www.instagram.com/ELWARD_LELWARD',
    btn_text_ar: 'متابعة الحساب',
    btn_text_en: 'Follow Account',
    theme_color: '#E4405F',
    text_color: '#FFFFFF',
  },
  {
    key: 'whatsapp',
    name_ar: 'جروب واتساب الورد',
    name_en: 'WhatsApp Community',
    handle: 'WhatsApp Community',
    description_ar: 'خصومات حصرية ومتابعة أول بأول',
    description_en: 'Exclusive deals and real-time updates',
    default_url: 'https://wa.me/201221120701?text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B%D8%8C%20%D8%A3%D9%88%D8%AF%20%D8%A7%D9%84%D8%A7%D9%86%D8%B6%D9%85%D8%A7%D9%85%20%D9%84%D8%AC%D8%B1%D9%88%D8%A8%20%D9%88%D8%A7%D8%AA%D8%B3%D8%A7%D8%A8%20%D8%A7%D9%84%D9%88%D8%B1%D8%AF%20%D9%84%D9%84%D9%88%D8%B1%D8%AF%20%F0%9F%8C%B9',
    btn_text_ar: 'الانضمام للجروب',
    btn_text_en: 'Join Community',
    theme_color: '#25D366',
    text_color: '#FFFFFF',
  },
  {
    key: 'custom',
    name_ar: 'رابط مخصص',
    name_en: 'Custom Link',
    handle: '@custom_link',
    description_ar: 'رابط مباشر لأي منصة أو خدمة خاصة',
    description_en: 'Direct link to any custom platform',
    default_url: 'https://alwardlelward.com',
    btn_text_ar: 'زيارة الرابط',
    btn_text_en: 'Visit Link',
    theme_color: '#D4AF37',
    text_color: '#0E090F',
  },
];

/**
 * Get all stored Social QRs with fallback to defaults
 */
export function getStoredSocialQRs() {
  const sanitize = (list) =>
    list.map((item) => ({
      ...item,
      btn_text_ar: item.btn_text_ar
        ? item.btn_text_ar.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}✦]/gu, '').trim()
        : item.btn_text_ar,
      btn_text_en: item.btn_text_en
        ? item.btn_text_en.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}✦]/gu, '').trim()
        : item.btn_text_en,
    }));

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return sanitize(parsed);
      }
    }
    // Initialize default items
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SOCIAL_COMMUNITY_QRS));
    return SOCIAL_COMMUNITY_QRS;
  } catch (err) {
    console.error('Error reading social QRs from storage:', err);
    return SOCIAL_COMMUNITY_QRS;
  }
}

/**
 * Save entire social QRs list and emit update event
 */
export function saveStoredSocialQRs(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(UPDATE_EVENT, { detail: { items } })
      );
    }
    return items;
  } catch (err) {
    console.error('Error saving social QRs:', err);
    return items;
  }
}

/**
 * Add a new social QR platform
 */
export function addSocialQR(item) {
  const current = getStoredSocialQRs();
  const newItem = {
    ...item,
    id: item.id || `social_${Date.now()}`,
  };
  const updated = [...current, newItem];
  return saveStoredSocialQRs(updated);
}

/**
 * Update an existing social QR platform
 */
export function updateSocialQR(id, updatedFields) {
  const current = getStoredSocialQRs();
  const updated = current.map((item) =>
    item.id === id ? { ...item, ...updatedFields } : item
  );
  return saveStoredSocialQRs(updated);
}

/**
 * Delete a social QR platform
 */
export function deleteSocialQR(id) {
  const current = getStoredSocialQRs();
  const updated = current.filter((item) => item.id !== id);
  return saveStoredSocialQRs(updated);
}

/**
 * Reset social QRs back to original 4 defaults
 */
export function resetSocialQRsToDefault() {
  return saveStoredSocialQRs(SOCIAL_COMMUNITY_QRS);
}
