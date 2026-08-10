import axios from 'axios';

const TMDB_API_KEY = '8428364e637299a9a3b63290b39e6a00';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function testIndianMovies() {
  try {
    console.log('--- 1. Discover Hindi Movies (with_original_language=hi) ---');
    const res1 = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        with_original_language: 'hi',
        sort_by: 'popularity.desc',
        page: 1
      }
    });
    console.log(`Found ${res1.data.results?.length} Hindi movies.`);
    res1.data.results?.slice(0, 5).forEach((m: any) => {
      console.log(` - ID: ${m.id} | Title: "${m.title}" | Release: ${m.release_date} | Rating: ${m.vote_average}`);
    });

    console.log('\n--- 2. Discover Indian Movies (with_origin_country=IN) ---');
    const res2 = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        with_origin_country: 'IN',
        sort_by: 'popularity.desc',
        page: 1
      }
    });
    console.log(`Found ${res2.data.results?.length} Indian movies.`);
    res2.data.results?.slice(0, 5).forEach((m: any) => {
      console.log(` - ID: ${m.id} | Title: "${m.title}" | Original Lang: ${m.original_language}`);
    });

    console.log('\n--- 3. Testing TMDB Stream Decrypt for Indian Blockbusters ---');
    const indianIds = [
      { id: 872585, title: 'Jawan' },
      { id: 862552, title: 'Pathaan' },
      { id: 579974, title: 'RRR' },
      { id: 580489, title: 'KGF Chapter 2' },
      { id: 781732, title: 'Animal' },
      { id: 1059064, title: 'Kalki 2898 AD' },
      { id: 360814, title: 'Dangal' },
      { id: 256040, title: 'Baahubali' },
      { id: 940721, title: 'Pushpa 2' }
    ];

    const { resolveMovieStream } = await import('./src/lib/streamResolver');
    for (const item of indianIds) {
      const streamRes = await resolveMovieStream(item.id.toString());
      console.log(`[${item.title} (ID: ${item.id})] -> Stream Status: ${streamRes.isFallback ? 'FALLBACK' : 'LIVE WASM HLS'} | Mirrors: ${streamRes.mirrors.length}`);
    }
  } catch (err: any) {
    console.error('Error:', err.message);
  }
}

testIndianMovies();
