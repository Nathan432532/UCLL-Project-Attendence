"use client"

import { motion } from "framer-motion"
import { ChevronRight, Filter, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const categories = [
  { name: "Attacking", color: "bg-[#E20613]" },
  { name: "Defensive", color: "bg-[#009640]" },
  { name: "Physical", color: "bg-black" },
  { name: "Tactical", color: "bg-[#E20613]" },
]

const data = [
  {
    metric: "Goals Scored",
    value: "3",
    change: "+2",
    category: "Attacking",
    trend: "up",
  },
  {
    metric: "Tackles Won",
    value: "18",
    change: "+5",
    category: "Defensive",
    trend: "up",
  },
  {
    metric: "Possession",
    value: "58%",
    change: "+3%",
    category: "Tactical",
    trend: "up",
  },
  {
    metric: "Sprints",
    value: "156",
    change: "-12",
    category: "Physical",
    trend: "down",
  },
  {
    metric: "Interceptions",
    value: "12",
    change: "+4",
    category: "Defensive",
    trend: "up",
  },
  {
    metric: "Shots on Target",
    value: "7",
    change: "+3",
    category: "Attacking",
    trend: "up",
  },
]

export function DeepDiveTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="rounded-3xl bg-card p-6 shadow-sm border border-border"
    >
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h3 className="text-xl font-bold text-foreground">Deep Dive Analytics</h3>
        
        <div className="flex gap-2">
          <div className="relative flex-1 sm:w-64 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search metrics..."
              className="h-10 rounded-full border-border pl-9"
            />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 shrink-0 rounded-full">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Category pills */}
      <div className="mb-4 flex flex-wrap gap-2">
        <button className="rounded-full bg-foreground px-4 py-1.5 text-sm font-semibold text-background transition-colors">
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.name}
            className="flex items-center gap-2 rounded-full bg-muted px-4 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted/80"
          >
            <span className={`h-2 w-2 rounded-full ${cat.color}`} />
            {cat.name}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="space-y-2">
        {data.map((row, i) => (
          <motion.div
            key={row.metric}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 + i * 0.05 }}
            className="group flex items-center justify-between rounded-2xl bg-muted/50 p-4 transition-colors hover:bg-muted"
          >
            <div className="flex items-center gap-3">
              <span
                className={`h-3 w-3 rounded-full ${
                  categories.find((c) => c.name === row.category)?.color
                }`}
              />
              <span className="font-semibold text-foreground">{row.metric}</span>
              <span className="hidden rounded-full bg-background px-2 py-0.5 text-xs text-muted-foreground sm:inline">
                {row.category}
              </span>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-lg font-black text-foreground">{row.value}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                  row.trend === "up"
                    ? "bg-[#009640]/10 text-[#009640]"
                    : "bg-[#E20613]/10 text-[#E20613]"
                }`}
              >
                {row.change}
              </span>
              <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
