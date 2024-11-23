import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Event } from '../types'
import { motion } from 'framer-motion'

interface EventModalProps {
  event?: Event | null
  isOpen: boolean
  onClose: () => void
  onSubmit: (event: Event) => void
  onDelete?: () => void
  selectedDate?: Date
}

export function EventModal({ event, isOpen, onClose, onSubmit, onDelete, selectedDate }: EventModalProps) {
  const [title, setTitle] = useState(event?.title || '')
  const [date, setDate] = useState(event?.date ? new Date(event.date).toISOString().split('T')[0] : selectedDate?.toISOString().split('T')[0] || '')
  const [time, setTime] = useState(event?.time || '')
  const [description, setDescription] = useState(event?.description || '')

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setDate(new Date(event.date).toISOString().split('T')[0])
      setTime(event.time)
      setDescription(event.description)
    } else if (selectedDate) {
      setDate(selectedDate.toISOString().split('T')[0])
      setTitle('')
      setTime('')
      setDescription('')
    }
  }, [event, selectedDate])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({
      id: event?.id || Date.now().toString(),
      title,
      date: new Date(date),
      time,
      description,
      endTime: ''
    })
    resetForm()
    onClose()
  }

  const resetForm = () => {
    setTitle('')
    setTime('')
    setDescription('')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Create Event'}</DialogTitle>
        </DialogHeader>
        <motion.form 
          onSubmit={handleSubmit} 
          className="space-y-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
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
          <div className="flex justify-between">
            <Button type="submit">{event ? 'Update Event' : 'Create Event'}</Button>
            {event && onDelete && (
              <Button type="button" variant="destructive" onClick={onDelete}>
                Delete Event
              </Button>
            )}
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </motion.form>
      </DialogContent>
    </Dialog>
  )
}

