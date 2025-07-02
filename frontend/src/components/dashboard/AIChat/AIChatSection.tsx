import { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, Brain, MessageCircle } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: number;
  text: string;
  isAI: boolean;
  timestamp: Date;
}

const AIChatSection = () => {
  const [chatMessage, setChatMessage] = useState('');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `Merhaba (username ekle buraya)! Ben senin AI eğitim asistanınım! 🎓

Takviminde ders programını ve görevlerinde ödevlerini organize etmende sana yardımcı olabilirim.

Size nasıl yardımcı olabilirim? ✨`,
      isAI: true,
      timestamp: new Date()
    },

    {
      id: 2,
      text: `Bu da kullanıcı mesajı için örnek bir mesaj, API'a bağlanıp kullanıcının mesajını göndereceğiz. (isAI false olacak)`,
      isAI: false,
      timestamp: new Date()
    }
  ]);
  const [isAITyping, setIsAITyping] = useState(false);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isAITyping]);

  const sendMessage = () => {
    if (chatMessage.trim()) {
      const userMessage: Message = {
        id: Date.now(),
        text: chatMessage,
        isAI: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, userMessage]);
      setChatMessage('');
      setIsAITyping(true);

      // Simulate AI response
      setTimeout(() => {
        const aiMessage: Message = {
          id: Date.now() + 1,
          text: "Bu konuda sana yardımcı olabilirim. Daha detaylı bilgi verebilir misin?",
          isAI: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsAITyping(false);
      }, 1200);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="relative p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-orange-50 via-orange-100/50 to-orange-50 dark:from-orange-900/20 dark:via-orange-800/20 dark:to-orange-900/20">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center mr-4 shadow-lg">
                <Bot size={24} className="text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
                AI Eğitim Asistanı
                <Sparkles size={16} className="ml-2 text-orange-500 animate-pulse" />
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                Her zaman öğrenmeye hazır
              </p>
            </div>
          </div>
          <div className="flex items-center px-4 py-2 rounded-full bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm border border-orange-200 dark:border-orange-700 shadow-sm">
            <Brain size={16} className="text-orange-500 mr-2" />
            <span className="text-sm font-semibold text-orange-600 dark:text-orange-400">
              AI Destekli
            </span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div 
        ref={chatContainerRef}
        className="h-[320px] overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/30 dark:from-gray-800/50 dark:via-gray-800 dark:to-gray-800/30 scroll-smooth"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isAI ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`flex items-start space-x-3 max-w-[85%] ${message.isAI ? 'flex-row' : 'flex-row-reverse'}`}>
              {message.isAI && (
                <div className="relative">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                    <Bot size={18} className="text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"></div>
                </div>
              )}
              <div className={`rounded-2xl px-5 py-3 shadow-lg ${
                message.isAI
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-orange-100 dark:border-orange-800'
                  : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
              }`}>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                <span className="text-[10px] mt-2 block opacity-70">
                  {format(message.timestamp, 'HH:mm')}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isAITyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-3">
              <div className="relative">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
                  <Bot size={18} className="text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"></div>
              </div>
              <div className="rounded-2xl px-5 py-4 bg-white dark:bg-gray-700 shadow-lg border border-orange-100 dark:border-orange-800">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-orange-500 animate-bounce delay-300"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <textarea
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="AI asistana bir soru sor..."
              rows={1}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200"
            />
            <MessageCircle size={16} className="absolute right-3 top-3 text-gray-400" />
          </div>
          <button
            onClick={sendMessage}
            disabled={!chatMessage.trim()}
            className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white transition-all duration-200 flex-shrink-0 shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIChatSection; 