from fastapi import APIRouter
from pydantic import BaseModel

from app.vector_store import search_faiss
from app.llm import generate_answer, FALLBACK_UNAVAILABLE

router = APIRouter()


class QueryRequest(BaseModel):
    query: str


class AskRequest(BaseModel):
    question: str


@router.post("/query")
async def retrieve_query(request: QueryRequest):
    """RAG endpoint used by the /query route (kept for compatibility)."""
    try:
        retrieved_chunks = search_faiss(request.query)
        answer = generate_answer(request.query, retrieved_chunks)
        return {
            "query": request.query,
            "retrieved_chunks": retrieved_chunks,
            "answer": answer,
        }
    except Exception:
        return {"query": request.query, "retrieved_chunks": [], "answer": FALLBACK_UNAVAILABLE}


@router.post("/ask")
async def ask_question(request: AskRequest):
    """Primary chat endpoint called by the frontend."""
    try:
        retrieved_chunks = search_faiss(request.question)
        retrieved_chunks = [c.strip() for c in retrieved_chunks if c and c.strip()]

        if not retrieved_chunks:
            return {"answer": "I could not find that information in the uploaded document."}

        answer = generate_answer(request.question, retrieved_chunks)
        return {"answer": answer}

    except Exception:
        return {"answer": FALLBACK_UNAVAILABLE}
