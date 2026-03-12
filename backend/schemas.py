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
    content_hash: str
    used: bool = False

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
