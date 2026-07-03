import React, { useState, useEffect } from 'react';
import TreatmentCard from './components/TreatmentCard';
import PromoSlider from './components/PromoSlider';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import treatmentsData from './data.json';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './index.css';

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('45');

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      easing: 'ease-out-cubic',
    });
  }, []);

  const filteredTreatments = treatmentsData.filter(treatment => {
    const matchesSearch = treatment.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTab = activeTab === 'All' || treatment.discount === parseInt(activeTab, 10);
    return matchesSearch && matchesTab;
  });

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <img src={`${import.meta.env.BASE_URL}assets/logo.jpg`} alt="Enif Clinic Logo" className="logo" />
          <div className="clinic-name">Enif Clinic</div>
        </div>
        <div className="social-links">
          <a href="https://www.instagram.com/enefclinic/" target="_blank" rel="noopener noreferrer" className="social-icon instagram" title="Instagram">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20" fill="currentColor"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
          </a>
          <a href="https://www.tiktok.com/@enefclinic" target="_blank" rel="noopener noreferrer" className="social-icon tiktok" title="TikTok">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20" fill="currentColor"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/></svg>
          </a>
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
          <button 
            className={`tab-button ${activeTab === '45' ? 'active' : ''}`}
            onClick={() => setActiveTab('45')}
          >
            Promo 45% OFF
          </button>
          <button 
            className={`tab-button ${activeTab === '50' ? 'active' : ''}`}
            onClick={() => setActiveTab('50')}
          >
            Promo 50% OFF
          </button>
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

      {/* Video Section */}
      <section className="video-section" data-aos="fade-up">
        <h2>Video Gallery</h2>
        <div className="video-grid">
          <div className="video-card" data-aos="fade-up" data-aos-delay="100">
            {/* Replace src with your uploaded video path e.g. src="/assets/video1.mp4" */}
            <video controls src=""></video>
            <div className="video-info">
              <h3>Enif Clinic Experience</h3>
            </div>
          </div>
          <div className="video-card" data-aos="fade-up" data-aos-delay="200">
            <video controls src=""></video>
            <div className="video-info">
              <h3>Treatment Review</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="maps-section" data-aos="fade-up">
        <h2>Enif Clinic Ambara Bawen</h2>
        <div className="maps-container">
          <iframe 
            src="https://maps.google.com/maps?q=-7.2488434,110.4267805&t=&z=17&ie=UTF8&iwloc=&output=embed" 
            allowFullScreen="" 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Enif Clinic Ambara Bawen Location"
          ></iframe>
        </div>
      </section>

      <FloatingWhatsApp />

      {/* Footer */}
      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Enif Clinic. All rights reserved.</p>
        <p style={{ marginTop: '0.5rem' }}>Elegance in every detail.</p>
      </footer>
    </div>
  );
}

export default App;
