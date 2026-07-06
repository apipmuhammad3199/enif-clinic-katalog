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

function Perawatan() {
  const { treatments, perawatanPDFs } = useContext(CMSContext);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTreatments = treatments.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            Jelajahi dokumen perawatan eksklusif serta katalog perawatan Enef Clinic.
          </p>
        </div>

        {/* Perawatan PDFs Section */}
        {perawatanPDFs && perawatanPDFs.length > 0 && (
          <div style={{ marginBottom: '4rem' }}>
            <h3 style={{ color: '#444', marginBottom: '1.5rem', textAlign: 'center' }}>Dokumen Perawatan</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
              {perawatanPDFs.map((pdf, index) => (
                <div key={index} style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', textAlign: 'center', transition: 'transform 0.3s ease' }} onMouseOver={e => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}>
                  {pdf.image ? (
                    <div style={{ width: '100%', height: '150px', marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
                      <img src={pdf.image.startsWith('data:') || pdf.image.startsWith('http') ? pdf.image : `${import.meta.env.BASE_URL}${pdf.image.startsWith('/') ? pdf.image.substring(1) : pdf.image}`} alt={pdf.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ) : (
                    <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📄</div>
                  )}
                  <h4 style={{ color: '#333', marginBottom: '1rem', fontSize: '1.1rem' }}>{pdf.name}</h4>
                  <a href={pdf.pdfLink} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: 'var(--primary-color)', color: 'white', padding: '0.6rem 1.2rem', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}>Lihat PDF</a>
                </div>
              ))}
            </div>
          </div>
        )}

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
            {filteredTreatments.map((treatment, index) => {
              const matchedPdf = perawatanPDFs?.find(p => p.name.toLowerCase() === treatment.name.toLowerCase());
              const treatmentWithPdf = { 
                ...treatment, 
                effectiveDiscount: 0, 
                endDate: null, 
                discount: 0,
                pdfLink: matchedPdf ? matchedPdf.pdfLink : treatment.pdfLink
              };
              return <TreatmentCard key={index} treatment={treatmentWithPdf} />;
            })}
          </div>
        )}
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default Perawatan;

