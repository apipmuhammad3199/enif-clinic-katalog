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
 * Helper to check if a URL is an Unsplash link
 */
export const isUnsplashUrl = (url) => {
  return typeof url === 'string' && url.toLowerCase().includes('unsplash.com');
};

/**
 * Sanitize and deduplicate Promo Slides to prevent overlapping DOM elements and remove Unsplash links
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
    if (!url || typeof url !== 'string' || url.trim() === '' || isUnsplashUrl(url)) continue;

    const normalizedUrl = url.trim().toLowerCase();
    if (!seenUrls.has(normalizedUrl)) {
      seenUrls.add(normalizedUrl);
      cleanPromos.push(typeof item === 'string' ? { id: `promo_${cleanPromos.length}`, url } : item);
    }
  }

  return cleanPromos.length > 0 ? cleanPromos : DEFAULT_SLIDES;
};

/**
 * Sanitize and deduplicate Skincare Products, cleaning Unsplash links
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

    let image = prod.image;
    if (isUnsplashUrl(image)) {
      const defaultIndex = (cleanProducts.length % 5) + 1;
      image = `${import.meta.env.BASE_URL}assets/product_skincare/skincare${defaultIndex}.jpeg`;
    }

    if (!seenNames.has(key)) {
      seenNames.add(key);
      cleanProducts.push({
        ...prod,
        image: image || `${import.meta.env.BASE_URL}assets/product_skincare/skincare1.jpeg`,
        name: sanitizeText(prod.name),
        description: sanitizeText(prod.description || '')
      });
    }
  }

  return cleanProducts.length > 0 ? cleanProducts : DEFAULT_SKINCARE;
};

export const LOCAL_PDFS = [
  "ACNE TREATMENT.pdf",
  "BODY CONTOUR.pdf",
  "BODY TREATMENT.pdf",
  "BODY TREATMENT2.pdf",
  "BOTOX TREATMENT.pdf",
  "CAUTER.pdf",
  "FACE CONTOUR TREATMENT.pdf",
  "FACIAL TREATMENT.pdf",
  "FILLER.pdf",
  "GLOWING TREATMENT.pdf",
  "HAIR REMOVEL TRATMENT.pdf",
  "INJECTION TREATMENT.pdf",
  "LASER TREATMENT.pdf",
  "LHALA PEEL TREATMENT.pdf",
  "LUXURY SKINBOOSTER.pdf",
  "MASSAGE BADAN.pdf",
  "MELASMA FLEK TREATMENT.pdf",
  "MESOLIPO.pdf",
  "PAKET BODY CONTOUR.pdf",
  "PEELING.pdf",
  "RADIO FREQUENCY.pdf",
  "SCAR TREATMENT.pdf",
  "SUBSISI.pdf",
  "THREADLIFT..pdf",
  "TUNGGAL TREATMENT.pdf",
  "WHITENING TREATMENT.pdf"
];

export const TREATMENT_ASSETS_MAP = {
  'acne treatment': { pdf: 'assets/perawatan/ACNE TREATMENT.pdf', image: 'assets/images_enif/ACNE TREATMENT.png' },
  'acne': { pdf: 'assets/perawatan/ACNE TREATMENT.pdf', image: 'assets/images_enif/ACNE TREATMENT.png' },

  'body contour': { pdf: 'assets/perawatan/BODY CONTOUR.pdf', image: 'assets/images_enif/PAKET BODY CONTOUR.png' },
  'paket body contour': { pdf: 'assets/perawatan/PAKET BODY CONTOUR.pdf', image: 'assets/images_enif/PAKET BODY CONTOUR.png' },
  'paket body': { pdf: 'assets/perawatan/PAKET BODY CONTOUR.pdf', image: 'assets/images_enif/PAKET BODY CONTOUR.png' },

  'body treatment': { pdf: 'assets/perawatan/BODY TREATMENT2.pdf', image: 'assets/perawatan/image/BODY TREATMENT2.png' },
  'body treatment 2': { pdf: 'assets/perawatan/BODY TREATMENT2.pdf', image: 'assets/perawatan/image/BODY TREATMENT2.png' },
  'body treatment2': { pdf: 'assets/perawatan/BODY TREATMENT2.pdf', image: 'assets/perawatan/image/BODY TREATMENT2.png' },

  'botox treatment': { pdf: 'assets/perawatan/BOTOX TREATMENT.pdf', image: 'assets/images_enif/BOTOX TREATMENT.png' },
  'botox': { pdf: 'assets/perawatan/BOTOX TREATMENT.pdf', image: 'assets/images_enif/BOTOX TREATMENT.png' },

  'cauter': { pdf: 'assets/perawatan/CAUTER.pdf', image: 'assets/images_enif/CAUTER.png' },

  'face contour treatment': { pdf: 'assets/perawatan/FACE CONTOUR TREATMENT.pdf', image: 'assets/perawatan/image/FACE CONTOUR TREATMENT.png' },
  'face contour': { pdf: 'assets/perawatan/FACE CONTOUR TREATMENT.pdf', image: 'assets/perawatan/image/FACE CONTOUR TREATMENT.png' },

  'facial treatment': { pdf: 'assets/perawatan/FACIAL TREATMENT.pdf', image: 'assets/images_enif/FACIAL TREATMENT.png' },
  'facial': { pdf: 'assets/perawatan/FACIAL TREATMENT.pdf', image: 'assets/images_enif/FACIAL TREATMENT.png' },

  'filler': { pdf: 'assets/perawatan/FILLER.pdf', image: 'assets/images_enif/FILLER.png' },

  'glowing treatment': { pdf: 'assets/perawatan/GLOWING TREATMENT.pdf', image: 'assets/images_enif/GLOWING TREATMENT.png' },
  'glowing': { pdf: 'assets/perawatan/GLOWING TREATMENT.pdf', image: 'assets/images_enif/GLOWING TREATMENT.png' },

  'hair removal treatment': { pdf: 'assets/perawatan/HAIR REMOVEL TRATMENT.pdf', image: 'assets/images_enif/HAIR REMOVEL TRATMENT.png' },
  'hair removel tratment': { pdf: 'assets/perawatan/HAIR REMOVEL TRATMENT.pdf', image: 'assets/images_enif/HAIR REMOVEL TRATMENT.png' },
  'hair removal': { pdf: 'assets/perawatan/HAIR REMOVEL TRATMENT.pdf', image: 'assets/images_enif/HAIR REMOVEL TRATMENT.png' },
  'hair removel': { pdf: 'assets/perawatan/HAIR REMOVEL TRATMENT.pdf', image: 'assets/images_enif/HAIR REMOVEL TRATMENT.png' },

  'injection treatment': { pdf: 'assets/perawatan/INJECTION TREATMENT.pdf', image: 'assets/images_enif/INJECTION TREATMENT.png' },
  'injection': { pdf: 'assets/perawatan/INJECTION TREATMENT.pdf', image: 'assets/images_enif/INJECTION TREATMENT.png' },

  'laser treatment': { pdf: 'assets/perawatan/LASER TREATMENT.pdf', image: 'assets/images_enif/LASER TREATMENT.png' },
  'laser': { pdf: 'assets/perawatan/LASER TREATMENT.pdf', image: 'assets/images_enif/LASER TREATMENT.png' },

  'lhala peel treatment': { pdf: 'assets/perawatan/LHALA PEEL TREATMENT.pdf', image: 'assets/images_enif/LHALA PEEL TREATMENT.png' },
  'lhala peel': { pdf: 'assets/perawatan/LHALA PEEL TREATMENT.pdf', image: 'assets/images_enif/LHALA PEEL TREATMENT.png' },

  'luxury skinbooster': { pdf: 'assets/perawatan/LUXURY SKINBOOSTER.pdf', image: 'assets/images_enif/LUXURY SKINBOOSTER.png' },
  'skinbooster': { pdf: 'assets/perawatan/LUXURY SKINBOOSTER.pdf', image: 'assets/images_enif/LUXURY SKINBOOSTER.png' },

  'massage badan': { pdf: 'assets/perawatan/MASSAGE BADAN.pdf', image: 'assets/images_enif/MASSAGE BADAN.png' },
  'massage': { pdf: 'assets/perawatan/MASSAGE BADAN.pdf', image: 'assets/images_enif/MASSAGE BADAN.png' },

  'melasma flex treatment': { pdf: 'assets/perawatan/MELASMA FLEK TREATMENT.pdf', image: 'assets/images_enif/MELASMA FLEK TREATMENT.png' },
  'melasma flek treatment': { pdf: 'assets/perawatan/MELASMA FLEK TREATMENT.pdf', image: 'assets/images_enif/MELASMA FLEK TREATMENT.png' },
  'melasma / flex treatment': { pdf: 'assets/perawatan/MELASMA FLEK TREATMENT.pdf', image: 'assets/images_enif/MELASMA FLEK TREATMENT.png' },
  'melasma': { pdf: 'assets/perawatan/MELASMA FLEK TREATMENT.pdf', image: 'assets/images_enif/MELASMA FLEK TREATMENT.png' },
  'flek': { pdf: 'assets/perawatan/MELASMA FLEK TREATMENT.pdf', image: 'assets/images_enif/MELASMA FLEK TREATMENT.png' },

  'mesolipo': { pdf: 'assets/perawatan/MESOLIPO.pdf', image: 'assets/images_enif/MESOLIPO.png' },

  'peeling': { pdf: 'assets/perawatan/PEELING.pdf', image: 'assets/images_enif/PEELING.png' },

  'radio frequency': { pdf: 'assets/perawatan/RADIO FREQUENCY.pdf', image: 'assets/images_enif/RADIO FREQUENCY.png' },

  'scar treatment': { pdf: 'assets/perawatan/SCAR TREATMENT.pdf', image: 'assets/images_enif/SCAR TREATMENT.png' },
  'scar': { pdf: 'assets/perawatan/SCAR TREATMENT.pdf', image: 'assets/images_enif/SCAR TREATMENT.png' },

  'subsisi': { pdf: 'assets/perawatan/SUBSISI.pdf', image: 'assets/images_enif/SUBSISI.png' },

  'threadlift': { pdf: 'assets/perawatan/THREADLIFT..pdf', image: 'assets/images_enif/THREADLIFT..png' },
  'threadlift.': { pdf: 'assets/perawatan/THREADLIFT..pdf', image: 'assets/images_enif/THREADLIFT..png' },
  'thread lift': { pdf: 'assets/perawatan/THREADLIFT..pdf', image: 'assets/images_enif/THREADLIFT..png' },

  'tunggal treatment': { pdf: 'https://drive.google.com/file/d/13kGK_V4wwKAHoxhIANqw4vNGq5It8jDp/view?usp=drive_link', image: 'assets/images_enif/TUNGGAL TREATMENT.png' },
  'tunggal': { pdf: 'https://drive.google.com/file/d/13kGK_V4wwKAHoxhIANqw4vNGq5It8jDp/view?usp=drive_link', image: 'assets/images_enif/TUNGGAL TREATMENT.png' },

  'whitening treatment': { pdf: 'https://drive.google.com/file/d/1nGGO8ubzIyQ8VSPUU8svw91y_b5MCG3q/view?usp=drive_link', image: 'assets/images_enif/WHITENING TREATMENT.png' },
  'whitening': { pdf: 'https://drive.google.com/file/d/1nGGO8ubzIyQ8VSPUU8svw91y_b5MCG3q/view?usp=drive_link', image: 'assets/images_enif/WHITENING TREATMENT.png' },
  'paket whitening treatment': { pdf: 'https://drive.google.com/file/d/1nGGO8ubzIyQ8VSPUU8svw91y_b5MCG3q/view?usp=drive_link', image: 'assets/images_enif/WHITENING TREATMENT.png' },
  'paket whitening': { pdf: 'https://drive.google.com/file/d/1nGGO8ubzIyQ8VSPUU8svw91y_b5MCG3q/view?usp=drive_link', image: 'assets/images_enif/WHITENING TREATMENT.png' },

  'new product treatment': { pdf: 'https://drive.google.com/file/d/1EJubqoHIjdnZVENhTBm52ebMSxWYF-Ge/view?usp=drive_link', image: 'assets/images_enif/NEW PRODUCT TREATMENT.png' },
  'new product': { pdf: 'https://drive.google.com/file/d/1EJubqoHIjdnZVENhTBm52ebMSxWYF-Ge/view?usp=drive_link', image: 'assets/images_enif/NEW PRODUCT TREATMENT.png' }
};

/**
 * Sanitize and deduplicate Treatments list, cleaning Unsplash links and populating fallbacks
 */
