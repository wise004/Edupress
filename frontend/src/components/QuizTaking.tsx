import { useState, useEffect, useCallback } from 'react';
import { Clock, XCircle, AlertCircle, Trophy, RotateCcw } from 'lucide-react';
import { QuizAPI } from '../services/api';
import type { Quiz, QuizAttempt } from '../types/api';

interface QuizTakingProps {
  lessonId: number;
  onComplete?: (attempt: QuizAttempt) => void;
  onCancel?: () => void;
}

interface QuestionAnswer {
  questionId: number;
  selectedOptions: number[];
  timeSpent: number;
}

export default function QuizTaking({ lessonId, onComplete, onCancel }: QuizTakingProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<QuizAttempt | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, QuestionAnswer>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<QuizAttempt | null>(null);

  // Load quiz
  useEffect(() => {
    loadQuiz();
  }, [lessonId]);

  // Timer effect
  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && !showResults) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev && prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev ? prev - 1 : 0;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft, showResults]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      const quizData = await QuizAPI.getQuizByLessonId(lessonId);
      setQuiz(quizData);
      
      // Check if user can take the quiz
      const userAttempts = await QuizAPI.getUserQuizAttempts(quizData.id);
      if (quizData.maxAttempts && userAttempts.length >= quizData.maxAttempts) {
        setError('You have reached the maximum number of attempts for this quiz.');
        return;
      }

      // Start new attempt
      const attempt = await QuizAPI.startQuizAttempt(quizData.id);
      setCurrentAttempt(attempt);

      // Set timer if quiz has time limit
      if (quizData.timeLimit) {
        setTimeLeft(quizData.timeLimit * 60); // Convert minutes to seconds
      }

      // Initialize answers
      const initialAnswers: Record<number, QuestionAnswer> = {};
      quizData.questions.forEach((question: any) => {
        initialAnswers[question.id] = {
          questionId: question.id,
          selectedOptions: [],
          timeSpent: 0
        };
      });
      setAnswers(initialAnswers);

    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load quiz');
    } finally {
      setLoading(false);
    }
  };

  const handleTimeUp = useCallback(async () => {
    if (currentAttempt && !submitting) {
      await submitQuiz();
    }
  }, [currentAttempt, submitting]);

  const handleAnswerChange = (questionId: number, optionId: number, checked: boolean) => {
    setAnswers(prev => {
      const currentAnswer = prev[questionId];
      const question = quiz?.questions.find(q => q.id === questionId);
      
      if (!question) return prev;

      let newSelectedOptions: number[];
      
      if (question.type === 'SINGLE_CHOICE') {
        newSelectedOptions = checked ? [optionId] : [];
      } else {
        newSelectedOptions = checked 
          ? [...currentAnswer.selectedOptions, optionId]
          : currentAnswer.selectedOptions.filter(id => id !== optionId);
      }

      return {
        ...prev,
        [questionId]: {
          ...currentAnswer,
          selectedOptions: newSelectedOptions
        }
      };
    });
  };

  const submitQuiz = async () => {
    if (!currentAttempt || submitting) return;

    try {
      setSubmitting(true);
      
      // Format answers for submission
      const formattedAnswers: Record<number, any> = {};
      Object.values(answers).forEach(answer => {
        formattedAnswers[answer.questionId] = answer.selectedOptions;
      });

      const result = await QuizAPI.submitQuizAttempt(currentAttempt.id, formattedAnswers);
      setResults(result);
      setShowResults(true);
      
      if (onComplete) {
        onComplete(result);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getScorePercentage = () => {
    if (!results || !quiz) return 0;
    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    return totalPoints > 0 ? Math.round((results.score / totalPoints) * 100) : 0;
  };

  const isPassed = () => {
    if (!quiz || !results) return false;
    const percentage = getScorePercentage();
    return percentage >= (quiz.passingScore || 70);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading quiz...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <XCircle className="h-6 w-6 text-red-600 mr-2" />
          <span className="text-red-800">{error}</span>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Go Back
          </button>
        )}
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No quiz found for this lesson.</p>
        {onCancel && (
          <button
            onClick={onCancel}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Go Back
          </button>
        )}
      </div>
    );
  }

  if (showResults && results) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="text-center mb-6">
            {isPassed() ? (
              <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            )}
            <h2 className="text-2xl font-bold mb-2">
              {isPassed() ? 'Congratulations!' : 'Quiz Completed'}
            </h2>
            <p className="text-gray-600">
              {isPassed() ? 'You passed the quiz!' : 'Better luck next time!'}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">{getScorePercentage()}%</div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-gray-800">
                {results.score}/{quiz.questions.reduce((sum, q) => sum + q.points, 0)}
              </div>
              <div className="text-sm text-gray-600">Points</div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>Time Spent:</span>
              <span>{formatTime(results.timeSpent)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Passing Score:</span>
              <span>{quiz.passingScore || 70}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Status:</span>
              <span className={isPassed() ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                {isPassed() ? 'Passed' : 'Failed'}
              </span>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            {onCancel && (
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                Continue Learning
              </button>
            )}
            {quiz.maxAttempts && quiz.maxAttempts > 1 && (
              <button
                onClick={() => {
                  setShowResults(false);
                  setCurrentQuestionIndex(0);
                  loadQuiz();
                }}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Quiz
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-lg border shadow-sm">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            {timeLeft !== null && (
              <div className="flex items-center text-orange-600">
                <Clock className="h-5 w-5 mr-2" />
                <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>
          
          {/* Progress */}
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question */}
        <div className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">{currentQuestion.questionText}</h2>
            <div className="text-sm text-gray-600">
              {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
              {currentQuestion.type === 'MULTIPLE_CHOICE' && (
                <span className="ml-2 text-blue-600">(Select all that apply)</span>
              )}
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = answers[currentQuestion.id]?.selectedOptions.includes(option.id);
              return (
                <label 
                  key={option.id}
                  className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center">
                    <input
                      type={currentQuestion.type === 'SINGLE_CHOICE' ? 'radio' : 'checkbox'}
                      name={`question-${currentQuestion.id}`}
                      checked={isSelected}
                      onChange={(e) => handleAnswerChange(currentQuestion.id, option.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 mr-3"
                    />
                    <span className="text-gray-900">{option.optionText}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="p-6 border-t bg-gray-50 flex justify-between">
          <button
            onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <div className="flex gap-3">
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Exit Quiz
              </button>
            )}
            
            {currentQuestionIndex < quiz.questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => submitQuiz()}
                disabled={submitting}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
