import type { CalendarTask, CategoryType, RepeatType, PriorityType } from '../types/calendar';

// Kategori ikonları
export const categoryIcons = {
  study: '📚',
  exam: '📝',
  meeting: '👥',
  break: '☕',
  homework: '✍️',
  project: '🎯',
  reading: '📖',
  exercise: '🏃',
  other: '📌'
} as const;

// Temel haftalık görevler
const baseWeekTasks = [
  // Pazartesi
  {
    title: "Veri Yapıları Dersi",
    description: "Veri yapıları ve algoritmalar dersi. Kapsam: Ağaçlar, Grafikler ve Dinamik Programlama",
    category: "study",
    startHour: 9,
    duration: 120,
    tags: ["data structures", "algorithms"],
    repeat: "weekly" as RepeatType,
    customRepeat: "FREQ=WEEKLY;BYDAY=MO",
    subtasks: [
      { title: "Ders notlarını gözden geçir", completed: false },
      { title: "Örnek problemleri çöz", completed: false },
      { title: "Ödev kontrolü", completed: false }
    ],
    comments: [
      {
        text: "Gelecek hafta quiz yapılacak",
        userId: "prof_123"
      }
    ],
    priority: "high" as PriorityType
  },
  {
    title: "Proje Grup Toplantısı",
    description: "Yazılım mühendisliği dersi proje toplantısı. Sprint review ve planlama.",
    category: "meeting",
    startHour: 13,
    duration: 90,
    tags: ["project", "team", "planning"],
    repeat: "weekly",
    customRepeat: "FREQ=WEEKLY;BYDAY=MO",
    subtasks: [
      { title: "Sprint raporu hazırla", completed: false },
      { title: "Yeni görev dağılımı", completed: false }
    ],
    comments: [],
    priority: "medium" as PriorityType
  },

  // Salı
  {
    title: "Makine Öğrenmesi Lab",
    description: "Yapay sinir ağları uygulaması. Python ve TensorFlow ile görüntü sınıflandırma.",
    category: "project",
    startHour: 10,
    duration: 120,
    tags: ["machine learning", "python", "neural networks"],
    repeat: "weekly",
    customRepeat: "FREQ=WEEKLY;BYDAY=TU",
    subtasks: [
      { title: "Veri setini hazırla", completed: false },
      { title: "Model mimarisini oluştur", completed: false }
    ],
    comments: [],
    priority: "high" as PriorityType
  },
  {
    title: "İngilizce Konuşma Kulübü",
    description: "Technical English konuşma pratiği ve sunum hazırlığı",
    category: "meeting",
    startHour: 15,
    duration: 60,
    tags: ["english", "speaking", "presentation"],
    repeat: "weekly",
    customRepeat: "FREQ=WEEKLY;BYDAY=TU",
    subtasks: [
      { title: "Sunum hazırlığı", completed: false }
    ],
    comments: [],
    priority: "medium" as PriorityType
  },

  // Çarşamba
  {
    title: "Web Programlama",
    description: "Modern web teknolojileri ve framework'ler",
    category: "study",
    startHour: 9,
    duration: 120,
    tags: ["web", "javascript", "react"],
    repeat: "weekly",
    customRepeat: "FREQ=WEEKLY;BYDAY=WE",
    subtasks: [
      { title: "Haftalık ödev", completed: false },
      { title: "Lab çalışması", completed: false }
    ],
    comments: [],
    priority: "high" as PriorityType
  },
  {
    title: "Fitness Antrenmanı",
    description: "Kardiyo ve kuvvet antrenmanı",
    category: "exercise",
    startHour: 17,
    duration: 90,
    tags: ["fitness", "health"],
    repeat: "weekly",
    customRepeat: "FREQ=WEEKLY;BYDAY=WE",
    subtasks: [
      { title: "Kardiyo (30 dk)", completed: false },
      { title: "Kuvvet (45 dk)", completed: false }
    ],
    comments: [],
    priority: "low" as PriorityType
  },

  // Perşembe
  {
    title: "Araştırma Metodolojisi",
    description: "Akademik makale yazımı ve araştırma yöntemleri",
    category: "study",
    startHour: 9,
    duration: 120,
    tags: ["research", "academic", "methodology"],
    repeat: "weekly",
    customRepeat: "FREQ=WEEKLY;BYDAY=TH",
    subtasks: [
      { title: "Literatür taraması", completed: false },
      { title: "Metodoloji yazımı", completed: false }
    ],
    comments: [],
    priority: "medium" as PriorityType
  },

  // Cuma
  {
    title: "Algoritma Analizi",
    description: "Algoritmaların zaman ve uzay karmaşıklığı analizi",
    category: "study",
    startHour: 10,
    duration: 120,
    tags: ["algorithms", "complexity", "analysis"],
    repeat: "weekly",
    customRepeat: "FREQ=WEEKLY;BYDAY=FR",
    subtasks: [
      { title: "Problem seti çözümü", completed: false },
      { title: "Karmaşıklık analizi", completed: false }
    ],
    comments: [],
    priority: "high" as PriorityType
  },
  {
    title: "Proje Kodlama Seansı",
    description: "Takım üyeleriyle birlikte kodlama ve code review",
    category: "project",
    startHour: 14,
    duration: 180,
    tags: ["coding", "team", "review"],
    repeat: "weekly",
    customRepeat: "FREQ=WEEKLY;BYDAY=FR",
    subtasks: [
      { title: "Feature implementasyonu", completed: false },
      { title: "Code review", completed: false },
      { title: "Bug fixes", completed: false }
    ],
    comments: [],
    priority: "high" as PriorityType
  }
];

