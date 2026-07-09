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

const TreatmentCard = ({ treatment, isProduct = false }) => {
  const { perawatanPDFs } = useContext(CMSContext);

  // Try to find a matching PDF from the CMS if it doesn't already have one
  const matchedPdf = perawatanPDFs?.find(p => p.name?.trim().toLowerCase() === treatment.name?.trim().toLowerCase());
  
  // Try to find a matching PDF from the local assets/perawatan folder
  const localMatch = localPdfs.find(filename => {
    const cleanFile = filename.replace(/\.+pdf$/i, '').trim();
    const cleanName = treatment.name?.trim() || '';
    return isSameTreatmentName(cleanFile, cleanName) || cleanFile.toLowerCase().includes(cleanName.toLowerCase()) || cleanName.toLowerCase().includes(cleanFile.toLowerCase());
  });

  const preferredPdfLink = (treatment.name || '').toLowerCase().includes('body treatment')
    ? `${import.meta.env.BASE_URL}assets/perawatan/BODY%20TREATMENT2.pdf`
    : null;

  const finalPdfLink = preferredPdfLink
    || (isUsablePdfLink(treatment.pdfLink) ? treatment.pdfLink : null)
    || (isUsablePdfLink(matchedPdf?.pdfLink) ? matchedPdf.pdfLink : null);
  
  const pdfUrl = finalPdfLink 
    || (localMatch ? `${import.meta.env.BASE_URL}assets/perawatan/${localMatch}` : null)
    || (treatment.filename ? `${import.meta.env.BASE_URL}assets/treatments/${treatment.filename}` : null);

  const fallbackImage = localMatch ? `${import.meta.env.BASE_URL}assets/perawatan/image/${localMatch.replace(/\.+pdf$/i, '.png')}` : null;
  
  const displayImage = treatment.image 
    ? (treatment.image.startsWith('data:') || treatment.image.startsWith('http') ? treatment.image : `${import.meta.env.BASE_URL}${treatment.image.startsWith('/') ? treatment.image.substring(1) : treatment.image}`) 
    : fallbackImage;

  const activeDiscount = treatment.effectiveDiscount !== undefined ? treatment.effectiveDiscount : treatment.discount;

  console.log(`[TreatmentCard] ${treatment.name} | matchedPdf: ${matchedPdf ? 'FOUND' : 'NOT_FOUND'} | pdfUrl: ${pdfUrl}`);

  return (
    <div className="treatment-card group" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
      {getDiscountBadge(activeDiscount)}
      
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
        {!isProduct && pdfUrl && (
          <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="treatment-action">
            <span>View Details</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"></path>
              <path d="M12 5l7 7-7 7"></path>
            </svg>
          </a>
        )}
        
        <Link to={`/booking?${isProduct ? 'product' : 'treatment'}=${encodeURIComponent(treatment.name)}`} className="book-now-btn">
          {isProduct ? 'Beli Sekarang' : 'Book Now'}
        </Link>
      </div>
    </div>
  );
};

export default TreatmentCard;
