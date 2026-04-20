import React, { useState, useEffect, useRef, createContext, useContext } from 'react';

const AppContext = createContext();

const tee = (fill, g, tf) => {
  const blank = g === 'blank';
  return `<svg viewBox="0 0 300 360" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M28 58 L0 132 L58 148 L58 342 L242 342 L242 148 L300 132 L272 58 L210 72 Q150 108 90 72 Z" fill="${fill}"/>
  <path d="M90 72 Q150 115 210 72" stroke="rgba(255,255,255,0.06)" stroke-width="1.5" fill="none"/>
  <line x1="58" y1="152" x2="58" y2="335" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
  <line x1="242" y1="152" x2="242" y2="335" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
  ${blank ? '' : `<text x="150" y="228" fill="${tf}" font-family="'Syne',sans-serif" font-weight="800" font-size="34" text-anchor="middle" letter-spacing="5">${g}</text>
  <text x="150" y="249" fill="${tf}" font-family="'Geist Mono',monospace" font-size="6.5" text-anchor="middle" letter-spacing="3" opacity="0.4">BLUNT STUDIO</text>`}
  </svg>`;
};

const bdg = { new: 'b-new', low: 'b-low', sold: 'b-sold', drop: 'b-drop', col: 'b-col' };
const bdgL = { new: 'New', low: 'Low Stock', sold: 'Sold Out', drop: 'Drop', col: 'Collab' };

const useProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { filters, searchQuery, priceMax } = useContext(AppContext);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams({
          category: filters.activeCat || 'all',
          search: searchQuery,
          priceMax: priceMax || 2499
        });
        const res = await fetch(`/api/products?${params}`);
        const data = await res.json();
        setProducts(data);
        setLoading(false);
      } catch (err) {
        console.error('Fetch products error:', err);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [filters.activeCat, searchQuery, priceMax]);

  return { products, loading };
};

const useSuggestions = (query) => {
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (query) {
      fetch(`/api/suggestions?q=${encodeURIComponent(query)}`)
        .then(res => res.json())
        .then(setSuggestions)
        .catch(console.error);
    } else {
      setSuggestions([]);
    }
  }, [query]);

  return suggestions;
};

const SearchBox = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [showSugg, setShowSugg] = useState(false);
  const suggestions = useSuggestions(query);
  const ref = useRef();

  const hl = (str) => {
    if (!query) return str;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return str.replace(regex, '<mark>$1</mark>');
  };

  useEffect(() => {
    onSearch(query);
  }, [query, onSearch]);

  return (
    <div className="search-wrap">
      <div className="s-icon">
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
      </div>
      <input
        ref={ref}
        className="search-box"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search tees, colours, fits…"
        autoComplete="off"
        spellCheck={false}
      />
      <button className={`s-clear ${query ? 'vis' : ''}`} onClick={() => {setQuery(''); setShowSugg(false);}}>✕</button>
      <div className={`sugg ${showSugg && suggestions.length ? 'open' : ''}`}>
        {suggestions.length ? (
          <div>
            <div className="sug-lbl">Suggestions</div>
            {suggestions.map((s) => (
              <div key={s.q} className="sug-item" onClick={() => {setQuery(s.q); setShowSugg(false);}}>
                <div className="sug-ico">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9C9488" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                </div>
                <div>
                  <div className="sug-txt" dangerouslySetInnerHTML={{__html: s.l.replace(new RegExp(query, 'gi'), '<em>$&</em>')}} />
                  <div className="sug-sub">{s.s}</div>
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

const Sidebar = () => {
  const { filters, setFilters } = useContext(AppContext);

  const toggleFilter = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type] === value ? null : value
    }));
  };

  return (
    <aside className="sidebar">
      <div className="sb-sec">
        <div className="sb-ttl">Size</div>
        {['XS', 'S', 'M', 'L', 'XL', '2XL'].map(size => (
          <div key={size} className="sb-opt" onClick={() => toggleFilter('size', size)}>
            <span className={`sb-opt-l ${filters.size === size ? 'on' : ''}`}>{size}</span>
            <span className="sb-cnt">{Math.floor(Math.random() * 8 + 3)}</span>
          </div>
        ))}
      </div>
      <div className="sb-sec">
        <div className="sb-ttl">Price</div>
        <div className="p-range">
          <input className="p-slider" type="range" min="999" max="2499" defaultValue="2499" />
          <div className="p-vals"><span>₹999</span><span id="pmx">₹2,499</span></div>
        </div>
      </div>
      {/* More filters... */}
      <button className="sb-clr">Clear all filters</button>
    </aside>
  );
};

const ProductCard = ({ product, onClick }) => {
  return (
    <div className="pcard" onClick={() => onClick(product)}>
      {product.badge && <div className={`pbadge ${bdg[product.badge]}`}>{bdgL[product.badge]}</div>}
      <div className="pcard-img" dangerouslySetInnerHTML={{ __html: tee(product.fill, product.g, product.tf) }} />
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
    </div>
  );
};

const ProductGrid = ({ products, onProductClick, loading }) => {
  if (loading) return <div>Loading...</div>;

  return (
    <div className="pgrid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} onClick={onProductClick} />
      ))}
    </div>
  );
};

const App = () => {
  const [filters, setFilters] = useState({ activeCat: 'all' });
  const [searchQuery, setSearchQuery] = useState('');
  const [priceMax, setPriceMax] = useState(2499);
  const [cartCount, setCartCount] = useState(0);
  const { products, loading } = useProducts();
  const cursorRef = useRef();

  const value = { filters, setFilters, searchQuery, setSearchQuery, priceMax, setPriceMax, cartCount, setCartCount };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cursorRef.current) {
        cursorRef.current.style.left = e.clientX + 'px';
        cursorRef.current.style.top = e.clientY + 'px';
      }
    };
    document.addEventListener('mousemove', handleMouseMove);
    return () => document.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCategoryFilter = (cat) => {
    setFilters(prev => ({ ...prev, activeCat: cat }));
  };

  const handleProductClick = (product) => {
    // Open modal logic here
    console.log('Open modal for:', product);
  };

  return (
    <AppContext.Provider value={value}>
      <div id="cur" ref={cursorRef}></div>
      
      <nav>
        <div className="nav-logo">Blunt<sup>®</sup></div>
        <SearchBox onSearch={setSearchQuery} />
        <div className="nav-right">
          <a className="nav-lnk" href="#">Drops</a>
          <a className="nav-lnk" href="#">Story</a>
          <button className="bag-btn">Bag ({cartCount})</button>
        </div>
      </nav>

      <div className="frow">
        {['all', 'graphic', 'blank', 'washed', 'collab', 'instock'].map(cat => (
          <React.Fragment key={cat}>
            <button 
              className={`chip ${filters.activeCat === cat ? 'on' : ''}`} 
              onClick={() => handleCategoryFilter(cat)}
            >
              {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1).replace(/([A-Z])/g, ' $1')}
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
              {searchQuery ? `Results for "${searchQuery}"` : 'Showing all tees'}
            </div>
            <select className="sort-sel">
              <option>Sort: Newest</option>
            </select>
          </div>
          <ProductGrid products={products} onProductClick={handleProductClick} loading={loading} />
        </div>
      </div>
    </AppContext.Provider>
  );
};

export default App;

