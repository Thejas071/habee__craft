from pydantic import BaseModel
from typing import Optional


class AboutBase(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    description2: Optional[str] = None
    image: Optional[str] = None
    value1_title: Optional[str] = None
    value1_text: Optional[str] = None
    value2_title: Optional[str] = None
    value2_text: Optional[str] = None
    value3_title: Optional[str] = None
    value3_text: Optional[str] = None


class AboutUpdate(AboutBase):
    pass


class AboutResponse(AboutBase):
    id: int

    class Config:
        from_attributes = True
