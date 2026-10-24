"""
Namma Kannada API - Translation Router
Dialect translation and cultural context endpoints.
"""

from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.models.schemas import (
    DialectRegion,
    TranslationRequest,
    TranslationResponse,
)
from app.services.dialect_translator import DialectTranslatorService

router = APIRouter(prefix="/translate", tags=["Translation"])


class CulturalContextRequest(BaseModel):
    """Request body for cultural context lookup."""
    phrase: str = Field(..., min_length=1, max_length=2000)
    region: DialectRegion


@router.post("/dialect", response_model=TranslationResponse)
async def translate_to_dialect(request: TranslationRequest):
    """Translate text to a regional Kannada dialect."""
    translator = DialectTranslatorService()
    result = await translator.translate_to_dialect(
        text=request.text,
        source_language=request.source_language,
        target_dialect=request.target_dialect,
    )
    return TranslationResponse(**result)


@router.post("/cultural-context")
async def get_cultural_context(request: CulturalContextRequest):
    """Get cultural context and background for a phrase in a specific region."""
    translator = DialectTranslatorService()
    context = await translator.generate_cultural_context(
        phrase=request.phrase,
        region=request.region,
    )
    return context
