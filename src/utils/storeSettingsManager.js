import { STORE_INFO, CURRENCY } from '../config/constants.js';

export const STORE_SETTINGS_KEY = 'al_ward_store_settings';
export const SETTINGS_UPDATED_EVENT = 'al_ward_settings_updated';

// Egyptian mobile number validator regex: 010, 011, 012, 015 followed by 8 digits
export const EGYPTIAN_PHONE_REGEX = /^(?:\+?20|0)?1[0125]\d{8}$/;

/**
 * Validates Egyptian phone number format
 */
export function isValidEgyptianPhone(phone) {
  if (!phone) return false;
  const cleaned = String(phone).trim().replace(/[\s-]/g, '');
  return EGYPTIAN_PHONE_REGEX.test(cleaned);
}

/**
 * Formats a phone number cleanly for WhatsApp links (wa.me)
 */
export function formatPhoneForWhatsApp(phone) {
  if (!phone) return STORE_INFO.whatsapp;
  const digits = String(phone).replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return `2${digits}`;
  }
  if (!digits.startsWith('20') && digits.length === 10) {
    return `20${digits}`;
  }
  return digits || STORE_INFO.whatsapp;
}

/**
 * Default Atelier Store Settings
 */
export const DEFAULT_STORE_SETTINGS = {
  name_ar: STORE_INFO.name_ar,
  name_en: STORE_INFO.name_en,
  tagline_ar: STORE_INFO.tagline_ar,
  whatsapp: STORE_INFO.whatsapp,
  email: STORE_INFO.email,
  address_ar: STORE_INFO.address_ar,
  deliveryFee: 25,
  freeDeliveryThreshold: 300,
  vipChilledDeliveryThreshold: 1500,
  vatRate: 0,
  currencySymbol_ar: CURRENCY.symbol_ar,
  currencySymbol_en: CURRENCY.symbol_en,
  enableSameDay: true,
  enableWhatsAppDirect: true,
  soundNotifications: true,
  instapay_account: 'alward@instapay',
  vodafone_cash_number: '01221120701',
};

/**
 * Retrieve current store settings from localStorage with safe defaults
 */
export function getStoreSettings() {
  if (typeof localStorage === 'undefined') {
    return { ...DEFAULT_STORE_SETTINGS };
  }
  try {
    const saved = localStorage.getItem(STORE_SETTINGS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (typeof parsed === 'object' && parsed !== null) {
        return { ...DEFAULT_STORE_SETTINGS, ...parsed };
      }
    }
  } catch (err) {
    console.error('Error loading store settings:', err);
  }
  return { ...DEFAULT_STORE_SETTINGS };
}

/**
 * Save store settings and broadcast update event
 */
export function saveStoreSettings(newSettings) {
  if (typeof localStorage === 'undefined') return;
  try {
    const updated = { ...getStoreSettings(), ...newSettings };
    localStorage.setItem(STORE_SETTINGS_KEY, JSON.stringify(updated));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(SETTINGS_UPDATED_EVENT, { detail: updated }));
    }
    return updated;
  } catch (err) {
    console.error('Error saving store settings:', err);
    throw err;
  }
}

/**
 * Known ERP storage keys managed by the platform
 */
export const ERP_BACKUP_KEYS = [
  'al_ward_orders',
  'al_ward_raw_materials',
  'al_ward_raw_inventory',
  'al_ward_bouquet_recipes',
  'al_ward_products',
  'al_ward_products_v1',
  'al_ward_products_stock',
  'al_ward_offers',
  'al_ward_customers',
  'al_ward_store_settings',
  'al_ward_products_overrides',
  'al_ward_social_links',
];

/**
 * Event broadcast when an ERP backup is restored
 */
export const ERP_RESTORED_EVENT = 'al_ward_erp_restored';

/**
 * Aggregates all ERP and store data from localStorage into a unified backup object
 */
