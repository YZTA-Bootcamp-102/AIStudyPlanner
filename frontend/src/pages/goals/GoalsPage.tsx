import DashboardHeader from '../../components/DashboardHeader';

const GoalsPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-xl border border-gray-100 dark:border-gray-700">
          <div className="flex items-center space-x-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-2xl">

              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <circle cx="12" cy="12" r="6"></circle>
                <circle cx="12" cy="12" r="2"></circle>
              </svg>
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                Hedeflerim
              </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400">
                Eğitim hedeflerinizi belirleyin ve takip edin
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalsPage; 