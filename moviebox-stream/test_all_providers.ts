import axios from 'axios';

async function testAll() {
  const tmdbId = '550';
  const endpoints = [
    // Embed & API endpoints
    `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`,
    `https://vidsrc.in/embed/movie/${tmdbId}`,
    `https://vidsrc.pm/embed/movie/${tmdbId}`,
    `https://vidsrc.xyz/embed/movie/${tmdbId}`,
    `https://vidsrc.net/embed/movie/${tmdbId}`,
    `https://vidsrc.cc/v2/embed/movie/${tmdbId}`,
    `https://vidsrc.pro/embed/movie/${tmdbId}`,
    `https://vidsrc.vip/embed/movie/${tmdbId}`,
    `https://vidsrc.dev/embed/movie/${tmdbId}`,
    `https://vidsrc2.to/embed/movie/${tmdbId}`,
    `https://2embed.cc/embed/${tmdbId}`,
    `https://www.2embed.skin/embed/movie/${tmdbId}`,
    `https://autoembed.co/movie/tmdb/${tmdbId}`,
    `https://autoembed.to/movie/${tmdbId}`,
    `https://autoembed.cc/embed/movie/${tmdbId}`,
    `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}`,
    `https://smashystream.com/embed/movie/${tmdbId}`,
    `https://vidbinge.dev/embed/movie/${tmdbId}`,
    `https://vidlink.pro/movie/${tmdbId}`,
    `https://embed.su/embed/movie/${tmdbId}`,
    `https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1`,
    `https://moviesapi.club/movie/${tmdbId}`,
    `https://frembed.pro/api/film.php?id=${tmdbId}`,
    `https://rivestream.org/embed?type=movie&id=${tmdbId}`,
    `https://player.vidsrc.nl/embed/movie/${tmdbId}`,
    `https://vidsrc.stream/embed/movie/${tmdbId}`,
    `https://dbgo.fun/movie.php?id=${tmdbId}`,
    `https://api.vidsrc.io/v1/movie/${tmdbId}`,
  ];

  console.log(`Testing ${endpoints.length} providers for TMDB ${tmdbId}...`);

  for (const url of endpoints) {
    try {
      const res = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': url,
          'Accept': '*/*',
        },
        timeout: 4000,
        maxRedirects: 5,
      });
      const data = res.data;
      const str = typeof data === 'string' ? data : JSON.stringify(data);
      const m3u8s = str.match(/https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*/gi) || [];
      const mp4s = str.match(/https?:\/\/[^\s"'<>]+\.mp4[^\s"'<>]*/gi) || [];
      const iframes = str.match(/<iframe[^>]+src=["']([^"']+)["']/gi) || [];
      console.log(`[OK] ${url}`);
      console.log(`   m3u8s: ${m3u8s.length} | mp4s: ${mp4s.length} | iframes: ${iframes.length} | length: ${str.length}`);
      if (m3u8s.length) console.log(`   --> m3u8: ${m3u8s[0]}`);
      if (mp4s.length) console.log(`   --> mp4: ${mp4s[0]}`);
      if (iframes.length) console.log(`   --> iframe: ${iframes[0]}`);
    } catch (e: any) {
      console.log(`[ERR] ${url} -> ${e.message}`);
    }
  }
}

testAll();
