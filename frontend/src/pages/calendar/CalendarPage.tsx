import React, { useState, useEffect } from 'react';
import { format, addDays, subDays, isSameDay, parse, startOfDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import DailyView from '../../components/calendar/CalendarViews/DailyView';
import WeeklyView from '../../components/calendar/CalendarViews/WeeklyView';
import MonthlyView from '../../components/calendar/CalendarViews/MonthlyView';
import { mockTasks } from '../../data/mockCalendarData';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, useNavigate } from 'react-router-dom';

type ViewType = 'daily' | 'weekly' | 'monthly';

const CalendarPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dateParam = searchParams.get('date');

  // URL'den tarihi al veya bugünün tarihini kullan
  const initialDate = dateParam 
    ? startOfDay(parse(dateParam, 'yyyy-MM-dd', new Date()))
    : startOfDay(new Date());

  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [view, setView] = useState<ViewType>('daily');

  // URL'deki tarih değiştiğinde selectedDate'i güncelle
  useEffect(() => {
    if (dateParam) {
      const parsedDate = startOfDay(parse(dateParam, 'yyyy-MM-dd', new Date()));
      setSelectedDate(parsedDate);
    }
  }, [dateParam]);

  const formatDateForUrl = (date: Date): string => {
    return format(date, 'yyyy-MM-dd');
  };

  const handleDayClick = (date: Date) => {
    const localDate = startOfDay(date);
    setSelectedDate(localDate);
    // URL'yi güncelle
    navigate(`/calendar?date=${formatDateForUrl(localDate)}`);
    // Sadece aylık görünümden bir güne tıklandığında günlük görünüme geç
    if (view === 'monthly') {
      setView('daily');
    }
  };

  const handleDateChange = (date: Date) => {
    const localDate = startOfDay(date);
    setSelectedDate(localDate);
    // URL'yi güncelle
    navigate(`/calendar?date=${formatDateForUrl(localDate)}`);
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