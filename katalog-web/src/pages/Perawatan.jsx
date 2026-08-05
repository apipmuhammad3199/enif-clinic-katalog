import React, { useContext, useEffect, useState, useCallback } from 'react';
import Header from '../components/Header';
import TreatmentCard from '../components/TreatmentCard';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../index.css';
import { CMSContext } from '../context/CMSContext';
import treatmentData from '../data.json';

// Peta nama -> file katalog disc45, agar isi modal PAKET TREATMENT selalu
// membuka PDF paket 45% (data Firestore bisa menyimpan pdfLink/filename lain).
const normalizePaketName = (value = '') => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, ' ');
const DISC45_FILES = new Map(
  treatmentData
    .filter(t => t.filename?.startsWith('disc45/'))
    .map(t => [normalizePaketName(t.name), t.filename])
);

const paketThumbSrc = (t) => {
  if (!t.image) return null;
  if (t.image.startsWith('data:') || t.image.startsWith('http')) return t.image;
  return `${import.meta.env.BASE_URL}${t.image.startsWith('/') ? t.image.substring(1) : t.image}`;
};

const CATEGORY_ORDER = [
  (name) => name.includes("new product"),
  (name) => name.includes("lhala peel"),
  (name) => name.includes("facial"),
  (name) => name.includes("whitening"),
  (name) => name.includes("melasma") || name.includes("flek") || name.includes("flex"),
  (name) => name.includes("acne"),
  (name) => name.includes("scar"),
  (name) => name.includes("glow"),
  (name) => name.includes("face contour"),
  (name) => name.includes("body treatment"),
  (name) => name.includes("body contour") && !name.includes("paket"),
  (name) => name.includes("luxury") || name.includes("skinbooster"),
  (name) => name.includes("botox"),
  (name) => name.includes("mesolipo"),
  (name) => name.includes("paket body"),
  (name) => name.includes("filler"),
  (name) => name.includes("threadlift"),
  (name) => name.includes("hair remov"),
  (name) => name.includes("laser"),
  (name) => name.includes("radio frequency"),
  (name) => name.includes("peeling"),
  (name) => name.includes("cauter"),
  (name) => name.includes("injection"),
  (name) => name.includes("subsisi")
];

function Perawatan() {
  const { treatments } = useContext(CMSContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPaketModal, setShowPaketModal] = useState(false);
  const [paketClosing, setPaketClosing] = useState(false);

  const closePaketModal = useCallback(() => {
    if (paketClosing) return;
    setPaketClosing(true);
    setTimeout(() => {
      setShowPaketModal(false);
      setPaketClosing(false);
    }, 280);
  }, [paketClosing]);

  // Isi "PAKET TREATMENT": semua paket dengan diskon 45%, dedupe per nama
  const paketTreatments = Object.values(
    (treatments || [])
      .filter(t => t.discount === 45)
      .reduce((acc, t) => {
        const key = t.name?.trim().toLowerCase();
        if (!key) return acc;
        if (!acc[key] || (t.image && !acc[key].image)) {
          acc[key] = t;
        }
        return acc;
      }, {})
  ).map(t => {
    const catalogFile = DISC45_FILES.get(normalizePaketName(t.name));
    return catalogFile ? { ...t, filename: catalogFile, pdfLink: null } : t;
  });

  const uniqueTreatments = Object.values(
    (treatments || [])
      .reduce((acc, t) => {
        let key = t.name?.trim().toLowerCase();
        if (!key) return acc;

        if (key.includes('melasma') || key.includes('flek') || key.includes('flex')) {
          key = 'melasma / flex treatment';
          t = { ...t, name: 'MELASMA / FLEX TREATMENT' };
        }

        // Prefer item with image or pdfLink if key already exists
        if (!acc[key] || ((t.image || t.pdfLink) && !acc[key].image && !acc[key].pdfLink)) {
          acc[key] = t;
        }
        return acc;
      }, {})
  );

  const getSortIndex = (name) => {
    if (!name) return 999;
    const lowerName = name.toLowerCase();
    
    const index = CATEGORY_ORDER.findIndex(matchFn => matchFn(lowerName));
    
    return index !== -1 ? index : 999;
  };

  const filteredTreatments = uniqueTreatments
    .filter(t => t.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => getSortIndex(a.name) - getSortIndex(b.name));

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
  }, []);

  // Kunci scroll halaman saat modal paket terbuka + tutup dengan tombol Escape
  useEffect(() => {
    document.body.style.overflow = showPaketModal ? 'hidden' : '';
    if (!showPaketModal) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') closePaketModal();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [showPaketModal, closePaketModal]);


  return (
    <div className="app-container" style={{ minHeight: '100vh', backgroundColor: '#fafafa' }}>
      <Header />
      
      <section className="catalog-container perawatan-hero" data-aos="fade-up" style={{ paddingBottom: '4rem' }}>
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

        {paketTreatments.length > 0 && (
          <div
            className="paket-banner"
            data-aos="fade-up"
            onClick={() => setShowPaketModal(true)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setShowPaketModal(true); }}
          >
            <div className="paket-banner-content">
              <h3 className="paket-banner-title">PAKET TREATMENT</h3>
              <p className="paket-banner-desc">
                {paketTreatments.length} paket pilihan dengan harga spesial untuk kulit sehat &amp; glowing
              </p>
              <span className="paket-banner-btn">
                Lihat {paketTreatments.length} Paket
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="M12 5l7 7-7 7"></path>
                </svg>
              </span>
            </div>
            <div className="paket-banner-visual-thumbs">
              <div className="paket-banner-thumbs">
                {paketTreatments.map((t, i) => {
                  const src = paketThumbSrc(t);
                  return src ? (
                    <span
                      key={t.id || i}
                      className={`paket-banner-thumb${i > 0 ? ' is-blurred' : ''}`}
                      style={{ zIndex: paketTreatments.length - i }}
                    >
                      <img src={src} alt={t.name} />
                    </span>
                  ) : null;
                })}
              </div>
              <span className="paket-banner-count-label">{paketTreatments.length} Paket Pilihan</span>
            </div>
          </div>
        )}

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

      {showPaketModal && (
        <div className={`paket-modal-overlay${paketClosing ? ' closing' : ''}`} onClick={closePaketModal}>
          <div className="paket-modal" onClick={(e) => e.stopPropagation()}>
            <div className="paket-modal-header">
              <div className="paket-modal-heading">
                <h2 className="paket-modal-title">PAKET TREATMENT</h2>
                <p className="paket-modal-subtitle">
                  {paketTreatments.length} paket pilihan untuk kulit sehat &amp; glowing
                </p>
              </div>
              <button
                type="button"
                className="paket-modal-close"
                onClick={closePaketModal}
                aria-label="Tutup"
              >
                &times;
              </button>
            </div>
            <div className="catalog-grid paket-modal-grid">
              {paketTreatments.map((treatment, index) => (
                <div
                  key={treatment.id || index}
                  className="paket-modal-item"
                  style={{ animationDelay: `${0.1 + index * 0.08}s` }}
                >
                  <TreatmentCard treatment={{ ...treatment, effectiveDiscount: 0, endDate: null, discount: 0 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default Perawatan;
