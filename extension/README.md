# Forge Clipper (Chrome Extension)

Clip ideas from anywhere — tweets, articles, LinkedIn/Reddit posts, YouTube videos, any selection —
straight into your Forge **Idea Bank**, with a **note** and **tags**. The UI is **injected into the
page** (a selection toolbar + a floating button), so it feels embedded rather than a detached popup.
Works offline: clips queue locally and sync the moment your Forge backend is running.

## Install (unpacked, local dev)

1. Start the Forge backend: `python -m uvicorn backend.main:app --reload --port 8000`
2. Open `chrome://extensions` → toggle **Developer mode** (top-right) ON
3. Click **Load unpacked** → select this `extension/` folder
4. (Optional) Pin the **Forge Clipper** icon to the toolbar

> No custom icon is bundled, so Chrome shows its default puzzle-piece icon — expected.
> Already-open tabs need a refresh after install so the in-page widget loads.

## How to clip

- **Highlight text** → a small **"⚡ Clip / ✎ Note"** toolbar appears at the selection.
  - **⚡ Clip** saves it instantly. **✎ Note** opens the panel pre-filled to add a note + tags.
- **Floating ⚡ button** (bottom-right) → opens the clip panel for the whole page.
- **Toolbar icon** → toggles the clip panel on the current page.
- **Right-click** → "Clip selection / page to Forge".
- **Keyboard** → `Alt+Shift+S` clips the current selection instantly.

Captures land in the Idea Bank as `source: clip`, tagged by platform
(twitter / linkedin / youtube / reddit / article / web), with your note + tags. Re-clipping the same
thing updates it instead of duplicating.

## Offline queue

If Forge isn't running when you clip, the clip is stored in the extension and the icon shows a
**pending count**. It retries every minute and on startup. Nothing is ever lost.

## Notes

- The widget does **not** appear on `localhost` pages (so it stays out of the Forge app itself) or
  inside iframes.
- To point at a hosted backend later, update `host_permissions` + the `DEFAULT_API` in `background.js`.

## Files

- `manifest.json` — MV3 config + permissions
- `content.js` — the injected in-page widget (Shadow DOM): selection toolbar, button, panel, extractors
- `background.js` — offline queue + sync, context menus, keyboard command, icon routing
