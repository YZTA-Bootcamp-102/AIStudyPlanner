import type {
  DailyTaskCreate,
  DailyTaskUpdate,
  DailyTaskOut,
} from '../types/dailyTask';
import type { TaskDetailType } from '../components/tasks/TaskDetailModal'; // TaskDetailType tanımın varsa
import type { CategoryType, PriorityType, RepeatType, Subtask, Note } from '../types/dailyTask';
import { api } from './auth';

// Convert fonksiyonu
export function convertTaskDetailToBackend(updatedTask: TaskDetailType): DailyTaskUpdate {
  return {
    title: updatedTask.title,
    description: updatedTask.description,
    date: updatedTask.date,
    start_time: updatedTask.time ? `${updatedTask.time}:00` : undefined,
    duration_minutes: updatedTask.duration_minutes,
    category: updatedTask.category as CategoryType,
    tags: updatedTask.tags ?? [],
    repeat: updatedTask.repeat as RepeatType,
    custom_repeat: updatedTask.customRepeat ?? '',
    priority: updatedTask.priority as PriorityType,
    subtasks: (updatedTask.subtasks ?? []).map((st: Subtask) => ({
      text: st.text,
      done: st.done ?? false,
    })),
    notes: (updatedTask.notes ?? []).map((note: Note) => ({
      text: note.text,
    })),
    is_completed: updatedTask.is_completed,
    calendar_event_id: updatedTask.calendar_event_id || undefined,
    learning_goal_id: updatedTask.learning_goal_id || undefined,
  };
}


export async function createDailyTask(
  taskData: DailyTaskCreate
): Promise<DailyTaskOut> {
  const response = await api.post('/daily-tasks/', taskData);
  return response.data;
}

export async function getTodayDailyTasks(): Promise<DailyTaskOut[]> {
  const response = await api.get('/daily-tasks/');
  return response.data;
}

// updateDailyTask fonksiyonunu kullanırken convert fonksiyonunu çağıran yeni fonksiyon:
export async function updateTaskFromDetail(
  id: number,
  updatedTask: TaskDetailType
): Promise<DailyTaskOut> {
  const backendData = convertTaskDetailToBackend(updatedTask);
  const response = await api.put(`/daily-tasks/${id}`, backendData);
  return response.data;
}

export async function updateDailyTask(
  id: number,
  taskData: DailyTaskUpdate
): Promise<DailyTaskOut> {
  const response = await api.put(`/daily-tasks/${id}`, taskData);
  return response.data;
}

export async function deleteDailyTask(id: number): Promise<void> {
  await api.delete(`/daily-tasks/${id}`);
}

export async function completeDailyTask(id: number): Promise<DailyTaskOut> {
  const response = await api.post(`/daily-tasks/${id}/complete`);
  return response.data;
}

export async function getTasksByDate(date: string): Promise<DailyTaskOut[]> {
  const response = await api.get('/daily-tasks/by-date/', {
    params: { task_date: date },
  });
  return response.data;
}

export async function getCalendarTaskSummary(): Promise<Record<string, number>> {
  const response = await api.get('/daily-tasks/calendar-summary');
  return response.data;
}
