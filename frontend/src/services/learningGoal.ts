import { api } from './auth';
import type { LearningGoalCreate, LearningGoalResponse, LearningGoal } from '../types/learningGoal';

export async function createLearningGoal(data: LearningGoalCreate): Promise<LearningGoalResponse> {
  const response = await api.post('/ai/set-goal', data);
  return response.data;
}

export async function getAllLearningGoals(): Promise<LearningGoal[]> {
  const response = await api.get('/ai/goals');
  return response.data;
}

export async function updateLearningGoal(goalId: number, data: LearningGoalCreate): Promise<LearningGoalResponse> {
  const response = await api.put(`/ai/goals/${goalId}`, data);
  return response.data;
}

export async function deleteLearningGoal(goalId: number): Promise<void> {
  await api.delete(`/ai/goals/${goalId}`);
}

export async function getModulesByGoal(goalId: number) {
  const response = await api.get(`/ai/goals/${goalId}/modules`);
  return response.data;
}

export async function generateModules(goalId: number) {
  const response = await api.post('/ai/generate-modules', null, {
    params: { goal_id: goalId }
  });
  return response.data;
}
