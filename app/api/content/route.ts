import { NextRequest, NextResponse } from 'next/server';
import Database from "@replit/database";

const db = new Database();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page');

  if (!page || !['terms', 'privacy', 'aup', 'rdp'].includes(page)) {
    return NextResponse.json({ error: 'Invalid page' }, { status: 400 });
  }

  try {
    const content = await db.get(page);
    console.log(`Retrieved content for ${page}:`, content);
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error reading from database:', error);
    return NextResponse.json({ error: 'Failed to read content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { page, content } = await request.json();

  if (!page || !['terms', 'privacy', 'aup', 'rdp'].includes(page)) {
    return NextResponse.json({ error: 'Invalid page' }, { status: 400 });
  }

  try {
    await db.set(page, content);
    console.log(`Updated content for ${page}:`, content);
    return NextResponse.json({ message: 'Content updated successfully' });
  } catch (error) {
    console.error('Error writing to database:', error);
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}