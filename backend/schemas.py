from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

# Framework Schemas
class FrameworkBase(BaseModel):
    name: str
    author_handle: str
    description: str
    prompt_template: str
    content_type: str  # 'post' | 'carousel' | 'both'
    active: bool = True

class FrameworkCreate(FrameworkBase):
    pass

class Framework(FrameworkBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Settings (Persona) Schemas
class SettingsUpdate(BaseModel):
    key: str
    value: str

class SettingsBase(BaseModel):
    persona_prompt: str

class Settings(SettingsBase):
    pass

# Idea Schemas
class IdeaBase(BaseModel):
    source: str
    topic: str
    raw_content: str
    niche_tag: Optional[str] = None
    watchlist_id: Optional[int] = None
    content_hash: str
    post_type: str = "text"
    engagement_count: int = 0
    comments_count: int = 0
    reposts_count: int = 0
    view_count: int = 0
    original_url: Optional[str] = None
    author_name: Optional[str] = None
    author_headline: Optional[str] = None
    author_avatar_url: Optional[str] = None
    author_profile_url: Optional[str] = None
    media_url: Optional[str] = None
    media_metadata: Optional[str] = None
    analysis_funnel_stage: Optional[str] = None
    analysis_giveaway: Optional[str] = None
    analysis_full_json: Optional[str] = None
    icp_json: Optional[str] = None
    notes: Optional[str] = None
    tags: Optional[str] = None
    used: bool = False
    is_saved: bool = False
    posted_at: Optional[datetime] = None
    posted_at_raw: Optional[str] = None

class Idea(IdeaBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Post Schemas
class PostBase(BaseModel):
    type: str
    title: str
    content_json: str
    framework_id: Optional[int] = None
    status: str = "draft"
    scheduled_date: Optional[datetime] = None

class Post(PostBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Generation Schemas
class GenerationRequest(BaseModel):
    topic: str
    framework_id: Optional[int] = None
    voice_id: Optional[str] = None  # Placeholder for persona selection
    format: Optional[str] = "post"  # 'post' | 'article'

# Scraper Schemas
class ScrapeRequest(BaseModel):
    keyword: Optional[str] = None
    profile_url: Optional[str] = None
    time_limit: Optional[str] = "week"
    limit: Optional[int] = 10

class SearchRequest(BaseModel):
    query: str
    content_type: Optional[str] = "documents"
    maxResults: Optional[int] = 20
    sort_by: Optional[str] = "date_posted"

class WatchlistBase(BaseModel):
    display_name: str
    linkedin_url: str
    avatar_url: Optional[str] = None
    headline: Optional[str] = None

class WatchlistCreate(WatchlistBase):
    pass

class Watchlist(WatchlistBase):
    id: int
    about: Optional[str] = None
    icp_json: Optional[str] = None
    icp_updated_at: Optional[datetime] = None
    last_scraped_at: Optional[datetime] = None
    last_result_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True

# Discovery Keyword Schemas
class DiscoveryKeywordBase(BaseModel):
    keyword: str
    result_count: int = 0

class DiscoveryKeyword(DiscoveryKeywordBase):
    id: int
    last_scraped_at: datetime
    created_at: datetime

    class Config:
        from_attributes = True

class DiscoverySaveRequest(BaseModel):
    keyword: str

# Forge Clipper (web capture) Schemas
class CaptureRequest(BaseModel):
    content: str
    url: Optional[str] = None
    title: Optional[str] = None
    note: Optional[str] = None
    tags: Optional[List[str]] = None
    platform: Optional[str] = None       # 'twitter' | 'linkedin' | 'article' | 'web'
    author_name: Optional[str] = None
    media_url: Optional[str] = None

class NotesUpdate(BaseModel):
    notes: Optional[str] = None
    tags: Optional[List[str]] = None

# Scrape Job (history) Schemas
class ScrapeJob(BaseModel):
    id: int
    watchlist_id: Optional[int] = None
    trigger_type: str
    input: Optional[str] = None
    apify_run_id: Optional[str] = None
    status: str = "done"
    result_count: int = 0
    created_at: datetime

    class Config:
        from_attributes = True
