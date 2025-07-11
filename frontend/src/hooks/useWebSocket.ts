import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  actionUrl?: string;
  createdAt: string;
}

interface WebSocketMessage {
  type: string;
  [key: string]: any;
}

export const useWebSocket = () => {
  const [connected, setConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [systemMessages, setSystemMessages] = useState<WebSocketMessage[]>([]);
  const clientRef = useRef<Client | null>(null);

  const connect = useCallback(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.warn('No access token found, cannot connect to WebSocket');
      return;
    }

    const socket = new SockJS(import.meta.env.VITE_WEBSOCKET_URL || 'http://localhost:8081/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`,
      },
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.log('WebSocket Debug:', str);
        }
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      console.log('Connected to WebSocket:', frame);
      setConnected(true);

      // Subscribe to user-specific notifications
      client.subscribe('/user/queue/notifications', (message) => {
        try {
          const notification = JSON.parse(message.body) as Notification;
          setNotifications(prev => [notification, ...prev.slice(0, 49)]); // Keep last 50
          
          // Show browser notification if supported
          if (Notification.permission === 'granted') {
            new Notification(notification.title, {
              body: notification.message,
              icon: '/favicon.ico',
            });
          }
        } catch (error) {
          console.error('Error parsing notification:', error);
        }
      });

      // Subscribe to connection confirmations
      client.subscribe('/user/queue/connected', (message) => {
        console.log('WebSocket connection confirmed:', message.body);
      });

      // Subscribe to notification read confirmations
      client.subscribe('/user/queue/notification-read', (message) => {
        try {
          const response = JSON.parse(message.body);
          if (response.status === 'success') {
            setNotifications(prev => 
              prev.map(notif => 
                notif.id === response.notificationId 
                  ? { ...notif, isRead: true } 
                  : notif
              )
            );
          }
        } catch (error) {
          console.error('Error parsing notification read response:', error);
        }
      });

      // Subscribe to system announcements
      client.subscribe('/topic/announcements', (message) => {
        try {
          const announcement = JSON.parse(message.body) as WebSocketMessage;
          setSystemMessages(prev => [announcement, ...prev.slice(0, 19)]); // Keep last 20
        } catch (error) {
          console.error('Error parsing system announcement:', error);
        }
      });

      // Subscribe to enrollment confirmations
      client.subscribe('/user/queue/enrollment', (message) => {
        try {
          const enrollment = JSON.parse(message.body) as WebSocketMessage;
          setSystemMessages(prev => [enrollment, ...prev.slice(0, 19)]);
        } catch (error) {
          console.error('Error parsing enrollment confirmation:', error);
        }
      });

      // Subscribe to errors
      client.subscribe('/user/queue/error', (message) => {
        try {
          const error = JSON.parse(message.body);
          console.error('WebSocket error:', error.message);
        } catch (err) {
          console.error('Error parsing WebSocket error:', err);
        }
      });

      // Send initial connection message
      client.publish({
        destination: '/app/connect',
        body: JSON.stringify({ timestamp: Date.now() }),
      });
    };

    client.onStompError = (frame) => {
      console.error('STOMP error:', frame);
      setConnected(false);
    };

    client.onDisconnect = () => {
      console.log('Disconnected from WebSocket');
      setConnected(false);
    };

    client.activate();
    clientRef.current = client;
  }, []);

  const disconnect = useCallback(() => {
    if (clientRef.current) {
      clientRef.current.deactivate();
      clientRef.current = null;
      setConnected(false);
    }
  }, []);

  const markNotificationAsRead = useCallback((notificationId: number) => {
    if (clientRef.current && connected) {
      clientRef.current.publish({
        destination: '/app/notification/read',
        body: JSON.stringify({ notificationId }),
      });
    }
  }, [connected]);

  const sendTypingIndicator = useCallback((location: string, isTyping: boolean) => {
    if (clientRef.current && connected) {
      clientRef.current.publish({
        destination: '/app/typing',
        body: JSON.stringify({ location, isTyping }),
      });
    }
  }, [connected]);

  const subscribeToCourse = useCallback((courseId: string) => {
    if (clientRef.current && connected) {
      return clientRef.current.subscribe(`/topic/course/${courseId}`, (message) => {
        try {
          const courseUpdate = JSON.parse(message.body) as WebSocketMessage;
          setSystemMessages(prev => [courseUpdate, ...prev.slice(0, 19)]);
        } catch (error) {
          console.error('Error parsing course update:', error);
        }
      });
    }
    return null;
  }, [connected]);

  // Request browser notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Auto-connect when user is authenticated
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token && !connected && !clientRef.current) {
      connect();
    }

    return () => {
      disconnect();
    };
  }, [connect, disconnect, connected]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connected,
    notifications,
    systemMessages,
    connect,
    disconnect,
    markNotificationAsRead,
    sendTypingIndicator,
    subscribeToCourse,
    clearNotifications: () => setNotifications([]),
    clearSystemMessages: () => setSystemMessages([]),
  };
};
