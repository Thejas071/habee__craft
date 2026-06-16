from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import get_current_admin
from app.core.database import get_db
from app.models.homepage import Homepage
from app.schemas.homepage import HomepageResponse, HomepageUpdate

router = APIRouter(prefix="/homepage", tags=["homepage"])


def get_or_create_homepage(db: Session) -> Homepage:
    """Get or auto-create the singleton homepage record."""
    record = db.query(Homepage).first()
    if not record:
        record = Homepage()
        db.add(record)
        db.commit()
        db.refresh(record)
    return record


@router.get("/", response_model=HomepageResponse)
def get_homepage(db: Session = Depends(get_db)):
    return get_or_create_homepage(db)


@router.put("/", response_model=HomepageResponse)
def update_homepage(
    data: HomepageUpdate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    record = get_or_create_homepage(db)
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(record, key, value)
    db.commit()
    db.refresh(record)
    return record
