FROM python:3.10-slim

# Install OS-level dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    build-essential \
    wget \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /app

# Copy requirements and app-specific files
COPY ./requirements.txt /app/requirements.txt
COPY ./download_model.py /app/download_model.py
COPY ./download_instructor.py /app/download_instructor.py
COPY ./.env /app/.env

# Install Python packages (CPU only versions)
RUN pip install --upgrade pip && \
    pip install torch==2.0.1 torchvision==0.15.2 torchaudio==2.0.2 --index-url https://download.pytorch.org/whl/cpu && \
    pip install --no-cache-dir -r requirements.txt

# Use GPTQModel instead of the deprecated AutoGPTQ
RUN pip install optimum[gptq]

# Fix InstructorEmbeddings installation
RUN pip uninstall -y sentence-transformers InstructorEmbedding && \
    pip install InstructorEmbedding==1.0.1 sentence-transformers==2.2.2

ENV OMP_NUM_THREADS=4
ENV MKL_NUM_THREADS=4
ENV NUMEXPR_NUM_THREADS=4

# Download the model first
RUN mkdir -p /app/models && \
    python /app/download_model.py TheBloke/Phi-2-GPTQ

# Copy a fixed version of download_instructor.py
COPY <<EOF /app/download_instructor_fixed.py
import os
from langchain.embeddings import HuggingFaceInstructEmbeddings
from dotenv import load_dotenv

def main():
    load_dotenv()
    
    cache_folder = os.getenv("CACHE_FOLDER", "/app/models")
    model_name = os.getenv("INSTRUCTOR_MODEL_NAME", "hkunlp/instructor-base")
    
    print(f"Downloading instructor model {model_name} for CPU usage")
    
    # Remove any token parameter
    instructorEmbeddings = HuggingFaceInstructEmbeddings(
        model_name=model_name,
        cache_folder=cache_folder,
        model_kwargs={"device": "cpu"}
    )
    
    # Force download of the model
    _ = instructorEmbeddings.embed_query("Hello world")
    
    print(f"Successfully downloaded the instructor model to {cache_folder}")

if __name__ == "__main__":
    main()
EOF

# Run the fixed script to download instructor embeddings
RUN python /app/download_instructor_fixed.py

# Copy everything else
COPY . /app

# Modify .env file to use CPU instead of CUDA
RUN sed -i 's/device": "cuda"/device": "cpu"/g' /app/.env || true
RUN echo "Setting models to use CPU instead of CUDA"

# Expose API port
EXPOSE 80

CMD ["uvicorn", "backend:app", "--host", "0.0.0.0", "--port", "80", "--workers", "1"]