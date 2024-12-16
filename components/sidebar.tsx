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
  isSidebarOpen: boolean
  setIsSidebarOpen: (isOpen: boolean) => void
}

export function Sidebar({ onDateSelect, currentDate, setCurrentDate, selectedDate, isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const dateRange = eachDayOfInterval({ start: startDate, end: endDate })

  const goToPreviousMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const goToNextMonth = () => setCurrentDate(addMonths(currentDate, 1))

  return (
    <motion.div 
      className={`bg-background p-4 flex flex-col h-full border-r transition-all duration-300 ${
        isSidebarOpen ? 'w-64' : 'w-0'
      }`}
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Button 
        className="fixed top-20 left-4 z-50 md:hidden" 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
      </Button>
      {isSidebarOpen && (
        <>
          <div className="relative mb-4">
            <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search for people"
              className="pl-8"
            />
          </div>
          <Button variant="outline" className="mb-6">
            <UserPlus className="mr-2 h-4 w-4" />
            Add person
          </Button>
          <div className="bg-muted rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold text-sm md:text-lg">{format(currentDate, 'MMMM yyyy')}</span>
              <div className="flex space-x-1">
                <Button onClick={goToPreviousMonth} size="icon" variant="ghost" className="h-6 w-6 md:h-8 md:w-8">
                  <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
                <Button onClick={goToNextMonth} size="icon" variant="ghost" className="h-6 w-6 md:h-8 md:w-8">
                  <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1">
              {['Sun', 'Mon', 'Tues', 'Weds', 'Thurs', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-xs font-semibold text-muted-foreground">
                  {day.slice(0,1)}
                </div>
              ))}
              {dateRange.map((day) => (
                <motion.div
                  key={day.toISOString()}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div
                    className={`flex items-center justify-center h-6 w-6 rounded-full cursor-pointer transition-all duration-200 text-xs ${
                      isSameMonth(day, currentDate) ? '' : 'text-muted-foreground'
                    } ${isToday(day) ? 'bg-primary/20 text-primary font-bold ring-1 ring-primary' : ''}
                    ${selectedDate && isSameDay(day, selectedDate) ? 'bg-secondary text-secondary-foreground font-bold' : ''}
                    hover:bg-secondary/50`}
                    onClick={() => onDateSelect(day)}
                  >
                    {format(day, 'd')}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      )}
    </motion.div>
  )
}

