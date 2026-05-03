const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Products data from original HTML
const products = [
  {id:1,name:'Void Heavy Tee',tag:'Graphic · Washed Black',price:1799,cat:'graphic washed',fill:'#111010',tf:'rgba(245,242,235,.85)',g:'VOID',sw:['#111010','#888','#8B3320'],badge:'new',desc:'280gsm garment washed black. Dropped shoulders, block print chest graphic. The foundational Blunt piece.'},
  {id:2,name:'Chalk Boxy Tee',tag:'Blank · Ecru',price:1649,cat:'blank washed',fill:'#E8E3D8',tf:'rgba(13,13,13,.4)',g:'blank',sw:['#E8E3D8','#C8BB98'],badge:'low',desc:'Triple washed ecru. No graphic, no noise. Boxy cut that ages with you. Our quietest piece.'},
  {id:3,name:'Rust Signal Tee',tag:'Graphic · Brick Red',price:1899,cat:'graphic',fill:'#8B3320',tf:'rgba(245,242,235,.85)',g:'SIG',sw:['#8B3320','#5a2010'],badge:'drop',desc:'Brick red 280gsm. Circle block print front. Most unapologetic colourway in the lineup.'},
  {id:4,name:'Grey Matter Tee',tag:'Collab · Slate',price:1749,cat:'collab washed',fill:'#888',tf:'rgba(245,242,235,.75)',g:'GRM',sw:['#888','#555','#ccc'],badge:'col',desc:'Heather slate washed three times. Collab graphic on the back. The one you wear every day.'},
  {id:5,name:'Bone Dry Tee',tag:'Blank · Sand Washed',price:1649,cat:'blank washed',fill:'#C8BB98',tf:'rgba(13,13,13,.38)',g:'blank',sw:['#C8BB98','#a89878'],badge:'',desc:'Sand washed bone. Sun-bleached spirit. Ages into something personal.'},
  {id:6,name:'Moss Field Tee',tag:'Graphic · Forest',price:1849,cat:'graphic',fill:'#1a2a20',tf:'rgba(245,242,235,.5)',g:'MOS',sw:['#1a2a20'],badge:'sold',desc:'Dark forest green. Limited run — all 60 pieces gone. Restocking Q3 2025.'},
  {id:7,name:'Dusk Pigment Tee',tag:'Graphic · Pigment Dyed',price:1999,cat:'graphic washed',fill:'#3d3060',tf:'rgba(245,242,235,.7)',g:'DSK',sw:['#3d3060','#2a1f45'],badge:'new',desc:'Pigment dyed dusk purple. Every piece fades differently — yours is one of a kind.'},
  {id:8,name:'Latte Oversized Tee',tag:'Blank · Warm Taupe',price:1699,cat:'blank',fill:'#b5a090',tf:'rgba(13,13,13,.38)',g:'blank',sw:['#b5a090','#8a7060'],badge:'',desc:'Warm taupe blank. Wide body, long back hem. The blank that does the work.'},
  {id:9,name:'Ink Stamp Tee',tag:'Graphic · Washed Black',price:1849,cat:'graphic washed',fill:'#111010',tf:'rgba(245,242,235,.85)',g:'INK',sw:['#111010','#3d3060'],badge:'',desc:'Heavy black. Rubber stamp graphic across the back. Understated front, loud behind.'},
];

// Suggestions data from original HTML
const sugData = [
  {q:'void',l:'Void Heavy Tee',s:'Washed Black · ₹1,799'},
  {q:'chalk',l:'Chalk Boxy Tee',s:'Ecru · ₹1,649'},
  {q:'rust',l:'Rust Signal Tee',s:'Brick Red · ₹1,899'},
  {q:'black',l:'Black Tees',s:'3 styles'},
  {q:'oversized',l:'Oversized Boxy Fit',s:'All products'},
  {q:'washed',l:'Garment Washed',s:'6 styles'},
  {q:'graphic',l:'Graphic Tees',s:'5 styles'},
  {q:'blank',l:'Blank Tees',s:'3 styles'},
  {q:'dusk',l:'Dusk Pigment Tee',s:'Pigment Dyed · ₹1,999'},
  {q:'latte',l:'Latte Oversized Tee',s:'Warm Taupe · ₹1,699'},
  {q:'grey',l:'Grey Matter Tee',s:'Slate · ₹1,749'},
  {q:'ink',l:'Ink Stamp Tee',s:'Washed Black · ₹1,849'},
  {q:'280',l:'280gsm Heavy Tees',s:'All heavyweight styles'},
  {q:'pigment',l:'Dusk Pigment Tee',s:'Pigment Dyed · ₹1,999'},
];

// In-memory cart (for demo)
let cartItems = [];

// API Routes
app.get('/api/products', (req, res) => {
  const { category, search, priceMax } = req.query;
  let filtered = [...products];

  // Category filter
  if (category && category !== 'all') {
    filtered = filtered.filter(p => 
      p.cat.includes(category) || (category === 'instock' && p.badge !== 'sold')
    );
  }

  // Search filter (client-side originally, keep simple)
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => 
      (p.name + p.tag + p.desc + p.g).toLowerCase().includes(q)
    );
  }

  // Price filter
  if (priceMax) {
    filtered = filtered.filter(p => p.price <= parseInt(priceMax));
  }

  res.json(filtered);
});

app.get('/api/suggestions', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  
  const matches = sugData
    .filter(s => (s.l + s.q).toLowerCase().includes(q.toLowerCase()))
    .slice(0, 7);
  res.json(matches);
});

app.post('/api/cart/add', (req, res) => {
  const { productId, size, color } = req.body;
  const product = products.find(p => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const existingItem = cartItems.find(item => item.productId === productId && item.size === size && item.color === color);
  if (existingItem) {
    existingItem.qty = (existingItem.qty || 1) + 1;
  } else {
    cartItems.push({ 
      id: Date.now(), 
      productId, 
      size, 
      color: color || product.fill,
      qty: 1,
      name: product.name,
      price: product.price,
      tag: product.tag,
      fill: color || product.fill,
      g: product.g,
      tf: product.tf
    });
  }
  res.json({ success: true, items: cartItems, total: cartItems.length });
});

app.post('/api/cart/update', (req, res) => {
  const { id, qty } = req.body;
  const item = cartItems.find(item => item.id === id);
  if (item) {
    item.qty = Math.max(1, qty);
    res.json({ success: true, items: cartItems });
  } else {
    res.status(404).json({ error: 'Item not found' });
  }
});

app.post('/api/cart/remove', (req, res) => {
  const { id } = req.body;
  cartItems = cartItems.filter(item => item.id !== id);
  res.json({ success: true, items: cartItems });
});

app.get('/api/cart', (req, res) => {
  res.json({ items: cartItems, count: cartItems.length });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints ready: /api/products, /api/suggestions, /api/cart`);
});

