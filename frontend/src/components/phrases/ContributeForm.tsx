"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { useOfflineStore } from "@/store";
import { DialectRegion } from "@/types";
import RegionSelector from "@/components/ui/RegionSelector";
import AudioRecorder from "@/components/ui/AudioRecorder";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface FormData {
  standard_kannada: string;
  regional_form: string;
  english_translation: string;
  dialect_region: string;
  pronunciation_guide: string;
  usage_context: string;
  tags: string;
}

interface FormErrors {
  [key: string]: string | undefined;
}

const INITIAL_FORM: FormData = {
  standard_kannada: "",
  regional_form: "",
  english_translation: "",
  dialect_region: "",
  pronunciation_guide: "",
  usage_context: "",
  tags: "",
};

// ---------------------------------------------------------------------------
// Toast (minimal inline implementation)
// ---------------------------------------------------------------------------
function Toast({
  message,
  type,
  onDismiss,
}: {
  message: string;
  type: "success" | "error";
  onDismiss: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      className={`mb-4 flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium shadow ${
        type === "success"
          ? "bg-green-50 text-green-800 dark:bg-green-900/40 dark:text-green-300"
          : "bg-red-50 text-red-800 dark:bg-red-900/40 dark:text-red-300"
      }`}
    >
      <span>{message}</span>
      <button onClick={onDismiss} className="ml-4 opacity-60 hover:opacity-100">
        ✕
      </button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main ContributeForm component
// ---------------------------------------------------------------------------
export default function ContributeForm() {
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const isOnline =
    typeof navigator !== "undefined" ? navigator.onLine : true;
  const queueOffline = useOfflineStore((s) => s.queueAction);

  // -- helpers ----------------------------------------------------------------
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const { name, value } = e.target;
      setForm((prev) => ({ ...prev, [name]: value }));
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    },
    []
  );

  const handleRegionChange = useCallback((region: DialectRegion | null) => {
    setForm((prev) => ({ ...prev, dialect_region: (region || "") as any }));
    setErrors((prev) => ({ ...prev, dialect_region: undefined }));
  }, []);

  // -- geolocation ------------------------------------------------------------
  const captureLocation = useCallback(() => {
    if (!("geolocation" in navigator)) return;
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.warn("Geolocation error:", err)
    );
  }, []);

  // -- validation -------------------------------------------------------------
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!form.standard_kannada.trim())
      newErrors.standard_kannada = "Standard Kannada text is required.";
    if (!form.regional_form.trim())
      newErrors.regional_form = "Regional form is required.";
    if (!form.english_translation.trim())
      newErrors.english_translation = "English translation is required.";
    if (!form.dialect_region)
      newErrors.dialect_region = "Please select a dialect region.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -- submit -----------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const tagsArray = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      standard_kannada: form.standard_kannada.trim(),
      regional_form: form.regional_form.trim(),
      english_translation: form.english_translation.trim(),
      dialect_region: form.dialect_region,
      pronunciation_guide: form.pronunciation_guide.trim() || undefined,
      usage_context: form.usage_context.trim() || undefined,
      tags: tagsArray.length > 0 ? tagsArray : undefined,
      location: location ? { latitude: location.lat, longitude: location.lng } : undefined,
      latitude: location?.lat,
      longitude: location?.lng,
      audio_url: undefined as string | undefined,
    };

    // Offline mode
    if (!isOnline) {
      queueOffline({ type: "phrase", data: { ...payload } });
      setToast({
        message: "You are offline. Your contribution has been queued and will be submitted when you reconnect.",
        type: "success",
      });
      setForm(INITIAL_FORM);
      setAudioBlob(null);
      return;
    }

    setSubmitting(true);

    try {
      // 1. Upload audio if available
      if (audioBlob) {
        const file = new File([audioBlob], "recording.webm", { type: audioBlob.type || "audio/webm" });
        const audioRes = await api.uploadAudio(file);
        payload.audio_url = audioRes.audio_url;
      }

      // 2. Create phrase
      await api.createPhrase(payload);

      setToast({
        message: "Thank you! Your phrase has been submitted for review.",
        type: "success",
      });
      setForm(INITIAL_FORM);
      setAudioBlob(null);
      setLocation(null);
    } catch (err) {
      console.error("Submission failed:", err);
      setToast({
        message: "Something went wrong. Please try again.",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <section className="mx-auto w-full max-w-2xl">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={() => setToast(null)}
        />
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Standard Kannada */}
        <div>
          <label
            htmlFor="standard_kannada"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Standard Kannada *
          </label>
          <textarea
            id="standard_kannada"
            name="standard_kannada"
            rows={2}
            value={form.standard_kannada}
            onChange={handleChange}
            placeholder="ಮಾನಕ ಕನ್ನಡ ಪದ / ವಾಕ್ಯ"
            className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
              errors.standard_kannada
                ? "border-red-400 focus:ring-red-400"
                : "border-gray-300 focus:ring-amber-500 dark:border-gray-600"
            }`}
          />
          {errors.standard_kannada && (
            <p className="mt-1 text-xs text-red-500">{errors.standard_kannada}</p>
          )}
        </div>

        {/* Regional Form */}
        <div>
          <label
            htmlFor="regional_form"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Regional Form *
          </label>
          <textarea
            id="regional_form"
            name="regional_form"
            rows={2}
            value={form.regional_form}
            onChange={handleChange}
            placeholder="ಪ್ರಾದೇಶಿಕ ರೂಪ"
            className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
              errors.regional_form
                ? "border-red-400 focus:ring-red-400"
                : "border-gray-300 focus:ring-amber-500 dark:border-gray-600"
            }`}
          />
          {errors.regional_form && (
            <p className="mt-1 text-xs text-red-500">{errors.regional_form}</p>
          )}
        </div>

        {/* English Translation */}
        <div>
          <label
            htmlFor="english_translation"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            English Translation *
          </label>
          <input
            type="text"
            id="english_translation"
            name="english_translation"
            value={form.english_translation}
            onChange={handleChange}
            placeholder="English meaning"
            className={`w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 dark:bg-gray-800 dark:text-white ${
              errors.english_translation
                ? "border-red-400 focus:ring-red-400"
                : "border-gray-300 focus:ring-amber-500 dark:border-gray-600"
            }`}
          />
          {errors.english_translation && (
            <p className="mt-1 text-xs text-red-500">
              {errors.english_translation}
            </p>
          )}
        </div>

        {/* Dialect Region */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Dialect Region *
          </label>
          <RegionSelector
            value={form.dialect_region ? (form.dialect_region as DialectRegion) : null}
            onChange={handleRegionChange}
          />
          {errors.dialect_region && (
            <p className="mt-1 text-xs text-red-500">{errors.dialect_region}</p>
          )}
        </div>

        {/* Pronunciation Guide */}
        <div>
          <label
            htmlFor="pronunciation_guide"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Pronunciation Guide
          </label>
          <input
            type="text"
            id="pronunciation_guide"
            name="pronunciation_guide"
            value={form.pronunciation_guide}
            onChange={handleChange}
            placeholder="e.g. hE-ge i-dee-ra"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Usage Context */}
        <div>
          <label
            htmlFor="usage_context"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Usage Context
          </label>
          <input
            type="text"
            id="usage_context"
            name="usage_context"
            value={form.usage_context}
            onChange={handleChange}
            placeholder="When / where is this phrase commonly used?"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Tags */}
        <div>
          <label
            htmlFor="tags"
            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Tags{" "}
            <span className="text-xs text-gray-400">(comma-separated)</span>
          </label>
          <input
            type="text"
            id="tags"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="greeting, formal, rural"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 dark:border-gray-600 dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* Audio Recorder */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
            Audio Recording
          </label>
          <AudioRecorder
            onRecorded={(blob) => setAudioBlob(blob)}
            hasRecording={!!audioBlob}
          />
        </div>

        {/* Geolocation */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={captureLocation}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm transition hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
          >
            📍 Capture Location
          </button>
          {location && (
            <span className="text-xs text-gray-400">
              {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </span>
          )}
        </div>

        {/* Offline banner */}
        {!isOnline && (
          <div className="rounded-lg bg-yellow-50 px-4 py-2 text-sm text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300">
            You are currently offline. Your contribution will be queued and
            submitted automatically when you reconnect.
          </div>
        )}

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={submitting}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-lg bg-amber-500 py-3 text-sm font-semibold text-white shadow transition hover:bg-amber-600 disabled:opacity-50"
        >
          {submitting ? "Submitting…" : "Contribute Phrase"}
        </motion.button>
      </form>
    </section>
  );
}
