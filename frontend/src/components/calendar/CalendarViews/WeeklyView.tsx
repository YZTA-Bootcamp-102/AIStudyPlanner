import React, { useEffect, useRef, useState } from 'react';
import { format, addDays, startOfWeek, isSameDay, startOfDay, areIntervalsOverlapping } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { CalendarTask } from '../../../types/calendar';
import CalendarTaskDetail from '../CalendarTaskDetail';
import WeeklyViewNav from './WeeklyViewNav';

interface WeeklyViewProps {
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

const WeeklyView: React.FC<WeeklyViewProps> = ({ selectedDate, tasks, onDayClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentTimeRef = useRef<HTMLDivElement>(null);
  // Haftanın başlangıç gününü al (Pazartesi)
  const startDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
  
  // Haftanın günlerini oluştur
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  // Saatleri oluştur (00:00 - 23:00)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Gün için görevleri filtrele ve sırala
  const getTasksForDay = (date: Date) => {
    return tasks
      .filter(task => isSameDay(new Date(task.startTime), date))
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  };

  // Çakışan görevleri grupla
  const getOverlappingGroups = (tasks: CalendarTask[]) => {
    const groups: CalendarTask[][] = [];
    
    tasks.forEach(task => {
      const taskInterval = {
        start: new Date(task.startTime),
        end: new Date(task.endTime)
      };
      
      let foundGroup = false;
      
      for (const group of groups) {
        const hasOverlap = group.some(groupTask => {
          const groupTaskInterval = {
            start: new Date(groupTask.startTime),
            end: new Date(groupTask.endTime)
          };
          return areIntervalsOverlapping(taskInterval, groupTaskInterval);
        });
        
        if (hasOverlap) {
          group.push(task);
          foundGroup = true;
          break;
        }
      }
      
      if (!foundGroup) {
        groups.push([task]);
      }
    });
    
    return groups;
  };

  const today = startOfDay(new Date());
  const [selectedTask, setSelectedTask] = useState<CalendarTask | null>(null);

  // Scroll to current time on initial load
  useEffect(() => {
    if (containerRef.current) {
      const currentHour = new Date().getHours();
      const scrollPosition = currentHour * 60 - window.innerHeight / 3;
      containerRef.current.scrollTop = scrollPosition;
    }
  }, []);

  // Update current time line position
  useEffect(() => {
    const updateCurrentTimePosition = () => {
      if (currentTimeRef.current) {
        const now = new Date();
        const minutes = now.getHours() * 60 + now.getMinutes();
        currentTimeRef.current.style.top = `${minutes}px`;
      }
    };

    updateCurrentTimePosition();
    const interval = setInterval(updateCurrentTimePosition, 60000);

    return () => clearInterval(interval);
  }, []);

  // Görevin yüksekliğini ve konumunu hesapla
  const calculateTaskPosition = (task: CalendarTask, groupIndex: number, totalGroups: number) => {
    const startTime = new Date(task.startTime);
    const endTime = new Date(task.endTime);
    const startMinutes = startTime.getHours() * 60 + startTime.getMinutes();
    const endMinutes = endTime.getHours() * 60 + endTime.getMinutes();
    const duration = Math.min(endMinutes - startMinutes, 24 * 60 - startMinutes); // 24 saati geçmesin

    const width = `${95 / totalGroups}%`; // 95% toplam genişlik
    const left = `${(groupIndex * 95) / totalGroups}%`;

    return {
      top: `${startMinutes}px`,
      height: `${duration}px`,
      width,
      left
    };
  };

  return (
    <>
      <WeeklyViewNav selectedDate={selectedDate} onDateChange={onDayClick} />
      <div 
        ref={containerRef}
        className="relative h-[calc(100vh-16rem)] overflow-y-auto bg-white dark:bg-gray-800 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800/50"
      >
        <div className="min-w-[1200px]">
          {/* Gün başlıkları */}
          <div className="grid grid-cols-[4rem_repeat(7,1fr)] bg-white dark:bg-gray-800 sticky top-0 z-10">
            <div className="p-2 border-b border-r border-gray-200 dark:border-gray-700" />
            {weekDays.map((date) => {
              const isCurrentDay = isSameDay(date, today);
              const isSelected = isSameDay(date, selectedDate);
              
              return (
                <div
                  key={date.toISOString()}
                  onClick={() => onDayClick(date)}
                  className={`
                    p-4 text-center border-b border-r border-gray-200 dark:border-gray-700 
                    cursor-pointer transition-colors
                    ${isSelected
                      ? 'bg-orange-50 dark:bg-orange-900/20'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }
                  `}
                >
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {format(date, 'EEEE', { locale: tr })}
                  </div>
                  <div className={`
                    inline-flex items-center justify-center w-8 h-8 rounded-full mt-1
                    text-base font-semibold
                    ${isCurrentDay
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-700 dark:text-gray-200'
                    }
                  `}>
                    {format(date, 'd')}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Saatler ve görevler */}
          <div className="relative">
            {/* Current time line */}
            <div
              ref={currentTimeRef}
              className="absolute left-[4rem] right-0 flex items-center z-20 pointer-events-none"
              style={{ display: 'none' }} // Will be shown only for today's column
            >
              <div className="w-2 h-2 rounded-full bg-red-500 -ml-1" />
              <div className="flex-1 h-0.5 bg-red-500" />
            </div>

            {hours.map(hour => (
              <div key={hour} className="grid grid-cols-[4rem_repeat(7,1fr)]">
                {/* Saat etiketi */}
                <div className="h-[60px] p-1 text-right border-r border-b border-gray-200 dark:border-gray-700">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 pr-2">
                    {format(new Date().setHours(hour, 0), 'HH:mm')}
                  </span>
                </div>

                {/* Günlük sütunlar */}
                {weekDays.map(date => {
                  const isCurrentDay = isSameDay(date, today);
                  const dayTasks = getTasksForDay(date);
                  const taskGroups = getOverlappingGroups(dayTasks);

                  return (
                    <div
                      key={date.toISOString()}
                      className={`
                        relative h-[60px] border-r border-b border-gray-200 dark:border-gray-700
                        ${isCurrentDay ? 'bg-orange-50/30 dark:bg-orange-900/5' : ''}
                      `}
                    >
                      {/* Show current time line only in today's column */}
                      {isCurrentDay && hour === 0 && (
                        <div
                          className="absolute left-0 right-0 flex items-center z-20 pointer-events-none"
                          style={{ 
                            top: `${new Date().getHours() * 60 + new Date().getMinutes()}px`
                          }}
                        >
                          <div className="w-2 h-2 rounded-full bg-red-500 -ml-1" />
                          <div className="flex-1 h-0.5 bg-red-500" />
                        </div>
                      )}
                      
                      {hour === 0 && taskGroups.map((group, groupIndex) => (
                        <React.Fragment key={groupIndex}>
                          {group.map((task, taskIndex) => {
                            const { top, height, width, left } = calculateTaskPosition(task, taskIndex, group.length);
                            const colors = categoryColors[task.category as keyof typeof categoryColors];
                            
                            return (
                              <div
                                key={task.id}
                                onClick={() => setSelectedTask(task)}
                                className={`
                                  absolute px-2 py-1 rounded
                                  shadow-sm hover:shadow-md transition-all cursor-pointer group
                                  z-10 text-xs
                                  ${priorityColors[task.priority].bg} border-l-2 ${priorityColors[task.priority].border}
                                `}
                                style={{ top, height, width, left }}
                              >
                                <div className="h-full overflow-hidden">
                                  <h4 className={`font-semibold truncate ${priorityColors[task.priority].text}`}>
                                    {task.title}
                                  </h4>
                                  {parseInt(height) >= 40 ? (
                                    <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                      {format(new Date(task.startTime), 'HH:mm', { locale: tr })} - 
                                      {format(new Date(task.endTime), 'HH:mm', { locale: tr })}
                                    </p>
                                  ) : (
                                    <div className="opacity-0 group-hover:opacity-100 absolute top-0 left-full ml-2 bg-gray-800 dark:bg-gray-700 text-white p-2 rounded shadow-lg z-20 whitespace-nowrap">
                                      <p className="font-medium">{task.title}</p>
                                      <p className="text-xs">
                                        {format(new Date(task.startTime), 'HH:mm', { locale: tr })} - 
                                        {format(new Date(task.endTime), 'HH:mm', { locale: tr })}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </React.Fragment>
                      ))}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      <CalendarTaskDetail
        isOpen={selectedTask !== null}
        onClose={() => setSelectedTask(null)}
        task={selectedTask as CalendarTask}
        onSave={(updatedTask) => {
          console.log('Task updated:', updatedTask);
        }}
      />
    </>
  );
};

export default WeeklyView; 