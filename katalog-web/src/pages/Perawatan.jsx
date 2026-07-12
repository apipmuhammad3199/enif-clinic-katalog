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

const CATEGORY_CONFIG = [
  { displayName: "Facial", searchTerms: ["facial"] },
  { displayName: "Whitening Treatment", searchTerms: ["whitening"] },
  { displayName: "Melasma / Flex Treatment", searchTerms: ["melasma", "flek", "flex"] },
  { displayName: "Acne Treatment", searchTerms: ["acne"] },
  { displayName: "Scar Treatment", searchTerms: ["scar"] },
  { displayName: "Glow Treatment", searchTerms: ["glow"] },
  { displayName: "Luxury Skinbooster", searchTerms: ["luxury", "skinbooster"] },
  { displayName: "Botox Treatment", searchTerms: ["botox"] },
  { displayName: "Mesolipo", searchTerms: ["mesolipo"] },
  { displayName: "Paket Body Contour", searchTerms: ["paket body", "body contour"] },
  { displayName: "Filler", searchTerms: ["filler"] },
  { displayName: "Threadlift", searchTerms: ["threadlift"] },
  { displayName: "Hair Removal Treatment", searchTerms: ["hair remov"] },
  { displayName: "Laser Treatment", searchTerms: ["laser"] },
  { displayName: "Radio Frequency", searchTerms: ["radio frequency"] },
  { displayName: "Peeling", searchTerms: ["peeling"] },
  { displayName: "Injection Treatment", searchTerms: ["injection"] },
  { displayName: "Subsisi", searchTerms: ["subsisi"] }
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

  // Map the configuration to actual matched treatments
  const mappedTreatments = CATEGORY_CONFIG.map(config => {
    // Find the best match in uniqueTreatments
    const match = uniqueTreatments.find(t => 
      config.searchTerms.some(term => t.name?.toLowerCase().includes(term))
    );
    
    // If a match is found, override its name for display
    if (match) {
      return { ...match, name: config.displayName };
    }
    
    return null;
  }).filter(Boolean); // Remove any that weren't found

  // Filter based on search term
  const filteredTreatments = mappedTreatments
    .filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
