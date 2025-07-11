import { useState, useEffect } from 'react';
import { Bell, X, Check, AlertCircle, Info, CheckCircle, AlertTriangle, CreditCard } from 'lucide-react';
import { useWebSocket } from '../hooks/useWebSocket';

interface NotificationToastProps {
  notification: {
    id: number;
    title: string;
    message: string;
    type: string;
    actionUrl?: string;
    createdAt: string;
  };
  onClose: () => void;
  onMarkRead: (id: number) => void;
}

function NotificationToast({ notification, onClose, onMarkRead }: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for fade out animation
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'error': return <AlertCircle className="h-5 w-5 text-red-600" />;
      case 'payment': return <CreditCard className="h-5 w-5 text-blue-600" />;
      default: return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'success': return 'border-l-green-500';
      case 'warning': return 'border-l-yellow-500';
      case 'error': return 'border-l-red-500';
      case 'payment': return 'border-l-blue-500';
      default: return 'border-l-blue-500';
    }
  };

  const handleMarkRead = () => {
    onMarkRead(notification.id);
    onClose();
  };

  const handleClick = () => {
    if (notification.actionUrl) {
      window.location.href = notification.actionUrl;
    }
    handleMarkRead();
  };

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full'
      }`}
    >
      <div
        className={`bg-white border-l-4 ${getBorderColor(notification.type)} rounded-lg shadow-lg p-4 w-80 cursor-pointer hover:shadow-xl transition-shadow`}
        onClick={handleClick}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 mr-3">
            {getIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-semibold text-gray-900 truncate">
              {notification.title}
            </h4>
            <p className="mt-1 text-sm text-gray-600 line-clamp-2">
              {notification.message}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              {new Date(notification.createdAt).toLocaleTimeString()}
            </p>
          </div>
          <div className="flex flex-col space-y-1 ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMarkRead();
              }}
              className="text-gray-400 hover:text-green-600 transition-colors"
              title="Mark as read"
            >
              <Check className="h-4 w-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className="text-gray-400 hover:text-red-600 transition-colors"
              title="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

function NotificationCenter({ isOpen, onClose }: NotificationCenterProps) {
  const { notifications, markNotificationAsRead, clearNotifications } = useWebSocket();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-96 bg-white shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
          <div className="flex space-x-2">
            <button
              onClick={clearNotifications}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear all
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        
        <div className="overflow-y-auto h-full pb-20">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Bell className="h-12 w-12 mb-4" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    if (notification.actionUrl) {
                      window.location.href = notification.actionUrl;
                    }
                    markNotificationAsRead(notification.id);
                  }}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-3">
                      {(() => {
                        switch (notification.type.toLowerCase()) {
                          case 'success': return <CheckCircle className="h-5 w-5 text-green-600" />;
                          case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
                          case 'error': return <AlertCircle className="h-5 w-5 text-red-600" />;
                          case 'payment': return <CreditCard className="h-5 w-5 text-blue-600" />;
                          default: return <Info className="h-5 w-5 text-blue-600" />;
                        }
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </h4>
                      <p className="mt-1 text-sm text-gray-600">
                        {notification.message}
                      </p>
                      <p className="mt-1 text-xs text-gray-400">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markNotificationAsRead(notification.id);
                      }}
                      className="text-gray-400 hover:text-green-600 transition-colors ml-2"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function RealTimeNotifications() {
  const [showCenter, setShowCenter] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);
  const { connected, notifications, markNotificationAsRead } = useWebSocket();

  // Show new notifications as toasts
  useEffect(() => {
    const newNotification = notifications[0];
    if (newNotification && !toasts.find(t => t.id === newNotification.id)) {
      setToasts(prev => [...prev, newNotification]);
    }
  }, [notifications, toasts]);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const unreadCount = notifications.filter(n => !(n as any).isRead).length;

  return (
    <>
      {/* Notification Bell Icon */}
      <div className="relative">
        <button
          onClick={() => setShowCenter(true)}
          className={`relative p-2 rounded-full transition-colors ${
            connected 
              ? 'text-gray-600 hover:text-gray-900 hover:bg-gray-100' 
              : 'text-gray-400'
          }`}
          title={connected ? 'View notifications' : 'Connecting to notifications...'}
        >
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
          {!connected && (
            <span className="absolute -top-1 -right-1 bg-yellow-500 rounded-full h-3 w-3 animate-pulse" />
          )}
        </button>
      </div>

      {/* Toast Notifications */}
      {toasts.map((toast, index) => (
        <div key={toast.id} style={{ transform: `translateY(${index * 90}px)` }}>
          <NotificationToast
            notification={toast}
            onClose={() => removeToast(toast.id)}
            onMarkRead={markNotificationAsRead}
          />
        </div>
      ))}

      {/* Notification Center */}
      <NotificationCenter
        isOpen={showCenter}
        onClose={() => setShowCenter(false)}
      />
    </>
  );
}
