import axios from 'axios';

async function fetchScripts() {
  try {
    console.log('Downloading vsdec.js...');
    const res1 = await axios.get('https://cloudorchestranova.com/embed/iframe_player/assets/vsdec.js?v=1786252743', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    console.log('vsdec.js length:', res1.data.length);
    console.log('vsdec.js snippet:', res1.data.slice(0, 800));

    console.log('\nDownloading player.js...');
    const res2 = await axios.get('https://cloudorchestranova.com/embed/iframe_player/assets/player.js?v=1786252743', {
      headers: { 'User-Agent': 'Mozilla/5.0' }
    });
    console.log('player.js length:', res2.data.length);
    // Search for decrypt or stream_urls or m3u8 in player.js
    const str = res2.data;
    const matches = str.match(/(?:decrypt|decode|stream_urls|fetch|m3u8|hls)[^;]{1,100}/gi) || [];
    console.log('player.js matches count:', matches.length);
    console.log('Sample matches:', matches.slice(0, 10));
  } catch (e: any) {
    console.log('Error:', e.message);
  }
}

fetchScripts();
