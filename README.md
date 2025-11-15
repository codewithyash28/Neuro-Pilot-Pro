# NeuroPilot Pro

Advanced voice-driven browser assistant with optional PC automation.

![NeuroPilot Pro Logo](icons/icon128.png)

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

## License
This project is licensed under the MIT License. See `LICENSE.txt`.

## Hackathon demo video guide
- Total length: 60–90 seconds
- Key features to show:
  1. Voice command: "Open YouTube" → NeuroPilot opens YouTube in a new tab.
  2. AI summary: Open a webpage → press "Summarize" → overlay shows 6 bullet points + 1-line TL;DR.
  3. Local bridge: "Open Notepad" or "Open Comet" via extension → AHK opens app on PC.
- Tips:
  - Use OBS Studio (free) to record screen and microphone.
  - Keep narration simple: explain each feature as it happens.
  - Show Options page briefly to demonstrate API key and local bridge setup.
  - End with your logo on screen and project name.
