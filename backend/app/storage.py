import os
from tkinter import Tk, filedialog
from supabase import create_client, Client
import io

# 1. Initialize Supabase Client
# Replace these with your actual Supabase Project URL and Anon API key
SUPABASE_URL: str = "https://qzvwnjpugmbjzwvhcjtr.supabase.co"
SUPABASE_KEY: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6dnduanB1Z21ianp3dmhjanRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA5MzAxNjYsImV4cCI6MjA5NjUwNjE2Nn0.oZBiAm2QjMmTRnfxa5lMDlUGRtonbp5T0hvesbrapLQ" 
supabase = create_client(
    SUPABASE_URL,
    SUPABASE_KEY
)

BUCKET_NAME = "pdfs"

def upload_pdf_to_supabase(pdf_bytes, filename):

    response = supabase.storage.from_(BUCKET_NAME).upload(
        path=filename,
        file=pdf_bytes,
        file_options={
            "content-type": "application/pdf",
            "upsert": "true"
        }
    )

    return response
