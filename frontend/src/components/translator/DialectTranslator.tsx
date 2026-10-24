'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { useTranslationStore } from '@/store';
import { DIALECT_REGIONS } from '@/data/regions';
import type { TranslationRequest, TranslationResponse, DialectRegion } from '@/types';

/**
 * Chat-like dialect translation interface.
 * Translates Standard Kannada or English into a selected regional dialect.
 */
export default function DialectTranslator() {
  const [inputText, setInputText] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { translations, addTranslation } = useTranslationStore();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [translations]);

  const handleTranslate = async () => {
    if (!inputText.trim() || !selectedRegion) return;

    setIsTranslating(true);
    try {
      const request: TranslationRequest = {
        text: inputText.trim(),
        source_language: "standard_kannada",
        target_dialect: selectedRegion as DialectRegion,
      };

      const response: TranslationResponse = await api.translateToDialect(request);

      addTranslation({
        id: Date.now().toString(),
        original_text: inputText.trim(),
        originalText: inputText.trim(),
        translated_text: response.translated_text || response.translatedText || "",
        translatedText: response.translated_text || response.translatedText || "",
        pronunciation_guide: response.pronunciation_guide || response.pronunciation || "",
        pronunciation: response.pronunciation_guide || response.pronunciation || "",
        cultural_notes: response.cultural_notes || response.culturalNotes || "",
        culturalNotes: response.cultural_notes || response.culturalNotes || "",
        confidence: response.confidence ?? 0.9,
        example_usage: response.example_usage || response.exampleUsage,
        exampleUsage: response.example_usage || response.exampleUsage,
        target_dialect: selectedRegion as DialectRegion,
        targetDialect: selectedRegion as DialectRegion,
        timestamp: new Date(),
      });

      setInputText('');
    } catch (error) {
      console.error('Translation failed:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleTranslate();
    }
  };

  const getRegionName = (regionId: string): string => {
    const region = DIALECT_REGIONS.find((r) => r.id === regionId);
    return region ? region.name : regionId;
  };

  const getRegionColor = (regionId: string): string => {
    const region = DIALECT_REGIONS.find((r) => r.id === regionId);
    return region?.color || '#f59e0b';
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-amber-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 p-6">
          <h2 className="text-2xl font-bold text-white">Dialect Translator</h2>
          <p className="text-amber-100 text-sm mt-1">
            Translate Standard Kannada or English into regional dialects
          </p>
        </div>

        {/* Translation History */}
        <div
          ref={scrollRef}
          className="h-[400px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-amber-50/50 to-white"
        >
          {translations.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-3 text-amber-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <p className="text-sm">Type something to translate into a Kannada dialect</p>
              </div>
            </div>
          )}

          <AnimatePresence>
            {translations.map((t: any, idx: number) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-3"
              >
                {/* Original text - right aligned (user) */}
                <div className="flex justify-end">
                  <div className="max-w-[80%] bg-amber-500 text-white rounded-2xl rounded-br-sm px-4 py-3 shadow-md">
                    <p className="text-sm">{t.originalText}</p>
                  </div>
                </div>

                {/* Translated text - left aligned (bot) */}
                <div className="flex justify-start">
                  <div className="max-w-[85%] bg-white rounded-2xl rounded-bl-sm px-5 py-4 shadow-md border border-gray-100">
                    {/* Dialect badge */}
                    <span
                      className="inline-block text-xs font-semibold px-2 py-0.5 rounded-full text-white mb-2"
                      style={{ backgroundColor: getRegionColor(t.targetDialect) }}
                    >
                      {getRegionName(t.targetDialect)}
                    </span>

                    {/* Translated text */}
                    <p className="text-xl font-bold text-gray-900 mb-2 leading-relaxed">
                      {t.translatedText}
                    </p>

                    {/* Pronunciation guide */}
                    {t.pronunciation && (
                      <p className="text-sm text-amber-700 italic mb-2">
                        🔊 /{t.pronunciation}/
                      </p>
                    )}

                    {/* Cultural notes */}
                    {t.culturalNotes && (
                      <div className="bg-blue-50 rounded-lg p-3 mb-2">
                        <p className="text-xs font-semibold text-blue-600 mb-0.5">
                          📚 Cultural Note
                        </p>
                        <p className="text-sm text-blue-800">{t.culturalNotes}</p>
                      </div>
                    )}

                    {/* Confidence score bar */}
                    {t.confidence !== undefined && (
                      <div className="mb-2">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span>Confidence</span>
                          <span>{Math.round(t.confidence * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div
                            className="h-1.5 rounded-full transition-all duration-500"
                            style={{
                              width: `${t.confidence * 100}%`,
                              backgroundColor:
                                t.confidence > 0.8
                                  ? '#22c55e'
                                  : t.confidence > 0.5
                                  ? '#f59e0b'
                                  : '#ef4444',
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Example usage */}
                    {t.exampleUsage && (
                      <div className="bg-gray-50 rounded-lg p-3 mt-2">
                        <p className="text-xs font-semibold text-gray-500 mb-0.5">
                          💡 Example Usage
                        </p>
                        <p className="text-sm text-gray-700 italic">{t.exampleUsage}</p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 bg-white p-4">
          {/* Region Selector */}
          <div className="mb-3">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all"
            >
              <option value="">Select target dialect...</option>
              {DIALECT_REGIONS.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name} — {region.nameKannada || region.kannada_name}
                </option>
              ))}
            </select>
          </div>

          {/* Text Input + Send */}
          <div className="flex gap-3">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter text in Kannada or English..."
              rows={2}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 resize-none focus:ring-2 focus:ring-amber-400 focus:border-transparent outline-none transition-all"
            />
            <button
              onClick={handleTranslate}
              disabled={isTranslating || !inputText.trim() || !selectedRegion}
              className="self-end bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold px-6 py-3 rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 disabled:hover:translate-y-0"
            >
              {isTranslating ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                'Translate'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
