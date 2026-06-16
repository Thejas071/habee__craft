from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class TestimonialCreate(BaseModel):
    name: str
    message: str
    rating: float = 5.0
    image: Optional[str] = None


class TestimonialUpdate(BaseModel):
    name: str
    message: str
    rating: float = 5.0
    image: Optional[str] = None


class TestimonialResponse(BaseModel):
    id: int
    name: str
    message: str
    rating: float
    image: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
