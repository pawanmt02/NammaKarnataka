"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code, Key, Copy, Check, Terminal, ExternalLink, Shield } from "lucide-react";

const ENDPOINTS = [
  {
    method: "GET",
    path: "/api/v1/phrases",
    desc: "List verified regional phrases with optional region filter, pagination, and keyword search.",
    params: "?region=north_karnataka&page=1&page_size=20&search=ಛಲೋ",
  },
  {
    method: "GET",
    path: "/api/v1/phrases/{phrase_id}",
    desc: "Retrieve a specific dialect phrase, pronunciation guide, and audio URL.",
    params: "",
  },
  {
    method: "POST",
    path: "/api/v1/translate/dialect",
    desc: "Translate Standard Kannada or English into a target regional dialect using Gemini AI.",
    params: 'Body: {"text": "How are you?", "target_dialect": "north_karnataka"}',
  },
  {
    method: "GET",
    path: "/api/v1/etymology/{word}",
    desc: "Fetch node-based etymological graph showing word origins across historical eras.",
    params: "",
  },
  {
    method: "GET",
    path: "/api/v1/geo/phrase-of-day/{region}",
    desc: "Fetch geo-fenced phrase of the day and cultural context for a dialect zone.",
    params: "",
  },
  {
    method: "POST",
    path: "/api/v1/developer/api-keys",
    desc: "Generate developer API key with rate-limit tiering for educational or non-profit research.",
    params: 'Body: {"app_name": "KannadaNLP", "purpose": "Academic dialect research"}',
  },
];

export default function ApiDocsPage() {
  const [apiKey, setApiKey] = useState("nk_live_8f3a9e2d1c7b4a5e6f8091ab");
  const [copiedKey, setCopiedKey] = useState(false);
  const [activeTab, setActiveTab] = useState<"curl" | "python" | "javascript">("python");

  const handleCopyKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const codeSnippets = {
    python: `import requests

API_KEY = "${apiKey}"
BASE_URL = "http://localhost:8000/api/v1"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json"
}

# 1. Fetch phrases from Coastal Karnataka (Kundapura)
response = requests.get(
    f"{BASE_URL}/phrases",
    params={"region": "coastal_karnataka", "page_size": 5},
    headers=headers
)
print(response.json())

# 2. AI Dialect Translation
translation = requests.post(
    f"{BASE_URL}/translate/dialect",
    json={
        "text": "Have you had your lunch?",
        "source_language": "english",
        "target_dialect": "coastal_karnataka"
    },
    headers=headers
)
print("Dialect Output:", translation.json()["translated_text"])`,
    curl: `curl -X GET "http://localhost:8000/api/v1/phrases?region=north_karnataka&page_size=5" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json"

curl -X POST "http://localhost:8000/api/v1/translate/dialect" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Come home, let us drink coffee",
    "target_dialect": "malnad"
  }'`,
    javascript: `const API_KEY = "${apiKey}";
const BASE_URL = "http://localhost:8000/api/v1";

async function fetchDialectData() {
  const res = await fetch(\`\${BASE_URL}/phrases?region=north_karnataka\`, {
    headers: {
      "Authorization": \`Bearer \${API_KEY}\`,
      "Content-Type": "application/json"
    }
  });
  const data = await res.json();
  console.log("Phrases:", data.phrases);
}

fetchDialectData();`,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold text-cyan-300"
        >
          <Code className="h-3.5 w-3.5" />
          Namma Kannada Open Data API
        </motion.div>

        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          ಡೆವಲಪರ್ API ಮತ್ತು ದತ್ತಾಂಶ ಪ್ರವೇಶ
        </h1>
        <p className="mt-2 text-xl text-cyan-300">Namma Kannada REST API for Developers</p>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
          Empowering researchers, linguists, and educational technologists with programmatic access to Karnataka&apos;s crowdsourced dialect repository, audio pronunciations, and Gemini translation pipelines.
        </p>
      </div>

      {/* Developer API Key Box */}
      <div className="mb-10 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-white">
              <Key className="h-5 w-5 text-yellow-400" />
              <h2 className="font-bold">Your Developer Sandbox API Key</h2>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              Rate Limit: 100 req/min • Academic & Open-Source Tier
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950 px-4 py-2 font-mono text-xs text-yellow-300">
            <span>{apiKey}</span>
            <button
              onClick={handleCopyKey}
              className="ml-2 rounded-lg p-1 text-slate-400 hover:text-white"
            >
              {copiedKey ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Endpoints Table */}
      <div className="mb-12">
        <h2 className="mb-4 text-xl font-bold text-white">Public REST API Endpoints</h2>
        <div className="space-y-3">
          {ENDPOINTS.map((ep, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/10 bg-slate-900/60 p-4 transition hover:border-white/20"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                    ep.method === "GET"
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  }`}
                >
                  {ep.method}
                </span>
                <span className="font-mono text-sm font-semibold text-white">{ep.path}</span>
              </div>
              <p className="mt-2 text-xs text-slate-300">{ep.desc}</p>
              {ep.params && (
                <p className="mt-1.5 font-mono text-[11px] text-slate-500 break-all">{ep.params}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Code Examples Tabs */}
      <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-emerald-400" />
            <h3 className="font-bold text-white">Integration Code Samples</h3>
          </div>

          <div className="flex gap-2">
            {(["python", "curl", "javascript"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition ${
                  activeTab === tab
                    ? "bg-emerald-500 text-slate-950 font-bold"
                    : "border border-white/10 bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <pre className="overflow-x-auto rounded-2xl border border-white/5 bg-slate-950 p-5 font-mono text-xs text-emerald-300 leading-relaxed">
          <code>{codeSnippets[activeTab]}</code>
        </pre>
      </div>
    </div>
  );
}
