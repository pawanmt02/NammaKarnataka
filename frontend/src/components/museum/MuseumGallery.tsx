"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import type { CulturalArtifact } from "@/types";
import { CULTURAL_ARTIFACTS } from "@/data/regions";
import ArtifactViewer from "./ArtifactViewer";

// ---------------------------------------------------------------------------
// Category → emoji mapping for thumbnail placeholders
// ---------------------------------------------------------------------------
const CATEGORY_EMOJI: Record<string, string> = {
  architecture: "🏛️",
  sculpture: "🗿",
  painting: "🎨",
  textile: "🧵",
  music: "🎵",
  dance: "💃",
  literature: "📜",
  craft: "🏺",
  food: "🍛",
  festival: "🎉",
  jewelry: "💎",
  weapon: "⚔️",
  default: "🔷",
};

const CATEGORY_COLORS: Record<string, string> = {
  architecture: "bg-amber-100 dark:bg-amber-900/40",
  sculpture: "bg-stone-100 dark:bg-stone-900/40",
  painting: "bg-rose-100 dark:bg-rose-900/40",
  textile: "bg-purple-100 dark:bg-purple-900/40",
  music: "bg-blue-100 dark:bg-blue-900/40",
  dance: "bg-pink-100 dark:bg-pink-900/40",
  literature: "bg-emerald-100 dark:bg-emerald-900/40",
  craft: "bg-orange-100 dark:bg-orange-900/40",
  food: "bg-yellow-100 dark:bg-yellow-900/40",
  festival: "bg-red-100 dark:bg-red-900/40",
  jewelry: "bg-cyan-100 dark:bg-cyan-900/40",
  weapon: "bg-gray-100 dark:bg-gray-900/40",
  default: "bg-slate-100 dark:bg-slate-900/40",
};

function getEmoji(category?: string): string {
  return CATEGORY_EMOJI[category ?? "default"] ?? CATEGORY_EMOJI.default;
}

function getColorClass(category?: string): string {
  return CATEGORY_COLORS[category ?? "default"] ?? CATEGORY_COLORS.default;
}

// ---------------------------------------------------------------------------
// Single gallery card
// ---------------------------------------------------------------------------
function ArtifactCard({
  artifact,
  onClick,
}: {
  artifact: CulturalArtifact;
  onClick: () => void;
}) {
  return (
    <motion.button
      layoutId={`artifact-${artifact.id}`}
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      className="group flex w-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition dark:border-gray-700 dark:bg-gray-800"
    >
      {/* Thumbnail placeholder */}
      <div
        className={`flex h-44 items-center justify-center text-5xl ${getColorClass(artifact.category)}`}
      >
        {getEmoji(artifact.category)}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400">
          {artifact.name}
        </h3>
        {artifact.kannada_name && (
          <p className="text-sm text-amber-700 dark:text-amber-400">
            {artifact.kannada_name}
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-2">
          {artifact.region && (
            <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              {artifact.region}
            </span>
          )}
          {artifact.category && (
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
              {artifact.category}
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Modal for 3D viewer
// ---------------------------------------------------------------------------
function ViewerModal({
  artifact,
  onClose,
}: {
  artifact: CulturalArtifact;
  onClose: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        layoutId={`artifact-${artifact.id}`}
        className="relative h-[80vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-900"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-30 rounded-full bg-white/80 p-2 text-gray-500 shadow hover:text-gray-800 dark:bg-gray-800/80 dark:hover:text-white"
          aria-label="Close viewer"
        >
          ✕
        </button>
        <ArtifactViewer artifact={artifact} />
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main gallery component
// ---------------------------------------------------------------------------
export default function MuseumGallery() {
  const [selectedArtifact, setSelectedArtifact] =
    useState<CulturalArtifact | null>(null);
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  // Derive unique regions & categories
  const regions = useMemo(
    () =>
      Array.from(
        new Set(
          CULTURAL_ARTIFACTS.map((a) => a.region).filter(Boolean) as string[]
        )
      ).sort(),
    []
  );

  const categories = useMemo(
    () =>
      Array.from(
        new Set(
          CULTURAL_ARTIFACTS.map((a) => a.category).filter(
            Boolean
          ) as string[]
        )
      ).sort(),
    []
  );

  // Filtered list
  const filtered = useMemo(() => {
    return CULTURAL_ARTIFACTS.filter((a) => {
      if (regionFilter !== "all" && a.region !== regionFilter) return false;
      if (categoryFilter !== "all" && a.category !== categoryFilter)
        return false;
      return true;
    });
  }, [regionFilter, categoryFilter]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8">
      {/* Header */}
      <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
        Cultural Artifact Gallery
      </h2>
      <p className="mb-6 text-gray-500 dark:text-gray-400">
        Explore Karnataka&apos;s rich cultural heritage in 3D
      </p>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-3">
        <select
          value={regionFilter}
          onChange={(e) => setRegionFilter(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          <option value="all">All Regions</option>
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-600 dark:bg-gray-800 dark:text-white"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {(regionFilter !== "all" || categoryFilter !== "all") && (
          <button
            onClick={() => {
              setRegionFilter("all");
              setCategoryFilter("all");
            }}
            className="text-sm text-amber-600 hover:underline dark:text-amber-400"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Grid */}
      <LayoutGroup>
        <motion.div
          layout
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((artifact) => (
              <ArtifactCard
                key={artifact.id}
                artifact={artifact}
                onClick={() => setSelectedArtifact(artifact)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-gray-400">
          No artifacts match the current filters.
        </p>
      )}

      {/* Viewer Modal */}
      <AnimatePresence>
        {selectedArtifact && (
          <ViewerModal
            artifact={selectedArtifact}
            onClose={() => setSelectedArtifact(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
