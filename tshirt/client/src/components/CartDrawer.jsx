import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2 } from 'lucide-react';
import { AppContext } from '../App';
import { tee } from '../utils';

const CartDrawer = ({ isOpen, onClose, items, onUpdateQty, onRemove }) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * (item.qty || 1), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="mbg open" 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            style={{ zIndex: 600 }}
          />
          <motion.div 
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="cd-head">
              <div className="cd-ttl">Your Bag ({items.length})</div>
              <button className="cd-cls" onClick={onClose}><X size={20} /></button>
            </div>

            <div className="cd-body">
              {items.length === 0 ? (
                <div className="cd-empty">
                  Your bag is empty.<br/>
                  <button className="cd-shop-btn" onClick={onClose}>Continue Shopping</button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="cd-item">
                    <div className="cd-item-img" style={{ background: item.fill + '10' }}>
                      {tee(item.fill, item.g, item.tf)}
                    </div>
                    <div className="cd-item-info">
                      <div className="cd-item-name">{item.name}</div>
                      <div className="cd-item-meta">{item.tag} · {item.size}</div>
                      <div className="cd-item-price">₹{(item.price * (item.qty || 1)).toLocaleString('en-IN')}</div>
                      
                      <div className="cd-item-bot">
                        <div className="cd-qty">
                          <button onClick={() => onUpdateQty(item.id, (item.qty || 1) - 1)}><Minus size={12} /></button>
                          <span>{item.qty || 1}</span>
                          <button onClick={() => onUpdateQty(item.id, (item.qty || 1) + 1)}><Plus size={12} /></button>
                        </div>
                        <button className="cd-rem" onClick={() => onRemove(item.id)}><Trash2 size={14} /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="cd-foot">
                <div className="cd-total">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <button className="cd-checkout">Checkout</button>
                <div className="cd-note">Taxes and shipping calculated at checkout</div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
