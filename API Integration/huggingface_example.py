from dotenv import load_dotenv
load_dotenv()

import os
from huggingface_hub import InferenceClient

# ─── API Configuration ────────────────────────────────────────────────────────
HF_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
MODEL_ID   = "deepseek-ai/DeepSeek-V3-0324"


client = InferenceClient(
    api_key=HF_API_KEY,
    provider="auto",
)

# Query Function 

def query_huggingface(prompt: str) -> str:
    try:
        completion = client.chat.completions.create(
            model=MODEL_ID,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=500,
            temperature=0.7,
        )
        return completion.choices[0].message.content
    except Exception as e:
        return f"Error: {str(e)}"

# Main Execution 

if __name__ == "__main__":
    print("=" * 50)
    print("  Hugging Face Inference API Query")
    print(f"  Model: {MODEL_ID}")
    print("=" * 50)

    user_prompt = input("\nEnter your prompt: ").strip()

    if not user_prompt:
        print("No prompt entered. Exiting.")
    else:
        print("\nQuerying Hugging Face API...")
        result = query_huggingface(user_prompt)
        print("\nResponse:")
        print("-" * 50)
        print(result)
        print("-" * 50)