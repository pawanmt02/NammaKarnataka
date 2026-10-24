"""
Namma Kannada - Dialect Translator Service Alias
Re-exports DialectTranslatorService from gemini_service.
"""

from app.services.gemini_service import DialectTranslatorService

__all__ = ["DialectTranslatorService"]
