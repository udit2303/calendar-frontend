"use client";
import React, { useState, useEffect } from 'react'
import { Layout } from '@/components/layout'
import { eventHelper } from '@/components/utils/eventHelper'
import { Event } from '@/types'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/utils/authContext'
import { useRouter } from 'next/navigation'
import { Spinner } from '@/components/ui/spinner'

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { user, loading } = useAuth() 
  const router = useRouter()

  useEffect(() => {
    const checkAuthAndLoadEvents = async () => {
      if (loading) return; 
      if (user === null) {
        router.push('/') 
      } else {
        await loadEvents()
      }
      setIsLoading(false)
    }

    checkAuthAndLoadEvents()
  }, [user, loading, router])

  const loadEvents = async () => {
    try {
      const allEvents = await eventHelper.getAllEvents()
      setEvents(allEvents)
    } catch (error) {
      console.error('Failed to load events:', error)
    }
  }

  const handleDeleteEvent = async (id: string) => {
    try {
      await eventHelper.deleteEvent(id)
      setEvents(events.filter(event => event.id !== id))
    } catch (error) {
      console.error('Failed to delete event:', error)
    }
  }

  if (loading) {  
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <Spinner size="lg" />
        </div>
      </Layout>
    )
  }

  if (!user) {
    return null  
  }

  return (
    <Layout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">All Events</h1>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white shadow rounded-lg p-4">
              <h2 className="text-xl font-semibold">{event.title}</h2>
              <p className="text-gray-600">
                {format(new Date(event.date), 'MMMM d, yyyy')} at {event.time}
              </p>
              <p className="mt-2">{event.description}</p>
              <div className="mt-4 flex justify-end space-x-2">
              <Button 
                  onClick={() => {
                    const formattedDate = format(new Date(event.date), 'yyyy-MM-dd')
                    router.push(`/calendar?date=${formattedDate}`)
                  }}
                >
                  View in Calendar
                </Button>
                <Button variant="destructive" onClick={() => handleDeleteEvent(event.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
