"""
Namma Kannada API - Etymology Router
Word etymology knowledge graph endpoint.
"""

from fastapi import APIRouter

from app.models.schemas import EtymologyGraph
from app.services.dialect_translator import DialectTranslatorService

router = APIRouter(prefix="/etymology", tags=["Etymology"])


@router.get("/{word}", response_model=EtymologyGraph)
async def get_etymology(word: str):
    """Get the etymology knowledge graph for a Kannada word."""
    translator = DialectTranslatorService()
    graph = await translator.generate_etymology(word=word)
    return EtymologyGraph(**graph)
