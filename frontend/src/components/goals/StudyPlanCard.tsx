import React from 'react';

interface StudyPlanCardProps {
  title: string;
  description: string;
  onClick: () => void;
  isCustom?: boolean;
  icon?: React.ReactNode;
}

const StudyPlanCard: React.FC<StudyPlanCardProps> = ({
  title,
  description,
  onClick,
  isCustom = false,
  icon,
}) => {
  return (
    <div
      className={`group relative overflow-hidden bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border-2 hover:border-orange-500 dark:hover:border-orange-400 transition-all duration-300 cursor-pointer transform hover:-translate-y-1 ${
        isCustom ? 'border-orange-500 dark:border-orange-400' : 'border-gray-100 dark:border-gray-700'
      }`}
      onClick={onClick}
    >
      <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16">
        <div className="absolute inset-0 bg-orange-500 opacity-20 dark:opacity-30 rounded-full blur-3xl group-hover:opacity-30 dark:group-hover:opacity-40 transition-opacity"></div>
      </div>

      <div className="relative">
        <div className="flex items-center mb-6">
          <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
            isCustom 
              ? 'bg-orange-500 text-white' 
              : 'bg-orange-100 dark:bg-orange-900/30 text-orange-500 dark:text-orange-400'
          }`}>
            {icon || (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isCustom ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                )}
              </svg>
            )}
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>

        {isCustom && (
          <div className="mt-6 inline-flex items-center text-orange-500 dark:text-orange-400 font-medium">
            <span>Özel Plan Oluştur</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyPlanCard; 