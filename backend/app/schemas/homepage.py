from pydantic import BaseModel
from typing import Optional


class HomepageBase(BaseModel):
    hero_title: Optional[str] = None
    hero_subtitle: Optional[str] = None
    hero_button_text: Optional[str] = None
    hero_image: Optional[str] = None
    section_title: Optional[str] = None


class HomepageUpdate(HomepageBase):
    pass


class HomepageResponse(HomepageBase):
    id: int

    class Config:
        from_attributes = True
