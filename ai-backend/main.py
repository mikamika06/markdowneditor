from fastapi import FastAPI
import requests

app = FastAPI()

OLLAMA_URL = "http://localhost:11434/api/generate"
MODEL_NAME = "gpt-oss:20b"  

@app.get("/")
async def root():
    return {"message": "Hello, world!"}

@app.get("/test-ai")
async def test_ai():
    prompt = "Say dadadad"
    response = requests.post(OLLAMA_URL, json={
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False
    })
    result = response.json()
    return {"ai_response": result.get("response", "")}