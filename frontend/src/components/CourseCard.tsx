import { Star, Clock, Users, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Course } from '../types'

interface CourseCardProps {
  course: Course;
  viewMode?: 'grid' | 'list';
}

const CourseCard = ({ course, viewMode = 'grid' }: CourseCardProps) => {
  if (viewMode === 'list') {
    return (
      <Link 
        to={`/course/${course.id}`}
        className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 flex"
      >
        {/* Course Image */}
        <div className="relative overflow-hidden w-80 flex-shrink-0">
          <img
            src={course.thumbnailImage || course.thumbnail || '/api/placeholder/320/180'}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Badge */}
          {(course.isFree || course.price === 0) && (
            <div className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              Bepul
            </div>
          )}
        </div>

        {/* Course Content */}
        <div className="p-6 flex-1">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                {course.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                {course.description}
              </p>
            </div>
            <div className="text-right ml-4">
              {(course.isFree || course.price === 0) ? (
                <span className="text-2xl font-bold text-green-600">Bepul</span>
              ) : (
                <div>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">${course.price}</span>
                  {course.originalPrice && course.originalPrice > course.price && (
                    <span className="text-sm text-gray-500 line-through ml-2">${course.originalPrice}</span>
                  )}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                <span>{typeof course.duration === 'number' ? Math.floor(course.duration / 60) : course.duration} soat</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{course.enrollmentCount || course.students || 0} talaba</span>
              </div>
              <div className="flex items-center">
                <BookOpen className="w-4 h-4 mr-1" />
                <span>{course.level}</span>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex items-center mr-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(course.averageRating || course.rating || 0)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {(course.averageRating || course.rating)?.toFixed(1) || '0.0'} ({course.totalRatings || course.reviewCount || 0})
              </span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Grid view (default)
  return (
    <Link 
      to={`/course/${course.id}`}
      className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden hover:-translate-y-1"
    >
      {/* Course Image */}
      <div className="relative overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badge */}
        {course.isPopular && (
          <div className="absolute top-3 left-3 bg-primary-600 text-white px-3 py-1 rounded-full text-xs font-medium">
            Popular
          </div>
        )}
        
        {/* Level Badge */}
        <div className="absolute top-3 right-3 bg-white text-secondary-700 px-3 py-1 rounded-full text-xs font-medium">
          {course.level}
        </div>
      </div>

      {/* Course Content */}
      <div className="p-6">
        {/* Category */}
        <div className="text-primary-600 text-sm font-medium mb-2">
          {course.category}
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-secondary-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>

        {/* Instructor */}
        <div className="flex items-center space-x-3 mb-4">
          <img
            src={course.instructorAvatar}
            alt={course.instructor}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-secondary-700 text-sm font-medium">
            {course.instructor}
          </span>
        </div>

        {/* Course Meta */}
        <div className="flex items-center justify-between text-xs text-secondary-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="w-3 h-3" />
              <span>{course.lessons} lessons</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="w-3 h-3" />
              <span>{course.students}</span>
            </div>
          </div>
        </div>

        {/* Rating and Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-current" />
              <span className="text-sm font-medium text-secondary-700">
                {course.rating}
              </span>
            </div>
            <span className="text-xs text-secondary-500">
              ({course.reviewCount})
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {course.originalPrice && (
              <span className="text-sm text-secondary-400 line-through">
                ${course.originalPrice}
              </span>
            )}
            <span className="text-lg font-bold text-primary-600">
              ${course.price}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CourseCard
