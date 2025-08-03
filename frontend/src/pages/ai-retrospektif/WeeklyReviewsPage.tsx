import { useEffect, useState } from 'react';
import {
  getCurrentWeekStats,
  getWeeklyComment,
  getWeeklyComparison,
  submitFeedback,
  getDailyFocusTip,           // buraya eklendi
} from '../../services/weeklyReview';
import { Check, ThumbsUp, ThumbsDown, Clock } from 'lucide-react';
import { api } from '../../services/auth';

const WeeklyReviewsPage = () => {
  const [stats, setStats] = useState<any>(null);
  const [aiComment, setAiComment] = useState<any>(null);
  const [comparison, setComparison] = useState<any>(null);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [loading, setLoading] = useState(true);

  // Günlük odak ipucu state
  const [focusTip, setFocusTip] = useState<string>('');
  const [focusTipSent, setFocusTipSent] = useState(false);

  const userId = 1; // Auth entegre olunca otomatik alınacak

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, commentRes, comparisonRes, focusTipRes] = await Promise.all([
          getCurrentWeekStats(),
          getWeeklyComment(),
          getWeeklyComparison(userId),
          getDailyFocusTip()           // servisten çağırdık
        ]);

        setStats(statsRes);
        setAiComment(commentRes ?? null);
        setComparison(comparisonRes);
        setFocusTip(focusTipRes.tip);
      } catch {
        alert('Veriler yüklenemedi.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFeedback = async (isHelpful: boolean) => {
    if (!aiComment) return;
    await submitFeedback({
      user_id: userId,
      comment_id: aiComment.comment_id ?? '',
      is_helpful: isHelpful,
      feedback_text: '',
    });
    setFeedbackSent(true);
  };

  const handleFocusFeedback = async (feedback: string) => {
    getDailyFocusTip()

  }  

  if (loading) return <p className="p-6 text-center text-orange-500">Yükleniyor...</p>;

  return (
    <div
      className="p-6 max-w-5xl mx-auto space-y-12 min-h-screen
      bg-gradient-to-b from-gray-50 via-white to-gray-50
      dark:from-[#0d1b2a] dark:via-[#1b263b] dark:to-[#0d1b2a]
      text-gray-800 dark:text-gray-100 transition-colors duration-500"
    >
      {/* Başlık */}
      <h1
        className="mt-16 text-4xl font-extrabold text-center
        bg-gradient-to-r from-orange-500 to-orange-700
        dark:from-orange-400 dark:to-orange-600
        bg-clip-text text-transparent drop-shadow-md"
      >
        Haftalık İnceleme
      </h1>

      {/* Günlük Odak İpucu */}
      {!focusTipSent && (
        <div
          className="bg-orange-50 dark:bg-[#1b263b]/80 rounded-2xl p-6 shadow-md border border-orange-100
          dark:border-orange-700 transition-all hover:shadow-lg duration-300"
        >
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-orange-500" size={22} />
            <h2 className="text-xl font-semibold text-orange-600 dark:text-orange-400">Günün Odak İpucu</h2>
          </div>
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {focusTip || 'Günün ipucu yükleniyor...'}
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => handleFocusFeedback('Uyguladım')}
              className="px-4 py-2 rounded-xl bg-green-100 hover:bg-green-200 dark:bg-green-700/50 dark:hover:bg-green-700
              text-green-700 dark:text-green-300 transition-colors"
            >
              Uyguladım
            </button>
            <button
              onClick={() => handleFocusFeedback('İlginç değil')}
              className="px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-700/50 dark:hover:bg-red-700
              text-red-700 dark:text-red-300 transition-colors"
            >
              İlginç değil
            </button>
          </div>
        </div>
      )}
      {focusTipSent && (
        <p className="text-green-500 flex items-center justify-center gap-2 text-sm">
          <Check size={16} /> Odak önerisi kaydedildi.
        </p>
      )}

      {/* Haftalık Özet */}
      {stats && (
        <div
          className="bg-white/80 dark:bg-[#1b263b]/80 backdrop-blur-md rounded-2xl p-6 shadow-md border border-orange-100
          dark:border-orange-700 hover:shadow-lg transition-all duration-300"
        >
          <h2 className="text-2xl font-bold mb-4 text-orange-600 dark:text-orange-400">Bu Haftanın Özeti</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gray-50 dark:bg-[#0d1b2a] rounded-xl shadow-inner">
              <p className="text-3xl font-bold text-orange-600">{stats.total_tasks}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Görev Sayısı</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-[#0d1b2a] rounded-xl shadow-inner">
              <p className="text-3xl font-bold text-green-600">{stats.completed_tasks}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tamamlanan</p>
            </div>
            <div className="p-4 bg-gray-50 dark:bg-[#0d1b2a] rounded-xl shadow-inner">
              <p className="text-3xl font-bold text-red-500">{stats.incomplete_tasks}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tamamlanmayan</p>
            </div>
            <div className="col-span-2 sm:col-span-1 p-4 bg-gray-50 dark:bg-[#0d1b2a] rounded-xl shadow-inner">
              <p className="text-3xl font-bold text-orange-500">{stats.avg_duration_minutes} dk</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Ortalama Süre</p>
            </div>
            <div className="col-span-2 sm:col-span-2 p-4 bg-gray-50 dark:bg-[#0d1b2a] rounded-xl shadow-inner">
              <p className="text-3xl font-bold text-orange-600">
                {(stats.completion_rate * 100).toFixed(1)}%
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Tamamlama Oranı</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4 text-center">
            Dönem: {stats.start_date} → {stats.end_date}
          </p>
        </div>
      )}

      {/* AI Comment */}
      {aiComment && (
        <div
          className="bg-white/80 dark:bg-[#1b263b]/80 rounded-2xl p-6 shadow-md border border-orange-100
          dark:border-orange-700 transition-all hover:shadow-lg duration-300"
        >
          <h2 className="text-2xl font-bold mb-3 text-gray-600 dark:text-gray-400">AI Yorum & Öneriler</h2>
          <p className="mb-4 italic text-gray-700 dark:text-gray-300 leading-relaxed">{aiComment.comment}</p>
          <ul className="list-disc ml-6 space-y-1 text-sm text-gray-700 dark:text-gray-300">
          {(aiComment.areas_for_improvement && Array.isArray(aiComment.areas_for_improvement)
                ? aiComment.areas_for_improvement
                : []
            ).map((item: string, idx: number) => (
                    <li key={idx}>{item}</li>
             ))}
          </ul>

          {!feedbackSent && (
            <div className="flex gap-6 mt-6 justify-center">
              <button
                onClick={() => handleFeedback(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-100 hover:bg-green-200
                dark:bg-green-700/50 dark:hover:bg-green-700 text-green-700 dark:text-green-300 transition-colors"
              >
                <ThumbsUp size={18} /> Faydalıydı
              </button>
              <button
                onClick={() => handleFeedback(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 hover:bg-red-200
                dark:bg-red-700/50 dark:hover:bg-red-700 text-red-700 dark:text-red-300 transition-colors"
              >
                <ThumbsDown size={18} /> Faydalı değildi
              </button>
            </div>
          )}

          {feedbackSent && (
            <p className="text-green-500 mt-4 flex items-center justify-center gap-2 text-sm">
              <Check size={16} /> Geri bildirim alındı.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default WeeklyReviewsPage;
