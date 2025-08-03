import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Helmet } from 'react-helmet-async';
import { isSameDay, parseISO } from 'date-fns';
import DashboardHeader from '../../components/DashboardHeader';
import { mockTasks } from '../../data/mockCalendarData';
import { getMe } from '../../services/auth';

const StatsSection = lazy(() => import('../../components/dashboard/Stats/StatsSection'));
const QuickActionsSection = lazy(() => import('../../components/dashboard/QuickActions/QuickActionsSection'));
const TasksSection = lazy(() => import('../../components/dashboard/Tasks/TasksSection'));
const AIChatSection = lazy(() => import('../../components/dashboard/AIChat/AIChatSection'));
const CalendarSection = lazy(() => import('../../components/dashboard/Calendar/CalendarSection'));
const NotesSection = lazy(() => import('../../components/dashboard/Notes/NotesSection'));

interface User {
  first_name: string;
  username: string;
  role: string;
}

const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch((err) => {
        console.error('Kullanıcı bilgisi alınamadı:', err);
      });
  }, []);

  const todaysTasks = mockTasks.filter((task) =>
    isSameDay(parseISO(task.startTime), new Date())
  );

  const completedTasks = todaysTasks.filter((task) => task.completed);
  const pendingTasks = todaysTasks.filter((task) => !task.completed);
  const overdueTaskCount = todaysTasks.filter(
    (task) => !task.completed && new Date() > parseISO(task.startTime)
  ).length;

  const completionRate =
    todaysTasks.length > 0 ? (completedTasks.length / todaysTasks.length) * 100 : 0;

  const dailyStats = {
    totalTasks: todaysTasks.length,
    completedTasks: completedTasks.length,
    remainingTasks: pendingTasks.length,
    completionRate,
    overdueTaskCount,
    focusRate: 85,
  };

  const initialNotes = [
    { id: 1, text: 'Matematik sınavı için formülleri tekrar et', date: '2024-03-20' },
    { id: 2, text: 'Fizik projesi için kaynak araştırması yap', date: '2024-03-21' },
  ];

  const StatsSkeleton = () => (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 mb-8">
      <div className="h-12 w-full bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse mb-4" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Dashboard | FocusFlow</title>
        <meta
          name="description"
          content="FocusFlow dashboard'ınızda çalışma planınızı görüntüleyin."
        />
      </Helmet>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
        <div className="container mx-auto px-4 py-8">
          <DashboardHeader />

          {user ? (
            <Suspense fallback={<StatsSkeleton />}>
              <StatsSection userFirstName={user.first_name} />
            </Suspense>
          ) : (
            <StatsSkeleton />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Suspense fallback={<div>Yükleniyor...</div>}>
                <QuickActionsSection />
              </Suspense>
              <Suspense fallback={<div>Yükleniyor...</div>}>
                <TasksSection onTaskToggle={(id) => console.log('Task toggle:', id)} />
              </Suspense>
              <Suspense fallback={<div>Yükleniyor...</div>}>
                <AIChatSection />
              </Suspense>
            </div>

            <div className="space-y-6">
              <Suspense fallback={<div>Yükleniyor...</div>}>
                <CalendarSection />
              </Suspense>
              <Suspense fallback={<div>Yükleniyor...</div>}>
                <NotesSection initialNotes={initialNotes} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;