import React, { useState } from 'react';

interface CustomPlanChatProps {
  onComplete: (planDetails: Record<string, string>) => void;
  onBack: () => void;
}

const CustomPlanChat: React.FC<CustomPlanChatProps> = ({ onComplete, onBack }) => {
  const [subject, setSubject] = useState('');
  const [goals, setGoals] = useState('');
  const [duration, setDuration] = useState('');
  const [schedule, setSchedule] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      subject,
      goals,
      duration,
      schedule,
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 mb-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Özel Çalışma Planı Oluştur
        </h2>
        <button
          onClick={onBack}
          className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="subject"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Çalışmak istediğiniz konu nedir?
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Örn: Matematik, İngilizce, Programlama..."
            required
          />
        </div>

        <div>
          <label
            htmlFor="goals"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Bu konuda ulaşmak istediğiniz hedefler nelerdir?
          </label>
          <textarea
            id="goals"
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Hedeflerinizi detaylı bir şekilde açıklayın..."
            rows={4}
            required
          />
        </div>

        <div>
          <label
            htmlFor="duration"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Ne kadar sürede bu hedeflere ulaşmayı planlıyorsunuz?
          </label>
          <input
            type="text"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Örn: 3 ay, 6 ay, 1 yıl..."
            required
          />
        </div>

        <div>
          <label
            htmlFor="schedule"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Haftalık çalışma programınız nasıl olacak?
          </label>
          <textarea
            id="schedule"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            placeholder="Hangi günler, günde kaç saat çalışmayı planlıyorsunuz?"
            rows={3}
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Geri
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 transition-colors"
          >
            Plan Oluştur
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomPlanChat; 