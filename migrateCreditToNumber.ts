const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function migrateCreditsToNumber() {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.get();

  const batch = db.batch();
  let updatedCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  snapshot.forEach((doc: any) => {
    const userData = doc.data();
    console.log(`Processing user ${doc.id}: credits = ${userData.credits} (${typeof userData.credits})`);

    if (typeof userData.credits === 'string') {
      const numericCredits = parseInt(userData.credits, 10);
      if (!isNaN(numericCredits)) {
        const userRef = usersRef.doc(doc.id);
        batch.update(userRef, {
          credits: numericCredits
        });
        updatedCount++;
        console.log(`Updated user ${doc.id}: ${userData.credits} (string) -> ${numericCredits} (number)`);
      } else {
        console.error(`Error converting credits for user ${doc.id}: Invalid number "${userData.credits}"`);
        errorCount++;
      }
    } else if (typeof userData.credits === 'number') {
      console.log(`Skipped user ${doc.id}: credits already a number (${userData.credits})`);
      skippedCount++;
    } else if (userData.credits === undefined) {
      console.log(`Skipped user ${doc.id}: credits field is undefined`);
      skippedCount++;
    } else {
      console.error(`Unexpected credits type for user ${doc.id}: ${typeof userData.credits}`);
      errorCount++;
    }
  });

  if (updatedCount > 0) {
    await batch.commit();
    console.log(`Migration completed. Updated ${updatedCount} out of ${snapshot.size} documents.`);
  } else {
    console.log('No documents needed updating.');
  }

  console.log(`Skipped ${skippedCount} documents (already numbers or undefined).`);

  if (errorCount > 0) {
    console.log(`Encountered errors in ${errorCount} documents. Please check the logs above.`);
  }
}

migrateCreditsToNumber().catch(console.error);