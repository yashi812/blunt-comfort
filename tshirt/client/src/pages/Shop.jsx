import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import ProductGrid from '../components/ProductGrid';
import QuickViewModal from '../components/QuickViewModal';
import { AppContext } from '../App';

const Shop = () => {
  const { filters, setFilters, searchQuery, priceMax } = useContext(AppContext);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { handleAddCart } = useContext(AppContext); // We'll move handleAddCart to context provider

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

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const onAddCartLocal = (product, size, color) => {
    handleAddCart(product, size, color);
    setIsModalOpen(false);
  };

  return (
    <div className="shop-page">
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
        onAddCart={onAddCartLocal}
      />
    </div>
  );
};

export default Shop;
