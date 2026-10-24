"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Phrase } from "@/types";
import AudioPlayer from "@/components/ui/AudioPlayer";

// ---------------------------------------------------------------------------
// Dialect region color map
// ---------------------------------------------------------------------------
const REGION_BADGE_COLORS: Record<string, string> = {
  "Old Mysuru": "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  "Coastal Karnataka": "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300",
  "North Karnataka": "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  "Hyderabad Karnataka": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "Malnad": "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  "Kodagu": "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  default: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

function getRegionBadgeClass(region?: string): string {
  if (!region) return REGION_BADGE_COLORS.default;
  return REGION_BADGE_COLORS[region] ?? REGION_BADGE_COLORS.default;
}

// ---------------------------------------------------------------------------
// Moderation status badge
// ---------------------------------------------------------------------------
function ModerationBadge({ status }: { status?: string }) {
  if (!status) return null;

  const styles: Record<string, string> = {
    approved: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
    rejected: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
  };

  return (
    <span
      className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${styles[status] ?? styles.pending}`}
    >
      {status}
    </span>
  );
}

// ---------------------------------------------------------------------------
// PhraseCard
// ---------------------------------------------------------------------------
export interface PhraseCardProps {
  phrase: Phrase;
  onUpvote?: (id: string) => void;
}

export default function PhraseCard({ phrase, onUpvote }: PhraseCardProps) {
  const [showContext, setShowContext] = useState(false);
  const [liked, setLiked] = useState(false);

  const handleUpvote = () => {
    if (!liked) {
      setLiked(true);
      onUpvote?.(phrase.id);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-700 dark:bg-gray-800"
    >
      {/* Top row: regional form + badges */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="text-xl font-bold leading-tight text-gray-900 dark:text-white">
          {phrase.regional_form}
        </h3>

        <div className="flex shrink-0 items-center gap-2">
          {phrase.moderation_status && (
            <ModerationBadge status={phrase.moderation_status} />
          )}
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${getRegionBadgeClass(phrase.dialect_region)}`}
          >
            {phrase.dialect_region ?? "Unknown"}
          </span>
        </div>
      </div>

      {/* Standard Kannada */}
      {phrase.standard_kannada && (
        <p className="mb-1 text-base text-amber-700 dark:text-amber-400">
          {phrase.standard_kannada}
        </p>
      )}

      {/* English translation */}
      {phrase.english_translation && (
        <p className="mb-3 text-sm text-gray-500 dark:text-gray-400">
          {phrase.english_translation}
        </p>
      )}

      {/* Pronunciation guide */}
      {phrase.pronunciation_guide && (
        <p className="mb-3 text-xs italic text-gray-400 dark:text-gray-500">
          🔊 {phrase.pronunciation_guide}
        </p>
      )}

      {/* Audio player */}
      {phrase.audio_url && (
        <div className="mb-3">
          <AudioPlayer src={phrase.audio_url} />
        </div>
      )}

      {/* Usage context (expandable) */}
      {phrase.usage_context && (
        <div className="mb-3">
          <button
            onClick={() => setShowContext((v) => !v)}
            className="text-xs font-medium text-amber-600 hover:underline dark:text-amber-400"
          >
            {showContext ? "Hide context ▲" : "Show usage context ▼"}
          </button>
          <AnimatePresence>
            {showContext && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <p className="mt-2 rounded-lg bg-gray-50 p-3 text-sm text-gray-600 dark:bg-gray-700/50 dark:text-gray-300">
                  {phrase.usage_context}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Tags */}
      {phrase.tags && phrase.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {phrase.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-gray-100 px-2 py-0.5 text-[11px] text-gray-500 dark:bg-gray-700 dark:text-gray-400"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer: contributor, date, upvote */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          {phrase.contributor_name && <span>{phrase.contributor_name}</span>}
          {phrase.created_at && (
            <>
              <span>·</span>
              <span>
                {new Date(phrase.created_at).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </>
          )}
        </div>

        <button
          onClick={handleUpvote}
          className="flex items-center gap-1 text-sm transition"
          aria-label="Upvote phrase"
        >
          <motion.span
            animate={liked ? { scale: [1, 1.4, 1] } : {}}
            transition={{ duration: 0.3 }}
            className={liked ? "text-red-500" : "text-gray-400"}
          >
            {liked ? "❤️" : "🤍"}
          </motion.span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {((phrase.upvotes ?? phrase.upvote_count ?? 0)) + (liked ? 1 : 0)}
          </span>
        </button>
      </div>
    </motion.div>
  );
}
