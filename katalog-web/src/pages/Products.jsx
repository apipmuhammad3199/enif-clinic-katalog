import React, { useState, useEffect, useContext } from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { CMSContext } from '../context/CMSContext';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { skincareProducts } = useContext(CMSContext);

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
      <Header />

      <div style={{ maxWidth: '1200px', margin: '0 auto', marginTop: '20px', padding: '0 2rem' }}>
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

