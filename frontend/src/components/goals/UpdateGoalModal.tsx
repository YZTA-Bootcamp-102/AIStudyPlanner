import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';

export interface LearningGoalCreate {
  goal_text: string;
  title?: string;
  interest_areas: string;
  current_knowledge_level: string;
  start_date: string;
  target_end_date: string;
}

export interface LearningGoalResponse extends LearningGoalCreate {
  id: number;
  progress: number;
  created_at: string;
}

interface UpdateGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedGoal: LearningGoalCreate) => void;
  initialData: LearningGoalCreate & {
    answers?: Record<string, string>;
  };
}

const formatDateInput = (date: string): string => {
  const parsed = new Date(date);
  if (isNaN(parsed.getTime())) return '';
  return parsed.toISOString().split('T')[0];
};

const UpdateGoalModal: React.FC<UpdateGoalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [title, setTitle] = useState(initialData.title || '');
  const [goalText, setGoalText] = useState(initialData.goal_text);
  const [interestAreas, setInterestAreas] = useState(initialData.interest_areas);
  const [knowledgeLevel, setKnowledgeLevel] = useState(initialData.current_knowledge_level);
  const [startDate, setStartDate] = useState(initialData.start_date);
  const [targetEndDate, setTargetEndDate] = useState(initialData.target_end_date);
  const [answers, setAnswers] = useState<Record<string, string>>(initialData.answers || {});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(initialData.title || '');
    setGoalText(initialData.goal_text ?? '');
    setInterestAreas(initialData.interest_areas || '');
    setKnowledgeLevel(initialData.current_knowledge_level || '');
    setStartDate(formatDateInput(initialData.start_date || ''));
    setTargetEndDate(formatDateInput(initialData.target_end_date || ''));
    setAnswers(initialData.answers || {});
  }, [initialData, isOpen]);

  const handleAnswerChange = (key: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!goalText || !goalText.trim() || !startDate || !targetEndDate) return;

    setLoading(true);
    try {
      await onSave({
        title: (title ?? '').trim() || undefined,
        goal_text: goalText.trim(),
        interest_areas: (interestAreas ?? '').trim(),
        current_knowledge_level: (knowledgeLevel ?? '').trim(),
        start_date: startDate,
        target_end_date: targetEndDate,
      });
      onClose();
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-4xl flex-col md:flex-row rounded-3xl bg-white dark:bg-gray-900 shadow-2xl"
        style={{ height: 'fit-content' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sol Panel */}
        <div className="flex-1 rounded-l-3xl bg-gray-50/60 dark:bg-gray-800/60 p-6 backdrop-blur-sm space-y-6">
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-4">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white font-bold text-xl select-none">
                {title?.[0]?.toUpperCase() || 'H'}
              </div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-2xl font-extrabold bg-transparent focus:outline-none focus:ring-2 focus:ring-orange-500/40 rounded px-2 py-1 text-gray-900 dark:text-white placeholder-gray-400"
                placeholder="Başlık (opsiyonel)"
                autoFocus
              />
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:text-red-500 transition"
              aria-label="Kapat"
            >
              <X size={22} />
            </button>
          </div>

         
            <div className="space-y-4">
        
            {/* Hedef Açıklaması */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Hedef Açıklaması
              </label>
              <textarea
                value={goalText}
                onChange={(e) => setGoalText(e.target.value)}
                className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 min-h-[100px]"
                placeholder="Bu hedefte ne başarmak istiyorsun?"
              />
            </div>

            {/* İlgi Alanları */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                İlgi Alanları
              </label>
              <input
                type="text"
                value={interestAreas}
                onChange={(e) => setInterestAreas(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
                placeholder="Örn: Matematik, Fizik, Tarih"
              />
            </div>

            {/* Bilgi Seviyesi */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Şu Anki Bilgi Seviyesi
              </label>
              <input
                type="text"
                value={knowledgeLevel}
                onChange={(e) => setKnowledgeLevel(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
                placeholder="Örn: Temel, Orta, İleri"
              />
            </div>

            {/* Başlangıç Tarihi */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Başlangıç Tarihi
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:invert-gray-500"
              />
            </div>

            {/* Bitiş Tarihi */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                Bitiş Tarihi
              </label>
              <input
                type="date"
                value={targetEndDate}
                onChange={(e) => setTargetEndDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:invert-gray-500"
              />
            </div>

            {/* Diğer Cevaplar (answers) */}
            {Object.entries(answers)
              .filter(([key]) => !['start_date', 'target_end_date','interest_areas','goal_text','current_knowledge_level'].includes(key))
              .map(([key, value]) => {
                const label = key
                  .replace(/_/g, ' ')
                  .replace(/\b\w/g, (char) => char.toUpperCase());
                const isLong = value.length > 50;
                return (
                  <div key={key} className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                      {label}
                    </label>
                    {isLong ? (
                      <textarea
                        value={value}
                        onChange={(e) => handleAnswerChange(key, e.target.value)}
                        className="w-full resize-y rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 min-h-[100px]"
                        placeholder={`${label} giriniz`}
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleAnswerChange(key, e.target.value)}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500/40 transition dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
                        placeholder={`${label} giriniz`}
                      />
                    )}
                  </div>
                );
              })}
          </div>


        </div>

        {/* Sağ Panel */}
        <div className="flex w-full flex-col gap-6 rounded-r-3xl border-l border-gray-200 bg-gray-50 p-8 dark:border-gray-700 dark:bg-gray-800">
          <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleSubmit}
              disabled={!goalText.trim() || loading}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={20} />
              {loading ? 'Kaydediliyor…' : 'Hedefi Güncelle'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateGoalModal;
