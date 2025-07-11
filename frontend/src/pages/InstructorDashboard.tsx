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
  CheckCircle
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
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

// TODO: Add interface definitions when implementing full functionality
// interface Student { ... }
// interface Assignment { ... } 
// interface Quiz { ... }
// interface Video { ... }

const InstructorDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'students' | 'assignments' | 'quizzes' | 'videos' | 'analytics' | 'content'>('overview');
  const [courses, setCourses] = useState<MockCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<MockCourse | null>(null);
  // TODO: Add these back when implementing full functionality
  // const [students, setStudents] = useState<Student[]>([]);
  // const [assignments, setAssignments] = useState<Assignment[]>([]);
  // const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  // const [videos, setVideos] = useState<Video[]>([]);
  const [stats, setStats] = useState<InstructorStats>({
    totalCourses: 0,
    publishedCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalQuizzes: 15,
    totalAssignments: 28,
    totalVideos: 142,
    topCourses: [],
    recentEnrollments: []
  });
  const [loading, setLoading] = useState(true);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);

  useEffect(() => {
    // Handle URL parameters for tab navigation and quick actions
    const tab = searchParams.get('tab');
    const action = searchParams.get('action');

    if (tab && ['overview', 'courses', 'students', 'assignments', 'quizzes', 'videos', 'analytics', 'content'].includes(tab)) {
      setActiveTab(tab as any);
    }

    // Handle quick actions
    if (action === 'create-course') {
      handleCreateCourse();
      // Remove action parameter after handling
      const newParams = new URLSearchParams(searchParams);
      newParams.delete('action');
      setSearchParams(newParams);
    }
  }, [searchParams]);

  useEffect(() => {
    loadInstructorData();
  }, [user]);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as any);
    setSearchParams({ tab });
  };

  const loadInstructorData = async () => {
    setLoading(true);
    
    try {
      if (user) {
        // Load instructor courses and statistics from mock data
        const instructorCourses = getMockCoursesByInstructor(user.id);
        const instructorStats = getInstructorStats(user.id);

        setCourses(instructorCourses);
        setStats({
          totalCourses: instructorStats.totalCourses,
          publishedCourses: instructorStats.publishedCourses,
          totalStudents: instructorStats.totalStudents,
          totalRevenue: instructorStats.totalRevenue,
          averageRating: instructorStats.averageRating,
          totalQuizzes: 15,
          totalAssignments: 28,
          totalVideos: 142,
          topCourses: instructorCourses.slice(0, 3).map(c => c.title),
          recentEnrollments: ["New student enrolled in React course", "5 new enrollments today"]
        });
      }
    } catch (error) {
      console.error('Failed to load instructor data:', error);
      setCourses([]);
      setStats({
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
    } finally {
      setLoading(false);
    }
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

  const handleSaveCourse = async (_course: MockCourse) => {
    // Refresh the courses list after saving
    await loadInstructorData();
  };

  const handleCreateLesson = (courseId: number) => {
    setSelectedCourse(courses.find(c => c.id === courseId) || null);
    setSelectedLesson(null);
    setShowLessonModal(true);
  };

  const handleCloseLessonModal = () => {
    setShowLessonModal(false);
    setSelectedLesson(null);
  };

  const handleSaveLesson = async (_lesson: any) => {
    // Refresh lessons for the course
    // TODO: Implement lesson loading when LessonAPI is available
    setShowLessonModal(false);
    setSelectedLesson(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'archived':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'assignments', label: 'Assignments', icon: FileText },
    { id: 'quizzes', label: 'Quizzes', icon: HelpCircle },
    { id: 'videos', label: 'Videos', icon: Play },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'content', label: 'Content', icon: FileText }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">Loading instructor dashboard...</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Instructor Dashboard</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">Manage your courses and track student progress</p>
          </div>
          <button 
            onClick={handleCreateCourse}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Course</span>
          </button>
        </div>

        {/* Demo Mode Warning */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-200">
                <strong>Demo Mode:</strong> You're viewing mock data. Please log in as an instructor to see real statistics and manage courses.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Courses</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalCourses}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Published</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.publishedCourses}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalStudents}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">${stats.totalRevenue.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Quizzes</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalQuizzes}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-lg flex items-center justify-center">
                <HelpCircle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.averageRating.toFixed(1)}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Recent Activity */}
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <Play className="w-5 h-5 text-blue-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">New student enrolled in React Fundamentals</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <HelpCircle className="w-5 h-5 text-green-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">New question posted in Advanced JavaScript</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">4 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <Award className="w-5 h-5 text-orange-500" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Course received 5-star review</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">1 day ago</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <button className="w-full text-left p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Plus className="w-5 h-5 text-blue-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Create New Course</span>
                        </div>
                      </button>
                      <button className="w-full text-left p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Play className="w-5 h-5 text-green-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Upload Video</span>
                        </div>
                      </button>
                      <button className="w-full text-left p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-5 h-5 text-purple-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Create Assignment</span>
                        </div>
                      </button>
                      <button className="w-full text-left p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                        <div className="flex items-center space-x-3">
                          <HelpCircle className="w-5 h-5 text-orange-500" />
                          <span className="text-sm font-medium text-gray-900 dark:text-white">Create Quiz</span>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Courses</h3>
                  <button 
                    onClick={handleCreateCourse}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Course</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {courses.map((course) => (
                    <div key={course.id} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 border border-gray-200 dark:border-gray-600">
                      <div className="flex items-start justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{course.title}</h4>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.isPublished ? 'Published' : 'Draft')}`}>
                          {course.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{course.shortDescription}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Students:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{course.enrollmentCount}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Lessons:</span>
                          <span className="font-medium text-gray-900 dark:text-white">{course.totalLessons} lessons</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => handleEditCourse(course)}
                          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium"
                        >
                          Edit Course
                        </button>
                        <button 
                          onClick={() => handleCreateLesson(course.id)}
                          className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium"
                          title="Add Lesson"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                        <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Students</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total: {stats.totalStudents} students
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Student
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Enrolled Courses
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Progress
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Last Activity
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {/* Sample student data */}
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-medium">AJ</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">Alice Johnson</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">alice@example.com</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">3</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                              </div>
                              <span className="text-sm text-gray-900 dark:text-white">75%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">2 hours ago</td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                                <span className="text-green-600 font-medium">BS</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">Bob Smith</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">bob@example.com</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">2</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                              </div>
                              <span className="text-sm text-gray-900 dark:text-white">45%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">1 day ago</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'assignments' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Assignment Management</h3>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Create Assignment</span>
                  </button>
                </div>
                
                {/* Assignment Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Assignments</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">28</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                        <Clock className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Reviews</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">47</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Graded Today</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Grade</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">87%</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Assignments List */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Assignment 1 */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">React Component Exercise</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Course: React Fundamentals</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button className="text-gray-400 hover:text-gray-600">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="text-blue-600 hover:text-blue-700">
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Due:</span>
                        <span className="font-medium text-gray-900 dark:text-white">Feb 15, 2025</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Submissions:</span>
                        <span className="font-medium text-gray-900 dark:text-white">24/30</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Graded:</span>
                        <span className="font-medium text-gray-900 dark:text-white">18/24</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Avg Grade:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">92%</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm">
                        Review Submissions
                      </button>
                      <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        Edit
                      </button>
                    </div>
                  </div>

                  {/* Assignment 2 */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">API Integration Project</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Course: Advanced Node.js</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400">
                          Overdue
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Due:</span>
                        <span className="font-medium text-red-600 dark:text-red-400">Jan 20, 2025</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Submissions:</span>
                        <span className="font-medium text-gray-900 dark:text-white">15/20</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Graded:</span>
                        <span className="font-medium text-gray-900 dark:text-white">12/15</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Avg Grade:</span>
                        <span className="font-medium text-yellow-600 dark:text-yellow-400">78%</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg text-sm">
                        Grade Pending
                      </button>
                      <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        Extend
                      </button>
                    </div>
                  </div>

                  {/* Assignment 3 */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Marketing Strategy Analysis</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Course: Digital Marketing</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          Completed
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Due:</span>
                        <span className="font-medium text-gray-900 dark:text-white">Jan 10, 2025</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Submissions:</span>
                        <span className="font-medium text-gray-900 dark:text-white">35/35</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Graded:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">35/35</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Avg Grade:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">94%</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-2 rounded-lg text-sm cursor-not-allowed">
                        All Graded
                      </button>
                      <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

                    <div className="flex items-center space-x-2">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium">
                        View Submissions
                      </button>
                      <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        Edit
                      </button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">JavaScript Algorithms</h4>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
                        Due Soon
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Course: Advanced JavaScript</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Due:</span>
                        <span className="font-medium text-gray-900 dark:text-white">Jan 28, 2024</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Submissions:</span>
                        <span className="font-medium text-gray-900 dark:text-white">8/18</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Graded:</span>
                        <span className="font-medium text-gray-900 dark:text-white">5/8</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Avg Grade:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">78%</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium">
                        View Submissions
                      </button>
                      <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'quizzes' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quizzes</h3>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Create Quiz</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Sample quiz data */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">React Basics Quiz</h4>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Published
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Course: React Fundamentals</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Questions:</span>
                        <span className="font-medium text-gray-900 dark:text-white">10</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Attempts:</span>
                        <span className="font-medium text-gray-900 dark:text-white">25</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Avg Score:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">82%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Time Limit:</span>
                        <span className="font-medium text-gray-900 dark:text-white">30 min</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium">
                        View Results
                      </button>
                      <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        Edit
                      </button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">JavaScript Functions</h4>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Published
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Course: Advanced JavaScript</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Questions:</span>
                        <span className="font-medium text-gray-900 dark:text-white">15</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Attempts:</span>
                        <span className="font-medium text-gray-900 dark:text-white">18</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Avg Score:</span>
                        <span className="font-medium text-green-600 dark:text-green-400">75%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Time Limit:</span>
                        <span className="font-medium text-gray-900 dark:text-white">45 min</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm font-medium">
                        View Results
                      </button>
                      <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'videos' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Videos</h3>
                  <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                    <Plus className="w-4 h-4" />
                    <span>Upload Video</span>
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Sample video data */}
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">Introduction to React Components</h4>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Published
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Course: React Fundamentals</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                        <span className="font-medium text-gray-900 dark:text-white">30 min</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Views:</span>
                        <span className="font-medium text-gray-900 dark:text-white">245</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Uploaded:</span>
                        <span className="font-medium text-gray-900 dark:text-white">Jan 15, 2024</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm font-medium flex items-center justify-center space-x-1">
                        <Play className="w-4 h-4" />
                        <span>Preview</span>
                      </button>
                      <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        Edit
                      </button>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white">JavaScript ES6 Features</h4>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Published
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Course: Advanced JavaScript</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Duration:</span>
                        <span className="font-medium text-gray-900 dark:text-white">40 min</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Views:</span>
                        <span className="font-medium text-gray-900 dark:text-white">189</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Uploaded:</span>
                        <span className="font-medium text-gray-900 dark:text-white">Jan 10, 2024</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm font-medium flex items-center justify-center space-x-1">
                        <Play className="w-4 h-4" />
                        <span>Preview</span>
                      </button>
                      <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Analytics Dashboard</h3>
                
                {/* Analytics Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Course Completion Rate</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">78%</p>
                      </div>
                      <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Student Engagement</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">92%</p>
                      </div>
                      <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Assignment Submission Rate</p>
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">85%</p>
                      </div>
                      <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
                        <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">4.3</p>
                      </div>
                      <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                        <Award className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Performing Courses</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">React Fundamentals</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">25 students • 4.5 rating</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600 dark:text-green-400">↑ 15%</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">vs last month</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">Advanced JavaScript</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">40 students • 4.2 rating</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600 dark:text-green-400">↑ 8%</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">vs last month</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Student Activity</h4>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-sm font-medium">AJ</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Alice completed "React Components"</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 text-sm font-medium">BS</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-white">Bob submitted assignment</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">4 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Content Management</h3>
                  <div className="flex items-center space-x-2">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
                      <Plus className="w-4 h-4" />
                      <span>Add Content</span>
                    </button>
                  </div>
                </div>
                
                {/* Content Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Lessons</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">24</p>
                      </div>
                      <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Videos</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">18</p>
                      </div>
                      <Play className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Assignments</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">12</p>
                      </div>
                      <FileText className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Quizzes</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">8</p>
                      </div>
                      <HelpCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                </div>

                {/* Content by Course */}
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Content by Course</h4>
                    <div className="space-y-4">
                      {courses.map((course) => (
                        <div key={course.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="font-medium text-gray-900 dark:text-white">{course.title}</h5>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.isPublished ? 'Published' : 'Draft')}`}>
                              {course.isPublished ? 'Published' : 'Draft'}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <BookOpen className="w-4 h-4 text-blue-600" />
                              <span className="text-gray-600 dark:text-gray-400">{course.totalLessons} lessons</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Play className="w-4 h-4 text-purple-600" />
                              <span className="text-gray-600 dark:text-gray-400">6 videos</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <FileText className="w-4 h-4 text-orange-600" />
                              <span className="text-gray-600 dark:text-gray-400">3 assignments</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <HelpCircle className="w-4 h-4 text-green-600" />
                              <span className="text-gray-600 dark:text-gray-400">2 quizzes</span>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center space-x-2">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-xs font-medium">
                              Manage Content
                            </button>
                            <button className="border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded text-xs font-medium">
                              Add Lesson
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Course Modal */}
      <CourseModal
        isOpen={showCourseModal}
        onClose={handleCloseCourseModal}
        onSave={handleSaveCourse as any}
        course={selectedCourse as any}
      />

      {/* Lesson Modal */}
      <LessonModal
        isOpen={showLessonModal}
        onClose={handleCloseLessonModal}
        onSave={handleSaveLesson}
        lesson={selectedLesson}
        courseId={selectedCourse?.id || 0}
      />
    </DashboardLayout>
  );
};

export default InstructorDashboard;
