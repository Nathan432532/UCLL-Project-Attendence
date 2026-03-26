"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface HistoryChartProps {
  isPinkMode?: boolean
  historyData: Array<{ match: string; actual: number; predicted: number }>
  modelAccuracy?: number
}

export function HistoryChart({ isPinkMode = false, historyData, modelAccuracy }: HistoryChartProps) {
  const data = historyData || []
  const primaryColor = isPinkMode ? "#FF69B4" : "#E20613"
  const secondaryColor = isPinkMode ? "#FFB6C1" : "#009640"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="h-full"
    >
      <Card 
        className="relative h-full overflow-hidden rounded-3xl border-0 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:bg-gray-900/80"
        style={{
          boxShadow: isPinkMode 
            ? "0 0 30px rgba(255, 105, 180, 0.3)" 
            : undefined
        }}
      >
        <motion.div 
          className="pointer-events-none absolute inset-0 rounded-3xl border"
          animate={{
            borderColor: isPinkMode 
              ? "rgba(255, 105, 180, 0.5)" 
              : "rgba(226, 6, 19, 0.3)"
          }}
          transition={{ duration: 0.5 }}
        />
        
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold text-foreground">Attendance History  over last {data.length} matches</h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: secondaryColor }} />
              <span className="text-muted-foreground">Actual</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: primaryColor }} />
              <span className="text-muted-foreground">Predicted</span>
            </div>
          </div>
        </div>
        
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historyData || []} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={secondaryColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={secondaryColor} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={primaryColor} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={primaryColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-border" opacity={0.3} />
              {/* Use local historyData passed from props */}

              <XAxis
                dataKey="match"
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                className="text-muted-foreground"
              />
              <YAxis
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${(value / 1000).toFixed(1)}k`}
                className="text-muted-foreground"
                // CHANGE THIS LINE:
                domain={['dataMin - 1000', 'dataMax + 1000']} 
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "16px",
                  border: "none",
                  boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                  padding: "12px 16px",
                }}
                labelStyle={{ fontWeight: 600, marginBottom: 4 }}
                formatter={(value: number, name: string) => [
                  `${value.toLocaleString()} fans`,
                  name === "actual" ? "Actual" : "Predicted",
                ]}
              />
              <Area
                type="monotone"
                dataKey="actual"
                stroke={secondaryColor}
                strokeWidth={2.5}
                fill="url(#actualGradient)"
                dot={{ fill: secondaryColor, strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, stroke: secondaryColor, strokeWidth: 2, fill: "white" }}
              />
              <Area
                type="monotone"
                dataKey="predicted"
                stroke={primaryColor}
                strokeWidth={2.5}
                strokeDasharray="5 5"
                fill="url(#predictedGradient)"
                dot={{ fill: primaryColor, strokeWidth: 0, r: 4 }}
                activeDot={{ r: 6, stroke: primaryColor, strokeWidth: 2, fill: "white" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <motion.div 
          className="mt-4 rounded-2xl p-3 text-center"
          animate={{
            backgroundColor: isPinkMode 
              ? "rgba(255, 182, 193, 0.1)" 
              : "rgba(0, 0, 0, 0.05)"
          }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-xs text-muted-foreground">
            Total Accuracy: <span className="font-bold" style={{ color: secondaryColor }}>
              {modelAccuracy ? `${modelAccuracy.toFixed(1)}%` : "--"}
            </span>
          </p>
        </motion.div>
      </Card>
    </motion.div>
  )
}
