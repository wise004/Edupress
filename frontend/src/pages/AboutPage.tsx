import { Users, Target, Award, Heart, Play, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const AboutPage = () => {
  const { t } = useTranslation()
  
  const stats = [
    { number: '10+', label: t('yearsExperience') },
    { number: '50K+', label: t('studentsTaught') },
    { number: '1000+', label: t('coursesAvailable') },
    { number: '100+', label: t('expertInstructors') }
  ]

  const values = [
    {
      icon: Target,
      title: t('ourMission'),
      description: t('ourMissionDescription')
    },
    {
      icon: Award,
      title: t('excellence'),
      description: t('excellenceDescription')
    },
    {
      icon: Heart,
      title: t('studentFirst'),
      description: t('studentFirstDescription')
    },
    {
      icon: Users,
      title: t('communityValue'),
      description: t('communityValueDescription')
    }
  ]

  const team = [
    {
      name: 'Sarah Johnson',
      role: t('founderCEO'),
      image: 'https://images.unsplash.com/photo-1494790108755-2616c5a27e73?w=300&h=300&fit=crop&crop=face',
      bio: 'Former educator with 15+ years in online learning and curriculum development.'
    },
    {
      name: 'Michael Chen',
      role: t('cto'),
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      bio: 'Tech leader passionate about building scalable education platforms.'
    },
    {
      name: 'Emily Rodriguez',
      role: t('headOfContent'),
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      bio: 'Curriculum expert ensuring the highest quality of educational content.'
    },
    {
      name: 'David Wilson',
      role: t('headOfMarketing'),
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      bio: 'Marketing strategist focused on connecting learners with opportunities.'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold text-secondary-900 leading-tight">
                  {t('empoweringLearners')}
                  <span className="block text-primary-600">{t('aroundTheWorld')}</span>
                </h1>
                <p className="text-xl text-secondary-600 leading-relaxed">
                  {t('aboutDescription')}
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/courses" className="btn btn-primary inline-flex items-center space-x-2">
                  <span>{t('startLearning')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button className="btn btn-outline inline-flex items-center space-x-2">
                  <Play className="w-4 h-4" />
                  <span>{t('watchOurStory')}</span>
                </button>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Team collaboration"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-secondary-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              {t('ourCoreValues')}
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              {t('coreValuesDescription')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-3">{value.title}</h3>
                <p className="text-secondary-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              {t('meetOurTeam')}
            </h2>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              {t('teamDescription')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-48 h-48 rounded-full object-cover mx-auto group-hover:scale-105 transition-transform"
                  />
                </div>
                <h3 className="text-xl font-semibold text-secondary-900 mb-1">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-secondary-600 text-sm">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-secondary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold">{t('ourStory')}</h2>
              <div className="space-y-4 text-secondary-300">
                <p>
                  {t('storyParagraph1')}
                </p>
                <p>
                  {t('storyParagraph2')}
                </p>
                <p>
                  {t('storyParagraph3')}
                </p>
              </div>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Our journey"
                className="rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            {t('readyToStartJourney')}
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            {t('transformCareersDescription')}
          </p>
          <Link to="/courses" className="btn bg-white text-primary-600 hover:bg-primary-50">
            {t('browseCourses')}
          </Link>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
