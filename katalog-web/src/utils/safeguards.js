/**
 * Data Integrity & Security Safeguards for Enef Clinic Web Catalog
 */

const DEFAULT_SLIDES = [
  { id: 'default1', url: `${import.meta.env.BASE_URL}assets/Slide1.jpg` },
  { id: 'default2', url: `${import.meta.env.BASE_URL}assets/Slide2.jpg` },
  { id: 'default3', url: `${import.meta.env.BASE_URL}assets/Slide3.jpg` },
  { id: 'default4', url: `${import.meta.env.BASE_URL}assets/Slide4.jpeg` },
  { id: 'default5', url: `${import.meta.env.BASE_URL}assets/Slide5.jpeg` },
];

const DEFAULT_SKINCARE = [
  { id: 'default_sk1', name: 'Cleanser / Facial Wash', image: `${import.meta.env.BASE_URL}assets/product_skincare/skincare1.jpeg`, price: '58000', description: 'Cleanser & Facial Wash pembersih minyak, kotoran & sisa make up.' },
  { id: 'default_sk2', name: 'Moisturizer', image: `${import.meta.env.BASE_URL}assets/product_skincare/skincare2.jpeg`, price: '83000', description: 'Moisturizer melembapkan kulit wajah & menjaga hidrasi.' },
  { id: 'default_sk3', name: 'Sunscreen', image: `${import.meta.env.BASE_URL}assets/product_skincare/skincare3.jpeg`, price: '83000', description: 'Sunscreen melindungi kulit dari sinar UVB & UVA SPF 30/50.' },
  { id: 'default_sk4', name: 'Serum', image: `${import.meta.env.BASE_URL}assets/product_skincare/skincare4.jpeg`, price: '53000', description: 'Serum pilihan sesuai dengan kebutuhan kulit.' },
  { id: 'default_sk5', name: 'Night Cream', image: `${import.meta.env.BASE_URL}assets/product_skincare/skincare5.jpeg`, price: '83000', description: 'Night cream/krim malam sesuai dengan kebutuhan kulitmu.' },
];

/**
 * Sanitize text inputs against HTML/XSS injection
 */
export const sanitizeText = (text) => {
  if (!text || typeof text !== 'string') return '';
  return text
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .trim();
};

/**
 * Validate image file size and MIME type before upload
 */
export const validateImageFile = (file, maxMB = 3) => {
  if (!file) return { valid: false, message: 'Tidak ada file yang dipilih.' };
  
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type.toLowerCase())) {
    return { valid: false, message: 'Format file tidak didukung. Harap gunakan format JPG, JPEG, PNG, atau WEBP.' };
  }

  const maxBytes = maxMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return { valid: false, message: `Ukuran file terlalu besar! Maksimal ${maxMB} MB.` };
  }

  return { valid: true };
};

/**
 * Sanitize and deduplicate Promo Slides to prevent overlapping DOM elements
 */
export const sanitizePromos = (promos) => {
  if (!Array.isArray(promos) || promos.length === 0) {
    return DEFAULT_SLIDES;
  }

  const seenUrls = new Set();
  const cleanPromos = [];

  for (const item of promos) {
    if (!item) continue;
    const url = typeof item === 'string' ? item : item.url;
    if (!url || typeof url !== 'string' || url.trim() === '') continue;

    const normalizedUrl = url.trim().toLowerCase();
    if (!seenUrls.has(normalizedUrl)) {
      seenUrls.add(normalizedUrl);
      cleanPromos.push(typeof item === 'string' ? { id: `promo_${cleanPromos.length}`, url } : item);
    }

    if (cleanPromos.length >= 5) break; // Maximum 5 slides guard
  }

  return cleanPromos.length > 0 ? cleanPromos : DEFAULT_SLIDES;
};

/**
 * Sanitize and deduplicate Skincare Products
 */
export const sanitizeSkincare = (products) => {
  if (!Array.isArray(products) || products.length === 0) {
    return DEFAULT_SKINCARE;
  }

  const seenNames = new Set();
  const cleanProducts = [];

  for (const prod of products) {
    if (!prod || !prod.name || typeof prod.name !== 'string') continue;
    const key = prod.name.trim().toLowerCase();

    if (!seenNames.has(key)) {
      seenNames.add(key);
      cleanProducts.push({
        ...prod,
        name: sanitizeText(prod.name),
        description: sanitizeText(prod.description || '')
      });
    }

    if (cleanProducts.length >= 5) break;
  }

  return cleanProducts.length > 0 ? cleanProducts : DEFAULT_SKINCARE;
};

/**
 * Sanitize and deduplicate Treatments list
 */
export const sanitizeTreatments = (treatments) => {
  if (!Array.isArray(treatments)) return [];

  const seenKeys = new Set();
  const cleanTreatments = [];

  for (const t of treatments) {
    if (!t || !t.name || typeof t.name !== 'string') continue;
    
    // Unique key combination of name + discount
    const key = `${t.name.trim().toLowerCase()}_${t.discount || 0}`;

    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      cleanTreatments.push({
        ...t,
        name: sanitizeText(t.name),
        description: sanitizeText(t.description || ''),
        price: sanitizeText(t.price || ''),
        discount: Number(t.discount) || 0
      });
    }
  }

  return cleanTreatments;
};
