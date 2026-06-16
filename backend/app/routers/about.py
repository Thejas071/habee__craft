from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import get_current_admin
from app.core.database import get_db
from app.models.about import About
from app.schemas.about import AboutResponse, AboutUpdate

router = APIRouter(prefix="/about", tags=["about"])


def get_or_create_about(db: Session) -> About:
    """Get or auto-create the singleton about record."""
    record = db.query(About).first()
    if not record:
        record = About()
        db.add(record)
        db.commit()
        db.refresh(record)
    return record


@router.get("/", response_model=AboutResponse)
def get_about(db: Session = Depends(get_db)):
    return get_or_create_about(db)


@router.put("/", response_model=AboutResponse)
def update_about(
    data: AboutUpdate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    record = get_or_create_about(db)
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(record, key, value)
    db.commit()
    db.refresh(record)
    return record
