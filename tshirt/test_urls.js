const https = require('https');

const urls = [
  'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9',
  'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a',
  'https://images.unsplash.com/photo-1562157873-818bc0726f68',
  'https://images.unsplash.com/photo-1581655353564-df123a1eb820',
  'https://images.unsplash.com/photo-1503341455253-b2e723bb3db8',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c',
  'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1',
  'https://images.unsplash.com/photo-1489980557514-251d61e3eeb6',
  'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
  'https://images.unsplash.com/photo-1556821840-3a63f95609a7', // man in hoodie/shirt
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f', // fashion model
];

async function check() {
  for (const u of urls) {
    await new Promise(res => {
      https.get(u + '?q=80&w=600&auto=format&fit=crop', response => {
        console.log(u, response.statusCode);
        res();
      });
    });
  }
}
check();
