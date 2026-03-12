# FORGE — LinkedIn Content Tool
### Full Product Scope & Architecture Documentation
*Personal tool · Next.js + FastAPI · SQLite · Last updated: March 2026*

---

## Table of Contents
1. [Overview](#1-overview)
2. [Pages & Frontend](#2-pages--frontend)
3. [Backend Routes](#3-backend-routes)
4. [Database Schema](#4-database-schema)
5. [Claude Prompt Architecture](#5-claude-prompt-architecture)
6. [Scraper Architecture](#6-scraper-architecture)
7. [User Flow](#7-user-flow)
8. [Build Order](#8-build-order)
9. [Out of Scope (for now)](#9-out-of-scope-for-now)

---

## 1. Overview

Forge is a personal LinkedIn content creation tool. It covers the full pipeline from ideation to a post or carousel ready to publish — scraping competitor inspiration, generating drafts with Claude using saved writing frameworks, and scheduling content on a calendar.

**Core loop:**
> Scrape ideas → Idea Bank → Editor (Claude generates) → Calendar → Post manually

**Stack:**
- Frontend: Next.js (App Router)
- Backend: FastAPI (Python)
- Database: SQLite (via Prisma or raw SQLAlchemy)
- AI: Anthropic Claude API
- Scraping: Apify

**Non-goals:** No auth, no multi-user, no auto-posting, no analytics — personal tool, keep it lean.

---

## 2. Pages & Frontend

### `/` — Dashboard
The command center. Everything at a glance.

- Week strip showing Mon–Sun with dots on days that have scheduled content and a content type label (Post / Carousel)
- 4 stat cards: posts scheduled this week, ideas in bank, drafts awaiting review, days since last scrape
- Two side-by-side panels: recent ideas from the bank + recent drafts
- Quick action buttons: **New Post**, **New Carousel**, **Scrape Ideas**

---

### `/ideas` — Idea Bank
All scraped and manual ideas live here before becoming content.

- Filter bar: All / Scraped / Manual / Unused / by niche tag
- Search across all ideas
- Grid of idea cards, each showing:
  - Title / topic
  - Preview text (2 lines)
  - Source badge (Scraped or Manual)
  - Niche tag
  - **Create Post** and **Create Carousel** buttons
- Clicking Create Pre-loads the idea as context in the editor

---

### `/create/post` — Post Editor
Write and generate LinkedIn text posts.

- **Dropdowns at top:** Voice (persona) + Framework
- Topic/seed input field
- **Generate** button → calls Claude → populates draft textarea
- Editable textarea
- Live LinkedIn preview panel on the right (mocked profile card + post content)
- Framework indicator showing the active pattern (e.g. "Hormozi structure applied")
- Character count (LinkedIn max: 3,000)
- Actions: **Save Draft** / **Schedule**

---

### `/create/carousel` — Carousel Editor
The core feature. Build multi-slide carousels and export as PDF.


---

### `/calendar` — Content Calendar
Assign drafts to dates. Visual overview of the week/month.

- Month grid view
- Scheduled posts shown on their assigned day
- Color coded: yellow-green for text posts, orange for carousels
- Click any day to assign an existing draft to it
- Click a scheduled post to open it in the editor
- No auto-posting — the workflow is: open on post day → copy/export → post on LinkedIn manually

---

### `/scrape` — Scraper
Two modes: Watchlist (persistent profiles) and one-off keyword search.

**Watchlist section (top):**
- Grid of profile cards, each showing:
  - Display name + LinkedIn URL
  - Last refreshed date
  - Number of ideas added in last refresh
  - **Refresh** button — triggers a fresh Apify scrape on demand
- **Add to Watchlist** button → input a LinkedIn profile URL + display name
- Results are deduplicated on import (same post never added twice)

**Keyword Search section (below):**
- Single search bar for a topic or keyword (e.g. "AI automation", "solopreneur systems")
- Max posts selector
- Auto-tag niche field (pre-tags all results before they hit the Idea Bank)
- **Run Search** button
- One-off — no card saved, results go straight to the Idea Bank

**Scrape history** at the bottom: job log showing source, type, status, result count, timestamp.

---

### `/frameworks` — Writing Frameworks
Manage the prompt templates that shape how Claude structures content.

- Grid of framework cards, each showing:
  - Framework name (e.g. "Alex Hormozi")
  - Author handle
  - Description
  - Content type badge (Post / Carousel / Both)
  - Active/inactive toggle
- **Add Framework** button → form: name, handle, description, content type, prompt template
- Edit and delete existing frameworks
- Active frameworks appear in the editor dropdowns. Inactive ones are hidden.

---

### `/settings` — Settings
- **Persona prompt** — your voice. Injected as the system prompt layer in every Claude call.
- **Default carousel theme** — color scheme used in new carousels
- **API Keys:** Anthropic, Apify

---

## 3. Backend Routes

### Ideas
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ideas` | List ideas. Supports `?source=scraped&tag=ai&used=false` |
| POST | `/api/ideas` | Save a manual idea |
| DELETE | `/api/ideas/:id` | Delete an idea |

### Generation
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/generate/post` | Assemble persona + framework + task prompt → call Claude → return draft text |
| POST | `/api/generate/carousel` | Same prompt stack → return structured slide JSON array |
| POST | `/api/generate/slide` | Regenerate a single slide within an existing carousel |

### Posts / Drafts
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/posts` | List posts. Supports `?status=draft|scheduled|posted` |
| POST | `/api/posts` | Create a new post (text or carousel) |
| PATCH | `/api/posts/:id` | Update content, status, or scheduled_date |
| DELETE | `/api/posts/:id` | Delete a post |

### Carousel
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/carousel/export` | Receive slide JSON → render PDF → return file |

### Scraper
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/scrape/trigger` | Start Apify job (watchlist refresh or keyword search) |
| GET | `/api/scrape/jobs` | List scrape job history |
| GET | `/api/scrape/jobs/:id` | Poll status of a running job |

### Watchlist
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/watchlist` | List all watchlist profiles |
| POST | `/api/watchlist` | Add a profile to the watchlist |
| DELETE | `/api/watchlist/:id` | Remove a profile |
| POST | `/api/watchlist/:id/refresh` | Trigger a fresh scrape for this profile |

### Frameworks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/frameworks` | List all frameworks |
| POST | `/api/frameworks` | Create a new framework |
| PATCH | `/api/frameworks/:id` | Update or toggle active status |
| DELETE | `/api/frameworks/:id` | Delete a framework |

---

## 4. Database Schema

### `ideas`
| Field | Type | Notes |
|-------|------|-------|
| id | INTEGER PK | Auto increment |
| source | TEXT | `'scraped'` \| `'manual'` |
| topic | TEXT | Short title / headline |
| raw_content | TEXT | Full scraped text or manual notes |
| niche_tag | TEXT | e.g. `#ai`, `#entrepreneurship` |
| content_hash | TEXT | MD5 of raw_content — used for deduplication on import |
| used | BOOLEAN | Flipped to true when turned into a post or carousel |
| created_at | DATETIME | Auto set on insert |

---

### `posts`
| Field | Type | Notes |
|-------|------|-------|
| id | INTEGER PK | Auto increment |
| type | TEXT | `'text'` \| `'carousel'` |
| title | TEXT | Internal label for the draft |
| content_json | TEXT | Raw string for text posts; slide array JSON for carousels |
| framework_id | INTEGER FK | Nullable — references `frameworks.id` |
| status | TEXT | `'draft'` \| `'scheduled'` \| `'posted'` |
| scheduled_date | DATE | Nullable — date assigned on the calendar |
| created_at | DATETIME | Auto set on insert |
| updated_at | DATETIME | Updated on every save |

---

### `frameworks`
| Field | Type | Notes |
|-------|------|-------|
| id | INTEGER PK | Auto increment |
| name | TEXT | e.g. `'Alex Hormozi'` |
| author_handle | TEXT | e.g. `'@hormozi'` |
| description | TEXT | Short human-readable summary |
| prompt_template | TEXT | The actual Claude prompt instruction injected at generation time |
| content_type | TEXT | `'post'` \| `'carousel'` \| `'both'` |
| active | BOOLEAN | Controls visibility in editor dropdowns |
| created_at | DATETIME | Auto set on insert |

---

### `watchlist`
| Field | Type | Notes |
|-------|------|-------|
| id | INTEGER PK | Auto increment |
| display_name | TEXT | e.g. `'Dan Koe'` |
| linkedin_url | TEXT | Full profile URL |
| last_scraped_at | DATETIME | Nullable — null if never scraped |
| last_result_count | INTEGER | Ideas added in the most recent refresh |
| created_at | DATETIME | Auto set on insert |

---

### `scrape_jobs`
| Field | Type | Notes |
|-------|------|-------|
| id | INTEGER PK | Auto increment |
| watchlist_id | INTEGER FK | Nullable — set if triggered from a watchlist card, null for keyword searches |
| trigger_type | TEXT | `'profile'` \| `'keyword'` |
| input | TEXT | The profile URL or keyword that was used |
| apify_run_id | TEXT | Apify's job ID — used to poll status |
| status | TEXT | `'running'` \| `'done'` \| `'failed'` |
| result_count | INTEGER | Number of ideas added to the bank |
| created_at | DATETIME | Auto set on insert |

---

## 5. Claude Prompt Architecture

Every call to `/api/generate/*` stacks three prompt layers in order. The result is content that sounds like you, structured like a specific framework, on the topic you chose.

---

### Layer 1 — Persona (System Prompt)
Stored in Settings. Loaded and prepended to every Claude call. Defines your tone, writing style, vocabulary, topics you cover, and what you avoid.

```
You are [Bill]. You write with a direct, no-fluff, casual tone. You cover
automation, AI tools, freelance business, and the future of independent work.
You write for founders and developers. You never use corporate buzzwords.
You use short punchy sentences and line breaks generously.
```

---

### Layer 2 — Framework Prompt
Pulled from the `frameworks` table by the selected `framework_id`. Injected after the persona. Defines the structural approach and narrative pattern for this piece of content.

```
Structure this content using the Hormozi framework: lead with a counterintuitive
hook, establish the cost of inaction, present the core insight as a numbered
system, close with a hard and direct CTA. No fluff. Maximum density.
```

If no framework is selected, this layer is omitted entirely and Claude falls back to pure persona.

---

### Layer 3 — Task Prompt
Built dynamically from the editor inputs. Specifies exactly what to produce.

**For a text post:**
```
Write a LinkedIn text post about: "Why most founders confuse activity with
leverage". Max 3000 characters. Use line breaks generously. Return only the
post text — no commentary, no preamble.
```

**For a carousel:**
```
Write a 6-slide LinkedIn carousel about: "Why most founders confuse activity
with leverage". Return a JSON array only. Each slide object must have:
  - "headline": short punchy title (max 8 words)
  - "body": slide body text (2–4 sentences)
  - "slide_type": "hook" | "content" | "cta"
No commentary. No markdown. Raw JSON only.
```

---

## 6. Scraper Architecture

### Watchlist (Profile Scraping)
- User adds a LinkedIn profile URL + display name to the watchlist
- Hitting **Refresh** on a card triggers a POST to `/api/watchlist/:id/refresh`
- Backend calls Apify's LinkedIn Profile Scraper actor with the profile URL
- Results are polled until the job completes
- Each post is checked against `ideas.content_hash` before insert — duplicates are silently skipped
- `watchlist.last_scraped_at` and `last_result_count` are updated on completion

### Keyword Search (One-off)
- User enters a keyword or topic in the search bar
- Triggers a POST to `/api/scrape/trigger` with `trigger_type: 'keyword'`
- Backend calls Apify's LinkedIn Search Scraper actor
- Results are parsed and inserted into the Idea Bank with deduplication
- No watchlist card is created — this is a fire-and-forget scrape
- Auto-tag niche field pre-tags all results before insert

### Deduplication
All scraped posts are hashed (MD5 of `raw_content`) before insert. If the hash already exists in the `ideas` table, the record is skipped. This means refreshing a watchlist card multiple times never creates duplicates.

### Future: Auto-refresh
The watchlist is designed so that an external scheduler (e.g. an n8n workflow) can hit `POST /api/watchlist/:id/refresh` on a cron schedule — e.g. every Monday morning, refresh all watchlist profiles automatically. No app code changes needed, just a scheduled HTTP call.

---

## 7. User Flow

```
1. POPULATE IDEA BANK
   └── Refresh a watchlist profile (Apify scrapes their recent posts)
   └── OR run a one-off keyword search
   └── OR add an idea manually

2. PICK AN IDEA
   └── Browse Idea Bank → click 'Create Post' or 'Create Carousel'
   └── Idea is pre-loaded as context in the editor

3. GENERATE & EDIT
   └── Select a Framework (or none)
   └── Hit Generate → Claude drafts the content
   └── Edit inline until it sounds right
   └── Save as Draft

4. SCHEDULE
   └── Open Calendar → assign draft to a date
   └── Status changes: Draft → Scheduled

5. POST DAY
   └── Open Calendar → click the post
   └── Copy text (or export PDF for carousel)
   └── Post manually on LinkedIn
   └── Mark as Posted
```

---

## 8. Build Order

| Phase | What |
|-------|------|
| 1 | Carousel Editor + PDF export *(already proven)* |
| 2 | Post Editor + Claude generation with persona + framework layers |
| 3 | Frameworks CRUD + prompt injection |
| 4 | Idea Bank — manual entry first |
| 5 | Calendar — static scheduling, copy/paste workflow |
| 6 | Watchlist + Apify profile scraping + deduplication |
| 7 | Keyword scraper (one-off search) |

---

## 9. Out of Scope (for now)

- Auth / login — personal tool, skip it
- Auto-posting to LinkedIn via API
- Post performance tracking / analytics
- Mobile optimization
- Multi-user or team features
- Scheduled auto-refresh of watchlist (can be added via n8n later with zero app changes)