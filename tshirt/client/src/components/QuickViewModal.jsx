import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';
import { tee } from '../utils';

const QuickViewModal = ({ product, isOpen, onClose, onAddCart }) => {
  const [customColor, setCustomColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');

  useEffect(() => {
    if (product) {
      setCustomColor(product.fill);
      setSelectedSize('M');
    }
  }, [product]);

  if (!product) return null;

  const displayColor = customColor || product.fill;
  const lbg = displayColor === '#111010' ? '#1c1c1c' : (displayColor + '15');

  const premiumColors = [
    { name: 'Original', hex: product.fill },
    { name: 'Vanta Black', hex: '#111010' },
    { name: 'Ecru', hex: '#E8E3D8' },
    { name: 'Rust', hex: '#8B3320' },
    { name: 'Forest', hex: '#1a2a20' },
    { name: 'Dusk', hex: '#3d3060' },
    { name: 'Slate', hex: '#888' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="mbg open" 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => e.target.classList.contains('mbg') && onClose()}
          style={{ zIndex: 500 }}
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
            
            <div className="mleft" style={{ background: lbg, transition: 'background 0.4s ease' }}>
              {tee(displayColor, product.g, product.tf)}
            </div>

            <div className="mright">
              <div className="mtag">{product.tag}</div>
              <div className="mname">{product.name}</div>
              <div className="mdesc">{product.desc}</div>
              <div className="mprice">₹{product.price.toLocaleString('en-IN')}</div>
              
              <div className="mszlbl" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Select Colour</span>
                <button 
                  onClick={() => setCustomColor(product.fill)}
                  style={{ background: 'none', border: 'none', fontSize: '0.55rem', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--mute)', cursor: 'none' }}
                >
                  <RotateCcw size={10} /> Reset
                </button>
              </div>
              <div className="pswatches" style={{ margin: '0.2rem 0 1rem' }}>
                {premiumColors.map((c) => (
                  <div 
                    key={c.hex} 
                    className={`psw ${displayColor === c.hex ? 'on' : ''}`} 
                    style={{ background: c.hex, width: '22px', height: '22px', border: displayColor === c.hex ? '2px solid var(--ink)' : '2px solid transparent' }}
                    onClick={() => setCustomColor(c.hex)}
                    title={c.name}
                  />
                ))}
              </div>

              <div className="mszlbl">Select Size — Boxy Unisex</div>
              <div className="msizes">
                {['XS', 'S', 'M', 'L', 'XL', '2XL'].map(size => (
                  <button 
                    key={size} 
                    className={`msz ${selectedSize === size ? 'on' : ''}`}
                    onClick={() => setSelectedSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
              
              <button className="madd" onClick={() => onAddCart(product, selectedSize, displayColor)}>
                Add to Bag
              </button>
              
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
