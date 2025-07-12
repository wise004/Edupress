import { useState } from 'react'
import { 
  Camera, 
  Edit3, 
  Save, 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  BookOpen,
  Award,
  Clock,
  Star,
  ArrowLeft
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '../contexts/AuthContext'

interface UserProfile {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  bio: string
  location: string
  joinDate: string
  avatar: string
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'
  enrolledCourses: number
  completedCourses: number
  certificates: number
  totalLearningTime: string
}

const ProfilePage = () => {
  const { t } = useTranslation()
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    navigate('/login')
    return null
  }
  
  const [isEditing, setIsEditing] = useState(false)
  
  // Use authenticated user data or fallback to mock data
  const [profile, setProfile] = useState<UserProfile>({
    id: (user?.id ? String(user.id) : '1'),
    firstName: String(user?.firstName || 'John'),
    lastName: String(user?.lastName || 'Doe'),
    email: String(user?.email || 'john.doe@example.com'),
    phone: String(user?.phoneNumber || '+1 (555) 123-4567'),
    bio: String(user?.bio || 'Passionate learner interested in web development and digital marketing. Always eager to learn new technologies and improve my skills.'),
    location: 'New York, USA',
    joinDate: String(user?.createdAt || '2023-01-15'),
    avatar: String(user?.profileImage || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80'),
    role: user?.role || 'STUDENT',
    enrolledCourses: 12,
    completedCourses: 8,
    certificates: 5,
    totalLearningTime: '120 hours'
  })

  const [editForm, setEditForm] = useState(profile)

  const handleSave = () => {
    setProfile(editForm)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm(profile)
    setIsEditing(false)
  }

  const stats = [
    {
      icon: BookOpen,
      label: t('enrolledCourses'),
      value: profile.enrolledCourses,
      color: 'text-blue-600'
    },
    {
      icon: Award,
      label: t('completedCourses'),
      value: profile.completedCourses,
      color: 'text-green-600'
    },
    {
      icon: Star,
      label: t('certificates'),
      value: profile.certificates,
      color: 'text-yellow-600'
    },
    {
      icon: Clock,
      label: t('totalLearningTime'),
      value: profile.totalLearningTime,
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-16 sm:pt-20 pb-8 sm:pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 gap-4">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center text-blue-600 hover:text-blue-700 mr-4 sm:mr-6 text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('backToHome')}
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              {t('myProfile')}
            </h1>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base w-fit"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {t('editProfile')}
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-sm text-center">
              <div className="relative inline-block mb-4">
                <img
                  src={profile.avatar}
                  alt={`${profile.firstName} ${profile.lastName}`}
                  className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover"
                />
                {isEditing && (
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                    <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                )}
              </div>
              
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-1">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-blue-600 font-medium mb-4 text-sm sm:text-base">
                {t(profile.role.toLowerCase())}
              </p>
              
              <div className="space-y-3 text-left">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span className="text-xs sm:text-sm break-all">{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Phone className="w-4 h-4 mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{profile.phone}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-3 flex-shrink-0" />
                    <span className="text-xs sm:text-sm">{profile.location}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="w-4 h-4 mr-3 flex-shrink-0" />
                  <span className="text-xs sm:text-sm">
                    {t('memberSince')} {new Date(profile.joinDate).getFullYear()}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-3 sm:gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-3 sm:p-4 shadow-sm text-center">
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2 ${stat.color}`} />
                  <div className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 leading-tight">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 sm:p-6 shadow-sm">
              {isEditing ? (
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                      {t('editProfile')}
                    </h3>
                    <div className="flex space-x-2">
                      <button
                        onClick={handleCancel}
                        className="flex items-center px-3 sm:px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors text-sm sm:text-base"
                      >
                        <X className="w-4 h-4 mr-2" />
                        {t('cancel')}
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm sm:text-base"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {t('save')}
                      </button>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('firstName')}
                      </label>
                      <input
                        type="text"
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('lastName')}
                      </label>
                      <input
                        type="text"
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('email')}
                      </label>
                      <input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('phone')}
                      </label>
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('location')}
                      </label>
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors text-sm sm:text-base"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('bio')}
                      </label>
                      <textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                        rows={4}
                        className="w-full px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">
                    {t('profileDetails')}
                  </h3>

                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        {t('bio')}
                      </h4>
                      <p className="text-gray-900 dark:text-white leading-relaxed text-sm sm:text-base">
                        {profile.bio}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
                        {t('learningProgress')}
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {t('coursesCompleted')}
                          </span>
                          <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {profile.completedCourses} / {profile.enrolledCourses}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${(profile.completedCourses / profile.enrolledCourses) * 100}%` 
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
