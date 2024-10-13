import { NextResponse } from 'next/server';
import { getFirestore } from 'firebase/firestore';
import { doc, getDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

export async function GET(req: Request) {
  try {
    // Assuming the user ID is available in the request context
    // This depends on how you've set up authentication in your root layout
    // You might need to adjust this based on your specific implementation
    const userId = req.headers.get('X-User-Id');

    if (!userId) {
      return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
    }

    // Initialize Firestore
    const db = getFirestore(app);

    // Fetch the user's billing information from Firestore
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userData = userDocSnap.data();
    const billingInfo = {
      plan: userData.plan || 'Free',
      status: userData.subscriptionStatus || 'Inactive',
      renewalDate: userData.renewalDate ? new Date(userData.renewalDate.seconds * 1000).toISOString() : 'N/A',
      credits: userData.credits || 0
    };

    return NextResponse.json(billingInfo);
  } catch (error) {
    console.error('Error fetching billing info:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}