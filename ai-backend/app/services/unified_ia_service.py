import asyncio
import aiohttp
import os
import hashlib
from typing import Dict, Any, Optional, List
from enum import Enum
from datetime import datetime

from langchain.prompts import PromptTemplate
from langchain.schema import BaseMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq
from langchain_ollama import OllamaLLM

from sqlalchemy.ext.asyncio import AsyncSession
from app.models.ai_models import AIUsageLog

class AIProvider(Enum):
    OLLAMA = "ollama"
    OPENAI = "openai"
    GROQ = "groq"
    HUGGINGFACE = "huggingface"

class UnifiedAIService:
    def __init__(self, db: AsyncSession = None):
        self.db = db
        self.providers = {}
        self.setup_providers()
        self.setup_prompts()
    
    def setup_providers(self):
        try:
            self.providers[AIProvider.OLLAMA] = OllamaLLM(
                base_url="http://localhost:11434",
                model="llama3"
            )
        except Exception as e:
            print(f"Ollama not available: {e}")
        
        if os.getenv("OPENAI_API_KEY"):
            self.providers[AIProvider.OPENAI] = ChatOpenAI(
                api_key=os.getenv("OPENAI_API_KEY"),
                model="gpt-3.5-turbo",
                temperature=0.7
            )
        
        if os.getenv("GROQ_API_KEY"):
            self.providers[AIProvider.GROQ] = ChatGroq(
                api_key=os.getenv("GROQ_API_KEY"),
                model="llama3-8b-8192"
            )
    
    def setup_prompts(self):
        self.prompts = {
            "autocomplete": PromptTemplate(
                input_variables=["text", "context"],
                template="""Continue the following text naturally and coherently:

Context: {context}
Text: {text}

Continue writing (2-3 sentences):"""
            ),
            "grammar": PromptTemplate(
                input_variables=["text"],
                template="""Fix grammar and spelling errors in the following text. Return only the corrected text:

{text}

Corrected text:"""
            ),
            "rephrase": PromptTemplate(
                input_variables=["text", "style"],
                template="""Rephrase the following text in a {style} style:

{text}

Rephrased text:"""
            ),
            "translate": PromptTemplate(
                input_variables=["text", "target_language"],
                template="""Translate the following text to {target_language}:

{text}

Translation:"""
            ),
            "summarize": PromptTemplate(
                input_variables=["text"],
                template="""Create a concise summary of the following text:

{text}

Summary:"""
            ),
            "toc": PromptTemplate(
                input_variables=["text"],
                template="""Generate a markdown table of contents for the following text:

{text}

Table of Contents:"""
            ),
            "tone": PromptTemplate(
                input_variables=["text", "tone"],
                template="""Rewrite the following text in a {tone} tone:

{text}

Rewritten text:"""
            )
        }
    
    async def _execute_with_provider(
        self, 
        provider: AIProvider, 
        prompt: str, 
        operation: str,
        user_id: int = None
    ) -> str:
        start_time = datetime.utcnow()
        try:
            llm = self.providers[provider]
            if provider in [AIProvider.OPENAI, AIProvider.GROQ]:
                messages = [HumanMessage(content=prompt)]
                response = await llm.ainvoke(messages)
                result = response.content
            else:
                result = await llm.ainvoke(prompt)
            if self.db and user_id:
                await self._log_usage(
                    user_id=user_id,
                    operation=operation,
                    provider=provider.value,
                    tokens_used=len(prompt.split()) + len(result.split()),
                    execution_time=(datetime.utcnow() - start_time).total_seconds(),
                    success=True
                )
            return result.strip()
        except Exception as e:
            if self.db and user_id:
                await self._log_usage(
                    user_id=user_id,
                    operation=operation,
                    provider=provider.value,
                    execution_time=(datetime.utcnow() - start_time).total_seconds(),
                    success=False,
                    error_message=str(e)
                )
            raise e
    
    async def _log_usage(self, **kwargs):
        log = AIUsageLog(**kwargs)
        self.db.add(log)
        await self.db.commit()
    
    async def autocomplete(
        self, 
        text: str, 
        context: str = "", 
        cursor_position: int = None,
        user_id: int = None,
        preferred_provider: AIProvider = None
    ) -> str:
        prompt = self.prompts["autocomplete"].format(
            text=text,
            context=context or "Continue in the same style"
        )
        provider = preferred_provider or AIProvider.OLLAMA
        return await self._execute_with_provider(provider, prompt, "autocomplete", user_id)
    
    async def grammar_check(
        self, 
        text: str, 
        user_id: int = None,
        preferred_provider: AIProvider = None
    ) -> str:
        prompt = self.prompts["grammar"].format(text=text)
        provider = preferred_provider or AIProvider.OLLAMA
        return await self._execute_with_provider(provider, prompt, "grammar", user_id)
    
    async def rephrase(
        self, 
        text: str, 
        style: str = "clear and engaging",
        user_id: int = None,
        preferred_provider: AIProvider = None
    ) -> str:
        prompt = self.prompts["rephrase"].format(text=text, style=style)
        provider = preferred_provider or AIProvider.OLLAMA
        return await self._execute_with_provider(provider, prompt, "rephrase", user_id)
    
    async def continue_text(
        self, 
        text: str, 
        length: int = 100,
        user_id: int = None,
        preferred_provider: AIProvider = None
    ) -> str:
        prompt = f"Continue the following text with approximately {length} words:\n\n{text}\n\nContinuation:"
        provider = preferred_provider or AIProvider.OLLAMA
        return await self._execute_with_provider(provider, prompt, "continue", user_id)
    
    async def translate(
        self, 
        text: str, 
        target_language: str,
        source_language: str = "auto",
        user_id: int = None,
        preferred_provider: AIProvider = None
    ) -> str:
        prompt = self.prompts["translate"].format(
            text=text, 
            target_language=target_language
        )
        provider = preferred_provider or AIProvider.OLLAMA
        return await self._execute_with_provider(provider, prompt, "translate", user_id)
    
    async def change_tone(
        self, 
        text: str, 
        tone: str,
        user_id: int = None,
        preferred_provider: AIProvider = None
    ) -> str:
        prompt = self.prompts["tone"].format(text=text, tone=tone)
        provider = preferred_provider or AIProvider.OLLAMA
        return await self._execute_with_provider(provider, prompt, "tone_change", user_id)
    
    async def summarize(
        self, 
        text: str,
        summary_type: str = "brief",
        user_id: int = None,
        preferred_provider: AIProvider = None
    ) -> str:
        prompt = self.prompts["summarize"].format(text=text)
        provider = preferred_provider or AIProvider.OLLAMA
        return await self._execute_with_provider(provider, prompt, "summarize", user_id)
    
    async def generate_toc(
        self, 
        text: str,
        user_id: int = None,
        preferred_provider: AIProvider = None
    ) -> str:
        prompt = self.prompts["toc"].format(text=text)
        provider = preferred_provider or AIProvider.OLLAMA
        return await self._execute_with_provider(provider, prompt, "toc", user_id)
    
    async def health_check_all_providers(self) -> Dict[str, Any]:
        results = {}
        for provider_type, provider in self.providers.items():
            try:
                test_result = await self._execute_with_provider(
                    provider_type, 
                    "Say 'OK' if you're working", 
                    "health_check"
                )
                results[provider_type.value] = {
                    "healthy": True,
                    "response_preview": test_result[:50],
                    "available": True
                }
            except Exception as e:
                results[provider_type.value] = {
                    "healthy": False,
                    "error": str(e),
                    "available": False
                }
        return {
            "providers": results,
            "healthy_count": sum(1 for r in results.values() if r.get("healthy")),
            "total_count": len(results)
        }
    
    async def get_provider_status(self) -> List[str]:
        return [provider.value for provider in self.providers.keys()]
    
    def get_usage_stats(self, user_id: int = None) -> Dict[str, Any]:
        return {
            "total_requests": 0,
            "most_used_operation": "autocomplete",
            "preferred_provider": "ollama"
        }
