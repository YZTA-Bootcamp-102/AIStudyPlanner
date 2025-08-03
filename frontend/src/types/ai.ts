/** -------------------- Study Plan -------------------- */
export interface StudyPlanRequest {
    plan_id: string;
    answers: Record<string, string>;
  }
  
  export interface StudyPlanResponse {
    plan_text: string;
  }

  export interface ChatRequest {
    message: string;
  }
  
  export interface ChatResponse {
    reply: string;
  }