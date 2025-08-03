// Tekrar eden görev türleri
export type RepeatType = 'none' | 'daily' | 'weekly' | 'weekdays' | 'monthly' | 'yearly' | 'custom';

// Öncelik seviyeleri
export type PriorityType = 'low' | 'medium' | 'high';

// Kategoriler
export type CategoryType = 'study' | 'exam' | 'project' | 'homework' | 'lab' | 'language' | 'reading' | 'other';

// Alt görev tipi
export interface Subtask {
  text: string;
  done?: boolean;
}

// Not tipi
export interface Note {
  text: string;
}

// Yeni görev oluşturmak için gereken alanlar
export interface DailyTaskCreate {
  title: string;
  description?: string;
  date: string;           // "YYYY-MM-DD"
  start_time?: string;    // "HH:MM:SS" or ISO datetime
  duration_minutes?: number;
  learning_goal_id?: number;
  calendar_event_id?: string;
  category?: CategoryType;
  tags?: string[];
  repeat?: RepeatType;
  custom_repeat?: string;
  priority?: PriorityType;
  user_id: number;
  subtasks?: Subtask[];
  notes?: Note[];
}

// Görev güncelleme için tüm alanlar opsiyonel
export interface DailyTaskUpdate {
  title?: string;
  description?: string;
  date?: string;
  start_time?: string;
  duration_minutes?: number;
  is_completed?: boolean;
  learning_goal_id?: number;
  calendar_event_id?: string;
  category?: CategoryType;
  tags?: string[];
  repeat?: RepeatType;
  custom_repeat?: string;
  priority?: PriorityType;
  subtasks?: Subtask[];
  notes?: Note[];
}

// API'den dönen tam görev verisi
export interface DailyTaskOut {
  id: number;
  title: string;
  description?: string;
  date: string;
  start_time?: string;
  duration_minutes?: number;
  calendar_event_id?: string;
  learning_goal_id?: number;
  category?: string;
  tags: string[];
  repeat?: string;
  custom_repeat?: string;
  priority?: string;
  user_id: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  subtasks?: Subtask[];
  notes?: Note[];
}