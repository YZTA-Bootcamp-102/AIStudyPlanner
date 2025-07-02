import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white/90 dark:bg-gray-800/90 rounded-2xl p-6 backdrop-blur-sm
        shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/20">
            <div className="text-2xl text-orange-500">🔒</div>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Giriş Sayfası
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Bu sayfa yakında eklenecektir
            </p>
          </div>
          <Link
            to="/dashboard"
            className="block w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl
              transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/20 
              text-center font-medium"
          >
            Giriş Yap
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 