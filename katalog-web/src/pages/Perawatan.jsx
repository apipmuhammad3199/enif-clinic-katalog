import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import TreatmentCard from '../components/TreatmentCard';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../index.css';
import { CMSContext } from '../context/CMSContext';

const CATEGORY_ORDER = [
  ["facial"],
  ["whitening"],
  ["melasma", "flek", "flex"],
  ["acne"],
  ["scar"],
  ["glow"],
  ["luxury", "skinbooster"],
  ["botox"],
  ["mesolipo"],
  ["paket body", "body contour"],
  ["filler"],
  ["threadlift"],
  ["hair remov"],
  ["laser"],
  ["radio frequency"],
  ["peeling"],
  ["cauter"],
  ["injection"],
  ["subsisi"]
];

function Perawatan() {
  const { treatments } = useContext(CMSContext);
  const [searchTerm, setSearchTerm] = useState('');

  const uniqueTreatments = Object.values(
    (treatments || [])
      .filter(t => t.pdfLink && t.pdfLink !== '#')
      .reduce((acc, t) => {
        const key = t.name?.trim().toLowerCase();
        if (key && !acc[key]) acc[key] = t;
        return acc;
      }, {})
  );

  const getSortIndex = (name) => {
    if (!name) return 999;
    const lowerName = name.toLowerCase();
    
    const index = CATEGORY_ORDER.findIndex(terms => 
      terms.some(term => lowerName.includes(term))
    );
    
    return index !== -1 ? index : 999;
  };

  const filteredTreatments = uniqueTreatments
    .filter(t => t.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => getSortIndex(a.name) - getSortIndex(b.name));

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
  }, []);

  return (
    <div className="app-container" style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Header />
      
      <section className="catalog-container" data-aos="fade-up" style={{ marginTop: '30px', paddingBottom: '4rem' }}>
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h2 className="section-title-grey" style={{ color: 'var(--primary-color)' }}>HALAMAN PERAWATAN</h2>
          <p style={{ color: 'var(--text-light)', marginTop: '1rem' }}>
            Jelajahi dokumen perawatan eksklusif Enef Clinic.
          </p>
        </div>

        <div className="search-container" style={{ marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 3rem auto' }}>
          <input 
            type="text" 
            placeholder="Cari perawatan..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredTreatments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
            {searchTerm ? 'Perawatan tidak ditemukan.' : 'Saat ini tidak ada perawatan.'}
          </div>
        ) : (
          <div className="catalog-grid">
            {filteredTreatments.map((treatment, index) => (
              <TreatmentCard key={treatment.id || index} treatment={{ ...treatment, effectiveDiscount: 0, endDate: null, discount: 0 }} />
            ))}
          </div>
        )}
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default Perawatan;
