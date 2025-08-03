export interface UserGoal {
  id: string;
  title: string;
  description: string;
  type: 'example' | 'custom';
  planType: string;
  createdAt: string;
  progress: number;
  studyHours: number;
  answers: {
    [key: string]: string;
  };
  milestones: {
    title: string;
    completed: boolean;
    dueDate?: string;
  }[];
  notes: {
    id: string;
    text: string;
    createdAt: string;
  }[];
  statistics: {
    totalStudyHours: number;
    weeklyAverage: number;
    completedMilestones: number;
    streak: number;
  };
}

export const sampleUserGoal: UserGoal = {
  id: "1234567890",
  title: "YKS Hazırlık - Sayısal",
  description: "Tıp fakültesi hedefi için YKS hazırlık programı",
  type: "example",
  planType: "yks-hazirlik",
  createdAt: "2024-03-20T10:00:00Z",
  progress: 35,
  studyHours: 120,
  answers: {
    "current-grade": "12. Sınıf",
    "target-department": "Tıp",
    "study-hours": "6",
    "weak-subjects": "Fizik, Kimya",
    "mock-exam-score": "TYT: 85, AYT: 75",
    "other-details": "Özel ders alıyorum, hafta sonları dershaneye gidiyorum"
  },
  milestones: [
    {
      title: "TYT Matematik konularını bitir",
      completed: true,
      dueDate: "2024-04-01T00:00:00Z"
    },
    {
      title: "AYT Fizik konularını bitir",
      completed: false,
      dueDate: "2024-05-01T00:00:00Z"
    },
    {
      title: "Tüm deneme sınavlarını çöz",
      completed: false,
      dueDate: "2024-06-01T00:00:00Z"
    }
  ],
  notes: [
    {
      id: "note1",
      text: "Trigonometri konusunda ekstra çalışma gerekiyor",
      createdAt: "2024-03-21T15:30:00Z"
    },
    {
      id: "note2",
      text: "Fizik formüllerini düzenli tekrar et",
      createdAt: "2024-03-22T16:45:00Z"
    }
  ],
  statistics: {
    totalStudyHours: 120,
    weeklyAverage: 25,
    completedMilestones: 1,
    streak: 15
  }
}; 