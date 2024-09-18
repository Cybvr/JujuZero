import { NextResponse } from 'next/server';
import { addCredits } from '@/lib/credits';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';

export async function POST(request: Request) {
  const { inviterUid, inviteeEmail } = await request.json();

  if (!inviterUid || !inviteeEmail) {
    return NextResponse.json({ error: 'Inviter UID and invitee email are required' }, { status: 400 });
  }

  try {
    // Check if the invitee is already a user
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', inviteeEmail));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Update inviter's invited friends list
    const inviterRef = doc(db, 'users', inviterUid);
    await updateDoc(inviterRef, {
      invitedFriends: arrayUnion(inviteeEmail)
    });

    // Here you would typically send an email invitation
    // For this example, we'll just assume the email is sent

    // We don't add credits here. Credits are added when the invitee signs up.

    return NextResponse.json({ success: true, message: 'Invitation sent successfully' });
  } catch (error) {
    console.error('Error processing invitation:', error);
    return NextResponse.json({ error: 'Failed to process invitation' }, { status: 500 });
  }
}

// New function to handle when an invited user signs up
export async function PUT(request: Request) {
  const { inviterEmail, newUserUid } = await request.json();

  if (!inviterEmail || !newUserUid) {
    return NextResponse.json({ error: 'Inviter email and new user UID are required' }, { status: 400 });
  }

  try {
    // Find the inviter
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', inviterEmail));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return NextResponse.json({ error: 'Inviter not found' }, { status: 404 });
    }

    const inviterDoc = querySnapshot.docs[0];
    const inviterUid = inviterDoc.id;

    // Add credits to inviter
    await addCredits(inviterUid, 200);

    // Add credits to new user
    await addCredits(newUserUid, 200);

    return NextResponse.json({ success: true, message: 'Referral credits added successfully' });
  } catch (error) {
    console.error('Error processing referral credits:', error);
    return NextResponse.json({ error: 'Failed to process referral credits' }, { status: 500 });
  }
}