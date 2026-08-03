import React, { useContext, useEffect, useState } from 'react';
import { CMSContext } from '../context/CMSContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingWhatsApp from '../components/FloatingWhatsApp';

function VideoGallery() {
  const { videos } = useContext(CMSContext);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="app-container">
      <Header />

      <section className="catalog-container" style={{ paddingTop: '2rem', marginTop: '2rem', minHeight: '60vh' }}>
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h2 className="section-title-grey">ENEF CHANNEL</h2>
          <p style={{ color: 'var(--text-light)' }}>Kumpulan video edukasi, tips, dan treatment terbaru dari Enef Clinic</p>
        </div>
        
        {videos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
            Belum ada video yang diunggah.
          </div>
        ) : (
          <>
            <div className="video-grid">
              {videos.slice(0, visibleCount).map((vid, idx) => {
                const isMp4 = vid.src.includes('firebasestorage') || vid.src.endsWith('.mp4');
                return (
                <div key={idx} className="video-card">
                  <div style={{ width: '100%', height: '340px', overflow: 'hidden', position: 'relative', background: '#000' }}>
                    {isMp4 ? (
                      <video 
                        src={vid.src} 
                        controls 
                        playsInline 
                        onPlay={(e) => {
                          const allVideos = document.querySelectorAll('video');
                          allVideos.forEach(v => {
                            if (v !== e.target) v.pause();
                          });
                        }}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                      />
                    ) : (
                      <iframe src={vid.src} sandbox="allow-scripts allow-same-origin allow-presentation" width="100%" height="460" frameBorder="0" scrolling="no" allowtransparency="true" allow="autoplay; encrypted-media; fullscreen; picture-in-picture" loading="lazy" style={{ display: 'block', position: 'absolute', top: '-55px', left: 0, border: 'none', overflow: 'hidden' }}></iframe>
                    )}
                  </div>
                  <div className="video-info">
                    <h3>{vid.title}</h3>
                  </div>
                </div>
                );
              })}
            </div>

            {visibleCount < videos.length && (
              <div style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '2rem' }}>
                <button 
                  onClick={() => setVisibleCount(prev => prev + 6)}
                  className="btn-produk-lainnya"
                  style={{ border: 'none', cursor: 'pointer' }}
                >
                  Tampilkan Lebih Banyak &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
      <FloatingWhatsApp />
    </div>
  );
}

export default VideoGallery;


