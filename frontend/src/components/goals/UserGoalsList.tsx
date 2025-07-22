import React from 'react';
import type { StudyPlan } from '../../data/exampleStudyPlans';

interface UserGoalsListProps {
  goals: (StudyPlan & { progress: number; createdAt: Date; answers?: Record<string, string> })[];
  onViewGoal: (goal: StudyPlan & { progress: number; createdAt: Date; answers?: Record<string, string> }) => void;
}

const UserGoalsList: React.FC<UserGoalsListProps> = ({ goals, onViewGoal }) => {
  if (goals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900 mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-orange-500 dark:text-orange-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Henüz Hedef Oluşturmadınız
        </h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          Yukarıdaki örnek planlardan birini seçin veya kendinize özel bir çalışma planı oluşturun.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <div
          key={goal.id}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer"
          onClick={() => onViewGoal(goal)}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{goal.title}</h3>
            <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
              {goal.answers?.['current-grade'] || goal.answers?.['grade-level'] || 'Özel Plan'}
            </span>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4">{goal.description}</p>

          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-500 dark:text-gray-400">İlerleme</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {goal.progress}%
            </span>
          </div>

          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-orange-500 dark:bg-orange-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${goal.progress}%` }}
            ></div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              {goal.createdAt.toLocaleDateString()}
            </div>
            {goal.answers?.['study-hours'] || goal.answers?.['study-time'] ? (
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                    clipRule="evenodd"
                  />
                </svg>
                {goal.answers?.['study-hours'] || goal.answers?.['study-time']} saat/gün
              </div>
            ) : null}
          </div>

          {goal.answers && (
            <div className="mt-4 flex flex-wrap gap-2">
              {Object.entries(goal.answers)
                .filter(([key]) => !['study-hours', 'study-time', 'current-grade', 'grade-level'].includes(key))
                .slice(0, 3)
                .map(([key, value], index) => (
                  <span
                    key={key}
                    className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300 px-3 py-1 rounded-full text-sm"
                  >
                    {value}
                  </span>
                ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserGoalsList; 