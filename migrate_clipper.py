"""Add ideas.notes + ideas.tags for the Forge Clipper (web capture) feature. Idempotent.

- ideas.notes : free-text note the user attaches to a clipped idea
- ideas.tags  : comma-separated user tags

Usage: python migrate_clipper.py
"""
import sqlite3
from pathlib import Path

DB = Path(__file__).parent / "forge.db"
c = sqlite3.connect(DB)


def add_column(table, column, decl):
    cols = [r[1] for r in c.execute(f"PRAGMA table_info({table})").fetchall()]
    if column not in cols:
        c.execute(f"ALTER TABLE {table} ADD COLUMN {column} {decl}")
        print(f"Added {table}.{column}")
    else:
        print(f"{table}.{column} already exists")


add_column("ideas", "notes", "TEXT")
add_column("ideas", "tags", "TEXT")

c.commit()
c.close()
print("Done.")
