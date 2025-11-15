# NeuroPilot Pro

Advanced voice-driven browser assistant with optional PC automation.

## What you get
- Chrome extension (NeuroPilot Pro) with:
  - Voice commands in popup (Web Speech API)
  - AI-powered page summarization using OpenAI (set API key in Options)
  - Options page to store OpenAI key and local bridge URL
  - Content overlay showing AI summaries
- Local bridge to run AutoHotkey actions (optional)
  - `local_bridge/local_server.py`
  - `local_bridge/actions.ahk`
  - `local_bridge/start_local.bat`

## How to install the extension (for testing)
1. Unzip `NeuroPilot_Pro.zip`.
2. Open Chrome/Edge/Brave and go to `chrome://extensions`.
3. Enable Developer mode (top-right).
4. Click "Load unpacked" and select the `NeuroPilot_Pro` folder.
5. Open the extension popup and click Options → paste your OpenAI API key (no key = AI disabled).
6. (Optional) If you want PC control, run the local bridge:
   - Install AutoHotkey (Windows) and Python 3.
   - Put `actions.ahk` in the same `local_bridge` folder.
   - Run `local_bridge/start_local.bat` (or run `python local_bridge/local_server.py`).
   - In Options, set Local Bridge URL to `http://localhost:5000`.
7. Try it: open a web article, click the extension popup and press Summarize (AI).

## Security notes
- Keep your OpenAI key private. Chrome's `chrome.storage.sync` encrypts for your profile but do not share exported data.
- The local bridge must be run only on your machine. Do not open the port to the internet.
- The local bridge launches programs via AutoHotkey; check `actions.ahk` before running.

## Hackathon tips
- For the demo: record a short video and have a live demo fallback.
- Highlight: safety (confirmation before local actions) and integration (voice + AI + native control).
- Include a one-page architecture diagram.

## Need help?
I can:
- Add a settings UI to store per-action confirmations.
- Create a packaged installer for the local bridge.
- Make a demo video script.

