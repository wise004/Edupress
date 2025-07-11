import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { QuizAPI } from '../services/api';
import type { Quiz } from '../types/api';

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (quiz: Quiz) => void;
  quiz?: Quiz | null;
  lessonId: number;
}

interface QuestionForm {
  questionText: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
  points: number;
  explanation: string;
  options: Array<{
    optionText: string;
    isCorrect: boolean;
  }>;
}

export default function QuizModal({ isOpen, onClose, onSave, quiz, lessonId }: QuizModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timeLimit: 30,
    maxAttempts: 3,
    passingScore: 70
  });
  
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (quiz) {
      setFormData({
        title: quiz.title,
        description: quiz.description || '',
        timeLimit: quiz.timeLimit,
        maxAttempts: quiz.maxAttempts,
        passingScore: quiz.passingScore
      });
      
      // Convert quiz questions to form format
      const formQuestions: QuestionForm[] = quiz.questions.map(q => ({
        questionText: q.questionText,
        type: q.type,
        points: q.points,
        explanation: q.explanation || '',
        options: q.options.map(opt => ({
          optionText: opt.optionText,
          isCorrect: opt.isCorrect
        }))
      }));
      setQuestions(formQuestions);
    } else {
      setFormData({
        title: '',
        description: '',
        timeLimit: 30,
        maxAttempts: 3,
        passingScore: 70
      });
      setQuestions([]);
    }
  }, [quiz]);

  const addQuestion = () => {
    setQuestions([...questions, {
      questionText: '',
      type: 'SINGLE_CHOICE',
      points: 1,
      explanation: '',
      options: [
        { optionText: '', isCorrect: false },
        { optionText: '', isCorrect: false }
      ]
    }]);
  };

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, field: keyof QuestionForm, value: any) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], [field]: value };
    setQuestions(updatedQuestions);
  };

  const addOption = (questionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push({ optionText: '', isCorrect: false });
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionIndex: number, optionIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options = updatedQuestions[questionIndex].options.filter((_, i) => i !== optionIndex);
    setQuestions(updatedQuestions);
  };

  const updateOption = (questionIndex: number, optionIndex: number, field: 'optionText' | 'isCorrect', value: string | boolean) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = {
      ...updatedQuestions[questionIndex].options[optionIndex],
      [field]: value
    };
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (questions.length === 0) {
      setError('Please add at least one question');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const quizData = {
        ...formData,
        lessonId,
        questions: questions.map((q, index) => ({
          ...q,
          orderIndex: index,
          options: q.options.map((opt, optIndex) => ({
            ...opt,
            orderIndex: optIndex
          }))
        }))
      };

      let savedQuiz;
      if (quiz) {
        savedQuiz = await QuizAPI.updateQuiz(quiz.id, quizData);
      } else {
        savedQuiz = await QuizAPI.createQuiz(quizData);
      }

      onSave(savedQuiz);
      onClose();
    } catch (err: any) {
      console.error('Error saving quiz:', err);
      setError(err.response?.data?.message || 'Failed to save quiz');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">
            {quiz ? 'Edit Quiz' : 'Create Quiz'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Basic Quiz Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quiz Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time Limit (minutes)
              </label>
              <input
                type="number"
                value={formData.timeLimit}
                onChange={(e) => setFormData({ ...formData, timeLimit: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Attempts
              </label>
              <input
                type="number"
                value={formData.maxAttempts}
                onChange={(e) => setFormData({ ...formData, maxAttempts: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="1"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Passing Score (%)
              </label>
              <input
                type="number"
                value={formData.passingScore}
                onChange={(e) => setFormData({ ...formData, passingScore: parseInt(e.target.value) })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
                max="100"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>

          {/* Questions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Questions</h3>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </button>
            </div>

            {questions.map((question, questionIndex) => (
              <div key={questionIndex} className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900">Question {questionIndex + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeQuestion(questionIndex)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      placeholder="Question text"
                      value={question.questionText}
                      onChange={(e) => updateQuestion(questionIndex, 'questionText', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <select
                        value={question.type}
                        onChange={(e) => updateQuestion(questionIndex, 'type', e.target.value)}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="SINGLE_CHOICE">Single Choice</option>
                        <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                      </select>
                    </div>

                    <div>
                      <input
                        type="number"
                        placeholder="Points"
                        value={question.points}
                        onChange={(e) => updateQuestion(questionIndex, 'points', parseInt(e.target.value))}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        min="1"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <textarea
                      placeholder="Explanation (optional)"
                      value={question.explanation}
                      onChange={(e) => updateQuestion(questionIndex, 'explanation', e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={2}
                    />
                  </div>

                  {/* Options */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-700">Options</label>
                      <button
                        type="button"
                        onClick={() => addOption(questionIndex)}
                        className="text-sm text-blue-600 hover:text-blue-700"
                      >
                        Add Option
                      </button>
                    </div>

                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2 mb-2">
                        <input
                          type={question.type === 'SINGLE_CHOICE' ? 'radio' : 'checkbox'}
                          name={`question-${questionIndex}`}
                          checked={option.isCorrect}
                          onChange={(e) => {
                            if (question.type === 'SINGLE_CHOICE') {
                              // For single choice, uncheck all other options first
                              const updatedQuestions = [...questions];
                              updatedQuestions[questionIndex].options.forEach((opt, idx) => {
                                opt.isCorrect = idx === optionIndex;
                              });
                              setQuestions(updatedQuestions);
                            } else {
                              updateOption(questionIndex, optionIndex, 'isCorrect', e.target.checked);
                            }
                          }}
                          className="w-4 h-4 text-blue-600"
                        />
                        <input
                          type="text"
                          placeholder="Option text"
                          value={option.optionText}
                          onChange={(e) => updateOption(questionIndex, optionIndex, 'optionText', e.target.value)}
                          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required
                        />
                        {question.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(questionIndex, optionIndex)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Saving...' : (quiz ? 'Update Quiz' : 'Create Quiz')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
