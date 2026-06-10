from fastapi import APIRouter, UploadFile, File
from app.pdf_processor import extract_text_from_bytes
from app.storage import upload_pdf_to_supabase

# Create a router instance for handling upload-related features
router = APIRouter()

@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    # 1. Read file into memory bytes
    pdf_bytes = await file.read()

    # 2. Upload to Supabase Storage
    upload_pdf_to_supabase(pdf_bytes, file.filename)

    # 3. Extract text using PyMuPDF
    text = extract_text_from_bytes(pdf_bytes)

    # 4. Print preview to console
    print(text[:500])

    return {
        "message": "Uploaded to Supabase",
        "filename": file.filename
    }