"use client"

import { motion } from "framer-motion"
import { Cloud, Trophy, Ticket, Calendar, Clock, MapPin } from "lucide-react"
import { Card } from "@/components/ui/card"

const factors = [
  {
    icon: Cloud,
    label: "Weather",
    value: "Partly Cloudy",
    detail: "14°C",
    impact: "positive",
  },
  {
    icon: Trophy,
    label: "Opponent Rank",
    value: "#4 in League",
    detail: "Club Brugge",
    impact: "positive",
  },
  {
    icon: Ticket,
    label: "Ticket Sales",
    value: "6,230 sold",
    detail: "74% of capacity",
    impact: "neutral",
  },
  {
    icon: Calendar,
    label: "Day",
    value: "Saturday",
    detail: "20:00 KO",
    impact: "positive",
  },
  {
    icon: Clock,
    label: "Season Phase",
    value: "Playoff Push",
    detail: "5 games left",
    impact: "positive",
  },
  {
    icon: MapPin,
    label: "Venue",
    value: "Den Dreef",
    detail: "Home advantage",
    impact: "positive",
  },
]

interface FactorsCardProps {
  isPinkMode?: boolean
}

export function FactorsCard({ isPinkMode = false }: FactorsCardProps) {
  const impactColors = {
    positive: isPinkMode 
      ? "bg-[#FFB6C1]/20 text-[#FF69B4]" 
      : "bg-[#009640]/10 text-[#009640] dark:bg-[#009640]/20",
    neutral: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400",
    negative: isPinkMode 
      ? "bg-[#FF69B4]/20 text-[#FF69B4]" 
      : "bg-[#E20613]/10 text-[#E20613] dark:bg-[#E20613]/20",
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
          {factors.map((factor, index) => (
            <motion.div
              key={factor.label}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className="flex items-center gap-3 rounded-2xl bg-muted/50 p-3 transition-colors hover:bg-muted dark:bg-white/5 dark:hover:bg-white/10"
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${impactColors[factor.impact as keyof typeof impactColors]}`}>
                <factor.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground">{factor.label}</p>
                <p className="truncate font-semibold text-foreground">{factor.value}</p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">{factor.detail}</span>
            </motion.div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
