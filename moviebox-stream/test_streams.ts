import axios from 'axios';

async function explore() {
  const tmdbId = '550';
  
  // Test 1: VidSrc.me iframe follow
  try {
    console.log('--- Testing VidSrc.me ---');
    const vidsrcRes = await axios.get(`https://vidsrc.me/embed/movie?tmdb=${tmdbId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://vidsrc.me/'
      }
    });
    const iframeMatch = vidsrcRes.data.match(/iframe[^>]+src=["']([^"']+)["']/i);
    if (iframeMatch) {
      let iframeUrl = iframeMatch[1];
      if (iframeUrl.startsWith('//')) iframeUrl = 'https:' + iframeUrl;
      console.log('VidSrc Iframe URL:', iframeUrl);
      const subRes = await axios.get(iframeUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`
        }
      });
      console.log('Sub response status:', subRes.status, 'length:', subRes.data.length);
      const m3u8s = subRes.data.match(/https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*/gi) || [];
      const scripts = subRes.data.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
      console.log('m3u8 count:', m3u8s.length, 'scripts count:', scripts.length);
      if (m3u8s.length) console.log('m3u8 found:', m3u8s[0]);
    }
  } catch (e: any) {
    console.log('VidSrc.me error:', e.message);
  }

  // Test 2: Multiembed
  try {
    console.log('--- Testing Multiembed ---');
    const multiRes = await axios.get(`https://multiembed.mov/directstream.php?video_id=${tmdbId}&tmdb=1`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      }
    });
    console.log('Multiembed status:', multiRes.status);
    const m3u8s = multiRes.data.match(/https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*/gi) || [];
    console.log('Multiembed m3u8 count:', m3u8s.length);
    if (m3u8s.length) console.log('Multiembed m3u8:', m3u8s[0]);
  } catch (e: any) {
    console.log('Multiembed error:', e.message);
  }

  // Test 3: VidSrc.to / VidSrc.net / VidSrc.cc / Superembed / 2embed
  const list = [
    `https://vidsrc.net/embed/movie/${tmdbId}`,
    `https://vidsrc.in/embed/movie/${tmdbId}`,
    `https://vidsrc.pm/embed/movie/${tmdbId}`,
    `https://vidsrc.io/embed/movie/${tmdbId}`,
    `https://vidsrc.vip/embed/movie/${tmdbId}`,
    `https://2embed.org/embed/movie/${tmdbId}`,
    `https://www.2embed.skin/embed/movie/${tmdbId}`,
    `https://movie-web-api.vercel.app/api/stream?tmdb=${tmdbId}`,
    `https://vidsrc-api.vercel.app/api/stream?id=${tmdbId}`,
    `https://vidsrc-embed.vercel.app/api/stream?tmdb=${tmdbId}`,
    `https://vidsrc.stream/embed/movie/${tmdbId}`,
    `https://embed.su/api/e/${tmdbId}`,
    `https://api.vidsrc.icu/movie/${tmdbId}`,
  ];

  for (const url of list) {
    try {
      const res = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        timeout: 4000
      });
      const str = typeof res.data === 'string' ? res.data : JSON.stringify(res.data);
      const m3u8s = str.match(/https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*/gi) || [];
      console.log(`[${url}] status: ${res.status} | m3u8s: ${m3u8s.length}`);
      if (m3u8s.length) console.log('  Found:', m3u8s[0]);
    } catch (e: any) {
      console.log(`[${url}] error: ${e.message}`);
    }
  }
}

explore();
