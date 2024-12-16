import React, { useState, useEffect } from 'react'
import { Layout } from '../components/layout'
import { eventHelper } from '@/components/utils/eventHelper'
import { Event } from '../types'
import { format, parseISO } from 'date-fns'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/utils/authContext'
import { useRouter } from 'next/router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/')
    } else {
      loadEvents()
    }
  }, [user, router])

  const loadEvents = async () => {
    try {
      const allEvents = await eventHelper.getAllEvents()
      setEvents(allEvents)
    } catch (error) {
      console.error('Failed to load events:', error)
    }
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
      <div className="container mx-auto p-4 h-full">
        <h1 className="text-2xl font-bold mb-4">All Events</h1>
        <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
          <div className="space-y-4">
            {events.map((event) => (
              <Card key={event.id} className="bg-background shadow">
                <CardHeader>
                  <CardTitle>{event.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    {format(new Date(event.date), 'MMMM d, yyyy')} at {event.time}
                  </p>
                  <p className="mt-2">{event.description}</p>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button 
                      onClick={() => {
                        const formattedDate = format(new Date(event.date), 'yyyy-MM-dd')
                        router.push(`/calendar?date=${formattedDate}`)
                      }}
                      variant="outline"
                    >
                      View in Calendar
                    </Button>
                    <Button variant="destructive" onClick={() => handleDeleteEvent(event.id)}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>
    </Layout>
  )
}

