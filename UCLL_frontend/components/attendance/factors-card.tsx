"use client"

import React from "react"
import { motion } from "framer-motion"
import { Cloud, Trophy, Ticket, Calendar, Clock, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"

interface FactorItem {
  icon?: typeof Cloud
  label: string
  value: string
  detail: string
  impact: "positive" | "neutral" | "negative"
}

interface FactorsCardProps {
  isPinkMode?: boolean
  factors: FactorItem[]
}

export function FactorsCard({ isPinkMode = false, factors }: FactorsCardProps) {
  const impactColors = {
    positive: isPinkMode 
      ? "bg-[#FFB6C1]/20 text-[#FF69B4]" 
      : "bg-[#009640]/10 text-[#009640] dark:bg-[#009640]/20",
    neutral: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
    negative: isPinkMode 
      ? "bg-[#FF69B4]/20 text-[#FF69B4]" 
      : "bg-[#E20613]/10 text-[#E20613] dark:bg-[#E20613]/20",
  }

  const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
    "Weather": Cloud,
    "Opponent Tier": Trophy,
    "Ticket Sales": Ticket,
    "Date": Calendar,
    "Big 6": MapPin,
    "Home Form": Clock,
    "Venue": MapPin,
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      <Card 
        className="relative overflow-hidden rounded-3xl border-0 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:bg-gray-900/80"
        style={{
          boxShadow: isPinkMode 
            ? "0 0 30px rgba(255, 182, 193, 0.3)" 
            : undefined
        }}
      >
        <motion.div 
          className="pointer-events-none absolute inset-0 rounded-3xl border"
          animate={{
            borderColor: isPinkMode 
              ? "rgba(255, 182, 193, 0.5)" 
              : "rgba(0, 150, 64, 0.3)"
          }}
          transition={{ duration: 0.5 }}
        />
        
        <h3 className="mb-4 text-lg font-bold text-foreground">Prediction Factors</h3>
        
        <div className="grid gap-3">
          {factors.map((factor, index) => {
            const Icon = iconMap[factor.label] || Cloud
            return (
              <motion.div
                key={`${factor.label}-${index}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex items-center gap-3 rounded-2xl bg-muted/50 p-3 transition-colors hover:bg-muted dark:bg-white/5 dark:hover:bg-white/10"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${impactColors[factor.impact as keyof typeof impactColors]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">{factor.label}</p>
                  <p className="truncate font-semibold text-foreground">{factor.value}</p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">{factor.detail}</span>
              </motion.div>
            )
          })}
        </div>
      </Card>
    </motion.div>
  )
}
