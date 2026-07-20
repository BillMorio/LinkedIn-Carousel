"""Add ideas.watchlist_id and backfill it for already-scraped posts.

Links existing ideas to their creator by matching the scraped niche_tag (author name)
to the watchlist display_name as a case-insensitive prefix — handles name suffixes
like ", MBA" that previously broke the name-based lookup. Idempotent.

Usage: python migrate_watchlist_link.py
"""
import sqlite3
from pathlib import Path

DB = Path(__file__).parent / "forge.db"
c = sqlite3.connect(DB)

# 1. Add the column if it doesn't exist yet
cols = [r[1] for r in c.execute("PRAGMA table_info(ideas)").fetchall()]
if "watchlist_id" not in cols:
    c.execute("ALTER TABLE ideas ADD COLUMN watchlist_id INTEGER")
    print("Added ideas.watchlist_id column")
else:
    print("ideas.watchlist_id already exists")

# 2. Backfill: link each idea to a watchlist whose display_name prefixes the niche_tag
total = 0
for wid, name in c.execute("SELECT id, display_name FROM watchlist").fetchall():
    if not name:
        continue
    cur = c.execute(
        "UPDATE ideas SET watchlist_id = ? "
        "WHERE watchlist_id IS NULL AND niche_tag IS NOT NULL "
        "AND lower(niche_tag) LIKE lower(?) || '%'",
        (wid, name.strip()),
    )
    if cur.rowcount:
        print(f"  linked {cur.rowcount:>3} ideas -> watchlist {wid} ({name})")
        total += cur.rowcount

c.commit()
linked = c.execute("SELECT COUNT(*) FROM ideas WHERE watchlist_id IS NOT NULL").fetchone()[0]
grand = c.execute("SELECT COUNT(*) FROM ideas").fetchone()[0]
print(f"Backfilled {total} ideas. Now linked: {linked}/{grand}")
c.close()
