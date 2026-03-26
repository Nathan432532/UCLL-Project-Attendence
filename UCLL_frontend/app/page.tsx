"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, Loader2, Sparkles } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { AddMatchForm } from "@/components/attendance/add-match-form"
import { PredictionCard } from "@/components/attendance/prediction-card"
import { FactorsCard } from "@/components/attendance/factors-card"
import { HistoryChart } from "@/components/attendance/history-chart"

interface LatestPrediction {
  match: string
  predicted: number
  actual: number | null
  trend_pct: number
  // factors no longer exists in the new model output
}

interface FuturePrediction {
  match: string
  predicted: number
  opponent_tier: number
  is_big6: boolean
  position_gap: number
  phase_num: number
}

interface ModelData {
  meta: { n_test: number; n_train: number; train_mae: number; test_mae: number; r2_cv: number; accuracy_pct: number }
  history: Array<{ match: string; actual: number; predicted: number; is_big6: boolean; position_gap: number }>
  latest_prediction: LatestPrediction
  future_predictions: FuturePrediction[]
}

interface ModelData {
  meta: { n_test: number; n_train: number; train_mae: number; test_mae: number; r2_cv: number; accuracy_pct: number }
  history: Array<{ match: string; actual: number; predicted: number; is_big6: boolean; position_gap: number }>
  latest_prediction: LatestPrediction
  future_predictions: FuturePrediction[]
}

export default function AttendancePrediction() {
  const [isPinkMode, setIsPinkMode] = useState(false)
  const [modelData, setModelData] = useState<ModelData | null>(null)
  const clickCountRef = useRef(0)
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Easter egg: Click logo 5 times to toggle pink mode
  const handleLogoClick = () => {
    clickCountRef.current += 1
    
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current)
    }
    
    clickTimeoutRef.current = setTimeout(() => {
      clickCountRef.current = 0
    }, 2000)
    
    if (clickCountRef.current >= 5) {
      setIsPinkMode((prev) => !prev)
      clickCountRef.current = 0
    }
  }

  // Pink theme colors
  const pinkPrimary = "#FF69B4" // Hot Pink
  const pinkSecondary = "#FFB6C1" // Soft Rose
  const ohlRed = "#E20613"
  const ohlGreen = "#009640"

  const accentColor = isPinkMode ? pinkPrimary : ohlRed
  const secondaryAccent = isPinkMode ? pinkSecondary : ohlGreen

  const latest = modelData?.latest_prediction
  const historyData = modelData?.history ?? []
  const modelAccuracy = modelData?.meta?.accuracy_pct;

  type FactorImpact = "positive" | "neutral" | "negative"
  type FactorListItem = {
    label: string
    value: string
    detail: string
    impact: FactorImpact
  }

  // Replace the factorList block with this:
const latestFuture = modelData?.future_predictions?.[modelData.future_predictions.length - 1]

