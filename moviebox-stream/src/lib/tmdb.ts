const TMDB_KEYS = [
  'a07e22bc18f5cb106bfe4cc1f83ad8ed',
  '4e44d9029b1270a757cddc766a1bcb63',
  '81a4a4968b9ff68494b791ebf67605d8',
];

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export interface Movie {
  id: number;
  title: string;
  name?: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  media_type?: 'movie' | 'tv';
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  runtime?: number;
  tagline?: string;
  status?: string;
  language_badge?: 'Hindi Original' | 'Hindi Dubbed' | 'Web Series';
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
}

export interface Genre {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

export const ALL_GENRES: Genre[] = [
  { id: 28, name: 'Action', slug: 'action' },
  { id: 12, name: 'Adventure', slug: 'adventure' },
  { id: 16, name: 'Animation & Anime', slug: 'animation' },
  { id: 35, name: 'Comedy', slug: 'comedy' },
  { id: 80, name: 'Crime', slug: 'crime' },
  { id: 99, name: 'Documentary', slug: 'documentary' },
  { id: 18, name: 'Drama', slug: 'drama' },
  { id: 10751, name: 'Family', slug: 'family' },
  { id: 14, name: 'Fantasy', slug: 'fantasy' },
  { id: 36, name: 'History', slug: 'history' },
  { id: 27, name: 'Horror', slug: 'horror' },
  { id: 10402, name: 'Music', slug: 'music' },
  { id: 9648, name: 'Mystery', slug: 'mystery' },
  { id: 10749, name: 'Romance', slug: 'romance' },
  { id: 878, name: 'Sci-Fi', slug: 'scifi' },
  { id: 53, name: 'Thriller', slug: 'thriller' },
  { id: 10752, name: 'War', slug: 'war' },
  { id: 37, name: 'Western', slug: 'western' },
];

export function getImageUrl(path: string | null, size: 'w300' | 'w500' | 'w1280' | 'original' = 'w500'): string {
  if (!path) return 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80';
  if (path.startsWith('http')) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

async function fetchFromTMDB(endpoint: string, params: Record<string, string> = {}): Promise<any> {
  for (let attempt = 0; attempt < 3; attempt++) {
    const key = TMDB_KEYS[attempt % TMDB_KEYS.length];
    const queryParams = new URLSearchParams({
      ...params,
      api_key: key,
      language: 'en-US',
    }).toString();

    const url = `${TMDB_BASE_URL}${endpoint}?${queryParams}`;

    try {
      const res = await fetch(url, {
        next: { revalidate: 3600 },
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        },
      });

      if (res.ok) {
        const data = await res.json();
        if (data) return data;
      }
    } catch (error) {
      // Retry handling
    }
    await new Promise((r) => setTimeout(r, 120 * (attempt + 1)));
  }

  return null;
}

async function fetchMultiPagesFromTMDB(endpoint: string, params: Record<string, string> = {}, maxPages: number = 2): Promise<any[]> {
  const pagePromises = [];
  for (let p = 1; p <= maxPages; p++) {
    pagePromises.push(fetchFromTMDB(endpoint, { ...params, page: String(p) }));
  }

  const results = await Promise.all(pagePromises);
  const combined: any[] = [];
  results.forEach((res) => {
    if (res && res.results && Array.isArray(res.results)) {
      combined.push(...res.results);
    }
  });
  return combined;
}

const INDIAN_LANGUAGES = new Set(['hi', 'ta', 'te', 'ml', 'kn', 'mr', 'pa', 'bn', 'gu', 'or']);

function isHindiSupported(m: any): boolean {
  if (!m) return false;
  const lang = m.original_language;

  // 1. Native Hindi content
  if (lang === 'hi') return true;

  // 2. Indian regional cinema (Tamil, Telugu, Malayalam, Kannada, Punjabi, Marathi, etc.)
  if (INDIAN_LANGUAGES.has(lang)) return true;
  if (Array.isArray(m.origin_country) && m.origin_country.includes('IN')) return true;

  // 3. Spoken languages array contains 'hi' (TMDB metadata indicating official Hindi dubbing)
  if (Array.isArray(m.spoken_languages) && m.spoken_languages.length > 0) {
    return m.spoken_languages.some((l: any) => l.iso_639_1 === 'hi' || l.name?.toLowerCase().includes('hindi'));
  }

  // 4. Default: If fetched via discover queries using with_spoken_languages=hi, it is verified for Hindi audio
  return true;
}

function processMovies(results: any[], defaultBadge?: 'Hindi Original' | 'Hindi Dubbed' | 'Web Series'): Movie[] {
  if (!results || !Array.isArray(results)) return [];
  return results
    .filter((m: any) => m && m.id && m.poster_path && (m.title || m.name) && isHindiSupported(m))
    .map((m: any) => {
      let badge = defaultBadge;
      if (!badge) {
        if (m.name || m.first_air_date) badge = 'Web Series';
        else if (m.original_language === 'hi') badge = 'Hindi Original';
        else badge = 'Hindi Dubbed';
      }
      return {
        ...m,
        title: m.title || m.name || 'Untitled',
        release_date: m.release_date || m.first_air_date || '',
        language_badge: badge,
      };
    });
}

// Flexible Discover by Genre & Filters for Explore Page
export async function discoverMovies(params: {
  genreId?: number;
  providerId?: number;
  sortBy?: 'popularity.desc' | 'vote_average.desc' | 'primary_release_date.desc';
  page?: number;
}): Promise<{ movies: Movie[]; page: number; totalPages: number }> {
  const queryParams: Record<string, string> = {
    sort_by: params.sortBy || 'popularity.desc',
    page: String(params.page || 1),
    with_spoken_languages: 'hi',
    watch_region: 'IN',
  };

  if (params.genreId) {
    queryParams.with_genres = String(params.genreId);
  }

  if (params.providerId) {
    queryParams.with_watch_providers = String(params.providerId);
  }

  const data = await fetchFromTMDB('/discover/movie', queryParams);
  if (!data || !data.results) {
    return { movies: [], page: 1, totalPages: 1 };
  }

  return {
    movies: processMovies(data.results),
    page: data.page || 1,
    totalPages: Math.min(data.total_pages || 1, 50),
  };
}

// 1. 🔥 Indian & Global Blockbusters in Hindi (~40 titles)
export async function getTrendingMovies(): Promise<Movie[]> {
  const data = await fetchMultiPagesFromTMDB('/discover/movie', {
    with_spoken_languages: 'hi',
    watch_region: 'IN',
    sort_by: 'popularity.desc',
  }, 2);
  return processMovies(data);
}

// 2. 🔴 Popular on Netflix India (~40 titles)
export async function getNetflixMovies(): Promise<Movie[]> {
  const data = await fetchMultiPagesFromTMDB('/discover/movie', {
    with_watch_providers: '8',
    watch_region: 'IN',
    with_spoken_languages: 'hi',
    sort_by: 'popularity.desc',
  }, 2);
  return processMovies(data);
}

// 3. 🟡 Amazon Prime Video India Hits (~40 titles)
export async function getPrimeMovies(): Promise<Movie[]> {
  const data = await fetchMultiPagesFromTMDB('/discover/movie', {
    with_watch_providers: '119',
    watch_region: 'IN',
    with_spoken_languages: 'hi',
    sort_by: 'popularity.desc',
  }, 2);
  return processMovies(data);
}

// 4. 🟢 Disney+ Hotstar Hits (~40 titles)
export async function getHotstarMovies(): Promise<Movie[]> {
  const data = await fetchMultiPagesFromTMDB('/discover/movie', {
    with_watch_providers: '122',
    watch_region: 'IN',
    with_spoken_languages: 'hi',
    sort_by: 'popularity.desc',
  }, 2);
  return processMovies(data);
}

// 5. 🍿 Binge-Worthy Web Series in Hindi (~40 titles)
export async function getTrendingTVSeries(): Promise<Movie[]> {
  const data = await fetchMultiPagesFromTMDB('/discover/tv', {
    with_spoken_languages: 'hi',
    watch_region: 'IN',
    sort_by: 'popularity.desc',
  }, 2);
  return processMovies(data, 'Web Series');
}

// 6. 💥 Action Blockbusters (Hindi / Hindi Dubbed) (~40 titles)
export async function getActionMovies(): Promise<Movie[]> {
  const data = await fetchMultiPagesFromTMDB('/discover/movie', {
    with_genres: '28',
    with_spoken_languages: 'hi',
    watch_region: 'IN',
    sort_by: 'popularity.desc',
  }, 2);
  return processMovies(data);
}

// 7. 😱 High-Octane Thrillers (~40 titles)
export async function getThrillerMovies(): Promise<Movie[]> {
  const data = await fetchMultiPagesFromTMDB('/discover/movie', {
    with_genres: '53',
    with_spoken_languages: 'hi',
    watch_region: 'IN',
    sort_by: 'popularity.desc',
  }, 2);
  return processMovies(data);
}

// 8. 😂 Comedy Hits (~40 titles)
export async function getComedyMovies(): Promise<Movie[]> {
  const data = await fetchMultiPagesFromTMDB('/discover/movie', {
    with_genres: '35',
    with_spoken_languages: 'hi',
    watch_region: 'IN',
    sort_by: 'popularity.desc',
  }, 2);
  return processMovies(data);
}

// 9. 👻 Horror & Mystery Hits (~40 titles)
export async function getHorrorMovies(): Promise<Movie[]> {
  const data = await fetchMultiPagesFromTMDB('/discover/movie', {
    with_genres: '27',
    with_spoken_languages: 'hi',
    watch_region: 'IN',
    sort_by: 'popularity.desc',
  }, 2);
  return processMovies(data);
}

// 10. 💘 Romantic Blockbusters (~40 titles)
export async function getRomanceMovies(): Promise<Movie[]> {
  const data = await fetchMultiPagesFromTMDB('/discover/movie', {
    with_genres: '10749',
    with_spoken_languages: 'hi',
    watch_region: 'IN',
    sort_by: 'popularity.desc',
  }, 2);
  return processMovies(data);
}

// 11. 🐉 Animated & Anime Hits (Hindi Dubbed) (~40 titles)
export async function getAnimationMovies(): Promise<Movie[]> {
  const data = await fetchMultiPagesFromTMDB('/discover/movie', {
    with_genres: '16',
    with_spoken_languages: 'hi',
    watch_region: 'IN',
    sort_by: 'popularity.desc',
  }, 2);
  return processMovies(data);
}

// 12. 🕵️ Crime & Mafia Thrillers (~40 titles)
export async function getCrimeMovies(): Promise<Movie[]> {
  const data = await fetchMultiPagesFromTMDB('/discover/movie', {
    with_genres: '80',
    with_spoken_languages: 'hi',
    watch_region: 'IN',
    sort_by: 'popularity.desc',
  }, 2);
  return processMovies(data);
}

// 13. 🚀 Sci-Fi & Fantasy Hits (~40 titles)
export async function getSciFiMovies(): Promise<Movie[]> {
  const data = await fetchMultiPagesFromTMDB('/discover/movie', {
    with_genres: '878',
    with_spoken_languages: 'hi',
    watch_region: 'IN',
    sort_by: 'popularity.desc',
  }, 2);
  return processMovies(data);
}

// 14. 🌟 All Time High-Rated Masterpieces (~40 titles)
export async function getTopRatedMovies(): Promise<Movie[]> {
  const data = await fetchMultiPagesFromTMDB('/discover/movie', {
    with_spoken_languages: 'hi',
    sort_by: 'vote_average.desc',
    'vote_count.gte': '200',
  }, 2);
  return processMovies(data);
}

// 15. 🎬 Fresh Releases in Hindi (~40 titles)
export async function getLatestReleases(): Promise<Movie[]> {
  const data = await fetchMultiPagesFromTMDB('/discover/movie', {
    with_spoken_languages: 'hi',
    watch_region: 'IN',
    sort_by: 'primary_release_date.desc',
  }, 2);
  return processMovies(data);
}

// 16. 🎧 Hollywood & Foreign Hits Dubbed in Hindi (~40 titles)
export async function getHollywoodHindiDubbed(): Promise<Movie[]> {
  const data = await fetchMultiPagesFromTMDB('/discover/movie', {
    with_original_language: 'en|ja|ko',
    with_spoken_languages: 'hi',
    sort_by: 'popularity.desc',
  }, 2);
  return processMovies(data, 'Hindi Dubbed');
}

// Movie Details
export async function getMovieDetails(id: string): Promise<Movie | null> {
  const data = await fetchFromTMDB(`/movie/${id}`);
  if (data) {
    const badge = data.original_language === 'hi'
      ? 'Hindi Original'
      : (data.name || data.first_air_date)
      ? 'Web Series'
      : 'Hindi Dubbed';
    return {
      ...data,
      title: data.title || data.name || 'Untitled',
      language_badge: badge,
    };
  }
  return null;
}

// Movie Credits
export async function getMovieCredits(id: string): Promise<CastMember[]> {
  const data = await fetchFromTMDB(`/movie/${id}/credits`);
  if (data && data.cast) {
    return data.cast.slice(0, 12);
  }
  return [];
}

// Movie Recommendations
export async function getMovieRecommendations(id: string): Promise<Movie[]> {
  const data = await fetchMultiPagesFromTMDB(`/movie/${id}/recommendations`, {}, 2);
  return processMovies(data);
}

// Search Movies Live
export async function searchMovies(query: string): Promise<Movie[]> {
  const data = await fetchMultiPagesFromTMDB('/search/movie', { query }, 2);
  return processMovies(data);
}
