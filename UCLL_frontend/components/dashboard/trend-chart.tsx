"use client"

import { motion } from "framer-motion"
import { Activity } from "lucide-react"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

const data = [
  { name: "10'", intensity: 45, possession: 52 },
  { name: "20'", intensity: 62, possession: 58 },
  { name: "30'", intensity: 78, possession: 55 },
  { name: "40'", intensity: 55, possession: 61 },
  { name: "50'", intensity: 82, possession: 63 },
  { name: "60'", intensity: 91, possession: 58 },
  { name: "70'", intensity: 73, possession: 52 },
  { name: "80'", intensity: 85, possession: 48 },
  { name: "90'", intensity: 68, possession: 51 },
]

export function TrendChart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="rounded-3xl bg-card p-6 shadow-sm border border-border"
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-[#E20613]" />
          <h3 className="text-lg font-bold text-foreground">Match Intensity</h3>
        </div>
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#E20613]" />
            Intensity
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-[#009640]" />
            Possession
          </span>
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="redGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#E20613" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#E20613" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#009640" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#009640" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12, fill: '#888' }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12, fill: '#888' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                padding: '12px',
              }}
              labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
            />
            <Area
              type="monotone"
              dataKey="intensity"
              stroke="#E20613"
              strokeWidth={3}
              fill="url(#redGradient)"
            />
            <Area
              type="monotone"
              dataKey="possession"
              stroke="#009640"
              strokeWidth={3}
              fill="url(#greenGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
