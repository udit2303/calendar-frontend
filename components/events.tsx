import { useState } from 'react'
import { Layout } from '../components/layout'
import { EventList } from '../components/event-list'
import { EventForm } from '../components/event-form'
import { Event } from '../types'

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  const handleEventCreate = (event: Event) => {
    setEvents([...events, event])
    setEditingEvent(null)
  }

  const handleEventEdit = (updatedEvent: Event) => {
    setEvents(events.map((event) => (event.id === updatedEvent.id ? updatedEvent : event)))
    setEditingEvent(null)
  }

  const handleEventDelete = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId))
  }

  return (
    <Layout>
      <div className="flex h-full">
        <div className="w-2/3 pr-4">
          <EventList
            events={events}
            onEventEdit={setEditingEvent}
            onEventDelete={handleEventDelete}
          />
        </div>
        <div className="w-1/3">
          <EventForm
            event={editingEvent}
            onSubmit={editingEvent ? handleEventEdit : handleEventCreate}
            onDelete={editingEvent ? () => handleEventDelete(editingEvent.id) : undefined}
            onCancel={() => setEditingEvent(null)}
          />
        </div>
      </div>
    </Layout>
  )
}

