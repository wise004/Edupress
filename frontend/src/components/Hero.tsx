import { ArrowRight, Play, Star, Users, BookOpen, Award } from 'lucide-react'
import { Link } from 'react-router-dom'

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-primary-50 to-secondary-50 py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                <Award className="w-4 h-4" />
                <span>Top-rated online learning platform</span>
              </div>
              
              <h1 className="text-4xl lg:text-6xl font-bold text-secondary-900 leading-tight">
                Learn New Skills
                <span className="block text-primary-600">Online with Expert</span>
              </h1>
              
              <p className="text-xl text-secondary-600 leading-relaxed">
                Discover thousands of courses from industry experts. Learn at your own pace with lifetime access on mobile and desktop.
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary-600" />
                <span className="text-secondary-700 font-medium">50k+ Students</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-primary-600" />
                <span className="text-secondary-700 font-medium">1000+ Courses</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="text-secondary-700 font-medium">4.8 Rating</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/courses" className="btn btn-primary inline-flex items-center space-x-2 group">
                <span>Explore Courses</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="btn btn-outline inline-flex items-center space-x-2 group">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-white fill-current" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Trusted by */}
            <div className="pt-8">
              <p className="text-sm text-secondary-500 mb-4">Trusted by teams at:</p>
              <div className="flex items-center space-x-8 opacity-60">
                <div className="text-lg font-bold text-secondary-700">Google</div>
                <div className="text-lg font-bold text-secondary-700">Microsoft</div>
                <div className="text-lg font-bold text-secondary-700">Apple</div>
                <div className="text-lg font-bold text-secondary-700">Meta</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1471&q=80"
                alt="Students learning online"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-4 -left-4 bg-white rounded-lg shadow-lg p-4 z-20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Star className="w-5 h-5 text-green-600 fill-current" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-secondary-900">4.8/5</div>
                  <div className="text-xs text-secondary-500">Course Rating</div>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -right-4 bg-white rounded-lg shadow-lg p-4 z-20">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-secondary-900">50k+</div>
                  <div className="text-xs text-secondary-500">Happy Students</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
