from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.upload import router as upload_router  # Import the upload router
from app.retriever import router as retrive_query

app = FastAPI()

# Global CORS Configuration (Applies to all future modules too)
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

app.include_router(upload_router)
app.include_router(retrive_query) 

# Root route to check if the hub server is alive
@app.get("/")
def read_root():
    return {"message": "FastAPI Hub Server is Running"}
