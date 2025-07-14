import React, { useState } from 'react';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import DailyView from '../../components/calendar/CalendarViews/DailyView';
import WeeklyView from '../../components/calendar/CalendarViews/WeeklyView';
import MonthlyView from '../../components/calendar/CalendarViews/MonthlyView';
import { mockTasks } from '../../data/mockCalendarData';
import { Helmet } from 'react-helmet-async';

type ViewType = 'daily' | 'weekly' | 'monthly';

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<ViewType>('daily');

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    // Sadece aylık görünümden bir güne tıklandığında günlük görünüme geç
    if (view === 'monthly') {
      setView('daily');
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <>
      <Helmet>
        <title>Takvim | FocusFlow</title>
        <meta name="description" content="FocusFlow takviminde çalışma programınızı planlayın, etkinliklerinizi yönetin ve hedeflerinizi takip edin." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-xl border border-gray-100 dark:border-gray-700 mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="flex items-center space-x-6">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-2xl">
                <CalendarIcon size={36} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                  Takvim
                </h1>
                <p className="text-xl text-gray-500 dark:text-gray-400">
                  Çalışma programınızı planlayın ve takip edin
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setView('daily')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    view === 'daily'
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400'
                  }`}
                >
                  Günlük
                </button>
                <button
                  onClick={() => setView('weekly')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    view === 'weekly'
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400'
                  }`}
                >
                  Haftalık
                </button>
                <button
                  onClick={() => setView('monthly')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    view === 'monthly'
                      ? 'bg-orange-500 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400'
                  }`}
                >
                  Aylık
                </button>
              </div>
            </div>
          </div>

          {/* Calendar View */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            {view === 'daily' && (
              <DailyView 
                selectedDate={selectedDate} 
                tasks={mockTasks} 
                onDateChange={handleDateChange}
              />
            )}
            {view === 'weekly' && (
              <WeeklyView
                selectedDate={selectedDate}
                tasks={mockTasks}
                onDayClick={handleDayClick}
              />
            )}
            {view === 'monthly' && (
              <MonthlyView
                selectedDate={selectedDate}
                tasks={mockTasks}
                onDayClick={handleDayClick}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CalendarPage; 