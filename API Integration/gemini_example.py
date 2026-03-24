from dotenv import load_dotenv

import os
from google import genai


load_dotenv() #load the api from .env

#  API Configuration 
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
client = genai.Client(api_key=GOOGLE_API_KEY)
MODEL_NAME = "gemini-2.0-flash"


# Query Function 

def query_gemini(prompt: str) -> str:
    try:
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt,
        )
        return response.text

    except Exception as e:
        return f"Error: {str(e)}"


#  Main Execution 

if __name__ == "__main__":
    print("=" * 50)
    print("  Google Gemini AI Query")
    print(f"  Model: {MODEL_NAME}")
    print("=" * 50)

    user_prompt = input("\nEnter your prompt: ").strip()

    if not user_prompt:
        print("No prompt entered. Exiting.")
    else:
        print("\nQuerying Google Gemini API...")
        result = query_gemini(user_prompt)
        print("\nResponse:")
        print("-" * 50)
        print(result)
        print("-" * 50)