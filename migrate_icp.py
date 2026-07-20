"""Add ICP / About columns for the ICP-analysis feature. Idempotent.

- ideas.icp_json        : post-level ICP (who a single post targets)
- watchlist.about       : scraped LinkedIn About/bio
- watchlist.icp_json    : profile-level ICP (who the creator helps)
- watchlist.icp_updated_at : freshness stamp for the profile ICP

Usage: python migrate_icp.py
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


add_column("ideas", "icp_json", "TEXT")
add_column("watchlist", "about", "TEXT")
add_column("watchlist", "icp_json", "TEXT")
add_column("watchlist", "icp_updated_at", "DATETIME")

c.commit()
c.close()
print("Done.")
