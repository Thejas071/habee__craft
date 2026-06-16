import os
from sqlalchemy import create_engine, text
import bcrypt

DATABASE_URL = "postgresql://postgres:admin123@localhost:5432/habee_craft"
engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    try:
        result = conn.execute(text("SELECT id, password_hash FROM admins")).fetchall()
        for row in result:
            admin_id = row[0]
            pwd = row[1]
            if pwd and not pwd.startswith("$2"):
                # Hash using bcrypt directly
                hashed = bcrypt.hashpw(pwd.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
                conn.execute(text("UPDATE admins SET password_hash = :hash WHERE id = :id"), {"hash": hashed, "id": admin_id})
                conn.commit()
                print(f"Hashed password for admin id {admin_id}")
    except Exception as e:
        print("Error:", e)
