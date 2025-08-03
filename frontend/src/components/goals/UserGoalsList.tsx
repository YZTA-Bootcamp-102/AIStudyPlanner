import React, { useState } from 'react';
import type { StudyPlan } from '../../data/exampleStudyPlans';
import { useNavigate } from 'react-router-dom';
import UpdateGoalModal from './UpdateGoalModal';
import type { LearningGoalCreate } from './UpdateGoalModal';
import { deleteLearningGoal, updateLearningGoal } from '../../services/learningGoal';

interface UserGoalsListProps {
  goals: (StudyPlan & { progress: number; createdAt: Date; answers?: Record<string, string> })[];
  setGoals: React.Dispatch<
    React.SetStateAction<(StudyPlan & { progress: number; createdAt: Date; answers?: Record<string, string> })[]>
  >;
  onViewGoal: (goal: StudyPlan & { progress: number; createdAt: Date; answers?: Record<string, string> }) => void;
  onDeleteGoal: (goalId: string) => void;
}

const UserGoalsList: React.FC<UserGoalsListProps> = ({ goals, setGoals, onViewGoal, onDeleteGoal }) => {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<typeof goals[0] | null>(null);

  const openModal = (goal: typeof goals[0]) => {
    setSelectedGoal(goal);
    setModalOpen(true);
  };

  const handleUpdate = async (updatedGoal: LearningGoalCreate) => {
    if (!selectedGoal) return;
    try {
      const updated = await updateLearningGoal(Number(selectedGoal.id), updatedGoal);

      setGoals((prevGoals) =>
        prevGoals.map((g) =>
          g.id === selectedGoal.id
            ? {
                ...g,
                title: updated.title || g.title,
                answers: {
                  ...g.answers,
                  goal_text: updated.goal_text,
                  interest_areas: updated.interest_areas,
                  current_knowledge_level: updated.current_knowledge_level,
                  target_end_date: updated.target_end_date,
                },
                createdAt: new Date(updated.start_date),
              }
            : g
        )
      );
      setModalOpen(false);
    } catch (error) {
      console.error('Güncelleme hatası:', error);
      alert('Hedef güncellenirken hata oluştu.');
    }
  };

  const handleDelete = async (e: React.MouseEvent, goalId: string) => {
    e.stopPropagation();
    if (window.confirm('Bu hedefi silmek istediğinize emin misiniz?')) {
      try {
        await deleteLearningGoal(Number(goalId));
        // Silme işleminden sonra local state güncellemesi
        setGoals((prev) => prev.filter((goal) => goal.id !== goalId));
        onDeleteGoal(goalId);
      } catch (err) {
        console.error('Hedef silinirken hata oluştu:', err);
      }
    }
  };

  if (goals.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900 mb-4">
          <svg
            className="h-8 w-8 text-orange-500 dark:text-orange-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Henüz Hedef Oluşturmadınız</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          Yukarıdaki örnek planlardan birini seçin veya kendinize özel bir çalışma planı oluşturun.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 cursor-pointer"
            onClick={() => onViewGoal(goal)}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{goal.title}</h3>
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                {goal.answers?.current_knowledge_level || 'Özel Plan'}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4">{goal.description}</p>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">İlerleme</span>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{goal.progress}%</span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div
                className="bg-orange-500 dark:bg-orange-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${goal.progress}%` }}
              ></div>
            </div>

            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-between">
              <div className="flex items-center">
                <svg className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2..." clipRule="evenodd" />
                </svg>
                {goal.createdAt.toLocaleDateString()}
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/goals/${goal.id}`);
                }}
                className="bg-orange-100 dark:bg-orange-900 hover:bg-orange-200 dark:hover:bg-orange-800 text-orange-700 dark:text-orange-300 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200"
              >
                Modülleri Görüntüle
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openModal(goal);
                }}
                className="bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200"
              >
                Güncelle
              </button>
              <button
                onClick={(e) => handleDelete(e, goal.id)}
                className="bg-red-100 dark:bg-red-900 hover:bg-red-200 dark:hover:bg-red-800 text-red-700 dark:text-red-300 px-4 py-2 rounded-xl text-sm font-medium transition-colors duration-200"
              >
                Sil
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedGoal && (
        <UpdateGoalModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleUpdate}
          initialData={{
            title: selectedGoal.title,
            goal_text: selectedGoal.answers?.goal_text || '',
            interest_areas: selectedGoal.answers?.interest_areas || '',
            current_knowledge_level: selectedGoal.answers?.current_knowledge_level || '',
            start_date: selectedGoal.createdAt.toISOString().split('T')[0],
            target_end_date: selectedGoal.answers?.target_end_date || '',
            answers: selectedGoal.answers || {},
          }}
        />
      )}
    </>
  );
};

export default UserGoalsList;
