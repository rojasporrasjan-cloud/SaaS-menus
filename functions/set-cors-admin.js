const admin = require('firebase-admin');
const serviceAccount = require('../key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function main() {
  const buckets = ['soda-la-rustica.firebasestorage.app', 'soda-la-rustica.appspot.com'];
  for (const b of buckets) {
    try {
      const bucket = admin.storage().bucket(b);
      await bucket.setCorsConfiguration([
        {
          origin: ['*'],
          method: ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS'],
          maxAgeSeconds: 3600,
          responseHeader: [
            'Content-Type',
            'Authorization',
            'Content-Length',
            'X-Requested-With',
            'x-goog-resumable',
            'x-firebase-storage-version'
          ]
        }
      ]);
      console.log('Successfully set CORS on', b);
    } catch (e) {
      console.error('Error on', b, e.message);
    }
  }
}

main();
