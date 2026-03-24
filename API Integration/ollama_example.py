
import requests
import json


OLLAMA_BASE_URL = "http://localhost:11434"
DEFAULT_MODEL   = "qwen2.5:7b"   


#  Query Function 

def query_ollama(prompt: str, model: str = DEFAULT_MODEL) -> str:
    """
    Send a prompt to a locally running Ollama model.

    Args:
        prompt (str): The user's input text / question.
        model  (str): Name of the Ollama model to use (must be pulled first).

    Returns:
        str: The AI-generated response, or an error message.
    """
    url = f"{OLLAMA_BASE_URL}/api/generate"

    payload = {
        "model": model,
        "prompt": prompt,
        "stream": False,          # Set True for streaming 
        "options": {
            "temperature": 0.7,
            "num_predict": 500,   # Max tokens to generate
        }
    }

    try:
        response = requests.post(url, json=payload, timeout=120)
        response.raise_for_status()

        data = response.json()
        return data.get("response", "No response received.")

    except requests.exceptions.ConnectionError:
        return (
            "Error: Cannot connect to Ollama. "
            "Make sure Ollama is running  and try again."
        )
    except requests.exceptions.Timeout:
        return "Error: Request timed out. The model may be too large for your hardware."
    except Exception as e:
        return f"Error: {str(e)}"


def list_available_models() -> list:
    """Fetch the list of locally available Ollama models."""
    try:
        response = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=10)
        response.raise_for_status()
        models = response.json().get("models", [])
        return [m["name"] for m in models]
    except Exception:
        return []


#  Main Execution 

if __name__ == "__main__":
    print("=" * 50)
    print("  Ollama Local AI Query")
    print("=" * 50)

    # Show available models
    available = list_available_models()
    if available:
        print(f"\nAvailable models: {', '.join(available)}")
    else:
        print("\nWarning: Could not fetch model list. Is Ollama running?")

    user_prompt = input("\nEnter your prompt: ").strip()

    if not user_prompt:
        print("No prompt entered. Exiting.")
    else:
        print(f"\nQuerying Ollama ({DEFAULT_MODEL})...")
        result = query_ollama(user_prompt)
        print("\nResponse:")
        print(result)
        print("-" * 50)
