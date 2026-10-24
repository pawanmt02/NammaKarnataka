"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, Copy, Check, Sparkles } from "lucide-react";
import { DialectRegion } from "@/types";
import { DIALECT_REGIONS } from "@/data/regions";

interface SpeechTranscriberProps {
  initialRegion?: DialectRegion;
}

export default function SpeechTranscriber({ initialRegion }: SpeechTranscriberProps) {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [standardScript, setStandardScript] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<DialectRegion>(
    initialRegion || DialectRegion.NORTH_KARNATAKA
  );
  const [confidence, setConfidence] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Regional phonetic mapping rules to bridge regional dialect speech to standard Kannada script
  const dialectToStandardMap: Record<string, Record<string, string>> = {
    [DialectRegion.NORTH_KARNATAKA]: {
      "ಮಾಡತೀಯ": "ಮಾಡುತ್ತಿದ್ದೀಯಾ",
      "ಮಾಡ್ತೀಯ": "ಮಾಡುತ್ತಿದ್ದೀಯಾ",
      "ಬರ್ರೀ": "ಬನ್ನಿ",
      "ಛಲೋ": "ಒಳ್ಳೆಯದು",
      "ಅದ": "ಇದೆ",
      "ಇಲ್ಲೇ": "ಇಲ್ಲಿಯೇ",
      "ಹ್ಯಾಂಗ": "ಹೇಗೆ",
      "ಐತಿ": "ಇದೆ",
    },
    [DialectRegion.COASTAL_KARNATAKA]: {
      "ಎಂತ": "ಏನು",
      "ಬಾಲೇ": "ಬಾ",
      "ಪೊರ್ಲು": "ಸುಂದರ",
      "ವಣಸ್": "ಊಟ",
      "ಆಂಡಾ": "ಆಯಿತಾ",
      "ಮಾರ್ರೆ": "ಸ್ನೇಹಿತರೆ",
      "ಮಾಡ್ತಿದ್ದೆ": "ಮಾಡುತ್ತಿದ್ದೀಯಾ",
    },
    [DialectRegion.MALNAD]: {
      "ಬಪ್ಪಾ": "ಬನ್ನಿ",
      "ಜಾಲ": "ಉತ್ತಮ",
      "ಎಂತ": "ಏನು",
      "ಕಾಪಿ": "ಕಾಫಿ",
    },
    [DialectRegion.HYDERABAD_KARNATAKA]: {
      "ಕ್ಯಾ": "ಏನು",
      "ಅಚ್ಛಾ": "ಉತ್ತಮ",
      "ಹ್ಯಾಂಗಿದ್ದೀರ್ರೀ": "ಹೇಗಿದ್ದೀರಿ",
    },
  };

  const normalizeToStandardKannada = useCallback(
    (spokenText: string, region: DialectRegion): string => {
      let result = spokenText;
      const dict = dialectToStandardMap[region] || {};
      for (const [regionalWord, standardWord] of Object.entries(dict)) {
        const regex = new RegExp(`\\b${regionalWord}\\b`, "gi");
        result = result.replace(regex, standardWord);
      }
      return result;
    },
    []
  );

  useEffect(() => {
    // Check Web Speech API support
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "kn-IN"; // Kannada (India)

      recognition.onresult = (event: any) => {
        let currentTranscript = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          currentTranscript += event.results[i][0].transcript;
          if (event.results[i][0].confidence) {
            setConfidence(Math.round(event.results[i][0].confidence * 100));
          }
        }
        setTranscript(currentTranscript);
        const standard = normalizeToStandardKannada(currentTranscript, selectedRegion);
        setStandardScript(standard);
      };

      recognition.onerror = (event: any) => {
        console.warn("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [selectedRegion, normalizeToStandardKannada]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(
        "Speech Recognition is not natively supported in this browser. Please use Chrome or Edge."
      );
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setTranscript("");
      setStandardScript("");
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleCopy = () => {
    if (!standardScript && !transcript) return;
    navigator.clipboard.writeText(standardScript || transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateSample = (sample: string) => {
    setTranscript(sample);
    const standard = normalizeToStandardKannada(sample, selectedRegion);
    setStandardScript(standard);
    setConfidence(94);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
            <Sparkles className="h-6 w-6 text-yellow-400" />
            Real-Time Dialect STT Transcriber
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            ಧ್ವನಿ ಮೂಲಕ ಉಪಭಾಷೆಗಳನ್ನು ಮಾತನಾಡಿ, ಪ್ರಮಾಣಿತ ಕನ್ನಡ ಲಿಪಿಗೆ ತಕ್ಷಣ ಪರಿವರ್ತಿಸಿ
          </p>
        </div>

        {/* Region selector */}
        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400">Dialect Acoustic Model:</label>
          <select
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value as DialectRegion)}
            className="rounded-xl border border-white/10 bg-slate-900 px-3 py-1.5 text-xs font-medium text-white outline-none focus:border-yellow-400"
          >
            {DIALECT_REGIONS.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name} ({r.kannada_name})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Microphone Button */}
      <div className="my-8 flex flex-col items-center justify-center">
        <motion.button
          onClick={toggleListening}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative flex h-24 w-24 items-center justify-center rounded-full shadow-2xl transition-all ${
            isListening
              ? "bg-red-500 shadow-red-500/50"
              : "bg-gradient-to-r from-yellow-500 to-amber-600 shadow-yellow-500/30"
          }`}
        >
          {isListening && (
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.7, 0, 0.7] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 rounded-full bg-red-400"
            />
          )}
          {isListening ? (
            <MicOff className="relative z-10 h-10 w-10 text-white" />
          ) : (
            <Mic className="relative z-10 h-10 w-10 text-white" />
          )}
        </motion.button>
        <p className="mt-4 text-sm font-medium text-slate-300">
          {isListening ? "Listening... Speak in your regional dialect" : "Click microphone to start speaking"}
        </p>
      </div>

      {/* Sample Quick Try Pills */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-slate-400">Or try a sample dialect phrase:</span>
        {[
          "ಏನ ಮಾಡ್ತೀಯಪಾ ನೀನು?",
          "ಎಂತ ಸಂಗತಿ ಮಾರ್ರೆ?",
          "ಮನೆಗೆ ಬಪ್ಪಾ ಕಾಪಿ ಕುಡಿಯುವ",
          "ಹೋಗ್ಬರ್ತೀನಿ ಕಣ್ರೀ",
        ].map((sample) => (
          <button
            key={sample}
            onClick={() => handleSimulateSample(sample)}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 hover:border-yellow-400 hover:bg-white/10"
          >
            {sample}
          </button>
        ))}
      </div>

      {/* Dual Transcribed Output Cards */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Spoken Dialect */}
        <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Spoken Dialect (Acoustic Capture)</span>
            {confidence !== null && (
              <span className="rounded-full bg-yellow-400/10 px-2 py-0.5 text-yellow-400">
                Confidence: {confidence}%
              </span>
            )}
          </div>
          <p className="mt-3 min-h-[70px] text-lg font-medium text-amber-200">
            {transcript || (
              <span className="text-slate-600 italic">Spoken words will appear here...</span>
            )}
          </p>
        </div>

        {/* Standard Kannada Transcription */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-5">
          <div className="flex items-center justify-between text-xs text-emerald-400">
            <span>Normalized Standard Kannada Script (ಪ್ರಮಾಣಿತ ಕನ್ನಡ)</span>
            {(standardScript || transcript) && (
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 text-emerald-300 hover:text-white"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>
          <p className="mt-3 min-h-[70px] text-lg font-medium text-emerald-200">
            {standardScript || (
              <span className="text-slate-600 italic">
                Standard Kannada transcription will be generated here...
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
