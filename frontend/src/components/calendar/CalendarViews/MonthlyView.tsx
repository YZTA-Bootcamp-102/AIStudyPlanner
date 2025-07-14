import React, { useState } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek, startOfDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { CalendarTask } from '../../../types/calendar';
import MonthlyViewNav from './MonthlyViewNav';

interface MonthlyViewProps {
  selectedDate: Date;
  tasks: CalendarTask[];
  onDayClick: (date: Date) => void;
}

// Görev kategorilerine göre renkler
const categoryColors = {
  study: { bg: 'bg-blue-100 dark:bg-blue-900/30', border: 'border-blue-500' },
  exam: { bg: 'bg-red-100 dark:bg-red-900/30', border: 'border-red-500' },
  meeting: { bg: 'bg-purple-100 dark:bg-purple-900/30', border: 'border-purple-500' },
  break: { bg: 'bg-green-100 dark:bg-green-900/30', border: 'border-green-500' },
  homework: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', border: 'border-yellow-500' },
  project: { bg: 'bg-indigo-100 dark:bg-indigo-900/30', border: 'border-indigo-500' },
  reading: { bg: 'bg-pink-100 dark:bg-pink-900/30', border: 'border-pink-500' },
  exercise: { bg: 'bg-teal-100 dark:bg-teal-900/30', border: 'border-teal-500' },
  other: { bg: 'bg-gray-100 dark:bg-gray-900/30', border: 'border-gray-500' }
} as const;

// Görev önceliklerine göre renkler
const priorityColors = {
  low: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', border: 'border-emerald-500', text: 'text-gray-800 dark:text-gray-100' },
  medium: { bg: 'bg-amber-100 dark:bg-amber-900/30', border: 'border-amber-500', text: 'text-gray-800 dark:text-gray-100' },
  high: { bg: 'bg-rose-100 dark:bg-rose-900/30', border: 'border-rose-500', text: 'text-gray-800 dark:text-gray-100' }
} as const;

const MonthlyView: React.FC<MonthlyViewProps> = ({ selectedDate, tasks, onDayClick }) => {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(selectedDate));

  // Ayın başlangıç ve bitiş günlerini al
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  // Takvim görünümü için başlangıç ve bitiş günlerini al
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  // Takvim günlerini oluştur
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  // Gün için görevleri filtrele ve sırala
  const getTasksForDay = (date: Date) => {
    return tasks
      .filter(task => isSameDay(new Date(task.startTime), date))
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
  };

  const today = startOfDay(new Date());

  // Takvim hücrelerini 6x7 grid olarak oluştur
  const weeks = Array.from({ length: 6 }, (_, weekIndex) =>
    days.slice(weekIndex * 7, (weekIndex + 1) * 7)
  );

  return (
    <>
      <MonthlyViewNav selectedDate={currentMonth} onDateChange={handleMonthChange} />
      <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800/50">
        {/* Gün isimleri */}
        <div className="grid grid-cols-7 bg-white dark:bg-gray-800">
          {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map(day => (
            <div
              key={day}
              className="p-3 text-center text-sm font-medium text-gray-500 dark:text-gray-400"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Takvim günleri */}
        <div className="grid grid-rows-6 h-[calc(100%-48px)]">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="grid grid-cols-7">
              {week.map(date => {
                const dayTasks = getTasksForDay(date);
                const isSelected = isSameDay(date, selectedDate);
                const isCurrentDay = isSameDay(date, today);
                const isCurrentMonth = isSameMonth(date, selectedDate);

                return (
                  <div
                    key={date.toISOString()}
                    onClick={() => onDayClick(date)}
                    className={`
                      bg-white dark:bg-gray-800 p-2
                      transition-all cursor-pointer border-r border-b border-gray-200 dark:border-gray-700
                      ${!isCurrentMonth ? 'opacity-50' : ''}
                      ${isSelected
                        ? 'ring-2 ring-orange-500 ring-inset'
                        : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                      }
                    `}
                  >
                    {/* Gün numarası */}
                    <div className="flex justify-between items-center mb-1">
                      <div
                        className={`
                          flex items-center justify-center w-7 h-7 rounded-full
                          font-medium text-sm
                          ${isCurrentDay
                            ? 'bg-orange-500 text-white'
                            : 'text-gray-700 dark:text-gray-200'
                          }
                        `}
                      >
                        {format(date, 'd')}
                      </div>
                      {dayTasks.length > 0 && (
                        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          {dayTasks.length}
                        </span>
                      )}
                    </div>

                    {/* Görevler */}
                    <div className="space-y-1">
                      {dayTasks.slice(0, 3).map((task) => {
                        const colors = priorityColors[task.priority];
                        return (
                          <div
                            key={task.id}
                            className={`
                              text-xs p-1 rounded truncate
                              ${colors.bg} border-l-2 ${colors.border}
                            `}
                          >
                            <div className="flex items-center justify-between">
                              <span className={`font-medium truncate ${colors.text}`}>
                                {task.title}
                              </span>
                              <span className="text-gray-500 dark:text-gray-400 ml-1 shrink-0">
                                {format(new Date(task.startTime), 'HH:mm')}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                      {dayTasks.length > 3 && (
                        <div className="text-xs text-center text-orange-500 dark:text-orange-400 font-medium">
                          +{dayTasks.length - 3}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default MonthlyView; 