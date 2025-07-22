import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import { CalendarIcon, ChevronRight, CheckCircle2, StickyNote, Loader2, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import 'react-calendar/dist/Calendar.css';
import { format, startOfDay, parseISO, isSameDay } from 'date-fns';
import { mockTasks } from '../../../data/mockCalendarData';
import type { CalendarTask } from '../../../types/calendar';

interface CalendarData {
  [key: string]: number;
}

interface CalendarSectionProps {
  calendarData: CalendarData;
}

const CalendarSection = ({ calendarData }: CalendarSectionProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDateTasks, setSelectedDateTasks] = useState<CalendarTask[]>([]);

  useEffect(() => {
    const loadTasks = async () => {
      setIsLoading(true);
      
      // Simüle edilmiş API gecikmesi
      await new Promise(resolve => setTimeout(resolve, 700));
      
      // Seçili güne ait görevleri filtrele
      const tasksForDay = mockTasks.filter(task => 
        isSameDay(parseISO(task.startTime), selectedDate)
      );

      setSelectedDateTasks(tasksForDay);
      setIsLoading(false);
    };

    loadTasks();
  }, [selectedDate]);

  const formatDateForUrl = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  const tileContent = ({ date }: { date: Date }) => {
    const dateStr = formatDateForUrl(date);
    const eventCount = calendarData[dateStr];

    if (eventCount) {
      return (
        <div className="absolute bottom-1 left-0 right-0 flex justify-center">
          <div className="flex space-x-0.5">
            {[...Array(Math.min(eventCount, 3))].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-orange-500 rounded-full"></div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  const tileClassName = ({ date, view }: { date: Date; view: string }) => {
    const dateStr = formatDateForUrl(date);
    const hasEvents = calendarData[dateStr];
    const isSelected = selectedDate && startOfDay(date).getTime() === startOfDay(selectedDate).getTime();
    const isToday = startOfDay(date).getTime() === startOfDay(new Date()).getTime();

    let classes = 'relative group hover:bg-orange-50 dark:hover:bg-orange-500/10';

    if (isSelected) {
      classes += ' selected-date';
    }
    if (isToday) {
      classes += ' today';
    }
    if (hasEvents) {
      classes += ' has-events';
    }

    return classes;
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTaskTime = (timeStr: string): string => {
    const date = parseISO(timeStr);
    return format(date, 'HH:mm');
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mr-3 shadow-sm">
              <CalendarIcon size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Takvimim
              </h2>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Günlük planlarını ve etkinliklerini görüntüle
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
      
      <div className="calendar-container mb-6">
        <Calendar
          onChange={(value) => setSelectedDate(value as Date)}
          value={selectedDate}
          tileContent={tileContent}
          tileClassName={tileClassName}
          className="rounded-xl border-none shadow-none"
          locale="tr-TR"
          formatMonthYear={(locale, date) => {
            return date.toLocaleDateString('tr-TR', { month: 'long', year: 'numeric' });
          }}
          formatShortWeekday={(locale, date) => {
            return date.toLocaleDateString('tr-TR', { weekday: 'short' }).slice(0, 3);
          }}
        />
      </div>

      {/* Seçili Gün Detayları */}
      <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-medium text-gray-900 dark:text-white">
            {formatDate(selectedDate)}
          </h3>
          <Link 
            to={`/calendar?date=${formatDateForUrl(selectedDate)}`}
            className="text-sm text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 flex items-center group"
          >
            Tüm detayları gör
            <ChevronRight size={16} className="ml-1 transition-transform duration-200 group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="space-y-4">
          {/* Görevler Bölümü */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex items-center">
                <CheckCircle2 size={16} className="mr-2 text-orange-500" />
                Görevler
              </h4>
            </div>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="w-5 h-5 text-orange-500 animate-spin" />
              </div>
            ) : selectedDateTasks.length > 0 ? (
              <div className="space-y-2">
                {selectedDateTasks.slice(0, 2).map((task, index) => (
                  <div 
                    key={task.id}
                    className="group relative flex items-center justify-between p-3 bg-gradient-to-br from-gray-50 to-gray-50/50 dark:from-gray-700/50 dark:to-gray-700/30 hover:from-orange-50 hover:to-orange-50/50 dark:hover:from-orange-900/10 dark:hover:to-orange-800/5 rounded-xl border border-gray-200/50 dark:border-gray-600/50 hover:border-orange-200 dark:hover:border-orange-700 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-orange-500/10 dark:group-hover:from-orange-400/10 dark:group-hover:to-orange-400/20 transition-all duration-300 rounded-xl"></div>
                    
                    <div className="relative flex items-center space-x-3">
                      <button
                        className={`relative w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                          task.completed
                            ? 'bg-orange-500 border-orange-500'
                            : 'border-gray-300 dark:border-gray-600 group-hover:border-orange-500'
                        }`}
                      >
                        {task.completed && (
                          <Check size={12} className="text-white" />
                        )}
                      </button>
                      <span className={`text-sm transition-all duration-300 ${
                        task.completed 
                          ? 'text-gray-400 dark:text-gray-500 line-through' 
                          : 'text-gray-700 dark:text-gray-200'
                      }`}>
                        {task.title}
                      </span>
                    </div>
                    
                    <div className="relative flex items-center">
                      <span className={`text-xs transition-colors duration-200 ${
                        task.completed 
                          ? 'text-gray-400 dark:text-gray-500' 
                          : 'text-gray-600 dark:text-gray-400'
                      }`}>
                        {formatTaskTime(task.startTime)}
                      </span>
                    </div>
                  </div>
                ))}
                {selectedDateTasks.length > 2 && (
                  <Link 
                    to={`/calendar?date=${formatDateForUrl(selectedDate)}`}
                    className="block text-xs text-orange-500 hover:text-orange-600 dark:hover:text-orange-400 text-center py-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors duration-200"
                  >
                    +{selectedDateTasks.length - 2} görev daha
                  </Link>
                )}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200/50 dark:border-gray-600/50">
                <CheckCircle2 size={20} className="text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">
                  Bu gün için görev yok
                </p>
                <button className="px-4 py-2 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors duration-200">
                  Görev Ekle
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

      <style>{`
        .calendar-container .react-calendar {
            width: 100%;
            background: transparent;
            border: none;
            font-family: inherit;
          }

        .calendar-container .react-calendar button {
          padding: 8px;
          margin: 0;
          background: none;
          transition: all 0.2s;
            position: relative;
          border: none;
          outline: none;
          font-size: 0.875rem;
        }
        
        .calendar-container .react-calendar button:enabled:hover {
          background-color: rgb(255 237 213);
          color: rgb(234 88 12);
        }

        .calendar-container .react-calendar button:disabled {
          background: none;
          color: #9ca3af;
        }

        .calendar-container .react-calendar__navigation {
          height: 40px;
          margin-bottom: 0.5rem;
        }

        .calendar-container .react-calendar__navigation button {
          min-width: 40px;
          background: none;
          font-size: 1.25rem;
          padding: 0;
          }

        .calendar-container .react-calendar__navigation button:enabled:hover,
        .calendar-container .react-calendar__navigation button:enabled:focus {
          background-color: rgb(255 237 213);
          color: rgb(234 88 12);
        }

        .calendar-container .react-calendar__month-view__weekdays {
          text-align: center;
          text-transform: uppercase;
          font-weight: 600;
          font-size: 0.75rem;
          color: #9ca3af;
          padding-bottom: 0.5rem;
        }
        
        .calendar-container .react-calendar__month-view__weekdays abbr {
          text-decoration: none;
          border: none;
          }

        .calendar-container .react-calendar__month-view__days button {
          height: 36px;
          font-size: 0.875rem;
          padding: 0;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .calendar-container .react-calendar__month-view__days button.today {
          background-color: rgb(255 237 213);
          color: rgb(234 88 12);
          font-weight: 500;
          }

        /* Seçili gün stilleri */
        .calendar-container .react-calendar__tile--active,
        .calendar-container .react-calendar__tile--active:enabled:hover,
        .calendar-container .react-calendar__tile--active:enabled:focus,
        .calendar-container .react-calendar__month-view__days button.selected-date,
        .calendar-container .react-calendar__month-view__days button.selected-date:enabled:hover,
        .calendar-container .react-calendar__month-view__days button.selected-date:enabled:focus {
          background-color: rgb(249 115 22) !important;
          color: white !important;
          font-weight: 500;
        }
        
        .calendar-container .react-calendar__month-view__days button.has-events {
          font-weight: 500;
          }

        .calendar-container .react-calendar__tile {
          padding: 0.5em 0.75em;
          position: relative;
          height: 40px;
        }

        .calendar-container .react-calendar__month-view__days__day--neighboringMonth {
          color: #9ca3af;
        }

        .calendar-container .react-calendar__navigation button[disabled] {
          background-color: transparent;
          opacity: 0.5;
        }

        /* Seçili gün için ek stiller */
        .calendar-container .react-calendar__tile:enabled:focus,
        .calendar-container .react-calendar__tile:enabled:hover {
          background-color: rgb(255 237 213);
          color: rgb(234 88 12);
        }

        .calendar-container .react-calendar__tile--active,
        .calendar-container .react-calendar__tile--active:enabled:focus {
          background-color: rgb(249 115 22) !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default CalendarSection; 