export function exportERPBackupData() {
  if (typeof localStorage === 'undefined') {
    return { version: '1.0.0', exportedAt: new Date().toISOString(), data: {} };
  }

  const dateStr = new Date().toISOString().split('T')[0];
  const safeParse = (key, fallback) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  };

  const orders = safeParse('al_ward_orders', []);
  const rawMaterials = safeParse('al_ward_raw_materials', null) || safeParse('al_ward_raw_inventory', []);
  const bouquetRecipes = safeParse('al_ward_bouquet_recipes', []);
  const products = safeParse('al_ward_products', null) || safeParse('al_ward_products_v1', []);
  const productsStock = safeParse('al_ward_products_stock', {});
  const offers = safeParse('al_ward_offers', []);
  const customers = safeParse('al_ward_customers', []);
  const storeSettings = safeParse('al_ward_store_settings', getStoreSettings());
  const productOverrides = safeParse('al_ward_products_overrides', {});
  const socialLinks = safeParse('al_ward_social_links', []);

  return {
    system: 'al-ward-lel-ward-erp',
    version: '1.0.0',
    exportDate: dateStr,
    timestamp: new Date().toISOString(),
    storeName: 'الورد للورد ✦ Atelier Royal',
    data: {
      al_ward_orders: orders,
      al_ward_raw_materials: rawMaterials,
      al_ward_raw_inventory: rawMaterials,
      al_ward_bouquet_recipes: bouquetRecipes,
      al_ward_products: products,
      al_ward_products_v1: products,
      al_ward_products_stock: productsStock,
      al_ward_offers: offers,
      al_ward_customers: customers,
      al_ward_store_settings: storeSettings,
      al_ward_products_overrides: productOverrides,
      al_ward_social_links: socialLinks,
    },
  };
}

/**
 * Downloads the ERP backup as a timestamped JSON file (e.g. elward_erp_backup_YYYY-MM-DD.json)
 */
export function downloadERPBackupFile() {
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `elward_erp_backup_${dateStr}.json`;
  const backup = exportERPBackupData();
  const jsonStr = JSON.stringify(backup, null, 2);

  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);

  return { filename, size: jsonStr.length };
}

/**
 * Validates and restores an ERP backup JSON into localStorage, broadcasting sync events
 */
export function restoreERPBackupData(jsonStringOrObject) {
  if (typeof localStorage === 'undefined') {
    throw new Error('localStorage is not available in current environment');
  }

  let backup;
  if (typeof jsonStringOrObject === 'string') {
    try {
      backup = JSON.parse(jsonStringOrObject);
    } catch {
      throw new Error('الملف المرفوع ليس ملف JSON صالح (Invalid JSON file)');
    }
  } else if (typeof jsonStringOrObject === 'object' && jsonStringOrObject !== null) {
    backup = jsonStringOrObject;
  } else {
    throw new Error('صيغة ملف النسخة الاحتياطية غير صالحة');
  }

  // Extract payload whether nested in .data or at root level
  const payload = backup.data && typeof backup.data === 'object' ? backup.data : backup;

  // Validate that payload contains at least some recognized ERP keys
  const hasRecognizedKeys = Object.keys(payload).some((k) =>
    ERP_BACKUP_KEYS.includes(k) || k.startsWith('al_ward_')
  );

  if (!hasRecognizedKeys) {
    throw new Error('هيكل ملف النسخة الاحتياطية غير متطابق مع نظام «الورد للورد»');
  }

  let restoredCount = 0;
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);
      localStorage.setItem(key, serialized);
      restoredCount += 1;
    }
  });

  // Ensure synchronized aliases
  if (payload.al_ward_raw_materials && !payload.al_ward_raw_inventory) {
    localStorage.setItem('al_ward_raw_inventory', JSON.stringify(payload.al_ward_raw_materials));
  }
  if (payload.al_ward_raw_inventory && !payload.al_ward_raw_materials) {
    localStorage.setItem('al_ward_raw_materials', JSON.stringify(payload.al_ward_raw_inventory));
  }
  if (payload.al_ward_products && !payload.al_ward_products_v1) {
    localStorage.setItem('al_ward_products_v1', JSON.stringify(payload.al_ward_products));
  }
  if (payload.al_ward_products_v1 && !payload.al_ward_products) {
    localStorage.setItem('al_ward_products', JSON.stringify(payload.al_ward_products_v1));
  }

  // Broadcast all reactive sync events
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(SETTINGS_UPDATED_EVENT, { detail: payload.al_ward_store_settings }));
    window.dispatchEvent(new CustomEvent('al_ward_products_updated', { detail: payload.al_ward_products }));
    window.dispatchEvent(new CustomEvent('al_ward_social_qrs_updated', { detail: { items: payload.al_ward_social_links } }));
    window.dispatchEvent(new CustomEvent('al_ward_inventory_updated', { detail: payload.al_ward_raw_inventory }));
    window.dispatchEvent(new CustomEvent('al_ward_orders_updated', { detail: payload.al_ward_orders }));
    window.dispatchEvent(new CustomEvent(ERP_RESTORED_EVENT, { detail: payload }));
  }

  return { success: true, restoredCount };
}

