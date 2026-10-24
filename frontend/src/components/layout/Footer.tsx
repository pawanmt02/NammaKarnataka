"use client";

import Link from "next/link";
import { useOfflineStore } from "@/store";

export default function Footer() {
  const { isOnline, queue } = useOfflineStore();

  return (
    <footer className="border-t border-white/10 bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* PWA Offline Indicator */}
        {!isOnline && (
          <div className="mb-4 flex items-center justify-center gap-2 rounded-lg bg-yellow-400/10 px-4 py-2 text-sm text-yellow-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-yellow-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-yellow-400" />
            </span>
            Offline Mode — {queue.length} item{queue.length !== 1 ? "s" : ""}{" "}
            queued for sync
          </div>
        )}

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* Brand */}
          <div className="text-center sm:text-left">
            <span className="bg-gradient-to-r from-yellow-400 via-red-400 to-yellow-400 bg-clip-text text-lg font-bold text-transparent">
              ನಮ್ಮ ಕನ್ನಡ
            </span>
            <span className="ml-2 text-sm text-gray-500">© 2024</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-gray-400">
            <Link
              href="https://github.com/namma-kannada"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white"
            >
              GitHub
            </Link>
            <Link href="/about" className="transition-colors hover:text-white">
              About
            </Link>
            <Link
              href="/privacy"
              className="transition-colors hover:text-white"
            >
              Privacy
            </Link>
          </div>
        </div>

        {/* Tagline */}
        <p className="mt-4 text-center text-sm text-gray-500">
          Made with ❤️ for Karnataka&apos;s Linguistic Heritage
        </p>
      </div>
    </footer>
  );
}
