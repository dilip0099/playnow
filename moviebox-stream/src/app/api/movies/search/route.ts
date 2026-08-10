import { NextResponse } from 'next/server';
import { searchMovies } from '@/lib/tmdb';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || searchParams.get('query') || '';

  if (!query.trim()) {
    return NextResponse.json({ success: true, movies: [] });
  }

  try {
    const movies = await searchMovies(query);
    return NextResponse.json({ success: true, movies });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to search movies' },
      { status: 500 }
    );
  }
}
