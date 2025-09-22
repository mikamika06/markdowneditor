from fastapi import APIRouter, Depends, HTTPException, status

from app.core.database import get_db
from app.routes.auth import get_current_user
from app.models.user import User
from app.schemas.simple_ai_schemas import (
    AutocompleteRequest, 
    GrammarRequest, 
    TranslateRequest, 
    AIResponse
)
from app.services.unified_ai_service import UnifiedAIService, AIProvider

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/autocomplete", response_model=AIResponse)
async def autocomplete_text(
    request: AutocompleteRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        ai_service = UnifiedAIService()
        
        result = await ai_service.autocomplete(
            text=request.text,
            preferred_provider=request.preferred_provider
        )
        
        return AIResponse(
            success=True,
            result=result,
            provider_used=request.preferred_provider.value if request.preferred_provider else "ollama"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Autocomplete failed: {str(e)}"
        )


@router.post("/grammar", response_model=AIResponse)
async def check_grammar(
    request: GrammarRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        ai_service = UnifiedAIService()
        
        result = await ai_service.grammar_check(
            text=request.text,
            preferred_provider=request.preferred_provider
        )
        
        return AIResponse(
            success=True,
            result=result,
            provider_used=request.preferred_provider.value if request.preferred_provider else "ollama"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Grammar check failed: {str(e)}"
        )


@router.post("/translate", response_model=AIResponse)
async def translate_text(
    request: TranslateRequest,
    current_user: User = Depends(get_current_user)
):
    try:
        ai_service = UnifiedAIService()
        
        result = await ai_service.translate(
            text=request.text,
            target_language=request.target_language,
            preferred_provider=request.preferred_provider
        )
        
        return AIResponse(
            success=True,
            result=result,
            provider_used=request.preferred_provider.value if request.preferred_provider else "ollama"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Translation failed: {str(e)}"
        )


@router.get("/health")
async def health_check(current_user: User = Depends(get_current_user)):
    try:
        ai_service = UnifiedAIService()
        results = await ai_service.health_check()
        
        return {
            "providers": results,
            "available_count": sum(1 for r in results.values() if r.get("healthy")),
            "total_count": len(results)
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Health check failed: {str(e)}"
        )