"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface PredictionInputFormProps {
  isOpen: boolean
  onClose: () => void
  isPinkMode?: boolean
}

export function PredictionInputForm({ isOpen, onClose, isPinkMode = false }: PredictionInputFormProps) {
  const [opponentTeam, setOpponentTeam] = useState("")
  const [currentRound, setCurrentRound] = useState("")
  const [totalRounds, setTotalRounds] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission
    console.log({ opponentTeam, currentRound, totalRounds })
    onClose()
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="relative w-full max-w-md rounded-3xl border-0 bg-white/90 p-6 shadow-2xl backdrop-blur-xl dark:bg-gray-900/90">
          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-800"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="h-5 w-5" />
          </motion.button>

          <h2 className="mb-6 text-2xl font-bold">
            <span style={{ color: isPinkMode ? "#FF69B4" : "#E20613" }}>
              Prediction Input
            </span>
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Opponent Team */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Opponent Team
              </label>
              <input
                type="text"
                value={opponentTeam}
                onChange={(e) => setOpponentTeam(e.target.value)}
                placeholder="Enter opponent team name"
                className="w-full rounded-2xl border border-gray-300 bg-white/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-800/50"
                required
              />
            </div>

            {/* Current Round */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Current Round
              </label>
              <input
                type="number"
                value={currentRound}
                onChange={(e) => setCurrentRound(e.target.value)}
                placeholder="e.g., 5"
                className="w-full rounded-2xl border border-gray-300 bg-white/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-800/50"
                min="1"
                required
              />
            </div>

            {/* Total Rounds */}
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                Total Rounds
              </label>
              <input
                type="number"
                value={totalRounds}
                onChange={(e) => setTotalRounds(e.target.value)}
                placeholder="e.g., 30"
                className="w-full rounded-2xl border border-gray-300 bg-white/50 px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-transparent focus:outline-none focus:ring-2 dark:border-gray-700 dark:bg-gray-800/50"
                min="1"
                required
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              className="mt-6 w-full rounded-2xl py-3 font-semibold text-white transition-all"
              style={{
                background: isPinkMode
                  ? "linear-gradient(to right, #FF69B4, #FFB6C1)"
                  : "linear-gradient(to right, #E20613, #ff4d4d)",
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Get Prediction
            </motion.button>
          </form>
        </Card>
      </motion.div>
    </motion.div>
  )
}
