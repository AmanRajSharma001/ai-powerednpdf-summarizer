import faiss
import numpy as np
from app.embeddings import transforming_sentences

def storing_into_faiss(chunk_embeddings,chunk_texts):
    chunk_embeddings=np.array(
        chunk_embeddings,
        dtype=np.float32)
    dimension = chunk_embeddings.shape[1]
    index = faiss.IndexFlatL2(dimension)
    index.add(chunk_embeddings)
    faiss.write_index(
        index,
        "faiss_index.bin")
    with open(
        "chunks.txt",
        "w",
        encoding="utf-8"
    ) as f:

        for chunk in chunk_texts:
            f.write(chunk + "\n")
    

def search_faiss(query,k=3):

    index = faiss.read_index("faiss_index.bin")
    query_embedding = transforming_sentences([query])
    query_embedding = np.array(
        query_embedding,
        dtype=np.float32)
    distances, indices = index.search(query_embedding, k)

    with open("chunks.txt","r",encoding="utf-8") as f:
        stored_chunks=f.readlines()
        result=[]

        for idx in indices[0]:
            if idx != -1 and idx < len(stored_chunks):
                result.append(
                    stored_chunks[idx].strip()
                )
        return result
    
