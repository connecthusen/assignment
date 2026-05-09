from langchain_core.tools import tool
from datetime import datetime
from duckduckgo_search import DDGS
from langchain_community.utilities import WikipediaAPIWrapper

# Initialize external APIs
wikipedia = WikipediaAPIWrapper()

@tool
def get_current_time() -> str:
    """Returns the current date and time. Use this when the user asks for the current time, today's date, etc."""
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

@tool
def web_search(query: str) -> str:
    """Useful for searching the internet for up-to-date information on current events, news, or general web search queries."""
    try:
        results = DDGS().text(query, max_results=3)
        if not results:
            return "No results found."
        return "\n".join([f"- {r['title']}: {r['body']}" for r in results])
    except Exception as e:
        return f"Error searching the web: {str(e)}"

@tool
def wikipedia_search(query: str) -> str:
    """Useful for getting detailed encyclopedic information about people, places, companies, facts, historical events, or other subjects."""
    try:
        return wikipedia.run(query)
    except Exception as e:
        return f"Error searching Wikipedia: {str(e)}"

@tool
def calculator(expression: str) -> str:
    """Evaluates a mathematical expression (e.g. '254 * 842', '10 + 5'). Use this for all math operations."""
    try:
        # Restrict to safe math operations
        allowed_chars = "0123456789+-*/(). "
        if any(c not in allowed_chars for c in expression):
            return "Error: Invalid characters in math expression. Only numbers and basic operators (+, -, *, /) are allowed."
        # Safe eval because of strict character filtering
        result = eval(expression)
        return str(result)
    except Exception as e:
        return f"Error evaluating math: {str(e)}"

def get_all_tools():
    """Returns the list of all tools available to the AI agent."""
    return [get_current_time, web_search, wikipedia_search, calculator]
