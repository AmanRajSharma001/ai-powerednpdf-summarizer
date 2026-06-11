from fastapi import APIRouter
from pydantic import BaseModel

from app.vector_store import search_faiss
from app.llm import generate_answer

router = APIRouter()


class QueryRequest(BaseModel):
    query: str


class AskRequest(BaseModel):
    question: str


@router.post("/query")
async def retrieve_query(request: QueryRequest):

    retrieved_chunks = search_faiss(
        request.query
    )

    answer = generate_answer(
        request.query,
        retrieved_chunks
    )

    return {
        "query": request.query,
        "retrieved_chunks": retrieved_chunks,
        "answer": answer
    }


@router.post("/ask")
async def ask_question(request: AskRequest):

    retrieved_chunks = search_faiss(
        request.question
    )

    answer = generate_answer(
        request.question,
        retrieved_chunks
    )

    return {
        "question": request.question,
        "retrieved_chunks": retrieved_chunks,
        "answer": answer
    }

