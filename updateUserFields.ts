import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, FieldValue } from 'firebase-admin/firestore';

// Initialize Firebase Admin SDK if it hasn't been initialized yet
if (getApps().length === 0) {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();

async function updateAllUsers() {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.get();

  const batch = db.batch();
  let updatedCount = 0;

  snapshot.forEach((doc) => {
    const userData = doc.data();
    const updates: {
      hasUnlimitedCredits: boolean;
      updatedAt: any;
      avatar?: string;
      uid?: string;
    } = {
      hasUnlimitedCredits: false,
      updatedAt: FieldValue.serverTimestamp()
    };

    if (!userData.avatar) {
      updates.avatar = ''; // Or set a default avatar URL
    }

    if (!userData.uid) {
      updates.uid = doc.id;
    }

    batch.update(usersRef.doc(doc.id), updates);
    updatedCount++;
  });

  if (updatedCount > 0) {
    await batch.commit();
    console.log(`Updated ${updatedCount} user documents.`);
  } else {
    console.log('No documents needed updating.');
  }
}

updateAllUsers().catch(console.error);