'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';

interface LeaderboardEntry {
  rank: number;
  user_id: string;
  username: string;
  avatar_url?: string;
  score: number;
  badges_count: number;
  contributions: number;
  is_current_user?: boolean;
}

/**
 * Leaderboard display component with animated entries and top-3 highlighting.
 */
export default function Leaderboard() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const PER_PAGE = 20;

  useEffect(() => {
    loadLeaderboard(1);
  }, []);

  const loadLeaderboard = async (pageNum: number) => {
    try {
      pageNum === 1 ? setIsLoading(true) : setLoadingMore(true);

      const data = await api.getLeaderboard(PER_PAGE);
      const newEntries: LeaderboardEntry[] = (data.entries || []) as any;

      if (pageNum === 1) {
        setEntries(newEntries);
      } else {
        setEntries((prev) => [...prev, ...newEntries]);
      }

      setHasMore(newEntries.length >= PER_PAGE);
      setPage(pageNum);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    } finally {
      setIsLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    loadLeaderboard(page + 1);
  };

  const getRankStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          bg: 'bg-gradient-to-r from-yellow-50 to-amber-50',
          border: 'border-yellow-400',
          badge: 'bg-yellow-400 text-yellow-900',
          icon: '🥇',
        };
      case 2:
        return {
          bg: 'bg-gradient-to-r from-gray-50 to-slate-50',
          border: 'border-gray-400',
          badge: 'bg-gray-400 text-white',
          icon: '🥈',
        };
      case 3:
        return {
          bg: 'bg-gradient-to-r from-orange-50 to-amber-50',
          border: 'border-orange-400',
          badge: 'bg-orange-400 text-orange-900',
          icon: '🥉',
        };
      default:
        return {
          bg: 'bg-white',
          border: 'border-gray-100',
          badge: 'bg-gray-200 text-gray-700',
          icon: '',
        };
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="space-y-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-white rounded-xl">
              <div className="w-10 h-10 bg-gray-200 rounded-full" />
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-1" />
                <div className="h-3 bg-gray-100 rounded w-1/4" />
              </div>
              <div className="h-6 w-16 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-1">Leaderboard</h2>
        <p className="text-gray-500 text-sm">Top dialect enthusiasts</p>
      </div>

      {/* Entries */}
      <div className="space-y-2">
        {entries.map((entry, idx) => {
          const style = getRankStyle(entry.rank);

          return (
            <motion.div
              key={entry.user_id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.04, duration: 0.3 }}
              className={`flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                style.bg
              } ${style.border} ${
                entry.is_current_user
                  ? 'ring-2 ring-amber-400 ring-offset-2'
                  : ''
              }`}
            >
              {/* Rank */}
              <div className="flex-shrink-0 w-10 text-center">
                {style.icon ? (
                  <span className="text-2xl">{style.icon}</span>
                ) : (
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${style.badge}`}
                  >
                    {entry.rank}
                  </span>
                )}
              </div>

              {/* Avatar */}
              <div className="flex-shrink-0">
                {entry.avatar_url ? (
                  <img
                    src={entry.avatar_url}
                    alt={entry.username}
                    className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                    {entry.username.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* Name + badges */}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">
                  {entry.username}
                  {entry.is_current_user && (
                    <span className="ml-2 text-xs text-amber-600 font-medium">(You)</span>
                  )}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-0.5">
                  <span>🏅 {entry.badges_count} badges</span>
                  <span>📝 {entry.contributions} contributions</span>
                </div>
              </div>

              {/* Score */}
              <div className="flex-shrink-0 text-right">
                <p className="text-xl font-bold text-amber-600">{entry.score.toLocaleString()}</p>
                <p className="text-xs text-gray-400">points</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="text-center mt-6">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="bg-white border-2 border-amber-300 text-amber-700 font-semibold py-2.5 px-8 rounded-xl hover:bg-amber-50 disabled:opacity-50 transition-all"
          >
            {loadingMore ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading...
              </span>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}

      {/* Empty state */}
      {entries.length === 0 && !isLoading && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🏆</p>
          <p className="text-gray-500">No leaderboard entries yet. Be the first!</p>
        </div>
      )}
    </div>
  );
}
