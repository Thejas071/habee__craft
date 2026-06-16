from sqlalchemy import Column, Integer, String, Text
from app.core.database import Base


class Homepage(Base):
    __tablename__ = "homepage"

    id = Column(Integer, primary_key=True, index=True)
    hero_title = Column(String(255), default="Handmade Gifts & Premium Bouquets")
    hero_subtitle = Column(Text, default="Discover beautiful handcrafted gifts, premium flower bouquets, and memorable custom creations made to celebrate every special occasion.")
    hero_button_text = Column(String(100), default="Shop Collection")
    hero_image = Column(String(255), nullable=True)
    section_title = Column(String(255), default="Why Choose Habee Craft?")
