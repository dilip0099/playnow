import axios from 'axios';

const TMDB_API_KEY = '8428364e637299a9a3b63290b39e6a00';

async function testDynamicTMDB() {
  const endpoints = [
    'https://api.themoviedb.org/3',
    'https://tmdb.api.000.workers.dev/3',
  ];

  for (const base of endpoints) {
    try {
      console.log(`\nTesting endpoint: ${base}`);
      const res = await axios.get(`${base}/discover/movie`, {
        params: {
          api_key: TMDB_API_KEY,
          with_origin_country: 'IN',
          sort_by: 'popularity.desc',
          page: 1,
        },
        timeout: 5000,
      });

      console.log(`Success! Found ${res.data.results?.length} movies.`);
      res.data.results?.slice(0, 5).forEach((m: any) => {
        console.log(` - [${m.id}] ${m.title} (${m.original_language}) - Popularity: ${m.popularity}`);
      });
      return;
    } catch (e: any) {
      console.log(`Failed for ${base}: ${e.message}`);
    }
  }
}

testDynamicTMDB();
