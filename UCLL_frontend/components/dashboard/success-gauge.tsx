"use client"

import { motion } from "framer-motion"
import { TrendingUp } from "lucide-react"

export function SuccessGauge() {
  const percentage = 78

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="rounded-3xl bg-card p-6 shadow-sm border border-border"
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-foreground">Success Rate</h3>
        <div className="flex items-center gap-1 rounded-full bg-[#009640]/10 px-2 py-1 text-xs font-semibold text-[#009640]">
          <TrendingUp className="h-3 w-3" />
          +5%
        </div>
      </div>

      {/* Gauge */}
      <div className="relative mx-auto h-40 w-40">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="currentColor"
            strokeWidth="12"
            className="text-muted"
          />
          {/* Progress circle */}
          <motion.circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#009640"
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 40}`}
            initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
            animate={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - percentage / 100) }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
          />
        </svg>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="text-4xl font-black text-[#009640]"
          >
            {percentage}%
          </motion.span>
          <span className="text-sm text-muted-foreground">Overall</span>
        </div>
      </div>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Attack efficiency across all analyzed plays
      </p>
    </motion.div>
  )
}
