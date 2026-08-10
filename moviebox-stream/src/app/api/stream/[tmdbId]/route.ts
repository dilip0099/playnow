import { NextResponse } from 'next/server';
import { resolveMovieStream, getFallbackStream } from '@/lib/streamResolver';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tmdbId: string }> }
) {
  const { tmdbId } = await params;

  if (!tmdbId) {
    return NextResponse.json(
      { success: false, error: 'TMDB ID is required' },
      { status: 400 }
    );
  }

  try {
    const streamData = await resolveMovieStream(tmdbId);
    return NextResponse.json({
      success: true,
      tmdbId,
      ...streamData,
    });
  } catch (error: any) {
    console.error(`Error resolving stream for TMDB ${tmdbId}:`, error.message);
    
    // Provide robust fallback sample streams so the application ALWAYS plays smoothly
    const fallbackStream = getFallbackStream(tmdbId);
    return NextResponse.json({
      success: true,
      tmdbId,
      isFallback: true,
      ...fallbackStream,
    });
  }
}
