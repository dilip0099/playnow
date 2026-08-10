import axios from 'axios';

async function inspectHtml() {
  const tmdbId = '550';
  const urls = [
    `https://vidsrc.in/embed/movie/${tmdbId}`,
    `https://vidsrc.pm/embed/movie/${tmdbId}`,
    `https://vidsrc.xyz/embed/movie/${tmdbId}`,
  ];

  for (const url of urls) {
    try {
      console.log('=== Inspecting:', url);
      const res = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': url
        }
      });
      const html = res.data;
      console.log('HTML length:', html.length);
      const iframes = html.match(/<iframe[^>]+>/gi);
      console.log('Iframes:', iframes);
      const scripts = html.match(/<script[^>]*src=["']([^"']+)["']/gi);
      console.log('Script srcs:', scripts);
      
      // Look for any links or endpoints in script content
      const inlineScripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
      for (const s of inlineScripts) {
        if (s.includes('src') || s.includes('player') || s.includes('fetch') || s.includes('http')) {
          console.log('Script snippet:', s.slice(0, 300));
        }
      }
    } catch (e: any) {
      console.log('Error:', e.message);
    }
  }
}

inspectHtml();
