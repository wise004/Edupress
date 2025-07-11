import { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Clock, 
  CheckCircle, 
  XCircle, 
  RefreshCw, 
  Eye,
  Filter,
  Download,
  Search,
  User,
  Calendar
} from 'lucide-react';
import { PaymentAPI } from '../services/api';

interface AdminPaymeTransaction {
  id: string;
  paymeTransactionId: string;
  courseId: number;
  courseName: string;
  userId: number;
  userEmail: string;
  amount: number;
  state: string;
  reason?: number;
  createTime?: number;
  performTime?: number;
  cancelTime?: number;
  createdAt: string;
  updatedAt: string;
}

interface AdminPaymeTransactionListProps {
  refreshTrigger?: number;
  period?: string;
}

export default function AdminPaymeTransactionList({ 
  refreshTrigger, 
  period = '30' 
}: AdminPaymeTransactionListProps) {
  const [transactions, setTransactions] = useState<AdminPaymeTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    loadTransactions();
  }, [refreshTrigger, period]);

  // Load admin transactions (all users)
  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Load real data from API
      const response = await PaymentAPI.getAdminPaymeTransactions(
        period === 'all' ? undefined : period,
        statusFilter === 'all' ? undefined : statusFilter,
        0, // page
        100 // size - get more records for frontend filtering
      );
      
      setTransactions(response);
    } catch (error: any) {
      console.error('Error loading admin Payme transactions:', error);
      setTransactions([]);
      setError('Failed to load transactions: ' + (error.response?.data?.message || error.message));
      
    } finally {
      setLoading(false);
    }
  };

  // Get status icon and color
  const getStatusIcon = (state: string) => {
    switch (state) {
      case 'PAY_ACCEPTED':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'CANCELLED_WHILE_WAITING':
      case 'CANCELLED_AFTER_SUCCESSFUL':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'WAITING_PAY':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-600" />;
    }
  };

  // Get status text in Uzbek
  const getStatusText = (state: string) => {
    switch (state) {
      case 'PAY_ACCEPTED':
        return 'Muvaffaqiyatli';
      case 'WAITING_PAY':
        return 'Kutilmoqda';
      case 'CANCELLED_WHILE_WAITING':
        return 'Bekor qilindi';
      case 'CANCELLED_AFTER_SUCCESSFUL':
        return 'Bekor qilindi (to\'lovdan keyin)';
      default:
        return state;
    }
  };

  // Get status badge color
  const getStatusBadgeColor = (state: string) => {
    switch (state) {
      case 'PAY_ACCEPTED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED_WHILE_WAITING':
      case 'CANCELLED_AFTER_SUCCESSFUL':
        return 'bg-red-100 text-red-800';
      case 'WAITING_PAY':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Format currency
  const formatAmount = (amount: number) => {
    return (amount / 100).toLocaleString('uz-UZ') + ' so\'m';
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format timestamp
  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleDateString('uz-UZ', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter transactions
  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = 
      transaction.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.paymeTransactionId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || transaction.state === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage);

  const handleExport = () => {
    // Export functionality
    alert('Export funktionaligi amalga oshirilmoqda...');
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Tranzaksiyalar yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={loadTransactions}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Qayta urinish
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header and Filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Payme Tranzaksiyalari</h3>
            <p className="text-sm text-gray-600">
              Jami {filteredTransactions.length} ta tranzaksiya
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleExport}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Export</span>
            </button>
            <button
              onClick={loadTransactions}
              className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Qidirish (kurs, email, ID)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Barcha holatlar</option>
              <option value="PAY_ACCEPTED">Muvaffaqiyatli</option>
              <option value="WAITING_PAY">Kutilmoqda</option>
              <option value="CANCELLED_WHILE_WAITING">Bekor qilindi</option>
              <option value="CANCELLED_AFTER_SUCCESSFUL">Bekor qilindi (to'lovdan keyin)</option>
            </select>
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={period}
              onChange={() => {
                // This would be handled by parent component
              }}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="7">So'nggi 7 kun</option>
              <option value="30">So'nggi 30 kun</option>
              <option value="90">So'nggi 90 kun</option>
              <option value="all">Barchasi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {paginatedTransactions.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Hech qanday tranzaksiya topilmadi</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tranzaksiya
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Foydalanuvchi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kurs
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Summa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Holat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Yaratilgan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amalga oshirilgan
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(transaction.state)}
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.paymeTransactionId}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {transaction.id}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-2" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {transaction.userEmail}
                          </div>
                          <div className="text-sm text-gray-500">
                            User ID: {transaction.userId}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{transaction.courseName}</div>
                      <div className="text-sm text-gray-500">Course ID: {transaction.courseId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatAmount(transaction.amount)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(transaction.state)}`}>
                        {getStatusText(transaction.state)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(transaction.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatTimestamp(transaction.performTime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 transition-colors">
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Oldingi
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Keyingi
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{startIndex + 1}</span> dan <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredTransactions.length)}</span> gacha, jami <span className="font-medium">{filteredTransactions.length}</span> ta
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Oldingi
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Keyingi
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
