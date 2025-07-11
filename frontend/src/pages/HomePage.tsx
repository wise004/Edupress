import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Play, 
  Award, 
  Users, 
  Star, 
  ArrowRight, 
  Code,
  Palette,
  TrendingUp,
  Globe
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const HomePage = () => {
  const { t } = useTranslation();

  const stats = [
    { number: '50,000+', label: t('totalStudents') },
    { number: '1,000+', label: t('totalCourses') },
    { number: '100+', label: t('totalInstructors') },
    { number: '98%', label: t('successRate') }
  ];

  const categories = [
    {
      icon: Code,
      title: t('programming'),
      description: "Frontend, Backend, Mobile dasturlash",
      courseCount: 250,
      color: "bg-blue-500"
    },
    {
      icon: Palette,
      title: t('design'),
      description: "UI/UX, Grafik dizayn, 3D modeling",
      courseCount: 180,
      color: "bg-purple-500"
    },
    {
      icon: TrendingUp,
      title: t('marketing'),
      description: "SMM, SEO, Content marketing",
      courseCount: 120,
      color: "bg-green-500"
    },
    {
      icon: Globe,
      title: t('languages'),
      description: "Ingliz, Rus, Nemis tillari",
      courseCount: 95,
      color: "bg-orange-500"
    }
  ];

  const featuredCourses = [
    {
      id: 1,
      title: "JavaScript dan React.js gacha",
      instructor: "Abdulloh Qodirov",
      price: 299000,
      originalPrice: 399000,
      rating: 4.9,
      students: 2543,
      duration: "32 soat",
      level: "Boshlang'ich",
      image: "/api/placeholder/400/225",
      isBestseller: true
    },
    {
      id: 2,
      title: "Python bilan Backend dasturlash",
      instructor: "Muhammadali Yusupov",
      price: 0,
      rating: 4.8,
      students: 1876,
      duration: "28 soat",
      level: "O'rta",
      image: "/api/placeholder/400/225",
      isFree: true
    },
    {
      id: 3,
      title: "Figma da UI/UX dizayn",
      instructor: "Nigora Karimova",
      price: 199000,
      originalPrice: 299000,
      rating: 4.9,
      students: 987,
      duration: "24 soat",
      level: "Boshlang'ich",
      image: "/api/placeholder/400/225"
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: t('qualityEducation'),
      description: t('qualityEducationDesc')
    },
    {
      icon: Play,
      title: t('interactiveLessons'),
      description: t('interactiveLessonsDesc')
    },
    {
      icon: Award,
      title: t('certificate'),
      description: t('certificateDesc')
    },
    {
      icon: Users,
      title: t('community'),
      description: t('communityDesc')
    }
  ];

  // const testimonials = [
  //   {
  //     name: "Sarah Johnson",
  //     role: "Frontend Developer",
  //     content: "EduPress transformed my career. The courses are comprehensive and the instructors are amazing!",
  //     rating: 5,
  //     avatar: "SJ"
  //   },
  //   {
  //     name: "Michael Chen",
  //     role: "Data Scientist",
  //     content: "The platform is intuitive and the learning experience is top-notch. Highly recommended!",
  //     rating: 5,
  //     avatar: "MC"
  //   },
  //   {
  //     name: "Emily Rodriguez",
  //     role: "UX Designer",
  //     content: "I love how structured the courses are. Perfect for busy professionals like me.",
  //     rating: 5,
  //     avatar: "ER"
  //   }
  // ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-600 via-purple-700 to-indigo-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                {t('heroTitle')}
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                {t('heroSubtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/courses"
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 text-center"
                >
                  {t('viewCourses')}
                </Link>
                <Link
                  to="/about"
                  className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 text-center"
                >
                  {t('learnMore')}
                </Link>
              </div>
            </div>
            <div className="lg:text-right">
              <div className="inline-block bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-yellow-400">{stat.number}</div>
                      <div className="text-sm text-blue-100">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('popularCategories')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('findDirection')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <Link 
                key={index}
                to={`/courses?category=${category.title.toLowerCase()}`}
                className="group bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
              >
                <div className={`w-16 h-16 ${category.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <category.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{category.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{category.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{category.courseCount} {t('coursesCount')}</span>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-300" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t('featuredCourses')}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {t('qualityCourses')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course) => (
              <Link 
                key={course.id}
                to={`/course/${course.id}`}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-200 dark:border-gray-700"
              >
                <div className="relative">
                  <img 
                    src={course.image}
                    alt={course.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {course.isBestseller && (
                    <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Bestseller
                    </div>
                  )}
                  {course.isFree && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Bepul
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">{course.instructor}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{course.duration}</span>
                      <span>{course.level}</span>
                      <span>{course.students} talaba</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.floor(course.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{course.rating}</span>
                    </div>
                    
                    <div className="text-right">
                      {course.price === 0 ? (
                        <span className="text-xl font-bold text-green-600">Bepul</span>
                      ) : (
                        <div>
                          <span className="text-xl font-bold text-gray-900 dark:text-white">
                            {course.price.toLocaleString()} so'm
                          </span>
                          {course.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">
                              {course.originalPrice.toLocaleString()} so'm
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Link
              to="/courses"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors inline-flex items-center"
            >
              Barcha kurslar
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Nega aynan biz?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Biz bilan o'qish afzalliklari
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('startLearningToday')}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('professionalSkillsDesc')}
          </p>
          <Link
            to="/signup"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105 inline-block"
          >
            {t('freeRegistration')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
