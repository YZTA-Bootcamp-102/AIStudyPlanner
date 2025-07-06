import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import DashboardHeader from './components/DashboardHeader';
import HomePage from './pages/home/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import CalendarPage from './pages/calendar/CalendarPage';
import TasksPage from './pages/tasks/TasksPage';
import AIAssistantPage from './pages/ai-assistant/AIAssistantPage';
import Footer from './components/Footer';
import { useEffect } from 'react';
<<<<<<< HEAD
=======
import GoalsPage from './pages/goals/GoalsPage';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
>>>>>>> 4577c2aa087f97e10b63df66ef2af811e62c3090

// ScrollToTop component to scroll to top on route change
function ScrollToTop() {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);
  return null;
}

const AppContent = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith('/dashboard') ||
    location.pathname.startsWith('/calendar') ||
    location.pathname.startsWith('/tasks') ||
    location.pathname.startsWith('/settings') ||
<<<<<<< HEAD
    location.pathname.startsWith('/ai-assistant');
=======
    location.pathname.startsWith('/ai-assistant') ||
    location.pathname.startsWith('/goals');
>>>>>>> 4577c2aa087f97e10b63df66ef2af811e62c3090

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <ScrollToTop />
      {isDashboardRoute ? <DashboardHeader /> : <Header />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
<<<<<<< HEAD
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
=======
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
          <Route path="/calendar" element={
            <ProtectedRoute>
              <CalendarPage />
            </ProtectedRoute>
          } />
          <Route path="/tasks" element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          } />
          <Route path="/goals" element={
            <ProtectedRoute>
              <GoalsPage />
            </ProtectedRoute>
          } />
          <Route path="/ai-assistant" element={
            <ProtectedRoute>
              <AIAssistantPage />
            </ProtectedRoute>
          } />
>>>>>>> 4577c2aa087f97e10b63df66ef2af811e62c3090
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App = () => {
  return (
    <Router>
<<<<<<< HEAD
      <AppContent />
=======
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
>>>>>>> 4577c2aa087f97e10b63df66ef2af811e62c3090
    </Router>
  );
};

export default App;
