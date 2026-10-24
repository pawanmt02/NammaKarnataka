/**
 * Namma Kannada - TypeScript Type Definitions
 * Shared types mirroring backend Pydantic schemas with flexible UI aliases.
 */

// ─── Dialect Regions ────────────────────────────────────────────────────────

export enum DialectRegion {
  NORTH_KARNATAKA = "north_karnataka",
  SOUTH_KARNATAKA = "south_karnataka",
  COASTAL_KARNATAKA = "coastal_karnataka",
  OLD_MYSURU = "old_mysuru",
  HYDERABAD_KARNATAKA = "hyderabad_karnataka",
  MALNAD = "malnad",
  KODAGU = "kodagu",
  SOLIGA = "soliga",
  STANDARD = "standard",
}

export enum ModerationStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  FLAGGED = "flagged",
}

export enum BadgeType {
  MYSURU_SCHOLAR = "mysuru_scholar",
  KARAVALI_EXPERT = "karavali_expert",
  MALNAD_MAVEN = "malnad_maven",
  NORTH_KA_NAVIGATOR = "north_ka_navigator",
  KODAGU_KEEPER = "kodagu_keeper",
  POLYGLOT = "polyglot",
  CONTRIBUTOR_BRONZE = "contributor_bronze",
  CONTRIBUTOR_SILVER = "contributor_silver",
  CONTRIBUTOR_GOLD = "contributor_gold",
  QUIZ_MASTER = "quiz_master",
}

// ─── Phrase Types ───────────────────────────────────────────────────────────

export interface Phrase {
  id: string;
  standard_kannada: string;
  regional_form: string;
  english_translation?: string;
  dialect_region: DialectRegion | string;
  pronunciation_guide?: string;
  pronunciation?: string;
  kannada_text?: string;
  usage_context?: string;
  tags: string[];
  audio_url?: string;
  contributor_id: string;
  contributor_name: string;
  moderation_status: ModerationStatus | string;
  upvotes: number;
  upvote_count?: number;
  latitude?: number;
  longitude?: number;
  created_at: string;
  updated_at?: string;
}

export interface PhraseCreate {
  standard_kannada: string;
  regional_form: string;
  english_translation?: string;
  dialect_region: DialectRegion | string;
  pronunciation_guide?: string;
  usage_context?: string;
  tags?: string[];
  audio_url?: string;
  latitude?: number;
  longitude?: number;
  location?: { latitude: number; longitude: number };
}

export interface PhraseListResponse {
  phrases: Phrase[];
  total: number;
  page: number;
  page_size: number;
  has_next: boolean;
}

// ─── Translation Types ──────────────────────────────────────────────────────

export interface TranslationRequest {
  text: string;
  source_language: "standard_kannada" | "english";
  target_dialect: DialectRegion | string;
}

export interface TranslationResponse {
  id?: string;
  original_text: string;
  originalText?: string;
  translated_text: string;
  translatedText?: string;
  target_dialect: DialectRegion | string;
  targetDialect?: DialectRegion | string;
  pronunciation_guide: string;
  pronunciation?: string;
  cultural_notes: string;
  culturalNotes?: string;
  confidence: number;
  example_usage?: string;
  exampleUsage?: string;
  timestamp?: Date | string;
}

// ─── Quiz Types ─────────────────────────────────────────────────────────────

export interface QuizQuestion {
  id: string;
  question_type: "audio_region" | "phrase_match" | "fill_blank" | string;
  prompt: string;
  question?: string;
  audio_url?: string;
  options: string[];
  correct_answer: string;
  difficulty: number;
  points: number;
}

export interface QuizSubmission {
  question_id: string;
  user_answer: string;
  region?: string;
}

export interface QuizResult {
  total_questions: number;
  correct_answers: number;
  score: number;
  badges_earned: BadgeType[];
  badges?: BadgeType[];
  streak: number;
}

// ─── User Profile ───────────────────────────────────────────────────────────

export interface UserProfile {
  uid: string;
  display_name: string;
  avatar_url?: string;
  total_contributions: number;
  total_score: number;
  badges: BadgeType[];
  favorite_regions: (DialectRegion | string)[];
  rank: number;
  joined_at: string;
}

export interface LeaderboardEntry {
  rank: number;
  uid: string;
  user_id?: string;
  display_name: string;
  username?: string;
  avatar_url?: string;
  total_score: number;
  score?: number;
  badges_count: number;
  contributions_count: number;
  contributions?: number;
}

// ─── Etymology Types ────────────────────────────────────────────────────────

export interface EtymologyNode {
  id: string;
  word: string;
  language_origin: string;
  time_period?: string;
  region?: DialectRegion | string;
  meaning: string;
}

export interface EtymologyEdge {
  source_id?: string;
  target_id?: string;
  source?: string;
  target?: string;
  relationship: "derived_from" | "influenced_by" | "cognate_of" | string;
}

export interface EtymologyGraph {
  root_word: string;
  nodes: EtymologyNode[];
  edges: EtymologyEdge[];
}

// ─── Geo Notification ───────────────────────────────────────────────────────

export interface GeoNotification {
  region: DialectRegion | string;
  phrase_of_the_day: string;
  standard_translation: string;
  cultural_fact: string;
  audio_url?: string;
}

// ─── Region Metadata ────────────────────────────────────────────────────────

export interface RegionInfo {
  id: DialectRegion | string;
  name: string;
  kannada_name: string;
  nameKannada?: string;
  description: string;
  center: [number, number]; // [lat, lng]
  color: string;
  districts: string[];
  sample_phrases: string[];
  samplePhrases?: string[];
}

// ─── 3D Museum Types ────────────────────────────────────────────────────────

export interface CulturalArtifact {
  id: string;
  name: string;
  kannada_name: string;
  nameKannada?: string;
  description: string;
  period?: string;
  region: DialectRegion | string;
  model_url: string; // path to .glb/.gltf
  thumbnail_url: string;
  associated_phrases: string[];
  category: "attire" | "cuisine" | "instrument" | "craft" | "architecture" | string;
}
