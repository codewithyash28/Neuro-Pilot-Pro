// background.js - NeuroPilot Pro
// Handles incoming requests from popup/content and calls OpenAI when needed.
// NOTE: You must set your OpenAI API key in the extension Options page.

async function getApiKey() {
  return new Promise((resolve) => {
    chrome.storage.sync.get(['openai_api_key'], (items) => {
      resolve(items.openai_api_key || null);
    });
  });
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "summarize_page",
    title: "NeuroPilot Pro: Summarize page (AI)",
    contexts: ["page"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "summarize_page") {
    chrome.tabs.sendMessage(tab.id, {type: "extract_and_summarize_ai"});
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'open_url') {
    chrome.tabs.create({ url: msg.url }, () => sendResponse({status: 'ok'}));
    return true;
  } else if (msg.type === 'search') {
    const q = encodeURIComponent(msg.query);
    const url = 'https://www.google.com/search?q=' + q;
    chrome.tabs.create({ url }, () => sendResponse({status: 'ok'}));
    return true;
  } else if (msg.type === 'ai_summarize') {
    (async () => {
      const apiKey = await getApiKey();
      if (!apiKey) {
        sendResponse({status:'error', message:'OpenAI API key not set. Go to Options.'});
        return;
      }
      try {
        const prompt = `Summarize the following webpage text into 6 bullet points and one short 1-line TL;DR:\n\n${msg.text.slice(0,20000)}`;
        const body = {
          model: "gpt-4o-mini",
          messages: [{role:"user", content: prompt}],
          max_tokens: 300
        };
        const res = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + apiKey
          },
          body: JSON.stringify(body)
        });
        if (!res.ok) {
          const t = await res.text();
          sendResponse({status:'error', message: 'OpenAI error: ' + t});
          return;
        }
        const data = await res.json();
        const text = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || 'No summary returned.';
        sendResponse({status:'ok', summary: text});
      } catch (e) {
        sendResponse({status:'error', message: String(e)});
      }
    })();
    return true; // will call sendResponse asynchronously
  } else if (msg.type === 'notify') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon48.png',
      title: 'NeuroPilot Pro',
      message: msg.message
    });
    sendResponse({status: 'ok'});
  } else if (msg.type === 'local_action') {
    // Forward to localhost bridge for AutoHotkey if the user set a bridge url in options
    (async () => {
      chrome.storage.sync.get(['local_bridge_url'], async (items) => {
        const url = items.local_bridge_url;
        if (!url) {
          sendResponse({status:'error', message:'Local bridge URL not set in Options.'});
          return;
        }
        try {
          const r = await fetch(url + '/run?action=' + encodeURIComponent(msg.action), {method:'GET'});
          const txt = await r.text();
          sendResponse({status:'ok', body: txt});
        } catch (e) {
          sendResponse({status:'error', message: String(e)});
        }
      });
    })();
    return true;
  }
});
