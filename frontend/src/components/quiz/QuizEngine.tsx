'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { useQuizStore } from '@/store';
import { DIALECT_REGIONS } from '@/data/regions';
import { DialectRegion } from '@/types';

type Screen = 'select' | 'playing' | 'results';

/**
 * The main quiz game component.
 * Region selection → Questions with timer → Results with badges.
 */
export default function QuizEngine() {
  const [screen, setScreen] = useState<Screen>('select');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timer, setTimer] = useState(30);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [animatedScore, setAnimatedScore] = useState(0);

  const {
    questions,
    setQuestions,
    badges,
    setBadges,
    streak,
    setStreak,
  } = useQuizStore();

  // Timer countdown
  useEffect(() => {
    if (screen !== 'playing' || selectedAnswer !== null) return;

    if (timer <= 0) {
      handleAnswer(null);
      return;
    }

    const interval = setInterval(() => {
      setTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [screen, timer, selectedAnswer]);

  // Animated score counter on results screen
  useEffect(() => {
    if (screen !== 'results') return;

    let current = 0;
    const step = Math.ceil(score / 30);
    const interval = setInterval(() => {
      current += step;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(interval);
      } else {
        setAnimatedScore(current);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [screen, score]);

  const startQuiz = async () => {
    setIsLoading(true);
    try {
      const data = await api.getQuizQuestions(
        selectedRegion === 'all' ? undefined : (selectedRegion as DialectRegion)
      );
      setQuestions(Array.isArray(data) ? data : (data as any).questions || []);
      setCurrentIndex(0);
      setScore(0);
      setAnswers([]);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setTimer(30);
      setScreen('playing');
    } catch (error) {
      console.error('Failed to load quiz questions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = useCallback(
    (answer: string | null) => {
      if (selectedAnswer !== null) return;
      const question = questions[currentIndex];
      const correct = answer === question.correct_answer;

      setSelectedAnswer(answer);
      setIsCorrect(correct);
      setAnswers((prev) => [...prev, correct]);
      if (correct) setScore((s) => s + (10 + timer)); // Bonus for speed

      // Move to next question after delay
      setTimeout(() => {
        if (currentIndex + 1 < questions.length) {
          setCurrentIndex((i) => i + 1);
          setSelectedAnswer(null);
          setIsCorrect(null);
          setTimer(30);
        } else {
          finishQuiz();
        }
      }, 1500);
    },
    [currentIndex, questions, selectedAnswer, timer]
  );

  const finishQuiz = async () => {
    try {
      const result = await api.submitQuiz([
        {
          question_id: questions[currentIndex]?.id || "q1",
          user_answer: (selectedAnswer !== null && typeof selectedAnswer === 'number') ? questions[currentIndex]?.options[selectedAnswer] || "" : "",
          region: selectedRegion === 'all' ? undefined : selectedRegion,
        },
      ]);
      if (result.badges || result.badges_earned) {
        setBadges((result.badges || result.badges_earned) as any);
      }
      if (result.streak !== undefined) setStreak(result.streak);
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    }
    setScreen('results');
  };

  const currentQuestion = questions[currentIndex];

  // ─── Region Selection Screen ────────────────────────────────────
  if (screen === 'select') {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Dialect Quiz</h2>
          <p className="text-gray-500">Test your knowledge of Kannada dialects!</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {/* All Regions option */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSelectedRegion('all')}
            className={`p-5 rounded-xl border-2 text-center transition-all ${
              selectedRegion === 'all'
                ? 'border-amber-500 bg-amber-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-amber-300'
            }`}
          >
            <span className="text-2xl mb-2 block">🌍</span>
            <span className="font-semibold text-gray-900">All Regions</span>
          </motion.button>

          {DIALECT_REGIONS.map((region) => (
            <motion.button
              key={region.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setSelectedRegion(region.id)}
              className={`p-5 rounded-xl border-2 text-center transition-all ${
                selectedRegion === region.id
                  ? 'border-amber-500 bg-amber-50 shadow-lg'
                  : 'border-gray-200 bg-white hover:border-amber-300'
              }`}
            >
              <div
                className="w-4 h-4 rounded-full mx-auto mb-2"
                style={{ backgroundColor: region.color }}
              />
              <span className="font-semibold text-gray-900 text-sm">{region.name}</span>
              <span className="block text-xs text-gray-500">{region.nameKannada}</span>
            </motion.button>
          ))}
        </div>

        <div className="text-center">
          <button
            onClick={startQuiz}
            disabled={isLoading}
            className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold text-lg py-4 px-12 rounded-xl hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Loading...
              </span>
            ) : (
              'Start Quiz 🚀'
            )}
          </button>
        </div>
      </div>
    );
  }

  // ─── Playing Screen ─────────────────────────────────────────────
  if (screen === 'playing' && currentQuestion) {
    const progress = ((currentIndex + 1) / questions.length) * 100;
    const optionLabels = ['A', 'B', 'C', 'D'];

    return (
      <div className="max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="font-semibold">Score: {score}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-gradient-to-r from-amber-400 to-orange-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>

        {/* Timer */}
        <div className="flex justify-center mb-6">
          <div
            className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold border-4 transition-colors ${
              timer <= 5
                ? 'border-red-500 text-red-600 bg-red-50'
                : timer <= 10
                ? 'border-amber-400 text-amber-600 bg-amber-50'
                : 'border-green-400 text-green-600 bg-green-50'
            }`}
          >
            {timer}
          </div>
        </div>

        {/* Question */}
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8 mb-6 border border-gray-100"
        >
          <h3 className="text-xl font-bold text-gray-900 mb-2 leading-relaxed">
            {currentQuestion?.prompt || currentQuestion?.question || "Guess the regional dialect:"}
          </h3>

          {/* Audio player */}
          {currentQuestion.audio_url && (
            <div className="mb-4">
              <audio controls className="w-full" src={currentQuestion.audio_url}>
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </motion.div>

        {/* Options */}
        <div className="grid grid-cols-1 gap-3">
          {currentQuestion.options.map((option, idx) => {
            const isSelected = selectedAnswer === option;
            const isCorrectOption = option === currentQuestion.correct_answer;
            const showResult = selectedAnswer !== null;

            let cardStyle = 'border-gray-200 bg-white hover:border-amber-400 hover:bg-amber-50';
            if (showResult) {
              if (isCorrectOption) {
                cardStyle = 'border-green-500 bg-green-50';
              } else if (isSelected && !isCorrect) {
                cardStyle = 'border-red-500 bg-red-50';
              } else {
                cardStyle = 'border-gray-200 bg-gray-50 opacity-60';
              }
            }

            return (
              <motion.button
                key={idx}
                whileHover={!showResult ? { scale: 1.01 } : {}}
                whileTap={!showResult ? { scale: 0.99 } : {}}
                onClick={() => handleAnswer(option)}
                disabled={selectedAnswer !== null}
                className={`flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-all ${cardStyle}`}
              >
                <span
                  className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                    showResult && isCorrectOption
                      ? 'bg-green-500 text-white'
                      : showResult && isSelected && !isCorrect
                      ? 'bg-red-500 text-white'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {optionLabels[idx]}
                </span>
                <span className="text-gray-800 font-medium">{option}</span>

                {showResult && isCorrectOption && (
                  <span className="ml-auto text-green-600 text-lg">✓</span>
                )}
                {showResult && isSelected && !isCorrect && (
                  <span className="ml-auto text-red-600 text-lg">✗</span>
                )}
              </motion.button>
            );
          })}
        </div>

        {/* Feedback overlay */}
        <AnimatePresence>
          {selectedAnswer !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div
                className={`text-6xl font-bold px-8 py-4 rounded-2xl ${
                  isCorrect ? 'text-green-500' : 'text-red-500'
                }`}
              >
                {isCorrect ? '✓ Correct!' : '✗ Wrong'}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ─── Results Screen ─────────────────────────────────────────────
  if (screen === 'results') {
    const correctCount = answers.filter(Boolean).length;
    const totalCount = answers.length;
    const percentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

    return (
      <div className="max-w-xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          {/* Score */}
          <div className="mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg"
            >
              <span className="text-4xl font-bold text-white">{animatedScore}</span>
            </motion.div>
            <p className="text-gray-500 mt-3 text-sm">Total Score</p>
          </div>

          {/* Correct / Total */}
          <div className="flex justify-center gap-8 mb-6">
            <div>
              <p className="text-3xl font-bold text-green-600">{correctCount}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Correct</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div>
              <p className="text-3xl font-bold text-gray-400">{totalCount}</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Total</p>
            </div>
            <div className="w-px bg-gray-200" />
            <div>
              <p className="text-3xl font-bold text-amber-500">{percentage}%</p>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Accuracy</p>
            </div>
          </div>

          {/* Badges earned */}
          {badges && badges.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                Badges Earned 🏆
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {badges.map((badge: any, idx: number) => (
                  <motion.div
                    key={badge?.id || idx}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.15, type: 'spring' }}
                    className="bg-gradient-to-br from-yellow-100 to-amber-100 border border-amber-300 rounded-xl px-4 py-2 shadow-sm"
                  >
                    <span className="text-2xl block">{badge?.icon || '🏅'}</span>
                    <span className="text-xs font-medium text-amber-800">{badge?.name || String(badge)}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Streak info */}
          {streak !== undefined && streak > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-500">
                🔥 Current Streak: <span className="font-bold text-orange-600">{streak} days</span>
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-center mt-6">
            <button
              onClick={() => {
                setScreen('select');
                setAnimatedScore(0);
              }}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold py-3 px-8 rounded-xl hover:from-amber-600 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all"
            >
              Play Again 🎮
            </button>
            <a
              href="/quiz/leaderboard"
              className="bg-white border-2 border-amber-400 text-amber-700 font-semibold py-3 px-8 rounded-xl hover:bg-amber-50 transition-all"
            >
              View Leaderboard 🏆
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return null;
}
