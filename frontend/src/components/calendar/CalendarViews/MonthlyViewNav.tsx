import React from 'react';
import { format, addMonths, subMonths, startOfMonth } from 'date-fns';
import { tr } from 'date-fns/locale';

interface MonthlyViewNavProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

const MonthlyViewNav: React.FC<MonthlyViewNavProps> = ({ selectedDate, onDateChange }) => {
  const handlePreviousMonth = () => {
    const newDate = startOfMonth(subMonths(selectedDate, 1));
    onDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = startOfMonth(addMonths(selectedDate, 1));
    onDateChange(newDate);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={handlePreviousMonth}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-100"
      >
        <span className="sr-only">Önceki ay</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
        {format(selectedDate, 'MMMM yyyy', { locale: tr })}
      </h2>

      <button
        onClick={handleNextMonth}
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-100"
      >
        <span className="sr-only">Sonraki ay</span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default MonthlyViewNav; 