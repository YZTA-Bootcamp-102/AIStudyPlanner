import React from 'react';
import { format, addWeeks, subWeeks, startOfWeek, addDays } from 'date-fns';
import { tr } from 'date-fns/locale';

interface WeeklyViewNavProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const WeeklyViewNav: React.FC<WeeklyViewNavProps> = ({ selectedDate, onDateChange }) => {
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = addDays(weekStart, 6);

  const handlePreviousWeek = () => {
    const newDate = subWeeks(weekStart, 1);
    onDateChange(newDate);
  };

  const handleNextWeek = () => {
    const newDate = addWeeks(weekStart, 1);
    onDateChange(newDate);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={handlePreviousWeek}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-100"
      >
        <span className="sr-only">Önceki hafta</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div className="text-center">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          {format(weekStart, 'd', { locale: tr })} - {format(weekEnd, 'd MMMM yyyy', { locale: tr })}
        </h2>
      </div>

      <button
        onClick={handleNextWeek}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-100"
      >
        <span className="sr-only">Sonraki hafta</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default WeeklyViewNav; 