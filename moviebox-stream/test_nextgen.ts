import axios from 'axios';

async function testNextgen() {
  const url = 'https://nextgencloudfabric.com/embed/movie/550';
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://vidsrc.pm/'
      }
    });
    console.log('Status:', res.status, 'HTML length:', res.data.length);
    const html = res.data;
    const m3u8s = html.match(/https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*/gi) || [];
    const iframes = html.match(/<iframe[^>]+src=["']([^"']+)["']/gi) || [];
    console.log('m3u8s:', m3u8s);
    console.log('iframes:', iframes);
    const inlineScripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
    console.log('Inline scripts count:', inlineScripts.length);
    for (let i = 0; i < inlineScripts.length; i++) {
      console.log(`--- Script ${i} ---`);
      console.log(inlineScripts[i].slice(0, 400));
    }
  } catch (e: any) {
    console.log('Error:', e.message);
  }
}

testNextgen();
