const https = require('https');

const query = 'streetwear%20model';
const url = `https://unsplash.com/s/photos/streetwear-model`;

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const regex = /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+[^"&? ]+/g;
    const matches = data.match(regex);
    if (matches) {
      const unique = [...new Set(matches)].filter(u => u.includes('q=')).slice(0, 20);
      console.log(unique);
    } else {
      console.log('No matches found');
      console.log(data.substring(0, 1000));
    }
  });
}).on('error', (e) => {
  console.error(e);
});
