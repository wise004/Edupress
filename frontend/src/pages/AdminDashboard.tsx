import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard,
  RefreshCw,
  BarChart3,
  FileText,
  Users,
  BookOpen,
  GraduationCap,
  UserCheck,
  Tag,
  Settings
} from 'lucide-react';
import DashboardLayout from '../components/DashboardLayout';
import { mockAnalytics } from '../services/mockData';

interface PaymentStats {
  totalPayments: number;
  successfulPayments: number;
  totalRevenue: number;
  cancelledPayments?: number;
  totalTransactions?: number;
}

interface AdminOverview {
  totalUsers: number;
  totalCourses: number;
  publishedCourses: number;
  freeCourses: number;
  paidCourses: number;
  totalStudents: number;
  totalInstructors: number;
  totalAdmins: number;
}

interface PaymentStats {
  totalPayments: number;
  successfulPayments: number;
  totalRevenue: number;
  cancelledPayments?: number;
  totalTransactions?: number;
}

interface AdminOverview {
  totalUsers: number;
  totalCourses: number;
  publishedCourses: number;
  freeCourses: number;
  paidCourses: number;
  totalStudents: number;
  totalInstructors: number;
  totalAdmins: number;
}

const AdminDashboard = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [paymentStats, setPaymentStats] = useState<PaymentStats | null>(null);
  const [paymeStats, setPaymeStats] = useState<PaymentStats | null>(null);
  const [adminOverview, setAdminOverview] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('30');

  useEffect(() => {
    // Handle URL parameters for tab navigation
    const tab = searchParams.get('tab');
    if (tab && ['overview', 'users', 'courses', 'transactions', 'analytics', 'payments', 'settings', 'reports'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    loadDashboardData();
  }, [filterPeriod]);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Use comprehensive mock data for business demo
      const mockOverview: AdminOverview = {
        totalUsers: mockAnalytics.totalUsers,
        totalCourses: mockAnalytics.totalCourses,
        publishedCourses: 85,
        freeCourses: 23,
        paidCourses: 62,
        totalStudents: 23847,
        totalInstructors: 456,
        totalAdmins: 15
      };

      const mockPaymentStats: PaymentStats = {
        totalPayments: 12456,
        successfulPayments: 11834,
        totalRevenue: mockAnalytics.totalRevenue,
        cancelledPayments: 234,
        totalTransactions: 12678
      };

      const mockPaymeStats: PaymentStats = {
        totalPayments: 8945,
        successfulPayments: 8523,
        totalRevenue: 1847592.50,
        cancelledPayments: 156,
        totalTransactions: 9101
      };

      // Set mock data immediately for business demo
      setAdminOverview(mockOverview);
      setPaymentStats(mockPaymentStats);
      setPaymeStats(mockPaymeStats);
      
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
      console.error('Dashboard loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getTotalRevenue = () => {
    return (paymentStats?.totalRevenue || 0) + (paymeStats?.totalRevenue || 0);
  };

  const getTotalTransactions = () => {
    return (paymentStats?.totalPayments || 0) + (paymeStats?.totalTransactions || 0);
  };

  const getSuccessfulPayments = () => {
    return (paymentStats?.successfulPayments || 0) + (paymeStats?.successfulPayments || 0);
  };

  const tabs = [
    { id: 'overview', label: t('dashboard.tabs.overview'), icon: BarChart3 },
    { id: 'users', label: t('dashboard.tabs.users'), icon: Users },
    { id: 'courses', label: t('dashboard.tabs.courses'), icon: BookOpen },
    { id: 'transactions', label: t('dashboard.tabs.transactions'), icon: CreditCard },
    { id: 'analytics', label: t('dashboard.tabs.analytics'), icon: TrendingUp },
    { id: 'payments', label: t('dashboard.tabs.payments'), icon: DollarSign },
    { id: 'settings', label: t('dashboard.tabs.settings'), icon: Settings },
    { id: 'reports', label: t('dashboard.tabs.reports'), icon: FileText }
  ];

  const loadData = () => {
    loadDashboardData();
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
            <span className="text-gray-600 dark:text-gray-400">{t('common.loading')}</span>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('dashboard.admin.title')}</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-400">{t('dashboard.admin.subtitle')}</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="7">{t('common.periods.last7Days')}</option>
              <option value="30">{t('common.periods.last30Days')}</option>
              <option value="90">{t('common.periods.last90Days')}</option>
              <option value="all">{t('common.periods.allTime')}</option>
            </select>
            <button
              onClick={loadData}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
            >
              <RefreshCw className="h-4 w-4" />
              <span>{t('common.refresh')}</span>
            </button>
          </div>
        </div>

        {/* Demo Mode Warning */}
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-4 mb-8">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-200">
                <strong>{t('dashboard.demoMode.title')}:</strong> {t('dashboard.demoMode.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
            <p className="text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Total Users */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('dashboard.stats.totalUsers')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {adminOverview?.totalUsers.toLocaleString() || '0'}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Total Courses */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('dashboard.stats.totalCourses')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {adminOverview?.totalCourses.toLocaleString() || '0'}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          {/* Free Courses */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('dashboard.stats.freeCourses')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {adminOverview?.freeCourses.toLocaleString() || '0'}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                <Tag className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>

          {/* Paid Courses */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('dashboard.stats.paidCourses')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {adminOverview?.paidCourses.toLocaleString() || '0'}
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Students */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('dashboard.stats.students')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {adminOverview?.totalStudents.toLocaleString() || '0'}
                </p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
          </div>

          {/* Instructors */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('dashboard.stats.instructors')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {adminOverview?.totalInstructors.toLocaleString() || '0'}
                </p>
              </div>
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/20 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-teal-600 dark:text-teal-400" />
              </div>
            </div>
          </div>

          {/* Total Revenue */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{t('dashboard.stats.totalRevenue')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  ${getTotalRevenue().toLocaleString()}
                </p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
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
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Stripe Stats */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard.payments.stripe.title')}</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{t('dashboard.stats.totalPayments')}:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{paymentStats?.totalPayments || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{t('dashboard.stats.successfulPayments')}:</span>
                        <span className="font-medium text-green-600">{paymentStats?.successfulPayments || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{t('dashboard.stats.revenue')}:</span>
                        <span className="font-medium text-gray-900 dark:text-white">${paymentStats?.totalRevenue?.toLocaleString() || '0'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payme Stats */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('dashboard.payments.payme.title')}</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{t('dashboard.stats.totalTransactions')}:</span>
                        <span className="font-medium text-gray-900 dark:text-white">{paymeStats?.totalTransactions || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{t('dashboard.stats.successfulPayments')}:</span>
                        <span className="font-medium text-green-600">{paymeStats?.successfulPayments || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">{t('dashboard.stats.revenue')}:</span>
                        <span className="font-medium text-gray-900 dark:text-white">${paymeStats?.totalRevenue?.toLocaleString() || '0'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Success Rate Card */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('dashboard.stats.successRate')}</h3>
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
                        {getTotalTransactions() > 0
                          ? Math.round((getSuccessfulPayments() / getTotalTransactions()) * 100)
                          : 0}%
                      </p>
                    </div>
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('dashboard.tabs.users')}</h3>
                <p className="text-gray-500 dark:text-gray-400">{t('dashboard.comingSoon')}</p>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('dashboard.tabs.courses')}</h3>
                <p className="text-gray-500 dark:text-gray-400">{t('dashboard.comingSoon')}</p>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="text-center py-12">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('dashboard.tabs.transactions')}</h3>
                <p className="text-gray-500 dark:text-gray-400">{t('dashboard.comingSoon')}</p>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('dashboard.tabs.analytics')}</h3>
                <p className="text-gray-500 dark:text-gray-400">{t('dashboard.comingSoon')}</p>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="text-center py-12">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('dashboard.tabs.payments')}</h3>
                <p className="text-gray-500 dark:text-gray-400">{t('dashboard.comingSoon')}</p>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="text-center py-12">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('dashboard.tabs.settings')}</h3>
                <p className="text-gray-500 dark:text-gray-400">{t('dashboard.comingSoon')}</p>
              </div>
            )}

            {activeTab === 'reports' && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('dashboard.tabs.reports')}</h3>
                <p className="text-gray-500 dark:text-gray-400">{t('dashboard.comingSoon')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
