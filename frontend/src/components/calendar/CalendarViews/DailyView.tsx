import React, { useEffect, useRef, useState } from 'react';
import { format, isSameDay, areIntervalsOverlapping, startOfDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import type { CalendarTask, PriorityType } from '../../../types/calendar';
import CalendarTaskDetail from '../CalendarTaskDetail';
import DailyViewNav from './DailyViewNav';

interface DailyViewProps {
  selectedDate: Date;
  tasks: CalendarTask[];
  onDateChange: (date: Date) => void;
}

// Görev önceliklerine göre renkler
const priorityColors = {
  low: { bg: 'bg-emerald-100 dark:bg-emerald-900/30', border: 'border-emerald-500', text: 'text-gray-800 dark:text-gray-100' },
  medium: { bg: 'bg-amber-100 dark:bg-amber-900/30', border: 'border-amber-500', text: 'text-gray-800 dark:text-gray-100' },
  high: { bg: 'bg-rose-100 dark:bg-rose-900/30', border: 'border-rose-500', text: 'text-gray-800 dark:text-gray-100' }
} as const;

const DailyView: React.FC<DailyViewProps> = ({ selectedDate, tasks, onDateChange }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const currentTimeRef = useRef<HTMLDivElement>(null);
  const isToday = isSameDay(selectedDate, startOfDay(new Date()));
  const [selectedTask, setSelectedTask] = useState<CalendarTask | null>(null);

  // Saatleri oluştur (00:00 - 23:00)
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Günün görevlerini filtrele
  const dayTasks = tasks.filter(task =>
    isSameDay(new Date(task.startTime), selectedDate)
  );

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

  const taskGroups = getOverlappingGroups(dayTasks);

  // Görevin konumunu hesapla
  const calculateTaskPosition = (task: CalendarTask, groupIndex: number, totalGroups: number) => {
    const startHour = new Date(task.startTime).getHours();
    const startMinute = new Date(task.startTime).getMinutes();
    const endHour = new Date(task.endTime).getHours();
    const endMinute = new Date(task.endTime).getMinutes();
    
    const top = startHour * 60 + startMinute;
    const height = (endHour - startHour) * 60 + (endMinute - startMinute);
    const width = `${85 / totalGroups}%`; // 85% toplam genişlik
    const left = `${(groupIndex * 85) / totalGroups + 15}%`; // 15% sol boşluk
    
    return { top, height, width, left };
  };

  useEffect(() => {
    if (containerRef.current && isToday) {
      const currentHour = new Date().getHours();
      const scrollPosition = currentHour * 60 - window.innerHeight / 3;
      containerRef.current.scrollTop = scrollPosition;
    }
  }, [isToday]);

  useEffect(() => {
    const updateCurrentTimePosition = () => {
      if (currentTimeRef.current && isToday) {
        const now = new Date();
        const minutes = now.getHours() * 60 + now.getMinutes();
        currentTimeRef.current.style.top = `${minutes}px`;
      }
    };

    updateCurrentTimePosition();
    const interval = setInterval(updateCurrentTimePosition, 60000);

    return () => clearInterval(interval);
  }, [isToday]);

  const handleTaskClick = (task: CalendarTask) => {
    setSelectedTask(task);
  };

  return (
    <>
      <DailyViewNav selectedDate={selectedDate} onDateChange={onDateChange} />
    <div 
      ref={containerRef}
      className="relative h-[calc(100vh-16rem)] overflow-y-auto bg-white dark:bg-gray-800 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-100 dark:scrollbar-track-gray-800/50"
    >
      {/* Saat çizgileri ve etiketleri */}
      <div className="absolute inset-0">
        {hours.map(hour => (
          <div
            key={hour}
            className="relative h-[60px] border-t border-gray-200 dark:border-gray-700"
          >
              <span className="absolute top-1 left-2 text-xs font-medium text-gray-500 dark:text-gray-400 w-[10%]">
              {format(new Date().setHours(hour, 0), 'HH:mm')}
            </span>
          </div>
        ))}
      </div>

      {/* Şu anki zaman çizgisi */}
      {isToday && (
        <div
          ref={currentTimeRef}
          className="absolute left-[15%] right-0 flex items-center z-20 pointer-events-none"
        >
          <div className="w-2 h-2 rounded-full bg-red-500 -ml-1" />
          <div className="flex-1 h-0.5 bg-red-500" />
        </div>
      )}

      {/* Görevler */}
        <div className="absolute inset-0">
          {taskGroups.flatMap((group, groupIndex) =>
            group.map((task, taskIndex) => {
            const { top, height, width, left } = calculateTaskPosition(task, taskIndex, group.length);
            
            return (
              <div
                  key={`${groupIndex}-${taskIndex}-${task.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleTaskClick(task);
                  }}
                style={{ 
                  top: `${top}px`,
                  height: `${height}px`,
                  width,
                  left,
                }}
                className={`
                  absolute p-2 rounded-lg shadow-lg transition-all
                    hover:shadow-xl hover:z-10 cursor-pointer group
                    ${priorityColors[task.priority as PriorityType].bg} border-l-4 ${priorityColors[task.priority as PriorityType].border}
                `}
              >
                <div className="h-full overflow-hidden">
                  <h4 className={`font-semibold text-sm truncate ${priorityColors[task.priority as PriorityType].text}`}>
                    {task.title}
                  </h4>
                    {height >= 50 ? (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
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
            })
          )}
        </div>
    </div>
      <CalendarTaskDetail
        isOpen={selectedTask !== null}
        onClose={() => setSelectedTask(null)}
        task={selectedTask}
        onSave={(updatedTask) => {
          console.log('Task updated:', updatedTask);
        }}
      />
    </>
  );
};

export default DailyView; 