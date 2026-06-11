from app.storage import upload_pdf_to_supabase

from app.pdf_processor import (
    extract_text_from_bytes,
    splitting_the_text
)

from app.embeddings import (
    transforming_sentences,
    cos_sim_similarity
)

from app.chunker import chunking_the_text

from app.vector_store import storing_into_faiss


def process_pdf(pdf_bytes, filename):

    # Store original PDF
    upload_pdf_to_supabase(
        pdf_bytes,
        filename
    )

    # Extract text
    text = extract_text_from_bytes(
        pdf_bytes
    )

    print("\n===== EXTRACTED TEXT =====")
    print(text[:500])

    # Split into sentences
    sentences = splitting_the_text(
        text
    )

    print("\n===== SENTENCES =====")
    print(f"Total Sentences: {len(sentences)}")

    # Sentence embeddings
    sentence_embeddings = transforming_sentences(
        sentences
    )

    print("\n===== EMBEDDINGS =====")
    print(f"Shape: {sentence_embeddings.shape}")

    # Similarity scores
    similarities = cos_sim_similarity(
        sentence_embeddings
    )

    print("\n===== SIMILARITIES =====")
    print(similarities[:10])

    # Semantic chunking
    chunks = chunking_the_text(
        similarities,
        sentences
    )

    print("\n===== CHUNKS =====")
    print(f"Total Chunks: {len(chunks)}")

    # Convert list of sentences into text chunks
    chunk_texts = [
        " ".join(chunk)
        for chunk in chunks
    ]

    # Chunk embeddings
    chunk_embeddings = transforming_sentences(
        chunk_texts
    )

    print("\n===== CHUNK EMBEDDINGS =====")
    print(f"Shape: {chunk_embeddings.shape}")

    # Store in FAISS
    storing_into_faiss(
        chunk_embeddings,
        chunk_texts
    )

    print("\n===== STORED IN FAISS =====")

    return {
        "message": "PDF Processed Successfully",
        "filename": filename,
        "total_sentences": len(sentences),
        "total_chunks": len(chunk_texts),
        "first_chunk": chunk_texts[0] if chunk_texts else "No chunks generated"
    }