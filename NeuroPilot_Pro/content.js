// content.js - page helpers and AI overlay for NeuroPilot Pro
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  if (msg.type === 'extract_and_summarize_ai') {
    const text = extractVisibleText();
    // call background to perform AI summarize
    chrome.runtime.sendMessage({type:'ai_summarize', text}, (resp) => {
      if (resp && resp.status === 'ok') {
        showOverlay(resp.summary);
      } else {
        showOverlay('Error: ' + (resp && resp.message ? resp.message : 'unknown'));
      }
    });
    sendResponse({status:'ok'});
  } else if (msg.type === 'scroll') {
    if (msg.dir === 'down') window.scrollBy({top: window.innerHeight * 0.8, behavior: 'smooth'});
    if (msg.dir === 'up') window.scrollBy({top: -window.innerHeight * 0.8, behavior: 'smooth'});
  }
});

function extractVisibleText() {
  const article = document.querySelector('article');
  if (article) return article.innerText;
  const main = document.querySelector('main');
  if (main) return main.innerText;
  return document.body.innerText.slice(0, 20000);
}

function showOverlay(summary) {
  const existing = document.getElementById('neuropilot-overlay');
  if (existing) existing.remove();
  const div = document.createElement('div');
  div.id = 'neuropilot-overlay';
  div.style.position = 'fixed';
  div.style.right = '12px';
  div.style.bottom = '12px';
  div.style.maxWidth = '420px';
  div.style.zIndex = 2147483647;
  div.style.background = 'white';
  div.style.border = '1px solid #ccc';
  div.style.boxShadow = '0 6px 18px rgba(0,0,0,0.12)';
  div.style.padding = '12px';
  div.style.borderRadius = '8px';
  div.innerHTML = '<strong>NeuroPilot AI Summary</strong><div style="margin-top:8px;white-space:pre-wrap;">' + escapeHtml(summary) + '</div>';
  const close = document.createElement('button');
  close.textContent = 'Close';
  close.style.display = 'block';
  close.style.marginTop = '8px';
  close.onclick = () => div.remove();
  div.appendChild(close);
  document.body.appendChild(div);
}

function escapeHtml(s){ return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
