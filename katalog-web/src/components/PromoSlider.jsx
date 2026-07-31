import React, { useState, useEffect, useContext } from 'react';
import { CMSContext } from '../context/CMSContext';
import { sanitizePromos } from '../utils/safeguards';

const PromoSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { promos: rawSlides } = useContext(CMSContext);
  const slides = sanitizePromos(rawSlides);

  useEffect(() => {
    if (!slides || slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex >= slides.length - 1 ? 0 : prevIndex + 1));
    }, 3500);

    return () => clearInterval(timer);
  }, [slides ? slides.length : 0]);

  if (!slides || slides.length === 0) return null;

  return (
    <div className="promo-slider">
      {slides.map((slide, index) => {
        const isActive = index === currentIndex;
        const rawUrl = slide.url || slide;
        const imgUrl = (rawUrl.startsWith('data:') || rawUrl.startsWith('http'))
          ? rawUrl
          : `${import.meta.env.BASE_URL}${rawUrl.startsWith('/') ? rawUrl.substring(1) : rawUrl}`;

        return (
          <div 
            className={`slide ${isActive ? 'active' : ''}`} 
            key={index}
            style={{
              display: isActive ? 'flex' : 'none',
              visibility: isActive ? 'visible' : 'hidden'
            }}
          >
            <img src={imgUrl} alt={`Enef Clinic Promo ${index + 1}`} />
          </div>
        );
      })}
    </div>
  );
};

export default PromoSlider;
