from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine

from app.models.admin import Admin
from app.models.category import Category
from app.models.product import Product
from app.models.product_image import ProductImage
from app.models.testimonial import Testimonial
from app.models.homepage import Homepage
from app.models.about import About
from app.models.contact import Contact

from app.routers.auth import router as auth_router
from app.routers.categories import router as category_router
from app.routers.products import router as product_router
from app.routers.upload import router as upload_router
from app.routers.testimonials import router as testimonial_router
from app.routers.homepage import router as homepage_router
from app.routers.about import router as about_router
from app.routers.contact import router as contact_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Habee Craft API"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(auth_router)
app.include_router(category_router)
app.include_router(product_router)
app.include_router(upload_router)
app.include_router(testimonial_router)
app.include_router(homepage_router)
app.include_router(about_router)
app.include_router(contact_router)

# Static Files
app.mount(
    "/uploads",
    StaticFiles(directory="app/uploads"),
    name="uploads"
)


@app.get("/")
def root():
    return {
        "message": "Habee Craft API Running"
    }