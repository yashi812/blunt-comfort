import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, ShoppingBag, X } from 'lucide-react';
import { AppContext } from '../App';

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

const SearchBox = ({ onSearch, onFocus }) => {
  const [query, setQuery] = useState('');
  const [showSugg, setShowSugg] = useState(false);
  const suggestions = useSuggestions(query);

  useEffect(() => {
    onSearch(query);
  }, [query, onSearch]);

  return (
    <div className="search-wrap">
      <div className="s-icon">
        <Search size={14} color="#9C9488" />
      </div>
      <input
        className="search-box"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSugg(true);
        }}
        onFocus={() => {
          setShowSugg(true);
          onFocus?.();
        }}
        onBlur={() => setTimeout(() => setShowSugg(false), 200)}
        placeholder="Search tees, colours, fits…"
        autoComplete="off"
        spellCheck={false}
      />
      <button 
        className={`s-clear ${query ? 'vis' : ''}`} 
        onClick={() => {setQuery(''); setShowSugg(false);}}
      >
        <X size={12} />
      </button>
      
      <div className={`sugg ${showSugg && suggestions.length ? 'open' : ''}`}>
        <div style={{ padding: '.4rem 0' }}>
          <div className="sug-lbl">Suggestions</div>
          {suggestions.map((s) => (
            <div 
              key={s.q} 
              className="sug-item" 
              onClick={() => {
                setQuery(s.q); 
                setShowSugg(false);
              }}
            >
              <div className="sug-ico">
                <Search size={13} color="#9C9488" />
              </div>
              <div>
                <div 
                  className="sug-txt" 
                  dangerouslySetInnerHTML={{
                    __html: s.l.replace(new RegExp(query, 'gi'), '<em>$&</em>')
                  }} 
                />
                <div className="sug-sub">{s.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Header = () => {
  const { setSearchQuery, cartCount, setIsDemoActive, setIsCartOpen } = useContext(AppContext);
  const location = useLocation();
  const isShop = location.pathname === '/shop';

  return (
    <nav>
      <Link to="/" className="nav-logo" style={{ textDecoration: 'none' }}>
        Blunt<sup>®</sup>
      </Link>
      
      {isShop ? (
        <SearchBox 
          onSearch={setSearchQuery} 
          onFocus={() => setIsDemoActive(false)} 
        />
      ) : (
        <div style={{ flex: 1 }}></div>
      )}

      <div className="nav-right">
        <Link className={`nav-lnk ${isShop ? 'on' : ''}`} to="/shop">Shop</Link>
        <a className="nav-lnk" href="#">Drops</a>
        <a className="nav-lnk" href="#">Story</a>
        <button className="bag-btn" onClick={() => setIsCartOpen(true)}>
          <ShoppingBag size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} />
          Bag ({cartCount})
        </button>
      </div>
    </nav>
  );
};

export default Header;
