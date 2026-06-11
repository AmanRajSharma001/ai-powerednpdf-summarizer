import os
import requests
from dotenv import load_dotenv

load_dotenv()

HF_TOKEN = os.getenv("HF_TOKEN")

API_URL = "https://router.huggingface.co/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {HF_TOKEN}",
}

def query(payload):
    response = requests.post(
        API_URL,
        headers=headers,
        json=payload
    )
    return response.json()

def generate_answer(query_str: str, chunks: list[str]) -> str:
    context = "\n\n".join(chunks)
    prompt = f"""Use the following context to answer the question. If you do not know the answer or if the context does not contain the answer, say "I cannot find the answer in the provided document."

Context:
{context}

Question: {query_str}

Answer:"""

    payload = {
        "messages": [
            {
                "role": "user",
                "content": prompt
            }
        ],
        "model": "Qwen/Qwen2.5-0.5B-Instruct:featherless-ai"
    }

    try:
        response = query(payload)
        if "choices" in response and len(response["choices"]) > 0:
            return response["choices"][0]["message"]["content"]
        else:
            return f"Error: No content generated from Hugging Face API. Response: {response}"
    except Exception as e:
        return f"Error querying Hugging Face API: {str(e)}"

if __name__ == "__main__":
    response = query({
        "messages": [
            {
                "role": "user",
                "content": "What is the capital of France?"
            }
        ],
        "model": "Qwen/Qwen2.5-0.5B-Instruct:featherless-ai"
    })

    print(response["choices"][0]["message"]["content"])