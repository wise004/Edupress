import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ArrowLeft, Check } from 'lucide-react'

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle password reset logic here
    console.log('Password reset requested for:', email)
    setIsSubmitted(true)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-secondary-900">Check your email</h2>
            <p className="mt-2 text-secondary-600">
              We've sent a password reset link to {email}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                  What's next?
                </h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary-600 text-sm font-medium">1</span>
                    </div>
                    <p className="text-secondary-700">Check your email inbox (and spam folder)</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary-600 text-sm font-medium">2</span>
                    </div>
                    <p className="text-secondary-700">Click the reset password link in the email</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-primary-600 text-sm font-medium">3</span>
                    </div>
                    <p className="text-secondary-700">Create a new password and sign in</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-secondary-200 pt-6">
                <p className="text-sm text-secondary-600 text-center mb-4">
                  Didn't receive the email? Check your spam folder or try again.
                </p>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="w-full btn btn-outline"
                >
                  Try different email
                </button>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center space-x-2">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to sign in</span>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-secondary-900">Forgot your password?</h2>
          <p className="mt-2 text-secondary-600">
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  placeholder="Enter your email address"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn btn-primary py-3"
            >
              Send reset link
            </button>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">Security tips</h3>
          <ul className="space-y-3">
            <li className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-secondary-700 text-sm">Use a strong, unique password for your account</span>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-secondary-700 text-sm">Don't share your password with others</span>
            </li>
            <li className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0"></div>
              <span className="text-secondary-700 text-sm">Log out from shared or public computers</span>
            </li>
          </ul>
        </div>

        <div className="text-center">
          <Link to="/login" className="text-primary-600 hover:text-primary-700 font-medium flex items-center justify-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to sign in</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage
