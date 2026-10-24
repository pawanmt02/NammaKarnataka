"""
Content moderation service for text and audio submissions.
"""

import logging
from typing import Optional, Any

import google.generativeai as genai

from app.core.config import settings

logger = logging.getLogger(__name__)

# Initialize Gemini for toxicity checks
genai.configure(api_key=settings.GEMINI_API_KEY)

# Basic blocklist for zero-shot filtering (extend as needed)
_BLOCKLIST = [
    "spam",
    "scam",
    "abuse",
    "harassment",
    "hate",
    "violence",
    "explicit",
]


class ModerationService:
    """Service for moderating user-submitted text and audio content."""

    def __init__(self):
        self.model = genai.GenerativeModel("gemini-1.5-pro")

    async def check_text_content(self, text: str) -> dict:
        """
        Check text for toxicity using a keyword blocklist and Gemini-based
        toxicity analysis.

        Args:
            text: The text content to moderate.

        Returns:
            A dict with toxicity_score (0-1), flags list, and auto_decision
            ("approved", "rejected", or "review").
        """
        flags: list[str] = []
        text_lower = text.lower()

        # --- Stage 1: keyword blocklist ---
        for keyword in _BLOCKLIST:
            if keyword in text_lower:
                flags.append(f"blocklist:{keyword}")

        # --- Stage 2: Gemini-based toxicity analysis ---
        toxicity_score = 0.0
        try:
            prompt = f"""You are a content moderation system. Analyze the following text for toxicity,
hate speech, harassment, sexually explicit content, or dangerous content.

Text to analyze: "{text}"

Respond with ONLY a JSON object:
{{
  "toxicity_score": <float 0.0 to 1.0, where 0 is perfectly safe and 1 is highly toxic>,
  "categories": ["<list of detected issue categories, if any>"],
  "reasoning": "<brief explanation>"
}}"""

            response = await self.model.generate_content_async(prompt)
            import json

            cleaned = response.text.strip()
            if cleaned.startswith("```json"):
                cleaned = cleaned[7:]
            elif cleaned.startswith("```"):
                cleaned = cleaned[3:]
            if cleaned.endswith("```"):
                cleaned = cleaned[:-3]

            result = json.loads(cleaned.strip())
            toxicity_score = float(result.get("toxicity_score", 0.0))
            ai_categories = result.get("categories", [])
            if ai_categories:
                flags.extend([f"ai:{cat}" for cat in ai_categories])
        except Exception as exc:
            logger.warning("Gemini moderation check failed: %s", exc)
            # If AI check fails, rely on blocklist alone
            if flags:
                toxicity_score = 0.5

        # Combine blocklist hit penalty
        if any(f.startswith("blocklist:") for f in flags):
            toxicity_score = max(toxicity_score, 0.6)

        # Determine auto decision
        if toxicity_score >= 0.7:
            auto_decision = "rejected"
        elif toxicity_score >= 0.4:
            auto_decision = "review"
        else:
            auto_decision = "approved"

        return {
            "toxicity_score": round(toxicity_score, 3),
            "flags": flags,
            "auto_decision": auto_decision,
        }

    async def check_audio_quality(self, audio_bytes: bytes) -> dict:
        """
        Check audio quality metrics. Uses librosa if available, otherwise
        returns stub metrics based on byte length.

        Args:
            audio_bytes: Raw audio file bytes.

        Returns:
            A dict with audio_quality_score (0-1) and metadata.
        """
        audio_size = len(audio_bytes)

        try:
            import io
            import librosa
            import numpy as np
            import soundfile as sf

            # Load audio from bytes
            audio_data, sample_rate = sf.read(io.BytesIO(audio_bytes))
            duration = len(audio_data) / sample_rate

            # Basic quality heuristics
            quality_score = 1.0

            # Penalize very short audio (< 1 second)
            if duration < 1.0:
                quality_score -= 0.4

            # Penalize very long audio (> 60 seconds)
            if duration > 60.0:
                quality_score -= 0.2

            # Check for near-silence (RMS energy)
            rms = np.sqrt(np.mean(audio_data**2))
            if rms < 0.01:
                quality_score -= 0.3

            quality_score = max(0.0, min(1.0, quality_score))

            return {
                "audio_quality_score": round(quality_score, 3),
                "duration_seconds": round(duration, 2),
                "sample_rate": sample_rate,
                "file_size_bytes": audio_size,
            }

        except ImportError:
            logger.info(
                "librosa/soundfile not available; using stub audio quality check"
            )
            # Stub: estimate quality from file size
            quality_score = 1.0
            if audio_size < 1000:
                quality_score = 0.3  # Suspiciously small
            elif audio_size > 10_000_000:
                quality_score = 0.6  # Very large file

            return {
                "audio_quality_score": round(quality_score, 3),
                "duration_seconds": None,
                "sample_rate": None,
                "file_size_bytes": audio_size,
            }

        except Exception as exc:
            logger.error("Audio quality check failed: %s", exc)
            return {
                "audio_quality_score": 0.5,
                "duration_seconds": None,
                "sample_rate": None,
                "file_size_bytes": audio_size,
                "error": str(exc),
            }

    async def moderate_submission(
        self,
        submission_or_data: Any = None,
        phrase_data: Optional[dict] = None,
        audio_bytes: Optional[bytes] = None,
    ) -> dict:
        """
        Orchestrate moderation for a phrase submission, checking both text
        content and optional audio. Accepts either (phrase_data) or (submission_id, phrase_data).
        """
        # Resolve parameters regardless of calling convention
        if isinstance(submission_or_data, dict):
            target_data = submission_or_data
        elif isinstance(phrase_data, dict):
            target_data = phrase_data
        else:
            target_data = {}

        # Check all text fields in the phrase data
        text_parts = []
        for field in ("regional_form", "standard_kannada", "usage_context", "phrase", "translated_text", "cultural_notes", "description"):
            value = target_data.get(field)
            if value and isinstance(value, str):
                text_parts.append(value)

        combined_text = " ".join(text_parts)
        text_result = await self.check_text_content(combined_text)

        audio_result = None
        if audio_bytes:
            audio_result = await self.check_audio_quality(audio_bytes)

        # Determine overall decision
        overall_decision = text_result["auto_decision"]
        overall_score = text_result["toxicity_score"]

        if audio_result and audio_result.get("audio_quality_score", 1.0) < 0.4:
            if overall_decision == "approved":
                overall_decision = "review"

        return {
            "overall_decision": overall_decision,
            "overall_score": overall_score,
            "text_moderation": text_result,
            "audio_moderation": audio_result,
            "is_approved": overall_decision == "approved",
        }
