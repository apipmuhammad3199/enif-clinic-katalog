import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../index.css';
import { articles } from '../data/articles';

function Articles() {
  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
  }, []);

  return (
    <div className="app-container" style={{ minHeight: '100vh', paddingBottom: '4rem', backgroundColor: '#fafafa' }}>
      {/* Minimal Header */}
      <header className="header" style={{ backgroundColor: '#fff', borderBottom: '1px solid #eaeaea' }}>
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

      <section className="catalog-container" data-aos="fade-up" style={{ marginTop: '100px' }}>
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <div className="section-subtitle-gold">TIPS DAN INSIGHT</div>
          <h2 className="section-title-grey">SELALU DAPATKAN UPDATE INSIGHT KECANTIKAN</h2>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
          {articles.map((article, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              flexDirection: window.innerWidth < 768 ? 'column' : 'row',
              gap: '2rem', 
              backgroundColor: '#fff',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.03)'
            }} data-aos="fade-up" data-aos-delay={idx * 50}>
              <div style={{ flex: '1', minWidth: '300px', height: '220px', borderRadius: '8px', overflow: 'hidden' }}>
                <img src={article.image.startsWith('/') ? `${import.meta.env.BASE_URL}${article.image.substring(1)}` : article.image} alt={article.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: '2', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ color: 'var(--primary-color)', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>{article.date}</div>
                <h3 style={{ fontSize: '1.5rem', color: 'var(--text-dark)', marginBottom: '1rem', lineHeight: '1.4' }}>{article.title}</h3>
                <p style={{ color: 'var(--text-light)', marginBottom: '1.5rem', lineHeight: '1.6' }}>{article.summary}</p>
                <Link to="#" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontWeight: 'bold' }}>Baca Selengkapnya &rarr;</Link>
              </div>
            </div>
          ))}
        </div>
      </section>
      
      <FloatingWhatsApp />
    </div>
  );
}

export default Articles;
