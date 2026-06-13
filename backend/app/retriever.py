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
    print(f"DEBUG: User Question: {request.question}")

    # Search and clean empty chunks
    retrieved_chunks = search_faiss(request.question)
    retrieved_chunks = [chunk.strip() for chunk in retrieved_chunks if chunk and chunk.strip()]

    print(f"DEBUG: Retrieved Chunks Count: {len(retrieved_chunks)}")
    for i, chunk in enumerate(retrieved_chunks):
         print(f"DEBUG: Retrieved Chunk {i+1} Preview: {chunk[:100]}...")

    if not retrieved_chunks:
        answer = "I could not find that information in the uploaded document."
        print(f"DEBUG: Final Answer Returned: {answer}")
        return {"answer": answer}

    answer = generate_answer(
        request.question,
        retrieved_chunks
    )

    print(f"DEBUG: Final Answer Returned: {answer}")
    return {"answer": answer}


