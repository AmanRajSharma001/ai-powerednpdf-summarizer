from app.storage import upload_pdf_to_supabase

from app.pdf_processor import(extract_text_from_bytes,splitting_the_text)

from app.embeddings import(transfroming_sentences,cos_sim_similarity)

from app.chunker import chunking_the_text

from app.vector_store import storing_into_faiss

def process_pdf(pdf_bytes,filename):
    #storing original pdf
    upload_pdf_to_supabase(pdf_bytes,filename)

    #extract text
    text=extract_text_from_bytes(pdf_bytes)

    #splitting into sentences
    sentences=splitting_the_text(text)

    #sentence embeddings
    sentence_embeddings=transfroming_sentences(sentences)

    #similarity scores
    similarities=cos_sim_similarity(sentence_embeddings,sentences)

    #smantic chunking
    chunks=chunking_the_text(similarities,sentences)

    #convert list of sentnences to text chunks
    chunk_texts=[" ".join(chunk)
                 for chunk in chunks]
    
    #chunk embeddings
    chunk_embeddings=transfroming_sentences(chunk_texts)

    #save in FAISS
    storing_into_faiss(chunk_embeddings,chunk_texts)

    return{
        "filename":filename,
        "chunks":len(chunk_texts)
    }
