import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Circle, ArrowLeft, Pencil, Trash2, Plus } from 'lucide-react';
import {
  getModulesByGoal,
  updateModule,
  deleteModule,
  createModule,
} from '../../services/ai';
import {
  getSprintPlanByGoal,
  createGeminiSprintPlan,
} from '../../services/sprintPlan';
import type { SprintPlan, SprintRequest } from '../../services/sprintPlan';
import type { LearningModuleOut } from '../../types/learningModule';

const GoalModulePage: React.FC = () => {
  const { goalId } = useParams<{ goalId: string }>();
  const [modules, setModules] = useState<LearningModuleOut[]>([]);
  const [sprintPlan, setSprintPlan] = useState<SprintPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newModule, setNewModule] = useState({ title: '', description: '', category: '', learning_outcome: '' });
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: '', description: '' });

  const fetchAll = async () => {
    if (!goalId) return;
    setLoading(true);
    try {
      const mods = await getModulesByGoal(Number(goalId));
      setModules(mods as LearningModuleOut[]);
      const plan = await getSprintPlanByGoal(Number(goalId));
      setSprintPlan(plan);
    } catch {
      setError('Veriler yüklenemedi.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, [goalId]);

  const toggleCompletion = async (mod: LearningModuleOut) => {
    await updateModule(mod.id, { ...mod, progress: mod.progress === 100 ? 0 : 100 });
    fetchAll();
  };

  const handleSave = async (mod: LearningModuleOut) => {
    await updateModule(mod.id, { ...mod, title: form.title, description: form.description });
    setEditId(null);
    fetchAll();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Modülü silmek istediğinize emin misiniz?')) {
      await deleteModule(id);
      fetchAll();
    }
  };

  const handleCreateModule = async () => {
    if (!goalId || !newModule.title || !newModule.description) return;
    await createModule({
      title: newModule.title,
      description: newModule.description,
      category: newModule.category,
      learning_outcome: newModule.learning_outcome,
      learning_goal_id: Number(goalId),  // Artık tip tanımında var
      order: modules.length + 1
    });
    
    
    setNewModule({ title: '', description: '', category: '', learning_outcome: '' });
    fetchAll();
  };

  const handleSprintCreate = async () => {
    if (!goalId) return;
    setLoading(true);
    try {
      const plan = await createGeminiSprintPlan(Number(goalId), {
        topic: 'React, TypeScript, Frontend',
        level: 'Orta',
        daily_minutes: 30,
        duration_weeks: 4
      });
      setSprintPlan(plan);
    } catch {
      setError('Sprint planı oluşturulamadı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-[100px] px-4 pb-12 bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
        <div>
          <Link to="/goals" className="inline-flex items-center mb-6 gap-2 text-sm text-blue-600 hover:underline">
            <ArrowLeft size={18} /> Geriye Dön
          </Link>
          <h2 className="text-2xl font-semibold mb-2">Modüller</h2>
          {loading ? <p>Yükleniyor...</p> : error ? <p className="text-red-500">{error}</p> :
            <>
              <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded shadow">
                <h3 className="flex items-center gap-2 text-lg mb-2"><Plus size={20}/> Yeni Modül Oluştur</h3>
                <input placeholder="Başlık" value={newModule.title} onChange={e => setNewModule({ ...newModule, title: e.target.value })} className="w-full mb-2 p-2 border rounded"/>
                <textarea placeholder="Açıklama" value={newModule.description} onChange={e => setNewModule({ ...newModule, description: e.target.value })} className="w-full mb-2 p-2 border rounded"/>
                <input placeholder="Kategori" value={newModule.category} onChange={e => setNewModule({ ...newModule, category: e.target.value })} className="w-full mb-2 p-2 border rounded"/>
                <input placeholder="Kazanım" value={newModule.learning_outcome} onChange={e => setNewModule({ ...newModule, learning_outcome: e.target.value })} className="w-full mb-2 p-2 border rounded"/>
                <button onClick={handleCreateModule} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Ekle</button>
              </div>
              {modules.map(mod => (
                <div key={mod.id} className={`p-4 rounded-xl shadow-sm border mb-4 bg-white/80 dark:bg-gray-900/30 ${mod.progress === 100 ? 'opacity-70' : ''}`}>
                  <div className="flex justify-between">
                    <div className="flex gap-3">
                      {mod.progress === 100 ?
                        <CheckCircle2 className="text-green-500 cursor-pointer" onClick={() => toggleCompletion(mod)} /> :
                        <Circle className="text-gray-400 cursor-pointer" onClick={() => toggleCompletion(mod)} />
                      }
                      <div>
                        {editId === mod.id ? (
                          <>
                            <input className="w-full mb-1 p-1 rounded" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}/>
                            <textarea className="w-full p-1 rounded" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })}/>
                            <div className="mt-2 flex gap-2">
                              <button onClick={() => handleSave(mod)} className="px-2 py-1 bg-blue-500 text-white rounded">Kaydet</button>
                              <button onClick={() => setEditId(null)} className="px-2 py-1 bg-gray-400 text-white rounded">Vazgeç</button>
                            </div>
                          </>
                        ) : (
                          <>
                            <h3 className="font-bold text-lg">{mod.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{mod.description}</p>
                            <p className="text-xs mt-1 text-orange-500">{mod.category} • {mod.learning_outcome}</p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 text-gray-500">
                      <Pencil size={18} className="cursor-pointer hover:text-blue-600" onClick={() => { setEditId(mod.id); setForm({ title: mod.title, description: mod.description }); }} />
                      <Trash2 size={18} className="cursor-pointer hover:text-red-600" onClick={() => handleDelete(mod.id)} />
                    </div>
                  </div>
                </div>
              ))}
            </>
          }
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Sprint Planı</h2>
          <button onClick={handleSprintCreate} className="mb-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600">
            AI ile Sprint Planı Oluştur
          </button>
          {loading && <p>Yükleniyor...</p>}
          {sprintPlan ? sprintPlan.weeks.map(w => (
            <div key={w.week_number} className="p-4 bg-white/90 dark:bg-gray-800 rounded shadow mb-2">
              <h4 className="font-semibold">Hafta {w.week_number}</h4>
              <ul className="ml-5 list-disc text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {w.topics.map((t, i) => <li key={i}>{t}</li>)}
              </ul>
            </div>
          )) : !loading && <p>Sprint planı bulunamadı.</p>}
        </div>
      </div>
    </div>
  );
};

export default GoalModulePage;
