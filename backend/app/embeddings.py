from sentence_transformers import SentenceTransformer,util

def transfroming_sentences(sentences):
    model=SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    embeddings=model.encode(sentences)
    return embeddings
def cos_sim_similarity(embeddings,sentences):
    similarities = []
    for i in range(len(sentences) - 1):
        score = util.cos_sim(
            embeddings[i],
            embeddings[i + 1]
        ).item()
        similarities.append(score)
    return similarities
   