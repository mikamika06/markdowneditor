from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
import json
from datetime import datetime
from app.core.database import create_tables

from app.routes.notes import router as notes_router
from app.routes.auth import router as auth_router

from app.routes.ai import router as ai_router
from app.routes.documents import router as documents_router

from app.models import user, note


class DateTimeEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    yield


app = FastAPI(
    title="Markdown Editor API",
    description="Python backend for markdown",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


app.include_router(notes_router)
app.include_router(auth_router)

app.include_router(ai_router)
app.include_router(documents_router)


@app.get("/")
async def root():
    return {"message": "Markdown editor API is working"}


@app.get("/health")
async def health_check():
    return {
        "status": "health",
        "service": "markdown-editor",
        "version": "1.0.0",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
