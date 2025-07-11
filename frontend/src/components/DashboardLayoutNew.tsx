import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  BarChart3, 
  BookOpen, 
  Users, 
  Settings, 
  Menu, 
  X, 
  GraduationCap,
  FileText,
  MessageSquare,
  Award,
  DollarSign,
  User,
  Home,
  PlusCircle
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from 'react-i18next'

interface DashboardLayoutProps {
  children: React.ReactNode
}

interface NavItem {
  name: string
  href: string
  icon: any
  badge?: string | number
  roles: ('ADMIN' | 'INSTRUCTOR' | 'STUDENT')[]
}

function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const { user } = useAuth()
  const { t } = useTranslation()
  const location = useLocation()

  const navigationItems: NavItem[] = [
    // Student Navigation
    { name: t('dashboardOverview'), href: '/student-dashboard', icon: BarChart3, roles: ['STUDENT'] },
    { name: t('myCourses'), href: '/student-dashboard?tab=courses', icon: BookOpen, roles: ['STUDENT'] },
    { name: t('assignments'), href: '/student-dashboard?tab=assignments', icon: FileText, roles: ['STUDENT'] },
    { name: t('quizzes'), href: '/student-dashboard?tab=quizzes', icon: GraduationCap, roles: ['STUDENT'] },
    { name: t('dashboardCertificates'), href: '/student-dashboard?tab=certificates', icon: Award, roles: ['STUDENT'] },
    
    // Instructor Navigation
    { name: t('dashboardOverview'), href: '/instructor-dashboard', icon: BarChart3, roles: ['INSTRUCTOR'] },
    { name: t('manageCourses'), href: '/instructor-dashboard?tab=courses', icon: BookOpen, roles: ['INSTRUCTOR'] },
    { name: t('dashboardStudents'), href: '/instructor-dashboard?tab=students', icon: Users, roles: ['INSTRUCTOR'] },
    { name: t('manageAssignments'), href: '/instructor-dashboard?tab=assignments', icon: FileText, roles: ['INSTRUCTOR'] },
    { name: t('manageQuizzes'), href: '/instructor-dashboard?tab=quizzes', icon: GraduationCap, roles: ['INSTRUCTOR'] },
    { name: t('videos'), href: '/instructor-dashboard?tab=videos', icon: MessageSquare, roles: ['INSTRUCTOR'] },
    { name: t('dashboardAnalytics'), href: '/instructor-dashboard?tab=analytics', icon: BarChart3, roles: ['INSTRUCTOR'] },
    
    // Admin Navigation
    { name: t('dashboardOverview'), href: '/admin-dashboard', icon: BarChart3, roles: ['ADMIN'] },
    { name: t('dashboardAllCourses'), href: '/admin-dashboard?tab=courses', icon: BookOpen, roles: ['ADMIN'] },
    { name: t('allUsers'), href: '/admin-dashboard?tab=users', icon: Users, roles: ['ADMIN'] },
    { name: t('systemAnalytics'), href: '/admin-dashboard?tab=analytics', icon: BarChart3, roles: ['ADMIN'] },
    { name: t('payments'), href: '/admin-dashboard?tab=payments', icon: DollarSign, roles: ['ADMIN'] },
    { name: t('dashboardSettings'), href: '/admin-dashboard?tab=settings', icon: Settings, roles: ['ADMIN'] },
  ]

  const getFilteredNavItems = () => {
    if (!user?.role) return []
    return navigationItems.filter(item => item.roles.includes(user.role as any))
  }

  const getDashboardTitle = () => {
    switch (user?.role) {
      case 'ADMIN':
        return t('adminDashboard')
      case 'INSTRUCTOR':
        return t('instructorDashboard')
      default:
        return t('studentDashboard')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 lg:flex">
      {/* Sidebar */}
      <div className={`w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 
        transform transition-transform duration-200 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 
        fixed inset-y-0 left-0 z-50 
        lg:static lg:z-auto lg:flex-shrink-0`}>
        
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
            {getDashboardTitle()}
          </h1>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {getFilteredNavItems().map((item, index) => {
            const isActive = location.pathname === item.href || location.pathname + location.search === item.href
            return (
              <Link
                key={index}
                to={item.href}
                className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors duration-150 ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400' 
                    : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                }`} />
                {item.name}
                {item.badge && (
                  <span className="ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
                    {item.badge}
                  </span>
                )}
              </Link>
            )
          })}

          {/* Quick Actions */}
          <div className="mt-8">
            <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              {t('quickActions')}
            </h3>
            <div className="mt-2 space-y-1">
              {user?.role === 'INSTRUCTOR' && (
                <>
                  <Link
                    to="/instructor-dashboard?action=create-course"
                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  >
                    <PlusCircle className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
                    {t('createCourse')}
                  </Link>
                  <Link
                    to="/instructor-dashboard?tab=quizzes&action=create-quiz"
                    className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                  >
                    <PlusCircle className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
                    {t('createQuiz')}
                  </Link>
                </>
              )}
              {user?.role === 'ADMIN' && (
                <Link
                  to="/admin-dashboard?tab=users&action=add-user"
                  className="group flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white"
                >
                  <PlusCircle className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300" />
                  Add User
                </Link>
              )}
            </div>
          </div>
        </nav>

        {/* User Info */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {user?.role?.toLowerCase()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:flex-1 lg:flex lg:flex-col min-w-0">
        {/* Mobile menu button */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {getDashboardTitle()}
            </h1>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-1.5 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-40 bg-gray-600 bg-opacity-75"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  )
}

export default DashboardLayout
