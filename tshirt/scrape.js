const https = require('https');
const urls = ['https://pin.it/6dGJj374i', 'https://pin.it/4VpTNhMug', 'https://pin.it/1JfurIFJP'];
urls.forEach(url => {
  https.get(url, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      https.get(res.headers.location, (res2) => {
        let data = '';
        res2.on('data', chunk => data += chunk);
        res2.on('end', () => {
          const match = data.match(/<meta property="og:image" name="og:image" content="([^"]+)"/);
          if (match) console.log(match[1]);
        });
      });
    }
  });
});
