import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Star, Clock, Users, BookOpen, Play, Share2, Heart, CreditCard, X } from 'lucide-react'
import PaymePayment from '../components/PaymePayment'
import StripePayment from '../components/StripePayment'
import { CourseAPI, UserAPI } from '../services/api'
import type { Course, User } from '../types/api'

const CoursePage = () => {
  const { id } = useParams()
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'payme' | 'stripe'>('payme')
  const [course, setCourse] = useState<Course | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  useEffect(() => {
    loadData()
  }, [id])

  const loadData = async () => {
    try {
      setLoading(true)
      
      // Load course data
      if (id) {
        const courseResponse = await CourseAPI.getCourseById(id)
        setCourse(courseResponse.data)
      }
      
      // Load current user data
      try {
        const userResponse = await UserAPI.getCurrentUser()
        setCurrentUser(userResponse.data)
      } catch (err) {
        // User not logged in, continue without user data
      }
      
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load course data')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
          <p className="text-gray-600">{error || 'The requested course could not be found.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-secondary-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="text-primary-400 text-sm font-medium">
                {course.category?.name || 'Course'}
              </div>
              
              <h1 className="text-4xl font-bold leading-tight">
                {course.title}
              </h1>
              
              <p className="text-xl text-secondary-300">
                {course.description}
              </p>

              {/* Course Meta */}
              <div className="flex flex-wrap items-center gap-6 text-sm">
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="font-medium">{course.averageRating || 0}</span>
                  <span className="text-secondary-400">({course.totalRatings || 0} reviews)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>{course.enrollmentCount || 0} students</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{Math.floor((course.duration || 0) / 60)} hours</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.lessons?.length || 0} lessons</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center space-x-4 pt-4">
                <img
                  src={course.instructor?.profileImage || `https://ui-avatars.com/api/?name=${course.instructor?.firstName}+${course.instructor?.lastName}&background=random`}
                  alt={`${course.instructor?.firstName} ${course.instructor?.lastName}`}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-medium">Created by {course.instructor?.firstName} {course.instructor?.lastName}</div>
                  <div className="text-secondary-400 text-sm">{course.instructor?.bio || 'Instructor'}</div>
                </div>
              </div>
            </div>

            {/* Course Preview Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg overflow-hidden shadow-lg sticky top-8">
                <div className="relative">
                  <img
                    src={course.thumbnailImage || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 hover:bg-opacity-40 transition-opacity">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-secondary-900 ml-1" />
                    </div>
                  </button>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      {course.originalPrice && (
                        <span className="text-lg text-secondary-500 line-through">
                          ${course.originalPrice}
                        </span>
                      )}
                      <span className="text-3xl font-bold text-secondary-900">
                        ${course.price}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button 
                      onClick={() => setShowPaymentModal(true)}
                      className="w-full btn btn-primary"
                    >
                      Enroll Now
                    </button>

                    <button className="w-full btn btn-outline">
                      Add to Wishlist
                    </button>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Level:</span>
                      <span className="font-medium">{course.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Duration:</span>
                      <span className="font-medium">{Math.floor((course.duration || 0) / 60)} hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Language:</span>
                      <span className="font-medium">{course.language}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-secondary-600">Last Updated:</span>
                      <span className="font-medium">{new Date(course.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-secondary-200">
                    <button className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <button className="flex items-center space-x-2 text-secondary-600 hover:text-primary-600">
                      <Heart className="w-4 h-4" />
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* Course Description */}
            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                About this course
              </h2>
              <div className="prose prose-lg text-secondary-700">
                <p>{course.description}</p>
                {course.whatYouWillLearn && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">What you'll learn</h3>
                    <div 
                      className="course-content" 
                      dangerouslySetInnerHTML={{ __html: course.whatYouWillLearn }}
                    />
                  </div>
                )}
              </div>
            </section>

            {/* Course Lessons */}
            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                Course content
              </h2>
              <div className="space-y-4">
                {course.lessons && course.lessons.length > 0 ? (
                  course.lessons.map((lesson) => (
                    <div key={lesson.id} className="border border-secondary-200 rounded-lg">
                      <div className="p-4 bg-secondary-50 border-b border-secondary-200">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-secondary-900">
                            {lesson.title}
                          </h3>
                          <span className="text-sm text-secondary-600">
                            {Math.floor((lesson.duration || 0) / 60)} min
                          </span>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center space-x-3">
                          <Play className="w-4 h-4 text-secondary-400" />
                          <span className="text-secondary-700">{lesson.description || 'Lesson content'}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-secondary-600">Course lessons will be available soon.</p>
                )}
              </div>
            </section>

            {/* Requirements */}
            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                Requirements
              </h2>
              <div className="prose max-w-none text-secondary-700">
                {course.requirements ? (
                  <div dangerouslySetInnerHTML={{ __html: course.requirements }} />
                ) : (
                  <p>No specific requirements for this course.</p>
                )}
              </div>
            </section>

            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">
                Additional Information
              </h2>
              <div className="prose max-w-none text-secondary-700">
                <p>Course Level: <strong>{course.level}</strong></p>
                <p>Language: <strong>{course.language}</strong></p>
                <p>Status: <strong>{course.status}</strong></p>
              </div>
            </section>
          </div>

          <div className="lg:col-span-1">
            {/* Course Info */}
            <section className="bg-secondary-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">
                Course Information
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-secondary-600">Level:</span>
                  <span className="font-medium">{course.level}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Category:</span>
                  <span className="font-medium">{course.category?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Lessons:</span>
                  <span className="font-medium">{course.lessons?.length || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-secondary-600">Students:</span>
                  <span className="font-medium">{course.enrollmentCount || 0}</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Choose Payment Method
              </h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {/* Payment Method Selection */}
              <div className="flex space-x-4 mb-6">
                <button
                  onClick={() => setSelectedPaymentMethod('payme')}
                  className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
                    selectedPaymentMethod === 'payme'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <CreditCard className="h-6 w-6 text-blue-600" />
                    <span className="font-semibold text-gray-900">Payme</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    Uzbekiston bank kartalari
                  </p>
                </button>

                <button
                  onClick={() => setSelectedPaymentMethod('stripe')}
                  className={`flex-1 p-4 border-2 rounded-lg transition-colors ${
                    selectedPaymentMethod === 'stripe'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <CreditCard className="h-6 w-6 text-indigo-600" />
                    <span className="font-semibold text-gray-900">Stripe</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    International cards
                  </p>
                </button>
              </div>

              {/* Payment Component */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  {selectedPaymentMethod === 'payme' ? (
                    <PaymePayment
                      courseId={course.id}
                      userId={currentUser?.id || 0}
                      amount={course.price}
                      courseName={course.title}
                      onSuccess={(data) => {
                        console.log('Payment successful:', data);
                        setShowPaymentModal(false);
                        // Handle successful payment
                        alert('To\'lov muvaffaqiyatli amalga oshirildi!');
                      }}
                      onError={(error) => {
                        console.error('Payment error:', error);
                        alert('To\'lovda xatolik: ' + error);
                      }}
                      onCancel={() => setShowPaymentModal(false)}
                    />
                  ) : (
                    <StripePayment
                      courseId={course.id}
                      amount={course.price}
                      courseName={course.title}
                      onSuccess={(data) => {
                        console.log('Payment successful:', data);
                        setShowPaymentModal(false);
                        // Handle successful payment
                        alert('Payment successful!');
                      }}
                      onError={(error) => {
                        console.error('Payment error:', error);
                        alert('Payment error: ' + error);
                      }}
                    />
                  )}
                </div>

                {/* Course Summary */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Order Summary
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <img
                        src={course.thumbnailImage || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                        alt={course.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium text-gray-900">{course.title}</h5>
                        <p className="text-sm text-gray-600">by {course.instructor?.firstName} {course.instructor?.lastName}</p>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Course Price:</span>
                        <span className="font-medium">${course.price}</span>
                      </div>
                      {course.originalPrice && (
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-gray-600">Original Price:</span>
                          <span className="text-gray-500 line-through">${course.originalPrice}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center text-lg font-semibold">
                        <span>Total:</span>
                        <span>${course.price}</span>
                      </div>
                    </div>

                    <div className="bg-blue-50 p-3 rounded text-sm text-blue-800">
                      <p>✓ Lifetime access to course content</p>
                      <p>✓ Certificate of completion</p>
                      <p>✓ 30-day money back guarantee</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CoursePage
