import { api } from './auth';

export const getCurrentWeekStats = async () => {
  const res = await api.get('/weekly-reviews/weekly/current');
  return res.data;
};

export const getWeeklyComment = async () => {
  const res = await api.get('/weekly-reviews/weekly/comment');
  return res.data;
};

export const getWeeklyComparison = async (userId: number) => {
  const res = await api.get(`/weekly-reviews/weekly-comparison/${userId}`);
  return res.data;
};

export const submitFeedback = async (feedback: {
  user_id: number;
  comment_id?: string;
  is_helpful: boolean;
  feedback_text?: string;
}) => {
  const res = await api.post('/weekly-reviews/feedback', feedback);
  return res.data;
};


export const getDailyFocusTip = async () => {
    const res = await api.get('/weekly-reviews/daily-focus-tip');
    return res.data;
 
};