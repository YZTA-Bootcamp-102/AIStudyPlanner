import { Link, useLocation } from 'react-router-dom';
import { Bot, Calendar, Home, ListTodo } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const isHomePage = location.pathname === '/' || 
    location.pathname === '/login' || 
    location.pathname === '/register';

  const navItems = !isHomePage ? [
    { path: '/', icon: Home, label: 'Ana Sayfa' },
    { path: '/calendar', icon: Calendar, label: 'Takvim' },
    { path: '/tasks', icon: ListTodo, label: 'Görevler' },
    { path: '/ai-assistant', icon: Bot, label: 'AI Asistan' }
  ] : [];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="relative group flex items-center space-x-1"
          >
            <span className="text-3xl font-black bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
              AI
            </span>
            <div className="relative">
              <span className="text-3xl font-black text-orange-500">Planner</span>
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isHomePage ? (
              <>
                <button
                  onClick={() => scrollToSection('features')}
                  className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  Özellikler
                </button>
                <button
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                >
                  Nasıl Çalışır?
                </button>
              </>
            ) : (
              navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                      : 'text-gray-600 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400'
                  }`}
                >
                  <item.icon size={18} className="mr-2" />
                  {item.label}
                </Link>
              ))
            )}
            <div className="pl-4 flex items-center space-x-4">
              <ThemeToggle />
              <Link
                to="/login"
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
              >
                Giriş Yap
              </Link>
              <Link
                to="/register"
                className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl
                  transition-all duration-300 transform hover:scale-105 hover:shadow-[0_10px_30px_rgba(249,115,22,0.3)]
                  relative overflow-hidden group"
              >
                <span className="relative z-10">Ücretsiz Başla</span>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-700 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4">
              {isHomePage ? (
                <>
                  <button
                    onClick={() => scrollToSection('features')}
                    className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                  >
                    Özellikler
                  </button>
                  <button
                    onClick={() => scrollToSection('how-it-works')}
                    className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                  >
                    Nasıl Çalışır?
                  </button>
                </>
              ) : (
                navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                      isActive(item.path)
                        ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                        : 'text-gray-600 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400'
                    }`}
                  >
                    <item.icon size={18} className="mr-2" />
                    {item.label}
                  </Link>
                ))
              )}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                <ThemeToggle />
                <div className="flex items-center space-x-4">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    to="/register"
                    className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl
                      transition-all duration-300 transform hover:scale-105 hover:shadow-[0_10px_30px_rgba(249,115,22,0.3)]"
                  >
                    Ücretsiz Başla
                  </Link>
                </div>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header; 