import { api } from './auth';
import type { ChatResponse, StudyPlanRequest, StudyPlanResponse } from '../types/ai';
import type { LearningGoal,LearningGoalCreate,LearningGoalResponse, } from '../types/learningGoal';
import type { LearningModule, LearningModuleCreate,LearningModuleOut } from '../types/learningModule';


export async function createModule(moduleData: LearningModuleCreate): Promise<LearningModuleOut> {
  try {
    const response = await api.post<LearningModuleOut>('/ai', moduleData);
    return response.data;
  } catch (error) {
    console.error('Modül oluşturulurken hata:', error);
    throw error;
  }
}


/** -------------------- Chat Service -------------------- */

export async function sendMessageToAI(
  message: string
): Promise<ChatResponse> {
  try {
    const response = await api.post<ChatResponse>('/ai/chat', { message });
    return response.data;
  } catch (error: any) {
    console.error('AI mesaj gönderme hatası:', error);
    throw new Error(error?.response?.data?.detail || 'Yapay zekadan yanıt alınamadı.');
  }
}

/** -------------------- Study Plan Service -------------------- */
export async function generateStudyPlan(
  request: StudyPlanRequest
): Promise<StudyPlanResponse> {
  try {
    const response = await api.post<StudyPlanResponse>('/ai/generate-study-plan', request);
    return response.data;
  } catch (error: any) {
    console.error('Çalışma planı oluşturma hatası:', error);
    throw new Error(error?.response?.data?.detail || 'Çalışma planı AI tarafından oluşturulamadı.');
  }
}

/** -------------------- Goals Services -------------------- */
export async function setGoal(
  goal: LearningGoalCreate
): Promise<LearningGoal> {
  const response = await api.post<LearningGoal>('/ai/set-goal', goal);
  return response.data;
}

export async function listGoals(): Promise<LearningGoal[]> {
  const response = await api.get<LearningGoal[]>('/ai/goals');
  return response.data;
}

export async function getGoalDetail(goalId: number): Promise<LearningGoal> {
  const response = await api.get<LearningGoal>(`/ai/goals/${goalId}`);
  return response.data;
}

export async function updateGoal(
  goalId: number,
  goalData: LearningGoalCreate
): Promise<LearningGoal> {
  const response = await api.put<LearningGoal>(`/ai/goals/${goalId}`, goalData);
  return response.data;
}

export async function deleteGoal(goalId: number): Promise<void> {
  await api.delete(`/ai/goals/${goalId}`);
}

/** -------------------- Modules Services -------------------- */
export async function generateModules(goalId: number): Promise<LearningModule[]> {
  const response = await api.post<LearningModule[]>('/ai/generate-modules', null, {
    params: { goal_id: goalId },
  });
  return response.data;
}

export async function getModulesByGoal(goalId: number): Promise<LearningModule[]> {
  const response = await api.get<LearningModule[]>(`/ai/goals/${goalId}/modules`);
  return response.data;
}

export async function getModuleDetail(moduleId: number): Promise<LearningModule> {
  const response = await api.get<LearningModule>(`/ai/modules/${moduleId}`);
  return response.data;
}

export async function updateModule(moduleId: number, updatedData: Partial<LearningModuleCreate>) {
  const response = await api.put(`/ai/modules/${moduleId}`, updatedData);
  return response.data;
}



export async function deleteModule(moduleId: number): Promise<void> {
  await api.delete(`/ai/modules/${moduleId}`);
}