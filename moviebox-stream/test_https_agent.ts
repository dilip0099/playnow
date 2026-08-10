import axios from 'axios';
import https from 'https';

async function testHttpsAgent() {
  const agent = new https.Agent({
    rejectUnauthorized: false,
    keepAlive: true,
  });

  const TMDB_API_KEY = '8428364e637299a9a3b63290b39e6a00';

  const urls = [
    'https://api.themoviedb.org/3/discover/movie?api_key=' + TMDB_API_KEY + '&with_origin_country=IN&sort_by=popularity.desc',
    'https://api.tmdb.org/3/discover/movie?api_key=' + TMDB_API_KEY + '&with_origin_country=IN&sort_by=popularity.desc',
  ];

  for (const url of urls) {
    try {
      console.log('Testing:', url);
      const res = await axios.get(url, {
        httpsAgent: agent,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': 'application/json',
        },
        timeout: 5000,
      });
      console.log('Success! Found:', res.data.results?.length);
      res.data.results?.slice(0, 5).forEach((m: any) => console.log(' -', m.title, `(${m.original_language})`));
      return;
    } catch (e: any) {
      console.log('Failed:', e.message);
    }
  }
}

testHttpsAgent();
