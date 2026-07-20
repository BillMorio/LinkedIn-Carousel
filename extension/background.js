// Forge Clipper — background service worker
// Owns the offline capture queue + sync to the Forge API, and routes the toolbar icon /
// context menu / keyboard shortcut to the injected in-page widget (content.js).

const DEFAULT_API = "http://localhost:8000";

// ---------- settings / storage ----------
async function getApiBase() {
  const { apiBase } = await chrome.storage.local.get("apiBase");
  return apiBase || DEFAULT_API;
}
async function getQueue() {
  const { queue } = await chrome.storage.local.get("queue");
  return Array.isArray(queue) ? queue : [];
}
async function setQueue(q) {
  await chrome.storage.local.set({ queue: q });
  updateBadge(q.length);
}
function updateBadge(n) {
  chrome.action.setBadgeText({ text: n ? String(n) : "" });
  chrome.action.setBadgeBackgroundColor({ color: "#BFFF00" });
}
async function refreshBadge() {
  updateBadge((await getQueue()).length);
}

// ---------- queue + sync ----------
async function enqueue(capture) {
  const q = await getQueue();
  q.push({ ...capture, _ts: Date.now() });
  await setQueue(q);
}

let flushing = false;
async function flushQueue() {
  if (flushing) return { synced: 0, pending: (await getQueue()).length };
  flushing = true;
  try {
    const api = await getApiBase();
    const q = await getQueue();
    const remaining = [];
    for (const item of q) {
      try {
        const { _ts, ...payload } = item;
        const res = await fetch(`${api}/api/captures`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("http " + res.status);
      } catch (e) {
        remaining.push(item); // keep for retry (backend likely offline)
      }
    }
    await setQueue(remaining);
    return { synced: q.length - remaining.length, pending: remaining.length };
  } finally {
    flushing = false;
  }
}

// ---------- route triggers to the in-page widget ----------
function tellTab(tabId, msg) {
  if (!tabId) return;
  chrome.tabs.sendMessage(tabId, msg, () => void chrome.runtime.lastError); // ignore "no receiver"
}

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({ id: "clip-selection", title: "Clip selection to Forge", contexts: ["selection"] });
  chrome.contextMenus.create({ id: "clip-page", title: "Clip this page to Forge", contexts: ["page", "link", "image"] });
  chrome.alarms.create("forge-flush", { periodInMinutes: 1 });
  refreshBadge();
});

chrome.runtime.onStartup.addListener(() => { refreshBadge(); flushQueue(); });
chrome.alarms.onAlarm.addListener((a) => { if (a.name === "forge-flush") flushQueue(); });

chrome.action.onClicked.addListener((tab) => tellTab(tab?.id, { type: "togglePanel" }));

chrome.contextMenus.onClicked.addListener((info, tab) => {
  const mode = info.menuItemId === "clip-selection" ? "selection" : "page";
  tellTab(tab?.id, { type: "doClip", mode });
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command !== "clip-selection") return;
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  tellTab(tab?.id, { type: "doClip", mode: "selection" });
});

// ---------- messages from the content widget ----------
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    try {
      if (msg.type === "capture") {
        await enqueue(msg.payload);
        const r = await flushQueue();
        sendResponse({ ok: true, ...r });
      } else if (msg.type === "getStatus") {
        sendResponse({ pending: (await getQueue()).length, apiBase: await getApiBase() });
      } else if (msg.type === "flush") {
        sendResponse(await flushQueue());
      } else if (msg.type === "setApiBase") {
        await chrome.storage.local.set({ apiBase: msg.apiBase || DEFAULT_API });
        sendResponse({ ok: true });
      }
    } catch (e) {
      sendResponse({ ok: false, error: String(e) });
    }
  })();
  return true; // async sendResponse
});
