import { MOCK_PRODUCTS } from '../config/constants.js';

const STORAGE_KEY = 'al_ward_products_v1';
const UPDATE_EVENT = 'al_ward_products_updated';

/**
 * Helper to get initial products merged with any legacy overrides
 */
function getInitialProducts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }

    // Merge with any legacy price overrides from recipeInventoryManager
    const legacyOverrides = JSON.parse(localStorage.getItem('al_ward_products_overrides') || '{}');
    const merged = MOCK_PRODUCTS.map((p) => {
      const override = legacyOverrides[p.id];
      if (override) {
        return {
          ...p,
          price: override.price ?? p.price,
          sale_price: override.sale_price ?? p.sale_price,
        };
      }
      return p;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch (err) {
    console.error('Failed to initialize products storage:', err);
    return MOCK_PRODUCTS;
  }
}

/**
 * Returns all stored products
 */
export function getStoredProducts() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return getInitialProducts();
    }
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : MOCK_PRODUCTS;
  } catch (err) {
    console.error('Failed to read stored products:', err);
    return MOCK_PRODUCTS;
  }
}

/**
 * Find single product by ID
 */
export function getStoredProductById(id) {
  const products = getStoredProducts();
  return products.find((p) => String(p.id) === String(id)) || null;
}

/**
 * Save or update product and broadcast event
 */
export function saveStoredProduct(productData) {
  try {
    const products = getStoredProducts();
    const existingIndex = products.findIndex((p) => String(p.id) === String(productData.id));

    let updatedList;
    if (existingIndex >= 0) {
      updatedList = products.map((p, idx) =>
        idx === existingIndex ? { ...p, ...productData } : p
      );
    } else {
      updatedList = [productData, ...products];
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));

    // Also update legacy overrides for price if applicable
    try {
      const legacyOverrides = JSON.parse(localStorage.getItem('al_ward_products_overrides') || '{}');
      legacyOverrides[productData.id] = {
        price: productData.price,
        sale_price: productData.sale_price,
      };
      localStorage.setItem('al_ward_products_overrides', JSON.stringify(legacyOverrides));
    } catch {}

    // Dispatch custom event for real-time reactivity across components
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(UPDATE_EVENT, {
          detail: { product: productData, all: updatedList },
        })
      );
    }

    return updatedList;
  } catch (err) {
    console.error('Failed to save product:', err);
    return getStoredProducts();
  }
}

/**
 * Delete product by ID and broadcast event
 */
export function deleteStoredProduct(id) {
  try {
    const products = getStoredProducts();
    const updatedList = products.filter((p) => String(p.id) !== String(id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent(UPDATE_EVENT, {
          detail: { deletedId: id, all: updatedList },
        })
      );
    }

    return updatedList;
  } catch (err) {
    console.error('Failed to delete product:', err);
    return getStoredProducts();
  }
}

/**
 * Helper to convert uploaded File into Base64 Data URL for persistent storage
 */
export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
}

/**
 * Helper to detect video type from URL or source
 */
export function parseVideoUrl(url) {
  if (!url) return null;
  const str = url.trim();

  // YouTube detection
  const ytMatch = str.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i
  );
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      id: ytMatch[1],
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=0&rel=0`,
      originalUrl: str,
    };
  }

  // Vimeo detection
  const vimeoMatch = str.match(/(?:vimeo\.com\/)(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      type: 'vimeo',
      id: vimeoMatch[1],
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      originalUrl: str,
    };
  }

  // Direct MP4 / WebM / Cloud Storage video URL or Data URL
  return {
    type: 'direct',
    embedUrl: str,
    originalUrl: str,
  };
}
