import { useState, useRef, useEffect } from 'react';
import { ListTodo, ChevronRight, Clock, Eye, EyeOff, AlertCircle, Check, CheckCircle2, Plus, Filter, Search, Calendar, Target, TrendingUp, MoreVertical, Edit, Trash2, Star, StarOff, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import AddTaskModal from '../../components/tasks/AddTaskModal';
import type { TaskDetailType } from '../../components/tasks/TaskDetailModal';
import TaskDetailModal from '../../components/tasks/TaskDetailModal';
import TaskAIChat from '../../components/tasks/TaskAIChat';
import { Helmet } from 'react-helmet-async';
import type { DailyTaskCreate, DailyTaskOut, DailyTaskUpdate, CategoryType, PriorityType, RepeatType } from '../../types/dailyTask';
import { format, parseISO, isSameDay, isAfter } from 'date-fns';
import type { LearningGoal } from '../../types/learningGoal';
import { getAllLearningGoals } from '../../services/learningGoal';
import { completeDailyTask, createDailyTask, deleteDailyTask, getTodayDailyTasks, updateDailyTask } from '../../services/dailyTasks';
import AddToCalendarModal from '../../components/tasks/AddToCalendarModal';
import { createCalendarEvent } from '../../services/calendarIntegration';

const TasksPage = () => {
  const [showCompleted, setShowCompleted] = useState(false);
  const [animatingTaskId, setAnimatingTaskId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'time' | 'priority' | 'dueDate'>('time');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<{ detail: TaskDetailType; base: DailyTaskOut } | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [learningGoals, setLearningGoals] = useState<LearningGoal[]>([]);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [errorGoals, setErrorGoals] = useState<string | null>(null);
  const [tasks, setTasks] = useState<DailyTaskOut[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  
  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [taskToAddToCalendar, setTaskToAddToCalendar] = useState<DailyTaskOut | null>(null);


  // Dropdown referansları
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const priorityDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Dropdown dışı tıklamaları dinle
  useEffect(() => {
    async function fetchLearningGoals() {
      try {
        setLoadingGoals(true);
        const goals = await getAllLearningGoals();
        setLearningGoals(goals);
        setErrorGoals(null);
      } catch (error) {
        setErrorGoals('Öğrenme hedefleri alınırken hata oluştu.');
        console.error(error);
      } finally {
        setLoadingGoals(false);
      }
    }
    
    const fetchTasks = async () => {
      try {
        setLoadingTasks(true);
        const data = await getTodayDailyTasks();
        console.log('Fetched tasks from backend:', data);
        setTasks(data);
      } catch (err) {
        console.error('Görevler yüklenemedi', err);
      } finally {
        setLoadingTasks(false);
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (priorityDropdownRef.current && !priorityDropdownRef.current.contains(event.target as Node)) {
        setShowPriorityDropdown(false);
      }
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setShowSortDropdown(false);
      }
    };

    fetchLearningGoals();
    fetchTasks();

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Bugünün görevlerini al - Show all tasks instead of filtering by today
  const todaysTasks = tasks; // Remove date filtering for now to see all tasks

  const completedTasks = todaysTasks.filter(task => task.is_completed);
  const pendingTasks = todaysTasks.filter(task => !task.is_completed);
  const totalTasks = todaysTasks.length;
  const completionPercentage = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

  console.log('Tasks state:', tasks);
  console.log('Today tasks:', todaysTasks);
  console.log('Completed tasks:', completedTasks);
  console.log('Pending tasks:', pendingTasks);

  // Filtreleme ve arama
  const filteredTasks = todaysTasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || task.category === selectedCategory;
    const matchesPriority = selectedPriority === 'all' || task.priority === selectedPriority;
    const matchesCompletion = showCompleted ? true : !task.is_completed;
    
    return matchesSearch && matchesCategory && matchesPriority && matchesCompletion;
  });

  // Sıralama
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'time':
        return (a.start_time || '').localeCompare(b.start_time || '');
      case 'priority':
        const priorityOrder: Record<string, number> = { high: 3, medium: 2, low: 1 };
        const aPriority = a.priority || 'medium';
        const bPriority = b.priority || 'medium';
        return (priorityOrder[bPriority] || 0) - (priorityOrder[aPriority] || 0);
      case 'dueDate':
        return a.date.localeCompare(b.date);
      default:
        return 0;
    }
  });

  // Zamanı geçmiş görevleri kontrol et
  const isOverdue = (dateStr: string, timeStr?: string) => {
    if (!dateStr) return false;
    const taskDate = parseISO(dateStr);
    if (timeStr) {
      const [hours, minutes] = timeStr.split(':');
      taskDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    }
    return isAfter(new Date(), taskDate);
  };

  const handleTaskToggle = async (taskId: number) => {
    setAnimatingTaskId(String(taskId));
    try {
      const updated = await completeDailyTask(taskId);
      setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
    } catch (e) {
      console.error('Tamamlama işlemi başarısız', e);
    } finally {
      setAnimatingTaskId(null);
    }
  };

  const formatTaskTime = (timeStr?: string): string => {
    if (!timeStr) return '';
    return timeStr.substring(0, 5); // HH:MM format
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-100 dark:bg-red-900/40 dark:text-red-400';
      case 'medium': return 'text-orange-500 bg-orange-100 dark:bg-orange-900/40 dark:text-orange-400';
      case 'low': return 'text-green-500 bg-green-100 dark:bg-green-900/40 dark:text-green-400';
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Yüksek';
      case 'medium': return 'Orta';
      case 'low': return 'Düşük';
      default: return priority;
    }
  };

  const categories = ['all', ...new Set(tasks.map(task => task.category).filter(Boolean))];

  const handleAddTask = async (taskData: DailyTaskCreate) => {
    try {
      console.log('Creating task with data:', taskData);
      const newTask = await createDailyTask(taskData);
      console.log('Task created successfully:', newTask);
      
      // Refresh the tasks list instead of just adding to state
      const updatedTasks = await getTodayDailyTasks();
      setTasks(updatedTasks);
      
      setIsAddModalOpen(false);
    } catch (e) {
      console.error('Görev eklenemedi', e);
    }
  };

  const handleTaskSave = async (updatedTask: TaskDetailType, shouldClose?: boolean) => {
    if (!selectedTask) return;
    
    try {
      console.log('Updating task with data:', updatedTask);
      
      // Convert frontend format to backend format
      const backendData: DailyTaskUpdate = {
        title: updatedTask.title,
        description: updatedTask.description,
        priority: updatedTask.priority,
        category: updatedTask.category,
        tags: updatedTask.tags,
        repeat: updatedTask.repeat,
        custom_repeat: updatedTask.customRepeat || '',
        date: updatedTask.date,
        start_time: updatedTask.time ? `${updatedTask.time}:00` : undefined,
        duration_minutes: updatedTask.duration_minutes ?? 60,
        subtasks: (updatedTask.subtasks ?? []).map(st => ({
          text: st.text,
          done: st.done ?? false
        })),
        notes: (updatedTask.notes ?? []).map(note => ({
          text: note.text
        }))
      };
      
      
      console.log('Sending update to backend:', backendData);
      
      const updated = await updateDailyTask(selectedTask.base.id, backendData);
      console.log('Task updated successfully:', updated);
      
      // Refresh the tasks list
      const updatedTasks = await getTodayDailyTasks();
      setTasks(updatedTasks);
      
      if (shouldClose) {
        setDetailModalOpen(false);
        setSelectedTask(null);
      }
    } catch (e) {
      console.error('Görev güncellenemedi:', e);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;
    
    try {
      console.log('Deleting task:', selectedTask.base.id);
      
      await deleteDailyTask(selectedTask.base.id);
      console.log('Task deleted successfully');
      
      // Refresh the tasks list
      const updatedTasks = await getTodayDailyTasks();
      setTasks(updatedTasks);
      
      setDetailModalOpen(false);
      setSelectedTask(null);
    } catch (e) {
      console.error('Görev silinemedi:', e);
    }
  };

  // Helper function to safely get category
  const getSafeCategory = (category?: string): CategoryType => {
    return (category as CategoryType) || 'other';
  };

  // Helper function to safely get priority
  const getSafePriority = (priority?: string): PriorityType => {
    return (priority as PriorityType) || 'medium';
  };

  // Helper function to safely get time
  const getSafeTime = (time?: string): string => {
    return time || '';
  };

  // Helper function to safely get date
  const getSafeDate = (date?: string): string => {
    return date || '';
  };

  // Helper function to safely get repeat
  const getSafeRepeat = (repeat?: string): RepeatType => {
    return (repeat as RepeatType) || 'none';
  };
  
  const handleCalendarSubmit = async (data: {
    summary: string;
    description: string;
    start_time: string;
    end_time: string;
  }) => {
    try {
      await createCalendarEvent(data);
      alert('Etkinlik başarıyla oluşturuldu!');
    } catch (error) {
      if (error instanceof Error) {
        alert('Hata: ' + error.message);
      } else {
        alert('Bilinmeyen bir hata oluştu.');
      }
    }
  };
  

  return (
    <>
      <Helmet>
        <title>Görevler | FocusFlow</title>
        <meta name="description" content="FocusFlow görev yönetimi ile çalışma görevlerinizi organize edin, önceliklendirin ve takip edin." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-xl border border-gray-100 dark:border-gray-700 mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-2xl">
                <ListTodo size={36} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                  Görevler
                </h1>
                <p className="text-xl text-gray-500 dark:text-gray-400">
                  Tüm görevlerinizi yönetin ve takip edin
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button onClick={() => setIsAddModalOpen(true)} className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-bold text-lg transition-all duration-200 flex items-center space-x-2 shadow-xl hover:shadow-2xl transform hover:scale-105">
                <Plus size={24} />
                <span>Yeni Görev</span>
              </button>
            </div>
          </div>

          {/* Progress Bar & Stats */}
          <div className="mb-10 grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-6 rounded-2xl border border-blue-200 dark:border-blue-800 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base text-blue-600 dark:text-blue-400">Toplam Görev</p>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">{totalTasks}</p>
                </div>
                <Target className="w-10 h-10 text-blue-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-6 rounded-2xl border border-green-200 dark:border-green-800 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base text-green-600 dark:text-green-400">Tamamlanan</p>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">{completedTasks.length}</p>
                </div>
                <CheckCircle2 className="w-10 h-10 text-green-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 p-6 rounded-2xl border border-orange-200 dark:border-orange-800 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base text-orange-600 dark:text-orange-400">Bekleyen</p>
                  <p className="text-3xl font-bold text-orange-700 dark:text-orange-300">{pendingTasks.length}</p>
                </div>
                <Clock className="w-10 h-10 text-orange-500" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 p-6 rounded-2xl border border-purple-200 dark:border-purple-800 shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-base text-purple-600 dark:text-purple-400">Tamamlanma</p>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">{completionPercentage.toFixed(0)}%</p>
                </div>
                <TrendingUp className="w-10 h-10 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700 mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={22} />
                <input
                  type="text"
                  placeholder="Görev ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent text-lg transition-all duration-200"
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              {/* Kategori Filtresi */}
              <div className="relative" ref={categoryDropdownRef}>
                <button
                  onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                  className="px-5 py-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-200 flex items-center space-x-2 min-w-[160px]"
                >
                  <span className="text-base font-medium">
                    {selectedCategory === 'all' ? 'Tüm Kategoriler' : selectedCategory}
                  </span>
                  <svg className={`w-4 h-4 text-gray-500 transition-transform ${showCategoryDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showCategoryDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-10">
                    <div
                      onClick={() => {
                        setSelectedCategory('all');
                        setShowCategoryDropdown(false);
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors ${
                        selectedCategory === 'all' ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Tüm Kategoriler
                    </div>
                    {categories.filter(cat => cat !== 'all').map(category => (
                      <div
                        key={category}
                        onClick={() => {
                          if (category) {
                            setSelectedCategory(category);
                            setShowCategoryDropdown(false);
                          }
                        }}
                        className={`px-4 py-2 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors ${
                          selectedCategory === category ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {category}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Öncelik Filtresi */}
              <div className="relative" ref={priorityDropdownRef}>
                <button
                  onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                  className="px-5 py-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-200 flex items-center space-x-2 min-w-[140px]"
                >
                  <span className="text-base font-medium">
                    {selectedPriority === 'all' ? 'Tüm Öncelikler' : getPriorityText(selectedPriority)}
                  </span>
                  <svg className={`w-4 h-4 text-gray-500 transition-transform ${showPriorityDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showPriorityDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-10">
                    <div
                      onClick={() => {
                        setSelectedPriority('all');
                        setShowPriorityDropdown(false);
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors ${
                        selectedPriority === 'all' ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Tüm Öncelikler
                    </div>
                    <div
                      onClick={() => {
                        setSelectedPriority('high');
                        setShowPriorityDropdown(false);
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors ${
                        selectedPriority === 'high' ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Yüksek
                    </div>
                    <div
                      onClick={() => {
                        setSelectedPriority('medium');
                        setShowPriorityDropdown(false);
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors ${
                        selectedPriority === 'medium' ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Orta
                    </div>
                    <div
                      onClick={() => {
                        setSelectedPriority('low');
                        setShowPriorityDropdown(false);
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors ${
                        selectedPriority === 'low' ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Düşük
                    </div>
                  </div>
                )}
              </div>

              {/* Sıralama Filtresi */}
              <div className="relative" ref={sortDropdownRef}>
                <button
                  onClick={() => setShowSortDropdown(!showSortDropdown)}
                  className="px-5 py-4 border border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20 hover:border-orange-300 dark:hover:border-orange-600 transition-all duration-200 flex items-center space-x-2 min-w-[140px]"
                >
                  <span className="text-base font-medium">
                    {sortBy === 'time' ? 'Zamana Göre' : sortBy === 'priority' ? 'Önceliğe Göre' : 'Tarihe Göre'}
                  </span>
                  <svg className={`w-4 h-4 text-gray-500 transition-transform ${showSortDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showSortDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-10">
                    <div
                      onClick={() => {
                        setSortBy('time');
                        setShowSortDropdown(false);
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors ${
                        sortBy === 'time' ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Zamana Göre
                    </div>
                    <div
                      onClick={() => {
                        setSortBy('priority');
                        setShowSortDropdown(false);
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors ${
                        sortBy === 'priority' ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Önceliğe Göre
                    </div>
                    <div
                      onClick={() => {
                        setSortBy('dueDate');
                        setShowSortDropdown(false);
                      }}
                      className={`px-4 py-2 cursor-pointer hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors ${
                        sortBy === 'dueDate' ? 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      Tarihe Göre
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tasks List and AI Chat Container */}
          <div className="flex gap-6 items-start w-full">
            {/* Tasks List */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 border-b border-gray-100 dark:border-gray-700 gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Görevler ({sortedTasks.length})
                </h2>
              </div>
              <div>
                {loadingTasks ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                      <ListTodo size={32} className="text-gray-400 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Görevler Yükleniyor...
                    </h3>
                  </div>
                ) : sortedTasks.length > 0 ? (
                  <ul>
                    {sortedTasks.map((task) => {
                      const overdue = isOverdue(task.date, task.start_time);
                      return (
                        <li
                          key={task.id}
                          className="group flex items-center px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors relative cursor-pointer"
                          onClick={e => {
                            if ((e.target as HTMLElement).closest('button')) return;
                            setSelectedTask({
                              base: task,
                              detail: {
                                id:task.id,
                                title: task.title,
                                description: task.description || '',
                                category: getSafeCategory(task.category),
                                tags: task.tags || [],
                                date: getSafeDate(task.date),
                                time: formatTaskTime(task.start_time),
                                repeat: getSafeRepeat(task.repeat),
                                customRepeat: task.custom_repeat || '',
                                subtasks: (task.subtasks || []).map(st => ({
                                  text: st.text,
                                  done: st.done ?? false
                                })),
                                notes: task.notes || [],
                                priority: getSafePriority(task.priority)
                              }
                            });
                            
                            setDetailModalOpen(true);
                          }}
                        >

                          <button
                            onClick={ev => { ev.stopPropagation(); handleTaskToggle(task.id); }}
                            className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600 flex items-center justify-center mr-3 shrink-0 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white dark:bg-gray-800 group-hover:border-orange-400"
                          >
                            {task.is_completed && <Check size={14} className="text-orange-500" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className={`text-base truncate ${task.is_completed ? 'text-gray-400 line-through' : 'text-gray-900 dark:text-white'}`}>{task.title}</span>
                            </div>
                            {/* Tarih ve saat bilgileri */}
                            <div className="flex items-center gap-3 mt-1">
                              <span className="flex items-center text-xs text-orange-600 dark:text-orange-400 font-medium">
                                <Clock size={12} className="mr-1" />
                                {formatTaskTime(task.start_time)}
                              </span>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                task.priority === 'high' 
                                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                  : task.priority === 'medium'
                                  ? 'bg-orange-50 text-orange-600 dark:bg-orange-800/30 dark:text-orange-300'
                                  : 'bg-orange-50 text-orange-500 dark:bg-orange-800/20 dark:text-orange-200'
                              }`}>
                                {getPriorityText(task.priority || 'medium')}
                              </span>
                            </div>
                            {/* Ek bilgi hover ile açılır */}
                            {(task.description || task.category) && (
                              <div className="hidden group-hover:flex mt-2 text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 shadow absolute left-10 top-full z-10 min-w-[200px] max-w-xs">
                                <div>
                                  {task.description && (
                                    <div className="mb-1">
                                      <span className="font-semibold">Açıklama:</span>{' '}
                                      <span className="line-clamp-2">{task.description}</span>
                                    </div>
                                  )}
                                  {task.category && (
                                    <div>
                                      <span className="font-semibold">Kategori:</span>{' '}
                                      <span className="bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-0.5 rounded-full text-[10px] font-medium">
                                        {task.category}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                         
                          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                            <button 
                              onClick={ev => { 
                                ev.stopPropagation(); 
                                setSelectedTask({
                                  base: task,
                                  detail: {
                                    id:task.id,
                                    title: task.title,
                                    description: task.description || '',
                                    category: getSafeCategory(task.category),
                                    tags: task.tags || [],
                                    date: getSafeDate(task.date),
                                    time: formatTaskTime(task.start_time),
                                    repeat: getSafeRepeat(task.repeat),
                                    customRepeat: task.custom_repeat || '',
                                    subtasks: (task.subtasks || []).map(st => ({
                                      text: st.text,
                                      done: st.done ?? false
                                    })),
                                    notes: task.notes || [],
                                    priority: getSafePriority(task.priority)
                                  }
                                });
                                setDetailModalOpen(true);
                              }} 
                              className="p-1 text-gray-400 hover:text-orange-500"
                            >
                              <Edit size={16} />
                            </button>
                            <button 
                              onClick={ev => { 
                                ev.stopPropagation(); 
                                setSelectedTask({
                                  base: task,
                                  detail: {
                                    id:task.id,
                                    title: task.title,
                                    description: task.description || '',
                                    category: getSafeCategory(task.category),
                                    tags: task.tags || [],
                                    date: getSafeDate(task.date),
                                    time: formatTaskTime(task.start_time),
                                    repeat: getSafeRepeat(task.repeat),
                                    customRepeat: task.custom_repeat || '',
                                    subtasks: (task.subtasks || []).map(st => ({
                                      text: st.text,
                                      done: st.done ?? false
                                    })),
                                    notes: task.notes || [],
                                    priority: getSafePriority(task.priority)
                                  }
                                });
                                handleDeleteTask();
                              }} 
                              className="p-1 text-gray-400 hover:text-red-500"
                            >
                              <Trash2 size={16} />
                            </button>
                            <button onClick={(e) => {
                              e.stopPropagation();
                              setTaskToAddToCalendar(task);
                              setCalendarModalOpen(true);
                            }} className="px-4 py-2 bg-orange-100 ... rounded-xl text-sm">
                              Takvime Ekle
                            </button>
                          </div>
                        </li>
                      );
                    })}
                    <li className="flex items-center justify-center px-4 py-6 hover:bg-orange-50 dark:hover:bg-orange-900/10 group transition-colors">
                      <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center gap-3 px-6 py-3 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl group-hover:bg-orange-100 dark:group-hover:bg-orange-900/40 transition-colors"
                      >
                        <Plus size={20} />
                        <span className="text-base font-medium">Yeni Görev Ekle</span>
                      </button>
                    </li>
                  </ul>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
                      <ListTodo size={32} className="text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Görev Bulunamadı
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                      Arama kriterlerinize uygun görev bulunamadı.
                    </p>
                    <button onClick={() => setIsAddModalOpen(true)} className="px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-2xl font-bold text-base transition-all duration-200 flex items-center space-x-2 shadow-xl hover:shadow-2xl transform hover:scale-105 mx-auto">
                      <Plus size={20} />
                      <span>Yeni Görev Ekle</span>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* AI Chat Component */}
            <div className="w-[500px] h-[600px] hidden lg:block flex-shrink-0 relative">
              <TaskAIChat />
            </div>
          </div>

          {/* Modals */}
          {isAddModalOpen && (
            <AddTaskModal
              isOpen={isAddModalOpen}
              onClose={() => setIsAddModalOpen(false)}
              onAdd={handleAddTask}
              learningGoals={learningGoals || []}
            />
          )}
          {detailModalOpen && selectedTask && (
            <div className="fixed inset-0 isolate">
              <TaskDetailModal
                isOpen={detailModalOpen}
                onClose={() => {
                  setDetailModalOpen(false);
                  setSelectedTask(null);
                }}
                task={selectedTask.detail}
                onSave={handleTaskSave}
                onDelete={handleDeleteTask}
              />
            </div>
          )}
           {calendarModalOpen && taskToAddToCalendar && (
          <AddToCalendarModal
           isOpen={calendarModalOpen} 
           onClose={() => setCalendarModalOpen(false)}
          onSubmit={handleCalendarSubmit} />
          )}
        </div>
      </div>
    </>
  );
};

export default TasksPage; 