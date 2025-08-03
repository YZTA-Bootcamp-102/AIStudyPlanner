import { api } from './auth';

export interface WeekPlan {
  week_number: number;
  topics: string[];
  daily_minutes: number;
}

export interface SprintPlan {
  id: number;
  learning_goal_id: number;
  duration_weeks: number;
  daily_minutes: number;
  start_date: string;
  end_date: string;
  objectives: string;
  weeks: WeekPlan[];
}

export interface SprintRequest {
  topic: string;
  level: string;
  daily_minutes: number;
  duration_weeks: number;
}

// 1. Sprint Planı Al
export async function getSprintPlanByGoal(goalId: number): Promise<SprintPlan> {
  const response = await api.get<SprintPlan>(`/sprint-plans/goal/${goalId}`);
  return response.data;
}

// 2. AI Sprint Planı Oluştur
export const createGeminiSprintPlan = async (
  goalId: number,
  sprintRequest: SprintRequest
): Promise<SprintPlan> => {
  const response = await api.post(
    `/sprint-plans/gemini-sprint-plan?goal_id=${goalId}`,
    sprintRequest
  );
  return response.data;
};

// 3. Sprint Planı Manuel Oluştur
export const createSprintPlan = async (
  plan: Omit<SprintPlan, 'id'>
): Promise<SprintPlan> => {
  const response = await api.post<SprintPlan>('/sprint-plans/', plan);
  return response.data;
};

// 4. Belirli Haftayı Getir
export const getWeeklySprint = async (
  planId: number,
  weekNumber: number
): Promise<WeekPlan> => {
  const response = await api.get<WeekPlan>(
    `/sprint-plans/sprint-progress/${planId}/week/${weekNumber}`
  );
  return response.data;
};

// 5. Belirli Görevi Tamamla
export const completeTask = async (
  planId: number,
  weekNumber: number,
  taskIndex: number
): Promise<{ message: string; task: string }> => {
  const response = await api.post(
    `/sprint-plans/sprint-progress/${planId}/week/${weekNumber}/complete-task`,
    null,
    { params: { task_index: taskIndex } }
  );
  return response.data;
};

// 6. Haftalık İlerlemeyi Al
export const getWeeklyProgress = async (
  planId: number,
  weekNumber: number
): Promise<{
  totalTasks: number;
  completedTasks: number;
  progressRate: number;
}> => {
  const response = await api.get(
    `/sprint-plans/sprint-progress/${planId}/week/${weekNumber}/progress`
  );
  return response.data;
};

// 7. Genel Sprint Özeti Al
export const getSprintSummary = async (
  planId: number
): Promise<{
  totalWeeks: number;
  totalTopics: number;
  completedTopics: number;
  completionRate: number;
}> => {
  const response = await api.get(
    `/sprint-plans/sprint-summary/${planId}`
  );
  return response.data;
};
