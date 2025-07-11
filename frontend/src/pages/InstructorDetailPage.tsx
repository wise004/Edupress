// import { useParams } from 'react-router-dom' // For future use
import { Star, Users, BookOpen, MapPin, Linkedin, Twitter, Globe, Award, Clock } from 'lucide-react'
import { Link } from 'react-router-dom'

const InstructorDetailPage = () => {
  // const { id } = useParams() // Can be used later for fetching instructor data

  // Mock instructor data - in real app, fetch based on id
  const instructor = {
    id: '1',
    name: 'Dr. Sarah Johnson',
    title: 'Senior Software Engineer',
    company: 'Google',
    bio: 'Former Google engineer with 12+ years of experience in full-stack development. Passionate about teaching modern web technologies and helping students build real-world applications. Sarah has worked on major projects including Google Search infrastructure and has mentored over 100 developers throughout her career.',
    longBio: 'Dr. Sarah Johnson is a seasoned software engineer with over 12 years of experience in the tech industry. She started her career at a startup where she developed her passion for full-stack development, eventually leading her to join Google where she currently works as a Senior Software Engineer on the Search infrastructure team.\n\nSarah holds a PhD in Computer Science from Stanford University and has published numerous papers on distributed systems and web architecture. Her expertise spans across modern web technologies including React, Node.js, Python, and cloud platforms like AWS and Google Cloud.\n\nWhat sets Sarah apart as an instructor is her ability to break down complex concepts into digestible lessons. She believes that anyone can learn to code with the right guidance and practical approach. Her courses focus on building real-world applications while teaching fundamental programming principles.',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616c5a27e73?w=400&h=400&fit=crop&crop=face',
    rating: 4.9,
    students: 25600,
    courses: 8,
    totalHours: 120,
    expertise: ['React', 'Node.js', 'Python', 'AWS', 'JavaScript', 'TypeScript', 'MongoDB', 'PostgreSQL'],
    location: 'San Francisco, CA',
    experience: '12+ years',
    education: 'PhD Computer Science, Stanford University',
    social: {
      linkedin: '#',
      twitter: '#',
      website: '#'
    },
    achievements: [
      'Google Cloud Certified Professional',
      'AWS Solutions Architect',
      'Published 15+ research papers',
      'Speaker at 20+ tech conferences',
      'Mentor to 100+ developers'
    ]
  }

  const courses = [
    {
      id: '1',
      title: 'Complete React Developer Course',
      description: 'Learn React from scratch and build amazing web applications',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.8,
      students: 12500,
      duration: '12 hours',
      price: 89,
      level: 'Intermediate'
    },
    {
      id: '2',
      title: 'Advanced JavaScript Concepts',
      description: 'Master advanced JavaScript patterns and best practices',
      thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.9,
      students: 8900,
      duration: '8 hours',
      price: 79,
      level: 'Advanced'
    },
    {
      id: '3',
      title: 'Full-Stack Development with Node.js',
      description: 'Build complete web applications with Node.js and Express',
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      rating: 4.7,
      students: 6700,
      duration: '15 hours',
      price: 99,
      level: 'Intermediate'
    }
  ]

  const reviews = [
    {
      id: '1',
      studentName: 'Alex Thompson',
      studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      comment: 'Sarah is an exceptional instructor! Her React course helped me land my first developer job. The projects were practical and the explanations were crystal clear.',
      course: 'Complete React Developer Course',
      date: '2025-06-20'
    },
    {
      id: '2',
      studentName: 'Maria Garcia',
      studentAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      comment: 'The JavaScript course exceeded my expectations. Sarah explains complex concepts in a way that\'s easy to understand. Highly recommended!',
      course: 'Advanced JavaScript Concepts',
      date: '2025-06-15'
    },
    {
      id: '3',
      studentName: 'John Davis',
      studentAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      rating: 5,
      comment: 'Best investment I\'ve made in my career. The Node.js course is comprehensive and up-to-date with industry standards.',
      course: 'Full-Stack Development with Node.js',
      date: '2025-06-10'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Instructor Info */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-start space-x-6">
                <img
                  src={instructor.avatar}
                  alt={instructor.name}
                  className="w-32 h-32 rounded-2xl object-cover shadow-lg"
                />
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-secondary-900 mb-2">
                    {instructor.name}
                  </h1>
                  <p className="text-xl text-primary-600 font-medium mb-2">
                    {instructor.title}
                  </p>
                  <p className="text-secondary-600 mb-4">{instructor.company}</p>
                  
                  <div className="flex items-center space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{instructor.rating}</span>
                      <span className="text-secondary-500">Instructor Rating</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-secondary-600" />
                      <span>{instructor.students.toLocaleString()} Students</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-secondary-600" />
                      <span>{instructor.courses} Courses</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-primary-600">{instructor.totalHours}+</div>
                  <div className="text-secondary-600 text-sm">Hours of Content</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-primary-600">{instructor.experience}</div>
                  <div className="text-secondary-600 text-sm">Experience</div>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-sm">
                  <div className="text-2xl font-bold text-primary-600">PhD</div>
                  <div className="text-secondary-600 text-sm">Education Level</div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-secondary-900 mb-4">About</h2>
                <div className="space-y-4 text-secondary-700">
                  {instructor.longBio.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Info */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-secondary-400" />
                    <span className="text-secondary-700">{instructor.location}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-secondary-400" />
                    <span className="text-secondary-700">{instructor.education}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mt-6 pt-6 border-t border-secondary-200">
                  <a href={instructor.social.linkedin} className="text-secondary-400 hover:text-primary-600">
                    <Linkedin className="w-5 h-5" />
                  </a>
                  <a href={instructor.social.twitter} className="text-secondary-400 hover:text-primary-600">
                    <Twitter className="w-5 h-5" />
                  </a>
                  <a href={instructor.social.website} className="text-secondary-400 hover:text-primary-600">
                    <Globe className="w-5 h-5" />
                  </a>
                </div>
              </div>

              {/* Expertise */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {instructor.expertise.map((skill, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Achievements */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-secondary-900 mb-4">Achievements</h3>
                <ul className="space-y-2">
                  {instructor.achievements.map((achievement, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <Award className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
                      <span className="text-secondary-700 text-sm">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-secondary-900">Courses by {instructor.name}</h2>
            <Link to="/courses" className="text-primary-600 hover:text-primary-700 font-medium">
              View All Courses
            </Link>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <Link
                key={course.id}
                to={`/course/${course.id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden group"
              >
                <div className="relative">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 text-sm font-medium">
                    {course.level}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2 group-hover:text-primary-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-secondary-600 mb-4 text-sm">{course.description}</p>

                  <div className="flex items-center justify-between text-sm text-secondary-500 mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="w-4 h-4" />
                        <span>{course.students.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="font-medium">{course.rating}</span>
                    </div>
                    <span className="text-xl font-bold text-primary-600">${course.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-secondary-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-secondary-900 mb-8">Student Reviews</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={review.studentAvatar}
                    alt={review.studentName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="font-semibold text-secondary-900">{review.studentName}</div>
                    <div className="text-sm text-secondary-500">{review.date}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(review.rating)].map((_, index) => (
                    <Star key={index} className="w-4 h-4 text-yellow-400 fill-current" />
                  ))}
                </div>

                <p className="text-secondary-700 mb-3">{review.comment}</p>
                <div className="text-sm text-primary-600 font-medium">{review.course}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

export default InstructorDetailPage
