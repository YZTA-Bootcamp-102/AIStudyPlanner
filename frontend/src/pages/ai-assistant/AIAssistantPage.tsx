<<<<<<< HEAD
const AIAssistantPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              AI Asistanı
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Bu özellik yakında eklenecek! AI Asistanı ile çalışmalarınızda size yardımcı olacak akıllı bir yardımcıya sahip olacaksınız.
            </p>
=======
import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Calendar, ListTodo, Book, Target, Clock, Paperclip, Mic, X, ChevronDown, Image, Link as LinkIcon, Sparkles, Eraser, History, Settings2, Loader2, Upload } from 'lucide-react';
import DashboardHeader from '../../components/DashboardHeader';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  files?: File[];
}

interface Template {
  id: string;
  title: string;
  icon: JSX.Element;
  color: string;
  darkColor: string;
  description: string;
  fields: {
    label: string;
    placeholder: string;
    type: 'text' | 'select' | 'date' | 'time';
    options?: string[];
  }[];
  promptTemplate: string;
}

const templates: Template[] = [
  {
    id: 'calendar',
    title: 'Takvim Planlama',
    description: 'Dersleriniz için detaylı çalışma planı oluşturun',
    icon: <Calendar size={20} />,
    color: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100',
    darkColor: 'dark:bg-indigo-900/20 dark:text-indigo-400 dark:hover:bg-indigo-900/40',
    fields: [
      {
        label: 'Ders',
        placeholder: 'Örn: Matematik, Fizik, İngilizce...',
        type: 'text'
      },
      {
        label: 'Konu',
        placeholder: 'Hangi konuyu çalışacaksınız?',
        type: 'text'
      },
      {
        label: 'Mevcut Seviye',
        placeholder: 'Konuyla ilgili mevcut bilgi seviyeniz',
        type: 'select',
        options: ['Yeni Başlıyorum', 'Temel Bilgim Var', 'Orta Seviye', 'İleri Seviye']
      },
      {
        label: 'Günlük Çalışma Süresi',
        placeholder: 'Günde ne kadar çalışabilirsiniz?',
        type: 'select',
        options: ['30 dakika', '1 saat', '2 saat', '3 saat', '4 saat', '5+ saat']
      },
      {
        label: 'Hedef Tarih',
        placeholder: 'Bu konuyu ne zamana kadar öğrenmek istiyorsunuz?',
        type: 'date'
      }
    ],
    promptTemplate: '[Ders] dersinin [Konu] konusunu öğrenmek istiyorum. Mevcut seviyem [Mevcut Seviye] ve günde [Günlük Çalışma Süresi] çalışabilirim. [Hedef Tarih] tarihine kadar öğrenmem gerekiyor. Bana detaylı bir çalışma planı oluşturur musun? Plan şunları içermeli:\n\n1. Günlük çalışma programı\n2. Konu başlıkları ve sıralaması\n3. Önerilen kaynaklar ve materyaller\n4. Pratik yapma yöntemleri\n5. İlerleme takibi için öneriler'
  },
  {
    id: 'todo',
    title: 'Görev Planlama',
    description: 'Görevlerinizi alt görevlere bölün ve organize edin',
    icon: <ListTodo size={20} />,
    color: 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100',
    darkColor: 'dark:bg-emerald-900/20 dark:text-emerald-400 dark:hover:bg-emerald-900/40',
    fields: [
      {
        label: 'Ana Görev',
        placeholder: 'Örn: Final sınavına hazırlanma, Proje teslimi...',
        type: 'text'
      },
      {
        label: 'Zorluk Seviyesi',
        placeholder: 'Görevin zorluğunu seçin',
        type: 'select',
        options: ['Kolay', 'Orta', 'Zor', 'Çok Zor']
      },
      {
        label: 'Öncelik',
        placeholder: 'Görevin önceliğini seçin',
        type: 'select',
        options: ['Düşük', 'Normal', 'Yüksek', 'Acil']
      },
      {
        label: 'Mevcut Durum',
        placeholder: 'Şu ana kadar ne kadarını tamamladınız?',
        type: 'text'
      },
      {
        label: 'Teslim Tarihi',
        placeholder: 'Ne zamana kadar tamamlanmalı?',
        type: 'date'
      }
    ],
    promptTemplate: '[Ana Görev] görevini organize etmem gerekiyor. Bu görev [Zorluk Seviyesi] zorlukta ve [Öncelik] önceliğe sahip. Şu ana kadar [Mevcut Durum] ve [Teslim Tarihi] tarihine kadar tamamlanması gerekiyor. Bana şunları içeren detaylı bir görev planı oluşturur musun?\n\n1. Ana görevin alt görevlere bölünmüş hali\n2. Her alt görev için tahmini süre\n3. Önerilen çalışma sırası\n4. Dikkat edilmesi gereken noktalar\n5. İlerleme takibi için kontrol listesi'
  },
  {
    id: 'study',
    title: 'Ders Çalışma',
    description: 'Konuları daha iyi anlamak için özel stratejiler alın',
    icon: <Book size={20} />,
    color: 'bg-rose-50 text-rose-600 hover:bg-rose-100',
    darkColor: 'dark:bg-rose-900/20 dark:text-rose-400 dark:hover:bg-rose-900/40',
    fields: [
      {
        label: 'Ders',
        placeholder: 'Hangi ders için yardım istiyorsunuz?',
        type: 'text'
      },
      {
        label: 'Öğrenme Stili',
        placeholder: 'Nasıl daha iyi öğreniyorsunuz?',
        type: 'select',
        options: ['Görsel', 'İşitsel', 'Okuyarak', 'Yazarak', 'Uygulayarak']
      },
      {
        label: 'Zorlandığınız Konular',
        placeholder: 'Hangi konularda zorlanıyorsunuz?',
        type: 'text'
      },
      {
        label: 'Hedef Not',
        placeholder: 'Hedeflediğiniz başarı notu',
        type: 'select',
        options: ['50-60', '60-70', '70-80', '80-90', '90-100']
      },
      {
        label: 'Mevcut Kaynaklar',
        placeholder: 'Hangi kaynaklara erişiminiz var?',
        type: 'text'
      }
    ],
    promptTemplate: '[Ders] dersinde daha iyi bir performans göstermek istiyorum. [Öğrenme Stili] şeklinde daha iyi öğreniyorum ve özellikle [Zorlandığınız Konular] konularında zorlanıyorum. Hedefim [Hedef Not] aralığında bir not almak. Şu anda [Mevcut Kaynaklar] kaynaklarına sahibim. Bana şunları içeren kişiselleştirilmiş bir çalışma stratejisi önerir misin?\n\n1. Öğrenme stilime uygun çalışma teknikleri\n2. Zorlandığım konular için özel öneriler\n3. Kullanabileceğim ek kaynaklar ve materyaller\n4. Etkili not tutma ve tekrar yapma yöntemleri\n5. Sınav hazırlık stratejileri'
  },
  {
    id: 'goal',
    title: 'Hedef Belirleme',
    description: 'SMART hedefler belirleyin ve ilerleme planı alın',
    icon: <Target size={20} />,
    color: 'bg-violet-50 text-violet-600 hover:bg-violet-100',
    darkColor: 'dark:bg-violet-900/20 dark:text-violet-400 dark:hover:bg-violet-900/40',
    fields: [
      {
        label: 'Hedef',
        placeholder: 'Ulaşmak istediğiniz akademik hedef nedir?',
        type: 'text'
      },
      {
        label: 'Mevcut Durum',
        placeholder: 'Şu an neredesiniz?',
        type: 'text'
      },
      {
        label: 'Motivasyon',
        placeholder: 'Bu hedefe ulaşmak neden önemli?',
        type: 'text'
      },
      {
        label: 'Zaman Dilimi',
        placeholder: 'Ne kadar sürede ulaşmak istiyorsunuz?',
        type: 'select',
        options: ['1 ay', '3 ay', '6 ay', '1 yıl', '2 yıl']
      },
      {
        label: 'Engeller',
        placeholder: 'Karşılaşabileceğiniz zorluklar neler?',
        type: 'text'
      }
    ],
    promptTemplate: 'Hedefim: [Hedef]. Şu anda [Mevcut Durum] durumundayım ve bu hedefe [Zaman Dilimi] içinde ulaşmak istiyorum. Bu hedef benim için önemli çünkü [Motivasyon]. Karşılaşabileceğim zorluklar: [Engeller]. Bana şunları içeren SMART bir hedef planı oluşturur musun?\n\n1. Hedefin ölçülebilir alt hedeflere bölünmüş hali\n2. Zaman çizelgesi ve ara hedefler\n3. İlerlemeyi ölçme ve takip yöntemleri\n4. Olası engellere karşı stratejiler\n5. Motivasyonu yüksek tutmak için öneriler'
  },
  {
    id: 'time',
    title: 'Zaman Yönetimi',
    description: 'Zamanınızı etkili kullanmak için öneriler alın',
    icon: <Clock size={20} />,
    color: 'bg-cyan-50 text-cyan-600 hover:bg-cyan-100',
    darkColor: 'dark:bg-cyan-900/20 dark:text-cyan-400 dark:hover:bg-cyan-900/40',
    fields: [
      {
        label: 'Planlama Dönemi',
        placeholder: 'Hangi dönem için plan yapıyorsunuz?',
        type: 'select',
        options: ['Günlük', 'Haftalık', 'Aylık', 'Dönemlik']
      },
      {
        label: 'Dersler ve Aktiviteler',
        placeholder: 'Planlamak istediğiniz tüm aktiviteleri yazın',
        type: 'text'
      },
      {
        label: 'Uyku Düzeni',
        placeholder: 'Günlük uyku saatleriniz',
        type: 'text'
      },
      {
        label: 'Yoğun Saatler',
        placeholder: 'Hangi saatlerde daha verimli çalışıyorsunuz?',
        type: 'select',
        options: ['Sabah (6-12)', 'Öğlen (12-17)', 'Akşam (17-22)', 'Gece (22-6)']
      },
      {
        label: 'Mola İhtiyacı',
        placeholder: 'Ne sıklıkta mola vermeyi tercih edersiniz?',
        type: 'select',
        options: ['Her 25 dakikada', 'Her 45 dakikada', 'Her 1 saatte', 'Her 1.5 saatte']
      }
    ],
    promptTemplate: '[Planlama Dönemi] bazında bir zaman yönetimi planı istiyorum. Planlamam gereken aktiviteler: [Dersler ve Aktiviteler]. Uyku düzenim [Uyku Düzeni] şeklinde ve en verimli çalıştığım saatler [Yoğun Saatler]. [Mola İhtiyacı] bir mola vermeyi tercih ediyorum. Bana şunları içeren detaylı bir zaman yönetimi planı oluşturur musun?\n\n1. Detaylı zaman çizelgesi\n2. Verimli çalışma bloklarının organizasyonu\n3. Etkili mola ve dinlenme stratejileri\n4. Önceliklendirme önerileri\n5. Zaman tuzaklarından kaçınma yöntemleri'
  }
];

