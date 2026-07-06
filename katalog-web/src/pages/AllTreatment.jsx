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

function AllTreatment() {
  const { treatments } = useContext(CMSContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
  }, []);

  return (
    <div className="app-container" style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Minimal Header */}
      <Header />

      <section className="catalog-container" data-aos="fade-up" style={{ marginTop: '20px' }}>
        <div className="catalog-header" style={{ marginBottom: '3rem' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>Semua Perawatan</h2>
          <p style={{ color: 'var(--text-light)' }}>Jelajahi seluruh rangkaian perawatan estetika terbaik dari Enef Clinic untuk memancarkan kecantikan alami Anda.</p>
        </div>
        
        {treatments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
            Belum ada perawatan yang tersedia.
          </div>
        ) : (
          <div className="catalog-grid">
            {treatments.map((treatment, index) => (
              <TreatmentCard key={index} treatment={treatment} />
            ))}
          </div>
        )}
      </section>
      
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default AllTreatment;

