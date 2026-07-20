import sqlite3
import os

db_path = "forge.db"

if not os.path.exists(db_path):
    print(f"Database not found at {db_path}")
    exit(1)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

new_columns = [
    ("media_url", "TEXT"),
    ("media_metadata", "TEXT"),
    ("analysis_funnel_stage", "TEXT"),
    ("analysis_giveaway", "TEXT"),
    ("analysis_full_json", "TEXT")
]

for col_name, col_type in new_columns:
    try:
        print(f"Adding column {col_name}...")
        cursor.execute(f"ALTER TABLE ideas ADD COLUMN {col_name} {col_type}")
    except sqlite3.OperationalError:
        print(f"Column {col_name} already exists.")

conn.commit()
conn.close()
print("Migration complete.")
