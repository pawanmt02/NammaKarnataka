"""
Namma Kannada API - Developer API Router
API key management and public documentation.
"""

from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends

from app.core.security import get_current_user
from app.models.schemas import APIKeyRequest, APIKeyResponse
from app.services.firestore_service import FirestoreService

router = APIRouter(prefix="/developer", tags=["Developer API"])


@router.post("/api-keys", response_model=APIKeyResponse)
async def generate_api_key(
    request: APIKeyRequest,
    current_user: dict = Depends(get_current_user),
):
    """Generate a new developer API key (authenticated)."""
    firestore_svc = FirestoreService()
    key_data = await firestore_svc.create_api_key(
        uid=current_user["uid"],
        app_name=request.app_name,
        purpose=request.purpose,
        organization=request.organization,
    )
    return APIKeyResponse(**key_data)


@router.get("/docs")
async def get_api_docs():
    """Return a static description of available public API endpoints."""
    return {
        "api_version": "v1",
        "base_url": "/api/v1",
        "endpoints": [
            {
                "path": "/phrases",
                "methods": ["GET", "POST"],
                "description": "Browse, search, and contribute dialect phrases.",
                "auth_required": "POST only",
            },
            {
                "path": "/phrases/{phrase_id}",
                "methods": ["GET"],
                "description": "Get details of a specific phrase.",
                "auth_required": False,
            },
            {
                "path": "/translate/dialect",
                "methods": ["POST"],
                "description": "Translate text into a regional Kannada dialect.",
                "auth_required": False,
            },
            {
                "path": "/translate/cultural-context",
                "methods": ["POST"],
                "description": "Get cultural context for a phrase in a region.",
                "auth_required": False,
            },
            {
                "path": "/quiz/questions",
                "methods": ["GET"],
                "description": "Generate dialect quiz questions.",
                "auth_required": False,
            },
            {
                "path": "/quiz/submit",
                "methods": ["POST"],
                "description": "Submit quiz answers and receive a score.",
                "auth_required": True,
            },
            {
                "path": "/quiz/leaderboard",
                "methods": ["GET"],
                "description": "View the global leaderboard.",
                "auth_required": False,
            },
            {
                "path": "/etymology/{word}",
                "methods": ["GET"],
                "description": "Get the etymology knowledge graph for a word.",
                "auth_required": False,
            },
            {
                "path": "/geo/phrase-of-day/{region}",
                "methods": ["GET"],
                "description": "Get the phrase of the day for a dialect region.",
                "auth_required": False,
            },
            {
                "path": "/geo/regions",
                "methods": ["GET"],
                "description": "List all dialect regions with coordinates.",
                "auth_required": False,
            },
        ],
    }
