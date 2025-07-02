import { CheckCircle2, Target, Timer, BookOpen, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

// Zaman bazlı selamlama fonksiyonu
const getTimeBasedGreeting = (userName: string = 'Mehmet') => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return `Günaydın ${userName}! ☀️`;
  } else if (hour >= 12 && hour < 17) {
    return `İyi günler ${userName}! 🌤️`;
  } else if (hour >= 17 && hour < 21) {
    return `İyi akşamlar ${userName}! 🌅`;
  } else {
    return `İyi geceler ${userName}! 🌙`;
  }
};

interface DailyStats {
  totalTasks: number;
  completedTasks: number;
  remainingTasks: number;
  completionRate: number;
  overdueTaskCount: number;
  studyTime: string;
  focusRate: number;
}

interface StatsSectionProps {
  dailyStats: DailyStats;
}

const StatsSection = ({ dailyStats }: StatsSectionProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="flex items-center mb-6 md:mb-0">
          <div className="mr-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {getTimeBasedGreeting()}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {format(new Date(), 'd MMMM yyyy, EEEE', { locale: tr })}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <BookOpen size={20} className="text-blue-500" />
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                {dailyStats.totalTasks}
              </span>
            </div>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
              Toplam Görev
            </p>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <CheckCircle2 size={20} className="text-emerald-500" />
              <span className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {dailyStats.completedTasks}
              </span>
            </div>
            <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
              Tamamlanan
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Target size={20} className="text-orange-500" />
              <span className="text-xl font-bold text-orange-600 dark:text-orange-400">
                {dailyStats.remainingTasks}
              </span>
            </div>
            <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">
              Bekleyen
            </p>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <AlertCircle size={20} className="text-red-500" />
              <span className="text-xl font-bold text-red-600 dark:text-red-400">
                {dailyStats.overdueTaskCount}
              </span>
            </div>
            <p className="text-sm text-red-600 dark:text-red-400 font-medium">
              Süresi Geçen
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <Timer size={20} className="text-purple-500" />
              <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                {dailyStats.studyTime}
              </span>
            </div>
            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
              Çalışma Süresi
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-6 bg-gray-100 dark:bg-gray-700 rounded-full h-2">
        <div 
          className="h-2 rounded-full bg-gradient-to-r from-orange-500 to-orange-400 transition-all duration-500 ease-in-out"
          style={{ width: `${dailyStats.completionRate}%` }}
        >
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">Günlük İlerleme</span>
        <span className="font-medium text-orange-500">%{Math.round(dailyStats.completionRate)}</span>
      </div>
    </div>
  );
};

export default StatsSection; 