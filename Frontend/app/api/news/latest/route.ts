import { NextResponse } from 'next/server';
import { getNewsData } from '@/lib/mongodb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const since = searchParams.get('since');

  try {
    const latestNews = await getNewsData(since ? new Date(since) : undefined);
    return NextResponse.json(latestNews);
  } catch (error) {
    console.error('Error fetching latest news:', error);
    return NextResponse.json({ error: 'Failed to fetch news' }, { status: 500 });
  }
} 