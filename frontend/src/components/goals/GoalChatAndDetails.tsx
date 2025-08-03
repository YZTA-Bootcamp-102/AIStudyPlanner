import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { StudyPlan } from '../../data/exampleStudyPlans';
import type { Message } from '../../types/chat';
import { generateModules, getModulesByGoal } from '../../services/learningGoal';
import type { Module } from '../../types/module';
import { sendMessageToAI } from '../../services/ai';

interface GoalChatAndDetailsProps {
  goal: StudyPlan & {
    progress: number;
    createdAt: Date;
    answers?: Record<string, string>;
  };
  onBack: () => void;
  onComplete: () => void;
}

const formatLabel = (label: string) =>
  label
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())
    .replace('Goal Text', 'Hedef Tanımı')
    .replace('Interest Areas', 'İlgi Alanları')
    .replace('Current Knowledge Level', 'Mevcut Bilgi Seviyesi')
    .replace('Start Date', 'Başlangıç Tarihi')
    .replace('Target End Date', 'Hedef Bitiş Tarihi');

const GoalChatAndDetails: React.FC<GoalChatAndDetailsProps> = ({
  goal,
  onBack,
  onComplete,
}) => {
  const navigate = useNavigate();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now().toString(),
      text: `Merhaba! '${goal.title}' için buradayım. Hedeflerinize özel önerilerle size destek olabilirim.`,
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [goalDetails, setGoalDetails] = useState({
    progress: goal.progress,
    lastUpdate: new Date(),
  });
  const progressBarRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [modules, setModules] = useState<Module[]>([]);
  const [loadingModules, setLoadingModules] = useState(false);
  const [modulesError, setModulesError] = useState<string | null>(null);
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const initialModules = await getModulesByGoal((goal as any).id || 0);
        setModules(initialModules);
      } catch (err: any) {
        console.error(err);
        setModulesError('Modüller yüklenemedi.');
      }
    };
    fetchModules();
  }, [goal.id]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendUserMessage = (text: string) => {
    const msg: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
  };

  const sendAiMessage = (text: string) => {
    const msg: Message = {
      id: (Date.now() + 1).toString(),
      text,
      sender: 'ai',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, msg]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const text = newMessage.trim();
    sendUserMessage(text);
    setNewMessage('');
    setIsSending(true);
    try {
      const response = await sendMessageToAI(text);
      sendAiMessage(response.reply);
    } catch (err: any) {
      console.error(err);
      sendAiMessage(err.message || 'AI yanıt veremedi. Lütfen tekrar deneyin.');
    } finally {
      setIsSending(false);
    }
  };

  const handleProgressDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!progressBarRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    let progress = ((clientX - rect.left) / rect.width) * 100;
    progress = Math.min(Math.max(Math.round(progress), 0), 100);
    setGoalDetails({ progress, lastUpdate: new Date() });
  };

  const handleGenerateModules = async () => {
    setLoadingModules(true);
    setModulesError(null);
    try {
      const result = await generateModules((goal as any).id || 0);
      setModules(result);
      sendAiMessage('Çalışma modülleriniz oluşturuldu. Sağ panelde görüntüleyebilirsiniz.');
    } catch (err: any) {
      console.error(err);
      setModulesError(err.message || 'Modüller oluşturulamadı. Lütfen tekrar deneyin.');
      sendAiMessage('Modüller oluşturulurken bir hata oluştu.');
    } finally {
      setLoadingModules(false);
    }
  };

  const renderAnswers = () => {
    if (!goal.answers || Object.keys(goal.answers).length === 0) {
      return <p className="text-gray-500 dark:text-gray-400">Henüz cevap verilmemiş.</p>;
    }
    return (
      <div className="grid grid-cols-1 gap-4">
        {Object.entries(goal.answers).map(([key, val]) => (
          <div
            key={key}
            className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20 dark:border-gray-700/50 hover:shadow-md transition-shadow"
          >
            <p className="text-sm font-semibold uppercase tracking-wide">
              {formatLabel(key)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
              {val}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <button onClick={onBack} className="flex items-center px-4 py-2 rounded-lg hover:bg-white/20 transition-colors">
          ‹ Geri Dön
        </button>
        <div className="text-right">
          <h3 className="text-xl font-semibold">{goal.title}</h3>
          <p className="text-sm mt-1">{goal.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* Chat Section */}
        <div className="lg:col-span-2 border-r border-gray-100 dark:border-gray-700 flex flex-col h-[calc(100vh-20rem)]">
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800"
          >
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-end space-x-2`}>
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m7 7H5" />
                    </svg>
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl p-4 ${msg.sender === 'user' ? 'bg-orange-500 text-white' : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg'}`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 flex space-x-2">
            <input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Mesajınızı yazın..."
              className="flex-1 rounded-xl bg-gray-100 dark:bg-gray-700 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
              disabled={isSending}
            />
            <button type="submit" disabled={isSending || !newMessage.trim()} className="bg-orange-500 text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">
              {isSending ? 'Gönderiliyor…' : 'Gönder'}
            </button>
          </form>
        </div>

        {/* Details Panel */}
        <div className="h-[calc(100vh-20rem)] overflow-y-auto bg-gradient-to-br from-orange-100 to-orange-50 dark:from-gray-800 dark:to-gray-900 p-6 space-y-4">
          
          {/* Progress Card */}
          <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">İlerleme</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Hedefinize ne kadar yakınsınız?</p>
              </div>
              <div className="relative w-20 h-20">
                <svg className="w-20 h-20 transform -rotate-90">
                  <circle cx="40" cy="40" r="36" className="stroke-current text-gray-200 dark:text-gray-700" strokeWidth="6" fill="none" />
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    className="stroke-current text-orange-500"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 36}`}
                    strokeDashoffset={`${2 * Math.PI * 36 * (1 - goalDetails.progress / 100)}`}
                    style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xl font-bold text-orange-500">%{goalDetails.progress}</span>
                </div>
              </div>
            </div>
            <div
              ref={progressBarRef}
              className="relative px-3 py-4 cursor-pointer"
              onMouseDown={handleProgressDrag}
              onTouchStart={handleProgressDrag}
            >
              <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2">
                <div className="h-2 bg-white/50 dark:bg-gray-700/50 rounded-full backdrop-blur-sm"></div>
                <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-150" style={{ width: `${goalDetails.progress}%` }} />
              </div>
            </div>
          </div>

          {/* Answers + Generate Modules */}
          {goal.answers && (
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hedef Detayları</h4>
              {renderAnswers()}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={handleGenerateModules}
                  disabled={loadingModules}
                  className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-4 px-6 rounded-xl shadow-md"
                >
                  {loadingModules ? 'Oluşturuluyor…' : 'Çalışma Modüllerini AI ile Oluştur'}
                </button>
              </div>
              {modulesError && (
                <p className="mt-2 text-sm text-red-500 dark:text-red-400">
                  {modulesError}
                </p>
              )}
              {modules.length > 0 && (
                <div className="mt-6 space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                    Oluşturulan Modüller
                  </h4>
                  <ul className="space-y-3">
                    {modules.map((mod) => (
                      <li
                        key={mod.id}
                        className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-xl border border-white/20 dark:border-gray-700/30 shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <div className="max-w-[80%]">
                            <h5 className="text-base font-semibold text-orange-600 dark:text-orange-400 break-words">
                              {mod.order}. {mod.title}
                            </h5>
                          </div>
                          <button
                            onClick={() => setSelectedModule(mod)}
                            className="ml-4 text-orange-500 hover:text-orange-600 text-sm font-medium whitespace-nowrap"
                          >
                            Detay
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => navigate(`/goals/${goal.id}`)}
                    className="mt-4 w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium py-3 px-6 rounded-xl shadow-md"
                  >
                    Tüm Modülleri Görüntüle
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal - Module Details */}
      {selectedModule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-[90%] max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl relative">
            <button
              onClick={() => setSelectedModule(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            >
              ✕
            </button>
            <h3 className="text-xl font-bold text-orange-500 mb-4">
              {selectedModule.order}. {selectedModule.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300 mb-4">{selectedModule.description}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              Hedef: {selectedModule.learning_outcome}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalChatAndDetails;
