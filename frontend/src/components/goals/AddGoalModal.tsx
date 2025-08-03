import React, { useState } from 'react';
import { X, Target, Plus } from 'lucide-react';
import { createLearningGoal } from '../../services/learningGoal';
import type { LearningGoalResponse } from '../../types/learningGoal';

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (goal: LearningGoalResponse) => void;
}

const AddGoalModal: React.FC<AddGoalModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [goalText, setGoalText] = useState('');
  const [interests, setInterests] = useState('');
  const [knowledge, setKnowledge] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const isFormValid = () =>
    title.trim() !== '' &&
    goalText.trim() !== '' &&
    startDate.trim() !== '' &&
    endDate.trim() !== '';

  const handleSubmit = async () => {
    if (!isFormValid()) return;

    // Tarihlerin geçerli olduğundan emin ol
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      alert('Lütfen geçerli bir tarih seçin.');
      return;
    }
    if (start > end) {
      alert('Başlangıç tarihi hedef bitiş tarihinden sonra olamaz.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: title.trim(),
        goal_text: goalText.trim(),
        interest_areas: interests.trim(),
        current_knowledge_level: knowledge.trim(),
        start_date: start.toISOString(),
        target_end_date: end.toISOString(),
      };

      const newGoal = await createLearningGoal(payload);
      onSubmit(newGoal);
      onClose();
    } catch (err) {
      console.error('Hedef oluşturulurken hata:', err);
      alert('Hedef oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md p-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-gray-900 shadow-2xl p-8 sm:p-10 flex flex-col"
      >
        <button
          onClick={onClose}
          aria-label="Kapat"
          className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition"
          disabled={loading}
        >
          <X size={24} />
        </button>

        <h2 className="mb-8 flex items-center gap-3 text-3xl font-extrabold text-gray-900 dark:text-white">
          <Target size={26} className="text-orange-500" />
          Yeni Öğrenme Hedefi Oluştur
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="flex flex-col gap-6"
        >
          <div>
            <label
              htmlFor="goal-title"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Başlık
            </label>
            <input
              id="goal-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Hedef başlığı girin"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
              autoFocus
              required
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="goal-text"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Hedef Tanımı
            </label>
            <textarea
              id="goal-text"
              value={goalText}
              onChange={(e) => setGoalText(e.target.value)}
              placeholder="Ne öğrenmek istiyorsun?"
              rows={4}
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500 resize-none"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="interests"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              İlgi Alanları
            </label>
            <input
              id="interests"
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="Yapay zeka, yazılım, fizik…"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="knowledge"
              className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
            >
              Mevcut Bilgi Düzeyin
            </label>
            <input
              id="knowledge"
              type="text"
              value={knowledge}
              onChange={(e) => setKnowledge(e.target.value)}
              placeholder="Başlangıç, orta seviye, ileri…"
              className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 placeholder-gray-400 shadow-sm transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="start-date"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Başlangıç Tarihi
              </label>
              <input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label
                htmlFor="end-date"
                className="mb-2 block text-sm font-semibold text-gray-700 dark:text-gray-300"
              >
                Hedef Bitiş Tarihi
              </label>
              <input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-900 shadow-sm transition focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                required
                disabled={loading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={!isFormValid() || loading}
            className="mt-6 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus size={20} />
            {loading ? 'Kaydediliyor…' : 'Hedefi Kaydet'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddGoalModal;
