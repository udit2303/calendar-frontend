import React, { useState, useEffect } from 'react'
import { format, addMinutes, differenceInMinutes } from 'date-fns'
import { Clock, AlignLeft, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Event } from '../types'

interface EventPopupProps {
  selectedDate: Date;
  event: Event | null; // Change this to Event | null instead of Event | undefined
  onSave: (event: Omit<Event, 'id'>) => Promise<void>;
  onDelete: () => Promise<void>;
  onClose: () => void;
}

const timeOptions = Array.from({ length: 96 }, (_, i) => {
  const minutes = i * 15
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return format(new Date().setHours(hours, mins), 'hh:mm a')
})

export function EventPopup({ selectedDate, event, onSave, onDelete, onClose }: EventPopupProps) {
  const [title, setTitle] = useState(event?.title || '')
  const [startTime, setStartTime] = useState(event?.time || '09:00 AM')
  const [endTime, setEndTime] = useState(event?.endTime || '10:00 AM')
  const [description, setDescription] = useState(event?.description || '')

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setStartTime(event.time)
      setEndTime(event.endTime || addMinutes(new Date(`2000-01-01 ${event.time}`), 60).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
      setDescription(event.description)
    } else {
      setTitle('')
      setStartTime('09:00 AM')
      setEndTime('10:00 AM')
      setDescription('')
    }
  }, [event])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      title,
      date: selectedDate,
      time: startTime,
      endTime: endTime,
      description,
    })
  }

  const calculateDuration = () => {
    const start = new Date(`2000-01-01 ${startTime}`)
    const end = new Date(`2000-01-01 ${endTime}`)
    const diffMinutes = differenceInMinutes(end, start)
    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60
    return `${hours > 0 ? `${hours} hour${hours > 1 ? 's' : ''}` : ''}${minutes > 0 ? ` ${minutes} minute${minutes > 1 ? 's' : ''}` : ''}`
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{event ? 'Edit Event' : 'Add Event'}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <span className="sr-only">Close</span>
            X
          </Button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Add title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
            <div className="flex items-center space-x-2">
              <Calendar className="text-gray-500" />
              <span className="text-sm text-gray-700">{format(selectedDate, 'EEEE, d MMMM')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="text-gray-500" />
              <Select value={startTime} onValueChange={setStartTime}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Start time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>-</span>
              <Select value={endTime} onValueChange={setEndTime}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="End time" />
                </SelectTrigger>
                <SelectContent>
                  {timeOptions.map((time) => (
                    <SelectItem key={time} value={time}>{time}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-gray-500">
              Duration: {calculateDuration()}
            </div>
            <div className="flex items-center space-x-2">
              <AlignLeft className="text-gray-500" />
              <Textarea
                placeholder="Add description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
          <div className="flex justify-between mt-6">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <div>
              {event && onDelete && (
                <Button type="button" variant="destructive" onClick={onDelete} className="mr-2">
                  Delete
                </Button>
              )}
              <Button type="submit">{event ? 'Update' : 'Save'}</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

