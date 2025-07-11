import { Calendar, Clock, ArrowRight, Search, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'

const BlogPage = () => {
  const featuredPost = {
    id: '1',
    title: 'The Future of Online Learning: Trends to Watch in 2025',
    excerpt: 'Discover the latest trends shaping the future of education and how they will impact learners worldwide.',
    content: 'As we move into 2025, online learning continues to evolve at an unprecedented pace. From AI-powered personalization to immersive virtual reality experiences...',
    author: 'Sarah Johnson',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108755-2616c5a27e73?w=150&h=150&fit=crop&crop=face',
    publishDate: '2025-06-25',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    category: 'Education Technology',
    tags: ['EdTech', 'Future', 'AI', 'VR']
  }

  const blogPosts = [
    {
      id: '2',
      title: '10 Essential Skills Every Developer Should Learn in 2025',
      excerpt: 'Stay ahead of the curve with these in-demand programming skills that will boost your career prospects.',
      author: 'Michael Chen',
      authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      publishDate: '2025-06-22',
      readTime: '12 min read',
      image: 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'Programming',
      tags: ['Development', 'Skills', 'Career']
    },
    {
      id: '3',
      title: 'Building a Successful Design Portfolio: Tips from Industry Experts',
      excerpt: 'Learn how to create a portfolio that stands out and lands you your dream design job.',
      author: 'Emily Rodriguez',
      authorAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      publishDate: '2025-06-20',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'Design',
      tags: ['Portfolio', 'Design', 'Career']
    },
    {
      id: '4',
      title: 'The Rise of Remote Work: How to Stay Productive While Learning',
      excerpt: 'Practical strategies for maintaining focus and productivity in a remote learning environment.',
      author: 'David Wilson',
      authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      publishDate: '2025-06-18',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'Productivity',
      tags: ['Remote Work', 'Productivity', 'Learning']
    },
    {
      id: '5',
      title: 'Data Science Bootcamp vs University Degree: Which Path is Right for You?',
      excerpt: 'Compare the pros and cons of different learning paths to find the best fit for your goals.',
      author: 'Lisa Zhang',
      authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=face',
      publishDate: '2025-06-15',
      readTime: '15 min read',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'Data Science',
      tags: ['Education', 'Career Change', 'Data Science']
    },
    {
      id: '6',
      title: 'Mastering Digital Marketing: A Beginner\'s Complete Guide',
      excerpt: 'Everything you need to know to start your journey in digital marketing, from SEO to social media.',
      author: 'James Park',
      authorAvatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
      publishDate: '2025-06-12',
      readTime: '18 min read',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      category: 'Marketing',
      tags: ['Digital Marketing', 'Beginner', 'SEO']
    }
  ]

  const categories = [
    { name: 'All Posts', count: 25 },
    { name: 'Programming', count: 8 },
    { name: 'Design', count: 6 },
    { name: 'Marketing', count: 5 },
    { name: 'Data Science', count: 4 },
    { name: 'Business', count: 2 }
  ]

  const popularTags = [
    'JavaScript', 'React', 'Python', 'UI/UX', 'Machine Learning', 
    'SEO', 'Career', 'Remote Work', 'Productivity', 'AI'
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-secondary-900 mb-4">
              Learning Insights & Resources
            </h1>
            <p className="text-xl text-secondary-600 max-w-3xl mx-auto">
              Stay updated with the latest trends, tips, and insights from the world of online education and technology
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                placeholder="Search articles, topics, or authors..."
                className="w-full pl-12 pr-4 py-4 bg-white border border-secondary-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none text-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Featured Post */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">Featured Article</h2>
              <article className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="md:flex">
                  <div className="md:w-1/2">
                    <img
                      src={featuredPost.image}
                      alt={featuredPost.title}
                      className="w-full h-64 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-8">
                    <div className="flex items-center space-x-4 mb-4">
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                        {featuredPost.category}
                      </span>
                      <div className="flex items-center space-x-2 text-secondary-500 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{featuredPost.readTime}</span>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-secondary-900 mb-4 hover:text-primary-600 transition-colors">
                      <Link to={`/blog/${featuredPost.id}`}>
                        {featuredPost.title}
                      </Link>
                    </h3>
                    
                    <p className="text-secondary-600 mb-6">
                      {featuredPost.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={featuredPost.authorAvatar}
                          alt={featuredPost.author}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium text-secondary-900">{featuredPost.author}</div>
                          <div className="text-sm text-secondary-500">{featuredPost.publishDate}</div>
                        </div>
                      </div>
                      
                      <Link
                        to={`/blog/${featuredPost.id}`}
                        className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium"
                      >
                        <span>Read More</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            </div>

            {/* Blog Posts Grid */}
            <div>
              <h2 className="text-2xl font-bold text-secondary-900 mb-6">Latest Articles</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {blogPosts.map((post) => (
                  <article key={post.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden">
                    <div className="relative">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="px-3 py-1 bg-white text-secondary-700 rounded-full text-sm font-medium">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-3 text-sm text-secondary-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{post.publishDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-semibold text-secondary-900 mb-3 hover:text-primary-600 transition-colors">
                        <Link to={`/blog/${post.id}`}>
                          {post.title}
                        </Link>
                      </h3>
                      
                      <p className="text-secondary-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <img
                            src={post.authorAvatar}
                            alt={post.author}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="text-sm font-medium text-secondary-700">{post.author}</span>
                        </div>
                        
                        <Link
                          to={`/blog/${post.id}`}
                          className="text-primary-600 hover:text-primary-700 font-medium text-sm"
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-12">
              <div className="flex items-center space-x-2">
                <button className="px-4 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50 text-secondary-600">
                  Previous
                </button>
                <button className="px-4 py-2 bg-primary-600 text-white rounded-lg">1</button>
                <button className="px-4 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50 text-secondary-600">2</button>
                <button className="px-4 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50 text-secondary-600">3</button>
                <button className="px-4 py-2 border border-secondary-300 rounded-lg hover:bg-secondary-50 text-secondary-600">
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Categories */}
            <div className="bg-secondary-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4">Categories</h3>
              <ul className="space-y-3">
                {categories.map((category, index) => (
                  <li key={index}>
                    <Link
                      to={`/blog/category/${category.name.toLowerCase().replace(' ', '-')}`}
                      className="flex items-center justify-between text-secondary-600 hover:text-primary-600 transition-colors"
                    >
                      <span>{category.name}</span>
                      <span className="text-sm bg-secondary-200 text-secondary-600 px-2 py-1 rounded-full">
                        {category.count}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Popular Tags */}
            <div className="bg-white border border-secondary-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-4 flex items-center space-x-2">
                <Tag className="w-5 h-5" />
                <span>Popular Tags</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {popularTags.map((tag, index) => (
                  <Link
                    key={index}
                    to={`/blog/tag/${tag.toLowerCase()}`}
                    className="px-3 py-1 bg-secondary-100 text-secondary-700 rounded-full text-sm hover:bg-primary-100 hover:text-primary-700 transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter Signup */}
            <div className="bg-primary-600 rounded-xl p-6 text-white">
              <h3 className="text-lg font-semibold mb-3">Stay Updated</h3>
              <p className="text-primary-100 mb-4 text-sm">
                Get the latest articles and learning resources delivered to your inbox weekly.
              </p>
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg bg-white text-secondary-900 placeholder-secondary-500 focus:outline-none focus:ring-2 focus:ring-primary-300"
                />
                <button className="w-full btn bg-white text-primary-600 hover:bg-primary-50">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogPage
