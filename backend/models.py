from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, DateTime, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class Idea(Base):
    __tablename__ = "ideas"

    id = Column(Integer, primary_key=True, index=True)
    source = Column(String)  # 'scraped' | 'manual'
    topic = Column(String)
    raw_content = Column(Text)
    niche_tag = Column(String, nullable=True)
    content_hash = Column(String, unique=True, index=True)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    type = Column(String)  # 'text' | 'carousel'
    title = Column(String)
    content_json = Column(Text)
    framework_id = Column(Integer, ForeignKey("frameworks.id"), nullable=True)
    status = Column(String, default="draft")  # 'draft' | 'scheduled' | 'posted'
    scheduled_date = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Framework(Base):
    __tablename__ = "frameworks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    author_handle = Column(String)
    description = Column(String)
    prompt_template = Column(Text)
    content_type = Column(String)  # 'post' | 'carousel' | 'both'
    active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Watchlist(Base):
    __tablename__ = "watchlist"

    id = Column(Integer, primary_key=True, index=True)
    display_name = Column(String)
    linkedin_url = Column(String)
    last_scraped_at = Column(DateTime, nullable=True)
    last_result_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class ScrapeJob(Base):
    __tablename__ = "scrape_jobs"

    id = Column(Integer, primary_key=True, index=True)
    watchlist_id = Column(Integer, ForeignKey("watchlist.id"), nullable=True)
    trigger_type = Column(String)  # 'profile' | 'keyword'
    input = Column(String)
    apify_run_id = Column(String)
    status = Column(String, default="running")  # 'running' | 'done' | 'failed'
    result_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class Setting(Base):
    __tablename__ = "settings"

    key = Column(String, primary_key=True, index=True)
    value = Column(Text)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
