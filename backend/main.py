from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware

from app.pdf_processor import extract_text_from_bytes
from app.storage import upload_pdf_to_supabase

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):

    pdf_bytes = await file.read()

    upload_pdf_to_supabase(
        pdf_bytes,
        file.filename
    )

    text = extract_text_from_bytes(pdf_bytes)

    print(text[:500])

    return {
        "message": "Uploaded to Supabase",
        "filename": file.filename
    }