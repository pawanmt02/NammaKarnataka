"""
Gemini AI service for Kannada dialect translation and cultural context generation.
"""

import json
import logging
from typing import Optional

import google.generativeai as genai

from app.core.config import settings

logger = logging.getLogger(__name__)

# Initialize Gemini
genai.configure(api_key=settings.GEMINI_API_KEY)


def _parse_json_response(text: str) -> dict:
    """Parse JSON from Gemini response, stripping markdown code fences if present."""
    cleaned = text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    elif cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    return json.loads(cleaned.strip())


class DialectTranslatorService:
    """Service for translating text into Kannada regional dialects using Gemini AI."""

    def __init__(self):
        self.model = genai.GenerativeModel("gemini-1.5-pro")

    async def translate_to_dialect(
        self,
        text: str,
        source_language: str,
        target_dialect: str,
    ) -> dict:
        """
        Translate text from Standard Kannada or English into a specific
        regional Kannada dialect.

        Args:
            text: The source text to translate.
            source_language: The language of the source text (e.g. "kannada", "english").
            target_dialect: The target regional dialect (e.g. "Dharwad", "Mangalore", "Hubli").

        Returns:
            A dict with translated_text, pronunciation_guide, cultural_notes,
            confidence, and example_usage.
        """
        prompt = f"""You are an expert linguist specializing in Kannada regional dialects.
Translate the following text into the authentic **{target_dialect}** regional dialect of Kannada.

Source language: {source_language}
Source text: "{text}"

Important guidelines:
- Use the authentic regional vocabulary, grammar patterns, and idioms specific to the {target_dialect} region.
- Capture the natural speech patterns and colloquialisms of native speakers from that area.
- If certain words have no direct dialect equivalent, keep the Standard Kannada form and note it.

Respond ONLY with valid JSON in this exact format:
{{
  "translated_text": "<the dialect translation in Kannada script>",
  "pronunciation_guide": "<romanized pronunciation guide with stress markers>",
  "cultural_notes": "<brief notes on regional usage, context, or cultural significance>",
  "confidence": <float between 0 and 1 indicating translation confidence>,
  "example_usage": "<an example sentence showing the translated phrase used naturally in conversation>"
}}"""

        try:
            response = await self.model.generate_content_async(prompt)
            return _parse_json_response(response.text)
        except json.JSONDecodeError as exc:
            logger.error("Failed to parse Gemini translation response: %s", exc)
            return {
                "translated_text": "",
                "pronunciation_guide": "",
                "cultural_notes": "Translation parsing failed. Please try again.",
                "confidence": 0.0,
                "example_usage": "",
            }
        except Exception as exc:
            logger.error("Gemini translation error: %s", exc)
            raise

    async def generate_cultural_context(
        self,
        phrase: str,
        dialect_region: str,
    ) -> dict:
        """
        Generate rich cultural context about a phrase from a specific
        Kannada-speaking region.

        Args:
            phrase: The Kannada phrase to contextualize.
            dialect_region: The region the phrase belongs to.

        Returns:
            A dict with cultural context information.
        """
        prompt = f"""You are a cultural anthropologist and linguist specializing in Karnataka's regional cultures.

Provide rich cultural context for the following phrase from the **{dialect_region}** region of Karnataka:

Phrase: "{phrase}"

Cover the following aspects:
1. Historical origin and evolution of this phrase
2. Social contexts where this phrase is commonly used
3. Regional festivals, traditions, or customs associated with it
4. How usage differs across age groups or social settings
5. Similar expressions in neighboring dialect regions
6. Any folklore, proverbs, or literary references

Respond ONLY with valid JSON in this exact format:
{{
  "phrase": "<the original phrase>",
  "region": "<the dialect region>",
  "historical_origin": "<origin and history>",
  "social_context": "<when and how it is used>",
  "cultural_associations": "<festivals, traditions, customs>",
  "usage_variations": "<how usage varies by age/setting>",
  "related_expressions": [
    {{"region": "<region name>", "expression": "<similar expression>", "meaning": "<meaning>"}}
  ],
  "literary_references": "<folklore, proverbs, literary mentions>"
}}"""

        try:
            response = await self.model.generate_content_async(prompt)
            return _parse_json_response(response.text)
        except json.JSONDecodeError as exc:
            logger.error("Failed to parse cultural context response: %s", exc)
            return {
                "phrase": phrase,
                "region": dialect_region,
                "historical_origin": "",
                "social_context": "",
                "cultural_associations": "",
                "usage_variations": "",
                "related_expressions": [],
                "literary_references": "",
            }
        except Exception as exc:
            logger.error("Gemini cultural context error: %s", exc)
            raise

    async def generate_etymology(self, word: str) -> dict:
        """
        Trace the etymological roots of a Kannada word, returning a graph
        structure with nodes and edges.

        Args:
            word: The Kannada word to analyze.

        Returns:
            A dict with nodes and edges representing the etymology graph.
        """
        prompt = f"""You are an expert etymologist specializing in Dravidian languages, particularly Kannada.

Trace the etymological roots of the Kannada word: "{word}"

Provide the etymology as a directed graph structure showing how the word evolved
through different languages and time periods. Include:
- Proto-Dravidian roots if applicable
- Sanskrit borrowings or influences
- Prakrit / Old Kannada forms
- Regional variations
- Modern Standard Kannada form

Respond ONLY with valid JSON in this exact format:
{{
  "word": "<the word>",
  "meaning": "<current meaning>",
  "language_family": "Dravidian",
  "nodes": [
    {{
      "id": "<unique id>",
      "label": "<the word form>",
      "language": "<language or period>",
      "era": "<approximate era>",
      "meaning": "<meaning at that stage>"
    }}
  ],
  "edges": [
    {{
      "source": "<source node id>",
      "target": "<target node id>",
      "relationship": "<e.g. 'derived from', 'borrowed from', 'evolved into'>"
    }}
  ],
  "notes": "<additional etymological notes>"
}}"""

        try:
            response = await self.model.generate_content_async(prompt)
            return _parse_json_response(response.text)
        except json.JSONDecodeError as exc:
            logger.error("Failed to parse etymology response: %s", exc)
            return {
                "word": word,
                "meaning": "",
                "language_family": "Dravidian",
                "nodes": [],
                "edges": [],
                "notes": "Etymology parsing failed. Please try again.",
            }
        except Exception as exc:
            logger.error("Gemini etymology error: %s", exc)
            raise

    async def generate_quiz_questions(
        self,
        dialect_region: str,
        count: int = 5,
    ) -> list[dict]:
        """
        Generate quiz questions about a Kannada dialect region.

        Args:
            dialect_region: The region to generate questions about.
            count: Number of questions to generate.

        Returns:
            A list of quiz question dicts.
        """
        prompt = f"""You are a Kannada language quiz master with deep knowledge of regional dialects.

Generate {count} multiple-choice quiz questions about the **{dialect_region}** Kannada dialect.

Questions should test knowledge of:
- Unique vocabulary and words specific to {dialect_region}
- Grammar differences from Standard Kannada
- Cultural phrases and idioms
- Pronunciation patterns
- Regional customs reflected in language

Each question must have exactly 4 options with one correct answer.

Respond ONLY with valid JSON in this exact format:
{{
  "questions": [
    {{
      "question": "<question text in English>",
      "kannada_context": "<any Kannada text relevant to the question>",
      "options": ["<option A>", "<option B>", "<option C>", "<option D>"],
      "correct_answer": <0-based index of correct option>,
      "explanation": "<why this answer is correct>",
      "difficulty": "<easy|medium|hard>"
    }}
  ]
}}"""

        try:
            response = await self.model.generate_content_async(prompt)
            parsed = _parse_json_response(response.text)
            return parsed.get("questions", [])
        except json.JSONDecodeError as exc:
            logger.error("Failed to parse quiz response: %s", exc)
            return []
        except Exception as exc:
            logger.error("Gemini quiz generation error: %s", exc)
            raise

    async def get_phrase_of_the_day(self, region: str) -> dict:
        """
        Get a culturally interesting phrase of the day for a given region.

        Args:
            region: The Kannada dialect region.

        Returns:
            A dict with the phrase, meaning, and cultural notes.
        """
        prompt = f"""You are a Kannada language and culture expert.

Suggest one culturally interesting and meaningful phrase from the **{region}** dialect
of Kannada that would be a great "Phrase of the Day" for language learners.

Choose a phrase that is:
- Commonly used by native speakers of the {region} dialect
- Culturally rich with an interesting backstory
- Useful in everyday conversation
- Distinct from Standard Kannada

Respond ONLY with valid JSON in this exact format:
{{
  "phrase": "<the phrase in Kannada script>",
  "transliteration": "<romanized pronunciation>",
  "literal_meaning": "<word-by-word literal meaning>",
  "actual_meaning": "<what it actually means in context>",
  "region": "{region}",
  "usage_context": "<when and how to use this phrase>",
  "cultural_note": "<interesting cultural backstory>",
  "example_dialogue": {{
    "kannada": "<example conversation using the phrase>",
    "english": "<English translation of the conversation>"
  }}
}}"""

        try:
            response = await self.model.generate_content_async(prompt)
            return _parse_json_response(response.text)
        except json.JSONDecodeError as exc:
            logger.error("Failed to parse phrase of the day response: %s", exc)
            return {
                "phrase": "",
                "transliteration": "",
                "literal_meaning": "",
                "actual_meaning": "",
                "region": region,
                "usage_context": "",
                "cultural_note": "Failed to generate phrase. Please try again.",
                "example_dialogue": {"kannada": "", "english": ""},
            }
        except Exception as exc:
            logger.error("Gemini phrase of the day error: %s", exc)
            raise
