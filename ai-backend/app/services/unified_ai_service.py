import os
from typing import Dict, Any, Optional, List
from enum import Enum

from langchain.prompts import PromptTemplate, ChatPromptTemplate
from langchain.schema import HumanMessage, SystemMessage
from langchain.callbacks.base import BaseCallbackHandler
from langchain_openai import ChatOpenAI
from langchain_groq import ChatGroq
from langchain_ollama import OllamaLLM
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_huggingface import HuggingFaceEndpoint


class AIProvider(Enum):
    OLLAMA = "ollama"
    OPENAI = "openai"
    GROQ = "groq"
    GEMINI = "gemini"
    HUGGINGFACE = "huggingface"


class TokenUsageCallback(BaseCallbackHandler):
    """Callback для відстеження використання токенів"""
    
    def __init__(self):
        self.total_tokens = 0
        self.prompt_tokens = 0
        self.completion_tokens = 0
    
    def on_llm_end(self, response, **kwargs):
        if hasattr(response, 'llm_output') and response.llm_output:
            token_usage = response.llm_output.get('token_usage', {})
            self.total_tokens += token_usage.get('total_tokens', 0)
            self.prompt_tokens += token_usage.get('prompt_tokens', 0)
            self.completion_tokens += token_usage.get('completion_tokens', 0)


