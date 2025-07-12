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
        className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row"
      >
        {/* Course Image */}
        <div className="relative overflow-hidden w-full sm:w-80 flex-shrink-0 h-48 sm:h-auto">
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
        <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                  {course.description}
                </p>
              </div>
              <div className="text-left sm:text-right sm:ml-4 mb-4 sm:mb-0">
                {(course.isFree || course.price === 0) ? (
                  <span className="text-xl sm:text-2xl font-bold text-green-600">Bepul</span>
                ) : (
                  <div>
                    <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">${course.price}</span>
                    {course.originalPrice && course.originalPrice > course.price && (
                      <span className="text-sm text-gray-500 line-through ml-2">${course.originalPrice}</span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center flex-wrap gap-2 sm:gap-4 text-sm text-gray-500 dark:text-gray-400">
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
      className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg dark:shadow-gray-900/10 transition-all duration-300 overflow-hidden hover:-translate-y-1 border border-gray-200 dark:border-gray-700 w-full"
    >
      {/* Course Image */}
      <div className="relative overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-48 sm:h-52 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badge */}
        {course.isPopular && (
          <div className="absolute top-3 left-3 bg-blue-600 dark:bg-blue-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow-lg">
            Popular
          </div>
        )}
        
        {/* Level Badge */}
        <div className="absolute top-3 right-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-2 sm:px-3 py-1 rounded-full text-xs font-medium shadow-lg border border-gray-200 dark:border-gray-600">
          {course.level}
        </div>
      </div>

      {/* Course Content */}
      <div className="p-3 sm:p-4 lg:p-6">
        {/* Category */}
        <div className="text-blue-600 dark:text-blue-400 text-xs sm:text-sm font-medium mb-2">
          {course.category}
        </div>

        {/* Title */}
        <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
          {course.title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem]">
          {course.description}
        </p>

        {/* Instructor */}
        <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
          <img
            src={course.instructorAvatar}
            alt={course.instructor}
            className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600 flex-shrink-0"
          />
          <span className="text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-medium truncate">
            {course.instructor}
          </span>
        </div>

        {/* Course Meta */}
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 flex-wrap gap-1 sm:gap-2">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span className="whitespace-nowrap">{course.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <BookOpen className="w-3 h-3" />
              <span className="whitespace-nowrap">{course.lessons} lessons</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-xs">
            <Users className="w-3 h-3" />
            <span className="whitespace-nowrap">{course.students}</span>
          </div>
        </div>

        {/* Rating and Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 sm:space-x-2">
            <div className="flex items-center space-x-1">
              <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
              <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
                {course.rating}
              </span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({course.reviewCount})
            </span>
          </div>

          <div className="flex items-center space-x-1 sm:space-x-2">
            {course.originalPrice && (
              <span className="text-xs sm:text-sm text-gray-400 dark:text-gray-500 line-through">
                ${course.originalPrice}
              </span>
            )}
            <span className="text-sm sm:text-lg font-bold text-blue-600 dark:text-blue-400">
              ${course.price}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default CourseCard
