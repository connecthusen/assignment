# AI API Integration
### Generative AI Assignment — CampusPe | Mentor: Jacob Dennis

---

## Overview

This project demonstrates integration with **5 Generative AI APIs** using Python. Each script accepts a user prompt and returns a response from the respective provider. A bonus `multi_api_query.py` provides a unified interface to query any — or all — providers at once and compare responses side by side.

---

## Project Structure

```
ai-api-integration/
├── groq_example.py           # Groq — LLaMA 3.3 70B
├── ollama_example.py         # Ollama — Qwen 2.5 7B (local)
├── huggingface_example.py    # Hugging Face — DeepSeek V3
├── gemini_example.py         # Google Gemini 2.0 Flash
├── cohere_example.py         # Cohere — Command R Plus
├── multi_api_query.py        # BONUS: Unified multi-provider interface
├── requirements.txt
├── README.md
├── .env                      # API keys (NOT committed to Git)
├── .gitignore
└── screenshots/
    ├── groq_output.png
    ├── ollama_output.png
    ├── huggingface_output.png
    ├── gemini_output.png
    └── cohere_output.png
```

---

## Provider Summary

| File | Provider | Model | Free Tier |
|---|---|---|---|
| `groq_example.py` | Groq | LLaMA 3.3 70B Versatile | ✅ Generous free tier |
| `ollama_example.py` | Ollama | Qwen 2.5 7B (local) | ✅ Fully free — runs locally |
| `huggingface_example.py` | Hugging Face | DeepSeek V3 0324 | ✅ Free Inference API |
| `gemini_example.py` | Google Gemini | Gemini 2.0 Flash | ✅ Free tier (15 RPM) |
| `cohere_example.py` | Cohere | Command R Plus | ✅ 1,000 calls/month free |
| `multi_api_query.py` | All of the above | — | ✅ BONUS |

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ai-api-integration
```

### 2. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 3. Set Up Ollama (Local Model)

Ollama runs models locally — no API key required.

```bash
# Download and install from https://ollama.ai/
# Then pull the model:
ollama pull qwen2.5:7b

# Start the server (auto-starts on most systems):
ollama serve
```

### 4. Configure API Keys

Create a `.env` file in the project root (see [Environment Variables](#environment-variables)):

```
GROQ_API_KEY=your-groq-key-here
HUGGINGFACE_API_KEY=hf_your-token-here
GOOGLE_API_KEY=your-gemini-key-here
COHERE_API_KEY=your-cohere-key-here
```

> ⚠️ **Never commit your `.env` file.** Ensure `.gitignore` includes `.env`.

---

## How to Obtain Each API Key

### Groq (Free)
1. Sign up at [https://console.groq.com/](https://console.groq.com/)
2. Navigate to **API Keys** → **Create New Key**
3. Free tier offers very generous rate limits

### Hugging Face (Free)
1. Sign up at [https://huggingface.co/](https://huggingface.co/)
2. Go to **Settings → Access Tokens**
3. Create a token with **Read** permission

### Google Gemini (Free)
1. Visit [https://aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Click **Create API Key**
3. Free tier: 15 RPM, 1 million tokens/day with Gemini 2.0 Flash

### Cohere (Free Trial)
1. Sign up at [https://dashboard.cohere.com/](https://dashboard.cohere.com/)
2. Your trial API key is displayed on the dashboard home page
3. Free tier: 1,000 API calls/month

### Ollama (No Key Required)
- Runs entirely on your local machine — no account or API key needed

---

## Environment Variables

Keep API keys out of your source code. Use environment variables or a `.env` file.

**Linux / macOS** — add to `~/.bashrc` or `~/.zshrc`:
```bash
export GROQ_API_KEY="your-groq-key-here"
export HUGGINGFACE_API_KEY="hf_your-token-here"
export GOOGLE_API_KEY="your-gemini-key-here"
export COHERE_API_KEY="your-cohere-key-here"
```
Then reload: `source ~/.bashrc`

**Windows (PowerShell):**
```powershell
$env:GROQ_API_KEY="your-groq-key-here"
$env:HUGGINGFACE_API_KEY="hf_your-token-here"
$env:GOOGLE_API_KEY="your-gemini-key-here"
$env:COHERE_API_KEY="your-cohere-key-here"
```

**`.env` file (recommended for development):**
```
GROQ_API_KEY=your-groq-key-here
HUGGINGFACE_API_KEY=hf_your-token-here
GOOGLE_API_KEY=your-gemini-key-here
COHERE_API_KEY=your-cohere-key-here
```

All scripts use `python-dotenv` to load `.env` automatically.

---

## How to Run

```bash
# Groq — LLaMA 3.3 70B
python groq_example.py

# Ollama — Qwen 2.5 7B (ensure Ollama is running first)
python ollama_example.py

# Hugging Face — DeepSeek V3
python huggingface_example.py

# Google Gemini 2.0 Flash
python gemini_example.py

# Cohere — Command R Plus
python cohere_example.py

# BONUS: Multi-provider unified interface
python multi_api_query.py
```

---

## Features

- **Modular design** — each provider is an independent, importable module
- **Unified interface** — `multi_api_query.py` lets you switch providers or compare all at once
- **Graceful error handling** — all scripts catch and report API errors without crashing
- **Environment variable security** — zero hardcoded API keys anywhere in the codebase
- **Side-by-side comparison** — BONUS mode queries all providers and prints results together

---

## Screenshots

Working program outputs are saved in the `screenshots/` directory.

---

## Important Notes

- ⚠️ **API keys are never hardcoded** — environment variables are used throughout
- ⚠️ **Do not commit `.env`** — it must remain in `.gitignore`
- Free tier rate limits apply — be mindful of request frequency
- Ollama requires sufficient CPU/GPU to run a 7B parameter model locally
- Use the **same GitHub repository** from your previous assignment — do not create a new one

---

## API Documentation

| Provider | Docs |
|---|---|
| Groq | https://console.groq.com/docs |
| Ollama | https://github.com/ollama/ollama |
| Hugging Face | https://huggingface.co/inference-api |
| Google Gemini | https://ai.google.dev/docs |
| Cohere | https://docs.cohere.com/ |
