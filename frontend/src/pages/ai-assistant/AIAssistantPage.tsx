import React, { useState, useRef, useEffect, type JSX } from 'react';
import {
  Bot, Send, Calendar, ListTodo, Book, Target, Clock, Sparkles, Eraser, Upload, Mic, X, ChevronDown
} from 'lucide-react';
import DashboardHeader from '../../components/DashboardHeader';
import { Helmet } from 'react-helmet-async';
import { sendMessageToAI } from '../../services/ai'; 
import type { ChatResponse } from '../../types/ai';

/** ————— Types ————— */

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
}

interface TemplateField {
  label: string;
  placeholder: string;
  type: 'text' | 'select' | 'date' | 'time';
  options?: string[];
}

interface Template {
  id: string;
  title: string;
  icon: JSX.Element;
  color: string;
  darkColor: string;
  description: string;
  fields: TemplateField[];
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
const CustomSelect: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  allowCustomInput?: boolean;
}> = ({ value, onChange, options, placeholder, allowCustomInput = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [isCustomInput, setIsCustomInput] = useState(false);

  const handleOptionSelect = (opt: string) => {
    onChange(opt);
    setIsOpen(false);
    setIsCustomInput(false);
  };

  const toggleCustom = () => {
    setIsCustomInput(true);
    setIsOpen(false);
    setCustomValue(value);
  };

  return isCustomInput && allowCustomInput ? (
    <div className="relative">
      <input
        type="text"
        value={customValue}
        onChange={(e) => {
          setCustomValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Süreyi yazın..."
        className="w-full p-3 border rounded-xl bg-white dark:bg-gray-900"
      />
      <button onClick={() => setIsCustomInput(false)} className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-orange-500">
        Listeye dön
      </button>
    </div>
  ) : (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 border rounded-xl bg-white dark:bg-gray-900"
      >
        <span className={value ? '' : 'text-gray-400'}>{value || placeholder}</span>
        <ChevronDown size={18} className={isOpen ? 'rotate-180' : ''} />
      </button>
      {isOpen && (
        <div className="absolute w-full mt-2 bg-white dark:bg-gray-900 border rounded-xl z-50">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleOptionSelect(opt)}
              className={`block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 ${value === opt ? 'font-semibold text-orange-600' : ''}`}
            >
              {opt}
            </button>
          ))}
          {allowCustomInput && (
            <>
              <hr className="border-gray-200 dark:border-gray-700 mt-1" />
              <button onClick={toggleCustom} className="w-full px-4 py-2 text-orange-500 text-left">
                Özel süre girin...
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

/** ————— Prompt doldurma fonksiyonu ————— */

function preparePrompt(template: Template, fields: Record<string, string>): string {
  let prompt = template.promptTemplate;
  Object.entries(fields).forEach(([k, v]) => {
    prompt = prompt.replace(new RegExp(`\\[${k}\\]`, 'g'), v);
  });
  return prompt;
}

/** ————— Chat gönderim helper ————— */

async function postAndAppendChat(
  prompt: string,
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
) {
  const userMsg: Message = {
    id: Date.now().toString(),
    content: prompt,
    sender: 'user',
    timestamp: new Date().toISOString()
  };
  setMessages((prev) => [...prev, userMsg]);
  setIsLoading(true);

  try {
    const resp: ChatResponse = await sendMessageToAI(prompt);
    const content = resp.reply.trim(); 
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      content: content,
      sender: 'ai',
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, aiMsg]);
  } catch (err: any) {
    const errMsg: Message = {
      id: (Date.now() + 1).toString(),
      content: `Hata: ${err.message}`,
      sender: 'ai',
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, errMsg]);
  } finally {
    setIsLoading(false);
  }
}

/** ————— Main Component ————— */

const AIAssistantPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Merhaba! Eğitim planlama, görev yönetimi ve sorularınıza destek vermeye hazırım.',
      sender: 'ai',
      timestamp: new Date().toISOString()
    }
  ]);
  const [message, setMessage] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [templateFields, setTemplateFields] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight });
  }, [messages]);

  const handleTemplateSubmit = async () => {
    if (!selectedTemplate) return;
    const prompt = preparePrompt(selectedTemplate, templateFields);
    await postAndAppendChat(prompt, setMessages, setIsLoading);
    setSelectedTemplate(null);
    setTemplateFields({});
  };

  const handleManualSend = async () => {
    if (!message.trim()) return;
    await postAndAppendChat(message, setMessages, setIsLoading);
    setMessage('');
  };

  return (
    <>
      <Helmet>
        <title>AI Asistan | FocusFlow</title>
      </Helmet>
      <div className="min-h-screen pt-20 bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          {/* Header Card */}
          <div className="bg-white dark:bg-gray-800 p-10 rounded-3xl shadow-xl border dark:border-gray-700 mb-10">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center rounded-3xl shadow-2xl">
                <Bot size={36} className="text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-extrabold dark:text-white text-gray-900">AI Asistan</h1>
                <p className="text-xl dark:text-gray-400 text-gray-500">Eğitim yolculuğunuzda size rehberlik ediyorum.</p>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-4 gap-6">
            {/* Template Panel */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles size={20} className="text-orange-500" /> Önerilen Şablonlar
                </h3>
                <div className="space-y-3">
                  {templates.map((t: Template) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        setSelectedTemplate(t);
                        setTemplateFields({});
                      }}
                      className={`w-full flex items-center gap-3 p-4 rounded-xl ${t.color} ${t.darkColor} hover:scale-[1.02] transition`}
                    >
                      {t.icon}
                      <span className="font-medium">{t.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedTemplate && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border dark:border-gray-700">
                  <div className="p-6 rounded-t-2xl bg-gradient-to-r from-orange-500 to-orange-600">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                        {selectedTemplate.icon}
                      </div>
                      <div>
                        <h3 className="text-xl text-white font-semibold">{selectedTemplate.title}</h3>
                        <p className="text-sm text-white/80">{selectedTemplate.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    {selectedTemplate.fields.map((f: TemplateField) => (
                      <div key={f.label}>
                        <label className="block mb-2 text-sm font-medium dark:text-gray-300 text-gray-700">
                          {f.label}
                        </label>
                        {f.type === 'select' ? (
                          <CustomSelect
                            value={templateFields[f.label] || ''}
                            onChange={(val) =>
                              setTemplateFields((prev) => ({ ...prev, [f.label]: val }))
                            }
                            options={f.options || []}
                            placeholder={f.placeholder}
                            allowCustomInput={f.label.toLowerCase().includes('süre')}
                          />
                        ) : (
                          <input
                            type={f.type}
                            value={templateFields[f.label] || ''}
                            onChange={(e) =>
                              setTemplateFields((prev) => ({
                                ...prev,
                                [f.label]: e.target.value
                              }))
                            }
                            placeholder={f.placeholder}
                            className="w-full p-3 border rounded-xl bg-white dark:bg-gray-900 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-orange-500 transition-all"
                          />
                        )}
                      </div>
                    ))}
                    <button
                      onClick={handleTemplateSubmit}
                      disabled={isLoading}
                      className={`w-full py-3 text-white rounded-xl shadow-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:opacity-90 transition ${
                        isLoading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {isLoading ? 'Gönderiliyor...' : 'Şablonu Kullan'}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Panel */}
            <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border dark:border-gray-700 flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 400px)' }}>
              <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-orange-400 to-orange-500">
                    <Bot size={20} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">AI Asistan</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Sorularınıza buradan yanıt alabilirsiniz.</p>
                  </div>
                </div>
                <button onClick={() => setMessages([])} title="Sohbeti Temizle" className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <Eraser size={20} />
                </button>
              </div>

              <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-6">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex items-start gap-4 ${msg.sender === 'ai' ? '' : 'flex-row-reverse'}`}>
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br ${msg.sender === 'ai' ? 'from-orange-400 to-orange-500' : 'from-orange-500 to-orange-600'}`}>
                      {msg.sender === 'ai' ? <Bot size={24} className="text-white" /> : <div className="text-white font-semibold">U</div>}
                    </div>
                    <div className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      msg.sender === 'ai'
                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                        : 'bg-gradient-to-r from-orange-500 to-orange-600 text-white'
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      <div className="mt-1 text-xs opacity-50">{new Date(msg.timestamp).toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t dark:border-gray-700">
                <div className="relative flex items-end gap-3 p-4 bg-white dark:bg-gray-800/95">
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleManualSend(); } }}
                    placeholder="Mesajınızı yazın..."
                    className="w-full min-h-[52px] max-h-[200px] p-3 resize-none rounded-xl border bg-white/50 dark:bg-gray-900/50 dark:border-gray-700 outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all"
                  />
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-500 hover:text-orange-500">
                      <Upload size={20} />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-orange-500">
                      <Mic size={20} />
                    </button>
                    <button
                      onClick={handleManualSend}
                      disabled={!message.trim() || isLoading}
                      className={`p-2 rounded-lg ${
                        message.trim() && !isLoading
                          ? 'bg-orange-500 text-white hover:bg-orange-600'
                          : 'text-gray-400 bg-gray-100 dark:bg-gray-800 cursor-not-allowed'
                      }`}
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default AIAssistantPage;