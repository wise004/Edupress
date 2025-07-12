import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  BookOpen, 
  Award, 
  Clock, 
  TrendingUp,
  Calendar,
  Play,
  CheckCircle,
  BarChart3,
  Target,
  Trophy,
  Flame
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { 
  getMockEnrollmentsByUser,
  getMockCourseById,
  getStudentStats,
  type MockCourse,
  type MockEnrollment
} from '../services/mockData';

interface StudentStats {
  totalEnrolledCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  certificatesEarned: number;
  averageProgress: number;
  streakDays: number;
  totalHoursLearned: number;
  recentCourses: string[];
  upcomingDeadlines: string[];
}

const StudentDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'progress' | 'certificates'>('overview');
  const [enrolledCourses, setEnrolledCourses] = useState<Array<MockCourse & { enrollment: MockEnrollment }>>([]);
  const [stats, setStats] = useState<StudentStats>({
    totalEnrolledCourses: 0,
    completedCourses: 0,
    inProgressCourses: 0,
    certificatesEarned: 0,
    averageProgress: 0,
    streakDays: 15,
    totalHoursLearned: 0,
    recentCourses: [],
    upcomingDeadlines: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Handle URL parameters for tab navigation
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'courses', 'progress', 'certificates'].includes(tab)) {
      setActiveTab(tab as any);
    }
  }, [searchParams]);

  useEffect(() => {
    loadStudentData();
  }, [user]);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab as any);
    setSearchParams({ tab });
  };

  const loadStudentData = async () => {
    setLoading(true);
    
    try {
      if (user) {
        // Load student enrolled courses and statistics from mock data
        const enrollments = getMockEnrollmentsByUser(user.id);
        const coursesWithEnrollments = enrollments.map(enrollment => {
          const course = getMockCourseById(enrollment.courseId);
          return course ? { ...course, enrollment } : null;
        }).filter(Boolean) as Array<MockCourse & { enrollment: MockEnrollment }>;

        const studentStats = getStudentStats(user.id);

        setEnrolledCourses(coursesWithEnrollments);
        setStats({
          totalEnrolledCourses: studentStats.totalEnrollments,
          completedCourses: studentStats.completedCourses,
          inProgressCourses: studentStats.inProgressCourses,
          certificatesEarned: studentStats.certificatesEarned,
          averageProgress: enrollments.reduce((sum, e) => sum + e.completionPercentage, 0) / enrollments.length || 0,
          streakDays: 15, // Mock streak
          totalHoursLearned: Math.round(studentStats.totalStudyTime),
          recentCourses: coursesWithEnrollments.slice(0, 3).map(c => c.title),
          upcomingDeadlines: ["Assignment due tomorrow", "Quiz available in 2 days"]
        });
      }
    } catch (error) {
      console.error('Failed to load student data:', error);
      // Fallback to empty state
      setEnrolledCourses([]);
      setStats({
        totalEnrolledCourses: 0,
        completedCourses: 0,
        inProgressCourses: 0,
        certificatesEarned: 0,
        averageProgress: 0,
        streakDays: 0,
        totalHoursLearned: 0,
        recentCourses: [],
        upcomingDeadlines: []
      });
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: t('dashboardOverview'), icon: BarChart3 },
    { id: 'courses', label: t('myCourses'), icon: BookOpen },
    { id: 'progress', label: t('progress'), icon: TrendingUp },
    { id: 'certificates', label: t('certificates'), icon: Award }
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600 dark:text-gray-400">{t('loadingDashboard')}</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">{t('studentDashboard')}</h1>
            <p className="mt-1 text-sm sm:text-base text-gray-600 dark:text-gray-400">{t('trackLearningProgress')}</p>
          </div>
          <div className="flex items-center space-x-2 bg-orange-100 dark:bg-orange-900/20 px-3 py-2 rounded-lg w-fit">
            <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600 dark:text-orange-400" />
            <span className="text-orange-600 dark:text-orange-400 font-medium text-sm sm:text-base">{stats.streakDays} {t('dayStreak')}</span>
          </div>
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
                <strong>{t('demoMode')}:</strong> {t('demoModeDescription')}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{t('enrolledCourses')}</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.totalEnrolledCourses}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                <BookOpen className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{t('completed')}</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.completedCourses}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{t('inProgress')}</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.inProgressCourses}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                <Clock className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{t('certificates')}</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.certificatesEarned}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                <Award className="w-4 h-4 sm:w-6 sm:h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{t('hoursLearned')}</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.totalHoursLearned}</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                <Target className="w-4 h-4 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-3 sm:p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{t('avgProgress')}</p>
                <p className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white">{stats.averageProgress.toFixed(0)}%</p>
              </div>
              <div className="w-8 h-8 sm:w-12 sm:h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center flex-shrink-0 ml-2">
                <TrendingUp className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex overflow-x-auto space-x-4 sm:space-x-8 px-4 sm:px-6 scrollbar-hide">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    className={`flex items-center space-x-2 py-4 border-b-2 font-medium text-xs sm:text-sm whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{t(tab.id)}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Courses */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('recentCourses')}</h3>
                  <div className="space-y-3">
                    {stats.recentCourses.length > 0 ? (
                      stats.recentCourses.map((courseName, index) => (
                        <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 dark:text-white">{courseName}</span>
                            <Play className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">{t('noRecentCourses')}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Upcoming Deadlines */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('upcomingDeadlines')}</h3>
                  <div className="space-y-3">
                    {stats.upcomingDeadlines.length > 0 ? (
                      stats.upcomingDeadlines.map((deadline, index) => (
                        <div key={index} className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 dark:text-white">{deadline}</span>
                            <Calendar className="w-5 h-5 text-red-600 dark:text-red-400" />
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">{t('noUpcomingDeadlines')}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('myEnrolledCourses')}</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {enrolledCourses.length > 0 ? (
                    enrolledCourses.map((course) => (
                      <div key={course.id} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                        <div className="space-y-4">
                          <div className="flex items-start space-x-3">
                            <img 
                              src={course.thumbnailUrl} 
                              alt={course.title}
                              className="w-16 h-12 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900 dark:text-white">{course.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{course.instructorName}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{course.shortDescription}</p>
                          
                          {/* Progress Bar */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">{t('progress')}</span>
                              <span className="font-medium text-gray-900 dark:text-white">{course.enrollment.completionPercentage}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${course.enrollment.completionPercentage}%` }}></div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {course.totalLessons} {t('lessons')}
                            </span>
                            <button className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline">
                              {course.enrollment.completionPercentage === 100 ? t('reviewCourse') : t('continueLearning')}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('noEnrolledCourses')}</h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2">
                        {t('browseCourseCatalog')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('learningProgress')}</h3>
                
                {/* Progress Analytics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Weekly Learning Goals</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Complete 5 lessons</span>
                        <span className="text-green-600">4/5</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: '80%' }}></div>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Study 10 hours</span>
                        <span className="text-blue-600">7/10</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Learning Streak</h4>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-orange-600 mb-2">15</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Days in a row</div>
                      <div className="flex justify-center space-x-1 mt-4">
                        {[...Array(7)].map((_, i) => (
                          <div key={i} className={`w-6 h-6 rounded-full ${i < 5 ? 'bg-orange-500' : 'bg-gray-200 dark:bg-gray-600'}`}></div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <h4 className="font-medium text-gray-900 dark:text-white mb-4">Skills Progress</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>React Development</span>
                          <span>85%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Digital Marketing</span>
                          <span>45%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Data Analysis</span>
                          <span>25%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                          <div className="bg-purple-600 h-2 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Course Progress */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Course Progress Details</h4>
                    <div className="space-y-6">
                      {enrolledCourses.map((course) => (
                        <div key={course.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h5 className="font-medium text-gray-900 dark:text-white">{course.title}</h5>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{course.instructorName}</p>
                            </div>
                            <span className="text-lg font-bold text-blue-600">{course.enrollment.completionPercentage}%</span>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Lessons completed:</span>
                              <div className="font-medium">{Math.floor(course.totalLessons * course.enrollment.completionPercentage / 100)}/{course.totalLessons}</div>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Time spent:</span>
                              <div className="font-medium">{Math.floor(course.duration * course.enrollment.completionPercentage / 100)}h</div>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Quiz score:</span>
                              <div className="font-medium">87%</div>
                            </div>
                            <div>
                              <span className="text-gray-600 dark:text-gray-400">Last accessed:</span>
                              <div className="font-medium">2 days ago</div>
                            </div>
                          </div>
                          
                          <div className="mt-4 w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                            <div className="bg-blue-600 h-3 rounded-full" style={{ width: `${course.enrollment.completionPercentage}%` }}></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'certificates' && (
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">{t('certificatesAchievements')}</h3>
                
                {/* Earned Certificates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                          <Award className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">Introduction to Programming</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">Completed Dec 20, 2024</p>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Download</button>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg p-4">
                      <div className="text-sm text-gray-600 dark:text-gray-400">Verification ID: CERT-2024-001</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">Verified • 100% completion rate</div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 border-dashed">
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Complete React Course</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">25% more to earn certificate</p>
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Achievement Badges */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Achievement Badges</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                        <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/40 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Flame className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h5 className="font-medium text-sm text-gray-900 dark:text-white">Streak Master</h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400">15-day learning streak</p>
                      </div>
                      
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center mx-auto mb-2">
                          <BookOpen className="w-6 h-6 text-blue-600" />
                        </div>
                        <h5 className="font-medium text-sm text-gray-900 dark:text-white">Quick Learner</h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Completed course in record time</p>
                      </div>
                      
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center mx-auto mb-2">
                          <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <h5 className="font-medium text-sm text-gray-900 dark:text-white">Perfect Score</h5>
                        <p className="text-xs text-gray-600 dark:text-gray-400">100% on all quizzes</p>
                      </div>
                      
                      <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg opacity-50">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Trophy className="w-6 h-6 text-gray-400" />
                        </div>
                        <h5 className="font-medium text-sm text-gray-500">Course Expert</h5>
                        <p className="text-xs text-gray-400">Complete 5 courses</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
