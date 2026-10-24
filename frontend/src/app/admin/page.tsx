"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, CheckCircle, XCircle, Sparkles, Volume2, UserCheck, AlertTriangle } from "lucide-react";
import { DIALECT_REGIONS } from "@/data/regions";
import { DialectRegion, ModerationStatus, type Phrase } from "@/types";

// Initial queue of crowdsourced submissions awaiting review
const INITIAL_QUEUE = [
  {
    id: "sub-101",
    standard_kannada: "ಸ್ನಾನ ಮಾಡು",
    regional_form: "ಮೀ ಬಾರೋ",
    english_translation: "Go and have a bath.",
    dialect_region: "malnad",
    pronunciation_guide: "Mee baaro",
    usage_context: "Havyaka household call for daily ritual bath before morning meal.",
    contributor_name: "Gopalakrishna Bhat",
    audio_url: "/audio/havyaka_sample.mp3",
    toxicity_score: 0.02,
    audio_quality_score: 0.94,
    status: ModerationStatus.PENDING,
    ai_enrichment_suggested: "In Malnad Havyaka tradition, 'ಮೀ' originates from Old Kannada 'ಮೀಯು' (meeyu - to bathe).",
  },
  {
    id: "sub-102",
    standard_kannada: "ತುಂಬಾ ಚೆನ್ನಾಗಿದೆ",
    regional_form: "ಭಾರೀ ಪೊರ್ಲು ಮಾರ್ರೆ",
    english_translation: "It is extremely beautiful, friend.",
    dialect_region: "coastal_karnataka",
    pronunciation_guide: "Bhaari porlu maare",
    usage_context: "Coastal Kannada phrase influenced by Tulu 'porlu' denoting exquisite beauty.",
    contributor_name: "Pratheeksha Poojary",
    audio_url: "/audio/coastal_sample.mp3",
    toxicity_score: 0.01,
    audio_quality_score: 0.89,
    status: ModerationStatus.PENDING,
    ai_enrichment_suggested: "Frequently used to appreciate Yakshagana costumes and Karavali coastal sunsets.",
  },
  {
    id: "sub-103",
    standard_kannada: "ಏನು ಮಾಡುತ್ತಿದ್ದೀಯಾ?",
    regional_form: "ಏನ ಮಾಡಾತಿ?",
    english_translation: "What are you doing?",
    dialect_region: "north_karnataka",
    pronunciation_guide: "Ena maadaathi?",
    usage_context: "",
    contributor_name: "Santosh Patil",
    audio_url: null,
    toxicity_score: 0.04,
    audio_quality_score: null,
    status: ModerationStatus.PENDING,
    ai_enrichment_suggested: "Automated Gemini Suggestion: Characteristic Belgaum-Bijapur verbal suffix '-ಆತಿ' indicating continuous present tense.",
  },
];

export default function AdminModerationPage() {
  const [queue, setQueue] = useState(INITIAL_QUEUE);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: ModerationStatus.APPROVED } : item))
    );
    showToast("Submission approved and published to the live public map!");
  };

  const handleReject = (id: string) => {
    setQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: ModerationStatus.REJECTED } : item))
    );
    showToast("Submission marked as rejected.");
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 rounded-2xl border border-emerald-500/40 bg-emerald-950 px-5 py-3 text-sm font-semibold text-emerald-200 shadow-2xl">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-3.5 py-1 text-xs font-semibold text-yellow-300">
            <Shield className="h-3.5 w-3.5" />
            Human-in-the-Loop (HITL) Moderation Queue
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            ಭಾಷಾ ತಜ್ಞರ ಪರಿಶೀಲನಾ ಪೋರ್ಟಲ್
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Linguist & Admin Dashboard — Review crowdsourced submissions screened by AI moderation models.
          </p>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-900/80 px-4 py-2 text-xs">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="font-semibold text-white">Linguist Access Level:</span>
          <span className="text-yellow-400">Verified Scholar</span>
        </div>
      </div>

      {/* Queue items */}
      <div className="space-y-6">
        {queue.map((sub) => {
          const region = DIALECT_REGIONS.find((r) => r.id === sub.dialect_region);
          const isPending = sub.status === ModerationStatus.PENDING;

          return (
            <motion.div
              key={sub.id}
              layout
              className={`rounded-3xl border p-6 backdrop-blur-xl transition ${
                sub.status === ModerationStatus.APPROVED
                  ? "border-emerald-500/30 bg-emerald-950/20"
                  : sub.status === ModerationStatus.REJECTED
                    ? "border-red-500/30 bg-red-950/20 opacity-60"
                    : "border-white/10 bg-slate-900/70"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <span
                    className="rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm"
                    style={{ backgroundColor: region?.color || "#555" }}
                  >
                    {region?.kannada_name || sub.dialect_region}
                  </span>
                  <span className="text-xs text-slate-400">
                    Contributed by <strong className="text-white">{sub.contributor_name}</strong>
                  </span>
                </div>

                {/* Automated AI Moderation Badges */}
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-300 border border-emerald-500/20">
                    Toxicity: {(sub.toxicity_score * 100).toFixed(0)}% (Clean)
                  </span>
                  {sub.audio_quality_score && (
                    <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-blue-300 border border-blue-500/20">
                      Audio SNR: {(sub.audio_quality_score * 100).toFixed(0)}%
                    </span>
                  )}
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                      sub.status === ModerationStatus.APPROVED
                        ? "bg-emerald-500 text-slate-950"
                        : sub.status === ModerationStatus.REJECTED
                          ? "bg-red-500 text-white"
                          : "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>
              </div>

              {/* Main Text Content */}
              <div className="my-5 grid gap-4 sm:grid-cols-2">
                <div>
                  <span className="text-xs font-semibold text-slate-400">
                    Regional Dialect Expression:
                  </span>
                  <p className="mt-1 text-2xl font-bold text-yellow-300">{sub.regional_form}</p>
                  <p className="mt-0.5 text-xs text-amber-200/80 italic">
                    Phonetic: /{sub.pronunciation_guide}/
                  </p>
                </div>

                <div>
                  <span className="text-xs font-semibold text-slate-400">
                    Standard Kannada Equivalent:
                  </span>
                  <p className="mt-1 text-2xl font-medium text-white">{sub.standard_kannada}</p>
                  <p className="mt-0.5 text-xs text-slate-400">
                    English: {sub.english_translation}
                  </p>
                </div>
              </div>

              {/* Cultural Context & AI Enrichment */}
              <div className="mb-5 rounded-2xl border border-white/5 bg-slate-950/60 p-4">
                <span className="text-xs font-semibold text-slate-400">Cultural Context:</span>
                <p className="mt-1 text-sm text-slate-300">
                  {sub.usage_context || (
                    <span className="text-yellow-400/80 italic">
                      [User left blank — Gemini Auto-Enriched below]
                    </span>
                  )}
                </p>
                {sub.ai_enrichment_suggested && (
                  <div className="mt-3 flex items-start gap-2 rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3 text-xs text-yellow-200">
                    <Sparkles className="h-4 w-4 shrink-0 text-yellow-400" />
                    <span>{sub.ai_enrichment_suggested}</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              {isPending && (
                <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                  <button
                    onClick={() => handleReject(sub.id)}
                    className="flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-300 hover:bg-red-500/20"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject Submission
                  </button>
                  <button
                    onClick={() => handleApprove(sub.id)}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-emerald-500/20 hover:scale-105"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve & Publish to Live Map
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
