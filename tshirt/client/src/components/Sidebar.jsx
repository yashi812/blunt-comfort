import React, { useContext } from 'react';
import { AppContext } from '../App';

const Sidebar = () => {
  const { filters, setFilters, priceMax, setPriceMax } = useContext(AppContext);

  const toggleFilter = (type, value) => {
    setFilters(prev => ({
      ...prev,
      [type]: prev[type] === value ? null : value
    }));
  };

  const clearFilters = () => {
    setFilters({ activeCat: 'all' });
    setPriceMax(2499);
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
          <input 
            className="p-slider" 
            type="range" 
            min="999" 
            max="2499" 
            value={priceMax} 
            onChange={(e) => setPriceMax(parseInt(e.target.value))}
          />
          <div className="p-vals">
            <span>₹999</span>
            <span>₹{priceMax.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      <div className="sb-sec">
        <div className="sb-ttl">Fit</div>
        {['Oversized Boxy', 'Relaxed', 'Longline'].map(fit => (
          <div key={fit} className="sb-opt" onClick={() => toggleFilter('fit', fit)}>
            <span className={`sb-opt-l ${filters.fit === fit ? 'on' : ''}`}>{fit}</span>
          </div>
        ))}
      </div>

      <div className="sb-sec">
        <div className="sb-ttl">Weight</div>
        {['280gsm Heavy', '220gsm Mid'].map(weight => (
          <div key={weight} className="sb-opt" onClick={() => toggleFilter('weight', weight)}>
            <span className={`sb-opt-l ${filters.weight === weight ? 'on' : ''}`}>{weight}</span>
          </div>
        ))}
      </div>

      <button className="sb-clr" onClick={clearFilters}>Clear all filters</button>
    </aside>
  );
};

export default Sidebar;
