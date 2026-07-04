import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import TreatmentCard from '../components/TreatmentCard';
import PromoSlider from '../components/PromoSlider';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../index.css';
import { CMSContext } from '../context/CMSContext';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const { treatments, videos, promoSettings } = useContext(CMSContext);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

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

  const processedTreatments = treatments.map(treatment => {
    let effectiveDiscount = treatment.discount;
    if (treatment.discount > 0 && !isPromoActive(treatment.startDate, treatment.endDate)) {
      effectiveDiscount = 0;
    }
    return { ...treatment, effectiveDiscount };
  });

  const hasActive45 = processedTreatments.some(t => t.effectiveDiscount === 45);
  const hasActive50 = processedTreatments.some(t => t.effectiveDiscount === 50);

  const filteredTreatments = processedTreatments.filter(treatment => {
    const matchesSearch = treatment.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' || treatment.effectiveDiscount === parseInt(activeTab, 10);
    return matchesSearch && matchesTab;
  });

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <img src={`${import.meta.env.BASE_URL}assets/logo.jpg`} alt="Enef Clinic Logo" className="logo" />
          <div className="clinic-name">Enef Clinic</div>
        </div>
        <div className="social-links">
          <Link to="/socials" className="contact-us-btn">
            Hubungi Kami
          </Link>
        </div>
      </header>

      {/* Promo Slider */}
      <PromoSlider />

      {/* Hero Section */}
      <section className="hero" data-aos="fade-up">
        <h1>Signature Treatments</h1>
        <p>Discover our range of premium aesthetic treatments designed to enhance your natural beauty.</p>
        
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search treatments..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* Catalog Section */}
      <section className="catalog-container" data-aos="fade-up" data-aos-delay="100">
        
        {/* Discount Tabs */}
        <div className="tabs-container">
          {hasActive45 && (
            <button 
              className={`tab-button ${activeTab === '45' ? 'active' : ''}`}
              onClick={() => setActiveTab('45')}
            >
              Promo 45% OFF
            </button>
          )}
          {hasActive50 && (
            <button 
              className={`tab-button ${activeTab === '50' ? 'active' : ''}`}
              onClick={() => setActiveTab('50')}
            >
              Promo 50% OFF
            </button>
          )}
          <button 
            className={`tab-button ${activeTab === 'All' ? 'active' : ''}`}
            onClick={() => setActiveTab('All')}
          >
            All Treatments
          </button>
        </div>

        {filteredTreatments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
            No treatments found matching your criteria.
          </div>
        ) : (
          <div className="catalog-grid">
            {filteredTreatments.map((treatment, index) => (
              <TreatmentCard key={index} treatment={treatment} />
            ))}
          </div>
        )}
      </section>

      {/* Location Section */}
      <section className="maps-section" data-aos="fade-up">
        <h2>Enef Clinic Ambara Bawen</h2>
        <div className="maps-layout">
          <div className="maps-container">
            <iframe 
              src="https://maps.google.com/maps?q=-7.2488434,110.4267805&t=&z=17&ie=UTF8&iwloc=&output=embed" 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Enef Clinic Ambara Bawen Location"
            ></iframe>
          </div>
          <div className="maps-info">
            <div className="info-card">
              <h3>Alamat Kami</h3>
              <p>Jalan Raya Bawen No. 89, Ambara Bawen,<br/>Kabupaten Semarang, Jawa Tengah</p>
            </div>
            <div className="info-card">
              <h3>Kontak Layanan</h3>
              <p>
                <a href="https://wa.me/628214464406" target="_blank" rel="noopener noreferrer" className="contact-link">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="18" height="18" fill="currentColor" style={{ marginRight: '8px', verticalAlign: 'middle' }}><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 414.8c-33 0-65.4-8.9-94-25.7l-6.7-4-69.8 18.3L72 334.1l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
                  0821-4464-406
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="video-section" data-aos="fade-up">
        <h2>Video Gallery</h2>
        <div className="video-grid">
          {videos.slice(0, 4).map((vid, idx) => (
            <div key={idx} className="video-card" data-aos="fade-up" data-aos-delay={100 * (idx + 1)}>
              <video controls src={vid.src}></video>
              <div className="video-info">
                <h3>{vid.title}</h3>
              </div>
            </div>
          ))}
        </div>
        {videos.length > 4 && (
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/videos" style={{ display: 'inline-block', padding: '0.8rem 2rem', background: 'var(--primary-color)', color: 'white', textDecoration: 'none', borderRadius: '30px', fontWeight: '500', transition: 'all 0.2s', boxShadow: '0 4px 15px rgba(186, 155, 92, 0.3)' }}>
              Lihat Lebih Banyak Video &rarr;
            </Link>
          </div>
        )}
      </section>



      <FloatingWhatsApp />

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Enef Clinic. All rights reserved.</p>
        <p style={{ marginTop: '0.5rem' }}>Elegance in every detail.</p>
      </footer>
    </div>
  );
}

export default Home;
