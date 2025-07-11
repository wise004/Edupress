import { FileText, Shield, CreditCard, Users, AlertTriangle, Scale } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const TermsPage = () => {
  const { t } = useTranslation()

  const sections = [
    {
      icon: FileText,
      title: t('acceptanceOfTerms'),
      content: [
        t('termsAcceptance1'),
        t('termsAcceptance2'),
        t('termsAcceptance3'),
        t('termsAcceptance4'),
        t('termsAcceptance5')
      ]
    },
    {
      icon: Users,
      title: t('userAccounts'),
      content: [
        t('userAccounts1'),
        t('userAccounts2'),
        t('userAccounts3'),
        t('userAccounts4'),
        t('userAccounts5')
      ]
    },
    {
      icon: Shield,
      title: t('acceptableUse'),
      content: [
        t('acceptableUse1'),
        t('acceptableUse2'),
        t('acceptableUse3'),
        t('acceptableUse4'),
        t('acceptableUse5')
      ]
    },
    {
      icon: CreditCard,
      title: t('paymentsAndRefunds'),
      content: [
        t('paymentsRefunds1'),
        t('paymentsRefunds2'),
        t('paymentsRefunds3'),
        t('paymentsRefunds4'),
        t('paymentsRefunds5')
      ]
    },
    {
      icon: FileText,
      title: t('intellectualProperty'),
      content: [
        t('intellectualProperty1'),
        t('intellectualProperty2'),
        t('intellectualProperty3'),
        t('intellectualProperty4'),
        t('intellectualProperty5')
      ]
    },
    {
      icon: AlertTriangle,
      title: t('disclaimersAndLimitations'),
      content: [
        t('disclaimers1'),
        t('disclaimers2'),
        t('disclaimers3'),
        t('disclaimers4'),
        t('disclaimers5')
      ]
    },
    {
      icon: Scale,
      title: t('termination'),
      content: [
        t('termination1'),
        t('termination2'),
        t('termination3'),
        t('termination4'),
        t('termination5')
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-secondary-900 dark:text-white mb-4">
            {t('termsTitle')}
          </h1>
          <p className="text-xl text-secondary-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            {t('termsSubtitle')}
          </p>
          <div className="text-sm text-secondary-500 dark:text-gray-400">
            {t('lastUpdated')}: June 30, 2025
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose max-w-none">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 mb-12">
              <h2 className="text-lg font-semibold text-yellow-900 dark:text-yellow-200 mb-3">{t('importantNotice')}</h2>
              <p className="text-yellow-800 dark:text-yellow-300">
                {t('termsNoticeText')}
              </p>
            </div>

            {sections.map((section, index) => (
              <div key={index} className="mb-12">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900 rounded-lg flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-600 dark:bg-primary-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-secondary-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-4">{t('governingLaw')}</h2>
              <p className="text-blue-800 dark:text-blue-300 mb-4">
                {t('governingLawText1')}
              </p>
              <p className="text-blue-800 dark:text-blue-300">
                {t('governingLawText2')}
              </p>
            </div>

            <div className="bg-secondary-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">{t('contactInformation')}</h2>
              <p className="text-secondary-700 dark:text-gray-300 mb-4">
                {t('termsContactText')}
              </p>
              <div className="space-y-2 text-secondary-700 dark:text-gray-300">
                <div>Email: legal@edupress.com</div>
                <div>Address: 123 Education Street, Learning City, LC 12345</div>
                <div>Phone: +1 (555) 123-4567</div>
              </div>
            </div>

            <div className="border-t border-secondary-200 dark:border-gray-700 pt-8">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">{t('changesToTerms')}</h2>
              <p className="text-secondary-700 dark:text-gray-300 mb-4">
                {t('changesTermsText')}
              </p>
              <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary-600 dark:bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{t('changesTerms1')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary-600 dark:bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{t('changesTerms2')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary-600 dark:bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{t('changesTerms3')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary-600 dark:bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{t('changesTerms4')}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TermsPage
