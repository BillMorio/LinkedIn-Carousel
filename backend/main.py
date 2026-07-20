from fastapi import FastAPI, Depends, HTTPException, Body
from datetime import datetime
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import anthropic
from anthropic import Anthropic
from dotenv import load_dotenv
from typing import List, Optional
from sqlalchemy.orm import Session
from . import schemas, models
from .database import engine, get_db
from .scraper import run_profile_scrape

from pathlib import Path

# Load env vars from the same directory as this file
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Forge API", description="Backend for LinkedIn Content Tool")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Frameworks Endpoints
@app.get("/api/frameworks", response_model=List[schemas.Framework])
def get_frameworks(db: Session = Depends(get_db)):
    return db.query(models.Framework).all()

@app.post("/api/frameworks", response_model=schemas.Framework)
def create_framework(framework: schemas.FrameworkCreate, db: Session = Depends(get_db)):
    db_framework = models.Framework(**framework.model_dump())
    db.add(db_framework)
    db.commit()
    db.refresh(db_framework)
    return db_framework

@app.patch("/api/frameworks/{framework_id}", response_model=schemas.Framework)
def update_framework(framework_id: int, framework: schemas.FrameworkCreate, db: Session = Depends(get_db)):
    db_framework = db.query(models.Framework).filter(models.Framework.id == framework_id).first()
    if not db_framework:
        return {"error": "Framework not found"}
    for var, value in vars(framework).items():
        setattr(db_framework, var, value) if value else None
    db.commit()
    db.refresh(db_framework)
    return db_framework

# Settings / Persona Endpoints
@app.get("/api/settings/{key}")
def get_setting(key: str, db: Session = Depends(get_db)):
    setting = db.query(models.Setting).filter(models.Setting.key == key).first()
    if not setting:
        return {"key": key, "value": ""}
    return {"key": setting.key, "value": setting.value}

@app.post("/api/settings")
def set_setting(payload: schemas.SettingsUpdate, db: Session = Depends(get_db)):
    db_setting = db.query(models.Setting).filter(models.Setting.key == payload.key).first()
    if db_setting:
        db_setting.value = payload.value
    else:
        db_setting = models.Setting(key=payload.key, value=payload.value)
        db.add(db_setting)
    db.commit()
    return {"status": "success"}

# Ideas Endpoints
@app.get("/api/ideas", response_model=List[schemas.Idea])
def get_ideas(tag: Optional[str] = None, all_items: bool = False, watchlist_id: Optional[int] = None, source: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.Idea)
    if not all_items:
        query = query.filter(models.Idea.is_saved == True)
    if source:
        query = query.filter(models.Idea.source == source)
    if watchlist_id is not None:
        query = query.filter(models.Idea.watchlist_id == watchlist_id)
    elif tag:
        query = query.filter(models.Idea.niche_tag == tag)
    # Clips have no engagement, so order them by recency; everything else by engagement.
    if source == 'clip':
        return query.order_by(models.Idea.created_at.desc()).all()
    return query.order_by(models.Idea.engagement_count.desc()).all()

@app.get("/api/ideas/{idea_id}", response_model=schemas.Idea)
def get_idea(idea_id: int, db: Session = Depends(get_db)):
    db_idea = db.query(models.Idea).filter(models.Idea.id == idea_id).first()
    if not db_idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    return db_idea

# Discovery Vault Endpoints
@app.get("/api/discovery/keywords", response_model=List[schemas.DiscoveryKeyword])
def get_discovery_keywords(db: Session = Depends(get_db)):
    return db.query(models.DiscoveryKeyword).order_by(models.DiscoveryKeyword.last_scraped_at.desc()).all()

@app.get("/api/discovery/results/{keyword}", response_model=List[schemas.Idea])
def get_discovery_results(keyword: str, db: Session = Depends(get_db)):
    # Fetch from local DB where niche_tag or topic matches keyword
    results = db.query(models.Idea).filter(
        (models.Idea.niche_tag == keyword) | 
        (models.Idea.topic.ilike(f"%{keyword}%"))
    ).order_by(models.Idea.engagement_count.desc()).all()
    return results

