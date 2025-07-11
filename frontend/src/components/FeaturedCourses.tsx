import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import CourseCard from './CourseCard'
import type { Course } from '../types'

const FeaturedCourses = () => {
  // Mock data - in a real app, this would come from an API
  const featuredCourses: Course[] = [
    {
      id: '1',
      title: 'Complete React Developer Course',
      description: 'Learn React from scratch and build amazing web applications with modern React features including Hooks, Context API, and more.',
      instructor: 'John Smith',
      instructorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      duration: '12 hours',
      level: 'Intermediate',
      price: 89,
      originalPrice: 129,
      rating: 4.8,
      reviewCount: 2451,
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'Programming',
      lessons: 45,
      students: 12500,
      isPopular: true,
      isFeatured: true
    },
    {
      id: '2',
      title: 'UI/UX Design Masterclass',
      description: 'Master the principles of user interface and user experience design. Create stunning designs that users love.',
      instructor: 'Sarah Johnson',
      instructorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616c5a27e73?w=150&h=150&fit=crop&crop=face',
      duration: '8 hours',
      level: 'Beginner',
      price: 79,
      originalPrice: 99,
      rating: 4.9,
      reviewCount: 1876,
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'Design',
      lessons: 32,
      students: 8900,
      isPopular: false,
      isFeatured: true
    },
    {
      id: '3',
      title: 'Digital Marketing Strategy',
      description: 'Learn proven digital marketing strategies to grow your business online and reach your target audience effectively.',
      instructor: 'Mike Chen',
      instructorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      duration: '6 hours',
      level: 'Intermediate',
      price: 69,
      rating: 4.7,
      reviewCount: 956,
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'Marketing',
      lessons: 28,
      students: 5600,
      isPopular: true,
      isFeatured: true
    },
    {
      id: '4',
      title: 'Python Programming Bootcamp',
      description: 'Complete Python course from beginner to advanced. Build real-world projects and master Python programming.',
      instructor: 'David Wilson',
      instructorAvatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
      duration: '15 hours',
      level: 'Beginner',
      price: 99,
      originalPrice: 149,
      rating: 4.8,
      reviewCount: 3124,
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'Programming',
      lessons: 58,
      students: 15200,
      isPopular: false,
      isFeatured: true
    }
  ]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-secondary-900 mb-4">
              Featured Courses
            </h2>
            <p className="text-xl text-secondary-600 max-w-2xl">
              Hand-picked courses from our expert instructors to help you succeed
            </p>
          </div>
          
          <Link 
            to="/courses" 
            className="btn btn-outline inline-flex items-center space-x-2 group mt-6 md:mt-0"
          >
            <span>View All Courses</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <p className="text-secondary-600 mb-6">
            Ready to start learning? Join thousands of students already enrolled.
          </p>
          <Link to="/courses" className="btn btn-primary">
            Browse All Courses
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCourses
