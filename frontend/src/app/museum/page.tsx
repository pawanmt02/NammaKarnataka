"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Box, Sparkles, Compass } from "lucide-react";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

// Dynamically import 3D Museum Gallery with SSR disabled for Three.js / WebGL
const MuseumGallery = dynamic(() => import("@/components/museum/MuseumGallery"), {
  ssr: false,
  loading: () => (
    <div className="flex h-96 w-full items-center justify-center rounded-3xl border border-white/10 bg-slate-900/60">
      <LoadingSpinner />
    </div>
  ),
});

export default function MuseumPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-1.5 text-xs font-semibold text-amber-300"
        >
          <Box className="h-3.5 w-3.5" />
          WebXR Augmented Reality & 3D Heritage Artifacts
        </motion.div>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          3D ಸಾಂಸ್ಕೃತಿಕ ವಸ್ತುಸಂಗ್ರಹಾಲಯ
        </h1>
        <p className="mt-2 text-xl text-amber-300">WebXR Cultural Artifact Museum</p>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
          Experience the tangible material culture intertwined with Karnataka&apos;s regional dialects. Rotate, inspect, and experience 3D models of regional royal attire, folk theater headgear, culinary staples, and traditional craftsmanship.
        </p>
      </div>

      {/* Main Museum Gallery with WebGL Canvas */}
      <MuseumGallery />
    </div>
  );
}
