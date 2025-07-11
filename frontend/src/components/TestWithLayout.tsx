import DashboardLayout from '../components/DashboardLayout';
import { useTranslation } from 'react-i18next';

const TestWithLayout = () => {
  const { t } = useTranslation();
  
  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Test with DashboardLayout</h1>
        <p>Translation test: {t('dashboardOverview')}</p>
        <p>Layout is working!</p>
      </div>
    </DashboardLayout>
  );
};

export default TestWithLayout;
