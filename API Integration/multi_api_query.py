
import sys

# Import query functions from individual 
from groq_example        import query_groq
from ollama_example      import query_ollama
from huggingface_example import query_huggingface
from gemini_example      import query_gemini
from cohere_example      import query_cohere


# all llms

PROVIDERS = {
    "1": ("Groq — LLaMA 3.3 70B",         query_groq),
    "2": ("Ollama — Qwen 2.5 7B (Local)",  query_ollama),
    "3": ("Hugging Face — DeepSeek V3",    query_huggingface),
    "4": ("Google Gemini 2.0 Flash",       query_gemini),
    "5": ("Cohere — Command R Plus",       query_cohere),
    "6": ("Compare ALL providers",         None),  
}


#  Display Menu

def show_menu():
    print("\n" + "=" * 55)
    print("   Multi-API Query Tool — CampusPe GenAI Assignment")
    print("=" * 55)
    print("  Select an AI provider:\n")
    for key, (name, _) in PROVIDERS.items():
        print(f"  [{key}] {name}")
    print("\n  [0] Exit")
    print("=" * 55)


# Compare Mode 

def compare_all(prompt: str):
    print("\n  Querying all providers — this may take a minute...\n")
    results = {}
    for key, (name, func) in PROVIDERS.items():
        if func is None:
            continue
        print(f"  → Querying {name}...")
        results[name] = func(prompt)

    print("\n" + "=" * 55)
    print("  COMPARISON RESULTS")
    print("=" * 55)
    for provider, response in results.items():
        print(f"\n {provider}")
        print("-" * 55)
        print(response)
    print("=" * 55)


#  Main Execution 

def main():
    while True:
        show_menu()
        choice = input("\n  Your choice: ").strip()

        if choice == "0":
            print("\nGoodbye!\n")
            sys.exit(0)

        if choice not in PROVIDERS:
            print("  Invalid choice. Please try again.")
            continue

        name, func = PROVIDERS[choice]
        print(f"\n  Provider selected: {name}")
        prompt = input("  Enter your prompt: ").strip()

        if not prompt:
            print("  No prompt entered. Returning to menu.")
            continue

        if func is None:
            compare_all(prompt)
        else:
            print(f"\n  Querying {name}...")
            result = func(prompt)
            print("\n  Response:")
            print("-" * 55)
            print(result)
            print("-" * 55)

        input("\n  Press Enter to continue...")


if __name__ == "__main__":
    main()
