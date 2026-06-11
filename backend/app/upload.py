from fastapi import APIRouter, UploadFile, File
from app.pipeline import process_pdf

# Create a router instance for handling upload-related features
router = APIRouter()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    # 1. Read file into memory bytes
    pdf_bytes = await file.read()
    result=process_pdf(
        pdf_bytes,
        file.filename
    )
    return result