from pydantic import BaseModel
from typing import Optional


class ContactBase(BaseModel):
    email: Optional[str] = None
    phone: Optional[str] = None
    whatsapp: Optional[str] = None
    address: Optional[str] = None
    hours: Optional[str] = None
    map_link: Optional[str] = None
    instagram: Optional[str] = None


class ContactUpdate(ContactBase):
    pass


class ContactResponse(ContactBase):
    id: int

    class Config:
        from_attributes = True
