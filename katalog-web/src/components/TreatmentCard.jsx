import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CMSContext } from '../context/CMSContext';
import localPdfs from '../data/localPdfs.json';

const normalizeName = (value = '') => (value || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, ' ');

const isSameTreatmentName = (left, right) => {
  const leftName = normalizeName(left);
  const rightName = normalizeName(right);
  return leftName === rightName || leftName === `${rightName} 2` || `${leftName} 2` === rightName;
};

const getDiscountBadge = (discount) => {
  if (discount === 50) return <div className="badge badge-50">50% OFF</div>;
  if (discount === 45) return <div className="badge badge-45">45% OFF</div>;
  return null;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const options = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const calculateDiscountedPrice = (priceStr, discountPercent) => {
  if (!priceStr || !discountPercent) return priceStr;
  
  const numericString = priceStr.replace(/[^0-9]/g, '');
  if (!numericString) return priceStr;
  
  const originalPrice = parseInt(numericString, 10);
  const discountedPrice = originalPrice - (originalPrice * (discountPercent / 100));
  
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(discountedPrice);
};

// blob: URLs are only valid within the browser session that created them (e.g. an old
// admin-upload bug that saved URL.createObjectURL() output straight to Firestore) —
// treat them as no link at all so the fallback chain below kicks in instead.
const isUsablePdfLink = (link) => Boolean(link) && link !== '#' && !link.startsWith('blob:');

const TREATMENT_ASSETS_MAP = {
  'acne treatment': {
    pdf: 'assets/perawatan/ACNE TREATMENT.pdf',
    image: 'assets/images_enif/ACNE TREATMENT.png'
  },
  'body contour': {
    pdf: 'assets/perawatan/BODY CONTOUR.pdf',
    image: 'assets/images_enif/PAKET BODY CONTOUR.png'
  },
  'paket body contour': {
    pdf: 'assets/perawatan/PAKET BODY CONTOUR.pdf',
    image: 'assets/images_enif/PAKET BODY CONTOUR.png'
  },
  'body treatment': {
    pdf: 'assets/perawatan/BODY TREATMENT2.pdf',
    image: 'assets/perawatan/image/BODY TREATMENT2.png'
  },
  'botox treatment': {
    pdf: 'assets/perawatan/BOTOX TREATMENT.pdf',
    image: 'assets/images_enif/BOTOX TREATMENT.png'
  },
  'cauter': {
    pdf: 'assets/perawatan/CAUTER.pdf',
    image: 'assets/images_enif/CAUTER.png'
  },
  'face contour treatment': {
    pdf: 'assets/perawatan/FACE CONTOUR TREATMENT.pdf',
    image: 'assets/perawatan/image/FACE CONTOUR TREATMENT.png'
  },
  'facial treatment': {
    pdf: 'assets/perawatan/FACIAL TREATMENT.pdf',
    image: 'assets/images_enif/FACIAL TREATMENT.png'
  },
  'filler': {
    pdf: 'assets/perawatan/FILLER.pdf',
    image: 'assets/images_enif/FILLER.png'
  },
  'glowing treatment': {
    pdf: 'assets/perawatan/GLOWING TREATMENT.pdf',
    image: 'assets/images_enif/GLOWING TREATMENT.png'
  },
  'hair removal treatment': {
    pdf: 'assets/perawatan/HAIR REMOVEL TRATMENT.pdf',
    image: 'assets/images_enif/HAIR REMOVEL TRATMENT.png'
  },
  'hair removel tratment': {
    pdf: 'assets/perawatan/HAIR REMOVEL TRATMENT.pdf',
    image: 'assets/images_enif/HAIR REMOVEL TRATMENT.png'
  },
  'injection treatment': {
    pdf: 'assets/perawatan/INJECTION TREATMENT.pdf',
    image: 'assets/images_enif/INJECTION TREATMENT.png'
  },
  'laser treatment': {
    pdf: 'assets/perawatan/LASER TREATMENT.pdf',
    image: 'assets/images_enif/LASER TREATMENT.png'
  },
  'lhala peel treatment': {
    pdf: 'assets/perawatan/LHALA PEEL TREATMENT.pdf',
    image: 'assets/images_enif/LHALA PEEL TREATMENT.png'
  },
  'luxury skinbooster': {
    pdf: 'assets/perawatan/LUXURY SKINBOOSTER.pdf',
    image: 'assets/images_enif/LUXURY SKINBOOSTER.png'
  },
  'massage badan': {
    pdf: 'assets/perawatan/MASSAGE BADAN.pdf',
    image: 'assets/images_enif/MASSAGE BADAN.png'
  },
  'melasma flex treatment': {
    pdf: 'assets/perawatan/MELASMA FLEK TREATMENT.pdf',
    image: 'assets/images_enif/MELASMA FLEK TREATMENT.png'
  },
  'melasma flek treatment': {
    pdf: 'assets/perawatan/MELASMA FLEK TREATMENT.pdf',
    image: 'assets/images_enif/MELASMA FLEK TREATMENT.png'
  },
  'melasma / flex treatment': {
    pdf: 'assets/perawatan/MELASMA FLEK TREATMENT.pdf',
    image: 'assets/images_enif/MELASMA FLEK TREATMENT.png'
  },
  'mesolipo': {
    pdf: 'assets/perawatan/MESOLIPO.pdf',
    image: 'assets/images_enif/MESOLIPO.png'
  },
  'peeling': {
    pdf: 'assets/perawatan/PEELING.pdf',
    image: 'assets/images_enif/PEELING.png'
  },
  'radio frequency': {
    pdf: 'assets/perawatan/RADIO FREQUENCY.pdf',
    image: 'assets/images_enif/RADIO FREQUENCY.png'
  },
  'scar treatment': {
    pdf: 'assets/perawatan/SCAR TREATMENT.pdf',
    image: 'assets/images_enif/SCAR TREATMENT.png'
  },
  'subsisi': {
    pdf: 'assets/perawatan/SUBSISI.pdf',
    image: 'assets/images_enif/SUBSISI.png'
  },
  'threadlift': {
    pdf: 'assets/perawatan/THREADLIFT..pdf',
    image: 'assets/images_enif/THREADLIFT..png'
  },
  'tunggal treatment': {
    pdf: 'assets/perawatan/TUNGGAL TREATMENT.pdf',
    image: 'assets/images_enif/TUNGGAL TREATMENT.png'
  },
  'whitening treatment': {
    pdf: 'assets/perawatan/WHITENING TREATMENT.pdf',
    image: 'assets/images_enif/WHITENING TREATMENT.png'
  }
};

const TreatmentCard = ({ treatment, isProduct = false }) => {
  const { perawatanPDFs } = useContext(CMSContext);

  const cleanKey = (treatment.name || '').toLowerCase().trim();
  const mapped = TREATMENT_ASSETS_MAP[cleanKey];

  // Try to find a matching PDF from the CMS if it doesn't already have one
  const matchedPdf = perawatanPDFs?.find(p => p.name?.trim().toLowerCase() === treatment.name?.trim().toLowerCase());
  
  // Try to find a matching PDF from the local assets/perawatan folder
  const localMatch = localPdfs.find(filename => {
    const cleanFile = filename.replace(/\.+pdf$/i, '').trim();
    const cleanName = treatment.name?.trim() || '';
    return isSameTreatmentName(cleanFile, cleanName);
  });

  const finalPdfLink = (isUsablePdfLink(treatment.pdfLink) ? treatment.pdfLink : null)
    || (isUsablePdfLink(matchedPdf?.pdfLink) ? matchedPdf.pdfLink : null);
  
  const activeDiscount = treatment.effectiveDiscount !== undefined ? treatment.effectiveDiscount : treatment.discount;

  const promoPdfUrl = (activeDiscount > 0 && treatment.filename)
    ? `${import.meta.env.BASE_URL}assets/treatments/${treatment.filename}`
    : null;

  const pdfUrl = promoPdfUrl
    || (mapped ? `${import.meta.env.BASE_URL}${mapped.pdf}` : null)
    || finalPdfLink 
    || (localMatch ? `${import.meta.env.BASE_URL}assets/perawatan/${localMatch}` : null)
    || (treatment.filename ? `${import.meta.env.BASE_URL}assets/treatments/${treatment.filename}` : null);

  const fallbackImage = mapped 
    ? `${import.meta.env.BASE_URL}${mapped.image}`
    : (localMatch ? `${import.meta.env.BASE_URL}assets/perawatan/image/${localMatch.replace(/\.+pdf$/i, '.png')}` : null);
  
  const displayImage = treatment.image 
    ? (treatment.image.startsWith('data:') || treatment.image.startsWith('http') ? treatment.image : `${import.meta.env.BASE_URL}${treatment.image.startsWith('/') ? treatment.image.substring(1) : treatment.image}`) 
    : fallbackImage;

  console.log(`[TreatmentCard] ${treatment.name} | matchedPdf: ${matchedPdf ? 'FOUND' : 'NOT_FOUND'} | pdfUrl: ${pdfUrl}`);

  return (
    <div className="treatment-card group" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
      {treatment.isNew ? (
        <div className="badge" style={{ backgroundColor: 'var(--primary-color)', padding: '0.4rem 1rem', borderRadius: '0 0 0 8px', fontWeight: 'bold' }}>NEW TREATMENT</div>
      ) : (
        getDiscountBadge(activeDiscount)
      )}
      
      <div className="card-image-container">
        {displayImage ? (
          <img src={displayImage} alt={treatment.name} className="card-image" />
        ) : (
          <div className="card-image-placeholder">
            <svg className="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </div>
        )}
        <div className="card-overlay"></div>
        {!isProduct && pdfUrl && (
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="card-view-details">
            <span>View Details</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </a>
        )}
      </div>

      <div className="card-content">
        <h3 className="treatment-name">{treatment.name}</h3>
        {treatment.price && (
          <div className="price-container">
            {activeDiscount > 0 ? (
              <div className="discount-wrapper">
                <span className="original-price">{treatment.price}</span>
                <span className="discounted-price">
                  {calculateDiscountedPrice(treatment.price, activeDiscount)}
                </span>
              </div>
            ) : (
              <span className="regular-price">{treatment.price}</span>
            )}
          </div>
        )}
        {treatment.endDate && (
          <div className="promo-date">
            *Promo s/d {formatDate(treatment.endDate)}
          </div>
        )}
      </div>
      
      <div className="treatment-actions-group">
        <Link to={`/booking?${isProduct ? 'product' : 'treatment'}=${encodeURIComponent(treatment.name)}`} className="book-now-btn">
          {isProduct ? 'Beli Sekarang' : 'Book Now'}
        </Link>
      </div>
    </div>
  );
};

export default TreatmentCard;
