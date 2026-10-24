"use client";

import { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, Volume2, Sparkles, MapPin, Mic } from "lucide-react";
import { DIALECT_REGIONS } from "@/data/regions";
import { DialectRegion, type Phrase, type RegionInfo } from "@/types";
import { api } from "@/lib/api";
import RegionPanel from "@/components/map/RegionPanel";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import SpeechTranscriber from "@/components/speech/SpeechTranscriber";

// Dynamically import Leaflet Map with SSR disabled
const KarnatakaMap = dynamic(() => import("@/components/map/KarnatakaMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-2xl border border-white/10 bg-slate-900/60 text-slate-400">
      <LoadingSpinner />
    </div>
  ),
});

function MapExplorerContent() {
  const searchParams = useSearchParams();
  const regionParam = searchParams.get("region") as DialectRegion | null;

  const [selectedRegion, setSelectedRegion] = useState<DialectRegion | null>(
    regionParam || DialectRegion.NORTH_KARNATAKA
  );
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSTT, setShowSTT] = useState(false);

  // Sync region from URL query params
  useEffect(() => {
    if (regionParam && Object.values(DialectRegion).includes(regionParam)) {
      setSelectedRegion(regionParam);
    }
  }, [regionParam]);

  // Fetch phrases for the selected region
  useEffect(() => {
    async function loadPhrases() {
      setIsLoading(true);
      try {
        const response = await api.listPhrases({
          region: selectedRegion || undefined,
          search: searchQuery.trim() || undefined,
          page_size: 50,
        });
        setPhrases(response.phrases || []);
      } catch (error) {
        console.warn("Using local fallback phrases:", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadPhrases();
  }, [selectedRegion, searchQuery]);

  const activeRegionInfo = DIALECT_REGIONS.find((r) => r.id === selectedRegion) || null;

  return (
    <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            ಕನ್ನಡ ಉಪಭಾಷಾ ನಕ್ಷೆ — Dialect Explorer
          </h1>
          <p className="mt-1 text-slate-400">
            Click on any dialect region in Karnataka to uncover authentic words, idioms, and pronunciations.
          </p>
        </div>

        <button
          onClick={() => setShowSTT(!showSTT)}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-yellow-500/20 transition hover:scale-105"
        >
          <Mic className="h-4 w-4" />
          {showSTT ? "Hide Speech STT" : "Speech-to-Text Transcriber"}
        </button>
      </div>

      {/* Real-time STT Module collapsible */}
      <AnimatePresence>
        {showSTT && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 overflow-hidden"
          >
            <SpeechTranscriber initialRegion={selectedRegion || undefined} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Region Selector Filter Bar */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedRegion(null)}
          className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
            selectedRegion === null
              ? "bg-yellow-400 text-slate-950 shadow-md"
              : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
          }`}
        >
          All Karnataka (ಎಲ್ಲಾ ಉಪಭಾಷೆಗಳು)
        </button>
        {DIALECT_REGIONS.map((region) => {
          const isSelected = selectedRegion === region.id;
          return (
            <button
              key={region.id}
              onClick={() => setSelectedRegion(region.id as DialectRegion)}
              className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                isSelected
                  ? "text-white shadow-lg"
                  : "border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
              style={{
                backgroundColor: isSelected ? region.color : undefined,
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: region.color }}
              />
              {region.kannada_name} ({region.name})
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search dialect words, standard Kannada terms, or English meanings (e.g., 'ಛಲೋ', 'ವಣಸ್', 'ಬಪ್ಪಾ')..."
          className="w-full rounded-2xl border border-white/10 bg-slate-900/80 py-3 pl-11 pr-4 text-sm text-white placeholder-slate-500 shadow-inner outline-none transition focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400"
        />
      </div>

      {/* Map + Detail Panel Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Interactive Map */}
        <div className="h-[520px] rounded-3xl border border-white/10 bg-slate-900/60 p-2 shadow-2xl backdrop-blur-xl lg:col-span-7">
          <KarnatakaMap
            selectedRegion={selectedRegion}
            onRegionSelect={(r) => setSelectedRegion(r)}
          />
        </div>

        {/* Regional Detail Dashboard */}
        <div className="lg:col-span-5">
          <RegionPanel
            region={activeRegionInfo}
            phrases={phrases}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default function MapExplorerPage() {
  return (
    <Suspense fallback={<div className="flex min-h-[70vh] items-center justify-center"><LoadingSpinner /></div>}>
      <MapExplorerContent />
    </Suspense>
  );
}
