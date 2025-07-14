export type RepeatType = 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';
export type PriorityType = 'low' | 'medium' | 'high';
export type CategoryType = 'work' | 'personal' | 'meeting' | 'event' | 'other';

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

export interface CalendarTask {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  category: CategoryType;
  tags: string[];
  repeat: RepeatType;
  customRepeat?: string;
  subtasks: Subtask[];
  comments: Comment[];
  priority: PriorityType;
  completed: boolean;
} 