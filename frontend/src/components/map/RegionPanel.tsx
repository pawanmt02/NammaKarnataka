'use client';

import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import type { RegionInfo, Phrase } from '@/types';

interface RegionPanelProps {
  region: RegionInfo | null;
  phrases: Phrase[];
  isLoading: boolean;
}

/**
 * A side panel showing details for a selected dialect region.
 * Animated slide-in from the right using Framer Motion.
 */
export default function RegionPanel({ region, phrases, isLoading }: RegionPanelProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handlePlayAudio = (audioUrl: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio.play();
  };

  return (
    <AnimatePresence>
      {region && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 overflow-y-auto border-l border-gray-200"
        >
          {/* Color bar */}
          <div
            className="h-2 w-full"
            style={{ backgroundColor: region.color || '#f59e0b' }}
          />

          <div className="p-6">
            {/* Region Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{region.nameKannada}</h2>
              <p className="text-lg text-amber-700 font-medium">{region.name}</p>
              <p className="text-sm text-gray-600 mt-2 leading-relaxed">{region.description}</p>
            </div>

            {/* Districts */}
            {region.districts && region.districts.length > 0 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Districts
                </h3>
                <div className="flex flex-wrap gap-2">
                  {region.districts.map((district, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-amber-50 text-amber-800 text-xs font-medium px-3 py-1.5 rounded-full border border-amber-200"
                    >
                      {district}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Phrases */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Latest Contributed Phrases
              </h3>

              {isLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-1" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : phrases.length > 0 ? (
                <ul className="space-y-3">
                  {phrases.map((phrase, idx) => (
                    <motion.li
                      key={phrase.id || idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-gradient-to-r from-gray-50 to-amber-50 rounded-lg p-3 border border-gray-100"
                    >
                      <p className="text-base font-semibold text-gray-900">
                        {phrase.regional_form || phrase.standard_kannada}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {phrase.english_translation}
                      </p>
                      {(phrase.pronunciation_guide || phrase.pronunciation) && (
                        <p className="text-xs text-amber-600 mt-1 italic">
                          /{phrase.pronunciation_guide || phrase.pronunciation}/
                        </p>
                      )}
                      {phrase.audio_url && (
                        <button
                          onClick={() => handlePlayAudio(phrase.audio_url!)}
                          className="mt-2 inline-flex items-center gap-1.5 text-xs text-amber-700 hover:text-amber-900 font-medium transition-colors"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                          </svg>
                          Play Audio
                        </button>
                      )}
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-400 italic">
                  No phrases contributed yet for this region.
                </p>
              )}
            </div>

            {/* Add Phrase CTA */}
            <Link
              href="/contribute"
              className="block w-full text-center bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 px-6 rounded-xl hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              + Add a Phrase
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
