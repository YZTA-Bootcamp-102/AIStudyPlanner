export interface LearningModuleCreate {
  title: string;
  description: string;
  category: string;
  order: number;
  learning_outcome: string;
  progress?: number;
  learning_goal_id: number; 
}

export interface LearningModule extends LearningModuleCreate {
  id: number;
  progress: number;
  created_at?: string;
}
export interface LearningModuleOut {
  id: number;
  learning_goal_id: number;
  title: string;
  description: string;
  category: string;
  order: number;
  learning_outcome: string;
  user_id: number;
  progress: number;
  created_at: string;
}
