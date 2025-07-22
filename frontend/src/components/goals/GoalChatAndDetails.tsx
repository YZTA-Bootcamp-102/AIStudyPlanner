import React, { useState, useRef, useEffect } from 'react';
import type { StudyPlan } from '../../data/exampleStudyPlans';
import type { Message } from '../../types/chat';

interface GoalChatAndDetailsProps {
  goal: StudyPlan & { 
    progress: number; 
    createdAt: Date;
    answers?: Record<string, string>;
  };
  onBack: () => void;
  onComplete: () => void;
}

const GoalChatAndDetails: React.FC<GoalChatAndDetailsProps> = ({ goal, onBack, onComplete }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Merhaba! ${goal.title} için size yardımcı olmak için buradayım. Hedefleriniz doğrultusunda size özel öneriler sunabilirim. Nasıl yardımcı olabilirim?`,
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [goalDetails, setGoalDetails] = useState({
    progress: goal.progress,
    lastUpdate: new Date(),
  });
  const [isDragging, setIsDragging] = useState(false);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleProgressDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!progressBarRef.current) return;

    const rect = progressBarRef.current.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    let progress = ((clientX - rect.left) / rect.width) * 100;
    progress = Math.min(Math.max(progress, 0), 100);
    progress = Math.round(progress);

    setGoalDetails(prev => ({
      ...prev,
      progress,
      lastUpdate: new Date(),
    }));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleProgressDrag(e);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    handleProgressDrag(e);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        handleProgressDrag(e as unknown as React.MouseEvent);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isDragging) {
        e.preventDefault();
        handleProgressDrag(e as unknown as React.TouchEvent);
      }
    };

    const handleEnd = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleEnd);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleEnd);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setNewMessage('');

    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Anladım, size yardımcı olmak için çalışma planınızı güncelledim. Detayları yan panelden inceleyebilirsiniz.',
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
  };

  const renderAnswers = () => {
    if (!goal.answers) return null;

    return (
      <div className="grid grid-cols-1 gap-4">
        {goal.questions.map((question) => {
          const answer = goal.answers?.[question.id];
          if (!answer) return null;

          return (
            <div key={question.id} className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 shadow-sm border border-white/20 dark:border-gray-700/50 hover:shadow-md transition-shadow">
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{question.text}</p>
              <p className="text-gray-600 dark:text-gray-300">{answer}</p>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
        <button
          onClick={onBack}
          className="flex items-center px-4 py-2 rounded-lg hover:bg-white/20 transition-colors group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Geri Dön
        </button>

        <div className="text-right">
          <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white to-orange-100">{goal.title}</h3>
          <p className="text-sm mt-1 text-orange-100">{goal.description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3">
        {/* AI Chat Section - Fixed Height */}
        <div className="lg:col-span-2 border-r border-gray-100 dark:border-gray-700 flex flex-col h-[calc(100vh-20rem)]">
          <div 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-6 space-y-6 bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} items-end space-x-2`}
              >
                {message.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-4 ${
                    message.sender === 'user'
                      ? 'bg-orange-500 text-white'
                      : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-lg'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <span className="text-xs opacity-70 mt-2 block">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                {message.sender === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-500 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Mesajınızı yazın..."
                className="flex-1 rounded-xl border-0 bg-gray-100 dark:bg-gray-700 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 dark:text-white"
              />
              <button
                type="submit"
                className="bg-orange-500 text-white rounded-xl px-6 py-3 text-sm font-medium hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-colors"
              >
                Gönder
              </button>
            </form>
          </div>
        </div>

        {/* Goal Details Section - Scrollable */}
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
                  <circle
                    cx="40"
                    cy="40"
                    r="36"
                    className="stroke-current text-gray-200 dark:text-gray-700"
                    strokeWidth="6"
                    fill="none"
                  />
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
            
            <div className="relative px-3 py-4">
              {/* Tıklanabilir alan */}
              <div 
                ref={progressBarRef}
                className="absolute inset-0 cursor-pointer"
                onMouseDown={handleMouseDown}
                onTouchStart={handleTouchStart}
              >
                {/* İlerleme çubuğu arka planı */}
                <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2">
                  <div className="h-2 bg-white/50 dark:bg-gray-700/50 rounded-full backdrop-blur-sm"></div>

                  {/* İlerleme çubuğu */}
                  <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all duration-150"
                    style={{ width: `${goalDetails.progress}%` }}
                  />

                  {/* İşaret çizgileri */}
                  <div className="absolute inset-0">
                    <div className="h-full flex justify-between items-center">
                      {Array.from({ length: 11 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-0.5 ${i % 5 === 0 ? 'h-2' : 'h-1'} bg-gray-300/50 dark:bg-gray-600/50 rounded-full`}
                        ></div>
                      ))}
                    </div>
                  </div>

                  {/* Kaydırıcı düğmesi */}
                  <div 
                    className="absolute top-1/2 -translate-y-1/2"
                    style={{ left: `${goalDetails.progress}%` }}
                  >
                    <div className="relative -ml-3 w-6 h-6 rounded-full bg-white border-2 border-orange-500 shadow-lg transform hover:scale-110 transition-all duration-150">
                      <div className="absolute inset-0 rounded-full bg-orange-500/0 hover:bg-orange-500/20 transition-colors"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Yüzde etiketleri */}
              <div className="absolute left-3 right-3 -bottom-2">
                <div className="flex justify-between text-xs font-medium text-gray-500 dark:text-gray-400 select-none pointer-events-none">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-500 dark:text-gray-400">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Son güncelleme: {goalDetails.lastUpdate.toLocaleDateString()}
              </div>
              <button 
                onClick={() => setGoalDetails(prev => ({ ...prev, progress: 0 }))}
                className="text-orange-500 hover:text-orange-600 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
              >
                Sıfırla
              </button>
            </div>
          </div>

          {/* Goal Details Card */}
          {goal.answers && (
            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/30">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Hedef Detayları</h4>
              {renderAnswers()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalChatAndDetails; 