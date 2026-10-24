/**
 * Namma Kannada - API Client
 * Axios-based HTTP client for communicating with the FastAPI backend.
 */

import axios, { type AxiosInstance, type AxiosError } from "axios";
import type {
  Phrase,
  PhraseCreate,
  PhraseListResponse,
  TranslationRequest,
  TranslationResponse,
  QuizQuestion,
  QuizSubmission,
  QuizResult,
  LeaderboardEntry,
  UserProfile,
  EtymologyGraph,
  GeoNotification,
  DialectRegion,
} from "@/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

class NammaKannadaAPI {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: { "Content-Type": "application/json" },
    });

    // Request interceptor to attach JWT token
    this.client.interceptors.request.use((config) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("nk_access_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          if (typeof window !== "undefined") {
            localStorage.removeItem("nk_access_token");
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // ─── Auth ───────────────────────────────────────────────────────────────

  async loginWithFirebaseToken(idToken: string) {
    const { data } = await this.client.post("/auth/firebase-login", { id_token: idToken });
    if (data.access_token && typeof window !== "undefined") {
      localStorage.setItem("nk_access_token", data.access_token);
    }
    return data;
  }

  async getCurrentUser(): Promise<UserProfile> {
    const { data } = await this.client.get("/auth/me");
    return data;
  }

  // ─── Phrases ────────────────────────────────────────────────────────────

  async listPhrases(params?: {
    region?: DialectRegion;
    page?: number;
    page_size?: number;
    search?: string;
  }): Promise<PhraseListResponse> {
    const { data } = await this.client.get("/phrases", { params });
    return data;
  }

  async getPhrase(id: string): Promise<Phrase> {
    const { data } = await this.client.get(`/phrases/${id}`);
    return data;
  }

  async createPhrase(phrase: PhraseCreate): Promise<Phrase> {
    const { data } = await this.client.post("/phrases", phrase);
    return data;
  }

  async upvotePhrase(id: string): Promise<{ upvotes: number }> {
    const { data } = await this.client.post(`/phrases/${id}/upvote`);
    return data;
  }

  async uploadAudio(file: File): Promise<{ audio_url: string }> {
    const formData = new FormData();
    formData.append("file", file);
    const { data } = await this.client.post("/phrases/upload-audio", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  }

  // ─── Translation ───────────────────────────────────────────────────────

  async translateToDialect(request: TranslationRequest): Promise<TranslationResponse> {
    const { data } = await this.client.post("/translate/dialect", request);
    return data;
  }

  async getCulturalContext(phrase: string, region: DialectRegion) {
    const { data } = await this.client.post("/translate/cultural-context", { phrase, region });
    return data;
  }

  // ─── Quiz ──────────────────────────────────────────────────────────────

  async getQuizQuestions(region?: DialectRegion, count = 5): Promise<QuizQuestion[]> {
    const { data } = await this.client.get("/quiz/questions", {
      params: { region, count },
    });
    return data;
  }

  async submitQuiz(submissions: QuizSubmission[]): Promise<QuizResult> {
    const { data } = await this.client.post("/quiz/submit", submissions);
    return data;
  }

  async getLeaderboard(limit = 50): Promise<{ entries: LeaderboardEntry[]; total_users: number }> {
    const { data } = await this.client.get("/quiz/leaderboard", { params: { limit } });
    return data;
  }

  async getProfile(): Promise<UserProfile> {
    const { data } = await this.client.get("/quiz/profile");
    return data;
  }

  // ─── Etymology ─────────────────────────────────────────────────────────

  async getEtymology(word: string): Promise<EtymologyGraph> {
    const { data } = await this.client.get(`/etymology/${encodeURIComponent(word)}`);
    return data;
  }

  // ─── Geo ───────────────────────────────────────────────────────────────

  async getPhraseOfDay(region: DialectRegion): Promise<GeoNotification> {
    const { data } = await this.client.get(`/geo/phrase-of-day/${region}`);
    return data;
  }

  async getRegions() {
    const { data } = await this.client.get("/geo/regions");
    return data;
  }
}

// Singleton instance
export const api = new NammaKannadaAPI();
export default api;
