import { Star, Users, BookOpen, Award, MapPin, Linkedin, Twitter, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const InstructorsPage = () => {
  const { t } = useTranslation()
  
  const instructors = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      title: t('seniorSoftwareEngineer'),
      company: 'Google',
      bio: 'Former Google engineer with 12+ years of experience in full-stack development. Passionate about teaching modern web technologies.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616c5a27e73?w=300&h=300&fit=crop&crop=face',
      rating: 4.9,
      students: 25600,
      courses: 8,
      expertise: ['React', 'Node.js', 'Python', 'AWS'],
      location: 'San Francisco, CA',
      social: {
        linkedin: '#',
        twitter: '#',
        website: '#'
      }
    },
    {
      id: '2',
      name: 'Michael Chen',
      title: t('uxDesignDirector'),
      company: 'Apple',
      bio: 'Award-winning designer with expertise in creating intuitive user experiences for mobile and web applications.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face',
      rating: 4.8,
      students: 18900,
      courses: 6,
      expertise: ['UI/UX Design', 'Figma', 'Sketch', 'Design Systems'],
      location: 'New York, NY',
      social: {
        linkedin: '#',
        twitter: '#',
        website: '#'
      }
    },
    {
      id: '3',
      name: 'Emily Rodriguez',
      title: t('digitalMarketingExpert'),
      company: 'Meta',
      bio: 'Marketing strategist who has helped hundreds of businesses grow their online presence through data-driven campaigns.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face',
      rating: 4.9,
      students: 32100,
      courses: 12,
      expertise: ['Digital Marketing', 'SEO', 'Social Media', 'Analytics'],
      location: 'Austin, TX',
      social: {
        linkedin: '#',
        twitter: '#',
        website: '#'
      }
    },
    {
      id: '4',
      name: 'David Wilson',
      title: t('dataScienceLead'),
      company: 'Microsoft',
      bio: 'PhD in Machine Learning with experience leading data science teams at Fortune 500 companies.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
      rating: 4.7,
      students: 15600,
      courses: 5,
      expertise: ['Python', 'Machine Learning', 'Statistics', 'TensorFlow'],
      location: 'Seattle, WA',
      social: {
        linkedin: '#',
        twitter: '#',
        website: '#'
      }
    },
    {
      id: '5',
      name: 'Lisa Zhang',
      title: t('businessStrategyConsultant'),
      company: 'McKinsey & Company',
      bio: 'Former McKinsey consultant specializing in digital transformation and business strategy for startups and enterprises.',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&h=300&fit=crop&crop=face',
      rating: 4.8,
      students: 21300,
      courses: 9,
      expertise: ['Business Strategy', 'Finance', 'Entrepreneurship', 'Leadership'],
      location: 'Boston, MA',
      social: {
        linkedin: '#',
        twitter: '#',
        website: '#'
      }
    },
    {
      id: '6',
      name: 'James Park',
      title: t('cloudSolutionsArchitect'),
      company: 'Amazon Web Services',
      bio: 'Cloud expert helping organizations migrate and optimize their infrastructure on AWS and other cloud platforms.',
      avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=300&h=300&fit=crop&crop=face',
      rating: 4.9,
      students: 19800,
      courses: 7,
      expertise: ['AWS', 'DevOps', 'Kubernetes', 'Cloud Security'],
      location: 'Portland, OR',
      social: {
        linkedin: '#',
        twitter: '#',
        website: '#'
      }
    }
  ]

  const stats = [
    { number: '100+', label: t('expertInstructors') },
    { number: '150K+', label: t('studentsTaught') },
    { number: '500+', label: t('coursesAvailable') },
    { number: '4.8', label: t('averageRating') }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-800 dark:to-gray-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-secondary-900 dark:text-white mb-4">
            {t('learnFromExperts')}
          </h1>
          <p className="text-xl text-secondary-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
            {t('expertsDescription')}
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 dark:text-blue-400 mb-2">{stat.number}</div>
                <div className="text-secondary-600 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instructors Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 dark:text-white mb-4">
              {t('meetOurInstructors')}
            </h2>
            <p className="text-xl text-secondary-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('worldClassProfessionals')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {instructors.map((instructor) => (
              <div key={instructor.id} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border dark:border-gray-700 overflow-hidden hover:shadow-xl transition-shadow group">
                {/* Instructor Image */}
                <div className="relative">
                  <img
                    src={instructor.avatar}
                    alt={instructor.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 rounded-full px-3 py-1 flex items-center space-x-1 border dark:border-gray-700">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{instructor.rating}</span>
                  </div>
                </div>

                {/* Instructor Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-semibold text-secondary-900 dark:text-white mb-1">
                      {instructor.name}
                    </h3>
                    <p className="text-primary-600 dark:text-blue-400 font-medium mb-1">{instructor.title}</p>
                    <p className="text-secondary-500 dark:text-gray-400 text-sm">{instructor.company}</p>
                  </div>

                  <p className="text-secondary-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
                    {instructor.bio}
                  </p>

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4 text-sm text-secondary-600 dark:text-gray-300">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{instructor.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{instructor.courses} {t('courses')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs">{instructor.location}</span>
                    </div>
                  </div>

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {instructor.expertise.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary-100 dark:bg-blue-900/20 text-primary-700 dark:text-blue-400 rounded-full text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {instructor.expertise.length > 3 && (
                      <span className="px-2 py-1 bg-secondary-100 dark:bg-gray-700 text-secondary-600 dark:text-gray-300 rounded-full text-xs">
                        +{instructor.expertise.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Social Links and View Profile */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <a href={instructor.social.linkedin} className="text-secondary-400 dark:text-gray-500 hover:text-primary-600 dark:hover:text-blue-400">
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <a href={instructor.social.twitter} className="text-secondary-400 hover:text-primary-600">
                        <Twitter className="w-4 h-4" />
                      </a>
                      <a href={instructor.social.website} className="text-secondary-400 hover:text-primary-600">
                        <Globe className="w-4 h-4" />
                      </a>
                    </div>
                    <Link
                      to={`/instructor/${instructor.id}`}
                      className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                    >
                      {t('viewProfile')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Become an Instructor CTA */}
      <section className="py-16 bg-secondary-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="w-16 h-16 text-primary-400 mx-auto mb-6" />
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            {t('shareYourExpertise')}
          </h2>
          <p className="text-xl text-secondary-300 mb-8">
            {t('instructorCTADescription')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn bg-primary-600 text-white hover:bg-primary-700">
              {t('becomeInstructor')}
            </button>
            <button className="btn btn-outline border-white text-white hover:bg-white hover:text-secondary-900">
              {t('learnMore')}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default InstructorsPage
