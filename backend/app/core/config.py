"""
Namma Kannada Backend - Configuration Module
Centralized settings using Pydantic Settings with .env support.
"""

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Project
    PROJECT_NAME: str = "Namma Kannada API"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api/v1"
    DEBUG: bool = False

    # Firebase
    FIREBASE_PROJECT_ID: str = "namma-kannada"
    FIREBASE_CREDENTIALS_PATH: str = "./firebase-service-account.json"

    # Google Gemini
    GEMINI_API_KEY: str = ""

    # JWT Authentication
    JWT_SECRET_KEY: str = "change-this-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # CORS
    ALLOWED_ORIGINS: str = "http://localhost:3000,https://namma-kannada.vercel.app"

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",")]

    # Rate Limiting
    RATE_LIMIT: str = "100/minute"

    # Audio Upload
    MAX_AUDIO_SIZE_MB: int = 10
    ALLOWED_AUDIO_TYPES: List[str] = ["audio/ogg", "audio/mpeg", "audio/wav", "audio/webm"]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


settings = Settings()
