from sqlalchemy import Column, Integer, String, Text
from app.core.database import Base


class About(Base):
    __tablename__ = "about"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), default="About Habee Craft")
    subtitle = Column(String(255), default="Our story, our passion, and our handcrafted promise.")
    description = Column(Text, default="Welcome to Habee Craft, where we transform standard gifting into unforgettable personal experiences.")
    description2 = Column(Text, nullable=True)
    image = Column(String(255), nullable=True)
    value1_title = Column(String(100), default="Handmade Quality")
    value1_text = Column(Text, default="Every bouquet is wrapped by hand, and every gift box is curated individually to assure the highest standard.")
    value2_title = Column(String(100), default="Crafted with Love")
    value2_text = Column(Text, default="We believe gifts carry emotions. Our designs focus on delivering pure joy and warmth to your loved ones.")
    value3_title = Column(String(100), default="Local Artistry")
    value3_text = Column(Text, default="We collaborate with local craftspeople and flower nurseries, supporting communities and choosing freshness.")
