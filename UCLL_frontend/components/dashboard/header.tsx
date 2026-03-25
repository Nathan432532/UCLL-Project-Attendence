"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Moon, Sun, Zap } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"

export function Header() {
  const [matchDayMode, setMatchDayMode] = useState(false)

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex items-center justify-between px-4 py-4 md:px-8"
    >
      <div className="flex items-center gap-4">
        <Image
          src="/images/oh-leuven-logo.png"
          alt="OH Leuven"
          width={180}
          height={60}
          className="h-10 w-auto md:h-14"
          priority
        />
      </div>

      <div className="flex items-center gap-3">
        {/* Live Status Indicator */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="hidden items-center gap-2 rounded-full bg-[#009640]/10 px-4 py-2 md:flex"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="h-2 w-2 rounded-full bg-[#009640]"
          />
          <span className="text-sm font-semibold text-[#009640]">
            Data Pack Loaded & Analyzed
          </span>
        </motion.div>

        {/* Match Day Toggle */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="flex items-center gap-2 rounded-full bg-card px-4 py-2 shadow-sm border border-border"
        >
          <Sun className="h-4 w-4 text-muted-foreground" />
          <Switch
            checked={matchDayMode}
            onCheckedChange={setMatchDayMode}
            className="data-[state=checked]:bg-[#E20613]"
          />
          <Zap className={`h-4 w-4 transition-colors ${matchDayMode ? "text-[#E20613]" : "text-muted-foreground"}`} />
          <span className="hidden text-sm font-semibold sm:inline">
            Match Day
          </span>
        </motion.div>
      </div>
    </motion.header>
  )
}
