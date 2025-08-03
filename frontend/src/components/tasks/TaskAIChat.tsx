import { useState, useRef } from 'react';
import {
  Mic,
  Paperclip,
  Send,
  X,
  Loader2,
  Maximize2,
  Minimize2,
  Bot
} from 'lucide-react';
import { format } from 'date-fns';
import { sendMessageToAI } from '../../services/ai';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  contentType: 'text' | 'voice' | 'image' | 'file';
  timestamp: Date;
}

const TaskAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content:
        'Merhaba! Ben görevlerinizi düzenlemekte ve kontrol etmekte size yardımcı olan AI asistanınızım. Görevlerinizi ekleyebilir, düzenleyebilir, önceliklerini değiştirebilir ve takip edebilirim. Ayrıca sesli mesaj gönderebilir ve dosya ekleyebilirsiniz. Size nasıl yardımcı olabilirim?',
      contentType: 'text',
      timestamp: new Date(Date.now() - 30000)
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: selectedImage || inputMessage,
      contentType: selectedImage ? 'image' : 'text',
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setSelectedImage(null);
    setIsLoading(true);
    scrollToBottom();

    try {
      const response = await sendMessageToAI(userMessage.content);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response.reply,
        contentType: 'text',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content:
          error.message || 'AI yanıt veremedi. Lütfen daha sonra tekrar deneyin.',
        contentType: 'text',
        timestamp: new Date()
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        const fileMessage: Message = {
          id: Date.now().toString(),
          type: 'user',
          content: `Dosya yüklendi: ${file.name}`,
          contentType: 'file',
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, fileMessage]);
        scrollToBottom();
      }
    }
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
  };

  const containerClasses = `
    transition-all duration-700 ease-in-out transform
    ${isExpanded 
      ? 'fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center'
      : 'absolute top-0 left-0 w-full h-full'
    }
  `;

  const chatBoxClasses = `
    bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700
    flex flex-col overflow-hidden transition-all duration-700 ease-in-out transform
    ${isExpanded 
      ? 'w-[900px] h-[700px] translate-x-0 translate-y-0 scale-100'
      : 'w-full h-full hover:shadow-2xl translate-x-0 translate-y-0 scale-100'
    }
  `;

  return (
    <div
      className={containerClasses}
      onClick={(e) =>
        isExpanded && e.target === e.currentTarget && setIsExpanded(false)
      }
    >
      <div className={chatBoxClasses}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gradient-to-r from-orange-500 to-orange-600">
          <div className="flex items-center gap-2">
            <Bot className="text-white" size={24} />
            <div>
              <h2 className="text-lg font-bold text-white">AI Asistan</h2>
              <p className="text-xs text-orange-100">Görevlerinizi yönetmenize yardımcı olabilirim</p>
            </div>
          </div>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white"
          >
            {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 via-white to-gray-50/30 dark:from-gray-800/50 dark:via-gray-800 dark:to-gray-800/30 scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-3 max-w-[85%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {msg.type === 'ai' && (
                  <div className="relative">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                      <Bot size={18} className="text-white" />
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"></div>
                  </div>
                )}
                <div className={`rounded-2xl px-5 py-3 shadow-lg ${
                  msg.type === 'user'
                    ? 'bg-gradient-to-br from-orange-500 to-orange-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-orange-100 dark:border-orange-800'
                }`}>
                  {msg.contentType === 'image' ? (
                    <img src={msg.content} alt="Uploaded" className="rounded-lg max-w-full h-auto" />
                  ) : (
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  )}
                  <span className="text-[10px] mt-2 block opacity-70">
                    {format(msg.timestamp, 'HH:mm')}
                  </span>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
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
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800">
          {selectedImage && (
            <div className="mb-2 relative">
              <img src={selectedImage} alt="Selected" className="w-20 h-20 object-cover rounded-lg" />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:bg-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          )}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-500 hover:text-orange-500 transition-colors hover:bg-orange-50 dark:hover:bg-orange-900/30 rounded-xl"
            >
              <Paperclip size={20} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*,.pdf,.doc,.docx,.txt"
              className="hidden"
            />
            <button
              onClick={handleVoiceRecord}
              className={`p-2 transition-colors rounded-xl hover:bg-orange-50 dark:hover:bg-orange-900/30 ${
                isRecording ? 'text-red-500' : 'text-gray-500 hover:text-orange-500'
              }`}
            >
              <Mic size={20} />
            </button>
            <div className="flex-1 relative">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="AI asistana bir soru sor..."
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 transition-all duration-200"
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
            </div>
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() && !selectedImage}
              className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white transition-all duration-200 flex-shrink-0 shadow-lg hover:shadow-orange-500/25 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskAIChat;
