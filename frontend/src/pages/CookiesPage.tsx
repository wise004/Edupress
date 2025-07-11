import { Cookie, Settings, BarChart3, Target, Shield, Eye, AlertCircle, CheckCircle, X } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const CookiesPage = () => {
  const { t } = useTranslation()

  const cookieTypes = [
    {
      icon: Shield,
      title: t('essentialCookies'),
      description: t('essentialCookiesDesc'),
      examples: [
        t('essentialCookie1'),
        t('essentialCookie2'),
        t('essentialCookie3'),
        t('essentialCookie4'),
        t('essentialCookie5')
      ],
      canDisable: false,
      color: 'green'
    },
    {
      icon: BarChart3,
      title: t('analyticalCookies'),
      description: t('analyticalCookiesDesc'),
      examples: [
        t('analyticalCookie1'),
        t('analyticalCookie2'),
        t('analyticalCookie3'),
        t('analyticalCookie4'),
        t('analyticalCookie5')
      ],
      canDisable: true,
      color: 'blue'
    },
    {
      icon: Settings,
      title: t('functionalCookies'),
      description: t('functionalCookiesDesc'),
      examples: [
        t('functionalCookie1'),
        t('functionalCookie2'),
        t('functionalCookie3'),
        t('functionalCookie4'),
        t('functionalCookie5')
      ],
      canDisable: true,
      color: 'purple'
    },
    {
      icon: Target,
      title: t('targetingCookies'),
      description: t('targetingCookiesDesc'),
      examples: [
        t('targetingCookie1'),
        t('targetingCookie2'),
        t('targetingCookie3'),
        t('targetingCookie4'),
        t('targetingCookie5')
      ],
      canDisable: true,
      color: 'orange'
    }
  ]

  const colorMap = {
    green: {
      bg: 'bg-green-50 dark:bg-green-900/20',
      border: 'border-green-200 dark:border-green-800',
      icon: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
      title: 'text-green-900 dark:text-green-300',
      text: 'text-green-800 dark:text-green-200'
    },
    blue: {
      bg: 'bg-blue-50 dark:bg-blue-900/20',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
      title: 'text-blue-900 dark:text-blue-300',
      text: 'text-blue-800 dark:text-blue-200'
    },
    purple: {
      bg: 'bg-purple-50 dark:bg-purple-900/20',
      border: 'border-purple-200 dark:border-purple-800',
      icon: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
      title: 'text-purple-900 dark:text-purple-300',
      text: 'text-purple-800 dark:text-purple-200'
    },
    orange: {
      bg: 'bg-orange-50 dark:bg-orange-900/20',
      border: 'border-orange-200 dark:border-orange-800',
      icon: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
      title: 'text-orange-900 dark:text-orange-300',
      text: 'text-orange-800 dark:text-orange-200'
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Cookie className="w-8 h-8 text-amber-600 dark:text-amber-400" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-secondary-900 dark:text-white mb-4">
            {t('cookieTitle')}
          </h1>
          <p className="text-xl text-secondary-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
            {t('cookieSubtitle')}
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
            {/* What are Cookies */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6 mb-12">
              <h2 className="text-xl font-semibold text-amber-900 dark:text-amber-300 mb-4 flex items-center">
                <Cookie className="w-6 h-6 mr-3" />
                {t('whatAreCookies')}
              </h2>
              <p className="text-amber-800 dark:text-amber-200 mb-4">
                {t('cookiesExplanation1')}
              </p>
              <p className="text-amber-800 dark:text-amber-200">
                {t('cookiesExplanation2')}
              </p>
            </div>

            {/* Cookie Types */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-8 text-center">
                {t('typesOfCookies')}
              </h2>
              <div className="grid gap-6">
                {cookieTypes.map((type, index) => {
                  const colors = colorMap[type.color as keyof typeof colorMap]
                  return (
                    <div key={index} className={`${colors.bg} ${colors.border} border rounded-xl p-6`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 ${colors.icon} rounded-lg flex items-center justify-center`}>
                            <type.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className={`text-lg font-semibold ${colors.title}`}>{type.title}</h3>
                            <p className={`text-sm ${colors.text}`}>{type.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {type.canDisable ? (
                            <div className="flex items-center space-x-1 text-sm text-green-600 dark:text-green-400">
                              <CheckCircle className="w-4 h-4" />
                              <span>Optional</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1 text-sm text-red-600 dark:text-red-400">
                              <X className="w-4 h-4" />
                              <span>Required</span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className={`${colors.text}`}>
                        <h4 className="font-medium mb-2">Examples:</h4>
                        <ul className="space-y-1">
                          {type.examples.map((example, exampleIndex) => (
                            <li key={exampleIndex} className="flex items-start space-x-2 text-sm">
                              <div className="w-1.5 h-1.5 bg-current rounded-full mt-2 flex-shrink-0"></div>
                              <span>{example}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Managing Cookies */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-300 mb-4 flex items-center">
                <Settings className="w-6 h-6 mr-3" />
                {t('managingCookies')}
              </h2>
              <div className="space-y-4 text-blue-800 dark:text-blue-200">
                <p>
                  You can control and manage cookies in several ways:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Browser Settings:</strong> Most browsers allow you to accept, decline, or delete cookies</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Cookie Preferences:</strong> Use our cookie preference center to customize your choices</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Account Settings:</strong> Manage personalization and tracking preferences in your account</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span><strong>Opt-out Tools:</strong> Use industry opt-out tools for advertising cookies</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Third Party Cookies */}
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-yellow-900 dark:text-yellow-300 mb-4 flex items-center">
                <Eye className="w-6 h-6 mr-3" />
                {t('thirdPartyCookies')}
              </h2>
              <div className="space-y-4 text-yellow-800 dark:text-yellow-200">
                <p>
                  We work with trusted third-party services that may set their own cookies:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Analytics & Performance</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Google Analytics</li>
                      <li>• Hotjar</li>
                      <li>• New Relic</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Payment & Security</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Stripe</li>
                      <li>• PayPal</li>
                      <li>• Cloudflare</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Social Media</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Facebook Pixel</li>
                      <li>• Twitter</li>
                      <li>• LinkedIn</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Support & Communication</h4>
                    <ul className="text-sm space-y-1">
                      <li>• Intercom</li>
                      <li>• Zendesk</li>
                      <li>• Mailchimp</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Cookie Consent */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold text-green-900 dark:text-green-300 mb-4">{t('cookieConsent')}</h2>
              <p className="text-green-800 dark:text-green-200 mb-4">
                When you first visit our website, we'll ask for your consent to use non-essential cookies. 
                You can change your preferences at any time by:
              </p>
              <div className="space-y-2 text-green-800 dark:text-green-200">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span>Clicking the "Cookie Preferences" link in our footer</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span>Visiting your account settings page</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span>Contacting our support team for assistance</span>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 mb-8">
              <h2 className="text-lg font-semibold text-red-900 dark:text-red-300 mb-3 flex items-center">
                <AlertCircle className="w-5 h-5 mr-2" />
                Important Notice
              </h2>
              <p className="text-red-800 dark:text-red-200">
                Please note that disabling certain cookies may affect the functionality of our website and your 
                learning experience. Essential cookies cannot be disabled as they are necessary for the basic 
                operation of our platform, including login, security, and course access.
              </p>
            </div>

            {/* Contact Information */}
            <div className="bg-secondary-50 dark:bg-gray-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">{t('contactInformation')}</h2>
              <p className="text-secondary-700 dark:text-gray-300 mb-4">
                If you have questions about our use of cookies or this Cookie Policy, please contact us:
              </p>
              <div className="space-y-2 text-secondary-700 dark:text-gray-300">
                <div><strong>Email:</strong> privacy@edupress.com</div>
                <div><strong>Support:</strong> support@edupress.com</div>
                <div><strong>Address:</strong> 123 Education Street, Learning City, LC 12345</div>
                <div className="mt-4">
                  <button className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                    Manage Cookie Preferences
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CookiesPage
