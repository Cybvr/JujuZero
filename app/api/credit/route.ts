import { NextResponse } from 'next/server';
import { getUserCredits, deductCredits, addCredits } from '@/lib/credits';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const credits = await getUserCredits(userId);
    return NextResponse.json({ credits });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch credits' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId, amount, action } = await request.json();

  if (!userId || !amount || !action) {
    return NextResponse.json({ error: 'User ID, amount, and action are required' }, { status: 400 });
  }

  try {
    if (action === 'deduct') {
      await deductCredits(userId, amount);
    } else if (action === 'add') {
      await addCredits(userId, amount);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update credits' }, { status: 500 });
  }
}