@app.post("/api/discovery/save")
def save_keyword_to_vault(request: schemas.DiscoverySaveRequest, db: Session = Depends(get_db)):
    # Count results for this keyword
    count = db.query(models.Idea).filter(
        (models.Idea.niche_tag == request.keyword) | 
        (models.Idea.topic.ilike(f"%{request.keyword}%"))
    ).count()

    dk = db.query(models.DiscoveryKeyword).filter(models.DiscoveryKeyword.keyword == request.keyword).first()
    if dk:
        dk.last_scraped_at = datetime.utcnow()
        dk.result_count = count
    else:
        dk = models.DiscoveryKeyword(
            keyword=request.keyword,
            result_count=count,
            last_scraped_at=datetime.utcnow()
        )
        db.add(dk)
    db.commit()
    db.refresh(dk)
    return dk

@app.post("/api/ideas/{idea_id}/analyze")
def analyze_idea(idea_id: int, db: Session = Depends(get_db)):
    idea = db.query(models.Idea).filter(models.Idea.id == idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

    from google import genai
    from google.genai import types
    import json

    prompt = f"""You are a world-class LinkedIn content strategist who reverse-engineers why posts perform.
Analyze the post below and break down its persuasion architecture. Be specific and reference the post itself; avoid generic fluff.

POST CONTENT:
\"\"\"
{idea.raw_content}
\"\"\"

METRICS: {idea.engagement_count} likes, {idea.comments_count or 0} comments, {idea.reposts_count or 0} reposts.

Return ONLY a JSON object with EXACTLY these keys:
- "hook": The opening mechanism and WHY it stopped the scroll / made them click.
- "promise": The explicit or implicit promise made to the reader.
- "transformation": The transformation or end-outcome the reader believes they will get.
- "cta": The call to action — what the reader is asked to do and what they receive (e.g. "Comment 'GUIDE' for the doc via DM", "Follow for more", a link). If none, "No explicit CTA".
- "funnel_stage": EXACTLY one of "TOFU", "MOFU", "BOFU".
- "funnel_reason": One sentence justifying the funnel stage.
- "hook_strength": A rating like "8/10".
- "replication_tip": One concrete, actionable way to replicate this for a different topic.
"""

    try:
        client = genai.Client(api_key=api_key)
        resp = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.4,
            ),
        )
        data = json.loads(resp.text)

        # Readable summary for any plain-text consumer of this endpoint
        data["analysis"] = (
            f"HOOK: {data.get('hook','')}\n\n"
            f"PROMISE: {data.get('promise','')}\n\n"
            f"TRANSFORMATION: {data.get('transformation','')}\n\n"
            f"CTA: {data.get('cta','')}\n\n"
            f"FUNNEL: {data.get('funnel_stage','')} — {data.get('funnel_reason','')}\n\n"
            f"REPLICATE: {data.get('replication_tip','')}"
        )

        idea.analysis_funnel_stage = data.get("funnel_stage")
        idea.analysis_giveaway = data.get("cta")
        idea.analysis_full_json = json.dumps(data)
        db.commit()
        return data
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Gemini analysis failed: {str(e)}")

@app.post("/api/ideas/{idea_id}/icp")
def analyze_idea_icp(idea_id: int, db: Session = Depends(get_db)):
    """Post-level ICP: who is this single post talking to?"""
    idea = db.query(models.Idea).filter(models.Idea.id == idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

    from google import genai
    from google.genai import types
    import json

    prompt = f"""You are an expert at audience research and direct-response copywriting. Identify EXACTLY who this LinkedIn post is written for — its target ICP (ideal customer profile).

POST CONTENT:
\"\"\"
{idea.raw_content}
\"\"\"

METRICS: {idea.engagement_count} likes, {idea.comments_count or 0} comments, {idea.reposts_count or 0} reposts.

Return ONLY a JSON object with EXACTLY these keys:
- "audience": The specific persona this post targets (role/title, seniority, industry, company stage). Be concrete, not generic.
- "pains": A list of 2-4 specific pains/frustrations this audience feels that the post speaks to.
- "desires": A list of 2-4 specific desires/outcomes this audience wants.
- "awareness_level": EXACTLY one of "Unaware", "Problem-aware", "Solution-aware", "Product-aware", "Most-aware".
- "why_it_resonates": One or two sentences on why this exact audience stops scrolling and engages.
- "objections": A list of 1-3 likely objections this audience has that the post addresses (or leaves open).
"""

    try:
        client = genai.Client(api_key=api_key)
        resp = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.4,
            ),
        )
        data = json.loads(resp.text)
        idea.icp_json = json.dumps(data)
        db.commit()
        return data
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Gemini ICP analysis failed: {str(e)}")

