import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import type { ReactNode } from 'react';
import {
  loginApi,
  registerApi,
  getMe,
  setTokens,
  clearTokens as clearTokensService,
} from '../services/auth';
import type { TokenResponse } from '../types/auth';

interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  login: (email: string, password: string, remember?: boolean) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isInitialized: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // localStorage'daki 'isLogout' flag'ini kontrol et ve state'e ata
  const [isLoggingOut, setIsLoggingOut] = useState(
    localStorage.getItem('isLogout') === 'true'
  );

  const [user, setUser] = useState<any>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const login = useCallback(
    async (email: string, password: string, remember = false) => {
      const { access_token, refresh_token }: TokenResponse = await loginApi(
        email,
        password,
        remember
      );
      setTokens(access_token, refresh_token);
      localStorage.removeItem('isLogout'); // login olunca logout flag kaldır
      setIsLoggingOut(false);
      const me = await getMe();
      setUser(me);
    },
    []
  );

  const register = useCallback(async (data: any) => {
    await registerApi(data);
  }, []);

  const logout = useCallback(() => {
    clearTokensService();
    localStorage.setItem('isLogout', 'true'); // logout flag'ini sakla
    setIsLoggingOut(true);
    setUser(null);
    setIsInitialized(false);
    window.location.href = '/login'; // yönlendirme
  }, []);

  const initializeUser = useCallback(async () => {
    if (isLoggingOut) {
      // Logout olmuşuz, getMe çağırma
      setUser(null);
      setIsInitialized(true);
      return;
    }

    const accessToken = localStorage.getItem('access');
    if (!accessToken) {
      // Token yoksa kullanıcı yok say
      setUser(null);
      setIsInitialized(true);
      return;
    }

    try {
      const me = await getMe();
      setUser(me);
    } catch {
      clearTokensService();
      localStorage.setItem('isLogout', 'true');
      setUser(null);
    } finally {
      setIsInitialized(true);
    }
  }, [isLoggingOut]);

  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        isInitialized,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
