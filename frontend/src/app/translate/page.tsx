"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Languages, BookOpen, Volume2, ArrowRight } from "lucide-react";
import DialectTranslator from "@/components/translator/DialectTranslator";
import { DIALECT_REGIONS } from "@/data/regions";

export default function TranslatePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold text-yellow-300"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Powered by Google Gemini 1.5 Pro & Regional Acoustic Corpus
        </motion.div>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          AI ಉಪಭಾಷಾ ಅನುವಾದಕ
        </h1>
        <p className="mt-2 text-xl text-yellow-400">Generative AI Dialect Translator</p>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
          Transform Standard Kannada (ಶಾಲಾ ಕನ್ನಡ) or English into authentic regional dialects — complete with phonetic guides, idiomatic nuances, and cultural usage notes.
        </p>
      </div>

      {/* Main Translator Card */}
      <DialectTranslator />

      {/* Dialect Linguistic Guides / Context Cards */}
      <div className="mt-12">
        <h2 className="mb-6 text-xl font-bold text-white">
          Regional Linguistic Characteristics & Dialect Profiles
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {DIALECT_REGIONS.map((region) => (
            <motion.div
              key={region.id}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-5 shadow-lg backdrop-blur-sm"
            >
              <div className="flex items-center gap-2">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: region.color }}
                />
                <h3 className="font-semibold text-white">{region.kannada_name}</h3>
              </div>
              <p className="text-xs text-yellow-400/80 mt-0.5">{region.name}</p>
              <p className="mt-3 text-xs leading-relaxed text-slate-400">
                {region.description}
              </p>
              <div className="mt-4 border-t border-white/5 pt-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Key Sample:
                </span>
                <p className="mt-1 text-xs font-medium text-amber-200">
                  {region.sample_phrases[0]}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
