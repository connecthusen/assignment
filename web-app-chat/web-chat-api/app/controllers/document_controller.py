import os
from flask import Blueprint, request
from werkzeug.utils import secure_filename
from langchain_community.document_loaders import PyPDFLoader, TextLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from app.utils.helpers import success_response, error_response
from app.utils.vector_db import vector_db

document_bp = Blueprint('document', __name__)

UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'instance', 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {'pdf', 'txt'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@document_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return error_response('No file part in the request', status_code=400)
    
    file = request.files['file']
    if file.filename == '':
        return error_response('No file selected for uploading', status_code=400)
    
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)
        
        try:
            # Process the file using LangChain Loaders
            if filename.endswith('.pdf'):
                loader = PyPDFLoader(file_path)
            else:
                loader = TextLoader(file_path)
                
            documents = loader.load()
            
            # Split the document into chunks
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
            chunks = text_splitter.split_documents(documents)
            
            # Embed and store in ChromaDB 'project_documents' collection
            vectorstore = Chroma(
                client=vector_db.get_client(),
                collection_name="project_documents",
                embedding_function=vector_db.get_embeddings(),
            )
            
            vectorstore.add_documents(documents=chunks)
            
            return success_response(message=f"File {filename} successfully uploaded and processed for AI knowledge.")
            
        except Exception as e:
            return error_response(f"Error processing file: {str(e)}", status_code=500)
            
    return error_response('Allowed file types are pdf, txt', status_code=400)
