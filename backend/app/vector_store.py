import faiss
import numpy as np
import os
import json
from app.embeddings import transforming_sentences

def storing_into_faiss(chunk_embeddings,chunk_texts):
    chunk_embeddings=np.array(
        chunk_embeddings,
        dtype=np.float32)
    dimension = chunk_embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(chunk_embeddings)
    
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    index_path = os.path.join(base_dir, "faiss_index.bin")
    chunks_path = os.path.join(base_dir, "chunks.txt")
    
    faiss.write_index(
        index,
        index_path)
    
    with open(
        chunks_path,
        "w",
        encoding="utf-8"
    ) as f:
        json.dump(chunk_texts, f)
    

def search_faiss(query,k=3):
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    index_path = os.path.join(base_dir, "faiss_index.bin")
    chunks_path = os.path.join(base_dir, "chunks.txt")
    
    if not os.path.exists(index_path) or not os.path.exists(chunks_path):
        return []

    index = faiss.read_index(index_path)
    query_embedding = transforming_sentences([query])
    query_embedding = np.array(
        query_embedding,
        dtype=np.float32)
    distances, indices = index.search(query_embedding, k)

    with open(chunks_path, "r", encoding="utf-8") as f:
        stored_chunks = json.load(f)
        result = []

        for idx in indices[0]:
            if idx != -1 and idx < len(stored_chunks):
                result.append(
                    stored_chunks[idx]
                )
        return result

    
