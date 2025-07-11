import { Users, BookOpen, Award, Globe } from 'lucide-react'

const Stats = () => {
  const stats = [
    {
      icon: Users,
      number: '50,000+',
      label: 'Active Students',
      description: 'Learning from our courses'
    },
    {
      icon: BookOpen,
      number: '1,000+',
      label: 'Online Courses',
      description: 'Across various disciplines'
    },
    {
      icon: Award,
      number: '100+',
      label: 'Expert Instructors',
      description: 'Industry professionals'
    },
    {
      icon: Globe,
      number: '150+',
      label: 'Countries Reached',
      description: 'Global learning community'
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
            Trusted by thousands of students worldwide
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Join our global community of learners and start your journey to success today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="relative mb-6">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto group-hover:bg-primary-600 transition-colors duration-300">
                  <stat.icon className="w-8 h-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="text-4xl font-bold text-secondary-900">{stat.number}</div>
                <div className="text-lg font-semibold text-secondary-700">{stat.label}</div>
                <div className="text-secondary-500">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Stats
