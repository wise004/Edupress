import { Code, Palette, Camera, Briefcase, Heart, Calculator, Music, Beaker } from 'lucide-react'
import { Link } from 'react-router-dom'

const Categories = () => {
  const categories = [
    {
      id: 'programming',
      name: 'Programming',
      icon: Code,
      courseCount: 150,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      id: 'design',
      name: 'Design',
      icon: Palette,
      courseCount: 89,
      color: 'bg-pink-100 text-pink-600'
    },
    {
      id: 'photography',
      name: 'Photography',
      icon: Camera,
      courseCount: 67,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'business',
      name: 'Business',
      icon: Briefcase,
      courseCount: 123,
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'health',
      name: 'Health & Fitness',
      icon: Heart,
      courseCount: 45,
      color: 'bg-red-100 text-red-600'
    },
    {
      id: 'marketing',
      name: 'Marketing',
      icon: Calculator,
      courseCount: 78,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      id: 'music',
      name: 'Music',
      icon: Music,
      courseCount: 34,
      color: 'bg-indigo-100 text-indigo-600'
    },
    {
      id: 'science',
      name: 'Science',
      icon: Beaker,
      courseCount: 56,
      color: 'bg-teal-100 text-teal-600'
    }
  ]

  return (
    <section className="py-16 bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
            Explore Our Course Categories
          </h2>
          <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
            Discover your passion and expand your skills across diverse learning paths
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/courses?category=${category.id}`}
              className="group bg-white rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="text-center space-y-4">
                <div className={`w-16 h-16 rounded-full ${category.color} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-8 h-8" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900 mb-1">
                    {category.name}
                  </h3>
                  <p className="text-secondary-500 text-sm">
                    {category.courseCount} courses
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/courses" className="btn btn-outline">
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Categories
