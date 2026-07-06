import React, { useEffect, useRef, useContext } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { CMSContext } from '../context/CMSContext';

function BeforeAfter() {
  const sliderRef = useRef(null);
  const { beforeAfterImages } = useContext(CMSContext);

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });

    const interval = setInterval(() => {
      if (sliderRef.current) {
        const container = sliderRef.current;
        const scrollAmount = container.clientWidth >= 768 ? 280 : container.clientWidth;
        if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 10) {
          container.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const scrollLeft = () => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth >= 768 ? 280 : sliderRef.current.clientWidth;
      sliderRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      const scrollAmount = sliderRef.current.clientWidth >= 768 ? 280 : sliderRef.current.clientWidth;
      sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', paddingBottom: '4rem', backgroundColor: '#fafafa' }}>
      <Header />
      
      <section className="catalog-container" style={{ paddingTop: '10px', marginTop: '20px' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }} data-aos="fade-up">
          <div className="section-subtitle-gold">HASIL NYATA</div>
          <h2 className="section-title-grey" style={{ marginBottom: '1rem' }}>MEREKA TELAH MENCOBA DAN MEMBUKTIKAN HASILNYA</h2>
          <p style={{ color: 'var(--text-light)', maxWidth: '600px', margin: '0 auto' }}>
            Lihat perubahan luar biasa dari pasien-pasien kami setelah menjalani perawatan di Enef Clinic.
          </p>
        </div>

        <div className="slider-wrapper" style={{ position: 'relative', maxWidth: '1100px', margin: '0 auto' }} data-aos="fade-up" data-aos-delay="100">
          <button onClick={scrollLeft} className="slider-btn left" style={{ position: 'absolute', left: '-25px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'white', border: 'none', borderRadius: '50%', width: '50px', height: '50px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: 'var(--primary-color)', transition: 'all 0.3s ease' }}>&#10094;</button>
          
          <div 
            ref={sliderRef}
            className="slider-container"
            style={{ 
              display: 'flex', 
              overflowX: 'auto', 
              scrollBehavior: 'smooth', 
              gap: '20px',
              padding: '20px 5px 40px 5px',
              scrollbarWidth: 'none', /* Firefox */
              msOverflowStyle: 'none'  /* IE/Edge */
            }}
          >
            {beforeAfterImages.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', width: '100%', color: '#888' }}>Belum ada foto yang diunggah.</div>
            ) : beforeAfterImages.map((slide, index) => (
              <div key={index} style={{ 
                minWidth: '320px', 
                maxWidth: '350px',
                flex: '0 0 auto',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Gold Card */}
                <div style={{
                  borderRadius: '12px',
                  background: 'linear-gradient(180deg, #e7d1b8 0%, #d8b891 100%)',
                  padding: '1.2rem',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center'
                }}>
                  {/* Clinic Name / Logo Placeholder */}
                  <div style={{
                    alignSelf: 'flex-start',
                    color: '#B68B5D',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    fontFamily: 'serif'
                  }}>
                    Enef<br/><span style={{fontSize: '0.6rem', letterSpacing: '1px'}}>SKIN CLINIC</span>
                  </div>

                  {/* Top Title Pill */}
                  <div style={{
                    background: 'linear-gradient(90deg, #f5d8a0 0%, #cd9f5e 100%)',
                    color: '#5a3d1c',
                    padding: '0.3rem 1.5rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    marginBottom: '1rem',
                    boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
                    textAlign: 'center',
                    width: '90%'
                  }}>
                    {slide.title}
                  </div>

                  {/* Image Container */}
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    borderRadius: '8px',
                    marginBottom: '2rem'
                  }}>
                    <img 
                      src={slide.img} 
                      alt={`Before After ${index + 1}`} 
                      style={{ width: '100%', height: 'auto', display: 'block', borderRadius: '8px', objectFit: 'contain' }}
                      loading="lazy"
                    />
                    
                    {/* Before Pill */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-12px',
                      left: '20%',
                      transform: 'translateX(-50%)',
                      backgroundColor: 'white',
                      color: '#cd9f5e',
                      padding: '0.2rem 1.2rem',
                      borderRadius: '15px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      fontStyle: 'italic',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}>
                      Before
                    </div>
                    
                    {/* After Pill */}
                    <div style={{
                      position: 'absolute',
                      bottom: '-12px',
                      right: '20%',
                      transform: 'translateX(50%)',
                      backgroundColor: 'white',
                      color: '#cd9f5e',
                      padding: '0.2rem 1.2rem',
                      borderRadius: '15px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      fontStyle: 'italic',
                      boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}>
                      After
                    </div>
                  </div>

                  {/* Bottom Text & Watermark */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-end',
                    width: '100%',
                    marginTop: 'auto'
                  }}>
                    <div style={{
                      color: '#8C6740',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {slide.doctor}
                    </div>
                    <div style={{
                      color: '#c49e70',
                      fontSize: '0.6rem',
                      fontWeight: 'bold',
                      textAlign: 'right',
                      lineHeight: '1.2'
                    }}>
                      #JUARANYA<br/>ATASI MASALAH<br/>KULIT
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <button onClick={scrollRight} className="slider-btn right" style={{ position: 'absolute', right: '-25px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, background: 'white', border: 'none', borderRadius: '50%', width: '50px', height: '50px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', color: 'var(--primary-color)', transition: 'all 0.3s ease' }}>&#10095;</button>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .slider-container::-webkit-scrollbar {
            display: none;
          }
          .slider-btn:hover {
            background-color: var(--primary-color) !important;
            color: white !important;
          }
          @media (max-width: 768px) {
            .slider-btn {
              display: none !important;
            }
            .slider-container > div {
              min-width: 85% !important;
            }
          }
        `}} />
      </section>

      <Footer />

      <FloatingWhatsApp />
    </div>
  );
}

export default BeforeAfter;
