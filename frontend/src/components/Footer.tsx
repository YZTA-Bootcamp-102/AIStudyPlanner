import { Link } from 'react-router-dom';
import { Github } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 py-8 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/5 dark:to-orange-900/10 blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center space-y-6">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-1"
          >
            <span className="text-2xl font-black bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
              AI
            </span>
            <span className="text-2xl font-black text-orange-500">Planner</span>
          </Link>

          {/* GitHub Link */}
          <a
            href="https://github.com/YZTA-Bootcamp-102/AIStudyPlanner"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-xl
              text-gray-700 dark:text-gray-300 hover:text-orange-500 dark:hover:text-orange-400
              transition-all duration-300 group hover:scale-105"
          >
            <Github className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>GitHub'da İncele</span>
          </a>

          {/* Copyright */}
          <div className="text-center space-y-2">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              © {currentYear} AIPlanner. Bu proje YZTA Bootcamp kapsamında geliştirilmiştir.
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Link to="/privacy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                Gizlilik
              </Link>
              <span className="text-gray-300 dark:text-gray-600">•</span>
              <Link to="/terms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
                Kullanım Şartları
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 