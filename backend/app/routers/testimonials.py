from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import get_current_admin
from app.core.database import get_db
from app.models.testimonial import Testimonial
from app.schemas.testimonial import (
    TestimonialCreate,
    TestimonialUpdate,
    TestimonialResponse
)

router = APIRouter(
    prefix="/testimonials",
    tags=["Testimonials"]
)


@router.post(
    "/",
    response_model=TestimonialResponse
)
def create_testimonial(
    testimonial: TestimonialCreate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin)
):
    new_testimonial = Testimonial(
        name=testimonial.name,
        message=testimonial.message,
        rating=testimonial.rating,
        image=testimonial.image
    )

    db.add(new_testimonial)
    db.commit()
    db.refresh(new_testimonial)

    return new_testimonial


@router.get(
    "/",
    response_model=list[TestimonialResponse]
)
def get_testimonials(
    db: Session = Depends(get_db)
):
    return db.query(Testimonial).order_by(Testimonial.id.desc()).all()


@router.get(
    "/{testimonial_id}",
    response_model=TestimonialResponse
)
def get_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db)
):
    testimonial = (
        db.query(Testimonial)
        .filter(Testimonial.id == testimonial_id)
        .first()
    )

    if not testimonial:
        raise HTTPException(
            status_code=404,
            detail="Testimonial not found"
        )

    return testimonial


@router.put(
    "/{testimonial_id}",
    response_model=TestimonialResponse
)
def update_testimonial(
    testimonial_id: int,
    testimonial_data: TestimonialUpdate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin)
):
    testimonial = (
        db.query(Testimonial)
        .filter(Testimonial.id == testimonial_id)
        .first()
    )

    if not testimonial:
        raise HTTPException(
            status_code=404,
            detail="Testimonial not found"
        )

    testimonial.name = testimonial_data.name
    testimonial.message = testimonial_data.message
    testimonial.rating = testimonial_data.rating
    testimonial.image = testimonial_data.image

    db.commit()
    db.refresh(testimonial)

    return testimonial


@router.delete("/{testimonial_id}")
def delete_testimonial(
    testimonial_id: int,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin)
):
    testimonial = (
        db.query(Testimonial)
        .filter(Testimonial.id == testimonial_id)
        .first()
    )

    if not testimonial:
        raise HTTPException(
            status_code=404,
            detail="Testimonial not found"
        )

    db.delete(testimonial)
    db.commit()

    return {
        "message": "Testimonial deleted successfully"
    }
