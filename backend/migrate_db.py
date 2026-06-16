import os
from sqlalchemy import create_engine, text
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
DATABASE_URL = "postgresql://postgres:admin123@localhost:5432/habee_craft"
engine = create_engine(DATABASE_URL)

with engine.connect() as conn:
    # 1. Fetch current passwords
    try:
        result = conn.execute(text("SELECT id, password FROM admins")).fetchall()
        print("Found password column.")
    except Exception as e:
        conn.rollback()
        # Maybe already renamed
        try:
            result = conn.execute(text("SELECT id, password_hash FROM admins")).fetchall()
            print("Found password_hash column.")
        except Exception as e:
            conn.rollback()
            print("Error fetching passwords.")
            result = []

    # 2. Add recovery_code_hash
    try:
        conn.execute(text("ALTER TABLE admins ADD COLUMN recovery_code_hash VARCHAR;"))
        conn.commit()
        print("Added recovery_code_hash.")
    except Exception as e:
        conn.rollback()
        print("recovery_code_hash exists or error.")

    # 3. Rename password to password_hash
    try:
        conn.execute(text("ALTER TABLE admins RENAME COLUMN password TO password_hash;"))
        conn.commit()
        print("Renamed password to password_hash.")
    except Exception as e:
        conn.rollback()
        print("password_hash exists or error.")
    
    # 4. Hash existing plain text passwords
    for row in result:
        admin_id = row[0]
        pwd = row[1]
        # Only hash if it's not already a bcrypt hash (bcrypt starts with $2b$ or $2a$)
        if pwd and not pwd.startswith("$2"):
            hashed_pwd = pwd_context.hash(pwd)
            conn.execute(text("UPDATE admins SET password_hash = :hash WHERE id = :id"), {"hash": hashed_pwd, "id": admin_id})
            conn.commit()
            print(f"Hashed password for admin id {admin_id}")
