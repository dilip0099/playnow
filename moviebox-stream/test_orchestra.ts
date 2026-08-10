import axios from 'axios';

async function testOrchestra() {
  const url = 'https://cloudorchestranova.com/embed/movie/550?vs=_aWJRUs5gCCN-f1KjujsbalbnjT4gJdk2w2lAa6BV56AKMcNIQWS2d6TZKw9XjVcrTJoqpOJSz2U8hQ6nLVC_lI0JhuQEWnCHw';
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://vsembed.ru/'
      }
    });
    console.log('Status:', res.status, 'Length:', res.data.length);
    const html = res.data;
    const m3u8s = html.match(/https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*/gi) || [];
    console.log('m3u8s:', m3u8s);
    const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
    console.log('Scripts count:', scripts.length);
    for (let i = 0; i < scripts.length; i++) {
      console.log(`--- Script ${i} ---`);
      console.log(scripts[i].slice(0, 500));
    }
  } catch (e: any) {
    console.log('Error:', e.message);
  }
}

testOrchestra();
