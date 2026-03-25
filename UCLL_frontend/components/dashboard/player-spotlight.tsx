"use client"

import { motion } from "framer-motion"
import { Star, Zap, Target, TrendingUp } from "lucide-react"

export function PlayerSpotlight() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card to-muted p-6 shadow-sm border border-border"
    >
      {/* Glow effect */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[#E20613]/20 blur-3xl"
      />

      <div className="relative">
        <div className="mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 fill-[#E20613] text-[#E20613]" />
          <h3 className="text-lg font-bold text-foreground">Player of the Data Pack</h3>
        </div>

        <div className="flex items-center gap-4">
          {/* Player Avatar Placeholder */}
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 0 0 rgba(226,6,19,0.4)",
                "0 0 0 15px rgba(226,6,19,0)",
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#E20613] to-[#c00510] text-3xl font-black text-white shadow-lg"
          >
            #10
          </motion.div>

          <div className="flex-1">
            <h4 className="text-xl font-black text-foreground">M. Mendez</h4>
            <p className="text-sm text-muted-foreground">Attacking Midfielder</p>
            
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="flex items-center gap-1 rounded-full bg-[#009640]/10 px-3 py-1 text-xs font-semibold text-[#009640]">
                <Target className="h-3 w-3" />
                3 Key Passes
              </span>
              <span className="flex items-center gap-1 rounded-full bg-[#E20613]/10 px-3 py-1 text-xs font-semibold text-[#E20613]">
                <Zap className="h-3 w-3" />
                92% Duel Win
              </span>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: "Rating", value: "8.7", icon: Star },
            { label: "Distance", value: "11.2km", icon: TrendingUp },
            { label: "Sprints", value: "24", icon: Zap },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="rounded-2xl bg-background/80 p-3 text-center backdrop-blur-sm"
            >
              <stat.icon className="mx-auto mb-1 h-4 w-4 text-muted-foreground" />
              <p className="text-lg font-black text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
