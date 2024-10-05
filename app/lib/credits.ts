import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, setDoc, runTransaction } from 'firebase/firestore';

const INITIAL_CREDITS = 500;
const MAX_CREDITS = 500;

export async function getUserCredits(userId: string): Promise<number> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();
  return userData?.hasUnlimitedCredits ? Infinity : (userData?.credits || 0);
}

export async function deductCredits(userId: string, amount: number): Promise<void> {
  try {
    await runTransaction(db, async (transaction) => {
      const userRef = doc(db, 'users', userId);
      const userDoc = await transaction.get(userRef);

      if (!userDoc.exists()) {
        throw new Error('User document does not exist!');
      }

      const userData = userDoc.data();

      if (userData.hasUnlimitedCredits) {
        console.log('User has unlimited credits, no deduction needed');
        return;
      }

      const currentCredits = userData.credits || 0;

      if (currentCredits < amount) {
        throw new Error('Not enough credits to perform this action');
      }

      const newBalance = currentCredits - amount;
      transaction.update(userRef, { credits: newBalance });
      console.log('Credits deducted successfully', { userId, amount, newBalance });
    });
  } catch (error) {
    console.error('Error in deductCredits:', error);
    throw error;
  }
}

export async function addCredits(userId: string, amount: number): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  if (userData?.hasUnlimitedCredits) {
    return; // No need to add credits for users with unlimited credits
  }

  const currentCredits = userData?.credits || 0;
  const newCredits = Math.min(currentCredits + amount, MAX_CREDITS);
  await updateDoc(userRef, { credits: newCredits });
}

export async function hasEnoughCredits(userId: string, amount: number): Promise<boolean> {
  const credits = await getUserCredits(userId);
  return credits === Infinity || credits >= amount;
}

export async function initializeUserCredits(userId: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists() || userSnap.data()?.credits === undefined) {
    await setDoc(userRef, { credits: INITIAL_CREDITS }, { merge: true });
  }
}

export async function setUnlimitedCredits(userId: string, unlimited: boolean): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { hasUnlimitedCredits: unlimited });
}