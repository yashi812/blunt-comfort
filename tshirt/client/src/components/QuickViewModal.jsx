import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { tee } from '../utils';

const QuickViewModal = ({ product, isOpen, onClose, onAddCart }) => {
  if (!product) return null;

  const lbg = product.fill === '#111010' ? '#1c1c1c' : (product.fill + '15');

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="mbg open" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target.classList.contains('mbg') && onClose()}
        >
          <motion.div 
            className="modal"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <button className="mcls" onClick={onClose}>
              ESC <X size={12} style={{ marginLeft: '4px', verticalAlign: 'middle' }} />
            </button>
            
            <div className="mleft" style={{ background: lbg }}>
              {tee(product.fill, product.g, product.tf)}
            </div>

            <div className="mright">
              <div className="mtag">{product.tag}</div>
              <div className="mname">{product.name}</div>
              <div className="mdesc">{product.desc}</div>
              <div className="mprice">₹{product.price.toLocaleString('en-IN')}</div>
              
              <div className="mszlbl">Select Size — Boxy Unisex</div>
              <div className="msizes">
                {['XS', 'S', 'M', 'L', 'XL', '2XL'].map(size => (
                  <button 
                    key={size} 
                    className={`msz ${size === 'M' ? 'on' : ''}`}
                    onClick={(e) => {
                      document.querySelectorAll('.msz').forEach(x => x.classList.remove('on'));
                      e.target.classList.add('on');
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
              
              <button className="madd" onClick={() => onAddCart(product)}>Add to Bag</button>
              
              <div className="mspecs">
                280gsm / 100% Cotton<br/>
                Drop shoulder · Boxy cut · Garment washed<br/>
                Unisex — size down for fitted look
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
