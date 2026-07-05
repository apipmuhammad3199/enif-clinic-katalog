import React from 'react';
import { Link } from 'react-router-dom';

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

const TreatmentCard = ({ treatment, isProduct = false }) => {
  const pdfUrl = treatment.pdfLink || `${import.meta.env.BASE_URL}assets/treatments/${treatment.filename}`;
  const activeDiscount = treatment.effectiveDiscount !== undefined ? treatment.effectiveDiscount : treatment.discount;

  return (
    <div className="treatment-card group" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
      {getDiscountBadge(activeDiscount)}
      
      <div className="card-image-container">
        {/* Placeholder image that scales slightly on hover for an elegant effect */}
        <div className="card-image-placeholder">
          <svg className="placeholder-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </div>
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
        {!isProduct && (
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
