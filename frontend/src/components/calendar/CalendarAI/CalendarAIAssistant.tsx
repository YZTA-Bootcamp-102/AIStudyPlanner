import React, { useState } from 'react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Bot, Send } from 'lucide-react';
import type { CalendarTask } from '../../../data/mockCalendarData';

interface CalendarAIAssistantProps {
  selectedDate: Date;
  tasks: CalendarTask[];
}

const CalendarAIAssistant: React.FC<CalendarAIAssistantProps> = ({ selectedDate, tasks }) => {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: 'Merhaba! Ben takvim asistanınızım. Size nasıl yardımcı olabilirim?'
    }
  ]);

  const handleSendMessage = () => {
    if (!message.trim()) return;

    // Kullanıcı mesajını ekle
    const userMessage = { role: 'user' as const, content: message };
    
    // AI yanıtını hazırla
    const aiResponse = { 
      role: 'assistant' as const, 
      content: generateAIResponse(message, selectedDate, tasks) 
    };

    setChatHistory(prev => [...prev, userMessage, aiResponse]);
    setMessage('');
  };

  const generateAIResponse = (userMessage: string, date: Date, tasks: CalendarTask[]) => {
    const dayTasks = tasks.filter(task => 
      new Date(task.date).toDateString() === date.toDateString()
    );

    const formattedDate = format(date, 'd MMMM yyyy', { locale: tr });
    
    if (userMessage.toLowerCase().includes('görev') || userMessage.toLowerCase().includes('plan')) {
      if (dayTasks.length === 0) {
        return `${formattedDate} tarihinde planlanmış bir göreviniz bulunmuyor.`;
      }
      
      const taskList = dayTasks
        .map(task => `- ${format(task.date, 'HH:mm')}: ${task.title} (${task.priority} öncelik)`)
        .join('\n');
      
      return `${formattedDate} tarihindeki görevleriniz:\n${taskList}`;
    }

    if (userMessage.toLowerCase().includes('öncelikli')) {
      const highPriorityTasks = dayTasks.filter(task => task.priority === 'high');
      
      if (highPriorityTasks.length === 0) {
        return `${formattedDate} tarihinde yüksek öncelikli göreviniz bulunmuyor.`;
      }
      
      const taskList = highPriorityTasks
        .map(task => `- ${format(task.date, 'HH:mm')}: ${task.title}`)
        .join('\n');
      
      return `${formattedDate} tarihindeki yüksek öncelikli görevleriniz:\n${taskList}`;
    }

    if (userMessage.toLowerCase().includes('özet')) {
      const stats = {
        total: dayTasks.length,
        completed: dayTasks.filter(t => t.completed).length,
        high: dayTasks.filter(t => t.priority === 'high').length,
        medium: dayTasks.filter(t => t.priority === 'medium').length,
        low: dayTasks.filter(t => t.priority === 'low').length
      };

      return `${formattedDate} tarihinin özeti:\n` +
        `Toplam ${stats.total} görev\n` +
        `${stats.completed} tamamlanmış görev\n` +
        `${stats.high} yüksek öncelikli\n` +
        `${stats.medium} orta öncelikli\n` +
        `${stats.low} düşük öncelikli görev`;
    }

    return 'Size nasıl yardımcı olabilirim? Günlük görevlerinizi görmek, öncelikli işlerinizi listelemek veya günün özetini almak için sorabilirsiniz.';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden h-[calc(100vh-200px)] flex flex-col">
      {/* Başlık */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-orange-50 to-orange-100 dark:from-gray-800 dark:to-gray-700">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Takvim Asistanı
          </h2>
        </div>
      </div>

      {/* Sohbet Geçmişi */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatHistory.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.role === 'user'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
              }`}
            >
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {msg.content}
              </pre>
            </div>
          </div>
        ))}
      </div>

      {/* Mesaj Giriş */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Bir mesaj yazın..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 dark:focus:ring-orange-400"
          />
          <button
            onClick={handleSendMessage}
            className="p-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CalendarAIAssistant; 