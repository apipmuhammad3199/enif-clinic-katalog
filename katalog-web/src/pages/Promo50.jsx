import React, { useContext, useEffect } from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import TreatmentCard from '../components/TreatmentCard';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../index.css';
import { CMSContext } from '../context/CMSContext';

function Promo50() {
  const { treatments } = useContext(CMSContext);

  const isPromoActive = (startDate, endDate) => {
    if (!startDate || !endDate) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return today >= start && today <= end;
  };

  const promoTreatments = treatments.filter(t => t.discount === 50 && isPromoActive(t.startDate, t.endDate));

  return (
    <div className="app-container" style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Minimal Header */}
      <Header />

      <section className="catalog-container" data-aos="fade-up" style={{ marginTop: '20px' }}>
        <div className="catalog-header" style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>Promo Spesial 50%</h2>
          <p style={{ color: 'var(--text-light)' }}>Semua penawaran spesial Diskon 50% ada di sini. Jangan sampai terlewatkan!</p>
        </div>
        
        {promoTreatments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
            Saat ini tidak ada promo diskon 50%.
          </div>
        ) : (
          <div className="catalog-grid">
            {promoTreatments.map((treatment, index) => (
              <TreatmentCard key={index} treatment={{ ...treatment, effectiveDiscount: 50 }} />
            ))}
          </div>
        )}
      </section>
      
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default Promo50;

