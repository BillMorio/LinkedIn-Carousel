from fastapi import FastAPI, Depends, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
from dotenv import load_dotenv
from typing import List
from sqlalchemy.orm import Session
from backend import schemas, models
from backend.database import engine, get_db

load_dotenv()

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
def get_ideas(db: Session = Depends(get_db)):
    return db.query(models.Idea).order_by(models.Idea.created_at.desc()).all()

@app.post("/api/ideas", response_model=schemas.Idea)
def create_idea(idea: schemas.IdeaBase, db: Session = Depends(get_db)):
    db_idea = models.Idea(**idea.model_dump())
    db.add(db_idea)
    db.commit()
    db.refresh(db_idea)
    return db_idea

# Posts Endpoints
@app.get("/api/posts", response_model=List[schemas.Post])
def get_posts(db: Session = Depends(get_db)):
    return db.query(models.Post).order_by(models.Post.created_at.desc()).all()

@app.post("/api/posts", response_model=schemas.Post)
def create_post(post: schemas.PostBase, db: Session = Depends(get_db)):
    db_post = models.Post(**post.model_dump())
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

# Generation Endpoints
@app.post("/api/generate/post")
async def generate_post(request: schemas.GenerationRequest, db: Session = Depends(get_db)):
    # 1. Fetch Persona (System Prompt)
    persona = "You are a professional LinkedIn creator writing for founders." # Default for now
    
    # 2. Fetch Framework Prompt
    framework_prompt = ""
    if request.framework_id:
        framework = db.query(models.Framework).filter(models.Framework.id == request.framework_id).first()
        if framework:
            framework_prompt = framework.prompt_template

    # 3. Build Task Prompt
    task_prompt = f'Write a LinkedIn text post about: "{request.topic}". Max 3000 characters. Return only the post text — no preamble.'

    # 4. Combine Layers (Placeholder for Anthropic API call)
    full_prompt = f"{persona}\n\n{framework_prompt}\n\n{task_prompt}"
    
    # Mocking Claude response for now until API key is provided
    mock_response = f"Generated post about {request.topic} using framework {request.framework_id or 'None'}.\n\nThis is a placeholder for the Claude API integration."
    
    return {"draft": mock_response, "prompt_debug": full_prompt}

@app.get("/")
async def root():
    return {"status": "ok", "message": "Forge API is running"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
