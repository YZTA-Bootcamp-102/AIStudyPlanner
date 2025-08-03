import React, { useState } from 'react';
import type { Question } from '../../data/exampleStudyPlans';

interface StudyPlanQuestionsProps {
  questions: Question[];
  onSubmit: (answers: Record<string, string>) => void;
  onBack: () => void;
}

const StudyPlanQuestions: React.FC<StudyPlanQuestionsProps> = ({
  questions,
  onSubmit,
  onBack,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [otherInputs, setOtherInputs] = useState<Record<string, string>>({});

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  /**
   * Kullanıcı cevabı değiştiğinde state'i günceller
   */
  const handleInputChange = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  /**
   * Eğer "Diğer" seçeneği seçildiyse, ayrı input değerini günceller
   */
  const handleOtherInputChange = (value: string) => {
    setOtherInputs((prev) => ({
      ...prev,
      [currentQuestion.id]: value,
    }));
  };

  /**
   * Sonraki soruya geçiş veya son soruda submit
   */
  const handleNext = () => {
    if (isLastQuestion) {
      onSubmit(resolveOtherAnswers());
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  /**
   * Önceki soruya geçiş veya başta ise geri dön
   */
  const handlePrevious = () => {
    if (currentIndex === 0) {
      onBack();
    } else {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  /**
   * "Diğer" seçeneği seçilmişse, asıl cevaba entegre eder
   */
  const resolveOtherAnswers = (): Record<string, string> => {
    const finalAnswers = { ...answers };
    Object.keys(finalAnswers).forEach((key) => {
      if (finalAnswers[key] === 'other' && otherInputs[key]) {
        finalAnswers[key] = otherInputs[key];
      }
    });
    return finalAnswers;
  };

  /**
   * "Sonraki" butonu aktif mi?
   */
  const canProceed = (): boolean => {
    const currentAnswer = answers[currentQuestion.id];
    if (!currentAnswer) return false;
    if (currentAnswer === 'other') {
      return !!otherInputs[currentQuestion.id]?.trim();
    }
    return !!currentAnswer.trim();
  };

  /**
   * Çoktan seçmeli soruları render eder
   */
  const renderMultipleChoice = () => (
    <div className="space-y-3">
      {[...(currentQuestion.options ?? []), ...(currentQuestion.allowOther ? ['other'] : [])].map(
        (option) => {
          const isSelected = answers[currentQuestion.id] === option;
          return (
            <label
              key={option}
              className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                isSelected
                  ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-500'
                  : 'bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600'
              }`}
            >
              <input
                type="radio"
                name={currentQuestion.id}
                value={option}
                checked={isSelected}
                onChange={(e) => handleInputChange(e.target.value)}
                className="w-4 h-4 text-orange-500 focus:ring-orange-500"
              />
              <span className="ml-3 text-gray-700 dark:text-gray-300">
                {option === 'other' ? 'Diğer' : option}
              </span>
            </label>
          );
        }
      )}

      {currentQuestion.allowOther && answers[currentQuestion.id] === 'other' && (
        <input
          type="text"
          value={otherInputs[currentQuestion.id] || ''}
          onChange={(e) => handleOtherInputChange(e.target.value)}
          placeholder="Diğer seçeneğinizi yazın..."
          className="mt-3 w-full p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 
                     focus:border-orange-500 focus:ring-orange-500 
                     dark:bg-gray-700 dark:text-white transition-all duration-200"
        />
      )}
    </div>
  );

  /**
   * Text, Number ve Time sorularını render eder
   */
  const renderInput = () => {
    const commonProps = {
      value: answers[currentQuestion.id] || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(e.target.value),
      placeholder: currentQuestion.placeholder,
      className:
        'w-full p-4 rounded-lg border-2 border-gray-200 dark:border-gray-600 ' +
        'focus:border-orange-500 focus:ring-orange-500 dark:bg-gray-700 dark:text-white transition-all duration-200',
    };

    if (currentQuestion.type === 'number') return <input type="number" {...commonProps} />;
    return <input type="text" {...commonProps} />;
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Soru {currentIndex + 1} / {questions.length}
          </span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {Math.round(((currentIndex + 1) / questions.length) * 100)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-orange-500 dark:bg-orange-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-100 dark:border-gray-700">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          {currentQuestion.text}
        </h3>

        {currentQuestion.type === 'multiple' ? renderMultipleChoice() : renderInput()}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePrevious}
            className="flex items-center px-6 py-3 text-gray-600 dark:text-gray-400 
                       hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            {currentIndex === 0 ? 'Geri Dön' : 'Önceki Soru'}
          </button>

          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
              canProceed()
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-700 dark:text-gray-400'
            }`}
          >
            {isLastQuestion ? 'Tamamla' : 'Sonraki Soru'}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanQuestions;
