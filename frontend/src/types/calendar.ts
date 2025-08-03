export type RepeatType = 'none' | 'daily' | 'weekly' | 'weekdays' | 'monthly' | 'yearly' | 'custom';
export type PriorityType = 'low' | 'medium' | 'high';
export type CategoryType = 'study' | 'exam' | 'project' | 'homework' | 'lab' | 'language' | 'reading' | 'other';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  text: string;
  createdAt: string;
  userId: string;
}

export interface CalendarEvent {
  id?: string;  // oluştururken opsiyonel
  summary: string;
  description: string;
  start_time: string;  // ISO datetime string
  end_time: string;    // ISO datetime string
}
export interface CalendarEventUpdate {
  summary?: string;
  description?: string;
  start_time?: string;
  end_time?: string;
}

export interface CalendarTask {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  category: string;
  priority: string;
  tags: string[];
  repeat: any | null;
  subtasks: any[];
  comments: any[];
  completed: boolean;


  calendar_event_id?: string;  
}

export interface TaskDetailType {
  title: string;
  description: string;
  category: CategoryType;
  tags: string[];
  lesson: string;
  date: string;       // YYYY-MM-DD
  time: string;       // HH:mm
  repeat: RepeatType;
  customRepeat?: string;
  subtasks: Subtask[];
  comments: Comment[];
  priority: PriorityType;
}