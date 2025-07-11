export interface Course {
  id: string | number
  title: string
  description: string
  instructor: string
  instructorAvatar: string
  duration: string | number
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  thumbnail: string
  thumbnailImage?: string
  category: string
  lessons: number
  students: number
  enrollmentCount?: number
  averageRating?: number
  totalRatings?: number
  isFree?: boolean
  isPopular?: boolean
  isFeatured?: boolean
}

export interface Category {
  id: string
  name: string
  icon: string
  courseCount: number
  color: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  avatar: string
  content: string
  rating: number
}

export interface Instructor {
  id: string
  name: string
  bio: string
  avatar: string
  expertise: string[]
  rating: number
  students: number
  courses: number
}
