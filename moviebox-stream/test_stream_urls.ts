import axios from 'axios';

async function testStreamUrls() {
  const url = 'https://data.vidsrcme.ru/api.php?type=movie&tmdb=550&stream_urls';
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://cloudorchestranova.com/'
      }
    });
    console.log('Status:', res.status);
    console.log('Response data:', JSON.stringify(res.data, null, 2));
  } catch (e: any) {
    console.log('Error:', e.message);
  }
}

testStreamUrls();