const factorList: FactorListItem[] = latestFuture
  ? [
      {
        label: "Opponent Tier",
        value: `Tier ${latestFuture.opponent_tier}`,
        detail: latestFuture.match,
        impact: (latestFuture.opponent_tier === 3
          ? "positive"
          : latestFuture.opponent_tier === 1
            ? "negative"
            : "neutral") as FactorImpact,
      },
      {
        label: "Position Gap",
        value: `${latestFuture.position_gap} places`,
        detail: "Standing difference",
        impact: (latestFuture.position_gap > 5
          ? "positive"
          : latestFuture.position_gap < 2
            ? "negative"
            : "neutral") as FactorImpact,
      },
      {
        label: "Big 6",
        value: latestFuture.is_big6 ? "Yes" : "No",
        detail: latestFuture.is_big6 ? "High interest match" : "Standard match",
        impact: latestFuture.is_big6 ? "positive" : "neutral",
      },
      {
        label: "Season Phase",
        value: latestFuture.phase_num === 1 ? "Beginning" : latestFuture.phase_num === 2 ? "Middle" : "End",
        detail: "Phase of season",
        impact: latestFuture.phase_num === 3 ? "positive" : "neutral",
      },
    ]
  : []

  // Fetch model predictions from server API
  useEffect(() => {
  async function fetchModel() {
    try {
      // ADD THE TIMESTAMP HERE: ?t=${Date.now()}
      const response = await fetch(`/api/matches?t=${Date.now()}`, {
        cache: 'no-store', // This tells Next.js not to cache the result
      })
      if (!response.ok) throw new Error("Failed to load model data")

      const data = await response.json()
      setModelData(data)
    } catch (err) {
      console.error("Failed to load model data", err)
    }
  }

  fetchModel()
}, [])

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Image - swaps to women's team in pink mode */}
      <div className="fixed inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={isPinkMode ? "womens" : "mens"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <Image
              src={isPinkMode ? "/images/womens-team-photo.jpg" : "/images/team-photo.jpg"}
              alt={isPinkMode ? "OH Leuven women's team celebration" : "OH Leuven team celebration"}
              fill
              className="object-cover object-center"
              priority
            />
          </motion.div>
        </AnimatePresence>
        {/* Dark/Pink overlay - 70% for text readability */}
        <motion.div 
          className="absolute inset-0"
          animate={{
            backgroundColor: isPinkMode 
              ? "rgba(255, 105, 180, 0.5)" 
              : "rgba(0, 0, 0, 0.7)"
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
        
        {/* Subtle gradient overlay for depth */}
        <motion.div 
          className="absolute inset-0"
          animate={{
            background: isPinkMode
              ? "linear-gradient(to bottom, rgba(255, 182, 193, 0.4), transparent, rgba(255, 105, 180, 0.5))"
              : "linear-gradient(to bottom, rgba(0, 0, 0, 0.4), transparent, rgba(0, 0, 0, 0.7))"
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
        
        {/* Color accent glow - bottom left */}
        <motion.div 
          className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full blur-3xl"
          animate={{
            backgroundColor: isPinkMode 
              ? "rgba(255, 182, 193, 0.4)" 
              : "rgba(0, 150, 64, 0.2)"
          }}
          transition={{ duration: 0.8 }}
        />
        
        {/* Color accent glow - top right */}
        <motion.div 
          className="absolute -right-20 -top-20 h-96 w-96 rounded-full blur-3xl"
          animate={{
            backgroundColor: isPinkMode 
              ? "rgba(255, 105, 180, 0.4)" 
              : "rgba(226, 6, 19, 0.2)"
          }}
          transition={{ duration: 0.8 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-4 md:px-8 md:py-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <button
              onClick={handleLogoClick}
              className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
              aria-label="OH Leuven logo"
            >
              <Image
                src="/images/oh-leuven-logo.png"
                alt="OH Leuven"
                width={216}
                height={54}
                className="h-11 w-auto brightness-0 invert md:h-14"
              />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <AddMatchForm isPinkMode={isPinkMode} />
            <ThemeToggle />
          </motion.div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 text-center md:mb-12"
          >
            <motion.div 
              className="relative mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 backdrop-blur-md"
              animate={{
                backgroundColor: isPinkMode ? "rgba(255, 182, 193, 0.3)" : "rgba(255, 255, 255, 0.1)"
              }}
              transition={{ duration: 0.5 }}
            >
              <Brain className="h-5 w-5" style={{ color: accentColor }} />
              <span className="text-sm font-semibold text-white">AI-Powered Analytics</span>
              
              {/* Sparkles for Pink Mode */}
              <AnimatePresence>
                {isPinkMode && (
                  <>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      className="absolute -right-2 -top-2"
                    >
                      <Sparkles className="h-4 w-4 text-[#FF69B4]" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0 }}
                      transition={{ delay: 0.1 }}
                      className="absolute -left-1 top-0"
                    >
                      <Sparkles className="h-3 w-3 text-[#FFB6C1]" />
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </motion.div>
            
            <h1 className="mb-4 text-balance text-5xl font-bold uppercase tracking-wide text-white md:text-6xl lg:text-7xl">
              <motion.span
                animate={{
                  textShadow: isPinkMode 
                    ? "0 0 30px rgba(255, 105, 180, 0.5)" 
                    : "none"
                }}
                transition={{ duration: 0.5 }}
              >
                Matchday Attendance
              </motion.span>
              <br />
              <motion.span 
                className="bg-clip-text text-transparent"
                animate={{
                  backgroundImage: isPinkMode
                    ? "linear-gradient(to right, #FF1493, #FF69B4, #FF1493)"
                    : "linear-gradient(to right, #E20613, #FF4D4D, #E20613)",
                  textShadow: isPinkMode
                    ? "0 0 40px rgba(255, 20, 147, 0.7), 0 0 25px rgba(255, 105, 180, 0.5)"
                    : "0 0 30px rgba(226, 6, 19, 0.6), 0 0 20px rgba(255, 77, 77, 0.4)"
                }}
                style={{
                  backgroundImage: isPinkMode
                    ? "linear-gradient(to right, #FF1493, #FF69B4, #FF1493)"
                    : "linear-gradient(to right, #E20613, #FF4D4D, #E20613)",
                  textShadow: isPinkMode
                    ? "0 0 40px rgba(255, 20, 147, 0.7), 0 0 25px rgba(255, 105, 180, 0.5)"
                    : "0 0 30px rgba(226, 6, 19, 0.6), 0 0 20px rgba(255, 77, 77, 0.4)"
                }}
                transition={{ duration: 0.5 }}
              >
                Prediction AI Model
              </motion.span>
            </h1>
            
            <p className="mx-auto max-w-2xl text-pretty text-base text-white/70 md:text-lg">
              Advanced machine learning model analyzing historical data, weather patterns,
              opponent strength, and ticket sales to predict matchday attendance.
            </p>

          </motion.div>

          {/* Bento Grid */}
          <div className="relative grid gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {/* Pink Mode Sparkles around cards */}
            <AnimatePresence>
              {isPinkMode && (
                <>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1, y: [0, -5, 0] }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ y: { duration: 2, repeat: Infinity } }}
                    className="absolute -left-2 top-10 z-20"
                  >
                    <Sparkles className="h-6 w-6 text-[#FF69B4]" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ delay: 0.2, y: { duration: 1.5, repeat: Infinity } }}
                    className="absolute right-4 top-20 z-20"
                  >
                    <Sparkles className="h-5 w-5 text-[#FFB6C1]" />
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{ delay: 0.4, y: { duration: 1.8, repeat: Infinity } }}
                    className="absolute bottom-1/3 left-1/4 z-20"
                  >
                    <Sparkles className="h-4 w-4 text-[#FF69B4]" />
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Prediction Card */}
            <div className="md:col-span-1">
              <PredictionCard
                isPinkMode={isPinkMode}
                predictedAttendance={latest?.predicted ?? 0}
                actualAttendance={latest?.actual ?? undefined}
                matchName={latest?.match ?? "Loading..."}
                trendPct={latest?.trend_pct ?? 0}
              />
            </div>

            {/* Factors Card */}
            <div className="md:col-span-1 lg:col-span-2">
              <FactorsCard isPinkMode={isPinkMode} factors={factorList} />
            </div>

            {/* History Chart - Full Width */}
            <div className="md:col-span-2 lg:col-span-3">
              <HistoryChart isPinkMode={isPinkMode} historyData={historyData} modelAccuracy={modelAccuracy} />
            </div>
          </div>

          {/* Footer */}
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 text-center"
          >
            <p className="text-sm text-white/50">
              Powered by OH Leuven Data Science Team
            </p>
            <p className="mt-1 text-xs text-white/30">
              Data powered by model output (not fake data)
            </p>
          </motion.footer>
        </main>
      </div>
    </div>
  )
}
