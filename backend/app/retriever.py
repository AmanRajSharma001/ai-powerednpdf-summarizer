from fastapi import APIRouter
from pydantic import BaseModel

from app.vector_store import search_faiss

router = APIRouter()


class QueryRequest(BaseModel):
    query: str


@router.post("/query")
async def retrieve_query(request: QueryRequest):

    retrieved_chunks = search_faiss(
        request.query
    )

    return {
        "query": request.query,
        "retrieved_chunks": retrieved_chunks
    }