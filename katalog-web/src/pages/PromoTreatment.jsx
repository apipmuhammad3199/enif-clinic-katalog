import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../index.css';

function PromoTreatment() {
  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
  }, []);

  return (
    <div className="app-container" style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Minimal Header */}
      <header className="header">
        <div className="logo-container">
          <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: '10px' }}>
            <img src={`${import.meta.env.BASE_URL}assets/logo.jpg`} alt="Enef Clinic Logo" className="logo" />
            <div className="clinic-name">Enef Clinic</div>
          </Link>
        </div>
        <div className="social-links">
          <Link to="/" className="contact-us-btn">
            Kembali ke Beranda
          </Link>
        </div>
      </header>

      <section className="catalog-container" data-aos="fade-up" style={{ marginTop: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="catalog-header" style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--primary-color)' }}>Pilih Promo Treatment</h2>
          <p style={{ color: 'var(--text-light)' }}>Silakan pilih kategori promo yang ingin Anda lihat.</p>
        </div>
        
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', width: '100%', maxWidth: '800px' }}>
          
          <Link to="/promo-45" style={{ textDecoration: 'none', flex: '1', minWidth: '280px' }} data-aos="fade-right">
            <div style={{
              background: 'linear-gradient(135deg, #fff 0%, #f9f9f9 100%)',
              border: '1px solid #eaeaea',
              borderRadius: '16px',
              padding: '3rem 2rem',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(0,0,0,0.1)' }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: '3rem', color: 'var(--primary-color)', marginBottom: '1rem', fontWeight: 'bold' }}>45%</div>
              <h3 style={{ color: 'var(--text-dark)', marginBottom: '1rem', fontSize: '1.5rem' }}>Promo Spesial 45%</h3>
              <p style={{ color: 'var(--text-light)' }}>Perawatan premium dengan harga terbaik untuk Anda.</p>
              <div style={{ marginTop: '2rem', display: 'inline-block', padding: '10px 24px', backgroundColor: 'var(--primary-color)', color: '#fff', borderRadius: '30px', fontWeight: '600' }}>
                Lihat Promo &rarr;
              </div>
            </div>
          </Link>

          <Link to="/promo-50" style={{ textDecoration: 'none', flex: '1', minWidth: '280px' }} data-aos="fade-left">
            <div style={{
              background: 'linear-gradient(135deg, var(--primary-color) 0%, #d4b572 100%)',
              borderRadius: '16px',
              padding: '3rem 2rem',
              textAlign: 'center',
              boxShadow: '0 10px 30px rgba(212,181,114,0.3)',
              transition: 'transform 0.3s, box-shadow 0.3s',
              cursor: 'pointer'
            }}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 15px 40px rgba(212,181,114,0.5)' }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px rgba(212,181,114,0.3)' }}>
              <div style={{ fontSize: '3rem', color: '#fff', marginBottom: '1rem', fontWeight: 'bold' }}>50%</div>
              <h3 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.5rem' }}>Promo Spesial 50%</h3>
              <p style={{ color: 'rgba(255,255,255,0.9)' }}>Penawaran spesial terbatas, jangan sampai terlewatkan!</p>
              <div style={{ marginTop: '2rem', display: 'inline-block', padding: '10px 24px', backgroundColor: '#fff', color: 'var(--primary-color)', borderRadius: '30px', fontWeight: '600' }}>
                Lihat Promo &rarr;
              </div>
            </div>
          </Link>

        </div>
      </section>
      
      <FloatingWhatsApp />
    </div>
  );
}

export default PromoTreatment;
