from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from app.core.database import Base


class Testimonial(Base):
    __tablename__ = "testimonials"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    message = Column(String, nullable=False)
    rating = Column(Float, default=5.0)
    image = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
