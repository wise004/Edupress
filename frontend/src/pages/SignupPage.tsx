import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Check } from 'lucide-react'

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [agreedToTerms, setAgreedToTerms] = useState(false)
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle signup logic here
    console.log('Signup attempt with:', formData)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const socialLogins = [
    {
      name: 'Google',
      color: 'bg-red-600 hover:bg-red-700'
    },
    {
      name: 'Facebook',
      color: 'bg-blue-600 hover:bg-blue-700'
    },
    {
      name: 'GitHub',
      color: 'bg-gray-800 hover:bg-gray-900'
    }
  ]

  const benefits = [
    'Access to 1000+ premium courses',
    'Learn from industry experts',
    'Earn verified certificates',
    'Download courses for offline learning',
    'Join exclusive community forums',
    '30-day money-back guarantee'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-secondary-900">Create your account</h2>
          <p className="mt-2 text-secondary-600">
            Join thousands of learners and start your journey today
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Signup Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Social Login Options */}
            <div className="space-y-3 mb-6">
              {socialLogins.map((social) => (
                <button
                  key={social.name}
                  className={`w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg text-white font-medium transition-colors ${social.color}`}
                >
                  Continue with {social.name}
                </button>
              ))}
            </div>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-secondary-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-secondary-500">Or sign up with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-2">
                    First name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      autoComplete="given-name"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="pl-10 w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                      placeholder="John"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700 mb-2">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    autoComplete="family-name"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="pl-10 w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-secondary-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 mb-2">
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-400 hover:text-secondary-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start">
                  <input
                    id="agree-terms"
                    name="agree-terms"
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded mt-1"
                  />
                  <label htmlFor="agree-terms" className="ml-3 text-sm text-secondary-700">
                    I agree to the{' '}
                    <Link to="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <div className="flex items-start">
                  <input
                    id="subscribe-newsletter"
                    name="subscribe-newsletter"
                    type="checkbox"
                    checked={subscribeNewsletter}
                    onChange={(e) => setSubscribeNewsletter(e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded mt-1"
                  />
                  <label htmlFor="subscribe-newsletter" className="ml-3 text-sm text-secondary-700">
                    Send me updates about new courses and learning resources
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={!agreedToTerms}
                className="w-full btn btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create account
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-secondary-600">
                Already have an account?{' '}
                <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          {/* Benefits */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-secondary-900 mb-4">What you'll get</h3>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-secondary-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-primary-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">Special Launch Offer</h3>
              <p className="text-primary-100 mb-4">
                Sign up today and get your first month of Pro access absolutely free. 
                No credit card required!
              </p>
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <div className="text-2xl font-bold">50% OFF</div>
                <div className="text-primary-100 text-sm">All premium courses</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Trusted by learners worldwide</h3>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary-600">50K+</div>
                  <div className="text-secondary-600 text-sm">Active Students</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">4.8★</div>
                  <div className="text-secondary-600 text-sm">Average Rating</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">1000+</div>
                  <div className="text-secondary-600 text-sm">Courses</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-600">100+</div>
                  <div className="text-secondary-600 text-sm">Expert Instructors</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
