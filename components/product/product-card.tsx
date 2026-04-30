"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

export function ProductCard({ product, offset }: { product: any, offset?: number }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent navigation
    
    // Add to cart animation
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    
    // Create flying product icon
    createFlyingIcon(rect, product.image);
  };

  return (
    <Link href={`/product/${product.id}`} passHref legacyBehavior>
      <motion.a
        className="product-card block relative"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        whileHover={{ 
          y: -8,
          scale: 1.01,
          transition: { duration: 0.3 }
        }}
      >
        {/* Badge */}
        {product.tag && (
          <motion.div 
            className={`badge badge-${product.tag.toLowerCase().replace(/\s+/g, '-')}`}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {product.tag}
          </motion.div>
        )}
        
        {/* Image Container */}
        <div className="image-container">
          <motion.img
            src={product.image}
            alt={product.name}
            className="product-image"
            onLoad={() => setImageLoaded(true)}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ 
              scale: imageLoaded ? 1 : 1.1,
              opacity: imageLoaded ? 1 : 0
            }}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6 }}
          />
          
          {/* Wishlist Button */}
          <motion.button
            className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
            onClick={(e: React.MouseEvent) => { e.preventDefault(); setIsWishlisted(!isWishlisted); }}
            whileTap={{ scale: 0.9 }}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <motion.svg
              viewBox="0 0 24 24"
              fill={isWishlisted ? "#EF4444" : "none"}
              stroke={isWishlisted ? "#EF4444" : "#A3A3A3"}
              strokeWidth="2"
              animate={isWishlisted ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </motion.svg>
          </motion.button>
        </div>
        
        {/* Card Content */}
        <div className="card-content">
          <p className="brand">{product.brand}</p>
          <h3 className="product-name">{product.name}</h3>
          <p className="product-weight">{product.weight || "Standard Size"}</p>
          
          <div className="price-cart">
            <span className="price">₹{product.price}</span>
            
            <motion.button
              className="add-to-cart"
              onClick={handleAddToCart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              aria-label="Add to cart"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 2L7 6h14l-2-4H9z" stroke="currentColor" strokeWidth="2"/>
                <path d="M7 6h14v13a2 2 0 01-2 2H9a2 2 0 01-2-2V6z" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </motion.button>
          </div>
        </div>
      </motion.a>
    </Link>
  );
}

// Flying icon animation helper
function createFlyingIcon(startRect: DOMRect, imageSrc: string) {
  const icon = document.createElement('div');
  icon.className = 'flying-icon';
  icon.style.cssText = `
    position: fixed;
    left: ${startRect.left}px;
    top: ${startRect.top}px;
    width: 60px;
    height: 60px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    z-index: 9999;
    pointer-events: none;
  `;
  
  const img = document.createElement('img');
  img.src = imageSrc;
  img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: 12px;';
  icon.appendChild(img);
  
  document.body.appendChild(icon);
  
  // Get cart position
  const cart = document.querySelector('.cart-icon') || document.querySelector('[aria-label="Cart"]') || document.querySelector('header');
  const cartRect = cart ? cart.getBoundingClientRect() : { left: window.innerWidth - 50, top: 20 };
  
  // Animate to cart
  icon.animate([
    { 
      left: `${startRect.left}px`,
      top: `${startRect.top}px`,
      transform: 'scale(1) rotate(0deg)',
      opacity: 1
    },
    { 
      left: `${cartRect.left}px`,
      top: `${cartRect.top}px`,
      transform: 'scale(0.3) rotate(360deg)',
      opacity: 0.5
    }
  ], {
    duration: 800,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }).onfinish = () => {
    icon.remove();
    updateCartBadge();
  };
}

function updateCartBadge() {
  const badge = document.querySelector('.cart-badge');
  if (badge) {
    badge.classList.add('pulse');
    setTimeout(() => badge.classList.remove('pulse'), 600);
  }
}
