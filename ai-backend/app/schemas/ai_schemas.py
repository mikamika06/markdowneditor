from pydantic import BaseModel
from typing import Optional
from enum import Enum


class AIProviderEnum(str, Enum):
    OLLAMA = "ollama"
    OPENAI = "openai"
    GROQ = "groq"


class AutocompleteRequest(BaseModel):
    text: str
    preferred_provider: Optional[AIProviderEnum] = None


class GrammarRequest(BaseModel):
    text: str
    preferred_provider: Optional[AIProviderEnum] = None


class TranslateRequest(BaseModel):
    text: str
    target_language: str
    preferred_provider: Optional[AIProviderEnum] = None


class AIResponse(BaseModel):
    success: bool
    result: str
    provider_used: Optional[str] = None