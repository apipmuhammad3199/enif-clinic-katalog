import React, { useState, useEffect, useContext } from 'react';
import { CMSContext } from '../context/CMSContext';

const PromoSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { promos: slides } = useContext(CMSContext);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="promo-slider">
      {slides.map((slide, index) => (
        <div className={`slide ${index === currentIndex ? 'active' : ''}`} key={index}>
          <img src={slide.url || slide} alt={`Enef Clinic Promo ${index + 1}`} />
        </div>
      ))}
    </div>
  );
};

export default PromoSlider;
