import { Mail, Phone, MapPin, Clock, Send, MessageSquare, HelpCircle, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'

const ContactPage = () => {
  const { t } = useTranslation()
  
  const contactInfo = [
    {
      icon: Mail,
      title: t('emailUs'),
      content: 'contact@edupress.com',
      description: t('emailDescription')
    },
    {
      icon: Phone,
      title: t('callUs'),
      content: '+1 (555) 123-4567',
      description: t('callDescription')
    },
    {
      icon: MapPin,
      title: t('visitUs'),
      content: '123 Education Street, Learning City, LC 12345',
      description: t('visitDescription')
    },
    {
      icon: Clock,
      title: t('officeHours'),
      content: t('officeHoursContent'),
      description: t('officeHoursDescription')
    }
  ]

  const supportOptions = [
    {
      icon: MessageSquare,
      title: t('liveChat'),
      description: t('liveChatDescription'),
      action: t('startChat')
    },
    {
      icon: HelpCircle,
      title: t('helpCenter'),
      description: t('helpCenterDescription'),
      action: t('visitHelpCenter')
    },
    {
      icon: Users,
      title: t('communityForum'),
      description: t('communityForumDescription'),
      action: t('joinCommunity')
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-secondary-900 dark:text-white mb-4">
            {t('getInTouch')}
          </h1>
          <p className="text-xl text-secondary-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('contactPageDescription')}
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border dark:border-gray-700">
                <h2 className="text-2xl font-bold text-secondary-900 dark:text-white mb-6">{t('sendMessage')}</h2>
                
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                        {t('firstName')}
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-secondary-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder={t('firstNamePlaceholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                        {t('lastName')}
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-secondary-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder={t('lastNamePlaceholder')}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                      {t('emailAddress')}
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-secondary-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder={t('emailPlaceholder')}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                      {t('subject')}
                    </label>
                    <select className="w-full px-4 py-3 border border-secondary-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                      <option>{t('generalInquiry')}</option>
                      <option>{t('courseSupport')}</option>
                      <option>{t('technicalIssue')}</option>
                      <option>{t('partnership')}</option>
                      <option>{t('billingQuestion')}</option>
                      <option>{t('other')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-secondary-700 dark:text-gray-300 mb-2">
                      {t('message')}
                    </label>
                    <textarea
                      rows={6}
                      className="w-full px-4 py-3 border border-secondary-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                      placeholder={t('messagePlaceholder')}
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-full inline-flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{t('sendMessageButton')}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-secondary-50 dark:bg-gray-800 rounded-2xl p-6 border dark:border-gray-700">
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-6">{t('contactInformation')}</h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <info.icon className="w-6 h-6 text-primary-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-secondary-900 dark:text-white mb-1">{info.title}</h4>
                        <p className="text-secondary-700 dark:text-gray-300 mb-1">{info.content}</p>
                        <p className="text-sm text-secondary-500 dark:text-gray-400">{info.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-primary-50 dark:bg-blue-900/20 rounded-2xl p-6 border dark:border-gray-700">
                <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-4">{t('needQuickHelp')}</h3>
                <p className="text-secondary-600 dark:text-gray-300 mb-6">
                  {t('selfServiceDescription')}
                </p>
                <div className="space-y-4">
                  {supportOptions.map((option, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-gray-700 rounded-lg border dark:border-gray-600">
                      <div className="flex items-center space-x-3">
                        <option.icon className="w-5 h-5 text-primary-600 dark:text-blue-400" />
                        <div>
                          <div className="font-medium text-secondary-900 dark:text-white">{option.title}</div>
                          <div className="text-sm text-secondary-500 dark:text-gray-400">{option.description}</div>
                        </div>
                      </div>
                      <button className="text-primary-600 dark:text-blue-400 hover:text-primary-700 dark:hover:text-blue-300 font-medium text-sm">
                        {option.action}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-secondary-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">{t('visitOurOffice')}</h2>
            <p className="text-xl text-secondary-600 dark:text-gray-300">
              {t('officeVisitDescription')}
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg border dark:border-gray-700">
            <div className="h-96 bg-secondary-200 dark:bg-gray-700 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-secondary-400 dark:text-gray-500 mx-auto mb-4" />
                <p className="text-secondary-600 dark:text-gray-300">{t('mapPlaceholder')}</p>
                <p className="text-sm text-secondary-500 dark:text-gray-400 mt-2">123 Education Street, Learning City, LC 12345</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 dark:text-white mb-4">{t('frequentlyAskedQuestionsContact')}</h2>
            <p className="text-xl text-secondary-600 dark:text-gray-300">
              {t('faqDescription')}
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: t('faqQuestion1'),
                answer: t('faqAnswer1')
              },
              {
                question: t('faqQuestion2'),
                answer: t('faqAnswer2')
              },
              {
                question: t('faqQuestion3'),
                answer: t('faqAnswer3')
              },
              {
                question: t('faqQuestion4'),
                answer: t('faqAnswer4')
              }
            ].map((faq, index) => (
              <div key={index} className="bg-secondary-50 dark:bg-gray-800 rounded-lg p-6 border dark:border-gray-700">
                <h3 className="font-semibold text-secondary-900 dark:text-white mb-3">{faq.question}</h3>
                <p className="text-secondary-600 dark:text-gray-300">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default ContactPage
