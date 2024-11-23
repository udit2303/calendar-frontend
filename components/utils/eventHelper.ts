import { Event } from '@/types';

const API_BASE_URL = 'http://localhost:3000/api';

const getToken = (): string | null => typeof window !== 'undefined' ? localStorage.getItem('token') : null;

const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    if (response.status === 401 || response.status === 403) {
      window.location.href = '/login'; 
    }
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
};

// Event API functions
export const eventHelper = {
  getEventsByMonth: async (month: number, year: number): Promise<Event[]> => {
    const response = await fetch(`${API_BASE_URL}/events/month?month=${month}&year=${year}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return handleResponse(response);
  },

  getAllEvents: async (): Promise<Event[]> => {
    const response = await fetch(`${API_BASE_URL}/events`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return handleResponse(response);
  },

  addEvent: async (event: Omit<Event, 'id'>): Promise<Event> => {
    const response = await fetch(`${API_BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(event),
    });
    return handleResponse(response);
  },

  updateEvent: async (event: Event): Promise<Event> => {
    const response = await fetch(`${API_BASE_URL}/events/${event.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(event),
    });
    return handleResponse(response);
  },

  deleteEvent: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return handleResponse(response);
  },

  getEventById: async (id: string): Promise<Event> => {
    const response = await fetch(`${API_BASE_URL}/events/${id}`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`,
      },
    });
    return handleResponse(response);
  },
};
