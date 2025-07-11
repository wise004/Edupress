import { useState, useEffect } from 'react';
import { CreditCard, Clock, CheckCircle, XCircle, RefreshCw, Eye } from 'lucide-react';
import { PaymentAPI } from '../services/api';

interface PaymeTransaction {
  id: number;
  paymeTransactionId: string;
  courseId: number;
  courseTitle: string;
  amount: number;
  state: string;
  createdAt: string;
  createTime?: number;
  performTime?: number;
  cancelTime?: number;
  reason?: number;
}

interface PaymeTransactionListProps {
  userId: number;
  refreshTrigger?: number; // To trigger refresh from parent
}

export default function PaymeTransactionList({ userId, refreshTrigger }: PaymeTransactionListProps) {
  const [transactions, setTransactions] = useState<PaymeTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Load user's Payme transactions
  const loadTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await PaymentAPI.getUserPaymeTransactions(userId);
      setTransactions(response);
      
    } catch (error: any) {
      console.error('Error loading Payme transactions:', error);
      setError('Tranzaksiyalarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, [userId, refreshTrigger]);

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
      case 'INITIAL':
        return 'Boshlangan';
      case 'WAITING_PAY':
        return 'To\'lov kutilmoqda';
      case 'PAY_ACCEPTED':
        return 'To\'lov muvaffaqiyatli';
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
    return new Date(dateString).toLocaleString('uz-UZ');
  };

  // Format timestamp
  const formatTimestamp = (timestamp?: number) => {
    if (!timestamp) return '-';
    return new Date(timestamp).toLocaleString('uz-UZ');
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

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="text-center py-8">
          <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Hali to'lovlar yo'q
          </h3>
          <p className="text-gray-600">
            Payme orqali amalga oshirilgan to'lovlar bu yerda ko'rsatiladi
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Payme To'lovlari
          </h3>
          <button
            onClick={loadTransactions}
            className="text-blue-600 hover:text-blue-800 transition-colors"
            title="Yangilash"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {transactions.map((transaction) => (
          <div key={transaction.id} className="p-6 hover:bg-gray-50 transition-colors">
            <div className="flex items-start justify-between">
              {/* Transaction Info */}
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  {getStatusIcon(transaction.state)}
                  <h4 className="ml-2 text-sm font-medium text-gray-900">
                    {transaction.courseTitle}
                  </h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <p><strong>Tranzaksiya ID:</strong> {transaction.paymeTransactionId}</p>
                    <p><strong>Summa:</strong> {formatAmount(transaction.amount)}</p>
                    <p><strong>Yaratilgan:</strong> {formatDate(transaction.createdAt)}</p>
                  </div>
                  <div>
                    {transaction.createTime && (
                      <p><strong>Boshlandi:</strong> {formatTimestamp(transaction.createTime)}</p>
                    )}
                    {transaction.performTime && (
                      <p><strong>Amalga oshirildi:</strong> {formatTimestamp(transaction.performTime)}</p>
                    )}
                    {transaction.cancelTime && (
                      <p><strong>Bekor qilindi:</strong> {formatTimestamp(transaction.cancelTime)}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="ml-4 flex flex-col items-end">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(transaction.state)}`}>
                  {getStatusText(transaction.state)}
                </span>
                
                {/* View Course Button */}
                <button
                  onClick={() => window.location.href = `/course/${transaction.courseId}`}
                  className="mt-2 text-blue-600 hover:text-blue-800 transition-colors flex items-center text-sm"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Kursni ko'rish
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
