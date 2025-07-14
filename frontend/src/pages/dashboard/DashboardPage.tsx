import { useState, Suspense, lazy } from 'react';
import { Calendar as CalendarIcon, CheckCircle2, Clock, ListTodo, MessageSquarePlus, Brain, Sparkles, 
  ChevronRight, Plus, Send, Rocket, Target, TrendingUp, Pencil, Trash2, BookOpen, Timer, Bot, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Calendar from 'react-calendar';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import 'react-calendar/dist/Calendar.css';
import DashboardHeader from '../../components/DashboardHeader';
import { Helmet } from 'react-helmet-async';

// Lazy load all dashboard widgets
const StatsSection = lazy(() => import('../../components/dashboard/Stats/StatsSection'));
const QuickActionsSection = lazy(() => import('../../components/dashboard/QuickActions/QuickActionsSection'));
const TasksSection = lazy(() => import('../../components/dashboard/Tasks/TasksSection'));
const AIChatSection = lazy(() => import('../../components/dashboard/AIChat/AIChatSection'));
const CalendarSection = lazy(() => import('../../components/dashboard/Calendar/CalendarSection'));
const NotesSection = lazy(() => import('../../components/dashboard/Notes/NotesSection'));

interface Note {
  id: number;
  text: string;
  date: string;
}

interface Task {
  id: number;
  title: string;
  completed: boolean;
  time: string;
}

interface QuickAction {
  title: string;
  icon: React.ElementType;
  color: string;
}

interface CalendarData {
  [key: string]: number;
}

type CalendarValue = Date | [Date, Date] | null;

interface Message {
  id: number;
  text: string;
  isAI: boolean;
  timestamp: Date;
}

const DashboardPage = () => {
  const [chatMessage, setChatMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, text: "Matematik sınavı için formülleri tekrar et", date: "2024-03-20" },
    { id: 2, text: "Fizik projesi için kaynak araştırması yap", date: "2024-03-21" }
  ]);
  const [newNote, setNewNote] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Merhaba! 👋 Ben senin AI asistanınım. Bugün çalışmalarında sana nasıl yardımcı olabilirim?",
      isAI: true,
      timestamp: new Date()
    }
  ]);
  const [isAITyping, setIsAITyping] = useState(false);

  const quickActions: QuickAction[] = [
    { title: 'Yeni Görev', icon: Plus, color: 'orange' },
    { title: 'AI Asistan', icon: Brain, color: 'blue' },
    { title: 'Takvimi Görüntüle', icon: CalendarIcon, color: 'emerald' },
    { title: 'Hedef Belirle', icon: Target, color: 'purple' },
  ];

  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const [todaysTasks, setTodaysTasks] = useState([
    { id: 1, title: 'Matematik ödevini tamamla', completed: false, time: '10:00' },
    { id: 2, title: 'Fizik sınavına hazırlan', completed: false, time: '11:30' },
    { id: 3, title: 'Kimya laboratuvar raporunu yaz', completed: false, time: '13:00' },
    { id: 4, title: 'İngilizce kelime çalış', completed: false, time: '14:30' },
    { id: 5, title: 'Biyoloji sunumunu hazırla', completed: false, time: '15:00' },
    { id: 6, title: 'Tarih konularını tekrar et', completed: false, time: '16:30' },
    { id: 7, title: 'Edebiyat ödevini kontrol et', completed: false, time: '17:00' },
  ]);

  // İstatistikleri hesapla
  const completedTasks = todaysTasks.filter(task => task.completed);
  const pendingTasks = todaysTasks.filter(task => !task.completed);
  const completionRate = (completedTasks.length / todaysTasks.length) * 100;

  // Zamanı geçmiş görevleri hesapla
  const overdueTaskCount = todaysTasks.filter(task => {
    const [hours, minutes] = task.time.split(':').map(Number);
    const taskTime = new Date();
    taskTime.setHours(hours, minutes);
    return !task.completed && taskTime < new Date();
  }).length;

  // Örnek veriler
  const dailyStats = {
    totalTasks: todaysTasks.length,
    completedTasks: completedTasks.length,
    remainingTasks: pendingTasks.length,
    completionRate: completionRate,
    overdueTaskCount: overdueTaskCount,
    studyTime: "4s 30dk",
    focusRate: 85
  };

  const calendarData = {
    "2024-03-20": 3,
    "2024-03-21": 2,
    "2024-03-22": 4,
  };

  const initialNotes = [
    { id: 1, text: "Matematik sınavı için formülleri tekrar et", date: "2024-03-20" },
    { id: 2, text: "Fizik projesi için kaynak araştırması yap", date: "2024-03-21" }
  ];

  const handleTaskToggle = (taskId: number) => {
    setTodaysTasks(tasks =>
      tasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const addNote = () => {
    if (newNote.trim()) {
      setNotes([
        ...notes,
        {
          id: Date.now(),
          text: newNote,
          date: format(new Date(), 'yyyy-MM-dd')
        }
      ]);
      setNewNote('');
    }
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const startEditNote = (id: number) => {
    setEditingNoteId(id);
    const note = notes.find(n => n.id === id);
    if (note) {
      setNewNote(note.text);
    }
  };

  const saveEditNote = () => {
    if (editingNoteId && newNote.trim()) {
      setNotes(notes.map(note =>
        note.id === editingNoteId
          ? { ...note, text: newNote }
          : note
      ));
      setEditingNoteId(null);
      setNewNote('');
    }
  };

  const sendMessage = () => {
    if (chatMessage.trim()) {
      const userMessage: Message = {
        id: Date.now(),
        text: chatMessage,
        isAI: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setChatMessage('');
      setIsAITyping(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Skeleton loading components for different widget types
  const StatsSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center mb-6 md:mb-0">
          <div className="mr-8">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-2"></div>
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4 animate-pulse">
              <div className="flex items-center justify-between mb-2">
                <div className="w-5 h-5 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="w-8 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
              <div className="w-20 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6 bg-gray-200 dark:bg-gray-700 rounded-full h-2 animate-pulse"></div>
    </div>
  );

  const TaskSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div>
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="h-4 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
          <div className="h-10 w-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
        </div>
      </div>
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse mb-6"></div>
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700/50 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                <div className="h-4 w-48 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                <div className="h-4 w-12 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const QuickActionsSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div>
            <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700/50 animate-pulse">
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gray-300 dark:bg-gray-600"></div>
              <div className="h-4 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const AIChatSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-orange-50 via-orange-100/50 to-orange-50 dark:from-orange-900/20 dark:via-orange-800/20 dark:to-orange-900/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse mr-4"></div>
            <div>
              <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
              <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="w-24 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="h-[320px] p-6 space-y-4 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/30 dark:from-gray-800/50 dark:via-gray-800 dark:to-gray-800/30">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex justify-start">
            <div className="flex items-start space-x-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div className="rounded-2xl px-5 py-3 bg-gray-200 dark:bg-gray-700 animate-pulse">
                <div className="h-4 w-48 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse"></div>
        </div>
      </div>
    </div>
  );

  const CalendarSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse mr-3"></div>
            <div>
              <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
              <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse mb-6"></div>
        <div className="space-y-4">
          <div className="h-6 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-3"></div>
          <div className="space-y-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="p-3 rounded-xl bg-gray-100 dark:bg-gray-700/50 animate-pulse">
                <div className="flex items-center space-x-3">
                  <div className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600"></div>
                  <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const NotesSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700 animate-pulse mr-3"></div>
            <div>
              <div className="h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
              <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="w-16 h-6 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-5">
          <div className="relative">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <div className="w-full h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
              </div>
              <div className="w-16 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="rounded-xl bg-gray-100 dark:bg-gray-700/50 border border-gray-200/50 dark:border-gray-600/50 animate-pulse">
                <div className="p-4">
                  <div className="h-4 w-full bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
                  <div className="h-px bg-gray-300 dark:bg-gray-600 mb-3"></div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-20 bg-gray-300 dark:bg-gray-600 rounded"></div>
                      <div className="h-3 w-16 bg-gray-300 dark:bg-gray-600 rounded"></div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                      <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Dashboard | FocusFlow</title>
        <meta name="description" content="FocusFlow dashboard'ınızda çalışma planınızı görüntüleyin, hedeflerinizi takip edin ve yapay zeka asistanınızla iletişime geçin." />
      </Helmet>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <DashboardHeader />
          
          <Suspense fallback={<StatsSkeleton />}>
            <StatsSection dailyStats={dailyStats} />
          </Suspense>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sol Sütun - Tasks & AI Chat */}
            <div className="lg:col-span-2 space-y-6">
              <Suspense fallback={<QuickActionsSkeleton />}>
                <QuickActionsSection />
              </Suspense>
              <Suspense fallback={<TaskSkeleton />}>
                <TasksSection tasks={todaysTasks} onTaskToggle={handleTaskToggle} />
              </Suspense>
              <Suspense fallback={<AIChatSkeleton />}>
                <AIChatSection />
              </Suspense>
            </div>

            {/* Sağ Sütun - Calendar & Notes */}
            <div className="space-y-6">
              <Suspense fallback={<CalendarSkeleton />}>
                <CalendarSection calendarData={calendarData} />
              </Suspense>
              <Suspense fallback={<NotesSkeleton />}>
                <NotesSection initialNotes={initialNotes} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage; 