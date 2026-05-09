import threading
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_chroma import Chroma
from app.utils.vector_db import vector_db
import os

def extract_and_store_memory_async(user_message):
    """
    Runs in a separate thread so it doesn't block the main chat response.
    Analyzes the user_message to extract any personal facts, preferences, 
    or long-term memory items. If found, stores in ChromaDB.
    """
    def task():
        try:
            api_key = os.getenv("GROQ_API_KEY")
            if not api_key:
                return
            
            # Use the fast, cheaper model for memory extraction
            llm = ChatGroq(api_key=api_key, model="llama-3.1-8b-instant", temperature=0.1)
            
            system_prompt = """
You are a memory extraction assistant. 
Your goal is to extract ANY personal facts, preferences, names, project details, or long-term memory items from the user's message.
Return ONLY the extracted facts as concise, standalone sentences. 
If there are no facts to remember (e.g. general questions or greetings), output exactly "NONE".
Example 1:
User: "My name is Husen and I am building a chatbot."
Output:
The user's name is Husen.
The user is building a chatbot.

Example 2:
User: "What is the capital of France?"
Output:
NONE
            """
            
            messages = [
                SystemMessage(content=system_prompt),
                HumanMessage(content=user_message)
            ]
            
            response = llm.invoke(messages)
            extracted_facts = response.content.strip()
            
            if extracted_facts and extracted_facts != "NONE" and "NONE" not in extracted_facts:
                # Split by newlines in case there are multiple facts
                facts = [f.strip() for f in extracted_facts.split('\n') if f.strip()]
                
                if facts:
                    vectorstore = Chroma(
                        client=vector_db.get_client(),
                        collection_name="user_memory",
                        embedding_function=vector_db.get_embeddings(),
                    )
                    
                    # Store the facts
                    vectorstore.add_texts(texts=facts)
                    print(f"[Memory Extractor] Stored facts: {facts}")
                    
        except Exception as e:
            print(f"[Memory Extractor] Error: {str(e)}")

    thread = threading.Thread(target=task)
    thread.start()
