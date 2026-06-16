import os
import secrets
from datetime import datetime, timedelta

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from jose import jwt

from app.core.database import get_db
from app.models.admin import Admin
from app.core.auth import get_password_hash, verify_password, get_current_admin
from app.schemas.auth import (
    LoginRequest,
    TokenResponse,
    VerifyRecoveryRequest,
    ResetPasswordRequest
)

SECRET_KEY = "habeecraftsecretkey"
ALGORITHM = "HS256"

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/login", response_model=TokenResponse)
def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.username == credentials.username).first()
    if not admin:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    if not verify_password(credentials.password, admin.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    payload = {
        "sub": admin.username,
        "exp": datetime.utcnow() + timedelta(hours=24)
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return {"access_token": token, "token_type": "bearer"}


@router.get("/recovery-code")
def get_recovery_code(admin_username: str = Depends(get_current_admin), db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.username == admin_username).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
        
    if admin.recovery_code_hash:
        return {"code": None}

    recovery_code = secrets.token_hex(8)
    admin.recovery_code_hash = get_password_hash(recovery_code)
    db.commit()

    return {"code": recovery_code}


@router.post("/verify-recovery")
def verify_recovery(req: VerifyRecoveryRequest, db: Session = Depends(get_db)):
    admin = db.query(Admin).first()
    if not admin or not admin.recovery_code_hash:
        raise HTTPException(status_code=400, detail="Invalid recovery code")

    if not verify_password(req.recovery_code, admin.recovery_code_hash):
        raise HTTPException(status_code=400, detail="Invalid recovery code")

    payload = {
        "sub": admin.username,
        "purpose": "password_reset",
        "exp": datetime.utcnow() + timedelta(minutes=15)
    }
    reset_token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return {"reset_token": reset_token}


@router.post("/reset-password")
def reset_password(req: ResetPasswordRequest, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(req.token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("purpose") != "password_reset":
            raise ValueError("Invalid token purpose")
        username = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid or expired reset token")

    admin = db.query(Admin).filter(Admin.username == username).first()
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")

    admin.password_hash = get_password_hash(req.new_password)
    db.commit()
    return {"message": "Password updated successfully"}