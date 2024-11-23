import { Button } from '@/components/ui/button'
import { Event } from '../types'
import { format } from 'date-fns'

interface EventListProps {
  events: Event[]
  onEventEdit: (event: Event) => void
  onEventDelete: (eventId: string) => void
}

export function EventList({ events, onEventEdit, onEventDelete }: EventListProps) {
  return (
    <div className="space-y-4">
      {events.map((event) => (
        <div key={event.id} className="bg-card text-card-foreground rounded-lg shadow-md p-4">
          <h3 className="text-lg font-semibold">{event.title}</h3>
          <p className="text-sm text-muted-foreground">
            {format(new Date(event.date), 'MMMM d, yyyy')} at {event.time}
          </p>
          <p className="mt-2">{event.description}</p>
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onEventEdit(event)}>Edit</Button>
            <Button variant="destructive" onClick={() => onEventDelete(event.id)}>Delete</Button>
          </div>
        </div>
      ))}
      {events.length === 0 && (
        <p className="text-center text-muted-foreground">No events for this month.</p>
      )}
    </div>
  )
}

