from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.auth import get_current_admin
from app.core.database import get_db
from app.models.product import Product
from app.models.product_image import ProductImage

from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse
)

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


@router.post(
    "/",
    response_model=ProductResponse
)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin)
):
    new_product = Product(
        name=product.name,
        description=product.description,
        price=product.price,
        image=product.image,
        category_id=product.category_id
    )

    db.add(new_product)
    db.commit()
    db.refresh(new_product)

    if product.gallery:
        for img_path in product.gallery:
            db.add(ProductImage(product_id=new_product.id, image=img_path))
        db.commit()
        db.refresh(new_product)

    return new_product


@router.get(
    "/",
    response_model=list[ProductResponse]
)
def get_products(
    search: str = "",
    sort: str = "newest",
    db: Session = Depends(get_db)
):
    query = db.query(Product)

    if search:
        query = query.filter(
            Product.name.ilike(f"%{search}%")
        )

    if sort == "low_to_high":
        query = query.order_by(
            Product.price.asc()
        )

    elif sort == "high_to_low":
        query = query.order_by(
            Product.price.desc()
        )

    else:
        query = query.order_by(
            Product.id.desc()
        )

    return query.all()


@router.get(
    "/{product_id}",
    response_model=ProductResponse
)
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    return product


@router.put(
    "/{product_id}",
    response_model=ProductResponse
)
def update_product(
    product_id: int,
    product_data: ProductUpdate,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin)
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    product.name = product_data.name
    product.description = product_data.description
    product.price = product_data.price
    product.image = product_data.image
    product.category_id = product_data.category_id

    # Update gallery images
    db.query(ProductImage).filter(ProductImage.product_id == product_id).delete()
    if product_data.gallery:
        for img_path in product_data.gallery:
            db.add(ProductImage(product_id=product_id, image=img_path))

    db.commit()
    db.refresh(product)

    return product


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin)
):
    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    db.delete(product)
    db.commit()

    return {
        "message": "Product deleted successfully"
    }