import { Link } from 'react-router-dom';
import { ArrowLeft, Scale, UserCheck, AlertTriangle, Clock, Shield, Zap, FileText, HelpCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const TermsOfService = () => {
  const lastUpdated = "2024-03-20";

  const sections = [
    {
      icon: Scale,
      title: "Hizmet Şartları",
      content: "FocusFlow, yapay zeka destekli bir çalışma planlama ve verimlilik uygulamasıdır. Bu hizmeti kullanarak, belirtilen tüm şartları ve koşulları kabul etmiş olursunuz. Hizmetlerimizi kötüye kullanmamayı ve yasal düzenlemelere uymayı taahhüt edersiniz."
    },
    {
      icon: UserCheck,
      title: "Kullanıcı Sorumlulukları",
      content: "Hesabınızın güvenliğinden siz sorumlusunuz. Güçlü bir şifre kullanmanız ve hesap bilgilerinizi kimseyle paylaşmamanız gerekmektedir. Platformu yasal ve etik kurallara uygun şekilde kullanmakla yükümlüsünüz."
    },
    {
      icon: AlertTriangle,
      title: "Kullanım Kısıtlamaları",
      content: "Platformu zararlı yazılım yaymak, spam göndermek veya başkalarının haklarını ihlal etmek için kullanamazsınız. Bu tür davranışlar tespit edildiğinde hesabınız askıya alınabilir veya kalıcı olarak kapatılabilir."
    },
    {
      icon: Clock,
      title: "Hizmet Kullanılabilirliği",
      content: "FocusFlow, hizmetlerinin kesintisiz çalışması için çaba gösterir. Ancak, bakım, güncelleme veya teknik sorunlar nedeniyle zaman zaman kesintiler yaşanabilir. Bu durumlar için önceden bilgilendirme yapılmaya çalışılacaktır."
    },
    {
      icon: Shield,
      title: "Fikri Mülkiyet Hakları",
      content: "FocusFlow'un tüm içeriği, logosu, tasarımı ve yazılımı fikri mülkiyet hakları kapsamında korunmaktadır. Bu içerikleri izinsiz kullanmak, kopyalamak veya dağıtmak yasaktır."
    },
    {
      icon: Zap,
      title: "AI Kullanımı ve Sınırlamalar",
      content: "AI asistanımız, çalışma planlamanıza yardımcı olmak için tasarlanmıştır. AI önerilerini kendi sorumluluğunuzda kullanmanız ve kritik kararları kendiniz vermeniz önemlidir. AI'nin sağladığı öneriler garanti veya taahhüt niteliği taşımaz."
    },
    {
      icon: FileText,
      title: "İçerik Politikası",
      content: "Platformda paylaştığınız tüm içeriklerden siz sorumlusunuz. Telif hakkı ihlali, yasadışı veya uygunsuz içerik paylaşımı yasaktır. Bu tür içerikler tespit edildiğinde kaldırılacak ve gerekli yasal işlemler başlatılabilecektir."
    },
    {
      icon: HelpCircle,
      title: "Değişiklikler ve Güncellemeler",
      content: "Bu kullanım koşulları zaman zaman güncellenebilir. Önemli değişiklikler olduğunda size bildirim göndereceğiz. Hizmeti kullanmaya devam ederek, güncel koşulları kabul etmiş sayılırsınız."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Kullanım Koşulları | FocusFlow</title>
        <meta name="description" content="FocusFlow kullanım koşulları - Hizmet şartları ve kullanıcı sorumlulukları hakkında detaylı bilgi." />
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
              Kullanım Koşulları
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Son güncelleme: {lastUpdated}
            </p>
          </div>

          {/* Introduction */}
          <div className="prose dark:prose-invert max-w-none mb-12">
            <p className="text-lg text-gray-700 dark:text-gray-300">
              FocusFlow'u kullanmadan önce lütfen bu kullanım koşullarını dikkatlice okuyun. 
              Bu platform, çalışmalarınızı daha verimli hale getirmenize yardımcı olmak için 
              tasarlanmıştır. Platformu kullanarak aşağıdaki koşulları kabul etmiş olursunuz.
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
                to="/privacy"
                className="text-orange-500 hover:text-orange-600 dark:hover:text-orange-400"
              >
                Gizlilik Politikamızı
              </Link>
              <span className="text-gray-600 dark:text-gray-400"> da incelemeyi unutmayın.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TermsOfService; 