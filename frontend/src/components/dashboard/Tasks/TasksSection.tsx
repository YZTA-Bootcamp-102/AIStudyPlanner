// components/dashboard/Tasks/TasksSection.tsx
import React, { useState, useEffect } from 'react';
import { ListTodo, ChevronRight, Clock, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format, parseISO, isSameDay, isAfter } from 'date-fns';
import type { DailyTaskOut } from '../../../types/dailyTask';
import { getTodayDailyTasks, completeDailyTask } from '../../../services/dailyTasks';

interface TasksSectionProps {
  onTaskToggle: (taskId: number) => void;
}

const MAX_VISIBLE_TASKS = 5;

const TasksSection = ({ onTaskToggle }: TasksSectionProps) => {
  const [tasks, setTasks] = useState<DailyTaskOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompleted, setShowCompleted] = useState(false);
  const [animatingTaskId, setAnimatingTaskId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true);
        const data = await getTodayDailyTasks();
        setTasks(data);
      } catch (err) {
        console.error('Görevler yüklenemedi:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  const completedTasks = tasks.filter(t => t.is_completed);
  const pendingTasks = tasks.filter(t => !t.is_completed);
  const totalTasks = tasks.length;
  const visibleTasks = showCompleted ? tasks : pendingTasks;
  const displayTasks = visibleTasks.slice(0, MAX_VISIBLE_TASKS);
  const hasMoreTasks = visibleTasks.length > MAX_VISIBLE_TASKS;

  const completionPercentage = totalTasks > 0
    ? (completedTasks.length / totalTasks) * 100
    : 0;

  const isOverdue = (task: DailyTaskOut) => {
    const dt = parseISO(task.date + 'T' + (task.start_time ?? '23:59:59'));
    return isAfter(new Date(), dt) && !task.is_completed;
  };

  const formatTaskTime = (task: DailyTaskOut) => {
    return task.start_time ? format(parseISO(`${task.date}T${task.start_time}`), 'HH:mm') : '';
  };

  const handleToggle = async (task: DailyTaskOut) => {
    setAnimatingTaskId(task.id);
    try {
      const updated = await completeDailyTask(task.id);
      setTasks(prev => prev.map(t => (t.id === task.id ? updated : t)));
      onTaskToggle(task.id);
    } catch (err) {
      console.error('Görev güncelleme hatası:', err);
    } finally {
      setTimeout(() => setAnimatingTaskId(null), 800);
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-4 animate-pulse" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-200 dark:bg-gray-700 rounded mb-2 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg">
            <ListTodo size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bugünün Görevleri</h2>
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
                className="text-sm text-gray-500 hover:text-orange-500 dark:text-gray-400 dark:hover:text-orange-400 flex items-center"
              >
                {showCompleted ? (
                  <>
                    <EyeOff size={16} className="mr-1" /> Tamamlananları Gizle
                  </>
                ) : (
                  <>
                    <Eye size={16} className="mr-1" /> Tamamlananları Göster
                  </>
                )}
              </button>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
            </>
          )}
          <Link
            to="/tasks"
            className="text-sm text-orange-500 hover:text-orange-600 font-medium flex items-center"
          >
            Tümünü Gör <ChevronRight size={16} className="ml-1" />
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

      {/* Task List */}
      <div className="space-y-3">
        {displayTasks.length > 0 ? (
          displayTasks.map((task) => {
            const overdue = isOverdue(task);
            const anim = animatingTaskId === task.id;

            return (
              <div
                key={task.id}
                className={`flex items-center justify-between p-4 rounded-xl transition-all duration-300 ${
                  overdue ? 'border-l-4 border-red-500' : ''
                } ${anim ? 'bg-orange-50 dark:bg-orange-800/20' : ''}`}
              >
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => handleToggle(task)}
                    className={`w-6 h-6 flex items-center justify-center border-2 rounded-full transition-all duration-300 ${
                      task.is_completed
                        ? 'bg-orange-500 border-orange-500'
                        : 'border-gray-300 dark:border-gray-600 hover:border-orange-500'
                    }`}
                  >
                    {task.is_completed && <Check size={14} className="text-white" />}
                  </button>
                  <span
                    className={`font-medium transition-all duration-300 ${
                      task.is_completed
                        ? 'text-gray-400 dark:text-gray-500 line-through'
                        : 'text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {task.title}
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  {overdue && (
                    <span className="text-xs text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/40 px-2 py-0.5 rounded-full flex items-center space-x-1">
                      <AlertCircle size={12} /> <span>Süresi Geçti</span>
                    </span>
                  )}
                  <Clock
                    size={14}
                    className={
                      task.is_completed
                        ? 'text-gray-400'
                        : overdue
                        ? 'text-red-500'
                        : 'text-orange-500'
                    }
                  />
                  <span
                    className={
                      task.is_completed
                        ? 'text-gray-400'
                        : overdue
                        ? 'text-red-500'
                        : 'text-gray-600 dark:text-gray-400'
                    }
                  >
                    {formatTaskTime(task)}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8">
            {pendingTasks.length === 0 && completedTasks.length > 0 ? (
              <div className="flex flex-col items-center">
                <ListTodo size={24} className="text-gray-400 mb-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Bugün için görev yok
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Tüm görevler tamamlandı
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <ListTodo size={24} className="text-gray-400 mb-2" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Henüz görevin yok
                </h3>
                <Link
                  to="/tasks"
                  className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl mt-4 transition-colors duration-200"
                >
                  Görev Oluştur
                </Link>
              </div>
            )}
          </div>
        )}

        {hasMoreTasks && (
          <Link
            to="/tasks"
            className="block text-center text-sm text-orange-500 hover:text-orange-600 mt-4"
          >
            {visibleTasks.length - MAX_VISIBLE_TASKS} görev daha →
          </Link>
        )}
      </div>
    </div>
  );
};

export default TasksSection;
