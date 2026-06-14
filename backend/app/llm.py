import os
import requests
from dotenv import load_dotenv

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(base_dir, ".env"))

HF_TOKEN = os.getenv("HF_TOKEN")

API_URL = "https://router.huggingface.co/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {HF_TOKEN}",
    "Content-Type": "application/json",
}

FALLBACK_UNAVAILABLE = "The AI service is currently unavailable. Please try again later."
FALLBACK_NOT_FOUND   = "I could not find that information in the uploaded document."


def _call_hf(payload: dict) -> dict:
    """Low-level POST to HuggingFace router; raises on non-200."""
    response = requests.post(
        API_URL,
        headers=headers,
        json=payload,
        timeout=30,
    )
    response.raise_for_status()
    return response.json()


def generate_answer(query_str: str, chunks: list) -> str:
    """
    Build a RAG prompt from retrieved chunks and query the LLM.

    Returns a clean string answer. Never raises — all errors result in
    a user-friendly fallback message.
    """
    if not chunks:
        return FALLBACK_NOT_FOUND

    context = "\n\n".join(chunks)

    prompt = (
        "You are a helpful assistant. Use only the context below to answer "
        "the question. If the answer is not contained in the context, say "
        "\"I could not find that information in the uploaded document.\"\n\n"
        f"Context:\n{context}\n\n"
        f"Question: {query_str}\n\n"
        "Answer:"
    )

    payload = {
        "messages": [{"role": "user", "content": prompt}],
        "model": "Qwen/Qwen2.5-0.5B-Instruct:featherless-ai",
        "max_tokens": 512,
    }

    try:
        data = _call_hf(payload)

        choices = data.get("choices") or []
        if not choices:
            return FALLBACK_UNAVAILABLE

        content = choices[0].get("message", {}).get("content", "").strip()
        return content if content else FALLBACK_UNAVAILABLE

    except requests.exceptions.Timeout:
        return FALLBACK_UNAVAILABLE

    except requests.exceptions.HTTPError as exc:
        status = exc.response.status_code if exc.response is not None else 0
        if status in (503, 429):
            return FALLBACK_UNAVAILABLE
        return FALLBACK_UNAVAILABLE

    except Exception:
        return FALLBACK_UNAVAILABLE


if __name__ == "__main__":
    ans = generate_answer("What is the capital of France?", ["France is a country in Europe. Paris is its capital."])
    print(ans)