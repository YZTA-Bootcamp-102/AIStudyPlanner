import { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Send } from 'lucide-react';
import { format } from 'date-fns';
import { sendMessageToAI } from '../../services/ai';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  contentType: 'text';
  timestamp: Date;
}

const GoalAIChat = () => {
  const [messages, setMessages] = useState<Message[]>([{
    id: '1',
    type: 'ai',
    content: 'Merhaba! Ben öğrenme hedeflerinizle ilgili yardımcı AI asistanınızım. Size nasıl yardımcı olabilirim?',
    contentType: 'text',
    timestamp: new Date(),
  }]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: uuidv4(),
      type: 'user',
      content: input.trim(),
      contentType: 'text',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    scrollToBottom();

    try {
      const response = await sendMessageToAI(userMessage.content);
      const aiMessage: Message = {
        id: uuidv4(),
        type: 'ai',
        content: response.reply,
        contentType: 'text',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error: any) {
      const aiMessage: Message = {
        id: uuidv4(),
        type: 'ai',
        content: error.message || 'AI yanıt veremedi. Lütfen daha sonra tekrar deneyin.',
        contentType: 'text',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
    } finally {
      setIsLoading(false);
      scrollToBottom();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="h-[500px] overflow-y-auto bg-gray-100 dark:bg-gray-800 rounded-xl p-4 shadow-inner space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start space-x-2 max-w-[70%] ${msg.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              {msg.type === 'ai' && (
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold shadow-md">
                  AI
                </div>
              )}
              <div
                className={`rounded-xl px-4 py-3 leading-relaxed text-[13px] shadow-sm ${
                  msg.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-orange-200 dark:border-orange-600'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <div className="text-[10px] text-right opacity-60 mt-1">
                  {format(msg.timestamp, 'HH:mm')}
                </div>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="text-sm text-gray-500 italic">Yanıt bekleniyor...</div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-4 flex flex-col">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          placeholder="Mesajınızı yazın ve Enter'a basın..."
          className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={sendMessage}
          disabled={isLoading || !input.trim()}
          className="mt-2 py-2 px-4 rounded-md bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
          Gönder
        </button>
      </div>
    </div>
  );
};

export default GoalAIChat;
