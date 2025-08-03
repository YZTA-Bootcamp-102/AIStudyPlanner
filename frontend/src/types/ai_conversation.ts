export interface AIConversationCreate {
    initial_message: string;
  }
  
  export interface AIConversationOut {
    id: number;
    user_id: number;
    initial_message: string;
    ai_response: string;
    created_at: string;
  }
  