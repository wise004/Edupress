import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Calendar, Clock, Share2, Bookmark, ArrowLeft, Tag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BlogAPI } from '../services/api'
import type { BlogPost } from '../types/api'

const BlogPostPage = () => {
  const { id } = useParams()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadBlogPost()
  }, [id])

  const loadBlogPost = async () => {
    try {
      setLoading(true)
      
      if (id) {
        // Load blog post
        const postResponse = await BlogAPI.getPostById(id)
        setPost(postResponse.data)
        
        // Load related posts
        const relatedResponse = await BlogAPI.getRelatedPosts(id)
        setRelatedPosts(relatedResponse.data)
      } else {
        // Use demo data
        const demoPost: BlogPost = {
          id: '1',
          title: 'The Future of Online Learning: Trends to Watch in 2025',
          excerpt: 'Discover the latest trends shaping the future of education and how they will impact learners worldwide.',
          content: `
            <p>As we move into 2025, online learning continues to evolve at an unprecedented pace. From AI-powered personalization to immersive virtual reality experiences, the landscape of digital education is transforming rapidly.</p>
            <h2>AI-Powered Personalization</h2>
            <p>Artificial Intelligence is revolutionizing how we approach learning. Modern platforms now use sophisticated algorithms to analyze student behavior, learning patterns, and performance data to create personalized learning paths.</p>
            <h2>Virtual and Augmented Reality</h2>
            <p>VR and AR technologies are making abstract concepts tangible. Students can now walk through ancient Rome, manipulate 3D molecular structures, or practice surgical procedures in a risk-free virtual environment.</p>
            <h2>The Future is Bright</h2>
            <p>The future of online learning is incredibly promising with new technologies and innovative approaches to education.</p>
          `,
          author: { name: 'Sarah Johnson', email: 'sarah@example.com', id: '1' },
          readTime: '8 min read',
          tags: 'EdTech, Future, AI, VR, Online Learning',
          createdAt: '2025-06-25T00:00:00Z',
          updatedAt: '2025-06-25T00:00:00Z'
        }
        
        const demoRelated: BlogPost[] = [
          {
            id: '2',
            title: '10 Essential Skills Every Developer Should Learn in 2025',
            excerpt: 'Stay ahead in the tech industry with these crucial skills.',
            content: 'Essential development skills for modern developers.',
            author: { name: 'John Doe', email: 'john@example.com', id: '2' },
            readTime: '12 min read',
            tags: 'Development, Skills, Programming',
            createdAt: '2025-06-20T00:00:00Z',
            updatedAt: '2025-06-20T00:00:00Z'
          }
        ]
        
        setPost(demoPost)
        setRelatedPosts(demoRelated)
      }
    } catch (err) {
      setError('Failed to load blog post')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Blog Post Not Found</h2>
          <p className="text-gray-600">{error || 'The requested blog post could not be found.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <Link 
            to="/blog" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          
          <img
            className="w-full h-64 object-cover rounded-xl mb-8"
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
            alt={post.title}
          />
          
          <div className="flex items-center gap-4 mb-6">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
              Education Technology
            </span>
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              <span>June 25, 2025</span>
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              <span>{post.readTime}</span>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-6">{post.title}</h1>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img
                className="w-12 h-12 rounded-full mr-4"
                src="https://images.unsplash.com/photo-1494790108755-2616c5a27e73?w=150&h=150&fit=crop&crop=face"
                alt={post.author.name}
              />
              <div>
                <div className="font-semibold text-gray-900">{post.author.name}</div>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>June 25, 2025</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                <Bookmark className="w-4 h-4" />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm p-8">
          <div className="prose prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-8 pt-8 border-t">
            {post.tags && post.tags.split(',').map((tag, index) => (
              <Link
                key={index}
                to={`/blog/tag/${tag.trim().toLowerCase()}`}
                className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200"
              >
                <Tag className="w-3 h-3 mr-1" />
                {tag.trim()}
              </Link>
            ))}
          </div>
        </div>

        {/* Author Bio */}
        <div className="bg-white rounded-xl shadow-sm p-8 mt-8">
          <div className="flex items-start space-x-4">
            <img
              className="w-16 h-16 rounded-full"
              src="https://images.unsplash.com/photo-1494790108755-2616c5a27e73?w=150&h=150&fit=crop&crop=face"
              alt={post.author.name}
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                About {post.author.name}
              </h3>
              <p className="text-gray-600 mb-4">
                Sarah is an education technology expert with over 10 years of experience in online learning platforms.
              </p>
              <div className="flex space-x-4">
                <button className="text-blue-600 hover:text-blue-700 font-medium">
                  Follow
                </button>
                <button className="text-gray-600 hover:text-gray-700 font-medium">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.id}`}
                  className="group"
                >
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    <img
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      src="https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
                      alt={relatedPost.title}
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600">
                        {relatedPost.title}
                      </h3>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogPostPage
