"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"

interface AddMatchFormProps {
  isPinkMode?: boolean
}

export function AddMatchForm({ isPinkMode = false }: AddMatchFormProps) {
  const [open, setOpen] = useState(false)
const [formData, setFormData] = useState({
  opponentTeam:     "",
  currentRound:     "",
  totalRounds:      "",
  opponentStanding: "",
  OHLStanding:      "",
})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // TODO: Replace with your actual API endpoint
      const response = await fetch("/api/matches", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      body: JSON.stringify({
        opponent:         formData.opponentTeam,
        currentRound:     formData.currentRound,
        totalRounds:      formData.totalRounds,
        opponentStanding: formData.opponentStanding,
        OHLStanding:      formData.OHLStanding,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add match")
      }

      // Reset form and close dialog
      setFormData({
        opponentTeam: "",
        currentRound: "",
        totalRounds: "",
        opponentStanding: "",
        OHLStanding: "",
      })
      setOpen(false)

      // TODO: Refresh model data or show success message
      console.log("Match added successfully")
    } catch (err) {
      console.error("Error adding match:", err)
      // TODO: Show error message to user
    } finally {
      setIsSubmitting(false)
    }
  }

  const accentColor = isPinkMode ? "#FF69B4" : "#E20613"

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative inline-flex h-10 items-center gap-2 rounded-full bg-white/20 px-4 backdrop-blur-md transition-all dark:bg-black/30 hover:bg-white/30 dark:hover:bg-black/40"
        >
          {/* Active indicator background */}
          <motion.div
            layoutId="add-match-indicator"
            className="absolute inset-0 rounded-full"
            style={{
              backgroundColor: `${accentColor}20`,
              opacity: 0,
            }}
            animate={{
              opacity: open ? 1 : 0,
            }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
          
          {/* Content */}
          <div className="relative z-10 flex items-center gap-2">
            <Plus className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">Add Match</span>
          </div>
        </motion.button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Match</DialogTitle>
          <DialogDescription>
            Enter the details for the upcoming match to predict attendance.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Opponent Team */}
          <div className="space-y-2">
            <Label htmlFor="opponentTeam">Opponent Team</Label>
            <Input
              id="opponentTeam"
              name="opponentTeam"
              placeholder="e.g., Club Brugge"
              value={formData.opponentTeam}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Current Round */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="currentRound">Current Round</Label>
              <Input
                id="currentRound"
                name="currentRound"
                type="number"
                placeholder="e.g., 15"
                value={formData.currentRound}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>

            {/* Total Rounds */}
            <div className="space-y-2">
              <Label htmlFor="totalRounds">Total Rounds</Label>
              <Input
                id="totalRounds"
                name="totalRounds"
                type="number"
                placeholder="e.g., 30"
                value={formData.totalRounds}
                onChange={handleInputChange}
                min="1"
                required
              />
            </div>
          </div>

          {/* Opponent Standing */}
          <div className="space-y-2">
            <Label htmlFor="opponentStanding">Opponent's Championship Standing</Label>
            <Input
              id="opponentStanding"
              name="opponentStanding"
              type="number"
              placeholder="e.g., 3 (for 3rd place)"
              value={formData.opponentStanding}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>

          {/* OHL Standing */}
          <div className="space-y-2">
            <Label htmlFor="OHLStanding">OHL's Championship Standing</Label>
            <Input
              id="OHLstanding"
              name="OHLStanding"
              type="number"
              placeholder="e.g., 1 (for 1st place)"
              value={formData.OHLStanding}
              onChange={handleInputChange}
              min="1"
              required
            />
          </div>

          {/* Submit Button */}
          <motion.div
            className="flex gap-3 pt-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancel
            </Button>
            <motion.button
              type="submit"
              disabled={isSubmitting}
              className="relative flex flex-1 items-center justify-center gap-2 rounded-md bg-white/10 px-4 py-2 font-medium text-white transition-all hover:bg-white/20 disabled:opacity-50 dark:bg-black/30 dark:hover:bg-black/40"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                backgroundColor: accentColor,
              }}
            >
              {isSubmitting ? "Adding..." : "Add Match"}
            </motion.button>
          </motion.div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