@app.post("/api/ideas", response_model=schemas.Idea)
def create_idea(idea: schemas.IdeaBase, db: Session = Depends(get_db)):
    db_idea = models.Idea(**idea.model_dump())
    db_idea.is_saved = True # Manually created ideas are saved by default
    db.add(db_idea)
    db.commit()
    db.refresh(db_idea)
    return db_idea

@app.post("/api/captures", response_model=schemas.Idea)
def create_capture(cap: schemas.CaptureRequest, db: Session = Depends(get_db)):
    """Forge Clipper: capture a web clip (selection/post/article) into the Idea Bank."""
    import hashlib
    content = (cap.content or "").strip()
    if not content and not cap.url:
        raise HTTPException(status_code=400, detail="content or url is required")

    # Dedup by url+content so re-clipping the same thing updates rather than duplicates
    content_hash = hashlib.md5(f"{cap.url or ''}|{content}".encode()).hexdigest()
    tags_str = ", ".join([t.strip() for t in (cap.tags or []) if t.strip()]) or None
    title = ((cap.title or content.split("\n")[0][:80]) or "Web Clip").strip()

    existing = db.query(models.Idea).filter(models.Idea.content_hash == content_hash).first()
    if existing:
        if cap.note is not None:
            existing.notes = cap.note
        if tags_str:
            existing.tags = tags_str
        existing.is_saved = True
        db.commit()
        db.refresh(existing)
        return existing

    db_idea = models.Idea(
        source="clip",
        topic=title,
        raw_content=content,
        niche_tag=cap.platform or "web",
        content_hash=content_hash,
        post_type="image" if cap.media_url else "text",
        original_url=cap.url,
        author_name=cap.author_name,
        media_url=cap.media_url,
        notes=cap.note,
        tags=tags_str,
        is_saved=True,
        created_at=datetime.utcnow(),
    )
    db.add(db_idea)
    db.commit()
    db.refresh(db_idea)
    return db_idea

@app.post("/api/ideas/{idea_id}/notes", response_model=schemas.Idea)
def update_idea_notes(idea_id: int, payload: schemas.NotesUpdate, db: Session = Depends(get_db)):
    idea = db.query(models.Idea).filter(models.Idea.id == idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    if payload.notes is not None:
        idea.notes = payload.notes
    if payload.tags is not None:
        idea.tags = ", ".join([t.strip() for t in payload.tags if t.strip()]) or None
    db.commit()
    db.refresh(idea)
    return idea

@app.post("/api/clips/connections")
def clip_connections(db: Session = Depends(get_db)):
    """AI 'make connections': cluster the user's clips into content angles via Gemini."""
    clips = db.query(models.Idea).filter(models.Idea.source == "clip").order_by(models.Idea.created_at.desc()).all()
    if len(clips) < 2:
        raise HTTPException(status_code=400, detail="Save at least 2 clips to find connections.")

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

    from google import genai
    from google.genai import types
    import json

    items = [{
        "id": c.id,
        "title": (c.topic or "")[:120],
        "note": (c.notes or "")[:200],
        "tags": c.tags or "",
        "snippet": (c.raw_content or "")[:300],
    } for c in clips]

    prompt = f"""You are a sharp content strategist. Below are idea clips a creator saved while hunting for content.
Group the ones that connect into 2-5 THEMES — each theme is a content angle that bundles related clips into one potential post/carousel.

CLIPS (JSON):
{json.dumps(items, ensure_ascii=False)}

Return ONLY a JSON object:
{{ "clusters": [ {{
  "theme": "short theme name",
  "angle": "a specific, ready-to-write content angle that ties these clips together",
  "why": "one sentence on what connects them",
  "clip_ids": [the real ids from the input that belong to this theme]
}} ] }}
Only group clips that genuinely connect; it's fine to leave some out. Use the exact ids from the input."""

    try:
        client = genai.Client(api_key=api_key)
        resp = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(response_mime_type="application/json", temperature=0.5),
        )
        data = json.loads(resp.text)
        by_id = {c.id: c for c in clips}
        for cl in data.get("clusters", []):
            cl["clips"] = [{
                "id": cid,
                "topic": by_id[cid].topic,
                "platform": by_id[cid].niche_tag,
                "url": by_id[cid].original_url,
            } for cid in cl.get("clip_ids", []) if cid in by_id]
        return data
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Gemini connections failed: {str(e)}")

