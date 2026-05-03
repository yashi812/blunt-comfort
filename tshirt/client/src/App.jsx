import React, { useState, useEffect, useRef, createContext } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProductGrid from './components/ProductGrid';
import QuickViewModal from './components/QuickViewModal';
import Toast from './components/Toast';
import useAutoTypeDemo from './hooks/useAutoTypeDemo';
import './index.css';

export const AppContext = createContext();

const App = () => {
  const [filters, setFilters] = useState({ activeCat: 'all' });
  const [searchQuery, setSearchQuery] = useState('');
  const [priceMax, setPriceMax] = useState(2499);
  const [cartCount, setCartCount] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toast, setToast] = useState({ message: '', visible: false });
  const [isDemoActive, setIsDemoActive] = useState(true);
  const cursorRef = useRef();

  useAutoTypeDemo(setSearchQuery, isDemoActive && !searchQuery);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          category: filters.activeCat || 'all',
          search: searchQuery,
          priceMax: priceMax
        });
        const res = await fetch(`/api/products?${params}`);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Fetch products error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters.activeCat, searchQuery, priceMax]);

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
      if (e.target.closest('button, a, .pcard, .sb-opt, .sug-item, .chip, .msz')) {
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

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleAddCart = async (product) => {
    try {
      const res = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, size: 'M' })
      });
      const data = await res.json();
      if (data.success) {
        setCartCount(data.total);
        setIsModalOpen(false);
        showToast('Added to bag ✓');
      }
    } catch (err) {
      console.error('Add to cart error:', err);
    }
  };

  const value = { 
    filters, setFilters, 
    searchQuery, setSearchQuery, 
    priceMax, setPriceMax, 
    cartCount, setCartCount,
    setIsDemoActive
  };

  return (
    <AppContext.Provider value={value}>
      <div id="cur" ref={cursorRef}></div>
      
      <Header />

      <div className="frow">
        {['all', 'graphic', 'blank', 'washed', 'collab', 'instock'].map(cat => (
          <React.Fragment key={cat}>
            <button 
              className={`chip ${filters.activeCat === cat ? 'on' : ''}`} 
              onClick={() => setFilters(prev => ({ ...prev, activeCat: cat }))}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
            {(cat === 'collab' || cat === 'instock') && <div className="fsep"></div>}
          </React.Fragment>
        ))}
        <span className="res-lbl">{products.length} results</span>
      </div>

      <div className="main">
        <Sidebar />
        <div className="garea">
          <div className="sort-row">
            <div className="sort-head">
              {searchQuery ? (
                <>Results for <em>"{searchQuery}"</em></>
              ) : (
                'Showing all tees'
              )}
            </div>
            <select className="sort-sel">
              <option>Sort: Newest</option>
              <option>Price Low–High</option>
              <option>Price High–Low</option>
              <option>Best Selling</option>
            </select>
          </div>
          
          <ProductGrid 
            products={products} 
            onProductClick={handleProductClick} 
            loading={loading} 
          />
        </div>
      </div>

      <QuickViewModal 
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddCart={handleAddCart}
      />

      <Toast 
        message={toast.message} 
        isVisible={toast.visible} 
      />
    </AppContext.Provider>
  );
};

export default App;
