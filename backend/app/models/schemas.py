"""
Namma Kannada - Pydantic Data Models
Defines request/response schemas for all API endpoints.
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from enum import Enum


# ─── Enums ────────────────────────────────────────────────────────────────────

class DialectRegion(str, Enum):
    """Karnataka dialect regions."""
    NORTH_KARNATAKA = "north_karnataka"        # Dharwad, Belgaum, Bijapur
    SOUTH_KARNATAKA = "south_karnataka"        # Mysuru, Mandya
    COASTAL_KARNATAKA = "coastal_karnataka"    # Mangaluru, Udupi (Kundapura)
    OLD_MYSURU = "old_mysuru"                  # Chamarajanagar, Hassan
    HYDERABAD_KARNATAKA = "hyderabad_karnataka"  # Gulbarga, Raichur, Bidar
    MALNAD = "malnad"                          # Shimoga, Chikmagalur (Havyaka)
    KODAGU = "kodagu"                          # Coorg
    SOLIGA = "soliga"                          # BR Hills tribal
    STANDARD = "standard"                      # Shaale Kannada


class ModerationStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    FLAGGED = "flagged"


class BadgeType(str, Enum):
    MYSURU_SCHOLAR = "mysuru_scholar"
    KARAVALI_EXPERT = "karavali_expert"
    MALNAD_MAVEN = "malnad_maven"
    NORTH_KA_NAVIGATOR = "north_ka_navigator"
    KODAGU_KEEPER = "kodagu_keeper"
    POLYGLOT = "polyglot"
    CONTRIBUTOR_BRONZE = "contributor_bronze"
    CONTRIBUTOR_SILVER = "contributor_silver"
    CONTRIBUTOR_GOLD = "contributor_gold"
    QUIZ_MASTER = "quiz_master"


# ─── Phrase / Word Models ────────────────────────────────────────────────────

class PhraseBase(BaseModel):
    """Base schema for a dialect phrase or word."""
    standard_kannada: str = Field(..., min_length=1, max_length=500, description="Phrase in standard Kannada")
    regional_form: str = Field(..., min_length=1, max_length=500, description="Phrase in the regional dialect")
    english_translation: Optional[str] = Field(None, max_length=500, description="English translation")
    dialect_region: DialectRegion
    pronunciation_guide: Optional[str] = Field(None, max_length=300, description="Romanized pronunciation")
    usage_context: Optional[str] = Field(None, max_length=1000, description="Cultural usage context")
    tags: List[str] = Field(default_factory=list, description="Tags like 'greeting', 'food', 'proverb'")


class PhraseCreate(PhraseBase):
    """Schema for creating a new phrase."""
    audio_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None


class PhraseResponse(PhraseBase):
    """Schema for phrase API responses."""
    id: str
    audio_url: Optional[str] = None
    contributor_id: str
    contributor_name: str
    moderation_status: ModerationStatus = ModerationStatus.PENDING
    upvotes: int = 0
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    created_at: datetime
    updated_at: Optional[datetime] = None


class PhraseListResponse(BaseModel):
    """Paginated list of phrases."""
    phrases: List[PhraseResponse]
    total: int
    page: int
    page_size: int
    has_next: bool


# ─── Translation Models ─────────────────────────────────────────────────────

class TranslationRequest(BaseModel):
    """Request to translate text into a regional dialect."""
    text: str = Field(..., min_length=1, max_length=2000, description="Text to translate")
    source_language: str = Field(default="standard_kannada", description="Source: 'standard_kannada' or 'english'")
    target_dialect: DialectRegion = Field(..., description="Target regional dialect")


class TranslationResponse(BaseModel):
    """Response from the dialect translator."""
    original_text: str
    translated_text: str
    target_dialect: DialectRegion
    pronunciation_guide: str
    cultural_notes: str
    confidence: float = Field(ge=0.0, le=1.0)
    example_usage: Optional[str] = None


# ─── Quiz / Gamification Models ─────────────────────────────────────────────

class QuizQuestion(BaseModel):
    """A single quiz question."""
    id: str
    question_type: str  # "audio_region", "phrase_match", "fill_blank"
    prompt: str
    audio_url: Optional[str] = None
    options: List[str]
    correct_answer: str
    difficulty: int = Field(ge=1, le=5)
    points: int = 10


class QuizSubmission(BaseModel):
    """User's answer to a quiz question."""
    question_id: str
    user_answer: str


class QuizResult(BaseModel):
    """Result of a quiz session."""
    total_questions: int
    correct_answers: int
    score: int
    badges_earned: List[BadgeType]
    streak: int


# ─── User Profile Models ────────────────────────────────────────────────────

class UserProfile(BaseModel):
    """Public user profile."""
    uid: str
    display_name: str
    avatar_url: Optional[str] = None
    total_contributions: int = 0
    total_score: int = 0
    badges: List[BadgeType] = Field(default_factory=list)
    favorite_regions: List[DialectRegion] = Field(default_factory=list)
    rank: int = 0
    joined_at: datetime


class LeaderboardEntry(BaseModel):
    """Leaderboard row."""
    rank: int
    uid: str
    display_name: str
    avatar_url: Optional[str] = None
    total_score: int
    badges_count: int
    contributions_count: int


class LeaderboardResponse(BaseModel):
    """Leaderboard API response."""
    entries: List[LeaderboardEntry]
    total_users: int
    user_rank: Optional[int] = None


# ─── Etymology Graph Models ─────────────────────────────────────────────────

class EtymologyNode(BaseModel):
    """A node in the etymology knowledge graph."""
    id: str
    word: str
    language_origin: str  # e.g., "Sanskrit", "Dravidian", "Persian"
    time_period: Optional[str] = None  # e.g., "12th Century"
    region: Optional[DialectRegion] = None
    meaning: str


class EtymologyEdge(BaseModel):
    """A directed edge in the etymology graph."""
    source_id: str
    target_id: str
    relationship: str  # "derived_from", "influenced_by", "cognate_of"


class EtymologyGraph(BaseModel):
    """Full etymology knowledge graph for a word."""
    root_word: str
    nodes: List[EtymologyNode]
    edges: List[EtymologyEdge]


# ─── Moderation Models ──────────────────────────────────────────────────────

class ModerationResult(BaseModel):
    """Result of automated moderation check."""
    submission_id: str
    audio_quality_score: Optional[float] = None  # 0-1
    content_toxicity_score: Optional[float] = None  # 0-1
    authenticity_score: Optional[float] = None  # 0-1
    auto_decision: ModerationStatus
    flags: List[str] = Field(default_factory=list)
    requires_human_review: bool = False


# ─── Geo-Notification Models ────────────────────────────────────────────────

class GeoNotification(BaseModel):
    """Geo-fenced push notification payload."""
    region: DialectRegion
    phrase_of_the_day: str
    standard_translation: str
    cultural_fact: str
    audio_url: Optional[str] = None


# ─── API Key Models ─────────────────────────────────────────────────────────

class APIKeyRequest(BaseModel):
    """Request to generate a developer API key."""
    app_name: str = Field(..., min_length=3, max_length=100)
    purpose: str = Field(..., min_length=10, max_length=500)
    organization: Optional[str] = None


class APIKeyResponse(BaseModel):
    """Generated API key details."""
    api_key: str
    app_name: str
    rate_limit: str
    created_at: datetime
    expires_at: datetime
