/**
 * Namma Kannada - Zustand State Store
 * Global state management for auth, phrases, quiz, translation, and offline queue.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  Phrase,
  UserProfile,
  DialectRegion,
  QuizQuestion,
  QuizResult,
  BadgeType,
  TranslationResponse,
} from "@/types";

// ─── Auth Store ─────────────────────────────────────────────────────────────

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  setUser: (user: UserProfile | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      accessToken: null,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (accessToken) => set({ accessToken }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem("nk_access_token");
        }
        set({ user: null, isAuthenticated: false, accessToken: null });
      },
    }),
    { name: "nk-auth" }
  )
);

// ─── Phrase Store ───────────────────────────────────────────────────────────

interface PhraseState {
  phrases: Phrase[];
  selectedRegion: DialectRegion | null;
  searchQuery: string;
  currentPage: number;
  totalPhrases: number;
  isLoading: boolean;
  setPhrases: (phrases: Phrase[]) => void;
  addPhrase: (phrase: Phrase) => void;
  setSelectedRegion: (region: DialectRegion | null) => void;
  setSearchQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setTotalPhrases: (total: number) => void;
  setLoading: (loading: boolean) => void;
}

export const usePhraseStore = create<PhraseState>()((set) => ({
  phrases: [],
  selectedRegion: null,
  searchQuery: "",
  currentPage: 1,
  totalPhrases: 0,
  isLoading: false,
  setPhrases: (phrases) => set({ phrases }),
  addPhrase: (phrase) => set((state) => ({ phrases: [phrase, ...state.phrases] })),
  setSelectedRegion: (selectedRegion) => set({ selectedRegion, currentPage: 1 }),
  setSearchQuery: (searchQuery) => set({ searchQuery, currentPage: 1 }),
  setCurrentPage: (currentPage) => set({ currentPage }),
  setTotalPhrases: (totalPhrases) => set({ totalPhrases }),
  setLoading: (isLoading) => set({ isLoading }),
}));

// ─── Quiz Store ─────────────────────────────────────────────────────────────

interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: Record<string, string>;
  result: QuizResult | null;
  isActive: boolean;
  selectedRegion: DialectRegion | null;
  streak: number;
  badges: BadgeType[];
  setQuestions: (questions: QuizQuestion[]) => void;
  setAnswer: (questionId: string, answer: string) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  setResult: (result: QuizResult | null) => void;
  setStreak: (streak: number) => void;
  setBadges: (badges: BadgeType[]) => void;
  startQuiz: (region: DialectRegion | null) => void;
  resetQuiz: () => void;
}

export const useQuizStore = create<QuizState>()((set) => ({
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  result: null,
  isActive: false,
  selectedRegion: null,
  streak: 0,
  badges: [],
  setQuestions: (questions) => set({ questions }),
  setAnswer: (questionId, answer) =>
    set((state) => ({ answers: { ...state.answers, [questionId]: answer } })),
  nextQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.questions.length - 1),
    })),
  prevQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
    })),
  setResult: (result) => set({ result }),
  setStreak: (streak) => set({ streak }),
  setBadges: (badges) => set({ badges }),
  startQuiz: (selectedRegion) =>
    set({
      isActive: true,
      selectedRegion,
      currentQuestionIndex: 0,
      answers: {},
      result: null,
    }),
  resetQuiz: () =>
    set({
      questions: [],
      currentQuestionIndex: 0,
      answers: {},
      result: null,
      isActive: false,
    }),
}));

// ─── Translation Store ──────────────────────────────────────────────────────

interface TranslationState {
  history: TranslationResponse[];
  translations: TranslationResponse[];
  isTranslating: boolean;
  addTranslation: (translation: TranslationResponse) => void;
  setTranslating: (isTranslating: boolean) => void;
  clearHistory: () => void;
}

export const useTranslationStore = create<TranslationState>()((set) => ({
  history: [],
  translations: [],
  isTranslating: false,
  addTranslation: (translation) =>
    set((state) => {
      const updated = [translation, ...state.history].slice(0, 50);
      return { history: updated, translations: updated };
    }),
  setTranslating: (isTranslating) => set({ isTranslating }),
  clearHistory: () => set({ history: [], translations: [] }),
}));

// ─── Offline Queue (PWA) ───────────────────────────────────────────────────

export interface OfflineItem {
  id: string;
  type: "phrase" | "audio" | "upvote" | string;
  data: Record<string, unknown>;
  timestamp: number;
}

interface OfflineState {
  queue: OfflineItem[];
  isOnline: boolean;
  isSyncing: boolean;
  addToQueue: (item: Omit<OfflineItem, "id" | "timestamp">) => void;
  queueAction: (item: Omit<OfflineItem, "id" | "timestamp">) => void;
  removeFromQueue: (id: string) => void;
  clearQueue: () => void;
  setOnline: (isOnline: boolean) => void;
  setSyncing: (isSyncing: boolean) => void;
}

export const useOfflineStore = create<OfflineState>()(
  persist(
    (set) => ({
      queue: [],
      isOnline: true,
      isSyncing: false,
      addToQueue: (item) =>
        set((state) => ({
          queue: [
            ...state.queue,
            { ...item, id: crypto.randomUUID(), timestamp: Date.now() },
          ],
        })),
      queueAction: (item) =>
        set((state) => ({
          queue: [
            ...state.queue,
            { ...item, id: crypto.randomUUID(), timestamp: Date.now() },
          ],
        })),
      removeFromQueue: (id) =>
        set((state) => ({ queue: state.queue.filter((i) => i.id !== id) })),
      clearQueue: () => set({ queue: [] }),
      setOnline: (isOnline) => set({ isOnline }),
      setSyncing: (isSyncing) => set({ isSyncing }),
    }),
    { name: "nk-offline-queue" }
  )
);
