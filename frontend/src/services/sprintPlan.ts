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
    weeks: {
      week_number: number;
      topics: string[];
      daily_minutes: number;
    }[];
  }
  

export interface SprintRequest {
  topic: string;
  level: string;
  daily_minutes: number;
  duration_weeks: number;
}

// Belirli bir hedef için sprint planı al
export async function getSprintPlanByGoal(goalId: number): Promise<SprintPlan> {
  const response = await api.get<SprintPlan>(`/sprint-plans/goal/${goalId}`);
  return response.data;
}



// Backend'e sprint planı AI ile oluşturması için POST isteği atan fonksiyon
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
