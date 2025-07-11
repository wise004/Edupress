import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface DashboardContextType {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};

interface DashboardProviderProps {
  children: ReactNode;
}

export const DashboardProvider: React.FC<DashboardProviderProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const setSidebarOpen = (open: boolean) => {
    setIsSidebarOpen(open);
  };

  const value: DashboardContextType = {
    isSidebarOpen,
    toggleSidebar,
    setSidebarOpen,
    activeTab,
    setActiveTab,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};
