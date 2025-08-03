import { Plus, Brain, Calendar, Target, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickAction {
  title: string;
  icon: React.ElementType;
  path: string;
}

const QuickActionsSection = () => {
  const quickActions: QuickAction[] = [
    { title: 'Yeni Görev', icon: Plus, path: '/tasks' },
    { title: 'AI Asistan', icon: Brain, path: '/ai-assistant' },
    { title: 'Takvimi Görüntüle', icon: Calendar, path: '/calendar' },
    { title: 'Hedef Belirle', icon: Target, path: '/goals' },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Rocket size={20} className="mr-2 text-orange-500" />
          Hızlı İşlemler
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickActions.map((action, index) => (
          <Link
            key={index}
            to={action.path}
            className="group relative flex flex-col items-center justify-center p-4 rounded-xl bg-gradient-to-br from-orange-50 to-orange-100/50 dark:from-orange-900/10 dark:to-orange-800/5 hover:from-orange-100 hover:to-orange-200/50 dark:hover:from-orange-800/20 dark:hover:to-orange-700/10 transition-all duration-300"
          >
            {/* Hover Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 to-orange-500/0 group-hover:from-orange-500/5 group-hover:to-orange-500/10 dark:group-hover:from-orange-400/10 dark:group-hover:to-orange-400/20 transition-all duration-300 rounded-xl"></div>
            
            {/* Icon */}
            <div className="relative mb-2 transform group-hover:-translate-y-0.5 transition-transform duration-300">
              <div className="relative text-orange-500 dark:text-orange-400 group-hover:text-orange-600 dark:group-hover:text-orange-300 transition-colors duration-300">
                <action.icon size={24} />
              </div>
            </div>
            
            {/* Title */}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
              {action.title}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActionsSection; 