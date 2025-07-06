<<<<<<< HEAD
const CalendarPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
=======
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const CalendarPage = () => {
  return (
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
                Tüm eğitim planınızı görüntüleyin ve yönetin
              </p>
            </div>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
>>>>>>> 4577c2aa087f97e10b63df66ef2af811e62c3090
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Takvim
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Bu özellik yakında eklenecek! Takvim ile etkinliklerinizi planlayabilecek ve çalışma programınızı düzenleyebileceksiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarPage; 