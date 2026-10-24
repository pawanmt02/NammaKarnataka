"use client";

import { motion } from "framer-motion";
import { Upload, Sparkles, Mic, WifiOff, ShieldCheck } from "lucide-react";
import ContributeForm from "@/components/phrases/ContributeForm";
import { useOfflineStore } from "@/store";

export default function ContributePage() {
  const { isOnline, queue } = useOfflineStore();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-1.5 text-xs font-semibold text-teal-300"
        >
          <Upload className="h-3.5 w-3.5" />
          Crowdsourced Intangible Heritage Documentation
        </motion.div>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          ಸ್ಥಳೀಯ ಭಾಷಾ ಪದಗಳನ್ನು ದಾಖಲಿಸಿ
        </h1>
        <p className="mt-2 text-xl text-teal-300">Preserve Your Local Dialect</p>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-400">
          Document local expressions, phrases, and pronunciations from your village or town. Record your voice to preserve living oral traditions for future generations.
        </p>
      </div>

      {/* Offline Alert Banner */}
      {!isOnline && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 flex items-center gap-3 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm text-yellow-300"
        >
          <WifiOff className="h-5 w-5 shrink-0" />
          <div>
            <span className="font-semibold">Offline Field Mode Active:</span> You can record pronunciations and enter phrases in remote areas without internet. Your submissions are securely saved locally in IndexedDB and will sync automatically upon reconnection.
            {queue.length > 0 && ` (${queue.length} item(s) pending sync)`}
          </div>
        </motion.div>
      )}

      {/* Workflow Explanation Banner */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-900/60 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-500/20 text-orange-400 font-bold">
            1
          </div>
          <div className="text-xs">
            <span className="font-semibold text-white block">Enter Phrase</span>
            <span className="text-slate-400">Regional dialect form & standard Kannada meaning.</span>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-900/60 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-500/20 text-yellow-400 font-bold">
            2
          </div>
          <div className="text-xs">
            <span className="font-semibold text-white block">Record 3-5s Audio</span>
            <span className="text-slate-400">Capture voice pronunciation nuances.</span>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-slate-900/60 p-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 font-bold">
            3
          </div>
          <div className="text-xs">
            <span className="font-semibold text-white block">AI & Peer Review</span>
            <span className="text-slate-400">Automated moderation then live map publication.</span>
          </div>
        </div>
      </div>

      {/* Main Contribution Form */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
        <ContributeForm />
      </div>
    </div>
  );
}
