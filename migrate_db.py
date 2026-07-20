import sqlite3
import os

def migrate():
    db_path = 'forge.db'
    if not os.path.exists(db_path):
        print(f"Database not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    columns_to_add = [
        ('author_name', 'TEXT'),
        ('author_headline', 'TEXT'),
        ('author_avatar_url', 'TEXT'),
        ('author_profile_url', 'TEXT')
    ]

    # Get current columns
    cursor.execute('PRAGMA table_info(ideas)')
    current_columns = [row[1] for row in cursor.fetchall()]

    for col_name, col_type in columns_to_add:
        if col_name not in current_columns:
            print(f"Adding column {col_name} to ideas table...")
            try:
                cursor.execute(f'ALTER TABLE ideas ADD COLUMN {col_name} {col_type}')
            except Exception as e:
                print(f"Error adding {col_name}: {e}")
        else:
            print(f"Column {col_name} already exists.")

    conn.commit()
    conn.close()
    print("Migration complete.")

if __name__ == "__main__":
    migrate()
