from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import get_current_admin
from app.core.database import get_db
from app.models.contact import Contact
from app.schemas.contact import ContactResponse, ContactUpdate

router = APIRouter(prefix="/contact", tags=["contact"])


def get_or_create_contact(db: Session) -> Contact:
    """Get or auto-create the singleton contact record."""
    record = db.query(Contact).first()
    if not record:
        record = Contact()
        db.add(record)
        db.commit()
        db.refresh(record)
    return record


@router.get("/", response_model=ContactResponse)
def get_contact(db: Session = Depends(get_db)):
    return get_or_create_contact(db)


@router.put("/", response_model=ContactResponse)
def update_contact(
    data: ContactUpdate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin),
):
    record = get_or_create_contact(db)
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(record, key, value)
    db.commit()
    db.refresh(record)
    return record
