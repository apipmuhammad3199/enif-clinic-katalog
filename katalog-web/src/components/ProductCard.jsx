import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <Link to={`/booking?product=${encodeURIComponent(product.name)}`} className="product-card">
      <div className="product-image-container">
        <img 
          src={`${import.meta.env.BASE_URL}assets/product_skincare/${product.image}`} 
          alt={product.name} 
          className="product-image"
        />
      </div>
      <div className="product-content">
        <h3 className="product-name">{product.name}</h3>
      </div>
    </Link>
  );
};

export default ProductCard;
