import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock users for demonstration
const mockUsers: Record<string, User> = {
  'student@demo.com': {
    id: 1,
    username: 'student_demo',
    firstName: 'John',
    lastName: 'Student',
    email: 'student@demo.com',
    role: 'STUDENT',
    isActive: true,
    emailVerified: true,
    bio: 'Passionate learner interested in web development and digital marketing.',
    profileImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    phoneNumber: '+1 (555) 123-4567',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2025-07-11T00:00:00Z'
  },
  'instructor@demo.com': {
    id: 2,
    username: 'instructor_demo',
    firstName: 'Sarah',
    lastName: 'Instructor',
    email: 'instructor@demo.com',
    role: 'INSTRUCTOR',
    isActive: true,
    emailVerified: true,
    bio: 'Experienced software engineer and educator with 10+ years in the industry.',
    profileImage: 'https://images.unsplash.com/photo-1494790108755-2616c5a27e73?w=150&h=150&fit=crop&crop=face',
    phoneNumber: '+1 (555) 987-6543',
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2025-07-11T00:00:00Z'
  },
  'admin@demo.com': {
    id: 3,
    username: 'admin_demo',
    firstName: 'Mike',
    lastName: 'Administrator',
    email: 'admin@demo.com',
    role: 'ADMIN',
    isActive: true,
    emailVerified: true,
    bio: 'Platform administrator managing the learning management system.',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    phoneNumber: '+1 (555) 555-0123',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2025-07-11T00:00:00Z'
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  useEffect(() => {
    const initAuth = async () => {
      // Check for stored user
      const storedUser = localStorage.getItem('mockUser');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error('Failed to parse stored user:', error);
          localStorage.removeItem('mockUser');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - check if user exists in our mock data
      const userData = mockUsers[email];
      if (userData && password === 'demo123') {
        setUser(userData);
        localStorage.setItem('mockUser', JSON.stringify(userData));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mockUser');
  };

  const refreshUser = async () => {
    // In mock mode, just return current user
    if (user) {
      const storedUser = localStorage.getItem('mockUser');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
