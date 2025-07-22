import { useState } from 'react';
import { ListTodo, ChevronRight, Clock, Eye, EyeOff, AlertCircle, Check, CheckCircle2, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockTasks } from '../../../data/mockCalendarData';
import { format, parseISO, isSameDay, isAfter } from 'date-fns';
import type { CalendarTask } from '../../../types/calendar';

interface TasksSectionProps {
  tasks?: CalendarTask[]; // Optional, if not provided will use today's tasks from mockTasks
  onTaskToggle: (taskId: string) => void;
}

const MAX_VISIBLE_TASKS = 5;

const TasksSection = ({ tasks: propTasks, onTaskToggle }: TasksSectionProps) => {
  const [showCompleted, setShowCompleted] = useState(false);
  const [animatingTaskId, setAnimatingTaskId] = useState<string | null>(null);
  
  // Eğer prop olarak tasks verilmemişse, bugünün görevlerini mockTasks'dan al
  const tasks = propTasks || mockTasks.filter(task => 
    isSameDay(parseISO(task.startTime), new Date())
  );
  
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

  const visibleTasks = showCompleted ? tasks : pendingTasks;
  const hasMoreTasks = visibleTasks.length > MAX_VISIBLE_TASKS;
  const displayTasks = visibleTasks.slice(0, MAX_VISIBLE_TASKS);

  // Zamanı geçmiş görevleri kontrol et
  const isOverdue = (timeStr: string) => {
    const taskTime = parseISO(timeStr);
    return isAfter(new Date(), taskTime);
  };

  const handleTaskToggle = (taskId: string) => {
    setAnimatingTaskId(taskId);
    onTaskToggle(taskId);
    setTimeout(() => setAnimatingTaskId(null), 1000); // Animasyon süresi sonunda reset
  };

  const formatTaskTime = (timeStr: string): string => {
    return format(parseISO(timeStr), 'HH:mm');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg">
            <ListTodo size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Bugünün Görevleri
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {completedTasks.length} / {totalTasks} tamamlandı
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          {completedTasks.length > 0 && (
            <>
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className="text-sm text-gray-500 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400 flex items-center transition-colors duration-200"
              >
                {showCompleted ? (
                  <>
                    <EyeOff size={16} className="mr-1" />
                    Tamamlananları Gizle
                  </>
                ) : (
                  <>
                    <Eye size={16} className="mr-1" />
                    Tamamlananları Göster
                  </>
                )}
              </button>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
            </>
          )}
          <Link
            to="/tasks"
            className="text-sm text-orange-500 hover:text-orange-600 font-medium flex items-center transition-colors duration-200 group"
          >
            Tümünü Gör
            <ChevronRight size={16} className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <div className="w-px h-4 bg-gray-300 dark:bg-gray-600"></div>
          <Link
            to="/tasks"
            className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-xl font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Plus size={16} />
            <span>Görev Ekle</span>
          </Link>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500 ease-in-out"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {displayTasks.length > 0 ? (
          <>
            {displayTasks.map((task) => {
              const overdue = isOverdue(task.startTime);
              const isAnimating = animatingTaskId === task.id;
              return (
                <div
                  key={task.id}
                  className={`group relative flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-gray-50 to-gray-50/50 dark:from-gray-700/50 dark:to-gray-700/30 hover:from-orange-50 hover:to-orange-50/50 dark:hover:from-orange-900/10 dark:hover:to-orange-800/5 transition-all duration-300 ${
                    overdue && !task.completed ? 'border-l-4 border-red-500' : ''
                  } ${isAnimating ? 'animate-task-complete' : ''}`}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-orange-500/10 dark:group-hover:from-orange-400/10 dark:group-hover:to-orange-400/20 transition-all duration-300 rounded-xl"></div>
                  
                  <div className="relative flex items-center space-x-4">
                    <button
                      onClick={() => handleTaskToggle(task.id)}
                      className={`relative w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${
                        task.completed
                          ? 'bg-orange-500 border-orange-500'
                          : 'border-gray-300 dark:border-gray-600 group-hover:border-orange-500'
                      }`}
                    >
                      <div className={`absolute inset-0 rounded-full ${
                        isAnimating ? 'animate-checkbox-ripple' : ''
                      }`} />
                      {task.completed && (
                        <Check size={14} className={`text-white transform transition-all duration-300 ${
                          isAnimating ? 'animate-checkbox-check' : ''
                        }`} />
                      )}
                    </button>
                    <span className={`font-medium transition-all duration-300 ${
                      task.completed 
                        ? 'text-gray-400 dark:text-gray-500 line-through' 
                        : 'text-gray-700 dark:text-gray-200'
                    } ${isAnimating ? 'animate-text-complete' : ''}`}>
                      {task.title}
                    </span>
                  </div>

                  <div className="relative flex items-center gap-2">
                    {overdue && !task.completed && (
                      <span className="text-xs text-red-600 dark:text-red-400 bg-gradient-to-r from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 px-2 py-0.5 rounded-full flex items-center shadow-sm border border-red-200 dark:border-red-800 gap-1">
                        <AlertCircle size={12} className="mr-1 text-red-500 dark:text-red-400" />
                        Süresi Geçti
                      </span>
                    )}
                    <Clock size={14} className={`mr-2 ${
                      task.completed 
                        ? 'text-gray-400 dark:text-gray-500' 
                        : overdue ? 'text-red-500 dark:text-red-400' : 'text-orange-500 dark:text-orange-400'
                    }`} />
                    <span className={`text-sm transition-colors duration-200 ${
                      task.completed 
                        ? 'text-gray-400 dark:text-gray-500' 
                        : overdue ? 'text-red-500 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'
                    }`}>
                      {formatTaskTime(task.startTime)}
                    </span>
                  </div>
                </div>
              );
            })}
            {hasMoreTasks && (
              <Link
                to="/tasks"
                className="block text-center py-3 text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors duration-200"
              >
                {visibleTasks.length - MAX_VISIBLE_TASKS} görev daha var →
              </Link>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            {showCompleted 
              ? (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                    <CheckCircle2 size={24} className="text-gray-400" />
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    Henüz tamamlanan görev yok.
                  </p>
                </div>
              ) : pendingTasks.length === 0 && completedTasks.length > 0 ? (
                <div className="flex flex-col items-center">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg mb-4">
                    <CheckCircle2 size={32} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Tebrikler!
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Bugün için tüm görevlerini başarıyla tamamladın
                  </p>
                  <div className="flex items-center space-x-2 text-sm text-green-600 dark:text-green-400">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Mükemmel performans!</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-4">
                    <ListTodo size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Henüz görevin yok
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
                    Bugün için herhangi bir görev oluşturmadın
                  </p>
                  <Link
                    to="/tasks"
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-medium transition-colors duration-200 flex items-center space-x-2 group"
                  >
                    <span>Görev Oluştur</span>
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TasksSection;

// Animasyonlar için stil eklemeleri
const styles = `
@keyframes checkbox-ripple {
  0% {
    box-shadow: 0 0 0 0 rgba(249, 115, 22, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(249, 115, 22, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(249, 115, 22, 0);
  }
}

@keyframes checkbox-check {
  0% {
    transform: scale(0) rotate(-45deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0);
    opacity: 1;
  }
}

@keyframes text-complete {
  0% {
    transform: translateX(0);
  }
  20% {
    transform: translateX(10px);
  }
  40% {
    transform: translateX(-10px);
  }
  60% {
    transform: translateX(5px);
  }
  80% {
    transform: translateX(-5px);
  }
  100% {
    transform: translateX(0);
  }
}

@keyframes task-complete {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-2px);
  }
  100% {
    transform: translateY(0);
  }
}

.animate-checkbox-ripple {
  animation: checkbox-ripple 0.6s ease-out;
}

.animate-checkbox-check {
  animation: checkbox-check 0.3s ease-out forwards;
}

.animate-text-complete {
  animation: text-complete 0.6s ease-in-out;
}

.animate-task-complete {
  animation: task-complete 0.3s ease-in-out;
}
`; 