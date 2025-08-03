import { Link, useLocation } from 'react-router-dom';
import { Bot, Calendar, Home, ListTodo, Target, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { getMe } from '../services/auth';

interface User {
  first_name: string;
  username: string;
  role: string;
}

const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    getMe()
      .then(setUser)
      .catch((err) => {
        console.error("Kullanıcı bilgisi alınamadı:", err);
      });
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const isHomePage =
    location.pathname === '/' ||
    location.pathname === '/login' ||
    location.pathname === '/register';

  const navItems = !isHomePage
    ? [
        { path: '/', icon: Home, label: 'Ana Sayfa' },
        { path: '/calendar', icon: Calendar, label: 'Takvim' },
        { path: '/tasks', icon: ListTodo, label: 'Görevler' },
        { path: '/goals', icon: Target, label: 'Hedefler' },
        { path: '/ai-assistant', icon: Bot, label: 'AI Asistan' },
      ]
    : [];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetPosition = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-700/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="relative group flex items-center space-x-1">
            <span className="text-3xl font-black bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
              Focus
            </span>
            <div className="relative">
              <span className="text-3xl font-black text-orange-500">Flow</span>
              <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-orange-500 to-orange-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {isHomePage ? (
              <>
                <button onClick={() => scrollToSection('features')} className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  Özellikler
                </button>
                <button onClick={() => scrollToSection('how-it-works')} className="text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                  Nasıl Çalışır?
                </button>
              </>
            ) : (
              <>
                {navItems.map((item) => (
                  <Link key={item.path} to={item.path} className={`flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                    isActive(item.path)
                      ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
                      : 'text-gray-600 hover:text-orange-600 dark:text-gray-300 dark:hover:text-orange-400'
                  }`}>
                    <item.icon size={18} className="mr-2" />
                    {item.label}
                  </Link>
                ))}
                {user && (
                  <span className="text-sm text-orange-600 dark:text-orange-400 font-semibold px-4 py-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                    {user.username}
                  </span>
                )}
              </>
            )}
            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400">
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
