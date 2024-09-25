import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, setDoc, increment } from 'firebase/firestore';

const INITIAL_CREDITS = 500; // Set the initial credit amount for new users

export async function getUserCredits(userId: string): Promise<number> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  return userSnap.data()?.credits || 0;
}

export async function deductCredits(userId: string, amount: number): Promise<void> {
  const userRef = doc(db, 'users', userId);

  // First, check if the user has unlimited credits
  const userSnap = await getDoc(userRef);
  const hasUnlimitedCredits = userSnap.data()?.hasUnlimitedCredits || false;

  if (hasUnlimitedCredits) {
    // If user has unlimited credits, no need to deduct
    return;
  }

  // Check if user has enough credits
  const currentCredits = userSnap.data()?.credits || 0;
  if (currentCredits < amount) {
    throw new Error('Not enough credits to perform this action');
  }

  // Deduct the credits
  await updateDoc(userRef, {
    credits: increment(-amount)
  });
}

export async function addCredits(userId: string, amount: number): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    credits: increment(amount)
  });
}

export async function hasEnoughCredits(userId: string, amount: number): Promise<boolean> {
  const credits = await getUserCredits(userId);
  return credits >= amount;
}

export async function setUnlimitedCredits(userId: string, isUnlimited: boolean): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    hasUnlimitedCredits: isUnlimited
  });
}

export async function checkUnlimitedCredits(userId: string): Promise<boolean> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  return userSnap.data()?.hasUnlimitedCredits || false;
}

export async function initializeUserCredits(userId: string): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  // Check if the user already has credits initialized
  if (!userSnap.exists() || !userSnap.data()?.credits) {
    // Initialize credits and other user properties
    await setDoc(userRef, {
      credits: INITIAL_CREDITS,
      hasUnlimitedCredits: false
    }, { merge: true });
  }
}

export async function processCredits(userId: string, amount: number): Promise<void> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  const userData = userSnap.data();

  if (!userData) {
    throw new Error('User data not found');
  }

  if (userData.hasUnlimitedCredits) {
    // If user has unlimited credits, no need to deduct
    return;
  }

  if (userData.credits < amount) {
    throw new Error('Not enough credits to perform this action');
  }

  // Deduct the credits
  await updateDoc(userRef, {
    credits: increment(-amount)
  });
}