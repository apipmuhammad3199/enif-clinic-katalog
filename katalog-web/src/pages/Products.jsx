import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Ini nantinya akan diganti dengan data dari CMSContext
  const skincareProducts = [
    { name: 'Body Whitening SPF 20 Strawberry', image: 'skincare1.jpeg' },
    { name: 'Bye Acne Facial Wash', image: 'skincare2.jpeg' },
    { name: 'Bye Acne Toner', image: 'skincare3.jpeg' },
    { name: 'Cera Niacin Gentle Cleanser', image: 'skincare4.jpeg' },
    { name: 'Dreamy Glow HyaluMoist', image: 'skincare5.jpeg' },
  ];

  const filteredProducts = skincareProducts.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    AOS.init({ duration: 800, once: true, easing: 'ease-out-cubic' });
  }, []);

  return (
    <div className="app-container" style={{ minHeight: '100vh', paddingBottom: '4rem' }}>
      {/* Minimal Header */}
      <header className="header">
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

      <div style={{ maxWidth: '1200px', margin: '0 auto', marginTop: '100px', padding: '0 2rem' }}>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }} data-aos="fade-down">
          <h2 className="section-title-grey" style={{ marginBottom: '0.5rem' }}>Semua Produk Skincare</h2>
          <p style={{ color: 'var(--text-light)' }}>Temukan rangkaian perawatan kulit eksklusif dari Enef Clinic</p>
        </div>

        <div className="search-container" data-aos="fade-up" style={{ marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 3rem auto' }}>
          <input 
            type="text" 
            placeholder="Cari produk..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="catalog-grid" data-aos="fade-up">
          {filteredProducts.map((product, index) => (
            <ProductCard key={index} product={product} />
          ))}
        </div>
        
        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-light)', marginTop: '2rem' }}>
            Produk tidak ditemukan.
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
