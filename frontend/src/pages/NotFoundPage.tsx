import { Home, Search, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  const suggestions = [
    { text: 'Browse All Courses', link: '/courses', icon: Search },
    { text: 'About EduPress', link: '/about', icon: Home },
    { text: 'Contact Support', link: '/contact', icon: Home },
    { text: 'Our Instructors', link: '/instructors', icon: Home }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-9xl font-bold text-primary-200 select-none">404</div>
          <div className="relative -mt-8">
            <div className="inline-block bg-white rounded-full p-6 shadow-lg">
              <Search className="w-16 h-16 text-primary-600" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-secondary-900 mb-4">
            Oops! Page not found
          </h1>
          <p className="text-xl text-secondary-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <p className="text-secondary-500">
            Don't worry, let's get you back on track with your learning journey.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-4 mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 btn btn-primary"
          >
            <Home className="w-4 h-4" />
            <span>Go to Homepage</span>
          </Link>
          
          <div className="flex justify-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
          </div>
        </div>

        {/* Suggestions */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-semibold text-secondary-900 mb-6">
            Explore these popular sections
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {suggestions.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="flex items-center space-x-3 p-4 rounded-lg border border-secondary-200 hover:border-primary-300 hover:bg-primary-50 transition-colors group"
              >
                <item.icon className="w-5 h-5 text-secondary-600 group-hover:text-primary-600" />
                <span className="font-medium text-secondary-700 group-hover:text-primary-700">
                  {item.text}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-sm text-secondary-500">
          <p>
            Still can't find what you're looking for?{' '}
            <Link to="/contact" className="text-primary-600 hover:text-primary-700 font-medium">
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
