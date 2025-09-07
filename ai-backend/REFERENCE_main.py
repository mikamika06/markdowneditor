# ДОВІДКОВИЙ КОД - НЕ КОПІЮЙТЕ ПОВНІСТЮ!
# Використовуйте як довідник для розуміння структури

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Створення FastAPI додатку
app = FastAPI(
    title="Markdown Editor API",
    description="Python backend для markdown редактора",
    version="1.0.0"
)

# CORS налаштування для React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Create React App
        "http://localhost:5173",  # Vite
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

# Базовий endpoint для перевірки здоров'я сервера
@app.get("/")
async def root():
    return {"message": "Markdown Editor API працює!"}

@app.get("/health")
async def health_check():
    return {
        "status": "healthy", 
        "service": "markdown-editor-backend",
        "version": "1.0.0"
    }

# Запуск сервера (для розробки)
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app", 
        host="0.0.0.0", 
        port=8000, 
        reload=True  # Автоперезавантаження при змінах коду
    )