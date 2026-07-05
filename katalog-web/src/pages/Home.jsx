import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link } from 'react-router-dom';
import TreatmentCard from '../components/TreatmentCard';
import ProductCard from '../components/ProductCard';
import PromoSlider from '../components/PromoSlider';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../index.css';
import { CMSContext } from '../context/CMSContext';
import { articles } from '../data/articles';

function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isContactOpen, setIsContactOpen] = useState(false);
  const { treatments, videos, promoSettings } = useContext(CMSContext);
  const marqueeRef = useRef(null);
  const testiMarqueeRef = useRef(null);
  const contactDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contactDropdownRef.current && !contactDropdownRef.current.contains(event.target)) {
        setIsContactOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      // Skincare Marquee
      if (marqueeRef.current) {
        const container = marqueeRef.current;
        const cardWidth = 260 + 24; // product-card width + gap
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      }
      // Testimonial Marquee
      if (testiMarqueeRef.current) {
        const container = testiMarqueeRef.current;
        const cardWidth = 320 + 32; // testi-card min-width roughly + gap
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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

  const treatments50 = processedTreatments.filter(t => t.effectiveDiscount === 50 && t.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const treatments45 = processedTreatments.filter(t => t.effectiveDiscount === 45 && t.name.toLowerCase().includes(searchTerm.toLowerCase()));
  
  // Logika Semua Layanan: 
  // Jika sedang mencari (searchTerm tidak kosong), tampilkan semuanya.
  // Jika tidak mencari, sembunyikan yang sedang promo agar tidak dobel.
  const treatmentsAll = processedTreatments.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
    if (searchTerm === '') {
      return t.effectiveDiscount === 0 && matchesSearch;
    }
    return matchesSearch;
  });

  const skincareProducts = [
    { name: 'Body Whitening SPF 20 Strawberry', image: 'skincare1.jpeg' },
    { name: 'Bye Acne Facial Wash', image: 'skincare2.jpeg' },
    { name: 'Bye Acne Toner', image: 'skincare3.jpeg' },
    { name: 'Cera Niacin Gentle Cleanser', image: 'skincare4.jpeg' },
    { name: 'Dreamy Glow HyaluMoist', image: 'skincare5.jpeg' },
  ];
  
  const searchedProducts = skincareProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Duplicate array for infinite marquee effect
  const marqueeProducts = [...skincareProducts, ...skincareProducts];

  const testimonials = [
    { name: 'Rina Sari', treatment: 'Facial Acne', quote: 'Pelayanannya sangat ramah dan tempatnya bersih. Wajah saya terasa lebih glowing setelah perawatan pertama!', image: 'https://i.pravatar.cc/150?img=1' },
    { name: 'Dwi Wahyuni', treatment: 'Peeling Glow', quote: 'Dokternya sabar banget jelasin kondisi kulit saya. Krimnya juga cocok dan nggak bikin iritasi.', image: 'https://i.pravatar.cc/150?img=5' },
    { name: 'Anita Kusuma', treatment: 'Laser Rejuvenation', quote: 'Klinik favorit! Harganya terjangkau tapi hasilnya nggak main-main. Sangat direkomendasikan.', image: 'https://i.pravatar.cc/150?img=9' },
    { name: 'Siti Rahma', treatment: 'IPL Hair Removal', quote: 'Hasilnya langsung terlihat sejak treatment pertama. Stafnya sangat profesional dan membantu.', image: 'https://i.pravatar.cc/150?img=12' }
  ];
  const marqueeTestimonials = [...testimonials, ...testimonials];

  const preview50 = treatments50.slice(0, 4);
  const preview45 = treatments45.slice(0, 4);

  const hasActive50 = processedTreatments.some(t => t.effectiveDiscount === 50);
  const hasActive45 = processedTreatments.some(t => t.effectiveDiscount === 45);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <img src={`${import.meta.env.BASE_URL}assets/logo.jpg`} alt="Enef Clinic Logo" className="logo" />
          <div className="clinic-name">Enef Clinic</div>
        </div>
        
        <nav className="desktop-nav">
          <Link to="/" className="nav-link">Beranda</Link>
          <Link to="/products" className="nav-link">Skincare</Link>
          <Link to="/promo" className="nav-link">Promo Treatment</Link>
          <a href="#/" onClick={(e) => { e.preventDefault(); document.getElementById('lokasi').scrollIntoView({ behavior: 'smooth' }); }} className="nav-link">Klinik</a>
        </nav>

        <div className="social-links click-dropdown" ref={contactDropdownRef}>
          <button 
            className="contact-us-btn" 
            style={{ border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
            onClick={() => setIsContactOpen(!isContactOpen)}
          >
            Hubungi Kami
          </button>
          
          <div className={`click-dropdown-content ${isContactOpen ? 'open' : ''}`}>
            <Link to="/booking" onClick={() => setIsContactOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 414.8c-33 0-65.4-8.9-94-25.7l-6.7-4-69.8 18.3L72 334.1l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
              Booking Online
            </Link>
            <a href="https://api.whatsapp.com/send?phone=628214464406&text=Hai%2C%20Kak%20%F0%9F%A5%B0%0ASelamat%20Datang%20di%20Layanan%20Booking%20Online%20Enef%20Clinic%20%F0%9F%A4%8E%0A%0AKami%20informasikan%2C%20slot%20booking%20dibuka%20mulai%20jam%2011.00-17.00%0ABooking%20maksimal%20H-1%20sebelum%20kedatangan%20%F0%9F%A5%B0%0A%0ATerima%20kasih%20%F0%9F%A5%B0%0ASalam%20hangat%0AEnef%20Clinic%0A%0APesan%20ini%20dikirim%20otomatis%20oleh%20sistem" target="_blank" rel="noopener noreferrer" onClick={() => setIsContactOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 414.8c-33 0-65.4-8.9-94-25.7l-6.7-4-69.8 18.3L72 334.1l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
              Chat Admin WA
            </a>
            <a href="https://www.instagram.com/enefclinic/" target="_blank" rel="noopener noreferrer" onClick={() => setIsContactOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
              Instagram
            </a>
            <a href="https://www.tiktok.com/@enefclinic" target="_blank" rel="noopener noreferrer" onClick={() => setIsContactOpen(false)}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/></svg>
              TikTok
            </a>
          </div>
        </div>
      </header>

      {/* Promo Slider */}
      <PromoSlider />

      {/* Hero Section */}
      <section id="beranda" className="hero" data-aos="fade-up">
        <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-light)', marginBottom: '0.5rem' }}>Eksklusif Untuk Anda</h3>
        <h1>Telah Menjawab Permasalahan Kulit Wanita</h1>
        <p>Temukan rangkaian perawatan estetika dan produk premium kami yang dirancang khusus untuk memancarkan kecantikan alami Anda.</p>
        
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Cari perawatan atau produk..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* Search Results Section */}
      {searchTerm !== '' ? (
        <section id="search-results" className="catalog-container" style={{ paddingTop: '2rem', marginTop: '1rem', paddingBottom: '4rem' }}>
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h2 className="section-title-grey">HASIL PENCARIAN</h2>
            <p style={{ color: 'var(--text-light)' }}>Menampilkan hasil untuk: <strong>"{searchTerm}"</strong></p>
          </div>

          {treatmentsAll.length === 0 && searchedProducts.length === 0 ? (
             <div style={{ textAlign: 'center', color: 'var(--text-light)', padding: '2rem' }}>
               Tidak ada perawatan atau produk yang cocok dengan pencarian Anda.
             </div>
          ) : (
            <div className="catalog-grid">
              {treatmentsAll.map((treatment, index) => (
                <TreatmentCard key={`t-${index}`} treatment={treatment} />
              ))}
              {searchedProducts.map((product, index) => (
                <ProductCard key={`p-${index}`} product={product} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <>
          {/* Skincare Products Section */}
      <section id="skincare" className="catalog-container" data-aos="fade-up" data-aos-delay="50" style={{ paddingBottom: '2rem', paddingTop: '2rem', marginTop: '1rem' }}>
        <div style={{ marginBottom: '1.5rem', textAlign: 'left' }}>
          <div className="section-subtitle-gold">REKOMENDASI PRODUK</div>
          <h2 className="section-title-grey">PILIHAN TERBAIK UNTUKMU</h2>
        </div>
        
        <div className="marquee-container-stepped" ref={marqueeRef}>
          <div className="marquee-content-stepped">
            {marqueeProducts.map((product, index) => (
              <div key={`prod-${index}`} className="stepped-item">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'right', marginTop: '1.5rem' }}>
          <Link to="/products" className="btn-produk-lainnya">
            Produk Lainnya &rarr;
          </Link>
        </div>
      </section>

      {/* Bukti Nyata (Video) Section */}
      <section id="testimoni" className="video-section" data-aos="fade-up" style={{ textAlign: 'left', padding: '2rem 1rem', marginTop: '1rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="section-subtitle-gold">BUKTI NYATA</div>
          <h2 className="section-title-grey">MEREKA YANG TELAH MEMBUKTIKANNYA</h2>
        </div>
        <div className="video-grid">
          {videos.slice(0, 4).map((vid, idx) => {
            const isMp4 = vid.src.includes('firebasestorage') || vid.src.endsWith('.mp4');
            return (
            <div key={idx} className="video-card" data-aos="fade-up" data-aos-delay={100 * (idx + 1)}>
              <div style={{ width: '100%', height: '340px', overflow: 'hidden', position: 'relative', background: '#000' }}>
                {isMp4 ? (
                  <video src={vid.src} autoPlay loop muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <iframe src={vid.src} sandbox="allow-scripts allow-same-origin allow-presentation" width="100%" height="460" frameBorder="0" scrolling="no" allowtransparency="true" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" style={{ display: 'block', position: 'absolute', top: '-55px', left: 0, border: 'none', overflow: 'hidden' }}></iframe>
                )}
              </div>
              <div className="video-info">
                <h3>{vid.title}</h3>
              </div>
            </div>
            );
          })}
        </div>
        {videos.length > 4 && (
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <Link to="/videos" className="btn-produk-lainnya">
              Lihat Lebih Banyak &rarr;
            </Link>
          </div>
        )}
      </section>



      {/* Location Section */}
      <section id="lokasi" style={{ backgroundColor: 'transparent', paddingTop: '4rem', paddingBottom: '4rem', marginTop: '2rem' }}>
        <div className="maps-section-wrapper" data-aos="fade-up">
          <div style={{ marginBottom: '2.5rem', textAlign: 'left' }}>
            <div className="section-subtitle-gold" style={{ textAlign: 'left' }}>DAPATKAN LOKASI TERDEKAT</div>
          </div>

          <div className="maps-layout">
            <div className="maps-info-left">
              <h2>Enef Clinic Ambarawa</h2>
              <p className="maps-address">
                Ruko Emporium Citra Niaga No. 10<br/>Jl. Palagan Ambarawa, Ngrawan Kidul, Bawen,<br/>Jawa Tengah, Indonesia.
              </p>
              
              <h3>Jam Operasional</h3>
              <div className="op-hours-table">
                <div className="op-row"><span>Senin</span><span>11:00 - 17:00</span></div>
                <div className="op-row"><span>Selasa</span><span>11:00 - 17:00</span></div>
                <div className="op-row"><span>Rabu</span><span>11:00 - 17:00</span></div>
                <div className="op-row"><span>Kamis</span><span>11:00 - 17:00</span></div>
                <div className="op-row"><span>Jumat</span><span>11:00 - 17:00</span></div>
                <div className="op-row"><span>Sabtu</span><span>11:00 - 17:00</span></div>
                <div className="op-row"><span>Minggu</span><span>Libur</span></div>
              </div>

              <div style={{ marginTop: '2rem' }}>
                <a href="https://api.whatsapp.com/send?phone=628214464406&text=Hai%2C%20Kak%20%F0%9F%A5%B0%0ASelamat%20Datang%20di%20Layanan%20Booking%20Online%20Enef%20Clinic%20%F0%9F%A4%8E%0A%0AKami%20informasikan%2C%20slot%20booking%20dibuka%20mulai%20jam%2011.00-17.00%0ABooking%20maksimal%20H-1%20sebelum%20kedatangan%20%F0%9F%A5%B0%0A%0ATerima%20kasih%20%F0%9F%A5%B0%0ASalam%20hangat%0AEnef%20Clinic%0A%0APesan%20ini%20dikirim%20otomatis%20oleh%20sistem" target="_blank" rel="noopener noreferrer" className="contact-us-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', gap: '10px' }}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="20" height="20" fill="currentColor"><path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zM223.9 414.8c-33 0-65.4-8.9-94-25.7l-6.7-4-69.8 18.3L72 334.1l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/></svg>
                  Reservasi Sekarang
                </a>
              </div>
            </div>
            
            <div className="maps-container-right">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3958.07705354904!2d110.40742187515155!3d-7.231998592774136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e708170d3752e25%3A0xe5f92ff4cbffb1e6!2sEnef%20clinic!5e0!3m2!1sid!2sid!4v1709618195846!5m2!1sid!2sid" 
                width="100%" 
                height="100%" 
                style={{ border: 0, minHeight: '350px' }} 
                allowFullScreen="" 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                title="Enef Clinic Location"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
        </>
      )}

      {/* Floating WhatsApp */}

      <FloatingWhatsApp />

      {/* Testimonial Gallery Section */}
      <section id="galeri-testimoni" className="testimonial-section" data-aos="fade-up">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="section-subtitle-gold">KATA MEREKA</div>
          <h2 className="section-title-grey">GALERI TESTIMONI</h2>
        </div>
        <div className="marquee-container-stepped" ref={testiMarqueeRef}>
          <div className="marquee-content-stepped">
            {marqueeTestimonials.map((testi, index) => (
              <div key={`testi-${index}`} className="stepped-item" style={{ minWidth: '320px' }}>
                <div className="testi-card">
                  <div className="testi-quote">
                    <p>{testi.quote}</p>
                  </div>
                  <div className="testi-author">
                    <div className="testi-avatar">
                      {testi.image ? <img src={testi.image} alt={testi.name} /> : testi.name.charAt(0)}
                    </div>
                    <div>
                      <div className="testi-name">{testi.name}</div>
                      <div className="testi-treatment">{testi.treatment}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tips and Insight Section */}
      <section id="insight" style={{ backgroundColor: '#fafafa', paddingTop: '4rem', paddingBottom: '4rem', marginTop: '2rem' }}>
        <div className="catalog-container" data-aos="fade-up">
          <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <div className="section-subtitle-gold">TIPS DAN INSIGHT</div>
            <h2 className="section-title-grey" style={{ textTransform: 'uppercase' }}>SELALU DAPATKAN UPDATE INSIGHT KECANTIKAN</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: window.innerWidth < 768 ? 'column' : 'row', gap: '2rem' }}>
            {/* Featured Article (Left) */}
            {articles.length > 0 && (
              <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '1rem' }} data-aos="fade-right">
                <div style={{ width: '100%', height: '300px', overflow: 'hidden', borderRadius: '8px' }}>
                  <img src={articles[0].image.startsWith('/') ? `${import.meta.env.BASE_URL}${articles[0].image.substring(1)}` : articles[0].image} alt={articles[0].title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--text-dark)', marginTop: '0.5rem', lineHeight: '1.4' }}>{articles[0].title}</h3>
                <Link to="/articles" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontSize: '0.9rem' }}>Selengkapnya</Link>
              </div>
            )}
            
            {/* Other Articles (Right) */}
            <div style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '1.5rem', justifyContent: 'flex-start' }} data-aos="fade-left">
              {articles.slice(1, 5).map((article, idx) => (
                <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderBottom: idx < 3 ? '1px solid #eaeaea' : 'none', paddingBottom: idx < 3 ? '1rem' : '0' }}>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-dark)', fontWeight: '500', lineHeight: '1.4' }}>{article.title}</h4>
                  <Link to="/articles" style={{ color: 'var(--primary-color)', textDecoration: 'none', fontSize: '0.9rem' }}>Selengkapnya</Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Elegant Footer */}
      <footer className="elegant-footer">
        <div className="footer-content">
          <div className="footer-column">
            <h3>Enef Clinic</h3>
            <p>Klinik kecantikan terpercaya yang memberikan solusi terbaik untuk masalah kulit Anda. Kami berkomitmen memberikan pelayanan dan hasil yang memuaskan.</p>
            <div className="social-icons-footer">
              <a href="https://www.instagram.com/enefclinic/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <svg viewBox="0 0 448 512" width="18" height="18" fill="currentColor"><path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/></svg>
              </a>
              <a href="https://www.tiktok.com/@enefclinic" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <svg viewBox="0 0 448 512" width="18" height="18" fill="currentColor"><path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/></svg>
              </a>
            </div>
          </div>
          <div className="footer-column">
            <h3>Tautan Cepat</h3>
            <Link to="/">Beranda</Link>
            <Link to="/promo-45">Promo 45%</Link>
            <Link to="/promo-50">Promo 50%</Link>
            <Link to="/products">Produk Skincare</Link>
            <Link to="/articles">Tips dan Insight</Link>
            <a href="#/" onClick={(e) => { e.preventDefault(); document.getElementById('lokasi').scrollIntoView({ behavior: 'smooth' }); }}>Lokasi Klinik</a>
          </div>
          <div className="footer-column">
            <h3>Kontak Kami</h3>
            <p>Ruko Emporium Citra Niaga No. 10<br/>Jl. Palagan Ambarawa, Bawen<br/>Jawa Tengah, Indonesia</p>
            <p><strong>WhatsApp:</strong> <br/>0821-4464-406</p>
            <p><strong>Email:</strong> <br/>info@enefclinic.com</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Enef Clinic. All rights reserved. | Elegance in every detail.</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
