"use client";
import React, { useState, useEffect } from 'react'
import { Layout } from '@/components/layout'
import { eventHelper } from '@/components/utils/eventHelper'
import { Event } from '@/types'
import { format, parseISO, isFuture, isPast } from 'date-fns'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/utils/authContext'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Clock, MapPin, Filter } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [filterType, setFilterType] = useState('all')
  const [filterValue, setFilterValue] = useState('')
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/')
    } else {
      loadEvents()
    }
  }, [user, router])

  useEffect(() => {
    filterEvents()
  }, [events, filterType, filterValue])

  const loadEvents = async () => {
    try {
      const allEvents = await eventHelper.getAllEvents()
      setEvents(allEvents)
    } catch (error) {
      console.error('Failed to load events:', error)
    }
  }

  const filterEvents = () => {
    let filtered = [...events]
    const currentDate = new Date()

    switch (filterType) {
      case 'month':
        filtered = events.filter(event => {
          const eventDate = new Date(event.date)
          return eventDate.getMonth() === parseInt(filterValue) - 1
        })
        break
      case 'year':
        filtered = events.filter(event => {
          const eventDate = new Date(event.date)
          return eventDate.getFullYear() === parseInt(filterValue)
        })
        break
      case 'upcoming':
        filtered = events.filter(event => isFuture(new Date(event.date)))
        break
      case 'past':
        filtered = events.filter(event => isPast(new Date(event.date)))
        break
      default:
        break
    }

    setFilteredEvents(filtered)
  }

  const handleDeleteEvent = async (id: string) => {
    if (!id) {
      console.error('Event ID is missing');
      return;
    }
    try {
      await eventHelper.deleteEvent(id);
      setEvents(events.filter(event => event.id !== id));
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  }

  if (!user) {
    return null // or a loading spinner
  }

  return (
    <Layout>
      <div className="container mx-auto p-4 h-full max-w-7xl">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Events</h1>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filter
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Filter by</h4>
                  <Select defaultValue={filterType} onValueChange={(value) => setFilterType(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select filter type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Events</SelectItem>
                      <SelectItem value="month">By Month</SelectItem>
                      <SelectItem value="year">By Year</SelectItem>
                      <SelectItem value="upcoming">Upcoming</SelectItem>
                      <SelectItem value="past">Past</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {filterType === 'month' && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Select month</h4>
                    <Select onValueChange={(value) => setFilterValue(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                          <SelectItem key={month} value={month.toString()}>
                            {format(new Date(2000, month - 1, 1), 'MMMM')}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {filterType === 'year' && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Select year</h4>
                    <Select onValueChange={(value) => setFilterValue(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((event) => (
              <Card key={event.id} className="bg-background shadow hover:shadow-md transition-shadow">
                <CardHeader className="p-4">
                  <CardTitle className="text-lg line-clamp-1">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-center text-muted-foreground text-sm mb-1">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{format(new Date(event.date), 'MMM d, yyyy')}</span>
                  </div>
                  <div className="flex items-center text-muted-foreground text-sm mb-2">
                    <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{event.time} - {event.endTime}</span>
                  </div>
                  
                  <p className="text-sm mb-4 line-clamp-2">{event.description}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <div className="flex justify-end space-x-2 w-full">
                    <Button 
                      onClick={() => {
                        const formattedDate = format(new Date(event.date), 'yyyy-MM-dd')
                        router.push(`/calendar?date=${formattedDate}`)
                      }}
                      variant="outline"
                      size="sm"
                    >
                      View in Calendar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteEvent(event.id)}>
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Layout>
  )
}
