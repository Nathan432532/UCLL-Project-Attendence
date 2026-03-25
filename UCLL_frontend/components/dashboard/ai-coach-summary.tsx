"use client"

import { motion } from "framer-motion"
import { Bot, Sparkles } from "lucide-react"

export function AICoachSummary() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="relative"
    >
      {/* Speech bubble tail */}
      <div className="absolute -bottom-3 left-12 h-6 w-6 rotate-45 bg-gradient-to-br from-[#E20613] to-[#c00510] md:left-16" />
      
      {/* Main card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#E20613] to-[#c00510] p-6 text-white shadow-xl md:p-8">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-white" />
        </div>

        <div className="relative flex items-start gap-4">
          {/* AI Avatar */}
          <motion.div
            animate={{ 
              boxShadow: [
                "0 0 0 0 rgba(255,255,255,0.4)",
                "0 0 0 10px rgba(255,255,255,0)",
                "0 0 0 0 rgba(255,255,255,0)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm md:h-16 md:w-16"
          >
            <Bot className="h-7 w-7 md:h-8 md:w-8" />
          </motion.div>

          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <h2 className="text-lg font-bold md:text-xl">AI Coach&apos;s Summary</h2>
              <motion.div
                animate={{ rotate: [0, 15, -15, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Sparkles className="h-5 w-5" />
              </motion.div>
            </div>
            
            <p className="text-base leading-relaxed text-white/95 md:text-lg">
              The squad is performing <span className="font-bold">12% better</span> in high-press situations today! 
              Our midfield transitions have improved significantly, with <span className="font-bold">87% pass accuracy</span> in the final third. 🦁
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <motion.div
          animate={{ x: [0, 5, 0], y: [0, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute right-4 top-4 text-4xl opacity-20 md:text-5xl"
        >
          ⚽
        </motion.div>
      </div>
    </motion.div>
  )
}
