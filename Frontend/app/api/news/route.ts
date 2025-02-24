import { getNewsData } from '@/lib/mongodb';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const data = await getNewsData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
} 