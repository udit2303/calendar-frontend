import { Event } from '@/types'

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Team Meeting',
    date: new Date('2023-06-15'),
    time: '10:00 AM',
    endTime: '11:00 AM',
    description: 'Weekly team sync'
  },
  {
    id: '2',
    title: 'Project Deadline',
    date: new Date('2023-06-20'),
    time: '09:00 AM',
    endTime: '05:00 PM',
    description: 'Final submission for Project X'
  }
]

export const mockApi = {
  getEventsByMonth: (month: number, year: number, page: number = 1, pageSize: number = 10) => {
    const filteredEvents = mockEvents.filter(event => 
      event.date.getMonth() === month && event.date.getFullYear() === year
    )
    const totalPages = Math.ceil(filteredEvents.length / pageSize)
    const paginatedEvents = filteredEvents.slice((page - 1) * pageSize, page * pageSize)
    return Promise.resolve({ events: paginatedEvents, totalPages })
  },

  addEvent: (event: Omit<Event, 'id'>) => {
    const newEvent = { ...event, id: Date.now().toString() }
    mockEvents.push(newEvent)
    return Promise.resolve(newEvent)
  },

  updateEvent: (event: Event) => {
    const index = mockEvents.findIndex(e => e.id === event.id)
    if (index !== -1) {
      mockEvents[index] = event
    }
    return Promise.resolve(event)
  },

  deleteEvent: (id: string) => {
    const index = mockEvents.findIndex(e => e.id === id)
    if (index !== -1) {
      mockEvents.splice(index, 1)
    }
    return Promise.resolve()
  },

  getEventById: (id: string) => {
    const event = mockEvents.find(e => e.id === id)
    return Promise.resolve(event)
  }
}

