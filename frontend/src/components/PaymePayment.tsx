import { useState, useEffect } from 'react';
import { CreditCard, Shield, CheckCircle, ExternalLink } from 'lucide-react';
import { PaymentAPI } from '../services/api';

interface PaymePaymentProps {
  courseId: number;
  userId: number;
  amount: number;
  courseName: string;
  onSuccess: (transactionData: any) => void;
  onError: (error: string) => void;
  onCancel?: () => void;
}

interface PaymeTransactionStatus {
  transactionId: string;
  state: string;
  statusMessage: string;
  amount: number;
  courseTitle: string;
  createTime?: number;
  performTime?: number;
  cancelTime?: number;
}

export default function PaymePayment({ 
  courseId, 
  userId, 
  amount, 
  courseName, 
  onSuccess, 
  onError,
  onCancel 
}: PaymePaymentProps) {
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState<string>('');
  const [polling, setPolling] = useState(false);
  const [transactionId, setTransactionId] = useState<string>('');
  const [transactionStatus, setTransactionStatus] = useState<PaymeTransactionStatus | null>(null);
  const [showStatus, setShowStatus] = useState(false);

  // Generate Payme payment URL
  const generatePaymentUrl = async () => {
    try {
      setLoading(true);
      
      const response = await PaymentAPI.generatePaymeUrl({
        courseId,
        userId
      });
      
      setPaymentUrl(response.paymentUrl);
      
      // Extract transaction ID from URL or response if available
      // This might need adjustment based on actual Payme response
      if (response.transactionId) {
        setTransactionId(response.transactionId);
      }
      
    } catch (error: any) {
      console.error('Error generating Payme URL:', error);
      onError(error.response?.data?.message || 'To\'lov havolasini yaratishda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  // Poll transaction status
  const pollTransactionStatus = async (txId: string) => {
    try {
      const status = await PaymentAPI.getPaymeTransactionStatus(txId);
      setTransactionStatus(status);
      
      if (status.state === 'PAY_ACCEPTED') {
        setPolling(false);
        onSuccess(status);
      } else if (status.state === 'CANCELLED_WHILE_WAITING' || status.state === 'CANCELLED_AFTER_SUCCESSFUL') {
        setPolling(false);
        onError('To\'lov bekor qilindi');
      }
      
    } catch (error: any) {
      console.error('Error checking transaction status:', error);
      // Continue polling on error, don't stop
    }
  };

  // Start polling when transaction ID is available
  useEffect(() => {
    if (transactionId && polling) {
      const interval = setInterval(() => {
        pollTransactionStatus(transactionId);
      }, 3000); // Poll every 3 seconds

      return () => clearInterval(interval);
    }
  }, [transactionId, polling]);

  // Handle payment redirect
  const handlePaymentRedirect = () => {
    if (paymentUrl) {
      // Start polling for transaction status
      setPolling(true);
      setShowStatus(true);
      
      // Open Payme in a new window/tab
      const paymentWindow = window.open(paymentUrl, '_blank', 'width=800,height=600');
      
      // Check if payment window is closed
      const checkClosed = setInterval(() => {
        if (paymentWindow?.closed) {
          clearInterval(checkClosed);
          // Give some time for the backend to process the payment
          setTimeout(() => {
            if (transactionId) {
              pollTransactionStatus(transactionId);
            }
          }, 2000);
        }
      }, 1000);
    }
  };

  // Check payment status manually
  const checkPaymentStatus = () => {
    if (transactionId) {
      pollTransactionStatus(transactionId);
    }
  };

  // Convert amount from dollars to sum (assuming the course price is in dollars)
  const amountInSum = amount * 11000; // Approximate exchange rate, should be dynamic in production

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
          <CreditCard className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Payme orqali to'lash
        </h3>
        <p className="text-gray-600 text-sm">
          Xavfsiz va tez to'lov tizimi
        </p>
      </div>

      {/* Course Details */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="font-medium text-gray-900">{courseName}</p>
            <p className="text-sm text-gray-600">Kurs sotib olish</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">{amountInSum.toLocaleString()} so'm</p>
            <p className="text-sm text-gray-600">${amount} USD</p>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      {showStatus && transactionStatus && (
        <div className="mb-6 p-4 border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">To'lov holati:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              transactionStatus.state === 'PAY_ACCEPTED' 
                ? 'bg-green-100 text-green-800'
                : transactionStatus.state.includes('CANCELLED')
                ? 'bg-red-100 text-red-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {transactionStatus.statusMessage}
            </span>
          </div>
          {transactionStatus.transactionId && (
            <p className="text-xs text-gray-500">
              Tranzaksiya ID: {transactionStatus.transactionId}
            </p>
          )}
        </div>
      )}

      {/* Payment Button */}
      {!paymentUrl ? (
        <button
          onClick={generatePaymentUrl}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Tayyorlanmoqda...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <CreditCard className="h-5 w-5 mr-2" />
              To'lov qilish
            </div>
          )}
        </button>
      ) : (
        <div className="space-y-3">
          <button
            onClick={handlePaymentRedirect}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
          >
            <ExternalLink className="h-5 w-5 mr-2" />
            Payme'da to'lash
          </button>
          
          {polling && (
            <div className="text-center">
              <div className="flex items-center justify-center text-blue-600 mb-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                <span className="text-sm">To'lov holatini tekshirish...</span>
              </div>
              <button
                onClick={checkPaymentStatus}
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                Qo'lda tekshirish
              </button>
            </div>
          )}
          
          {onCancel && (
            <button
              onClick={onCancel}
              className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Bekor qilish
            </button>
          )}
        </div>
      )}

      {/* Security Information */}
      <div className="mt-6 bg-green-50 p-4 rounded-lg">
        <div className="flex items-center mb-2">
          <Shield className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-sm font-medium text-green-800">Xavfsiz to'lov</span>
        </div>
        <div className="space-y-1 text-xs text-green-700">
          <div className="flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            <span>SSL shifrlash bilan himoyalangan</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            <span>Payme xavfsizlik standartlari</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="h-3 w-3 mr-1" />
            <span>Bank kartasi ma'lumotlari saqlanmaydi</span>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          To'lov bo'yicha yordam kerak bo'lsa, <br />
          <a href="/contact" className="text-blue-600 hover:underline">
            biz bilan bog'laning
          </a>
        </p>
      </div>
    </div>
  );
}
