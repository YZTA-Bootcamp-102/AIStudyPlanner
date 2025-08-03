import { Link } from 'react-router-dom';
import { useState } from 'react';
import {
  Zap,
  Target,
  Bot,
  Brain,
  LineChart,
  Smartphone,
  BookOpen,
  Bell,
  Flag,
  ChevronDown
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const HomePage = () => {
  const [subject, setSubject] = useState('');

  const scrollToFeatures = () => {
    const element = document.getElementById('features');
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>FocusFlow | Yapay Zeka Destekli Çalışma Asistanı</title>
        <meta name="description" content="FocusFlow ile çalışmalarınızı planlayın, hedeflerinizi takip edin ve yapay zeka asistanımızla verimli çalışın." />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 dark:from-gray-900 dark:to-gray-800">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 -right-96 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-orange-200/30 to-orange-500/30 dark:from-orange-500/10 dark:to-orange-500/20 blur-3xl" />
            <div className="absolute -bottom-96 -left-96 w-[800px] h-[800px] rounded-full bg-gradient-to-tr from-orange-200/30 to-orange-500/30 dark:from-orange-500/10 dark:to-orange-500/20 blur-3xl" />
          </div>

          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-16">
                <h1 className="text-5xl md:text-7xl font-black mb-8 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                  Yapay Zeka ile
                  <br />
                  <span className="text-orange-500">Akıllı Ders Çalışma</span>
                  <br />
                  Asistanınız
                </h1>
                <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                FocusFlow, yapay zeka teknolojisi ile öğrenme stilinize ve hedeflerinize özel
                  çalışma programları oluşturur. Daha verimli çalışın, daha iyi sonuçlar alın.
                </p>
              </div>

              <div className="max-w-2xl mx-auto mb-16">
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-2 shadow-[0_20px_50px_rgba(249,115,22,0.15)] dark:shadow-orange-500/5">
                  <div className="flex items-center space-x-2 bg-orange-50 dark:bg-gray-700/50 rounded-xl p-4">
                    <input
                      type="text"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Hangi ders için plan oluşturmak istersiniz?"
                      className="flex-1 bg-transparent border-0 outline-none text-gray-900 dark:text-white placeholder-gray-400 text-lg h-12"
                    />
                    <Link
                      to="/register"
                      className="relative px-8 py-4 text-white font-medium rounded-xl overflow-hidden group
                        transform transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_30px_rgba(249,115,22,0.3)]"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 transition-transform duration-300 group-hover:scale-105"></div>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-orange-600 to-orange-700 transition-opacity duration-300"></div>
                      <span className="relative z-10">Plan Oluştur</span>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <FeatureHighlight
                  icon={<Zap className="w-6 h-6" />}
                  title="Hızlı ve Kolay"
                  description="Saniyeler içinde kişiselleştirilmiş çalışma planınızı alın"
                />
                <FeatureHighlight
                  icon={<Target className="w-6 h-6" />}
                  title="Hedef Odaklı"
                  description="Başarıya ulaşmanız için optimize edilmiş programlar"
                />
                <FeatureHighlight
                  icon={<Bot className="w-6 h-6" />}
                  title="AI Asistan"
                  description="7/24 yapay zeka destekli öğrenme asistanı"
                />
              </div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <button
            onClick={scrollToFeatures}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 p-2 rounded-full hover:bg-orange-100 dark:hover:bg-orange-500/10 transition-colors"
            aria-label="Özelliklere git"
          >
            <ChevronDown className="w-8 h-8 text-orange-500 animate-bounce" />
          </button>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-900/10 blur-3xl" />
          </div>

          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-20">
              <h2 className="inline-block text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent py-4">
                Özellikler
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mt-8">
              FocusFlow'ın yapay zeka destekli özellikleri ile çalışmalarınızı en verimli şekilde planlayın.
                Size özel olarak tasarlanmış çalışma programı ile başarıya ulaşın.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <FeatureCard
                icon={<Brain />}
                title="Akıllı Analiz"
                description="Öğrenme stilinizi analiz eder ve size özel çalışma teknikleri önerir"
              />
              <FeatureCard
                icon={<LineChart />}
                title="Adaptif Planlama"
                description="İlerleyişinize göre planınızı otomatik olarak günceller"
              />
              <FeatureCard
                icon={<Smartphone />}
                title="Her Yerde Erişim"
                description="Mobil uyumlu arayüz ile her yerden çalışma planınıza erişin"
              />
              <FeatureCard
                icon={<BookOpen />}
                title="Konu Takibi"
                description="Çalıştığınız konuları ve ilerlemenizi detaylı olarak takip edin"
              />
              <FeatureCard
                icon={<Bell />}
                title="Akıllı Hatırlatıcılar"
                description="Çalışma zamanınızı en verimli şekilde planlamanıza yardımcı olur"
              />
              <FeatureCard
                icon={<Flag />}
                title="Hedef Yönetimi"
                description="Kısa ve uzun vadeli hedeflerinizi belirleyin ve takip edin"
              />
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-32 bg-gradient-to-b from-orange-50 to-white dark:from-gray-800 dark:to-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-900/20 dark:to-orange-900/10 blur-3xl" />
          </div>

          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="inline-block text-4xl md:text-5xl font-bold text-center bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent py-4 w-full">
                Nasıl Çalışır?
              </h2>
              <div className="space-y-24 mt-20">
                <StepCard
                  number="1"
                  title="Profil Oluşturun"
                  description="Çalışma alışkanlıklarınızı, hedeflerinizi ve tercihlerinizi belirleyin. AI sistemimiz size özel bir öğrenme profili oluşturur."
                />
                <StepCard
                  number="2"
                  title="AI Analizi"
                  description="Yapay zeka sistemi verilerinizi analiz eder, öğrenme stilinizi belirler ve kişiselleştirilmiş bir çalışma planı oluşturur."
                />
                <StepCard
                  number="3"
                  title="Günlük Takip"
                  description="AI asistanınız ilerlemenizi takip eder, performansınızı analiz eder ve planınızı sürekli optimize eder."
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32 bg-gradient-to-r from-orange-500 to-orange-600 relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full bg-white/10 blur-3xl" />
          </div>

          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center text-white">
              <h2 className="text-4xl md:text-5xl font-bold mb-8">
                Başarıya Giden Yolculuğunuz Başlasın
              </h2>
              <p className="text-xl mb-12 opacity-90">
                Hemen ücretsiz hesap oluşturun ve AI destekli çalışma planınızı alın.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-12 py-6 text-lg font-medium bg-white text-orange-600 rounded-xl 
                  transition-all duration-300 transform hover:scale-105 hover:shadow-[0_20px_50px_rgba(255,255,255,0.3)]"
              >
                Ücretsiz Başla
                <svg className="ml-2 -mr-1 w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

const FeatureHighlight = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-[0_10px_30px_rgba(249,115,22,0.1)] dark:shadow-orange-500/5
    hover:shadow-[0_20px_50px_rgba(249,115,22,0.15)] dark:hover:shadow-orange-500/10 transition-all duration-300 transform hover:-translate-y-1">
    <div className="mb-6 flex justify-center">
      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500">
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white text-center">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">{description}</p>
  </div>
);

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="group bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-[0_10px_30px_rgba(249,115,22,0.1)] dark:shadow-orange-500/5
    hover:shadow-[0_20px_50px_rgba(249,115,22,0.15)] dark:hover:shadow-orange-500/10 transition-all duration-300 transform hover:-translate-y-1
    border border-orange-100/50 dark:border-orange-500/10">
    <div className="mb-6 flex justify-center">
      <div className="w-16 h-16 bg-orange-50 dark:bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500
        group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
        {icon}
      </div>
    </div>
    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white text-center">{title}</h3>
    <p className="text-gray-600 dark:text-gray-300 text-center leading-relaxed">{description}</p>
  </div>
);

const StepCard = ({ number, title, description }: { number: string; title: string; description: string }) => (
  <div className="flex items-start space-x-8 group">
    <div className="flex-shrink-0 w-16 h-16 flex items-center justify-center rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 
      text-white text-2xl font-bold transform group-hover:scale-110 transition-transform duration-300">
      {number}
    </div>
    <div className="flex-1">
      <h3 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">{description}</p>
    </div>
  </div>
);

export default HomePage; 