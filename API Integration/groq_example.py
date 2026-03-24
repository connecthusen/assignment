import os
from groq import Groq
from dotenv import load_dotenv



load_dotenv() # load api from .env file


api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=api_key)
model="llama-3.3-70b-versatile"

# Query Function 

def query_groq(prompt: str) -> str:
    """
    Send a prompt to Groq's LLaMA model and return the response text.

    Args:
        prompt (str): The user's input text / question.

    Returns:
        str: The AI-generated response, or an error message.
    """
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful AI assistant.",
                },
                {
                    "role": "user",
                    "content": prompt,
                },
            ],
            model=model,
            max_tokens=500,
            temperature=0.7,
        )
        # Extract the response text
        return chat_completion.choices[0].message.content

    except Exception as e:
        return f"Error: {str(e)}"


# Main Execution 

if __name__ == "__main__":
    print("=" * 50)
    print("  Groq AI Query (LLaMA via Groq Cloud)")
    print(f"  Model: {model}")
    print("=" * 50)

    user_prompt = input("\nEnter your prompt: ").strip()

    if not user_prompt:
        print("No prompt entered. Exiting.")
    else:
        print("\nQuerying Groq API...")
        result = query_groq(user_prompt)
        print("\nResponse:")
        print("-" * 50)
        print(result)
        print("-" * 50)
