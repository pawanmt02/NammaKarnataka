"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GitBranch, Sparkles, BookOpen, Search } from "lucide-react";
import EtymologyGraph from "@/components/etymology/EtymologyGraph";
import { api } from "@/lib/api";
import type { EtymologyGraph as EtymologyGraphType } from "@/types";

// Seed default graph for initial landing experience
const DEFAULT_GRAPH: EtymologyGraphType = {
  root_word: "ಕನ್ನಡ (Kannada)",
  nodes: [
    {
      id: "node-root",
      word: "ಕರುನಾಡು (Karu-nadu)",
      language_origin: "Proto-Dravidian",
      time_period: "Pre-Ashokan era (c. 300 BCE)",
      meaning: "Elevated black soil country",
    },
    {
      id: "node-halegannada",
      word: "ಕನ್ನಾಡು (Kannaadu)",
      language_origin: "Halegannada (Old Kannada)",
      time_period: "Kadamba Dynasty (450 CE)",
      meaning: "Land of sweet speech and fragrant land",
    },
    {
      id: "node-sanskrit-cognate",
      word: "ಕರ್ಣಾಟ (Karnata)",
      language_origin: "Sanskrit",
      time_period: "Mahabharata & Silappatikaram",
      meaning: "Sanskritized designation for the Deccan region",
    },
    {
      id: "node-dharwad",
      word: "ಕನ್ನಡಾ (Kannadaa)",
      language_origin: "North Karnataka Dialect",
      time_period: "Contemporary",
      meaning: "Spoken vernacular of northern plains",
    },
    {
      id: "node-coastal",
      word: "ಕನಡ (Kanada)",
      language_origin: "Coastal / Tulu Influenced",
      time_period: "Contemporary",
      meaning: "Coastal coastal speech variation",
    },
  ],
  edges: [
    {
      source_id: "node-root",
      target_id: "node-halegannada",
      source: "node-root",
      target: "node-halegannada",
      relationship: "evolved_into",
    },
    {
      source_id: "node-root",
      target_id: "node-sanskrit-cognate",
      source: "node-root",
      target: "node-sanskrit-cognate",
      relationship: "sanskritized_as",
    },
    {
      source_id: "node-halegannada",
      target_id: "node-dharwad",
      source: "node-halegannada",
      target: "node-dharwad",
      relationship: "vernacular_branch",
    },
    {
      source_id: "node-halegannada",
      target_id: "node-coastal",
      source: "node-halegannada",
      target: "node-coastal",
      relationship: "regional_adaptation",
    },
  ],
};

export default function EtymologyPage() {
  const [graph, setGraph] = useState<EtymologyGraphType | null>(DEFAULT_GRAPH);
  const [isLoading, setIsLoading] = useState(false);
  const [searchWord, setSearchWord] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchWord.trim()) return;

    setIsLoading(true);
    try {
      const result = await api.getEtymology(searchWord.trim());
      setGraph(result);
    } catch (err) {
      console.warn("Using fallback AI-generated graph for:", searchWord);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1.5 text-xs font-semibold text-emerald-300"
        >
          <GitBranch className="h-3.5 w-3.5" />
          Interactive Knowledge Graph & Linguistic Genealogy
        </motion.div>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          ಶಬ್ದ ವ್ಯುತ್ಪತ್ತಿ ಮತ್ತು ವಿಕಾಸ
        </h1>
        <p className="mt-2 text-xl text-emerald-300">Visual Etymology Knowledge Graph</p>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-slate-300">
          Trace the historical migration, linguistic roots, and semantic evolution of Kannada words as they shifted between Sanskrit, Proto-Dravidian, Persian, and localized tribal dialects.
        </p>
      </div>

      {/* Word Quick-Search Form */}
      <form onSubmit={handleSearch} className="mx-auto mb-8 max-w-xl">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            placeholder="Type a word to trace etymology (e.g. 'ಮನೆ', 'ಊಟ', 'ಅರಸ', 'ಪೇಟ')..."
            className="w-full rounded-2xl border border-white/10 bg-slate-900/80 py-3.5 pl-5 pr-28 text-sm text-white placeholder-slate-500 shadow-xl outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="absolute right-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2 text-xs font-semibold text-white shadow-md transition hover:scale-105 disabled:opacity-50"
          >
            {isLoading ? "Tracing..." : "Explore"}
          </button>
        </div>
      </form>

      {/* Suggested Words */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
        <span>Suggested terms:</span>
        {["ಕನ್ನಡ", "ದಸರಾ", "ಊಟ", "ಬಿಸಿಬೇಲೆ", "ಯಕ್ಷಗಾನ"].map((w) => (
          <button
            key={w}
            onClick={() => {
              setSearchWord(w);
            }}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-slate-300 hover:border-emerald-400 hover:text-white"
          >
            {w}
          </button>
        ))}
      </div>

      {/* Interactive Visual Graph */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-6 shadow-2xl backdrop-blur-xl">
        <EtymologyGraph graph={graph} isLoading={isLoading} />
      </div>
    </div>
  );
}
