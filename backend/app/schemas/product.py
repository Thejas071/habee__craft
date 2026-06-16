from pydantic import BaseModel, field_validator


class ProductCreate(BaseModel):
    name: str
    description: str
    price: float
    image: str
    category_id: int
    gallery: list[str] = []


class ProductUpdate(BaseModel):
    name: str
    description: str
    price: float
    image: str
    category_id: int
    gallery: list[str] = []


class ProductResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    image: str
    category_id: int
    gallery: list[str] = []

    class Config:
        from_attributes = True

    @field_validator('gallery', mode='before')
    @classmethod
    def convert_gallery(cls, v):
        if not v:
            return []
        if isinstance(v, list):
            return [img.image if hasattr(img, 'image') else img for img in v]
        return v