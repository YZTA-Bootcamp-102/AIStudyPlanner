import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, Eye, Database, Brain, Lock, UserCheck, Bell, Trash2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicy = () => {
  const lastUpdated = "2024-03-20";

  const sections = [
    {
      icon: Shield,
      title: "Veri Güvenliği Taahhüdümüz",
      content: "FocusFlow olarak kullanıcılarımızın gizliliğini ve veri güvenliğini en üst düzeyde tutmayı taahhüt ediyoruz. Verileriniz endüstri standardı şifreleme protokolleri ile korunmaktadır."
    },
    {
      icon: Database,
      title: "Topladığımız Veriler",
      content: "Hizmetlerimizi sunabilmek için şu verileri topluyoruz: Hesap bilgileri (e-posta, şifre), çalışma planları, hedefler, notlar ve uygulama kullanım istatistikleri. Bu veriler, size kişiselleştirilmiş bir deneyim sunmak için kullanılır."
    },
    {
      icon: Brain,
      title: "Yapay Zeka Kullanımı",
      content: "AI asistanımız, size daha iyi hizmet verebilmek için çalışma verilerinizi analiz eder. Bu veriler, öğrenme algoritmaları için anonim hale getirilerek kullanılır ve üçüncü taraflarla paylaşılmaz."
    },
    {
      icon: Eye,
      title: "Veri Şeffaflığı",
      content: "Verilerinizin nasıl kullanıldığı konusunda tam şeffaflık sağlıyoruz. Dilediğiniz zaman hesap ayarlarınızdan verilerinizi görüntüleyebilir ve indirebilirsiniz."
    },
    {
      icon: Lock,
      title: "Veri Koruma Önlemleri",
      content: "Verilerinizi korumak için SSL şifreleme, güvenli veri depolama ve düzenli güvenlik denetimleri gibi çeşitli önlemler alıyoruz. Sistemlerimiz düzenli olarak güvenlik testlerinden geçirilmektedir."
    },
    {
      icon: UserCheck,
      title: "Kullanıcı Hakları",
      content: "KVKK kapsamında tüm haklarınız korunmaktadır. Verilerinize erişim, düzeltme veya silme taleplerinde bulunabilirsiniz. Bu talepler için destek ekibimizle iletişime geçebilirsiniz."
    },
    {
      icon: Bell,
      title: "Bildirimler ve İletişim",
      content: "Önemli güncellemeler ve çalışma hatırlatıcıları için bildirimler gönderebiliriz. Bu bildirimleri hesap ayarlarınızdan özelleştirebilir veya kapatabilirsiniz."
    },
    {
      icon: Trash2,
      title: "Hesap Silme",
      content: "Dilediğiniz zaman hesabınızı ve tüm verilerinizi kalıcı olarak silebilirsiniz. Silme işleminden sonra verileriniz 30 gün içinde sistemlerimizden tamamen kaldırılır."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Gizlilik Politikası | FocusFlow</title>
        <meta name="description" content="FocusFlow gizlilik politikası - Verilerinizin güvenliği ve kullanımı hakkında detaylı bilgi." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Ana Sayfaya Dön
            </Link>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Gizlilik Politikası
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Son güncelleme: {lastUpdated}
            </p>
          </div>

          {/* Introduction */}
          <div className="prose dark:prose-invert max-w-none mb-12">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              FocusFlow olarak, gizliliğinize ve verilerinizin güvenliğine büyük önem veriyoruz. 
              Bu gizlilik politikası, verilerinizi nasıl topladığımızı, kullandığımızı ve koruduğumuzu 
              açıklamaktadır. Uygulamamızı kullanarak bu politikayı kabul etmiş olursunuz.
            </p>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
              >
                <div className="flex items-center mb-4">
                  <section.icon className="w-6 h-6 text-orange-500 mr-3" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  {section.content}
                </p>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Sorularınız için{' '}
              <a
                href="mailto:support@focusflow.com"
                className="text-orange-500 hover:text-orange-600 dark:hover:text-orange-400"
              >
                support@focusflow.com
              </a>{' '}
              adresinden bizimle iletişime geçebilirsiniz.
            </p>
            <div className="mt-4">
              <Link
                to="/terms"
                className="text-orange-500 hover:text-orange-600 dark:hover:text-orange-400"
              >
                Kullanım Koşullarımızı
              </Link>
              <span className="text-gray-600 dark:text-gray-400"> da incelemeyi unutmayın.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy; 