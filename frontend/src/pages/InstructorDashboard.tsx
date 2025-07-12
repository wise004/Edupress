import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Plus, 
  Play, 
  FileText, 
  HelpCircle, 
  Award,
  Users,
  BarChart3,
  BookOpen,
  TrendingUp,
  DollarSign,
  Eye,
  Clock
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import CourseModal from '../components/CourseModal';
import LessonModal from '../components/LessonModal';
import { useAuth } from '../contexts/AuthContext';
import { 
  getMockCoursesByInstructor,
  getInstructorStats,
  type MockCourse
} from '../services/mockData';

interface InstructorStats {
  totalCourses: number;
  publishedCourses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
  totalQuizzes: number;
  totalAssignments: number;
  totalVideos: number;
  topCourses: string[];
  recentEnrollments: string[];
}

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  // State
  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get('tab') || 'overview';
  });
  const [courses, setCourses] = useState<MockCourse[]>([]);
  const [stats, setStats] = useState<InstructorStats>({
    totalCourses: 0,
    publishedCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalQuizzes: 0,
    totalAssignments: 0,
    totalVideos: 0,
    topCourses: [],
    recentEnrollments: []
  });
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<MockCourse | null>(null);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  // Effects
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [instructorCourses, instructorStats] = await Promise.all([
          getMockCoursesByInstructor(user?.id || 1),
          getInstructorStats(user?.id || 1)
        ]);
        setCourses(instructorCourses);
        setStats({
          ...instructorStats,
          totalQuizzes: 0,
          totalAssignments: 0,
          totalVideos: 0,
          topCourses: ['JavaScript Basics', 'React Advanced', 'Node.js Backend'],
          recentEnrollments: ['John Doe enrolled in React Course', 'Jane Smith enrolled in JavaScript Basics']
        });
      } catch (error) {
        console.error('Error fetching instructor data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.id]);

  useEffect(() => {
    setSearchParams({ tab: activeTab }, { replace: true });
  }, [activeTab, setSearchParams]);

  // Handlers
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleCreateCourse = () => {
    setSelectedCourse(null);
    setShowCourseModal(true);
  };

  const handleEditCourse = (course: MockCourse) => {
    setSelectedCourse(course);
    setShowCourseModal(true);
  };

  const handleCloseCourseModal = () => {
    setShowCourseModal(false);
    setSelectedCourse(null);
  };

  const handleSaveCourse = async (courseData: MockCourse) => {
    try {
      // TODO: Implement API call
      console.log('Saving course:', courseData);
      handleCloseCourseModal();
      // Refresh courses
      const updatedCourses = await getMockCoursesByInstructor(user?.id || 1);
      setCourses(updatedCourses);
    } catch (error) {
      console.error('Error saving course:', error);
    }
  };

  const handleCloseLessonModal = () => {
    setShowLessonModal(false);
    setSelectedLesson(null);
  };

  const handleSaveLesson = async (lessonData: any) => {
    try {
      // TODO: Implement API call
      console.log('Saving lesson:', lessonData);
      handleCloseLessonModal();
    } catch (error) {
      console.error('Error saving lesson:', error);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                Instructor Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm sm:text-base">
                Welcome back, {user?.firstName}! Manage your courses and track your performance.
              </p>
            </div>
            <button
              onClick={handleCreateCourse}
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span>Create Course</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex overflow-x-auto px-4 sm:px-6 scrollbar-hide">
              <div className="flex space-x-4 sm:space-x-8 min-w-max">                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`py-3 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <tab.icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                      <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                    </div>
                  </button>
                ))}
              </div>
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 sm:p-6 rounded-xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-600 dark:text-blue-400 text-sm font-medium">Total Courses</p>
                        <p className="text-2xl font-bold text-blue-900 dark:text-blue-300">{stats.totalCourses}</p>
                      </div>
                      <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-600 dark:text-green-400 text-sm font-medium">Total Students</p>
                        <p className="text-2xl font-bold text-green-900 dark:text-green-300">{stats.totalStudents}</p>
                      </div>
                      <Users className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>

                  <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-600 dark:text-purple-400 text-sm font-medium">Total Revenue</p>
                        <p className="text-2xl font-bold text-purple-900 dark:text-purple-300">${stats.totalRevenue}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>

                  <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-600 dark:text-orange-400 text-sm font-medium">Average Rating</p>
                        <p className="text-2xl font-bold text-orange-900 dark:text-orange-300">{stats.averageRating}/5</p>
                      </div>
                      <Award className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Enrollments</h3>
                    <div className="space-y-3">
                      {stats.recentEnrollments.map((enrollment, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-gray-700 dark:text-gray-300">{enrollment}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing Courses</h3>
                    <div className="space-y-3">
                      {stats.topCourses.map((course, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-gray-700 dark:text-gray-300">{course}</span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">#{index + 1}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Courses Tab */}
            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Courses</h3>
                  <button
                    onClick={handleCreateCourse}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Course</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <div key={course.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{course.title}</h4>
                          <p className="text-gray-600 dark:text-gray-300 text-sm line-clamp-2">{course.description}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          course.isPublished 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                        }`}>
                          {course.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>0</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Play className="w-4 h-4" />
                            <span>{course.duration || '0h'}</span>
                          </div>
                        </div>
                        <span className="font-medium text-gray-900 dark:text-white">${course.price}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => handleEditCourse(course)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
                        >
                          Edit Course
                        </button>
                        <div className="flex items-center space-x-2">
                          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <BarChart3 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Other tabs placeholder */}
            {activeTab !== 'overview' && activeTab !== 'courses' && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Coming Soon</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  This section is under development and will be available soon.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Modal */}
      {showCourseModal && (
        <CourseModal
          isOpen={showCourseModal}
          onClose={handleCloseCourseModal}
          onSave={handleSaveCourse as any}
          course={selectedCourse as any}
        />
      )}

      {/* Lesson Modal */}
      {showLessonModal && (
        <LessonModal
          isOpen={showLessonModal}
          onClose={handleCloseLessonModal}
          onSave={handleSaveLesson}
          lesson={selectedLesson}
          courseId={selectedCourse?.id || 0}
        />
      )}
    </DashboardLayout>
  );
};

export default InstructorDashboard;