@app.post("/api/ideas/{idea_id}/toggle-save")
def toggle_save_idea(idea_id: int, db: Session = Depends(get_db)):
    idea = db.query(models.Idea).filter(models.Idea.id == idea_id).first()
    if not idea:
        raise HTTPException(status_code=404, detail="Idea not found")
    idea.is_saved = not idea.is_saved
    db.commit()
    db.refresh(idea)
    return {"status": "success", "is_saved": idea.is_saved}

# Posts Endpoints
@app.get("/api/posts", response_model=List[schemas.Post])
def get_posts(db: Session = Depends(get_db)):
    return db.query(models.Post).order_by(models.Post.created_at.desc()).all()

@app.get("/api/posts/{post_id}", response_model=schemas.Post)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@app.post("/api/posts", response_model=schemas.Post)
def create_post(post: schemas.PostBase, db: Session = Depends(get_db)):
    db_post = models.Post(**post.model_dump())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@app.put("/api/posts/{post_id}", response_model=schemas.Post)
def update_post(post_id: int, post: schemas.PostBase, db: Session = Depends(get_db)):
    db_post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    for var, value in post.model_dump().items():
        setattr(db_post, var, value)
    db.commit()
    db.refresh(db_post)
    return db_post

@app.delete("/api/posts/{post_id}")
def delete_post(post_id: int, db: Session = Depends(get_db)):
    db_post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    db.delete(db_post)
    db.commit()
    return {"status": "success"}

# Watchlist Endpoints
@app.get("/api/watchlist", response_model=List[schemas.Watchlist])
def get_watchlist(db: Session = Depends(get_db)):
    return db.query(models.Watchlist).all()

@app.post("/api/watchlist", response_model=schemas.Watchlist)
def add_to_watchlist(profile: schemas.WatchlistCreate, db: Session = Depends(get_db)):
    db_profile = models.Watchlist(**profile.model_dump())
    db.add(db_profile)
    db.commit()
    db.refresh(db_profile)
    # NOTE: We intentionally do NOT run an Apify scrape here. Adding a creator must be
    # instant, reliable, and free — avatar/headline + posts populate on the first explicit
    # "Intelligence Sync", where the user controls the window + max posts (and the cost).
    return db_profile

@app.delete("/api/watchlist/{profile_id}")
def remove_from_watchlist(profile_id: int, db: Session = Depends(get_db)):
    db_profile = db.query(models.Watchlist).filter(models.Watchlist.id == profile_id).first()
    if not db_profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    db.delete(db_profile)
    db.commit()
    return {"status": "success"}

from .scraper import run_profile_scrape, run_keyword_search, run_profile_details

# Scraper Endpoints
@app.post("/api/scrape")
async def run_scrape(request: schemas.ScrapeRequest, db: Session = Depends(get_db)):
    token = os.getenv("APIFY_TOKEN")
    if not request.profile_url:
        raise HTTPException(status_code=400, detail="profile_url is required")
        
    # Clamp the user-supplied max posts to a sane range (protects credits from typos)
    max_posts = max(1, min(request.limit or 10, 100))
    # Look up the watchlist row first so scraped posts can be linked to it by a stable id
    wl = db.query(models.Watchlist).filter(models.Watchlist.linkedin_url == request.profile_url).first()
    results, _ = run_profile_scrape(
        db, request.profile_url, token,
        time_limit=request.time_limit, max_posts=max_posts,
        watchlist_id=wl.id if wl else None,
    )

    # Record scrape freshness + history (ScrapeJob)
    if wl:
        wl.last_scraped_at = datetime.utcnow()
        wl.last_result_count = len(results)
    job = models.ScrapeJob(
        watchlist_id=wl.id if wl else None,
        trigger_type="profile",
        input=request.time_limit,
        status="done",
        result_count=len(results),
    )
    db.add(job)
    db.commit()

    # Convert models to schemas for proper serialization
    return {"status": "success", "count": len(results), "ideas": [schemas.Idea.model_validate(r) for r in results]}

