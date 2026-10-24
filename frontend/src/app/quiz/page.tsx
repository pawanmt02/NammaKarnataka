"use client";

import { motion } from "framer-motion";
import { Trophy, Award, Gamepad2, Sparkles } from "lucide-react";
import QuizEngine from "@/components/quiz/QuizEngine";
import { BADGE_INFO } from "@/data/regions";

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-400/10 px-4 py-1.5 text-xs font-semibold text-purple-300"
        >
          <Gamepad2 className="h-3.5 w-3.5" />
          Gamified Regional Linguistic Challenges
        </motion.div>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          ಕನ್ನಡ ಉಪಭಾಷಾ ರಸಪ್ರಶ್ನೆ
        </h1>
        <p className="mt-2 text-xl text-purple-300">Dialect Quiz & Badge Mastery</p>
        <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
          Listen to regional audio snippets, identify localized idioms, test your cultural acumen, and earn honorary digital titles!
        </p>
      </div>

      {/* Main Quiz Engine */}
      <QuizEngine />

      {/* Badges Gallery / Showcase */}
      <div className="mt-16 rounded-3xl border border-white/10 bg-slate-900/60 p-6 backdrop-blur-xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-400" />
            <h2 className="text-lg font-bold text-white">Unlockable Heritage Badges</h2>
          </div>
          <span className="text-xs text-slate-400">10 collectible dialect achievements</span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {Object.entries(BADGE_INFO).map(([key, info]) => (
            <motion.div
              key={key}
              whileHover={{ scale: 1.05 }}
              className="flex flex-col items-center rounded-2xl border border-white/5 bg-white/5 p-4 text-center transition hover:border-yellow-400/30"
            >
              <span className="text-3xl">{info.icon}</span>
              <h3 className="mt-2 text-xs font-bold text-white">{info.name}</h3>
              <p className="mt-1 text-[11px] text-slate-400 leading-snug">{info.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
