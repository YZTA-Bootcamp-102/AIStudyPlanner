import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { CheckCircle2, Circle, ArrowLeft, Pencil, Trash2, Plus } from "lucide-react";
import {
  getModulesByGoal,
  updateModule,
  deleteModule,
  createModule,
} from "../../services/ai";
import {
  getSprintPlanByGoal,
  createGeminiSprintPlan,
} from "../../services/sprintPlan";
import type { SprintPlan, SprintRequest } from "../../services/sprintPlan";
import type { LearningModuleOut } from "../../types/learningModule";

const GoalModulePage = () => {
  const { goalId } = useParams<{ goalId: string }>();
  const [modules, setModules] = useState<LearningModuleOut[]>([]);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState({ title: "", description: "" });
  const [newModule, setNewModule] = useState({
    title: "",
    description: "",
    category: "",
    learning_outcome: "",
  });

  const [sprintPlan, setSprintPlan] = useState<SprintPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressRate, setProgressRate] = useState(0);

  useEffect(() => {
    if (!goalId) return;
    fetchModulesAndPlan(Number(goalId));
  }, [goalId]);

  const fetchModulesAndPlan = async (id: number) => {
    try {
      setLoading(true);
      const mods = await getModulesByGoal(id);
      setModules(mods as LearningModuleOut[]);
      calculateProgress(mods as LearningModuleOut[]);
      const plan = await getSprintPlanByGoal(id);
      setSprintPlan(plan);
    } catch (err) {
      setError("Veriler yüklenemedi.");
    } finally {
      setLoading(false);
    }
  };

  const calculateProgress = (list: LearningModuleOut[]) => {
    const total = list.length;
    const completed = list.filter((m) => m.progress === 100).length;
    setProgressRate(total ? Math.round((completed / total) * 100) : 0);
  };

  const toggleProgress = async (mod: LearningModuleOut) => {
    const newProgress = mod.progress === 100 ? 0 : 100;
    await updateModule(mod.id, { ...mod, progress: newProgress });
    const updated = modules.map((m) =>
      m.id === mod.id ? { ...m, progress: newProgress } : m
    );
    setModules(updated);
    calculateProgress(updated);
  };

  const handleEdit = (mod: LearningModuleOut) => {
    setEditId(mod.id);
    setForm({ title: mod.title, description: mod.description });
  };

  const handleSave = async (mod: LearningModuleOut) => {
    await updateModule(mod.id, { ...mod, ...form });
    const updated = modules.map((m) =>
      m.id === mod.id ? { ...m, ...form } : m
    );
    setModules(updated);
    calculateProgress(updated);  // ayrı çağrı olmalı
    setEditId(null);
  };
  
  const handleDelete = async (modId: number) => {
    if (confirm("Modülü silmek istediğinize emin misiniz?")) {
      await deleteModule(modId);
      const filtered = modules.filter((m) => m.id !== modId);
      setModules(filtered);
      calculateProgress(filtered);
    }
  };

  const handleSprintCreate = async () => {
    if (!goalId) return;
    const req: SprintRequest = {
      topic: "React, TypeScript, Frontend",
      level: "Orta",
      daily_minutes: 30,
      duration_weeks: 4,
    };
    try {
      setLoading(true);
      const result = await createGeminiSprintPlan(Number(goalId), req);
      setSprintPlan(result);
    } catch {
      setError("Sprint planı oluşturulamadı.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateModule = async () => {
    if (!goalId || !newModule.title || !newModule.description) return;
  
    try {
      // newModule içine learning_goal_id ekle
      const moduleDataWithGoal = { ...newModule, learning_goal_id: Number(goalId), order: modules.length + 1 };
  
      const created = await createModule(moduleDataWithGoal);
      const updatedList = [...modules, created];
      setModules(updatedList);
      setNewModule({ title: "", description: "", category: "", learning_outcome: "" });
      calculateProgress(updatedList);
    } catch {
      setError("Modül oluşturulamadı.");
    }
  };
  

  const renderModuleCard = (mod: LearningModuleOut) => {
    const completed = mod.progress === 100;

    return (
      <div
        key={mod.id}
        className={`p-4 rounded-xl shadow-sm border hover:shadow-md transition bg-white/80 dark:bg-gray-900/30 ${
          completed ? "opacity-70" : ""
        }`}
      >
        <div className="flex justify-between items-start">
          <div className="flex gap-3">
            {completed ? (
              <CheckCircle2
                className="text-green-500 cursor-pointer"
                onClick={() => toggleProgress(mod)}
              />
            ) : (
              <Circle
                className="text-gray-400 cursor-pointer"
                onClick={() => toggleProgress(mod)}
              />
            )}

            <div>
              {editId === mod.id ? (
                <>
                  <input
                    className="w-full p-1 rounded bg-white text-gray-900 mb-1"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                  />
                  <textarea
                    className="w-full p-1 rounded bg-white text-gray-900"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                  />
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => handleSave(mod)}
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="px-2 py-1 bg-gray-400 text-white rounded"
                    >
                      Vazgeç
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-bold text-lg">{mod.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {mod.description}
                  </p>
                  <p className="text-xs mt-1 text-orange-500">
                    {mod.category} • {mod.learning_outcome}
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex gap-2 text-gray-500">
            <Pencil
              size={18}
              className="cursor-pointer hover:text-blue-600"
              onClick={() => handleEdit(mod)}
            />
            <Trash2
              size={18}
              className="cursor-pointer hover:text-red-600"
              onClick={() => handleDelete(mod.id)}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="pt-[100px] px-4 pb-12 min-h-screen bg-gradient-to-b from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8">
        {/* Sol - Modüller */}
        <div>
          <Link
            to="/goals"
            className="inline-flex items-center mb-6 gap-2 text-sm text-blue-600 hover:underline"
          >
            <ArrowLeft size={18} />
            Geriye Dön
          </Link>

          <h2 className="text-2xl font-semibold mb-2">Modüller</h2>
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
            İlerleme: {progressRate}%
          </p>

          <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded shadow">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Plus size={20} />
              Yeni Modül Oluştur
            </h3>
            <input
              className="w-full mb-2 p-2 rounded border bg-white text-gray-900"
              placeholder="Başlık"
              value={newModule.title}
              onChange={(e) =>
                setNewModule({ ...newModule, title: e.target.value })
              }
            />
            <textarea
              className="w-full mb-2 p-2 rounded border bg-white text-gray-900"
              placeholder="Açıklama"
              value={newModule.description}
              onChange={(e) =>
                setNewModule({ ...newModule, description: e.target.value })
              }
            />
            <input
              className="w-full mb-2 p-2 rounded border bg-white text-gray-900"
              placeholder="Kategori"
              value={newModule.category}
              onChange={(e) =>
                setNewModule({ ...newModule, category: e.target.value })
              }
            />
            <input
              className="w-full mb-2 p-2 rounded border bg-white text-gray-900"
              placeholder="Kazanım"
              value={newModule.learning_outcome}
              onChange={(e) =>
                setNewModule({ ...newModule, learning_outcome: e.target.value })
              }
            />
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={handleCreateModule}
            >
              Ekle
            </button>
          </div>

          {loading ? (
            <p>Yükleniyor...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : modules.length === 0 ? (
            <p>Hiç modül bulunamadı.</p>
          ) : (
            <div className="space-y-4">{modules.map(renderModuleCard)}</div>
          )}
        </div>

        {/* Sağ - Sprint Planı */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">Sprint Planı</h2>
          <button
            onClick={handleSprintCreate}
            className="mb-4 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            AI ile Sprint Planı Oluştur
          </button>

          {loading ? (
            <p>Yükleniyor...</p>
          ) : sprintPlan ? (
            <div className="space-y-4">
              {sprintPlan.weeks.map((week) => (
                <div
                  key={week.week_number}
                  className="p-4 bg-white/90 dark:bg-gray-800 rounded shadow"
                >
                  <h4 className="font-semibold">Hafta {week.week_number}</h4>
                  <ul className="ml-5 mt-2 list-disc text-sm text-gray-700 dark:text-gray-300">
                    {week.topics.map((topic, idx) => (
                      <li key={idx}>{topic}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p>Sprint planı bulunamadı.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalModulePage;
