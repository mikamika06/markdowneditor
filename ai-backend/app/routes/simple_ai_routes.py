from fastapi import APIRouter, HTTPException, status
from app.schemas.ai_schemas import (
    AutocompleteRequest, 
    GrammarRequest, 
    TranslateRequest, 
    AIResponse
)
from app.services.unified_ai_service import UnifiedAIService

router = APIRouter(prefix="/ai", tags=["ai"])

ai_service = UnifiedAIService()


@router.get("/health")
async def health_check():
    try:
        health = await ai_service.health_check()
        return {"status": "healthy", "providers": health}
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI service error: {str(e)}"
        )


@router.post("/autocomplete", response_model=AIResponse)
async def autocomplete_text(request: AutocompleteRequest):
    try:
        response = await ai_service.autocomplete(request.text)
        return AIResponse(
            success=response["success"], 
            result=response["result"], 
            provider_used=response.get("provider_used", "unknown")
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Autocomplete error: {str(e)}"
        )


@router.post("/grammar", response_model=AIResponse)
async def check_grammar(request: GrammarRequest):
    try:
        response = await ai_service.grammar_check(request.text)
        return AIResponse(
            success=response["success"], 
            result=response["result"], 
            provider_used=response.get("provider_used", "unknown")
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Grammar check error: {str(e)}"
        )


@router.post("/translate", response_model=AIResponse)
async def translate_text(request: TranslateRequest):
    """Переклад тексту"""
    try:
        response = await ai_service.translate(request.text, request.target_language)
        return AIResponse(
            success=response["success"], 
            result=response["result"], 
            provider_used=response.get("provider_used", "unknown")
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Translation error: {str(e)}"
        )