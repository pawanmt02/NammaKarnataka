"""
Namma Kannada API - Authentication Router
Firebase token verification and JWT issuance.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field

from app.core.firebase import verify_firebase_token
from app.core.security import create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])


class FirebaseLoginRequest(BaseModel):
    """Request body for Firebase login."""
    id_token: str = Field(..., min_length=1)


@router.post("/firebase-login")
async def firebase_login(request: FirebaseLoginRequest):
    """
    Verify a Firebase ID token, then issue a local JWT access token.
    """
    try:
        decoded = verify_firebase_token(request.id_token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Firebase ID token",
        )

    jwt_token = create_access_token(
        data={
            "sub": decoded["uid"],
            "email": decoded.get("email", ""),
            "name": decoded.get("name", decoded.get("email", "")),
        }
    )

    return {
        "access_token": jwt_token,
        "token_type": "bearer",
        "user": {
            "uid": decoded["uid"],
            "email": decoded.get("email", ""),
            "display_name": decoded.get("name", ""),
            "photo_url": decoded.get("picture", ""),
        },
    }


@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    """Return the currently authenticated user's info."""
    return current_user
