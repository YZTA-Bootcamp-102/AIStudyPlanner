import { useParams, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getSprintPlanByGoal, createGeminiSprintPlan } from '../../services/sprintPlan';
import type { SprintRequest, SprintPlan, WeekPlan } from '../../services/sprintPlan';
import { ArrowLeft } from 'lucide-react';

const GoalSprintPage = () => {
  const { goalId } = useParams<{ goalId: string }>();
  const [sprint, setSprint] = useState<SprintPlan | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSprint = async () => {
    if (!goalId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getSprintPlanByGoal(Number(goalId));
      setSprint(data);
    } catch {
      setError('Sprint planı bulunamadı.');
    } finally {
      setLoading(false);
    }
  };

  const generateAIPlan = async () => {
    if (!goalId) return;
    setLoading(true);
    setError(null);

    try {
      const topic = sprint && sprint.weeks.length > 0
        ? sprint.weeks.map(w => w.topics.join(', ')).join('; ')
        : 'React frontend';

      const req: SprintRequest = {
        topic,
        level: 'Orta',
        daily_minutes: sprint ? sprint.daily_minutes : 30,
        duration_weeks: sprint ? sprint.duration_weeks : 4,
      };

      // Backend'e POST: AI ile plan oluştur ve kaydet
      const aiPlan = await createGeminiSprintPlan(Number(goalId), req);
      setSprint(aiPlan);
    } catch (err) {
      setError('AI plan oluşturulamadı.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSprint();
  }, [goalId]);

  return (
    <div className="p-8 space-y-6 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Link to="/goals" className="inline-flex items-center gap-2 text-blue-600 hover:underline">
        <ArrowLeft size={20} /> Geri
      </Link>

      <h2 className="text-2xl font-bold">Sprint Planı</h2>

      {loading && <p>Yükleniyor...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {sprint ? (
        <div className="space-y-4">
          <div className="mb-4">
            <p><strong>Toplam Hafta:</strong> {sprint.duration_weeks}</p>
            <p><strong>Günlük Süre:</strong> {sprint.daily_minutes} dk</p>
          </div>

          {sprint.weeks.map((week: WeekPlan) => (
            <div key={week.week_number} className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-800">
              <h3 className="text-xl font-semibold">Hafta {week.week_number}</h3>
              <ul className="list-disc ml-5">
                {week.topics.map((t, i) => (
                  <li key={i}>{t}</li>
                ))}
              </ul>
            </div>
          ))}

          <button
            onClick={generateAIPlan}
            className="mt-6 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:opacity-60"
            disabled={loading}
          >
            AI ile Yeni Plan Oluştur ve Kaydet
          </button>
        </div>
      ) : !loading && !error ? (
        <p>Henüz bir sprint planı oluşturulmamış.</p>
      ) : null}
    </div>
  );
};

export default GoalSprintPage;
