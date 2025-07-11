import { Shield, Eye, Database, Lock, Users, Globe, Clock, Baby, ArrowRight, FileText } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const PrivacyPage = () => {
  const { t } = useTranslation()

  const sections = [
    {
      icon: Database,
      title: t('informationCollection'),
      content: [
        t('privacyCollection1'),
        t('privacyCollection2'),
        t('privacyCollection3'),
        t('privacyCollection4'),
        t('privacyCollection5')
      ]
    },
    {
      icon: Eye,
      title: t('howWeUseInfo'),
      content: [
        t('privacyUse1'),
        t('privacyUse2'),
        t('privacyUse3'),
        t('privacyUse4'),
        t('privacyUse5')
      ]
    },
    {
      icon: Users,
      title: t('informationSharing'),
      content: [
        t('privacySharing1'),
        t('privacySharing2'),
        t('privacySharing3'),
        t('privacySharing4'),
        t('privacySharing5')
      ]
    },
    {
      icon: Lock,
      title: t('dataSecurity'),
      content: [
        t('privacySecurity1'),
        t('privacySecurity2'),
        t('privacySecurity3'),
        t('privacySecurity4'),
        t('privacySecurity5')
      ]
    },
    {
      icon: FileText,
      title: t('yourRights'),
      content: [
        t('privacyRights1'),
        t('privacyRights2'),
        t('privacyRights3'),
        t('privacyRights4'),
        t('privacyRights5')
      ]
    },
    {
      icon: Globe,
      title: t('cookiesAndTracking'),
      content: [
        t('privacyCookies1'),
        t('privacyCookies2'),
        t('privacyCookies3'),
        t('privacyCookies4'),
        t('privacyCookies5')
      ]
    },
    {
      icon: Clock,
      title: t('dataRetention'),
      content: [
        t('privacyRetention1'),
        t('privacyRetention2'),
        t('privacyRetention3'),
        t('privacyRetention4'),
        t('privacyRetention5')
      ]
    },
    {
      icon: Baby,
      title: t('childrensPrivacy'),
      content: [
        t('privacyChildren1'),
        t('privacyChildren2'),
        t('privacyChildren3'),
        t('privacyChildren4'),
        t('privacyChildren5')
      ]
    },
    {
      icon: ArrowRight,
      title: t('internationalTransfers'),
      content: [
        t('privacyTransfers1'),
        t('privacyTransfers2'),
        t('privacyTransfers3'),
        t('privacyTransfers4'),
        t('privacyTransfers5')
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-secondary-900 dark:text-white mb-4">
            {t('privacyTitle')}
          </h1>
          <p className="text-xl text-secondary-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            {t('privacySubtitle')}
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
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-12">
              <h2 className="text-lg font-semibold text-blue-900 dark:text-blue-300 mb-3">{t('importantNotice')}</h2>
              <p className="text-blue-800 dark:text-blue-200">
                {t('privacyNoticeText')}
              </p>
            </div>

            {sections.map((section, index) => (
              <div key={index} className="mb-12">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                    <section.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold text-secondary-900 dark:text-white">{section.title}</h2>
                </div>
                <ul className="space-y-3">
                  {section.content.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-secondary-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-green-900 dark:text-green-300 mb-4">{t('contactInformation')}</h2>
              <p className="text-green-800 dark:text-green-200 mb-4">
                {t('privacyContactText')}
              </p>
              <div className="space-y-2 text-green-800 dark:text-green-200">
                <div><strong>Privacy Officer:</strong> privacy@edupress.com</div>
                <div><strong>Data Protection:</strong> dpo@edupress.com</div>
                <div><strong>General Contact:</strong> support@edupress.com</div>
                <div><strong>Address:</strong> 123 Education Street, Learning City, LC 12345</div>
              </div>
            </div>

            <div className="border-t border-secondary-200 dark:border-gray-700 pt-8">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">{t('privacyUpdates')}</h2>
              <p className="text-secondary-700 dark:text-gray-300 mb-4">
                {t('privacyUpdatesText')}
              </p>
              <ul className="space-y-2 text-secondary-700 dark:text-gray-300">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary-600 dark:bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{t('privacyUpdates1')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary-600 dark:bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{t('privacyUpdates2')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary-600 dark:bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{t('privacyUpdates3')}</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary-600 dark:bg-gray-400 rounded-full mt-2 flex-shrink-0"></div>
                  <span>{t('privacyUpdates4')}</span>
                </li>
              </ul>
            </div>

            <div className="bg-secondary-50 dark:bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">Quick Links</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-secondary-700 dark:text-gray-300">
                <div>
                  <h3 className="font-semibold mb-2">Your Rights</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Account Settings</li>
                    <li>• Data Export</li>
                    <li>• Delete Account</li>
                    <li>• Communication Preferences</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Related Policies</h3>
                  <ul className="space-y-1 text-sm">
                    <li>• Terms of Service</li>
                    <li>• Cookie Policy</li>
                    <li>• Community Guidelines</li>
                    <li>• Instructor Agreement</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PrivacyPage
