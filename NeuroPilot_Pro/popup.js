// popup.js - improved for NeuroPilot Pro
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const optionsBtn = document.getElementById('optionsBtn');
const statusDiv = document.getElementById('status');
const textInput = document.getElementById('textInput');
const runText = document.getElementById('runText');
const summarizeBtn = document.getElementById('summarize');
const localOpenBtn = document.getElementById('localOpen');
const log = document.getElementById('log');

let recognition;
if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
  statusDiv.textContent = 'Voice not supported in this browser.';
  startBtn.disabled = true;
} else {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    statusDiv.textContent = 'Listening...';
    startBtn.disabled = true;
    stopBtn.disabled = false;
  };
  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript.trim();
    log.textContent = 'Heard: ' + text;
    handleCommand(text);
  };
  recognition.onend = () => {
    statusDiv.textContent = 'Press ▶️ and say a command';
    startBtn.disabled = false;
    stopBtn.disabled = true;
  };
  recognition.onerror = (e) => {
    statusDiv.textContent = 'Error: ' + e.error;
    startBtn.disabled = false;
    stopBtn.disabled = true;
  };
}

startBtn.addEventListener('click', () => recognition && recognition.start());
stopBtn.addEventListener('click', () => recognition && recognition.stop());
optionsBtn.addEventListener('click', () => chrome.runtime.openOptionsPage());

runText.addEventListener('click', () => {
  const t = textInput.value.trim();
  if (!t) return;
  log.textContent = 'Command: ' + t;
  handleCommand(t);
});

summarizeBtn.addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  chrome.tabs.sendMessage(tab.id, {type: 'extract_and_summarize_ai'}, (resp) => {
    // response handled in content script overlay
  });
});

localOpenBtn.addEventListener('click', async () => {
  const site = prompt('Open which site in Comet (e.g. youtube.com)?');
  if (!site) return;
  const url = site.startsWith('http') ? site : 'https://' + site;
  // Attempt to use local bridge to open in specific browser (user must configure)
  chrome.storage.sync.get(['local_bridge_url'], (items) => {
    const bridge = items.local_bridge_url;
    if (!bridge) {
      alert('Local bridge not set. Set it in Options.');
      return;
    }
    fetch(bridge + '/run?action=open_url&url=' + encodeURIComponent(url))
      .then(r=>r.text()).then(t => alert('Bridge response: ' + t))
      .catch(e => alert('Bridge error: ' + e));
  });
});

function handleCommand(text) {
  const lower = text.toLowerCase();
  if (lower.startsWith('open ')) {
    const site = lower.slice(5).trim();
    const url = mapSiteToUrl(site);
    if (url) sendOpenUrl(url);
    else if (isLikelyUrl(site)) sendOpenUrl(normalizeUrl(site));
    else sendSearch(text);
  } else if (lower.startsWith('search ')) {
    sendSearch(text.slice(7).trim());
  } else if (lower.includes('new tab') || lower === 'open new tab') {
    chrome.runtime.sendMessage({type: 'open_url', url: 'chrome://newtab'});
  } else if (lower.includes('close tab')) {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) chrome.tabs.remove(tabs[0].id);
    });
  } else if (lower.includes('summarize')) {
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
      if (tabs[0]) chrome.tabs.sendMessage(tabs[0].id, {type:'extract_and_summarize_ai'});
    });
  } else if (lower.includes('open in comet')) {
    // try local bridge
    const site = lower.replace('open in comet','').trim();
    const url = isLikelyUrl(site) ? normalizeUrl(site) : 'https://www.'+site+'.com';
    chrome.runtime.sendMessage({type:'local_action', action: 'open_url:' + url}, (resp) => {
      if (resp && resp.status === 'ok') alert('Sent to bridge.');
      else alert('Bridge not configured or error: ' + JSON.stringify(resp));
    });
  } else {
    sendSearch(text);
  }
}

function mapSiteToUrl(site) {
  const map = {
    'youtube': 'https://www.youtube.com',
    'google': 'https://www.google.com',
    'gmail': 'https://mail.google.com',
    'github': 'https://github.com',
    'comet': 'https://www.perplexity.ai'
  };
  for (const k in map) {
    if (site.includes(k)) return map[k];
  }
  return null;
}
function isLikelyUrl(s) {
  return s.includes('.') || s.startsWith('http');
}
function normalizeUrl(s) {
  if (s.startsWith('http')) return s;
  return 'https://' + s;
}
function sendOpenUrl(url) {
  chrome.runtime.sendMessage({type:'open_url', url});
  chrome.runtime.sendMessage({type:'notify', message: 'Opening: ' + url});
}
function sendSearch(q) {
  chrome.runtime.sendMessage({type:'search', query: q});
}
