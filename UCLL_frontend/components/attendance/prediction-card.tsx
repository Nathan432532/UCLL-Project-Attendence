"use client"

import { motion } from "framer-motion"
import { Users, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"

interface PredictionCardProps {
  isPinkMode?: boolean
  predictedAttendance: number
  actualAttendance?: number
  matchName: string
  trendPct?: number
}

export function PredictionCard({
  isPinkMode = false,
  predictedAttendance,
  actualAttendance,
  matchName,
  trendPct,
}: PredictionCardProps) {
  const primaryColor = isPinkMode ? "#FF69B4" : "#E20613"
  const secondaryColor = isPinkMode ? "#FFB6C1" : "#009640"
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <Card 
        className="relative overflow-hidden rounded-3xl border-0 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:bg-gray-900/80"
        style={{
          boxShadow: isPinkMode 
            ? "0 0 30px rgba(255, 105, 180, 0.3)" 
            : undefined
        }}
      >
        {/* Glowing border effect */}
        <motion.div 
          className="pointer-events-none absolute inset-0 rounded-3xl border"
          animate={{
            borderColor: isPinkMode 
              ? "rgba(255, 105, 180, 0.5)" 
              : "rgba(226, 6, 19, 0.3)"
          }}
          transition={{ duration: 0.5 }}
        />
        
        <div className="mb-4 flex items-center gap-3">
          <motion.div 
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            animate={{
              background: isPinkMode 
                ? "linear-gradient(to bottom right, #FF69B4, #FFB6C1)" 
                : "linear-gradient(to bottom right, #E20613, #ff4d4d)"
            }}
            transition={{ duration: 0.5 }}
          >
            <Users className="h-6 w-6 text-white" />
          </motion.div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Predicted Attendance</h3>
            <p className="text-xs text-muted-foreground/70">Next Home Match</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs text-muted-foreground">Next Home Match</p>
          <p className="text-lg font-semibold text-foreground">{matchName}</p>
        </div>

        <div className="mb-4 flex items-baseline gap-2">
          <motion.span
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="text-5xl font-black text-foreground"
          >
            {predictedAttendance.toLocaleString()}
          </motion.span>
          <span className="text-lg font-medium text-muted-foreground">fans</span>
        </div>

        <motion.div 
          className="mb-2"
        >
          <p className="text-xs text-muted-foreground">
            Actual real attendance: {actualAttendance ? actualAttendance.toLocaleString() : "N/A"}
          </p>
        </motion.div>

        <motion.div 
          className="flex items-center gap-2 rounded-2xl px-3 py-2"
          animate={{
            backgroundColor: isPinkMode 
              ? "rgba(255, 182, 193, 0.2)" 
              : "rgba(0, 150, 64, 0.1)"
          }}
          transition={{ duration: 0.5 }}
        >
          <TrendingUp className="h-4 w-4" style={{ color: secondaryColor }} />
          <span className="text-sm font-semibold" style={{ color: secondaryColor }}>
            {trendPct === undefined ? "Loading trend..." : `${trendPct >= 0 ? '+' : ''}${trendPct}% vs last match`}
          </span>
        </motion.div>
      </Card>
    </motion.div>
  )
}
