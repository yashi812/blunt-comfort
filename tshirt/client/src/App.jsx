import React, { useState, useEffect, useRef, createContext } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import CartDrawer from './components/CartDrawer';
import Toast from './components/Toast';
import Home from './pages/Home';
import Shop from './pages/Shop';
import useAutoTypeDemo from './hooks/useAutoTypeDemo';
import './index.css';

export const AppContext = createContext();

const App = () => {
  const [filters, setFilters] = useState({ activeCat: 'all' });
  const [searchQuery, setSearchQuery] = useState('');
  const [priceMax, setPriceMax] = useState(2499);
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false });
  const [isDemoActive, setIsDemoActive] = useState(true);
  const cursorRef = useRef();
  const location = useLocation();

  useAutoTypeDemo(setSearchQuery, isDemoActive && !searchQuery && location.pathname === '/shop');

  // Initial cart fetch
  useEffect(() => {
    fetch('/api/cart')
      .then(res => res.json())
      .then(data => {
        setCartItems(data.items || []);
        setCartCount(data.count || 0);
      });
  }, []);

  // Cursor logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    
    const handleHover = (e) => {
      if (e.target.closest('button, a, .pcard, .sb-opt, .sug-item, .chip, .msz, .psw, .f-card')) {
        cursorRef.current?.classList.add('hover');
      } else {
        cursorRef.current?.classList.remove('hover');
      }
    };
    document.addEventListener('mouseover', handleHover);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleHover);
    };
  }, []);

  const showToast = (message) => {
    setToast({ message, visible: true });
    setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 2400);
  };

  const handleAddCart = async (product, size, color) => {
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, size, color })
      });
      const data = await res.json();
      if (data.success) {
        setCartItems(data.items);
        setCartCount(data.total);
        setIsCartOpen(true);
        showToast('Added to bag ✓');
      }
    } catch (err) {
      console.error('Add to cart error:', err);
    }
  };

  const handleUpdateQty = async (id, qty) => {
    if (qty < 1) return;
    try {
      const res = await fetch('/api/cart/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, qty })
      });
      const data = await res.json();
      if (data.success) {
        setCartItems(data.items);
      }
    } catch (err) {
      console.error('Update qty error:', err);
    }
  };

  const handleRemoveCart = async (id) => {
    try {
      const res = await fetch('/api/cart/remove', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (data.success) {
        setCartItems(data.items);
        setCartCount(data.items.length);
      }
    } catch (err) {
      console.error('Remove item error:', err);
    }
  };

  const value = { 
    filters, setFilters, 
    searchQuery, setSearchQuery, 
    priceMax, setPriceMax, 
    cartCount, setCartCount,
    setIsDemoActive,
    setIsCartOpen,
    handleAddCart
  };

  return (
    <AppContext.Provider value={value}>
      <div id="cur" ref={cursorRef}></div>
      
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
      </Routes>

      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQty={handleUpdateQty}
        onRemove={handleRemoveCart}
      />

      <Toast 
        message={toast.message} 
        isVisible={toast.visible} 
      />
    </AppContext.Provider>
  );
};

export default App;
