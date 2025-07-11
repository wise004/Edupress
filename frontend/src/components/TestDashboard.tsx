import { useTranslation } from 'react-i18next';

const TestDashboard = () => {
  const { t } = useTranslation();
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test Dashboard</h1>
      <p>Translation test: {t('dashboardOverview')}</p>
      <p>Dashboard is working!</p>
    </div>
  );
};

export default TestDashboard;
