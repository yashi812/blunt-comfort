import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { tee, bdg, bdgL } from '../utils';

const ProductCard = ({ product, onClick }) => {
  return (
    <motion.div 
      className="pcard" 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onClick={() => onClick(product)}
    >
      {product.badge && <div className={`pbadge ${bdg[product.badge]}`}>{bdgL[product.badge]}</div>}
      
      <div className="pcard-img">
        {tee(product.fill, product.g, product.tf)}
        <div className="pcard-ov">
          <button className="qv-btn">Quick View</button>
          <button 
            className="wish-btn" 
            onClick={(e) => {
              e.stopPropagation();
              // Wishlist logic
            }}
          >
            <Heart size={11} color="#F7F4EE" />
          </button>
        </div>
      </div>

      <div className="pinfo">
        <div className="pname">{product.name}</div>
        <div className="pmeta">{product.tag}</div>
        <div className="pbot">
          <div className="pprice">₹{product.price.toLocaleString('en-IN')}</div>
          <div className="pswatches">
            {product.sw.map((c, i) => (
              <div key={i} className="psw on" style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ProductGrid = ({ products, onProductClick, loading }) => {
  if (loading) {
    return (
      <div className="pgrid">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="pcard skeleton" style={{ minHeight: '300px', background: 'var(--soft)' }}></div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="nores vis">
        <div className="nores-h">Nothing found.</div>
        <div className="nores-s">Try adjusting your filters or search term.</div>
      </div>
    );
  }

  return (
    <motion.div className="pgrid" layout>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onClick={onProductClick} />
      ))}
    </motion.div>
  );
};

export default ProductGrid;
