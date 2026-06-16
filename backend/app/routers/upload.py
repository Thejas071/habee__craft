from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends
)

import shutil
import os

from app.core.auth import get_current_admin

router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)

UPLOAD_DIR = "app/uploads/products"


@router.post("/")
def upload_image(
    file: UploadFile = File(...),
    admin: str = Depends(get_current_admin)
):
    file_path = os.path.join(
        UPLOAD_DIR,
        file.filename
    )

    with open(
        file_path,
        "wb"
    ) as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    return {
        "filename": file.filename,
        "path": f"/uploads/products/{file.filename}"
    }