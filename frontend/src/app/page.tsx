"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { DIALECT_REGIONS } from "@/data/regions";
import { MapPin, Languages, Gamepad2, Building2, GitBranch, Upload, Trophy, Code } from "lucide-react";

const features = [
  {
    icon: <MapPin className="w-8 h-8" />,
    title: "Interactive Dialect Map",
    titleKn: "ಸಂವಾದಾತ್ಮಕ ಭಾಷಾ ನಕ್ಷೆ",
    desc: "Explore Karnataka's linguistic landscape through an interactive geo-map of dialects.",
    href: "/map",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: <Languages className="w-8 h-8" />,
    title: "AI Dialect Translator",
    titleKn: "AI ಉಪಭಾಷಾ ಅನುವಾದಕ",
    desc: "Translate Standard Kannada or English into authentic regional dialects using Gemini AI.",
    href: "/translate",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Gamepad2 className="w-8 h-8" />,
    title: "Language Quiz",
    titleKn: "ಭಾಷಾ ರಸಪ್ರಶ್ನೆ",
    desc: "Test your knowledge of Karnataka's dialects and earn badges.",
    href: "/quiz",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: <Building2 className="w-8 h-8" />,
    title: "3D Cultural Museum",
    titleKn: "3D ಸಾಂಸ್ಕೃತಿಕ ವಸ್ತುಸಂಗ್ರಹಾಲಯ",
    desc: "Explore 3D models of regional artifacts, cuisine, and traditional attire.",
    href: "/museum",
    color: "from-amber-500 to-yellow-500",
  },
  {
    icon: <GitBranch className="w-8 h-8" />,
    title: "Etymology Explorer",
    titleKn: "ಶಬ್ದ ವ್ಯುತ್ಪತ್ತಿ",
    desc: "Trace the historical roots and migration of words across Karnataka.",
    href: "/etymology",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: <Upload className="w-8 h-8" />,
    title: "Contribute",
    titleKn: "ಕೊಡುಗೆ ನೀಡಿ",
    desc: "Record and submit local words, phrases, and pronunciations from your region.",
    href: "/contribute",
    color: "from-teal-500 to-cyan-500",
  },
  {
    icon: <Trophy className="w-8 h-8" />,
    title: "Leaderboard",
    titleKn: "ಮುಂಚೂಣಿ ಫಲಕ",
    desc: "Compete with other language enthusiasts and climb the ranks.",
    href: "/leaderboard",
    color: "from-rose-500 to-orange-500",
  },
  {
    icon: <Code className="w-8 h-8" />,
    title: "Developer API",
    titleKn: "ಡೆವಲಪರ್ API",
    desc: "Access our structured linguistic dataset via secure REST endpoints.",
    href: "/api-docs",
    color: "from-slate-500 to-zinc-500",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function HomePage() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 pt-20 pb-32 sm:px-6 lg:px-8">
        {/* Background decoration */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-purple-600/20 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl text-center">
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl font-bold tracking-tight sm:text-8xl">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent">
                ನಮ್ಮ ಕನ್ನಡ
              </span>
            </h1>
            <p className="mt-4 text-2xl font-light text-indigo-200 sm:text-3xl">
              Regional Language Explorer
            </p>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mx-auto mt-8 max-w-3xl text-lg leading-relaxed text-slate-300"
          >
            Discover, preserve, and celebrate the incredible linguistic diversity of Karnataka.
            From the distinctive tones of Dharwad to the coastal rhythms of Kundapura — every
            dialect tells a story of our heritage.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/map"
              className="rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-orange-500/30"
            >
              🗺️ Explore the Map
            </Link>
            <Link
              href="/contribute"
              className="rounded-full border-2 border-white/20 px-8 py-3 text-lg font-semibold text-white backdrop-blur-sm transition-all hover:scale-105 hover:border-white/40 hover:bg-white/10"
            >
              ✍️ Start Contributing
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Dialect Region Pills */}
      <section className="px-4 pb-16 sm:px-6">
        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {DIALECT_REGIONS.map((region) => (
              <Link
                key={region.id}
                href={`/map?region=${region.id}`}
                className="group flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm transition-all hover:scale-105 hover:border-white/30"
                style={{ backgroundColor: `${region.color}20` }}
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: region.color }}
                />
                <span className="text-white/80 group-hover:text-white">
                  {region.kannada_name}
                </span>
              </Link>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-12 text-center text-3xl font-bold text-white sm:text-4xl"
          >
            Platform Features
          </motion.h2>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={item}>
                <Link
                  href={feature.href}
                  className="group block h-full rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10"
                >
                  <div
                    className={`mb-4 inline-flex rounded-xl bg-gradient-to-br ${feature.color} p-3 text-white shadow-lg`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                  <p className="text-sm text-indigo-300">{feature.titleKn}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-400">{feature.desc}</p>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y border-white/10 bg-white/5 px-4 py-16 sm:px-6">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-8 text-center md:grid-cols-4">
          {[
            { value: "8+", label: "Dialect Regions", icon: "🗺️" },
            { value: "1000+", label: "Phrases Documented", icon: "📝" },
            { value: "500+", label: "Audio Recordings", icon: "🎙️" },
            { value: "50+", label: "Contributors", icon: "👥" },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <span className="text-3xl">{stat.icon}</span>
              <span className="mt-2 text-3xl font-bold text-white">{stat.value}</span>
              <span className="text-sm text-slate-400">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-20 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl"
        >
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            ನಿಮ್ಮ ಭಾಷೆ, ನಿಮ್ಮ ಹೆಮ್ಮೆ
          </h2>
          <p className="mt-2 text-xl text-indigo-300">Your Language, Your Pride</p>
          <p className="mt-4 text-slate-400">
            Help us preserve Karnataka&apos;s intangible linguistic heritage for future generations.
            Every word you contribute is a step toward keeping our culture alive.
          </p>
          <Link
            href="/contribute"
            className="mt-8 inline-block rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 px-10 py-4 text-lg font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-purple-500/30"
          >
            🙏 Join the Movement
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
