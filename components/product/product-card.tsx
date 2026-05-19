"use client";

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';

export function ProductCard({ product, offset }: { product: any; offset?: number }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent navigation
    const button = e.currentTarget;
    const rect = button.getBoundingClientRect();
    createFlyingIcon(rect, product.image);
  };

  return (
    <motion.div
      className="block relative group"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="flex flex-col h-full bg-[#FFFCF6] rounded-[28px] border border-[#EAD7C2] overflow-hidden shadow-[0_8px_24px_rgba(74,47,34,0.05)] transition-all duration-300 hover:shadow-[0_16px_36px_rgba(74,47,34,0.08)] hover:-translate-y-1 hover:border-[#C98B5A] relative">
        <Link href={`/product/${product.id}`} className="absolute inset-0 z-0" aria-label={`View ${product.name}`} />
        
        {/* Playful Stickers / Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 pointer-events-none">
          {product.tag && (
            <span className="inline-block bg-[#F8D66D] text-[#3A241A] px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
              {product.tag}
            </span>
          )}
          {product.discount && (
            <span className="inline-block bg-[#D94F70] text-[#FFF8EC] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider shadow-sm">
              -{product.discount}%
            </span>
          )}
        </div>
        
        {/* Soft Pastel Image Area */}
        <div className="relative w-full aspect-[4/3] bg-[#FFF8EC] p-6 overflow-hidden flex items-center justify-center border-b border-[#EAD7C2]/40">
          <motion.img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-contain mix-blend-multiply"
            onLoad={() => setImageLoaded(true)}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ 
              scale: imageLoaded ? 1 : 1.1,
              opacity: imageLoaded ? 1 : 0
            }}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6 }}
          />
          
          {/* Wishlist Button: Cream rounded with Cocoa icon */}
          <button
            className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-[#FFFCF6] shadow-sm border border-[#EAD7C2] transition-colors hover:bg-[#F2DEC3]/40"
            onClick={(e: React.MouseEvent) => { e.preventDefault(); setIsWishlisted(!isWishlisted); }}
            aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={16}
              fill={isWishlisted ? "#C95C5C" : "transparent"}
              stroke={isWishlisted ? "#C95C5C" : "#4A2F22"}
              className="transition-colors"
            />
          </button>
        </div>
        
        {/* Content Section */}
        <div className="p-5 flex flex-col flex-1">
          <p className="text-xs font-black uppercase tracking-widest text-[#9B8475] mb-1.5">{product.brand}</p>
          <h3 className="text-[17px] font-black text-[#3A241A] font-display leading-snug line-clamp-2 mb-2 flex-1 hover:text-[#C98B5A] transition-colors">{product.name}</h3>
          <p className="text-xs font-bold text-[#7A6253] mb-4 bg-[#F2DEC3]/30 px-3 py-1 rounded-full w-max border border-[#EAD7C2]/20">{product.weight || "Standard Size"}</p>
          
          <div className="flex items-end justify-between mt-auto pt-4 border-t border-[#EAD7C2]/50">
            <div className="flex flex-col">
              <span className="text-xl font-black text-[#3A241A] font-display">₹{product.price}</span>
            </div>
            
            {/* Add to Cart Button: Cocoa Background */}
            <button
              className="flex items-center justify-center w-11 h-11 rounded-full bg-[#4A2F22] text-[#FFF8EC] transition-all hover:bg-[#6B4636] hover:scale-105 active:scale-95 shadow-[0_4px_12px_rgba(74,47,34,0.12)]"
              onClick={handleAddToCart}
              aria-label="Add to cart"
            >
              <ShoppingBag size={18} />
            </button>
          </div>
        </div>

      </div>
    </motion.div>
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
    box-shadow: 0 8px 24px rgba(74,47,34,0.2);
    z-index: 9999;
    pointer-events: none;
  `;
  
  const img = document.createElement('img');
  img.src = imageSrc;
  img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: 12px;';
  icon.appendChild(img);
  
  document.body.appendChild(icon);
  
  const cart = document.querySelector('.cart-icon') || document.querySelector('[aria-label="Cart"]') || document.querySelector('header');
  const cartRect = cart ? cart.getBoundingClientRect() : { left: window.innerWidth - 50, top: 20 };
  
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
