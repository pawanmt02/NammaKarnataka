"use client";

import { motion } from "framer-motion";
import { Trophy, Medal, Star, Flame, Sparkles } from "lucide-react";
import Leaderboard from "@/components/quiz/Leaderboard";

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-yellow-400/30 bg-yellow-400/10 px-4 py-1.5 text-xs font-semibold text-yellow-300"
        >
          <Trophy className="h-3.5 w-3.5" />
          Karnataka Linguistic Heritage Leaderboard
        </motion.div>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          ಭಾಷಾ ವಿದ್ವಾಂಸರ ಮುಂಚೂಣಿ ಫಲಕ
        </h1>
        <p className="mt-2 text-xl text-yellow-400">Scholars & Top Contributors</p>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
          Recognizing the linguists, researchers, and community champions actively documenting and safeguarding Karnataka&apos;s endangered dialects.
        </p>
      </div>

      {/* Main Leaderboard Table */}
      <Leaderboard />
    </div>
  );
}