// 4 haftalık görevleri oluştur
export const mockTasks: CalendarTask[] = [];
const startDate = new Date('2025-07-14T00:00:00.000Z'); // 14 Temmuz 2025

for (let week = 0; week < 4; week++) {
  baseWeekTasks.forEach((baseTask, index) => {
    for (let day = 0; day < 5; day++) {
      if (baseTask.customRepeat?.includes(["MO", "TU", "WE", "TH", "FR"][day])) {
        const taskDate = new Date(startDate);
        taskDate.setDate(startDate.getDate() + (week * 7) + day);
        
        const startTime = new Date(taskDate);
        startTime.setHours(baseTask.startHour, 0, 0, 0);
  
        const endTime = new Date(startTime);
        endTime.setMinutes(startTime.getMinutes() + baseTask.duration);

        mockTasks.push({
          id: `task_${taskDate.toISOString().split('T')[0].replace(/-/g, '')}_${index}`,
          title: baseTask.title,
          description: baseTask.description,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          category: baseTask.category as CategoryType,
          tags: baseTask.tags,
          repeat: baseTask.repeat as RepeatType,
          customRepeat: baseTask.customRepeat,
          subtasks: baseTask.subtasks.map((st, i) => ({
            id: `${taskDate.toISOString().split('T')[0].replace(/-/g, '')}_${index}_sub_${i}`,
            title: st.title,
            completed: false
          })),
          comments: baseTask.comments.map((comment, i) => ({
            id: `${taskDate.toISOString().split('T')[0].replace(/-/g, '')}_${index}_com_${i}`,
            text: comment.text,
            createdAt: new Date(taskDate.getTime() - 86400000).toISOString(), // 1 gün önce
            userId: comment.userId
          })),
          priority: baseTask.priority,
          completed: false
        });
      }
    }
  });
}

export const taskTypeColors = {
  low: '#96CEB4',
  medium: '#4ECDC4',
  high: '#FF6B6B'
};

// Dashboard için takvim verilerini oluşturan yardımcı fonksiyon
export const generateCalendarData = () => {
  const calendarData: { [key: string]: number } = {};
  
  mockTasks.forEach(task => {
    const dateStr = task.startTime.split('T')[0];
    if (calendarData[dateStr]) {
      calendarData[dateStr]++;
    } else {
      calendarData[dateStr] = 1;
    }
  });

  return calendarData;
}; 