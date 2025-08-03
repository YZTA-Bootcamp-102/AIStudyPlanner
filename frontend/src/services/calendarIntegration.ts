import type { CalendarEvent, CalendarEventUpdate } from '../types/calendar';
import { api } from './auth'; 

// Yeni bir etkinlik oluştur
export async function createCalendarEvent(event: CalendarEvent) {
  const payload = {
    ...event,
    start_time: new Date(event.start_time).toISOString(),
    end_time: new Date(event.end_time).toISOString(),
  };

  const response = await api.post('/calendar/create-event', payload);
  return response.data;
}

// Etkinlikleri listele
export async function listCalendarEvents(
  maxResults: number = 10,
  startDate?: Date,
  endDate?: Date
) {
  const params: any = { max_results: maxResults };
  if (startDate) params.start_date = startDate.toISOString();
  if (endDate) params.end_date = endDate.toISOString();

  const response = await api.get('/calendar/list-events', { params });
  return response.data;
}

// Etkinlik güncelle
export async function updateCalendarEvent(eventId: string, updateData: CalendarEventUpdate) {
  const payload: any = {};
  if (updateData.summary) payload.summary = updateData.summary;
  if (updateData.description) payload.description = updateData.description;
  if (updateData.start_time) payload.start_time = new Date(updateData.start_time).toISOString();
  if (updateData.end_time) payload.end_time = new Date(updateData.end_time).toISOString();

  const response = await api.put(`/calendar/update-event/${eventId}`, payload);
  return response.data;
}

// Etkinlik sil
export async function deleteCalendarEvent(eventId: string) {
  const response = await api.delete(`/calendar/delete-event/${eventId}`);
  return response.data;
}
