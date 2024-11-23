import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Event } from '../types'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'

interface EventFormProps {
  event: Event 
  onSubmit: (event: Event) => void
  onDelete?: () => void
  onCancel: () => void
}

export function EventForm({ event, onSubmit, onDelete, onCancel }: EventFormProps) {
  const [title, setTitle] = useState(event.title)
  const [date, setDate] = useState(event.date.toISOString().split('T')[0])
  const [time, setTime] = useState(event.time)
  const [description, setDescription] = useState(event.description)

  useEffect(() => {
    setTitle(event.title)
    setDate(new Date(event.date).toISOString().split('T')[0])
    setTime(event.time)
    setDescription(event.description)
  }, [event])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: event.id,
      title,
      date: new Date(date),
      time,
      description,
      endTime: ''
    })
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event.id ? 'Edit Event' : 'Create Event'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <Input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
          />
          <Textarea
            placeholder="Event Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            {event.id && onDelete && (
              <Button type="button" variant="destructive" onClick={onDelete}>
                Delete
              </Button>
            )}
            <Button type="submit">{event.id ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