const CustomSelect = ({ value, onChange, options, placeholder, allowCustomInput = false }: { 
  value: string; 
  onChange: (value: string) => void; 
  options: string[];
  placeholder: string;
  allowCustomInput?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [isCustomInput, setIsCustomInput] = useState(false);

  const handleOptionSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setIsCustomInput(false);
  };

  const handleCustomInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCustomValue(newValue);
    onChange(newValue);
  };

  const toggleCustomInput = () => {
    setIsCustomInput(true);
    setIsOpen(false);
    setCustomValue(value);
  };

  if (isCustomInput && allowCustomInput) {
    return (
      <div className="relative">
        <input
          type="text"
          value={customValue}
          onChange={handleCustomInput}
          placeholder="Süreyi yazın..."
          className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all pr-24"
        />
        <button
          onClick={() => setIsCustomInput(false)}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
        >
          Listeye Dön
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
      >
        <span className={value ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'}>
          {value || placeholder}
        </span>
        <ChevronDown size={18} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg overflow-hidden">
          <div className="max-h-48 overflow-y-auto py-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => handleOptionSelect(option)}
                className={`w-full text-left px-4 py-2 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors ${
                  value === option 
                    ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' 
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                {option}
              </button>
            ))}
            {allowCustomInput && (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
                <button
                  onClick={toggleCustomInput}
                  className="w-full text-left px-4 py-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors"
                >
                  Özel süre girin...
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ChatInput = ({ message, setMessage }: { message: string; setMessage: (message: string) => void }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSendMessage = () => {
    if (message.trim() || selectedFiles.length > 0) {
      console.log('Message sent:', message);
      console.log('Files sent:', selectedFiles);
      setMessage('');
      setSelectedFiles([]);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  return (
    <div className="relative flex flex-col gap-2">
      {selectedFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4 py-2 bg-gray-50 dark:bg-gray-800/50 border-t dark:border-gray-700/50">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <span className="text-sm text-gray-600 dark:text-gray-300 truncate max-w-[200px]">
                {file.name}
              </span>
              <button
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
      
      <div className="relative flex items-end gap-3 p-4 bg-white dark:bg-gray-800/95 border-t dark:border-gray-700/50 backdrop-blur-sm">
        <div className="flex-1 min-w-0">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={handleMessageChange}
            onKeyDown={handleKeyDown}
            placeholder="Mesajınızı yazın..."
            className="w-full min-h-[52px] max-h-[200px] py-3 px-4 text-base resize-none rounded-xl border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-500 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200"
            style={{
              overflowY: 'auto',
              lineHeight: '1.5'
            }}
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt"
          />
          <button
            onClick={handleFileClick}
            className="p-2.5 rounded-lg text-gray-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 dark:text-gray-400 dark:hover:text-orange-400 transition-all duration-200"
            title="Dosya yükle"
          >
            <Upload size={20} />
          </button>
          <button
            onClick={() => setIsRecording(!isRecording)}
            className={`p-2.5 rounded-lg transition-all duration-200 ${
              isRecording
                ? 'text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-500/10'
                : 'text-gray-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 dark:text-gray-400 dark:hover:text-orange-400'
            }`}
            title={isRecording ? 'Kaydı durdur' : 'Sesli mesaj'}
          >
            <Mic size={20} />
          </button>
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() && selectedFiles.length === 0}
            className={`p-2.5 rounded-lg transition-all duration-200 ${
              message.trim() || selectedFiles.length > 0
                ? 'text-white bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 shadow-sm hover:shadow-md'
                : 'text-gray-400 bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
            }`}
            title="Gönder"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

const AIAssistantPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Merhaba! Ben senin AI asistanınım. Eğitim planlamanı yapmana, görevlerini yönetmene ve sorularını yanıtlamana yardımcı olabilirim. Nasıl yardımcı olabilirim?',
      sender: 'ai',
      timestamp: '2024-03-20T10:00:00.000Z'
    },
    {
      id: '2',
      content: 'Matematik dersinde integral konusunda yardıma ihtiyacım var. Nasıl daha iyi anlayabilirim?',
      sender: 'user',
      timestamp: '2024-03-20T10:01:00.000Z'
    },
    {
      id: '3',
      content: 'İntegral konusunu anlamak için size yardımcı olabilirim. İşte bazı öneriler:\n\n1. Öncelikle türev konusunu iyi anladığınızdan emin olun, çünkü integral türevin tersidir.\n\n2. Görsel kaynaklardan yararlanın - integral altında kalan alanı görselleştirmek size yardımcı olacaktır.\n\n3. Basit örneklerle başlayın ve kademeli olarak zorlaştırın.\n\n4. Khan Academy ve YouTube gibi platformlardaki video derslerden faydalanın.\n\nHangi alt konuda özellikle zorlanıyorsunuz?',
      sender: 'ai',
      timestamp: '2024-03-20T10:02:00.000Z'
    }
  ]);
  const [message, setMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateFields, setTemplateFields] = useState<Record<string, string>>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Get the last message's ID and increment it
    const lastId = parseInt(messages[messages.length - 1]?.id || '0');
    const newMessage: Message = {
      id: (lastId + 1).toString(),
      content: message,
      sender: 'user' as const,
      timestamp: new Date().toISOString()
    };

    // Add the new message to the messages array
    setMessages(prev => [...prev, newMessage]);
    setMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleTemplateSelect = (template: Template) => {
    setSelectedTemplate(template);
    setTemplateFields({});
  };

  const handleTemplateFieldChange = (field: string, value: string) => {
    setTemplateFields(prev => ({ ...prev, [field]: value }));
  };

  const handleTemplateSubmit = () => {
    let prompt = selectedTemplate?.promptTemplate || '';
    Object.entries(templateFields).forEach(([field, value]) => {
      prompt = prompt.replace(`[${field}]`, value);
    });
    setMessage(prompt);
    setSelectedTemplate(null);
    setTemplateFields({});
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-xl border border-gray-100 dark:border-gray-700 mb-10">
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-2xl">
              <Bot size={36} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                AI Asistan
            </h1>
              <p className="text-xl text-gray-500 dark:text-gray-400">
                Kişisel eğitim asistanınız ile sohbet edin
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Suggestions Panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles size={20} className="text-orange-500" />
                Önerilen Şablonlar
              </h3>
              <div className="space-y-3">
                {templates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => handleTemplateSelect(template)}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl ${template.color} ${template.darkColor} transition-all hover:scale-[1.02]`}
                  >
                    {template.icon}
                    <span className="font-medium">{template.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Template Form */}
            {selectedTemplate && (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                <div className={`p-6 bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-t-2xl`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <div className="text-white w-6 h-6 flex items-center justify-center">
                        {selectedTemplate.icon}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">
                        {selectedTemplate.title}
                      </h3>
                      <p className="text-sm text-white/80">
                        {selectedTemplate.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  {selectedTemplate.fields.map(field => (
                    <div key={field.label}>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {field.label}
                      </label>
                      {field.type === 'select' ? (
                        <CustomSelect
                          value={templateFields[field.label] || ''}
                          onChange={(value) => handleTemplateFieldChange(field.label, value)}
                          options={field.options || []}
                          placeholder={field.placeholder}
                          allowCustomInput={field.label.toLowerCase().includes('süre')}
                        />
                      ) : (
                        <input
                          type={field.type}
                          value={templateFields[field.label] || ''}
                          onChange={(e) => handleTemplateFieldChange(field.label, e.target.value)}
                          placeholder={field.placeholder}
                          className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
                        />
                      )}
                    </div>
                  ))}
                  <button
                    onClick={handleTemplateSubmit}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90 text-white rounded-xl py-3 px-4 transition-all shadow-lg shadow-orange-500/20"
                  >
                    Şablonu Kullan
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex flex-col" style={{ height: 'calc(100vh - 400px)' }}>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                  <Bot size={20} className="text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">AI Asistan</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Eğitim yolculuğunuzda size rehberlik ediyorum</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleClearChat}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  title="Sohbeti Temizle"
                >
                  <Eraser size={20} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start gap-4 ${msg.sender === 'ai' ? '' : 'flex-row-reverse'}`}
                >
                  {msg.sender === 'ai' ? (
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-lg">
                      <Bot size={24} className="text-white" />
                    </div>
                  ) : (
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                      <div className="text-lg font-semibold text-white">U</div>
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      msg.sender === 'ai'
                        ? 'bg-gray-100 dark:bg-gray-700'
                        : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                    }`}
                  >
                    <div className="prose dark:prose-invert max-w-none">
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                    <div className="mt-1 text-xs opacity-50">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                <div className="flex flex-wrap gap-2">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 bg-white dark:bg-gray-700 rounded-lg px-3 py-1">
                      <span className="text-sm text-gray-600 dark:text-gray-300">{file.name}</span>
                      <button
                        onClick={() => handleRemoveFile(index)}
                        className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message Input */}
            <ChatInput message={message} setMessage={setMessage} />
>>>>>>> 4577c2aa087f97e10b63df66ef2af811e62c3090
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistantPage; 