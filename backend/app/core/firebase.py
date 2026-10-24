"""
Namma Kannada Backend - Firebase Admin SDK Initialization
Singleton pattern for Firebase app and Firestore client, with resilient fallback.
"""

import os
import logging

try:
    import firebase_admin
    from firebase_admin import credentials, firestore, storage, auth
    has_firebase_admin = True
except ImportError:
    has_firebase_admin = False
    firebase_admin = None
    credentials = None
    firestore = None
    storage = None
    auth = None

from app.core.config import settings

logger = logging.getLogger(__name__)

_firebase_app = None
_is_mock = not has_firebase_admin


def get_firebase_app():
    """Initialize Firebase Admin SDK (singleton) with fallback for local dev."""
    global _firebase_app, _is_mock
    if not has_firebase_admin:
        _is_mock = True
        return None
    if _firebase_app is None:
        cred_path = settings.FIREBASE_CREDENTIALS_PATH
        try:
            if os.path.exists(cred_path):
                cred = credentials.Certificate(cred_path)
            else:
                cred = credentials.ApplicationDefault()

            _firebase_app = firebase_admin.initialize_app(
                cred,
                {
                    "projectId": settings.FIREBASE_PROJECT_ID,
                    "storageBucket": f"{settings.FIREBASE_PROJECT_ID}.appspot.com",
                },
            )
            _is_mock = False
            logger.info("Firebase Admin SDK successfully initialized.")
        except Exception as e:
            logger.warning(
                "Firebase credentials not found or initialization failed (%s). "
                "Operating in resilient local fallback mode for development.",
                e,
            )
            _is_mock = True
    return _firebase_app


def is_mock_mode() -> bool:
    """Return whether Firebase is running in mock/local fallback mode."""
    get_firebase_app()
    return _is_mock


def get_firestore_client():
    """Get Firestore client instance, or None if in mock mode."""
    app = get_firebase_app()
    if _is_mock or app is None:
        return None
    try:
        return firestore.client()
    except Exception as e:
        logger.warning("Could not obtain live Firestore client: %s", e)
        return None


def get_storage_bucket():
    """Get Firebase Storage bucket, or None if in mock mode."""
    app = get_firebase_app()
    if _is_mock or app is None:
        return None
    try:
        return storage.bucket()
    except Exception as e:
        logger.warning("Could not obtain live Storage bucket: %s", e)
        return None


def verify_firebase_token(id_token: str) -> dict:
    """Verify a Firebase ID token or return mock claims for local testing."""
    if _is_mock or get_firebase_app() is None:
        # Mock payload for testing
        return {
            "uid": "dev-user-123",
            "email": "researcher@nammakannada.org",
            "name": "Kannada Researcher",
            "role": "linguist",
        }
    try:
        return auth.verify_id_token(id_token)
    except Exception as e:
        logger.error("Token verification failed: %s", e)
        raise
