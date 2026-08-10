import axios from 'axios';

async function testPlayerUrl() {
  const metaUrl = 'https://data.vidsrcme.ru/api.php?type=movie&tmdb=550';
  const playerUrl = 'https://cloudorchestranova.com/embed/player/movie/550?vs=QFlolHc-65EHEnyrRqseW2x2s9XLWjZ0CeEFEtLR90axKx_6q2NmYrdI-rmTG8jayRJFN-WIgfCiNqn-eDVQHZeDKNZUeMHvzgNE0cTI38_ZQlzZ4w';

  try {
    console.log('--- Testing Meta URL ---');
    const res1 = await axios.get(metaUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://cloudorchestranova.com/' }
    });
    console.log('Meta status:', res1.status, 'data:', res1.data);
  } catch (e: any) {
    console.log('Meta error:', e.message);
  }

  try {
    console.log('--- Testing Player URL ---');
    const res2 = await axios.get(playerUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Referer': 'https://cloudorchestranova.com/' }
    });
    console.log('Player status:', res2.status, 'length:', res2.data.length);
    const html = res2.data;
    const m3u8s = html.match(/https?:\/\/[^\s"'<>]+\.m3u8[^\s"'<>]*/gi) || [];
    console.log('m3u8s:', m3u8s);
    const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
    for (let i = 0; i < scripts.length; i++) {
      console.log(`--- Player Script ${i} ---`);
      console.log(scripts[i].slice(0, 600));
    }
  } catch (e: any) {
    console.log('Player error:', e.message);
  }
}

testPlayerUrl();
