import React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, UserPlus, ChevronLeft, ChevronRight } from 'lucide-react'
import { format, addMonths, subMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns'
import { motion } from 'framer-motion'

interface SidebarProps {
  onDateSelect: (date: Date) => void
  currentDate: Date
  setCurrentDate: (date: Date) => void
  selectedDate: Date
}

export function Sidebar({ onDateSelect, currentDate, setCurrentDate, selectedDate }: SidebarProps) {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const dateRange = eachDayOfInterval({ start: startDate, end: endDate })

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1))

  return (
    <motion.div 
      className="w-64 bg-background p-4 flex flex-col h-full border-r"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      
      <div className="bg-muted rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <span className="font text-lg">{format(currentDate, 'MMMM yyyy')}</span>
          <div className="flex space-x-1">
            <Button onClick={goToPreviousMonth} size="icon" variant="ghost" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button onClick={goToNextMonth} size="icon" variant="ghost" className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-muted-foreground">
              {day[0]}
            </div>
          ))}
          {dateRange.map((day) => (
            <motion.div
              key={day.toISOString()}
              whileTap={{ scale: 0.95 }}
            >
              <div
                className={`flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 ${
                  isSameMonth(day, currentDate) ? '' : 'text-muted-foreground'
                } ${isToday(day) ? 'bg-primary text-primary-foreground ring-2 ring-primary' : ''}
                ${selectedDate && isSameDay(day, selectedDate) ? 'bg-secondary text-secondary-foreground ' : ''}
                hover:bg-secondary`}
                onClick={() => onDateSelect(day)}
              >
                {format(day, 'd')}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

