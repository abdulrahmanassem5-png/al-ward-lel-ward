import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  keywords?: string;
  jsonLd?: Record<string, any>;
}

const DEFAULT_TITLE = 'الورد للورد | دار صياغة الزهور والمشاعر الملكية';
const DEFAULT_DESCRIPTION =
  'الورد للورد | Al-Ward Lel-Ward — دار صياغة الزهور والتحف النباتية الملكية. بوكيهات أعراس فاخرة، وتصاميم أزهار طبيعية نادرة تُصاغ بشغف لتخليد أغلى اللحظات.';
const BASE_URL = 'https://el-ward-ll-ward-store.vercel.app';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-royal-preview.jpg`;

export default function SEO({
  title,
  description,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  keywords,
  jsonLd,
}: SEOProps) {
  const location = useLocation();

  useEffect(() => {
    // 1. Document Title
    const finalTitle = title ? `${title} | الورد للورد ✦` : DEFAULT_TITLE;
    document.title = finalTitle;

    // Helper to set or create meta tags
    const setMetaTag = (selector: string, attr: string, value: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement('meta');
        const [attrName, attrVal] = selector.replace(/[[\]']/g, '').split('=');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute(attr, value);
    };

    // Helper to set or create link tags
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    const finalDescription = description || DEFAULT_DESCRIPTION;
    const finalUrl = canonicalUrl || `${BASE_URL}${location.pathname}`;
    const finalImage = ogImage || DEFAULT_OG_IMAGE;

    // 2. Primary Meta Tags
    setMetaTag('meta[name="title"]', 'content', finalTitle);
    setMetaTag('meta[name="description"]', 'content', finalDescription);
    if (keywords) {
      setMetaTag('meta[name="keywords"]', 'content', keywords);
    }
    setLinkTag('canonical', finalUrl);

    // 3. Open Graph Tags
    setMetaTag('meta[property="og:title"]', 'content', finalTitle);
    setMetaTag('meta[property="og:description"]', 'content', finalDescription);
    setMetaTag('meta[property="og:url"]', 'content', finalUrl);
    setMetaTag('meta[property="og:image"]', 'content', finalImage);
    setMetaTag('meta[property="og:image:secure_url"]', 'content', finalImage);
    setMetaTag('meta[property="og:type"]', 'content', ogType);

    // 4. Twitter Cards
    setMetaTag('meta[name="twitter:title"]', 'content', finalTitle);
    setMetaTag('meta[name="twitter:description"]', 'content', finalDescription);
    setMetaTag('meta[name="twitter:url"]', 'content', finalUrl);
    setMetaTag('meta[name="twitter:image"]', 'content', finalImage);

    // 5. Dynamic JSON-LD (if specified)
    let jsonLdScript: HTMLScriptElement | null = null;
    if (jsonLd) {
      // Remove any existing dynamic jsonld first
      const existing = document.getElementById('dynamic-page-jsonld');
      if (existing) existing.remove();

      jsonLdScript = document.createElement('script');
      jsonLdScript.type = 'application/ld+json';
      jsonLdScript.id = 'dynamic-page-jsonld';
      jsonLdScript.text = JSON.stringify(jsonLd);
      document.head.appendChild(jsonLdScript);
    }

    return () => {
      if (jsonLdScript && jsonLdScript.parentNode) {
        jsonLdScript.parentNode.removeChild(jsonLdScript);
      }
    };
  }, [title, description, canonicalUrl, ogImage, ogType, keywords, jsonLd, location.pathname]);

  return null;
}
