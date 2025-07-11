import { Check, X, Star, Crown, Zap } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'

const PricingPage = () => {
  const { t } = useTranslation()
  const [isAnnual, setIsAnnual] = useState(false)

  const plans = [
    {
      name: t('freePlan'),
      description: t('perfectForGettingStarted'),
      price: { monthly: 0, annual: 0 },
      icon: Star,
      color: 'secondary',
      features: [
        { text: t('freeCoursesAccess'), included: true },
        { text: t('basicCommunityAccess'), included: true },
        { text: t('courseCompletionCertificates'), included: true },
        { text: t('mobileAppAccess'), included: true },
        { text: t('downloadOfflineViewing'), included: false },
        { text: t('prioritySupport'), included: false },
        { text: t('advancedAnalytics'), included: false },
        { text: t('customLearningPaths'), included: false }
      ],
      cta: t('getStartedFree'),
      popular: false
    },
    {
      name: t('proPlan'),
      description: t('bestForSeriousLearners'),
      price: { monthly: 29, annual: 24 },
      icon: Zap,
      color: 'primary',
      features: [
        { text: t('unlimitedCourseAccess'), included: true },
        { text: t('fullCommunityAccess'), included: true },
        { text: t('verifiedCertificates'), included: true },
        { text: t('mobileAppAccess'), included: true },
        { text: t('downloadOfflineViewing'), included: true },
        { text: t('priorityEmailSupport'), included: true },
        { text: t('basicAnalytics'), included: true },
        { text: t('customLearningPaths'), included: false }
      ],
      cta: t('startProTrial'),
      popular: true
    },
    {
      name: t('premiumPlan'),
      description: t('forProfessionalsAndTeams'),
      price: { monthly: 49, annual: 39 },
      icon: Crown,
      color: 'yellow',
      features: [
        { text: t('everythingInPro'), included: true },
        { text: t('oneOnOneMentoring'), included: true },
        { text: t('advancedCertificates'), included: true },
        { text: t('teamCollaboration'), included: true },
        { text: t('prioritySupportPhone'), included: true },
        { text: t('advancedAnalyticsInsights'), included: true },
        { text: t('customLearningPaths'), included: true },
        { text: t('apiAccess'), included: true }
      ],
      cta: t('goPremium'),
      popular: false
    }
  ]

  const faqs = [
    {
      question: t('canSwitchPlansAnytime'),
      answer: t('canSwitchPlansAnswer')
    },
    {
      question: t('isThereFreeTrial'),
      answer: t('freeTrialAnswer')
    },
    {
      question: t('whatPaymentMethods'),
      answer: t('paymentMethodsAnswer')
    },
    {
      question: t('canGetRefund'),
      answer: t('refundAnswer')
    },
    {
      question: t('studentDiscounts'),
      answer: t('studentDiscountsAnswer')
    },
    {
      question: t('teamEnterprisePlan'),
      answer: t('teamEnterprisePlanAnswer')
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-4">
            {t('chooseLearningPlan')}
          </h1>
          <p className="text-xl text-secondary-600 mb-8">
            {t('startLearningFree')}
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white rounded-full p-1 shadow-lg">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                !isAnnual 
                  ? 'bg-primary-600 text-white shadow-md' 
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              {t('monthly')}
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                isAnnual 
                  ? 'bg-primary-600 text-white shadow-md' 
                  : 'text-secondary-600 hover:text-secondary-900'
              }`}
            >
              {t('annual')}
              <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                {t('save20')}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow ${
                  plan.popular ? 'ring-2 ring-primary-500 scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-primary-600 text-white text-center py-2 text-sm font-medium">
                    {t('mostPopular')}
                  </div>
                )}

                <div className={`p-8 ${plan.popular ? 'pt-12' : ''}`}>
                  {/* Plan Header */}
                  <div className="text-center mb-8">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
                      plan.color === 'primary' ? 'bg-primary-100' :
                      plan.color === 'yellow' ? 'bg-yellow-100' : 'bg-secondary-100'
                    }`}>
                      <plan.icon className={`w-8 h-8 ${
                        plan.color === 'primary' ? 'text-primary-600' :
                        plan.color === 'yellow' ? 'text-yellow-600' : 'text-secondary-600'
                      }`} />
                    </div>
                    <h3 className="text-2xl font-bold text-secondary-900 mb-2">{plan.name}</h3>
                    <p className="text-secondary-600 mb-4">{plan.description}</p>
                    
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-secondary-900">
                        ${isAnnual ? plan.price.annual : plan.price.monthly}
                      </span>
                      {plan.price.monthly > 0 && (
                        <span className="text-secondary-500">
                          /{isAnnual ? 'month' : 'month'}
                        </span>
                      )}
                      {isAnnual && plan.price.monthly > 0 && (
                        <div className="text-sm text-secondary-500 mt-1">
                          Billed annually (${plan.price.annual * 12}/year)
                        </div>
                      )}
                    </div>

                    <button className={`w-full btn ${
                      plan.popular 
                        ? 'btn-primary' 
                        : plan.name === 'Premium'
                        ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                        : 'btn-outline'
                    }`}>
                      {plan.cta}
                    </button>
                  </div>

                  {/* Features List */}
                  <div className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        {feature.included ? (
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-secondary-300 flex-shrink-0" />
                        )}
                        <span className={feature.included ? 'text-secondary-700' : 'text-secondary-400'}>
                          {feature.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-secondary-900 mb-4">
            {t('needSomethingCustom')}
          </h2>
          <p className="text-xl text-secondary-600 mb-8">
            {t('enterpriseSolutions')}
          </p>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <h3 className="text-2xl font-semibold text-secondary-900 mb-4">{t('enterprisePlan')}</h3>
                <ul className="space-y-3 text-secondary-600">
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{t('customUserLimits')}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{t('dedicatedAccountManager')}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{t('ssoAdvancedSecurity')}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{t('customIntegrations')}</span>
                  </li>
                  <li className="flex items-center space-x-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{t('prioritySupport24_7')}</span>
                  </li>
                </ul>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-secondary-900 mb-4">{t('customPricing')}</div>
                <p className="text-secondary-600 mb-6">
                  {t('tailoredToYourNeeds')}
                </p>
                <button className="btn btn-primary">
                  {t('contactSales')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-secondary-900 mb-4">
              {t('frequentlyAskedQuestions')}
            </h2>
            <p className="text-xl text-secondary-600">
              {t('everythingAboutPricing')}
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-secondary-50 rounded-lg p-6">
                <h3 className="font-semibold text-secondary-900 mb-3">{faq.question}</h3>
                <p className="text-secondary-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            {t('readyToStartLearning')}
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            {t('joinThousandsStudents')}
          </p>
          <button className="btn bg-white text-primary-600 hover:bg-primary-50">
            {t('startYourFreeTrial')}
          </button>
        </div>
      </section>
    </div>
  )
}

export default PricingPage
