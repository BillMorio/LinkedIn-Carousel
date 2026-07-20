// Forge Clipper — injected in-page widget (Shadow DOM)
// Renders a selection toolbar + a floating button + a clip panel directly on the page,
// fully style-isolated so the host site can't break it (and vice-versa).
(() => {
  // Only run in the top frame, and never on local dev apps (Forge itself, etc.)
  if (window.top !== window.self) return;
  if (location.hostname === "localhost" || location.hostname === "127.0.0.1") return;
  if (document.getElementById("forge-clipper-root")) return;

  // ---------- mount + shadow root ----------
  const host = document.createElement("div");
  host.id = "forge-clipper-root";
  host.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:2147483647;";
  (document.documentElement || document.body).appendChild(host);
  const root = host.attachShadow({ mode: "open" });

  const style = document.createElement("style");
  style.textContent = `
    :host { all: initial; }
    * { box-sizing: border-box; font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
    .fc-btn-fab {
      position: fixed; bottom: 22px; right: 22px; width: 44px; height: 44px; border-radius: 50%;
      background: #BFFF00; color: #000; border: none; cursor: pointer; pointer-events: auto;
      font-size: 20px; font-weight: 900; box-shadow: 0 8px 24px rgba(0,0,0,.35); transition: transform .15s;
      display: flex; align-items: center; justify-content: center;
    }
    .fc-btn-fab:hover { transform: scale(1.08); }
    .fc-toolbar {
      position: absolute; pointer-events: auto; display: flex; gap: 2px; padding: 4px;
      background: #0A0A0A; border: 1px solid #2a2a2a; border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,.5);
    }
    .fc-toolbar button {
      background: none; border: none; color: #fff; cursor: pointer; font-size: 12px; font-weight: 800;
      padding: 6px 10px; border-radius: 7px; display: flex; align-items: center; gap: 5px; white-space: nowrap;
    }
    .fc-toolbar button:hover { background: #1c1c1c; }
    .fc-toolbar .fc-clip { color: #BFFF00; }
    .fc-panel {
      position: fixed; bottom: 78px; right: 22px; width: 330px; pointer-events: auto;
      background: #0A0A0A; color: #fff; border: 1px solid #262626; border-radius: 16px;
      box-shadow: 0 20px 50px rgba(0,0,0,.6); padding: 14px; max-height: 80vh; overflow-y: auto;
    }
    .fc-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
    .fc-brand { font-weight: 900; font-size: 13px; letter-spacing: -.02em; }
    .fc-brand .b { color: #BFFF00; }
    .fc-x { background: none; border: none; color: #8a8a8a; cursor: pointer; font-size: 16px; }
    .fc-x:hover { color: #fff; }
    .fc-pill { background: rgba(191,255,0,.1); color: #BFFF00; border: 1px solid rgba(191,255,0,.25);
      font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; padding: 3px 8px; border-radius: 8px; }
    label { display:block; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: .08em; color: #8a8a8a; margin: 9px 0 4px; }
    textarea, input { width: 100%; background: #141414; border: 1px solid #262626; border-radius: 9px; color: #fff;
      padding: 7px 9px; font-size: 12px; outline: none; resize: vertical; font-family: inherit; }
    textarea:focus, input:focus { border-color: rgba(191,255,0,.4); }
    .fc-save { width: 100%; margin-top: 12px; background: #BFFF00; color: #000; border: none; border-radius: 11px;
      padding: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: .08em; font-size: 12px; cursor: pointer; }
    .fc-save:hover { background: #a8e600; }
    .fc-save:disabled { opacity: .5; cursor: not-allowed; }
    .fc-status { margin-top: 8px; font-size: 11px; font-weight: 700; min-height: 14px; }
    .fc-status.ok { color: #BFFF00; } .fc-status.queued { color: #f59e0b; } .fc-status.err { color: #ef4444; }
    .fc-toast {
      position: fixed; bottom: 78px; right: 22px; pointer-events: none;
      background: #0A0A0A; color: #BFFF00; border: 1px solid rgba(191,255,0,.3); border-radius: 10px;
      padding: 9px 14px; font-size: 12px; font-weight: 800; box-shadow: 0 10px 30px rgba(0,0,0,.5);
      opacity: 0; transform: translateY(8px); transition: all .2s;
    }
    .fc-toast.show { opacity: 1; transform: translateY(0); }
    .hidden { display: none !important; }
  `;
  root.appendChild(style);

  // ---------- elements ----------
  const fab = el("button", "fc-btn-fab", "⚡");
  fab.title = "Forge Clipper — clip this page";
  const toolbar = el("div", "fc-toolbar hidden");
  toolbar.innerHTML = `<button class="fc-clip" data-act="clip">⚡ Clip</button><button data-act="note">✎ Note</button>`;
  const toast = el("div", "fc-toast");
  const panel = el("div", "fc-panel hidden");
  panel.innerHTML = `
    <div class="fc-row">
      <span class="fc-brand">FORGE <span class="b">CLIPPER</span></span>
      <button class="fc-x" data-act="close">✕</button>
    </div>
    <div class="fc-row" style="justify-content:flex-start;gap:8px;margin-bottom:6px">
      <span class="fc-pill" id="fc-platform">web</span>
      <span style="color:#8a8a8a;font-size:11px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" id="fc-author"></span>
    </div>
    <label>Title</label><input id="fc-title" type="text" />
    <label>Content</label><textarea id="fc-content" rows="3"></textarea>
    <label>Your note — why you saved it</label><textarea id="fc-note" rows="2" placeholder="e.g. Steal this hook"></textarea>
    <label>Tags — comma separated</label><input id="fc-tags" type="text" placeholder="hooks, carousel" />
    <button class="fc-save" id="fc-save">Clip to Forge</button>
    <div class="fc-status" id="fc-status"></div>
  `;
  root.append(fab, toolbar, toast, panel);

  function el(tag, cls, txt) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (txt) e.textContent = txt;
    return e;
  }
  const $ = (id) => root.getElementById(id);

  // ---------- extraction (platform-aware) ----------
  function meta(n) {
    return document.querySelector(`meta[property="${n}"], meta[name="${n}"]`)?.content || "";
  }
  function extractPage(selectionText) {
    const hostn = location.hostname.replace(/^www\./, "");
    let platform = "web", author = "", media = meta("og:image"),
        title = meta("og:title") || document.title, content = selectionText || "";
    try {
      if (hostn.includes("twitter.com") || hostn.includes("x.com")) {
        platform = "twitter";
        const a = document.querySelector("article");
        if (a) {
          author = a.querySelector('[data-testid="User-Name"]')?.innerText?.split("\n")[0] || "";
          if (!content) content = a.querySelector('[data-testid="tweetText"]')?.innerText || "";
          const img = a.querySelector('[data-testid="tweetPhoto"] img'); if (img) media = img.src;
        }
      } else if (hostn.includes("linkedin.com")) {
        platform = "linkedin";
        author = document.querySelector(".update-components-actor__title, .feed-shared-actor__name")?.innerText || "";
        if (!content) content = document.querySelector(".feed-shared-update-v2 .update-components-text, .update-components-text")?.innerText || "";
      } else if (hostn.includes("youtube.com") || hostn.includes("youtu.be")) {
        platform = "youtube";
        author = document.querySelector("#owner #channel-name a, ytd-channel-name a")?.innerText || "";
        title = document.querySelector("h1.ytd-watch-metadata, h1.title")?.innerText || title;
        if (!content) content = document.querySelector("#description-inline-expander, #description")?.innerText?.slice(0, 1500) || title;
      } else if (hostn.includes("reddit.com")) {
        platform = "reddit";
        author = document.querySelector('a[href^="/user/"]')?.innerText || "";
        if (!content) content = document.querySelector('[data-test-id="post-content"], shreddit-post')?.innerText?.slice(0, 2000) || "";
      } else if (hostn.includes("substack.com") || meta("og:type") === "article") {
        platform = "article";
        author = meta("author") || meta("article:author") || document.querySelector('[rel="author"]')?.innerText || "";
        if (!content) content = selectionText || meta("og:description") || meta("description") || "";
      } else {
        author = meta("author") || "";
        if (!content) content = meta("og:description") || meta("description") || "";
      }
    } catch (e) {}
    return { platform, author, media, title, url: location.href, content: (content || "").trim().slice(0, 5000) };
  }

  function getSelection() {
    const s = window.getSelection ? String(window.getSelection()).trim() : "";
    return s;
  }

  // ---------- capture ----------
  function send(msg) {
    return new Promise((res) => { try { chrome.runtime.sendMessage(msg, res); } catch (e) { res({ ok: false, error: "ctx" }); } });
  }
  async function doCapture(payload, viaPanel) {
    const r = await send({ type: "capture", payload });
    if (viaPanel) {
      const st = $("fc-status");
      if (r?.ok && r.pending === 0) { st.textContent = "✓ Clipped to your Idea Bank"; st.className = "fc-status ok"; setTimeout(closePanel, 900); }
      else if (r?.ok) { st.textContent = `Queued — Forge offline (${r.pending} pending)`; st.className = "fc-status queued"; }
      else { st.textContent = "Failed: " + (r?.error || "?"); st.className = "fc-status err"; }
    } else {
      showToast(r?.ok && r.pending === 0 ? "✓ Clipped to Forge" : r?.ok ? "Queued (Forge offline)" : "Clip failed");
    }
  }
  function payloadFrom(data, note, tags) {
    return {
      content: data.content, url: data.url, title: data.title,
      note: note || null, tags: tags || [],
      platform: data.platform, author_name: data.author || null, media_url: data.media || null,
    };
  }

  let toastTimer;
  function showToast(text) {
    toast.textContent = text; toast.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
  }

  // ---------- panel ----------
  function openPanel(selectionText) {
    const data = extractPage(selectionText);
    panel._data = data;
    $("fc-platform").textContent = data.platform;
    $("fc-author").textContent = data.author || "";
    $("fc-title").value = data.title || "";
    $("fc-content").value = data.content || "";
    $("fc-note").value = "";
    $("fc-tags").value = "";
    $("fc-status").textContent = "";
    panel.classList.remove("hidden");
    $("fc-note").focus();
  }
  function closePanel() { panel.classList.add("hidden"); }

  panel.addEventListener("click", (e) => {
    const act = e.target.getAttribute("data-act");
    if (act === "close") closePanel();
  });
  $("fc-save").addEventListener("click", async () => {
    const data = {
      ...panel._data,
      title: $("fc-title").value.trim(),
      content: $("fc-content").value.trim(),
    };
    const tags = $("fc-tags").value.split(",").map((t) => t.trim()).filter(Boolean);
    $("fc-save").disabled = true;
    await doCapture(payloadFrom(data, $("fc-note").value.trim(), tags), true);
    $("fc-save").disabled = false;
  });

  // ---------- selection toolbar ----------
  function hideToolbar() { toolbar.classList.add("hidden"); }
  function showToolbarAt(rect) {
    // host is position:fixed covering the viewport, so absolute children use viewport coords
    toolbar.style.left = rect.left + rect.width / 2 + "px";
    toolbar.style.top = rect.top - 8 + "px";
    toolbar.style.transform = "translate(-50%, -100%)";
    toolbar.classList.remove("hidden");
  }
  document.addEventListener("mouseup", (e) => {
    // ignore clicks inside our widget
    if (e.composedPath && e.composedPath().includes(host)) return;
    setTimeout(() => {
      const sel = getSelection();
      const selObj = window.getSelection();
      if (sel && sel.length > 1 && selObj && selObj.rangeCount) {
        const rect = selObj.getRangeAt(0).getBoundingClientRect();
        if (rect && rect.width) showToolbarAt(rect);
      } else hideToolbar();
    }, 10);
  });
  document.addEventListener("scroll", hideToolbar, true);
  toolbar.addEventListener("mousedown", (e) => e.preventDefault()); // keep selection
  toolbar.addEventListener("click", (e) => {
    const act = e.target.getAttribute("data-act");
    const sel = getSelection();
    if (act === "clip") { doCapture(payloadFrom(extractPage(sel)), false); hideToolbar(); window.getSelection().removeAllRanges(); }
    else if (act === "note") { openPanel(sel); hideToolbar(); }
  });

  // ---------- fab + messages ----------
  fab.addEventListener("click", () => panel.classList.contains("hidden") ? openPanel("") : closePanel());
  chrome.runtime.onMessage.addListener((msg, s, resp) => {
    if (msg.type === "togglePanel") { panel.classList.contains("hidden") ? openPanel("") : closePanel(); }
    else if (msg.type === "doClip") {
      const sel = getSelection();
      if (msg.mode === "selection" && sel) { doCapture(payloadFrom(extractPage(sel)), false); }
      else openPanel(sel);
    }
    resp && resp({ ok: true });
  });

  // ---------- survive SPA re-renders ----------
  new MutationObserver(() => {
    if (!document.getElementById("forge-clipper-root")) {
      (document.documentElement || document.body).appendChild(host);
    }
  }).observe(document.documentElement, { childList: true });
})();
