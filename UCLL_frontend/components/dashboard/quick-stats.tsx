"use client"

import { motion } from "framer-motion"
import { Users, Footprints, Timer, Goal } from "lucide-react"

const stats = [
  {
    label: "Squad Fitness",
    value: "94%",
    icon: Users,
    color: "#009640",
    bgColor: "bg-[#009640]/10",
  },
  {
    label: "Avg. Distance",
    value: "10.8km",
    icon: Footprints,
    color: "#E20613",
    bgColor: "bg-[#E20613]/10",
  },
  {
    label: "Time in Final Third",
    value: "38%",
    icon: Timer,
    color: "#009640",
    bgColor: "bg-[#009640]/10",
  },
  {
    label: "xG Created",
    value: "2.4",
    icon: Goal,
    color: "#E20613",
    bgColor: "bg-[#E20613]/10",
  },
]

export function QuickStats() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.6 + i * 0.1 }}
          className="rounded-3xl bg-card p-4 shadow-sm border border-border"
        >
          <div className={`mb-3 inline-flex rounded-2xl ${stat.bgColor} p-2.5`}>
            <stat.icon className="h-5 w-5" style={{ color: stat.color }} />
          </div>
          <p className="text-2xl font-black text-foreground">{stat.value}</p>
          <p className="text-sm text-muted-foreground">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  )
}
