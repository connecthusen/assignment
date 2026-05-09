import os
import chromadb
from chromadb.config import Settings
from langchain_huggingface import HuggingFaceEmbeddings

class VectorDBManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(VectorDBManager, cls).__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        # Create a persistent directory for ChromaDB within the app
        db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'instance', 'chroma_db')
        os.makedirs(db_path, exist_ok=True)
        
        # Initialize ChromaDB client
        self.chroma_client = chromadb.PersistentClient(path=db_path)
        
        # Initialize local embeddings
        # all-MiniLM-L6-v2 is fast, lightweight, and perfect for generic memory/RAG locally
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        
        # In Chroma DB, we can use Langchain's Chroma wrapper later, 
        # but for direct access or using it with Langchain, we just need the client.

    def get_client(self):
        return self.chroma_client

    def get_embeddings(self):
        return self.embeddings

# Global instance to import
vector_db = VectorDBManager()
