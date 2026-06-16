from sqlalchemy import Column, Integer, String, Text
from app.core.database import Base


class Contact(Base):
    __tablename__ = "contact"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), default="info@habeecraft.com")
    phone = Column(String(50), default="+919876543210")
    whatsapp = Column(String(50), default="+919876543210")
    address = Column(Text, default="Koramangala, Bangalore, Karnataka, India")
    hours = Column(String(100), default="Monday to Sunday, 9am - 8pm")
    map_link = Column(Text, nullable=True)
    instagram = Column(String(100), default="habee_craft")