@app.get("/api/watchlist/{watchlist_id}/scrape-jobs", response_model=List[schemas.ScrapeJob])
def get_scrape_jobs(watchlist_id: int, db: Session = Depends(get_db)):
    return db.query(models.ScrapeJob).filter(
        models.ScrapeJob.watchlist_id == watchlist_id
    ).order_by(models.ScrapeJob.created_at.desc()).all()

@app.post("/api/watchlist/{watchlist_id}/icp")
def analyze_watchlist_icp(watchlist_id: int, refresh: bool = False, db: Session = Depends(get_db)):
    """Profile-level ICP: who does this creator help? Uses their About + top 5 posts."""
    wl = db.query(models.Watchlist).filter(models.Watchlist.id == watchlist_id).first()
    if not wl:
        raise HTTPException(status_code=404, detail="Creator not found")

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

    # Top 5 posts: last 90 days by engagement, topped up with all-time best if thin
    from datetime import timedelta
    cutoff = datetime.utcnow() - timedelta(days=90)
    base = db.query(models.Idea).filter(models.Idea.watchlist_id == watchlist_id)
    posts = base.filter(models.Idea.posted_at != None, models.Idea.posted_at >= cutoff) \
                .order_by(models.Idea.engagement_count.desc()).limit(5).all()
    if len(posts) < 5:
        seen = {p.id for p in posts}
        for p in base.order_by(models.Idea.engagement_count.desc()).all():
            if p.id not in seen:
                posts.append(p)
            if len(posts) >= 5:
                break

    if not posts:
        raise HTTPException(status_code=400, detail="No posts for this creator yet. Run an Intelligence Sync first.")

    # Ensure we have the About (scrape once via Apify, then cache)
    if refresh or not wl.about:
        token = os.getenv("APIFY_TOKEN")
        try:
            run_profile_details(db, wl.linkedin_url, token, watchlist_id=watchlist_id)
            db.refresh(wl)
        except Exception as e:
            print(f"Profile details scrape failed: {e}")

    from google import genai
    from google.genai import types
    import json

    posts_block = "\n\n".join(
        f"POST {i+1} ({p.engagement_count} likes, {p.comments_count or 0} comments):\n{(p.raw_content or '')[:1200]}"
        for i, p in enumerate(posts)
    )
    prompt = f"""You are a positioning and audience-research strategist. Determine the ICP (ideal customer profile) of this LinkedIn creator — WHO they help and HOW.

CREATOR: {wl.display_name}
HEADLINE: {wl.headline or '(none)'}
ABOUT (bio):
\"\"\"
{(wl.about or '(not available)')[:3000]}
\"\"\"

THEIR TOP {len(posts)} PERFORMING POSTS:
{posts_block}

Return ONLY a JSON object with EXACTLY these keys:
- "creator_summary": 1-2 sentences on who the creator is and what they do.
- "who_they_help": The primary ICP they serve (role/title, industry, company stage). Be specific.
- "secondary_audience": A secondary audience they also attract, or "None".
- "pains_solved": A list of 3-5 specific pains this ICP has that the creator addresses.
- "transformation": The before -> after transformation the creator sells or teaches.
- "content_themes": A list of 3-6 recurring topics/themes across their posts.
- "offer_signals": What they appear to sell or offer (products, services, lead magnets, CTAs observed) or "Unclear".
- "tone": A short description of their voice/tone.
- "confidence": "High"/"Medium"/"Low" + one phrase on what data was missing (e.g. no About text).
"""

    try:
        client = genai.Client(api_key=api_key)
        resp = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=types.GenerateContentConfig(response_mime_type="application/json", temperature=0.4),
        )
        data = json.loads(resp.text)
        wl.icp_json = json.dumps(data)
        wl.icp_updated_at = datetime.utcnow()
        db.commit()
        return data
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Gemini profile ICP failed: {str(e)}")

