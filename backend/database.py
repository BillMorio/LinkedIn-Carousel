from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

from pathlib import Path

# Load env vars from this directory
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

# Ensure database path is absolute relative to project root
BASE_DIR = Path(__file__).parent.parent.absolute()
DB_FILE = BASE_DIR / "forge.db"

# `or` (not getenv default) so an empty DATABASE_URL still falls back to the absolute path.
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL") or f"sqlite:///{DB_FILE}"

# Anchor a relative sqlite path to the project root so the DB location never depends on
# the process working directory (prevents the "added creator vanished" split-brain bug).
if SQLALCHEMY_DATABASE_URL.startswith("sqlite:///./") or SQLALCHEMY_DATABASE_URL.startswith("sqlite:///../"):
    rel = SQLALCHEMY_DATABASE_URL[len("sqlite:///"):]
    SQLALCHEMY_DATABASE_URL = f"sqlite:///{(BASE_DIR / rel).resolve()}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
