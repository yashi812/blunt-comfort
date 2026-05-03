import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { tee } from '../utils';

const Home = () => {
  const featured = [
    { id: 1, name: 'Void Heavy Tee', fill: '#111010', g: 'VOID', tf: 'rgba(245,242,235,.85)', price: 1799 },
    { id: 3, name: 'Rust Signal Tee', fill: '#8B3320', g: 'SIG', tf: 'rgba(245,242,235,.85)', price: 1899 },
    { id: 2, name: 'Chalk Boxy Tee', fill: '#E8E3D8', g: 'blank', tf: 'rgba(13,13,13,.4)', price: 1649 },
  ];

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-ttl">Unapologetic<br/>Comfort.</h1>
            <p className="hero-sub">Foundational heavyweight tees for the minimalist wardrobe. 280gsm cotton, boxy fit, built to last.</p>
            <Link to="/shop" className="hero-cta">
              Enter Studio <ArrowRight size={18} style={{ marginLeft: '8px' }} />
            </Link>
          </motion.div>
        </div>
        <div className="hero-img-wrap">
          <motion.img 
            src="/blunt_hero_bg_1777821224928.png" 
            alt="Blunt Heavy Tee" 
            className="hero-img"
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2 }}
          />
        </div>
      </section>

      {/* TICKER */}
      <div className="ticker">
        <div className="ticker-inner">
          {[...Array(6)].map((_, i) => (
            <span key={i}>GARMENT WASHED · 280GSM HEAVYWEIGHT · BOXY UNISEX FIT · 100% COTTON · </span>
          ))}
        </div>
      </div>

      {/* FEATURED SECTION */}
      <section className="featured">
        <div className="f-head">
          <h2 className="f-ttl">The Core Collection</h2>
          <Link to="/shop" className="f-lnk">View All Products</Link>
        </div>
        <div className="f-grid">
          {featured.map((p, i) => (
            <motion.div 
              key={p.id} 
              className="f-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="f-card-img" style={{ background: p.fill + '10' }}>
                {tee(p.fill, p.g, p.tf)}
              </div>
              <div className="f-card-info">
                <div className="f-card-name">{p.name}</div>
                <div className="f-card-price">₹{p.price.toLocaleString('en-IN')}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="ft-top">
          <div className="ft-logo">Blunt<sup>®</sup></div>
          <div className="ft-links">
            <div className="ft-col">
              <div className="ft-ttl">Studio</div>
              <Link to="/shop">Shop All</Link>
              <a href="#">Drops</a>
              <a href="#">Story</a>
            </div>
            <div className="ft-col">
              <div className="ft-ttl">Social</div>
              <a href="#">Instagram</a>
              <a href="#">Twitter</a>
            </div>
          </div>
        </div>
        <div className="ft-bot">
          <span>© 2024 Blunt Studio. Built for comfort.</span>
          <span>Terms · Privacy</span>
        </div>
      </footer>
    </div>
  );
};

export default Home;
