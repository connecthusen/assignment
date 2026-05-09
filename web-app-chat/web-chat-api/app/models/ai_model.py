import os
from groq import Groq
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage, SystemMessage, AIMessage
from langchain_chroma import Chroma
from langgraph.prebuilt import create_react_agent
from app.utils.vector_db import vector_db
from app.utils.memory_extractor import extract_and_store_memory_async
from app.utils.tools import get_all_tools

load_dotenv()

class AIModel:
    def __init__(self, api_key=None, model=None):
        self.api_key = api_key or os.getenv("GROQ_API_KEY")
        self.model = model or os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

        if not self.api_key:
            raise ValueError("GROQ_API_KEY Environment not set.")
            
        # Standard Groq Client (for simple operations)
        self.client = Groq(api_key=self.api_key)
        
        # LangChain Groq Client (for advanced context and tools)
        self.llm = ChatGroq(api_key=self.api_key, model=self.model, temperature=0.7, max_tokens=2000)
        
        # Setup Agent Tools
        self.tools = get_all_tools()

    def get_rag_context(self, query):
        """Retrieve relevant document chunks from ChromaDB"""
        try:
            vectorstore = Chroma(
                client=vector_db.get_client(),
                collection_name="project_documents",
                embedding_function=vector_db.get_embeddings(),
            )
            results = vectorstore.similarity_search(query, k=3)
            return "\n".join([doc.page_content for doc in results])
        except Exception:
            return ""

    def get_memory_context(self, query):
        """Retrieve long-term memory facts from ChromaDB"""
        try:
            vectorstore = Chroma(
                client=vector_db.get_client(),
                collection_name="user_memory",
                embedding_function=vector_db.get_embeddings(),
            )
            results = vectorstore.similarity_search(query, k=4)
            return "\n".join([doc.page_content for doc in results])
        except Exception:
            return ""

    def chat_advanced(self, user_message, history):
        """
        Main entry point for intelligent chat.
        Combines RAG, Long-Term Memory, Short-Term Conversation History, and Tool Calling/Reasoning.
        """
        # 1. Start memory extraction in the background
        extract_and_store_memory_async(user_message)

        # 2. Retrieve contexts
        rag_context = self.get_rag_context(user_message)
        memory_context = self.get_memory_context(user_message)

        # 3. Build System Prompt
        system_prompt_parts = [
            "You are KuttyAI, a highly intelligent and professional assistant.",
            "You have access to several tools. Think step-by-step and use tools when necessary to answer the user's request accurately."
        ]
        
        if memory_context:
            system_prompt_parts.append("\nHere are some long-term facts you know about the user:\n" + memory_context)
            
        if rag_context:
            system_prompt_parts.append("\nHere is relevant document information the user uploaded. Use this to answer if relevant:\n" + rag_context)
            
        system_prompt = "\n".join(system_prompt_parts)

        # 4. Construct LangChain chat history
        recent_history = history[-10:] if len(history) > 10 else history
        
        chat_history = []
        for msg in recent_history:
            if msg['role'] == 'user':
                chat_history.append(HumanMessage(content=msg['content']))
            elif msg['role'] == 'assistant':
                chat_history.append(AIMessage(content=msg['content']))

        # Remove the current message from history if it's already at the end
        if chat_history and recent_history[-1]['role'] == 'user' and recent_history[-1]['content'] == user_message:
            chat_history.pop()

        # 5. Generate response using langgraph ReAct Agent
        try:
            # For older versions of langgraph, system prompts are passed directly in the messages array
            agent_messages = [SystemMessage(content=system_prompt)] + chat_history + [HumanMessage(content=user_message)]
            agent_executor = create_react_agent(self.llm, self.tools)
            response = agent_executor.invoke({"messages": agent_messages})
            return response["messages"][-1].content
        except Exception as e:
            print(f"Agent error, falling back to standard generation: {e}")
            # Fallback in case tool calling agent fails for any reason
            lc_messages = [SystemMessage(content=system_prompt)] + chat_history
            try:
                fallback_response = self.llm.invoke(lc_messages)
                return fallback_response.content
            except Exception as inner_e:
                raise Exception(f"LangChain/Groq API error: {str(inner_e)}")

    def chat(self, message, system_prompt=None):
        # Legacy method fallback
        return self.chat_advanced(message, [])

    def chat_with_history(self, messages):
        # Legacy method fallback mapping
        user_message = messages[-1]['content'] if messages and messages[-1]['role'] == 'user' else ""
        return self.chat_advanced(user_message, messages)

    def get_model_info(self):
        return {
            'model': self.model,
            'provider': 'Groq (LangChain Agent Enhanced)',
            'max_tokens': 2000,
            'tools': [t.name for t in self.tools]
        }





