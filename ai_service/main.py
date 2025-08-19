import fitz
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from contextlib import asynccontextmanager
from langchain.text_splitter import RecursiveCharacterTextSplitter
from sentence_transformers import SentenceTransformer
import chromadb
from langchain.schema.document import Document
from langchain_community.llms import Ollama
from langchain.prompts import PromptTemplate
from langchain.chains.question_answering import load_qa_chain
import re

pipeline = {}

class Query(BaseModel):
    question: str
    document_name: str

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("--- Server is starting up: Loading shared models ---")
    pipeline['embedding_model'] = SentenceTransformer('all-MiniLM-L6-v2')
    llm = Ollama(model="phi3:mini")
    prompt_template = """
        You are an expert document analysis assistant. Your role is to accurately answer user queries using both retrieved context documents and your general reasoning abilities. Always follow this workflow:

        Review the retrieved documents carefully.

        Use only the information present in the retrieved documents as the primary source of truth.

        If the documents do not contain the answer, say so explicitly instead of guessing.

        Answer only using retrieved documents.  
        Be concise, accurate, no extra info.

        Context: {context}

        Question: {question}

        Answer: """
    prompt = PromptTemplate.from_template(prompt_template)
    pipeline['qa_chain'] = load_qa_chain(llm, chain_type="stuff", prompt=prompt)
    pipeline['chroma_client'] = chromadb.Client()
    print("--- Startup complete. Models are loaded and ready. ---")
    yield
    print("--- Server is shutting down. ---")

app = FastAPI(
    title="Intelligent Document Q&A API",
    lifespan=lifespan
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173", "http://127.0.0.1:5174"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process-document")
async def process_document(file: UploadFile = File(...)):
    print(f"--- Processing uploaded file: {file.filename} ---")
    
    embedding_model = pipeline['embedding_model']
    chroma_client = pipeline['chroma_client']
    
    try:
        file_content = await file.read()
        
        full_text = ""
        with fitz.open(stream=file_content) as doc:
            for page in doc:
                full_text += page.get_text()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error processing file: {e}")
        
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    chunks = text_splitter.split_text(full_text)
    
    embeddings = embedding_model.encode(chunks)
    
    collection_name = re.sub(r'[^a-zA-Z0-9_-]', '_', file.filename)
    collection = chroma_client.get_or_create_collection(name=collection_name)
    
    collection.add(embeddings=embeddings.tolist(), documents=chunks, ids=[f"chunk_{i}" for i in range(len(chunks))])
    
    return {"status": "success", "message": f"Document '{file.filename}' processed and stored in collection '{collection_name}'."}


@app.post("/query")
def process_query(query: Query):
    embedding_model = pipeline['embedding_model']
    qa_chain = pipeline['qa_chain']
    chroma_client = pipeline['chroma_client']
    
    collection_name = re.sub(r'[^a-zA-Z0-9_-]', '_', query.document_name)
    
    try:
        collection = chroma_client.get_collection(name=collection_name)
    except ValueError:
        raise HTTPException(status_code=404, detail=f"Document '{query.document_name}' not found. Please process it first.")
    
    query_embedding = embedding_model.encode([query.question])
    
    results = collection.query(query_embeddings=query_embedding.tolist(), n_results=2)
    retrieved_documents = [Document(page_content=doc) for doc in results['documents'][0]]
    
    if not retrieved_documents:
        return {"response": "Could not find relevant information in the document to answer the question."}

    answer = qa_chain.invoke({"input_documents": retrieved_documents, "question": query.question})
    
    return {"response": answer["output_text"]}

@app.get("/")
def read_root():
    return {"message": "Welcome! Navigate to /docs for the API documentation."}