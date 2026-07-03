import React from 'react';

const getDiscountBadge = (discount) => {
  if (discount === 50) {
    return <div className="badge badge-50">50% OFF</div>;
  }
  return <div className="badge badge-45">45% OFF</div>;
};

const TreatmentCard = ({ treatment }) => {
  const pdfUrl = `${import.meta.env.BASE_URL}assets/treatments/${treatment.filename}`;

  return (
    <a href={pdfUrl} target="_blank" rel="noopener noreferrer" className="treatment-card" data-aos="fade-up" data-aos-anchor-placement="top-bottom">
      {getDiscountBadge(treatment.discount)}
      
      <div>
        {/* We removed emojis here to maintain a minimalist, elegant aesthetic */}
        <h3 className="treatment-name">{treatment.name}</h3>
      </div>
      
      <div className="treatment-action">
        <span>View Details</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14"></path>
          <path d="M12 5l7 7-7 7"></path>
        </svg>
      </div>
    </a>
  );
};

export default TreatmentCard;
