from backend.database import engine
from sqlalchemy import text

def migrate():
    print("Running migration to add posted_at columns...")
    with engine.connect() as conn:
        try:
            conn.execute(text("ALTER TABLE ideas ADD COLUMN posted_at DATETIME"))
            print("Added posted_at column.")
        except Exception as e:
            print(f"posted_at column might already exist or error: {e}")
            
        try:
            conn.execute(text("ALTER TABLE ideas ADD COLUMN posted_at_raw TEXT"))
            print("Added posted_at_raw column.")
        except Exception as e:
            print(f"posted_at_raw column might already exist or error: {e}")
            
        conn.commit()
    print("Migration complete.")

if __name__ == "__main__":
    migrate()
