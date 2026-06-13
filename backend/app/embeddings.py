import os
from dotenv import load_dotenv
from sentence_transformers import SentenceTransformer,util

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(base_dir, ".env"))

def transforming_sentences(sentences):
    model=SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    embeddings=model.encode(sentences)
    return embeddings
def cos_sim_similarity(embeddings):

    similarities = []

    for i in range(len(embeddings) - 1):

        score = util.cos_sim(
            embeddings[i],
            embeddings[i + 1]
        ).item()

        similarities.append(score)

    return similarities