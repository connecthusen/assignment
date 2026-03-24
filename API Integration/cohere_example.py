import os
import cohere
from dotenv import load_dotenv



load_dotenv() # load api from .env file

COHERE_API_KEY = os.getenv("COHERE_API_KEY",)

# Initialize the Cohere client
co = cohere.Client(api_key=COHERE_API_KEY)


# Query Function 

model: str = "command-r-plus-08-2024"
def query_cohere(prompt: str) -> str:
    """
    Send a prompt to Cohere's chat endpoint and return the response text.

    Args:
        prompt (str): The user's input text / question.

    Returns:
        str: The AI-generated response, or an error message.
    """
    try:
        response = co.chat(
            message=prompt,
            model=model,
            temperature=0.7,
            max_tokens=500,
            preamble=(
                "You are a helpful AI assistant. "
                "Answer clearly and concisely."
            ),
        )
        return response.text

    except cohere.core.api_error.ApiError as e:
        return f"Cohere API Error: {str(e)}"
    except Exception as e:
        return f"Error: {str(e)}"


#  Main Execution 

if __name__ == "__main__":
    print("=" * 50)
    print("  Cohere AI Query")
    print(f"  Model: {model}")
    print("=" * 50)

    user_prompt = input("\nEnter your prompt: ").strip()

    if not user_prompt:
        print("No prompt entered. Exiting.")
    else:
        print("\nQuerying Cohere API...")
        result = query_cohere(user_prompt)
        print("\nResponse:")
        print("-" * 50)
        print(result)
        print("-" * 50)
