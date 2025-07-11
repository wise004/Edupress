import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Play, 
  FileText, 
  HelpCircle, 
  Award, 
  Clock, 
  CheckCircle, 
  Lock,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer';
import QuizTaking from '../components/QuizTaking';
import AssignmentView from '../components/AssignmentView';
import { CertificateDisplay } from '../components/CertificateDisplay';
import { CourseAPI } from '../services/api';
import type { Lesson, Course } from '../types/api';

interface LessonPageProps {
  // Can be used as standalone page or embedded component
  courseId?: number;
  lessonId?: number;
  embedded?: boolean;
}

export default function LessonPage({ courseId: propCourseId, lessonId: propLessonId, embedded = false }: LessonPageProps) {
  const { courseId: paramCourseId, lessonId: paramLessonId } = useParams();
  const navigate = useNavigate();
  
  // Use props or URL params
  const courseId = propCourseId || parseInt(paramCourseId || '0');
  const lessonId = propLessonId || parseInt(paramLessonId || '0');
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'videos' | 'quiz' | 'assignment' | 'certificate'>('videos');
  const [completedItems, setCompletedItems] = useState<{
    videos: number[];
    quiz: boolean;
    assignment: boolean;
  }>({
    videos: [],
    quiz: false,
    assignment: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load lesson data from API
  useEffect(() => {
    loadLessonData();
  }, [courseId, lessonId]);

  const loadLessonData = async () => {
    try {
      setLoading(true);
      
      // Load course data
      const courseResponse = await CourseAPI.getCourseById(String(courseId));
      const courseData = courseResponse.data;
      
      // Load lessons for the course
      const lessonsResponse = await CourseAPI.getCourseLessons(courseId);
      const lessonsData = lessonsResponse.data;
      
      // Find current lesson
      const currentLesson = lessonsData.find((l: any) => l.id === lessonId) || lessonsData[0];
      const currentIndex = lessonsData.findIndex((l: any) => l.id === currentLesson.id);
      
      setCourse(courseData);
      setLessons(lessonsData);
      setLesson(currentLesson);
      setCurrentLessonIndex(currentIndex);
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load lesson data');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoComplete = (videoId: number, _watchTime: number) => {
    setCompletedItems(prev => ({
      ...prev,
      videos: [...prev.videos, videoId]
    }));
  };

  const handleQuizComplete = () => {
    setCompletedItems(prev => ({
      ...prev,
      quiz: true
    }));
  };

  const handleAssignmentComplete = () => {
    setCompletedItems(prev => ({
      ...prev,
      assignment: true
    }));
  };

  const navigateToLesson = (newLessonId: number) => {
    if (embedded) {
      // If embedded, update internal state
      const newLesson = lessons.find(l => l.id === newLessonId);
      if (newLesson) {
        setLesson(newLesson);
        setCurrentLessonIndex(lessons.findIndex(l => l.id === newLessonId));
        setActiveTab('videos');
        setCompletedItems({ videos: [], quiz: false, assignment: false });
      }
    } else {
      // If standalone page, navigate
      navigate(`/course/${courseId}/lesson/${newLessonId}`);
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case 'videos':
        return <Play className="w-4 h-4" />;
      case 'quiz':
        return <HelpCircle className="w-4 h-4" />;
      case 'assignment':
        return <FileText className="w-4 h-4" />;
      case 'certificate':
        return <Award className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const isTabCompleted = (tab: string) => {
    switch (tab) {
      case 'videos':
        return completedItems.videos.length > 0;
      case 'quiz':
        return completedItems.quiz;
      case 'assignment':
        return completedItems.assignment;
      default:
        return false;
    }
  };

  const isLessonComplete = () => {
    return completedItems.videos.length > 0 && 
           completedItems.quiz && 
           completedItems.assignment;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Loading lesson...</span>
      </div>
    );
  }

  if (error || !lesson || !course) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <p className="text-red-800">{error || 'Lesson not found'}</p>
        {!embedded && (
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Course
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`${embedded ? '' : 'min-h-screen bg-gray-50'}`}>
      {!embedded && (
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => navigate(`/course/${courseId}`)}
                  className="flex items-center text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Back to Course
                </button>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">{course.title}</h1>
                  <p className="text-gray-600">{lesson.title}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {isLessonComplete() && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    <span className="font-medium">Lesson Complete</span>
                  </div>
                )}
                <span className="text-sm text-gray-500">
                  Lesson {currentLessonIndex + 1} of {lessons.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Lesson Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border shadow-sm p-6 sticky top-6">
              <h3 className="font-semibold text-gray-900 mb-4">Course Lessons</h3>
              <div className="space-y-2">
                {lessons.map((lessonItem, index) => (
                  <button
                    key={lessonItem.id}
                    onClick={() => navigateToLesson(lessonItem.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      lessonItem.id === lesson.id
                        ? 'bg-blue-50 border border-blue-200 text-blue-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="text-sm font-medium mr-2">{index + 1}.</span>
                        <div className="min-w-0 flex-1">
                          <h4 className="font-medium truncate">{lessonItem.title}</h4>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{Math.ceil(lessonItem.duration / 60)} min</span>
                          </div>
                        </div>
                      </div>
                      {lessonItem.id === lesson.id ? (
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                      ) : (
                        <div className="w-3 h-3 border border-gray-300 rounded-full"></div>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation Controls */}
              <div className="mt-6 pt-6 border-t space-y-3">
                {currentLessonIndex > 0 && (
                  <button
                    onClick={() => navigateToLesson(lessons[currentLessonIndex - 1].id)}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous Lesson
                  </button>
                )}
                
                {currentLessonIndex < lessons.length - 1 && (
                  <button
                    onClick={() => navigateToLesson(lessons[currentLessonIndex + 1].id)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Next Lesson
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Lesson Header */}
            <div className="bg-white rounded-lg border shadow-sm p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{lesson.title}</h2>
              <p className="text-gray-600 mb-4">{lesson.description}</p>
              
              {/* Content Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8">
                  {['videos', 'quiz', 'assignment', 'certificate'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center space-x-2 ${
                        activeTab === tab
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {getTabIcon(tab)}
                      <span className="capitalize">{tab}</span>
                      {isTabCompleted(tab) && (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === 'videos' && (
                <VideoPlayer
                  lessonId={lesson.id}
                  onVideoComplete={handleVideoComplete}
                />
              )}

              {activeTab === 'quiz' && (
                <QuizTaking
                  lessonId={lesson.id}
                  onComplete={handleQuizComplete}
                />
              )}

              {activeTab === 'assignment' && (
                <AssignmentView
                  lessonId={lesson.id}
                  onComplete={handleAssignmentComplete}
                />
              )}

              {activeTab === 'certificate' && (
                <div className="bg-white rounded-lg border shadow-sm p-6">
                  {isLessonComplete() ? (
                    <CertificateDisplay certificateId={1} />
                  ) : (
                    <div className="text-center py-12">
                      <Lock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Certificate Locked</h3>
                      <p className="text-gray-600 mb-6">
                        Complete all lesson activities to unlock your certificate.
                      </p>
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className={`flex items-center justify-center ${completedItems.videos.length > 0 ? 'text-green-600' : ''}`}>
                          <CheckCircle className={`w-4 h-4 mr-2 ${completedItems.videos.length > 0 ? 'text-green-500' : 'text-gray-300'}`} />
                          Watch Videos
                        </div>
                        <div className={`flex items-center justify-center ${completedItems.quiz ? 'text-green-600' : ''}`}>
                          <CheckCircle className={`w-4 h-4 mr-2 ${completedItems.quiz ? 'text-green-500' : 'text-gray-300'}`} />
                          Complete Quiz
                        </div>
                        <div className={`flex items-center justify-center ${completedItems.assignment ? 'text-green-600' : ''}`}>
                          <CheckCircle className={`w-4 h-4 mr-2 ${completedItems.assignment ? 'text-green-500' : 'text-gray-300'}`} />
                          Submit Assignment
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
