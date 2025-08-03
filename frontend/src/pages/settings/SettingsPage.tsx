import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Sun, Moon, Bell, User, Lock, Trash2 } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { getMe } from "../../services/auth";
import TermsOfService from "../legal/TermsOfService";
import PrivacyPolicy from "../legal/PrivacyPolicy";

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [user, setUser] = useState<{ first_name?: string; username?: string } | null>(null);

  useEffect(() => {
    getMe()
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const handleNotificationToggle = () => {
    setNotificationsEnabled((prev) => !prev);
    // TODO: Backend API çağrısı ile bildirim ayarı kaydedilebilir
  };

  return (
    <>
      <Helmet>
        <title>Settings | FocusFlow</title>
        <meta name="description" content="Kullanıcı ayarlarını yönetebileceğiniz sayfa." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white pt-20 px-4">
        <div className="max-w-4xl mx-auto space-y-10">
          <h1 className="text-4xl font-bold">Ayarlar</h1>

          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border dark:border-gray-700">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-4">
                <User className="text-orange-500" />
                <h2 className="text-xl font-semibold">Profil Bilgileri</h2>
              </div>
              <p><strong>Kullanıcı Adı:</strong> {user?.username || "Yükleniyor..."}</p>
              <p><strong>İsim:</strong> {user?.first_name || "Belirtilmemiş"}</p>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sun className="text-orange-500" />
                <h3 className="text-lg font-semibold">Tema</h3>
              </div>
              <button
                onClick={toggleTheme}
                className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition"
              >
                {theme === "light" ? "Karanlık Moda Geç" : "Aydınlık Moda Geç"}
              </button>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="text-orange-500" />
                <h3 className="text-lg font-semibold">Bildirimler</h3>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notificationsEnabled}
                  onChange={handleNotificationToggle}
                  className="form-checkbox h-5 w-5 text-orange-500"
                />
                <span className="ml-2">Bildirimleri Etkinleştir</span>
              </label>
            </div>
          </section>

          <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border dark:border-gray-700 space-y-4">
            <div className="flex items-center gap-3">
              <Lock className="text-orange-500" />
              <h3 className="text-lg font-semibold">Gizlilik</h3>
            </div>
            <PrivacyPolicy />
            <TermsOfService />
            <button className="text-red-600 hover:underline flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              Hesabımı Sil
            </button>
          </section>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
