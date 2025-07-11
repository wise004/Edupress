interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: 'blue' | 'green' | 'red' | 'yellow' | 'purple';
  className?: string;
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
};

const colorClasses = {
  blue: 'border-blue-600',
  green: 'border-green-600',
  red: 'border-red-600',
  yellow: 'border-yellow-600',
  purple: 'border-purple-600',
};

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'blue',
  className = '' 
}) => {
  return (
    <div 
      className={`animate-spin rounded-full border-b-2 ${sizeClasses[size]} ${colorClasses[color]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
      <LoadingSpinner size="xl" />
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
