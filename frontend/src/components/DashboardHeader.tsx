import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Home, LogOut, Settings, User, Menu, X, Bot, ListTodo, Sun, Moon, Target } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../contexts/AuthContext';
import { getMe } from '../services/auth';

interface User {
  first_name: string;
  username: string;
  role: string;
}

const DashboardHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch((err) => {
        console.error('Kullanıcı bilgisi alınamadı:', err);
        setUser(null);
      });
  }, []);

  const userName = user?.username || 'Kullanıcı'; // Güvenli erişim ve default isim

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return false;
  });
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleThemeToggle = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark', !isDark);
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isActivePath = (path: string) => location.pathname === path;

  const menuItems = [
    { path: '/dashboard', icon: Home, label: 'Ana Sayfa' },
    { path: '/calendar', icon: Calendar, label: 'Takvim' },
    { path: '/tasks', icon: ListTodo, label: 'Görevler' },
    { path: '/goals', icon: Target, label: 'Hedefler' },
    { path: '/ai-assistant', icon: Bot, label: 'AI Asistan' },
    { path: '/weekly-reviews', icon: Bot, label: 'AI Retrospektif' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/dashboard" className="relative group flex items-center space-x-1">
              <div className="relative">
                <span className="text-3xl font-black bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                  Focus
                </span>
              </div>
              <div className="relative">
                <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                  Flow
                </span>
                <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`relative px-4 py-2 rounded-xl transition-all duration-200 group ${
                    isActivePath(item.path)
                      ? 'text-orange-500 dark:text-orange-400'
                      : 'text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <item.icon size={18} />
                    <span className="font-medium">{item.label}</span>
                  </span>
                  {isActivePath(item.path) && (
                    <div className="absolute inset-0 bg-orange-500/10 dark:bg-orange-500/20 rounded-xl"></div>
                  )}
                  <div className="absolute inset-0 rounded-xl bg-orange-500/10 dark:bg-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </Link>
              ))}

              <div className="pl-4 flex items-center space-x-3 ml-4 border-l border-gray-200 dark:border-gray-700">
                {/* User Profile Button */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-3 px-4 py-2.5 rounded-xl
                      bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700
                      hover:from-orange-50 hover:to-orange-100 dark:hover:from-orange-900/20 dark:hover:to-orange-800/20
                      border border-gray-200/50 dark:border-gray-600/50 hover:border-orange-200 dark:hover:border-orange-700
                      text-gray-700 dark:text-gray-200 transition-all duration-300 group shadow-sm hover:shadow-md"
                  >
                    <div
                      className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 
                      flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300
                      group-hover:scale-105"
                    >
                      <User size={18} className="text-white" />
                    </div>
                    <div className="flex flex-col items-start">
                      <span
                        className="font-semibold text-gray-900 dark:text-white group-hover:text-orange-600 
                        dark:group-hover:text-orange-400 transition-colors duration-200"
                      >
                        {userName}
                      </span>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div
                      className="absolute right-0 mt-3 w-48 bg-white/95 dark:bg-gray-800/95 rounded-2xl 
                      shadow-xl backdrop-blur-xl py-2 border border-gray-200/50 dark:border-gray-700/50
                      transform transition-all duration-300 animate-in slide-in-from-top-2"
                    >
                      <div className="space-y-1">
                        <button
                          onClick={handleThemeToggle}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 
                            dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 w-full group transition-colors duration-200 rounded-lg mx-1"
                        >
                          <div
                            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center
                            group-hover:bg-orange-100 dark:group-hover:bg-orange-900/20 transition-colors duration-200"
                          >
                            {isDark ? (
                              <Sun
                                size={16}
                                className="text-gray-500 group-hover:text-orange-500 transition-colors duration-200"
                              />
                            ) : (
                              <Moon
                                size={16}
                                className="text-gray-500 group-hover:text-orange-500 transition-colors duration-200"
                              />
                            )}
                          </div>
                          <span className="group-hover:text-orange-500 transition-colors duration-200">
                            {isDark ? 'Açık Tema' : 'Koyu Tema'}
                          </span>
                        </button>
                        <Link
                          to="/settings"
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 
                            dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-orange-900/10 group transition-colors duration-200 rounded-lg mx-1"
                        >
                          <div
                            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center
                            group-hover:bg-orange-100 dark:group-hover:bg-orange-900/20 transition-colors duration-200"
                          >
                            <Settings
                              size={16}
                              className="text-gray-500 group-hover:text-orange-500 transition-colors duration-200"
                            />
                          </div>
                          <span className="group-hover:text-orange-500 transition-colors duration-200">Ayarlar</span>
                        </Link>
                        <div className="border-t border-gray-100 dark:border-gray-700 mx-2"></div>
                        <button
                          onClick={handleLogout}
                          className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 
                            dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/10 w-full group transition-colors duration-200 rounded-lg mx-1"
                        >
                          <div
                            className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center
                            group-hover:bg-red-100 dark:group-hover:bg-red-900/20 transition-colors duration-200"
                          >
                            <LogOut
                              size={16}
                              className="text-gray-500 group-hover:text-red-500 transition-colors duration-200"
                            />
                          </div>
                          <span className="group-hover:text-red-500 transition-colors duration-200">Çıkış Yap</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl
                hover:bg-orange-50 dark:hover:bg-orange-900/10 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X size={20} className="text-gray-600 dark:text-gray-300" />
              ) : (
                <Menu size={20} className="text-gray-600 dark:text-gray-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                    isActivePath(item.path)
                      ? 'bg-orange-50 dark:bg-orange-900/10 text-orange-500'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/10'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
              <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-200 dark:border-gray-700">
                <ThemeToggle />
                <button
                  onClick={() => {
                    setIsDropdownOpen(!isDropdownOpen);
                    setIsMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-gray-600 
                    dark:text-gray-300 hover:bg-orange-50 dark:hover:bg-orange-900/10"
                >
                  <div
                    className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/20 
                    flex items-center justify-center"
                  >
                    <User size={16} className="text-orange-500" />
                  </div>
                  <span className="font-medium">{userName}</span>
                </button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;