@app.post("/api/search")
async def run_search(request: schemas.SearchRequest, db: Session = Depends(get_db)):
    token = os.getenv("APIFY_TOKEN")
    if not request.query:
        raise HTTPException(status_code=400, detail="query is required")
        
    results = run_keyword_search(
        db, 
        request.query, 
        token, 
        content_type=request.content_type, 
        max_results=request.maxResults,
        sort_by=request.sort_by
    )
    
    # Auto-update result count IF keyword is already in vault
    dk = db.query(models.DiscoveryKeyword).filter(models.DiscoveryKeyword.keyword == request.query).first()
    if dk:
        dk.last_scraped_at = datetime.utcnow()
        dk.result_count = len(results)
        db.commit()

    # Convert models to schemas for proper serialization
    return {"status": "success", "count": len(results), "ideas": [schemas.Idea.model_validate(r) for r in results]}

from anthropic import Anthropic

# Generation Endpoints
@app.post("/api/generate/post")
async def generate_post(request: schemas.GenerationRequest, db: Session = Depends(get_db)):
    # 1. Fetch Persona (System Prompt)
    persona_setting = db.query(models.Setting).filter(models.Setting.key == 'persona_prompt').first()
    persona = persona_setting.value if persona_setting else "You are a professional LinkedIn creator writing for founders."
    
    # 2. Fetch Framework Prompt
    framework_prompt = ""
    if request.framework_id:
        # Check if framework_id is numeric or name
        try:
            f_id = int(request.framework_id)
            framework = db.query(models.Framework).filter(models.Framework.id == f_id).first()
        except ValueError:
            framework = db.query(models.Framework).filter(models.Framework.name == request.framework_id).first()
            
        if framework:
            framework_prompt = f"Use this WRITING FRAMEWORK:\n{framework.prompt_template}"

    # 3. Build Task Prompt (post vs long-form article)
    is_article = (request.format or "post").lower() == "article"
    if is_article:
        task_prompt = (
            f'Write a long-form LinkedIn ARTICLE about: "{request.topic}".\n'
            "- Put a compelling article title on the FIRST line (plain text, no markdown #).\n"
            "- Then a strong opening hook, followed by 3-5 sections, each with a short bold subheading.\n"
            "- 700-1200 words, skimmable, with concrete examples.\n"
            "- End with a clear takeaway and a soft call-to-action.\n"
            "Return only the article (title on line 1, then the body). No preamble."
        )
    else:
        task_prompt = f'Write a LinkedIn text post about: "{request.topic}". Max 3000 characters. Return only the post text — no preamble.'

    # 4. Generate with Gemini (the working engine; Anthropic key is invalid)
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="GEMINI_API_KEY not configured")

    from google import genai
    from google.genai import types
    try:
        client = genai.Client(api_key=api_key)
        resp = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=f"{framework_prompt}\n\n{task_prompt}".strip(),
            config=types.GenerateContentConfig(
                system_instruction=persona,
                temperature=0.7,
                max_output_tokens=4096 if is_article else 1500,
            ),
        )
        draft_content = (resp.text or "").strip()

        # 5. Auto-save as a draft (type distinguishes article vs post)
        if is_article:
            title = (draft_content.split("\n")[0][:80] or f"Article: {request.topic[:50]}").strip()
        else:
            title = f"Draft: {request.topic[:50]}"
        db_post = models.Post(
            type="article" if is_article else "text",
            title=title,
            content_json=draft_content,
            status="draft",
        )
        db.add(db_post)
        db.commit()
        db.refresh(db_post)

        return {"draft": draft_content, "id": db_post.id, "format": "article" if is_article else "post"}
    except HTTPException:
        raise
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Gemini generation error: {str(e)}")

@app.get("/")
async def root():
    return {"status": "ok", "message": "Forge API is running"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
