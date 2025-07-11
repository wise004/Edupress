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
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Header from '../components/Header'
import Footer from '../components/Footer'

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
  const [isEditing, setIsEditing] = useState(false)
  
  const [profile, setProfile] = useState<UserProfile>({
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate learner interested in web development and digital marketing. Always eager to learn new technologies and improve my skills.',
    location: 'New York, USA',
    joinDate: '2023-01-15',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&q=80',
    role: 'STUDENT',
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="pt-20 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center text-blue-600 hover:text-blue-700 mr-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                {t('backToHome')}
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t('myProfile')}
              </h1>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {t('editProfile')}
              </button>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm text-center">
                <div className="relative inline-block mb-4">
                  <img
                    src={profile.avatar}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="w-32 h-32 rounded-full object-cover"
                  />
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                      <Camera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-blue-600 font-medium mb-4">
                  {t(profile.role.toLowerCase())}
                </p>
                
                <div className="space-y-3 text-left">
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Mail className="w-4 h-4 mr-3" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  {profile.phone && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Phone className="w-4 h-4 mr-3" />
                      <span className="text-sm">{profile.phone}</span>
                    </div>
                  )}
                  {profile.location && (
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <MapPin className="w-4 h-4 mr-3" />
                      <span className="text-sm">{profile.location}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-3" />
                    <span className="text-sm">
                      {t('memberSince')} {new Date(profile.joinDate).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                {stats.map((stat, index) => (
                  <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm text-center">
                    <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                {isEditing ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {t('editProfile')}
                      </h3>
                      <div className="flex space-x-2">
                        <button
                          onClick={handleSave}
                          className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {t('save')}
                        </button>
                        <button
                          onClick={handleCancel}
                          className="flex items-center bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                        >
                          <X className="w-4 h-4 mr-2" />
                          {t('cancel')}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('firstName')}
                          </label>
                          <input
                            type="text"
                            value={editForm.firstName}
                            onChange={(e) => setEditForm({...editForm, firstName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('lastName')}
                          </label>
                          <input
                            type="text"
                            value={editForm.lastName}
                            onChange={(e) => setEditForm({...editForm, lastName: e.target.value})}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('email')}
                        </label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('phone')}
                        </label>
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('location')}
                        </label>
                        <input
                          type="text"
                          value={editForm.location}
                          onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t('bio')}
                        </label>
                        <textarea
                          value={editForm.bio}
                          onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                      {t('aboutMe')}
                    </h3>
                    <div className="space-y-6">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                          {t('bio')}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {profile.bio}
                        </p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            {t('contactInformation')}
                          </h4>
                          <div className="space-y-2">
                            <div className="flex items-center text-gray-600 dark:text-gray-400">
                              <Mail className="w-4 h-4 mr-3" />
                              <span>{profile.email}</span>
                            </div>
                            {profile.phone && (
                              <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <Phone className="w-4 h-4 mr-3" />
                                <span>{profile.phone}</span>
                              </div>
                            )}
                            {profile.location && (
                              <div className="flex items-center text-gray-600 dark:text-gray-400">
                                <MapPin className="w-4 h-4 mr-3" />
                                <span>{profile.location}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                            {t('learningProgress')}
                          </h4>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">
                                {t('completionRate')}
                              </span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {Math.round((profile.completedCourses / profile.enrolledCourses) * 100)}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ 
                                  width: `${(profile.completedCourses / profile.enrolledCourses) * 100}%` 
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}

export default ProfilePage
