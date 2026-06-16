from sqlalchemy import Column, Integer, String, Float, ForeignKey

from app.core.database import Base
from sqlalchemy.orm import relationship


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    price = Column(Float, nullable=False)
    image = Column(String)

    category_id = Column(
        Integer,
        ForeignKey("categories.id")
    )

    gallery = relationship("ProductImage", back_populates="product", cascade="all, delete-orphan")