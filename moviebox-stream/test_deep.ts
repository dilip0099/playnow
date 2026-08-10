import axios from 'axios';

async function testDeep() {
  const tmdbId = '550';

  // 1. Test vsembed.ru
  try {
    console.log('--- Testing vsembed.ru ---');
    const res = await axios.get(`https://vsembed.ru/embed/movie/${tmdbId}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://vidsrc.in/'
      }
    });
    console.log('vsembed status:', res.status, 'HTML length:', res.data.length);
    const html = res.data;
    const m3u8s = html.match(/https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*/gi) || [];
    const iframes = html.match(/<iframe[^>]+src=["']([^"']+)["']/gi) || [];
    console.log('m3u8s:', m3u8s);
    console.log('iframes:', iframes);
    const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
    for (const s of scripts) {
      if (s.includes('file') || s.includes('sources') || s.includes('hls') || s.includes('m3u8') || s.includes('eval')) {
        console.log('vsembed script snippet:', s.slice(0, 300));
      }
    }
  } catch (e: any) {
    console.log('vsembed error:', e.message);
  }

  // 2. Test player.autoembed.co
  try {
    console.log('--- Testing player.autoembed.co ---');
    const res = await axios.get(`https://player.autoembed.co/embed/movie/${tmdbId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://autoembed.co/'
      }
    });
    console.log('autoembed status:', res.status, 'length:', res.data.length);
    const html = res.data;
    const m3u8s = html.match(/https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*/gi) || [];
    const iframes = html.match(/<iframe[^>]+src=["']([^"']+)["']/gi) || [];
    console.log('autoembed m3u8s:', m3u8s);
    console.log('autoembed iframes:', iframes);
  } catch (e: any) {
    console.log('autoembed error:', e.message);
  }

  // 3. Test smashystream
  try {
    console.log('--- Testing smashystream ---');
    const res = await axios.get(`https://embed.smashystream.com/playere.php?tmdb=${tmdbId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Referer': 'https://smashystream.com/'
      }
    });
    console.log('smashystream status:', res.status, 'length:', res.data.length);
    const html = res.data;
    const m3u8s = html.match(/https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*/gi) || [];
    const iframes = html.match(/<iframe[^>]+src=["']([^"']+)["']/gi) || [];
    console.log('smashystream m3u8s:', m3u8s);
    console.log('smashystream iframes:', iframes);
  } catch (e: any) {
    console.log('smashystream error:', e.message);
  }
}

testDeep();