class UnifiedAIService:
    def __init__(self):
        self.providers = {}
        self.token_callback = TokenUsageCallback()
        self.setup_providers()
        self.setup_prompts()
    
    def setup_providers(self):
        try:
            self.providers[AIProvider.OLLAMA] = OllamaLLM(
                base_url="http://localhost:11434",
                model="llama3:8b",
                callbacks=[self.token_callback]
            )
        except:
            pass
        
        if os.getenv("OPENAI_API_KEY"):
            self.providers[AIProvider.OPENAI] = ChatOpenAI(
                api_key=os.getenv("OPENAI_API_KEY"),
                model="gpt-3.5-turbo",
                temperature=0.7,
                callbacks=[self.token_callback]
            )
        
        # Groq
        if os.getenv("GROQ_API_KEY"):
            self.providers[AIProvider.GROQ] = ChatGroq(
                api_key=os.getenv("GROQ_API_KEY"),
                model="llama3-8b-8192",
                temperature=0.7,
                callbacks=[self.token_callback]
            )
        
        if os.getenv("GOOGLE_API_KEY"):
            try:
                self.providers[AIProvider.GEMINI] = ChatGoogleGenerativeAI(
                    google_api_key=os.getenv("GOOGLE_API_KEY"),
                    model="gemini-pro",
                    temperature=0.7,
                    callbacks=[self.token_callback]
                )
            except ImportError:
                print("Google Generative AI package not installed")
        
        if os.getenv("HUGGINGFACE_API_KEY"):
            try:
                self.providers[AIProvider.HUGGINGFACE] = HuggingFaceEndpoint(
                    endpoint_url="https://api-inference.huggingface.co/models/microsoft/DialoGPT-large",
                    huggingfacehub_api_token=os.getenv("HUGGINGFACE_API_KEY"),
                    task="text-generation",
                    model_kwargs={
                        "temperature": 0.7,
                        "max_length": 1000,
                        "do_sample": True
                    },
                    callbacks=[self.token_callback]
                )
            except ImportError:
                print("Hugging Face package not installed")
    
    def setup_prompts(self):
        self.chat_prompts = {
            "autocomplete": ChatPromptTemplate.from_messages([
                SystemMessage(content="""You are a Markdown writing assistant. Continue the given Markdown text naturally and coherently.
                
Rules:
- Maintain Markdown formatting (headers, lists, links, etc.)
- Continue in the same style and tone
- Don't explain what you're doing
- Return ONLY the continuation text
- Preserve existing formatting patterns"""),
                HumanMessage(content="Continue this Markdown text naturally:\n\n{text}")
            ]),
            
            "grammar": ChatPromptTemplate.from_messages([
                SystemMessage(content="""You are a Markdown grammar expert. Fix grammar and spelling errors while preserving Markdown formatting.

Rules:
- Keep ALL Markdown syntax intact (**, *, #, [], (), etc.)
- Fix only grammar, spelling, and punctuation errors
- Don't change the meaning or structure
- Don't explain changes
- Return ONLY the corrected text
- Preserve headers, links, lists, and code blocks exactly"""),
                HumanMessage(content="Fix grammar and spelling errors in this Markdown text:\n\n{text}")
            ]),
            
            "translate": ChatPromptTemplate.from_messages([
                SystemMessage(content="""You are a professional Markdown translator. Translate text while preserving ALL Markdown formatting.

Rules:
- Translate ONLY the text content, not Markdown syntax
- Keep headers (# ## ###), links [text](url), lists (- * 1.), code (`code`), etc.
- Preserve URLs, code snippets, and technical terms
- Don't explain the translation
- Return ONLY the translated text with original formatting
- Maintain the same structure and layout"""),
                HumanMessage(content="Translate this Markdown text to {target_language}:\n\n{text}")
            ])
        }
        
        self.text_prompts = {
            "autocomplete": """You are a Markdown writing assistant. Continue the given Markdown text naturally and coherently.

Rules:
- Maintain Markdown formatting (headers, lists, links, etc.)
- Continue in the same style and tone
- Don't explain what you're doing
- Return ONLY the continuation text
- Preserve existing formatting patterns

Continue this Markdown text naturally:

{text}""",
            
            "grammar": """You are a Markdown grammar expert. Fix grammar and spelling errors while preserving Markdown formatting.

Rules:
- Keep ALL Markdown syntax intact (**, *, #, [], (), etc.)
- Fix only grammar, spelling, and punctuation errors
- Don't change the meaning or structure
- Don't explain changes
- Return ONLY the corrected text
- Preserve headers, links, lists, and code blocks exactly

Fix grammar and spelling errors in this Markdown text:

{text}""",
            
            "translate": """You are a professional Markdown translator. Translate text while preserving ALL Markdown formatting.

Rules:
- Translate ONLY the text content, not Markdown syntax
- Keep headers (# ## ###), links [text](url), lists (- * 1.), code (`code`), etc.
- Preserve URLs, code snippets, and technical terms
- Don't explain the translation
- Return ONLY the translated text with original formatting
- Maintain the same structure and layout

Translate this Markdown text to {target_language}:

{text}"""
        }
    
    async def _execute_with_chain(self, provider: AIProvider, operation: str, **kwargs) -> str:
        """Виконання операції через LangChain prompts"""
        try:
            if provider not in self.providers:
                raise Exception(f"Provider {provider.value} not available")
            
            llm = self.providers[provider]
            
            if provider == AIProvider.OLLAMA:
                if operation not in self.text_prompts:
                    raise Exception(f"Operation {operation} not supported for Ollama")
                
                prompt_template = self.text_prompts[operation]
                
                if operation == "translate":
                    prompt_text = prompt_template.format(
                        text=kwargs.get("text", ""),
                        target_language=kwargs.get("target_language", "Ukrainian")
                    )
                else:
                    prompt_text = prompt_template.format(text=kwargs.get("text", ""))
                
                result = await llm.ainvoke(prompt_text)
                
            else:
                if operation not in self.chat_prompts:
                    raise Exception(f"Operation {operation} not supported")
                
                prompt_template = self.chat_prompts[operation]
                
                if operation == "translate":
                    messages = prompt_template.format_messages(
                        text=kwargs.get("text", ""),
                        target_language=kwargs.get("target_language", "Ukrainian")
                    )
                else:
                    messages = prompt_template.format_messages(text=kwargs.get("text", ""))
                
                result = await llm.ainvoke(messages)
            
            if hasattr(result, 'content'):
                return result.content.strip()
            else:
                return str(result).strip()
            
        except Exception as e:
            raise Exception(f"Provider {provider.value} failed: {str(e)}")
    
    async def _execute_with_fallback(self, operation: str, preferred_provider: AIProvider = None, **kwargs) -> Dict[str, Any]:
        
        provider_order = []
        if preferred_provider and preferred_provider in self.providers:
            provider_order.append(preferred_provider)
        
        priority_order = [AIProvider.GROQ, AIProvider.GEMINI, AIProvider.OPENAI, AIProvider.HUGGINGFACE, AIProvider.OLLAMA]
        for provider in priority_order:
            if provider in self.providers and provider not in provider_order:
                provider_order.append(provider)
        
        last_error = None
        
        for provider in provider_order:
            try:
                result = await self._execute_with_chain(provider, operation, **kwargs)
                
                return {
                    "success": True,
                    "result": result,
                    "provider_used": provider.value,
                    "token_usage": {
                        "total_tokens": self.token_callback.total_tokens,
                        "prompt_tokens": self.token_callback.prompt_tokens,
                        "completion_tokens": self.token_callback.completion_tokens
                    }
                }
                
            except Exception as e:
                last_error = e
                print(f"Provider {provider.value} failed for {operation}: {e}")
                continue
        
        raise Exception(f"All providers failed for {operation}. Last error: {last_error}")
    
    async def autocomplete(self, text: str, preferred_provider: AIProvider = None, use_memory: bool = True) -> Dict[str, Any]:
        return await self._execute_with_fallback(
            operation="autocomplete",
            preferred_provider=preferred_provider,
            text=text
        )
    
    async def grammar_check(self, text: str, preferred_provider: AIProvider = None) -> Dict[str, Any]:
        return await self._execute_with_fallback(
            operation="grammar",
            preferred_provider=preferred_provider,
            text=text
        )
    
    async def translate(self, text: str, target_language: str, preferred_provider: AIProvider = None) -> Dict[str, Any]:
        return await self._execute_with_fallback(
            operation="translate",
            preferred_provider=preferred_provider,
            text=text,
            target_language=target_language
        )

    async def health_check(self) -> Dict[str, Any]:
        results = {}
        
        for provider_type in self.providers.keys():
            try:
                test_result = await self._execute_with_chain(
                    provider_type, 
                    "autocomplete", 
                    text="Hello"
                )
                
                results[provider_type.value] = {
                    "healthy": True,
                    "response_preview": test_result[:50] + "..." if len(test_result) > 50 else test_result,
                    "model": self._get_provider_model(provider_type)
                }
                
            except Exception as e:
                results[provider_type.value] = {
                    "healthy": False,
                    "error": str(e),
                    "model": self._get_provider_model(provider_type)
                }
        
        return {
            "providers": results,
            "healthy_count": sum(1 for r in results.values() if r.get("healthy")),
            "total_count": len(results),
            "available_operations": ["autocomplete", "grammar", "translate"]
        }
    
    def _get_provider_model(self, provider: AIProvider) -> str:
        model_mapping = {
            AIProvider.OLLAMA: "llama3:8b",
            AIProvider.OPENAI: "gpt-3.5-turbo",
            AIProvider.GROQ: "llama3-8b-8192",
            AIProvider.GEMINI: "gemini-pro",
            AIProvider.HUGGINGFACE: "microsoft/DialoGPT-large"
        }
        return model_mapping.get(provider, "unknown")
    
    def get_available_providers(self) -> List[str]:
        return [provider.value for provider in self.providers.keys()]
    
    def get_token_usage(self) -> Dict[str, int]:
        return {
            "total_tokens": self.token_callback.total_tokens,
            "prompt_tokens": self.token_callback.prompt_tokens,
            "completion_tokens": self.token_callback.completion_tokens
        }
    
    def reset_token_counter(self):
        self.token_callback = TokenUsageCallback()