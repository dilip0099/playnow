import axios from 'axios';

async function printVsdec() {
  const res = await axios.get('https://cloudorchestranova.com/embed/iframe_player/assets/vsdec.js?v=1786252743');
  console.log(res.data);
}

printVsdec();
