from os import getenv
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from langchain.chains import RetrievalQA
from langchain.document_loaders import PDFMinerLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.llms import HuggingFacePipeline
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Milvus
from pymilvus import connections
from transformers import pipeline

# Initialize FastAPI app
app = FastAPI()

# CORS setup for development (replace '*' in production)
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
    """
    Initialize resources on app startup.
    """
    global generate_text, embeddings, vector_store

    # Load environment variables
    load_dotenv()

    # Configuration
    model_path = getenv("MODEL_PATH", "google-bert/bert-base-uncased")
    embedding_model_name = getenv("EMBEDDING_MODEL_NAME", "sentence-transformers/all-MiniLM-L6-v2")
    cache_folder = getenv("CACHE_FOLDER", "./model_cache")
    milvus_host = getenv("MILVUS_HOST", "localhost")
    milvus_port = getenv("MILVUS_PORT", "19530")
    milvus_collection = getenv("MILVUS_COLLECTION", "docusearch")
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
        repetition_penalty=1.2,
    )

    # Test the language model
    test_output = generate_text("What is the capital of France?")[0]["generated_text"]
    print("[TEST OUTPUT]", test_output)

    # Load embeddings
    print(f"[INFO] Loading embedding model: {embedding_model_name}")
    embeddings = HuggingFaceEmbeddings(
        model_name=embedding_model_name,
        model_kwargs={"device": device},
        cache_folder=cache_folder,
    )

    # Connect to Milvus
    connections.connect(host=milvus_host, port=milvus_port)
    print(f"[INFO] Connected to Milvus at {milvus_host}:{milvus_port}")

    # Initialize Milvus vector store
    vector_store = Milvus(
        embedding_function=embeddings.embed_query,
        collection_name=milvus_collection,
        connection_args={"host": milvus_host, "port": milvus_port},
    )
    print(f"[INFO] Initialized Milvus vector store with collection '{milvus_collection}'")

@app.get("/")
async def ready_response():
    """
    Health check endpoint.
    """
    return {"status": "Ready"}

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    """
    Upload and process a document.
    """
    global vector_store
    try:
        # Save the uploaded file
        file_location = f"./{file.filename}"
        with open(file_location, "wb+") as f:
            f.write(await file.read())

        # Load the document
        loader = PDFMinerLoader(file_location)
        documents = loader.load()

        # Split the document into chunks
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
        chunks = splitter.split_documents(documents)

        # Add chunks to the Milvus vector store
        vector_store.add_documents(chunks)
        return {"message": f"{file.filename} uploaded and processed successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process file: {str(e)}")

@app.post("/query")
async def query_files(query: str):
    """
    Query the vector store for relevant documents.
    """
    global vector_store
    try:
        retriever = vector_store.as_retriever(search_kwargs={"k": 2})
        qa_chain = RetrievalQA.from_chain_type(
            llm=HuggingFacePipeline(pipeline=generate_text),
            chain_type="stuff",
            retriever=retriever,
        )
        result = qa_chain.run(query)
        return {"response": result}
    except Exception as e:
        fallback = generate_text(query)[0]["generated_text"]
        return {
            "error": f"Query failed: {str(e)}",
            "fallback_response": fallback,
        }

@app.post("/testquery/{query}")
async def test_query(query: str):
    """
    Test the language model directly.
    """
    try:
        return {"response": generate_text(query)[0]["generated_text"]}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Test query failed: {str(e)}")