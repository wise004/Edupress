import { useState, useEffect } from 'react';
import { BookOpen, Award, Calendar, CheckCircle, PlayCircle } from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { useAuth } from '../contexts/AuthContext';
import { UserAPI } from '../services/api';

interface CourseProgress {
  id: number;
  title: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  thumbnail: string;
}

interface UpcomingEvent {
  id: number;
  title: string;
  type: 'assignment' | 'quiz' | 'live_session';
  date: string;
  course: string;
}

interface Achievement {
  id: number;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

const DashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState<CourseProgress[]>([]);
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      
      try {
        // Load enrolled courses with progress
        const enrolledCoursesData = await UserAPI.getEnrolledCourses();
        setEnrolledCourses(enrolledCoursesData);

        // Load upcoming events (assignments, quizzes, live sessions)
        const eventsData = await UserAPI.getUpcomingEvents();
        setUpcomingEvents(eventsData);

        // Load user achievements
        const achievementsData = await UserAPI.getUserAchievements();
        setAchievements(achievementsData);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Fallback to empty arrays
        setEnrolledCourses([]);
        setUpcomingEvents([]);
        setAchievements([]);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'quiz':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'assignment':
        return <BookOpen className="w-4 h-4 text-green-500" />;
      case 'live_session':
        return <PlayCircle className="w-4 h-4 text-purple-500" />;
      default:
        return <Calendar className="w-4 h-4 text-gray-500" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {user?.firstName || 'Student'}! 👋
          </h1>
          <p className="text-blue-100">
            Ready to continue your learning journey? Let's make today productive!
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Enrolled Courses
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {enrolledCourses.length}
                </p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Completed Lessons
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {enrolledCourses.reduce((acc, course) => acc + course.completedLessons, 0)}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Achievements
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {achievements.length}
                </p>
              </div>
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Course Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Course Progress
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {enrolledCourses.length > 0 ? (
                enrolledCourses.map((course) => (
                  <div key={course.id} className="flex items-center space-x-4">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-16 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {course.title}
                      </h3>
                      <div className="mt-1">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                          <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                          <span>{course.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${course.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No enrolled courses yet. Start learning today!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upcoming Events
              </h2>
            </div>
            <div className="p-6 space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-shrink-0">
                      {getEventTypeIcon(event.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {event.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {event.course}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {formatDate(event.date)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">
                    No upcoming events
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Achievements */}
        {achievements.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Recent Achievements
              </h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
                    <div className="text-2xl">
                      {achievement.icon}
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {achievement.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        Unlocked {formatDate(achievement.unlockedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;
