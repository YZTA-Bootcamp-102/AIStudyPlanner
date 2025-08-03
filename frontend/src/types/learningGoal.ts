export interface LearningGoalCreate {
  goal_text: string;
  title?: string;  
  interest_areas: string;
  current_knowledge_level: string;
  start_date: string;        
  target_end_date: string;
  progress?: number; 
}

export interface LearningGoalResponse extends LearningGoalCreate {
  id: number;
  progress: number;
  created_at: string;
}

export type LearningGoal = LearningGoalResponse;
