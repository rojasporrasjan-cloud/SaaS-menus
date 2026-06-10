const admin = require('firebase-admin');
const serviceAccount = require('../key.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

async function main() {
  try {
    const listUsersResult = await admin.auth().listUsers(100);
    if (listUsersResult.users.length === 0) {
      console.log('No users found in Firebase Auth.');
      return;
    }
    console.log('Found users:');
    for (const userRecord of listUsersResult.users) {
      console.log(`- ${userRecord.email} (UID: ${userRecord.uid})`);
      await admin.auth().setCustomUserClaims(userRecord.uid, { tenantId: 'soda-la-rustica' });
      console.log(`  ✓ Set custom claim tenantId: "soda-la-rustica"`);
    }
    console.log('Successfully set claims for all users!');
  } catch (e) {
    console.error('Error setting user claims:', e.message);
  }
}

main();
