import React, { useState, useEffect } from 'react'
import { format, addMonths, subMonths, startOfWeek, endOfWeek, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react'
import { Event } from '../types'
import { Button } from '@/components/ui/button'
import { motion, AnimatePresence } from 'framer-motion'
import { EventPopup } from './EventPopup'
import { eventHelper } from '@/components/utils/eventHelper'
import { ScrollArea } from "@/components/ui/scroll-area"

interface CalendarGridProps {
  currentDate: Date
  setCurrentDate: (date: Date) => void
}

export function CalendarGrid({ currentDate, setCurrentDate }: CalendarGridProps) {
  const [direction, setDirection] = useState(0)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [events, setEvents] = useState<Event[]>([])

  useEffect(() => {
    loadEvents()
  }, [currentDate])

  const loadEvents = async () => {
    try {
      const loadedEvents = await eventHelper.getEventsByMonth(currentDate.getMonth() + 1, currentDate.getFullYear())
      setEvents(loadedEvents)
    } catch (error) {
      console.error('Failed to load events:', error)
    }
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(monthStart)
  const startDate = startOfWeek(monthStart)
  const endDate = endOfWeek(monthEnd)

  const dateRange = eachDayOfInterval({ start: startDate, end: endDate })

  const getEventsForDay = (day: Date) => {
    return events
      .filter((event) => isSameDay(new Date(event.date), day))
      .sort((a, b) => a.time.localeCompare(b.time));
  }

  const goToPreviousMonth = () => {
    setDirection(-1)
    setCurrentDate(subMonths(currentDate, 1))
  }

  const goToNextMonth = () => {
    setDirection(1)
    setCurrentDate(addMonths(currentDate, 1))
  }

  const goToToday = () => {
    setDirection(0)
    setCurrentDate(new Date())
  }

  const handleDateClick = (date: Date) => {
    setSelectedDate(date)
    setSelectedEvent(null)
  }

  const handleEventClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedDate(new Date(event.date))
    setSelectedEvent(event)
  }

  const handleClosePopup = () => {
    setSelectedDate(null)
    setSelectedEvent(null)
  }

  const handleSaveEvent = async (event: Omit<Event, 'id'>) => {
    try {
      if (selectedEvent) {
        await eventHelper.updateEvent({ ...event, id: selectedEvent.id })
      } else {
        await eventHelper.addEvent(event)
      }
      await loadEvents()
      handleClosePopup()
    } catch (error) {
      console.error('Failed to save event:', error)
    }
  }

  const handleDeleteEvent = async () => {
    if (selectedEvent) {
      try {
        await eventHelper.deleteEvent(selectedEvent.id)
        await loadEvents()
        handleClosePopup()
      } catch (error) {
        console.error('Failed to delete event:', error)
      }
    }
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '30%' : '-30%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '30%' : '-30%',
      opacity: 0,
    }),
  }
  return (
    <div className="h-full flex flex-col px-0.5 md:px-2">
      <div className="flex justify-between items-center mb-2 px-1 md:px-2 py-1">
        <h2 className="text-base md:text-2xl font-bold">{format(currentDate, 'MMMM yyyy')}</h2>
        <div className="flex space-x-0.5 md:space-x-1">
          <Button onClick={goToToday} size="sm" variant="outline" className="text-[10px] md:text-xs px-1 py-0.5">Today</Button>
          <Button onClick={goToPreviousMonth} size="icon" variant="ghost" className="h-6 w-6 md:h-8 md:w-8">
            <ChevronLeft className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
          <Button onClick={goToNextMonth} size="icon" variant="ghost" className="h-6 w-6 md:h-8 md:w-8">
            <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentDate.toISOString()}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="grid grid-cols-7 gap-0.5 md:gap-1 h-full"
          >
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="font-medium text-center p-2 text-sm hidden md:block">
                {day}
              </div>
            ))}
            {dateRange.map((day) => (
              <motion.div
                key={day.toISOString()}
                className={`p-1 md:p-2 overflow-hidden bg-background rounded-lg border ${
                  !isSameMonth(day, currentDate) ? 'text-muted-foreground bg-muted/20' : ''
                } ${isToday(day) ? 'bg-primary/10 font-bold' : ''}
                ${selectedDate && isSameDay(day, selectedDate) ? 'ring-2 ring-primary' : ''}`}
                whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
                onClick={() => handleDateClick(day)}
              >
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-center">
                    <span className="text-xs md:text-sm font-medium">{format(day, 'd')}</span>
                    <span className="text-[10px] md:text-xs text-muted-foreground hidden md:inline">{format(day, 'EEE')}</span>
                  </div>
                  <ScrollArea className="h-[calc(100%-1.5rem)] mt-1">
                    <div className="space-y-0.5 h-[4.5rem]">
                      {getEventsForDay(day).map((event) => (
                        <motion.div
                          key={event.id}
                          className="text-[8px] md:text-xs bg-secondary p-0.5 rounded cursor-pointer"
                          whileHover={{ scale: 1.02 }}
                          onClick={(e) => handleEventClick(event, e)}
                        >
                          <div className="font-medium truncate">{event.title}</div>
                          <div className="text-[7px] md:text-[10px] text-muted-foreground">
                            {event.time.slice(0, 5)} - {event.endTime.slice(0, 5)}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
      {selectedDate && (
        <EventPopup
          selectedDate={selectedDate}
          event={selectedEvent}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onClose={handleClosePopup}
        />
      )}
    </div>
  )
}
