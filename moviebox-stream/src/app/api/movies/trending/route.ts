import { NextResponse } from 'next/server';
import { getTrendingMovies } from '@/lib/tmdb';

export async function GET() {
  try {
    const movies = await getTrendingMovies();
    return NextResponse.json({ success: true, movies });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch trending movies' },
      { status: 500 }
    );
  }
}
