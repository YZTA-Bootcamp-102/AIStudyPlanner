import type { CalendarEvent, CalendarEventUpdate } from '../types/calendar';
import { api } from './auth'; 


export async function createCalendarEvent(event: CalendarEvent) {
  const response = await api.post('/calendar/create-event', event);
  return response.data;
}

export async function listCalendarEvents(
  maxResults: number = 10,
  startDate?: string,
  endDate?: string
) {
  const params: any = { max_results: maxResults };
  if (startDate) params.start_date = startDate;
  if (endDate) params.end_date = endDate;

  const response = await api.get('/calendar/list-events', { params });
  return response.data;
}

export async function updateCalendarEvent(eventId: string, updateData: CalendarEventUpdate) {
  const response = await api.put(`/calendar/update-event/${eventId}`, updateData);
  return response.data;
}

export async function deleteCalendarEvent(eventId: string) {
  const response = await api.delete(`/calendar/delete-event/${eventId}`);
  return response.data;
}
