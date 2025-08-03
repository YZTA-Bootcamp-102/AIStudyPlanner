import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import DashboardHeader from '../../components/DashboardHeader';
import StudyPlanCard from '../../components/goals/StudyPlanCard';
import StudyPlanQuestions from '../../components/goals/StudyPlanQuestions';
import CustomPlanChat from '../../components/goals/CustomPlanChat';
import GoalChatAndDetails from '../../components/goals/GoalChatAndDetails';
import AddGoalModal from '../../components/goals/AddGoalModal';
import type { StudyPlan } from '../../data/exampleStudyPlans';
import { exampleStudyPlans, customPlanTemplate } from '../../data/exampleStudyPlans';
import type { LearningGoalResponse } from '../../types/learningGoal';
import { deleteLearningGoal, getAllLearningGoals } from '../../services/learningGoal';
import { Plus } from 'lucide-react';
import UserGoalsList from '../../components/goals/UserGoalsList';

interface ViewMode {
  type: 'list' | 'questions' | 'custom-chat' | 'goal-chat';
  data?: any;
}

const GoalsPage: React.FC = () => {
  const [userGoals, setUserGoals] = useState<(StudyPlan & {
    progress: number;
    createdAt: Date;
    answers?: Record<string, string>;
  })[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>({ type: 'list' });
  const [selectedPlan, setSelectedPlan] = useState<StudyPlan | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // 📦 API'den veri çek
  useEffect(() => {
    (async () => {
      try {
        const goals = await getAllLearningGoals();
        const mapped = goals.map(goal => ({
          id: goal.id.toString(),
          title: goal.title || goal.goal_text,
          description: `${goal.interest_areas} | Bilgi seviyesi: ${goal.current_knowledge_level}`,
          questions: [],
          progress: goal.progress ?? 0,
          createdAt: new Date(goal.created_at ?? goal.start_date),
          answers: {
            goal_text: goal.goal_text,
            interest_areas: goal.interest_areas,
            current_knowledge_level: goal.current_knowledge_level,
            start_date: goal.start_date,
            target_end_date: goal.target_end_date,
          },
        }));
        setUserGoals(mapped);
      } catch (e) {
        console.error('Hedef yüklenirken hata:', e);
      }
    })();
  }, []);

  const handlePlanSelect = (plan: StudyPlan) => {
    setSelectedPlan(plan);
    setViewMode({ type: plan.id === 'custom' ? 'custom-chat' : 'questions' });
  };

  const handlePlanSubmit = (answers: Record<string, string>) => {
    const newGoal = {
      ...selectedPlan!,
      progress: 0,
      createdAt: new Date(),
      answers,
    };
    setViewMode({ type: 'goal-chat', data: newGoal });
  };

  const handleCustomPlanComplete = (planDetails: Record<string, string>) => {
    const newGoal = {
      id: Date.now().toString(),
      title: planDetails.subject,
      description: planDetails.goals,
      questions: [],
      progress: 0,
      createdAt: new Date(),
      answers: planDetails,
    };
    setUserGoals(prev => [newGoal, ...prev]);
    setViewMode({ type: 'list' });
  };

  const handleGoalClick = (goal: StudyPlan & { progress: number; createdAt: Date; answers?: Record<string, string> }) => {
    setViewMode({ type: 'goal-chat', data: goal });
  };

  const handleGoalChatComplete = () => setViewMode({ type: 'list' });

  const handleAddSubmit = (goal: LearningGoalResponse) => {
    const newGoal = {
      id: goal.id.toString(),
      title: goal.title || goal.goal_text,
      description: `${goal.interest_areas} | Bilgi: ${goal.current_knowledge_level}`,
      questions: [],
      progress: goal.progress,
      createdAt: new Date(goal.created_at),
      answers: {
        goal_text: goal.goal_text,
        interest_areas: goal.interest_areas,
        current_knowledge_level: goal.current_knowledge_level,
        start_date: goal.start_date,
        target_end_date: goal.target_end_date,
      },
    };
    setUserGoals(prev => [newGoal, ...prev]);
    setIsAddModalOpen(false);
  };
  const handleDeleteGoal = (goalId: string) => {
  setUserGoals(prev => prev.filter(goal => goal.id !== goalId));
  };

    


   const renderContent = () => {
    switch (viewMode.type) {
      case 'questions':
        return (
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 mb-8">
            <StudyPlanQuestions
              questions={selectedPlan!.questions}
              onSubmit={handlePlanSubmit}
              onBack={() => setViewMode({ type: 'list' })}
            />
          </div>
        );

      case 'custom-chat':
        return (
          <CustomPlanChat
            onComplete={handleCustomPlanComplete}
            onBack={() => setViewMode({ type: 'list' })}
          />
        );

      case 'goal-chat':
        return (
          <GoalChatAndDetails
            goal={viewMode.data}
            onBack={() => setViewMode({ type: 'list' })}
            onComplete={handleGoalChatComplete}
          />
        );

      default:
        return (
          <>
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Örnek Çalışma Planları
              </h2>
                <div className="flex justify-end mb-6">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl text-base font-semibold shadow-md min-w-[140px] touch-manipulation"
                    style={{ touchAction: 'manipulation' }} // ekstra dokunma iyileştirmesi
                    aria-label="+ Yeni Hedef Ekle"
                  >
                    + Yeni Hedef
                  </button>
                </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {exampleStudyPlans.map((plan) => (
                  <StudyPlanCard
                    key={plan.id}
                    title={plan.title}
                    description={plan.description}
                    onClick={() => handlePlanSelect(plan)}
                    icon={
                      plan.id === 'yks-hazirlik' ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-7 w-7"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M12 14l9-5-9-5-9 5 9 5z" />
                          <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                          />
                        </svg>
                      ) : plan.id === 'dil-ogrenme' ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-7 w-7"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-7 w-7"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                          />
                        </svg>
                      )
                    }
                  />
                ))}
                <StudyPlanCard
                  title={customPlanTemplate.title}
                  description={customPlanTemplate.description}
                  onClick={() => handlePlanSelect(customPlanTemplate)}
                  isCustom
                />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">
                Mevcut Hedeflerim
              </h2>
              <UserGoalsList
                goals={userGoals}
                setGoals={setUserGoals} 
                onViewGoal={handleGoalClick}
                onDeleteGoal={handleDeleteGoal}
              />

            </div>
          </>
        );
    }
  };

  return (
    <>
      <Helmet>
        <title>Hedefler | FocusFlow</title>
        <meta
          name="description"
          content="FocusFlow ile çalışma hedeflerinizi belirleyin, takip edin ve başarıya ulaşın."
        />
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 pt-20">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          {viewMode.type === 'list' && (
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-10 shadow-xl border border-gray-100 dark:border-gray-700 mb-8">
            <div className="flex items-center space-x-6">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center shadow-2xl">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-white"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                  <circle cx="12" cy="12" r="10"></circle>
                  <circle cx="12" cy="12" r="6"></circle>
                  <circle cx="12" cy="12" r="2"></circle>
                </svg>
              </div>
              <div>
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2 tracking-tight">
                  Hedeflerim
                </h1>
                <p className="text-xl text-gray-500 dark:text-gray-400">
                  Eğitim hedeflerinizi belirleyin ve takip edin
                </p>
              </div>
            </div>
          </div>
          )}

          {renderContent()}
        </div>
      </div>

      <AddGoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
      />
    </>
    
  );
};

export default GoalsPage; 