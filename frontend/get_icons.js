const https = require('https');

const apps = {
  "makemytrip.com": "com.makemytrip",
  "goibibo.com": "com.goibibo",
  "oyorooms.com": "com.oyo.consumer",
  "yatra.com": "com.yatra.base",
  "redbus.in": "in.redbus.android",
  "irctc.co.in": "cris.org.in.prs.ima",
  "olacabs.com": "com.olacabs.customer",
  "uber.com": "com.ubercab"
};

async function fetchIcon(id) {
  return new Promise((resolve) => {
    https.get(`https://play.google.com/store/apps/details?id=${id}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/https:\/\/play-lh\.googleusercontent\.com\/[^"]*/);
        resolve(match ? match[0] : null);
      });
    });
  });
}

async function run() {
  for (const [domain, id] of Object.entries(apps)) {
    const url = await fetchIcon(id);
    console.log(`"${domain}": "${url}=s256",`);
  }
}
run();
