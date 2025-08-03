import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Helmet } from 'react-helmet-async';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
  username: '',
  password: '',
  remember: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const redirectMessage = location.state?.message;
  const redirectPath = location.state?.from || '/dashboard';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(formData.username, formData.password, formData.remember);
      navigate(redirectPath);
    } catch (err: any) {
      const message =
        err.response?.data?.detail ||
        'Sunucuya bağlanırken bir hata oluştu. Lütfen bilgilerinizi kontrol edin.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Giriş Yap | FocusFlow</title>
        <meta name="description" content="FocusFlow hesabınıza giriş yapın ve kişiselleştirilmiş çalışma planınıza erişin." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
          <Link to="/" className="mb-8 relative group flex items-center space-x-1">
            <span className="text-4xl font-black bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
              Focus
            </span>
            <span className="text-4xl font-black text-orange-500">Flow</span>
          </Link>

          <div className="w-full max-w-md bg-white/80 dark:bg-gray-800/80 rounded-2xl p-8 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
            <div className="text-center space-y-2 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tekrar Hoş Geldiniz</h2>
              <p className="text-gray-600 dark:text-gray-400">Hesabınıza giriş yapın ve çalışmaya devam edin</p>
            </div>

            {redirectMessage && (
              <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-900/30 rounded-xl text-orange-600 dark:text-orange-400 text-sm text-center animate-fadeIn">
                {redirectMessage}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Kullanıcı  Adı</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  placeholder="mehmetcan"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Şifre</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                />
                <label htmlFor="remember" className="text-sm text-gray-700 dark:text-gray-300">Beni hatırla</label>
              </div>

              {error && (
                <div className="text-sm text-red-500 dark:text-red-400 text-center bg-red-50 dark:bg-red-900/20 rounded-lg py-2">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-orange-500/20 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Giriş yapılıyor...
                  </div>
                ) : (
                  'Giriş Yap'
                )}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">veya</span>
                </div>
              </div>

              <button
                type="button"
                className="w-full px-4 py-3 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-800 font-medium flex items-center justify-center gap-2"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                Google ile devam et
              </button>

              <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-8">
                Hesabınız yok mu?{' '}
                <Link to="/register" className="font-medium text-orange-500 hover:text-orange-600 dark:hover:text-orange-400">
                  Hemen kaydolun
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
