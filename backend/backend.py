from os import getenv
from dotenv import load_dotenv
from langchain.chains import RetrievalQA
from langchain.document_loaders import PDFMinerLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from transformers import pipeline
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from langchain.llms import HuggingFacePipeline
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import FAISS
from pydantic import BaseModel
app = FastAPI()

# CORS setup for development (replace '*' in prod)
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global shared resources
generate_text = None
embeddings = None
vector_store = None

@app.on_event("startup")
def startup_event():
    global generate_text, embeddings, vector_store

    # Load environment variables
    load_dotenv()

    # Model and embedding config
    model_path = getenv("MODEL_PATH", "google-bert/bert-base-uncased")
    embedding_model_name = getenv("EMBEDDING_MODEL_NAME", "sentence-transformers/all-MiniLM-L6-v2")
    cache_folder = getenv("CACHE_FOLDER", "./model_cache")
    device = "cpu"

    # Load text generation pipeline
    print(f"[INFO] Loading language model: {model_path} on {device}")
    generate_text = pipeline(
        "text-generation",
        model=model_path,
        tokenizer=model_path,
        device=-1,
        do_sample=True,
        temperature=0.7,
        top_p=0.9,
        max_new_tokens=100,
        repetition_penalty=1.2
    )

    # Sample inference test
    test_output = generate_text("What is the capital of France?")[0]["generated_text"]
    print("[TEST OUTPUT]", test_output)

    # Load embeddings
    print(f"[INFO] Loading embedding model: {embedding_model_name}")
    embeddings = HuggingFaceEmbeddings(
        model_name=embedding_model_name,
        model_kwargs={"device": device},
        cache_folder=cache_folder
    )

    # Create initial empty FAISS vector store
    vector_store = FAISS.from_texts(["This is an initial document."], embeddings)
    print("[INFO] Vector store initialized")

@app.get("/")
async def ready_response():
    return {"status": "Ready"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    global vector_store
    try:
        print("[DEBUG] Received file:", file.filename)  # Debug log
        file_location = f"./{file.filename}"
        with open(file_location, "wb+") as f:
            f.write(await file.read())
        print("[DEBUG] File saved at:", file_location)  # Debug log

        loader = PDFMinerLoader(file_location)
        documents = loader.load()
        print("[DEBUG] Documents loaded:", documents)  # Debug log

        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        chunks = splitter.split_documents(documents)
        print("[DEBUG] Chunks created:", chunks)  # Debug log

        # Update the global vector_store
        vector_store = FAISS.from_documents(chunks, embeddings)
        print("[DEBUG] Vector store updated with documents:", chunks)  # Debug log
        return {"message": f"{file.filename} uploaded and processed successfully."}
    except Exception as e:
        print("[ERROR] Exception occurred:", str(e))  # Error log
        return {"error": f"Failed to process file: {str(e)}"}

class QueryRequest(BaseModel):
    query: str

@app.post("/query")
async def query_files(request: QueryRequest):
    global vector_store
    try:
        # Ensure the vector store is initialized and contains data
        if vector_store is None:
            return {"error": "Vector store is not initialized. Please upload a document first."}

        print("[DEBUG] Querying vector store with:", request.query)  # Debug log
        retriever = vector_store.as_retriever(search_kwargs={"k": 1})
        qa_chain = RetrievalQA.from_chain_type(
            llm=HuggingFacePipeline(pipeline=generate_text),
            chain_type="stuff",
            retriever=retriever
        )
        
        # Run the query and truncate the result to fit within the token limit
        result = qa_chain.run(request.query)
        if len(result) > 512:  # Truncate result if it exceeds 512 tokens
            result = result[:512]
        
        print("[DEBUG] Query result:", result)  # Debug log
        return {"response": result}
    except Exception as e:
        # Fallback to language model if vector store query fails
        print("[ERROR] Query failed:", str(e))  # Error log
        fallback = generate_text(request.query)[0]["generated_text"]
        return {
            "error": f"Query failed: {str(e)}",
            "fallback_response": fallback
        }

@app.post("/testquery/{query}")
async def test_query(query: str):
    try:
        return {"response": generate_text(query)[0]["generated_text"]}
    except Exception as e:
        return {"error": f"Test query failed: {str(e)}"}
