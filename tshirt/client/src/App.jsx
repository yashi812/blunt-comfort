import React, { useState, useEffect, useRef, createContext, useContext } from 'react';

const AppContext = createContext();

const tee = (fill, g, tf) => {
  const blank = g === 'blank';
  return `<svg viewBox="0 0 300 360" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M28 58 L0 132 L58 148 L58 342 L242 342 L242 148 L300 132 L272 58 L210 72 Q150 108 90 72 Z" fill="${fill}"/>
  <path d="M90 72 Q150 115 210 72" stroke="rgba(255,255,255,0.06)" stroke-width="1.5" fill="none"/>
  <line x1="58" y1="152" x2="58" y2="335" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
<line x1="242" y1="152" x2="242" y2="335" stroke="rgba(255,255,255,0.04)" stroke-width="1"/>
  ${blank ? '' : `<text x="150" y="228" fill="${tf}" font-family="'Oswald',sans-serif" font-weight="800" font-size="34" text-anchor="middle" letter-spacing="5">${g}</text>
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
        <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /></svg>
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
      <button className={`s-clear ${query ? 'vis' : ''}`} onClick={() => { setQuery(''); setShowSugg(false); }}>✕</button>
      <div className={`sugg ${showSugg && suggestions.length ? 'open' : ''}`}>
        {suggestions.length ? (
          <div>
            <div className="sug-lbl">Suggestions</div>
            {suggestions.map((s) => (
              <div key={s.q} className="sug-item" onClick={() => { setQuery(s.q); setShowSugg(false); }}>
                <div className="sug-ico">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9C9488" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
                  </svg>
                </div>
                <div>
                  <div className="sug-txt" dangerouslySetInnerHTML={{ __html: s.l.replace(new RegExp(query, 'gi'), '<em>$&</em>') }} />
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

const AppContent = () => {
  const [filters, setFilters] = useState({ activeCat: 'all' });
  const [searchQuery, setSearchQuery] = useState('');
  const [priceMax, setPriceMax] = useState(2499);
  const [cartCount, setCartCount] = useState(0);

  // Create the initial context value for child components
  const contextValue = { filters, setFilters, searchQuery, setSearchQuery, priceMax, setPriceMax, cartCount, setCartCount };

  const { products, loading } = useProducts();
  const cursorRef = useRef();

  const value = contextValue;

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
        <SearchBox onSearch={setSearchQuery} />

        <div className="nav-logo">blntco</div>

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

      {/* FEATURED SECTIONS - Collections, Storyline, New Arrivals */}
      <div className="featured-sections" id="collections-new-structure">

        {/* COLLECTIONS SECTION */}
        <div className="ft-text-section">
          <div className="ft-section-label">Collections</div>
          <div className="ft-section-title">Bonkers Corner</div>
        </div>

        <div className="ft-photo-row" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
          <div className="ft-photo-cell">
            <img
              src="https://i.pinimg.com/736x/a6/d3/66/a6d36665245053b320862d5694fc144a.jpg"
              alt="Collections - Bonkers Corner 1"
            />
          </div>
          <div className="ft-photo-cell">
            <img
              src="https://i.pinimg.com/736x/f0/04/66/f00466385b4ca15acaac74f55254b67b.jpg"
              alt="Collections - Bonkers Corner 2"
            />
          </div>
        </div>

        {/* STORYLINE SECTION */}
        <div className="ft-text-section" id="storyline">
          <div className="ft-section-label">Storyline</div>
          <div className="ft-section-title">Our Journey</div>
        </div>

        <div className="ft-photo-row" style={{ gridTemplateColumns: '1fr' }}>
          <div className="ft-photo-cell">
            <img
              src="https://i.pinimg.com/736x/4d/0v/cH/4doVcHUk6.jpg"
              alt="Storyline"
            />
          </div>
        </div>

        {/* NEW ARRIVALS SECTION */}
        <div className="ft-text-section" id="new-arrivals">
          <div className="ft-section-label">New Arrivals</div>
          <div className="ft-section-title">Fresh Drops</div>
        </div>

        <div className="ft-photo-row" style={{ gridTemplateColumns: '1fr' }}>
          <div className="ft-photo-cell">
            <img
              src="https://i.pinimg.com/736x/14/7b/b8/147bb88ec2c295d8cc192c81c0fba803.jpg"
              alt="New Arrivals"
            />
          </div>
        </div>

      </div>

      {/* FOOTER */}
      <footer className="site-footer" id="footer">
        <div className="ft-inner">
          <div className="ft-title">What are your brands values, Mission and Vision</div>

          <div className="ft-splash">
            <div className="ft-splash-text">Scroll for more</div>
          </div>

          <div className="ft-grid">
            <section className="ft-sec">
              <h3>🌟 What We Stand For (For You)</h3>
              <ul>
                <li><span>Your Bold Confidence</span> – Feel unshakeably self-assured in every moment, owning your power without apology.</li>
                <li><span>Easy Elegance</span> – Luxe style that feels like your favourite second skin—sophisticated yet totally comfy for real life.</li>
                <li><span>Your True Story</span> – Wear what tells your unique story, celebrating the real you through every detail.</li>
                <li><span>Dreams You Can Touch</span> – Aspirational vibes that fit your everyday world, making magic feel achievable.</li>
                <li><span>Designs with Heart</span> – Every piece packed with meaning, so your style says something deep and personal.</li>
              </ul>
            </section>

            <section className="ft-sec">
              <h3>🎯 Our Promise to You</h3>
              <p className="ft-p">We design clothes that unlock your confidence with effortless elegance, all-day comfort, and style that tells your story—turning big dreams into your daily reality.</p>
              <h3 className="ft-h2">🚀 Where We're Going Together</h3>
              <p className="ft-p">A world where you feel powerful, confident, and truly seen in fashion that inspires. Join us in redefining style that's meaningful, expressive, and made for you—globally loved, personally yours.</p>
            </section>



            <section className="ft-sec">
              <h3>🎯 Mission</h3>
              <p className="ft-p">To create designs that empower individuals to embrace their confidence through elegant, comfortable, and symbolic expressions of style—bridging the gap between aspiration and everyday reality.</p>
              <p className="ft-p">blntco is all about keeping it real—no fluff, no overthinking, just pieces that feel good and look sharp. We design with comfort and confidence in mind, so you can show up as your true self every day without trying too hard. It’s about wearing what feels right, owning your vibe, and choosing style that actually says something.</p>

              <h3 className="ft-h2">🚀 Vision</h3>
              <p className="ft-p">To become a brand that redefines modern elegance by inspiring people to feel powerful, confident, and seen—while setting new standards for meaningful, expressive fashion that resonates globally.</p>
              <p className="ft-p">We’re here to redefine what modern elegance really looks like—less polished perfection, more real, confident, and unapologetic self-expression. blntco is about making people feel seen and powerful in what they wear, without the pressure to fit into anyone else’s idea of style. We believe fashion should actually mean something—easy to wear, expressive, and true to you. Our vision is to build a brand that connects with people everywhere, setting a new standard where comfort, confidence, and individuality just come naturally.</p>
            </section>
          </div>

          {/* COLLECTIONS SECTION */}
          <div className="ft-text-section">
            <div className="ft-section-label">Collections</div>
            <div className="ft-section-title">Bonkers Corner</div>
          </div>

          <div className="ft-bottom">
            © {new Date().getFullYear()} Blunt<sup>®</sup> — blntco. Blunt Confidence. Effortless Elegance.
          </div>
        </div>
      </footer>

    </AppContext.Provider>
  );
};

const App = () => {
  return <AppContent />;
};

export default App;