export const sanitizeTreatments = (treatments) => {
  if (!Array.isArray(treatments)) return [];

  const seenKeys = new Set();
  const cleanTreatments = [];

  for (const t of treatments) {
    if (!t || !t.name || typeof t.name !== 'string') continue;
    
    // Unique key combination of name + discount
    const key = `${t.name.trim().toLowerCase()}_${t.discount || 0}`;
    const cleanName = t.name.trim().toLowerCase();
    const mapped = TREATMENT_ASSETS_MAP[cleanName];

    let image = t.image;
    if (!image || isUnsplashUrl(image)) {
      image = mapped ? (mapped.image.startsWith('http') ? mapped.image : (mapped.image ? `${import.meta.env.BASE_URL}${mapped.image}` : '')) : '';
    }
    if (cleanName.includes('new product') && mapped?.image) {
      image = mapped.image.startsWith('http') ? mapped.image : `${import.meta.env.BASE_URL}${mapped.image}`;
    }

    let pdfLink = t.pdfLink;
    if (!pdfLink || pdfLink === '#' || pdfLink.startsWith('blob:') || isUnsplashUrl(pdfLink) || cleanName.includes('tunggal') || cleanName.includes('whitening') || cleanName.includes('new product')) {
      pdfLink = mapped ? (mapped.pdf.startsWith('http') ? mapped.pdf : `${import.meta.env.BASE_URL}${mapped.pdf}`) : (t.filename ? `${import.meta.env.BASE_URL}assets/treatments/${t.filename}` : '');
    }

    if (!seenKeys.has(key)) {
      seenKeys.add(key);
      cleanTreatments.push({
        ...t,
        image: image,
        pdfLink: pdfLink,
        name: sanitizeText(t.name),
        description: sanitizeText(t.description || ''),
        price: sanitizeText(t.price || ''),
        discount: Number(t.discount) || 0
      });
    }
  }

  return cleanTreatments;
};

/**
 * Sanitize Before & After items to replace Unsplash URLs with local assets
 */
export const sanitizeBeforeAfter = (items) => {
  if (!Array.isArray(items)) return [];

  return items.map((item, idx) => {
    if (!item) return item;
    let imgUrl = item.img;
    if (!imgUrl || typeof imgUrl !== 'string' || isUnsplashUrl(imgUrl)) {
      const imgIndex = (idx % 13) + 1;
      imgUrl = `${import.meta.env.BASE_URL}assets/before_after/before${imgIndex}.jpeg`;
    }
    return {
      ...item,
      img: imgUrl
    };
  });
};
