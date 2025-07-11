import { Star, Quote } from 'lucide-react'

const Testimonials = () => {
  const testimonials = [
    {
      id: '1',
      name: 'Emma Rodriguez',
      role: 'Software Developer',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616c5a27e73?w=150&h=150&fit=crop&crop=face',
      content: 'The courses here are incredibly well-structured and practical. I landed my dream job as a developer thanks to the skills I learned on this platform.',
      rating: 5
    },
    {
      id: '2',
      name: 'Alex Thompson',
      role: 'UI/UX Designer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
      content: 'As someone who was transitioning into design, these courses provided exactly what I needed. The instructors are top-notch and the community is amazing.',
      rating: 5
    },
    {
      id: '3',
      name: 'Maria Garcia',
      role: 'Digital Marketer',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
      content: 'I have taken many online courses, but none compare to the quality and depth of content here. Highly recommend to anyone looking to upskill.',
      rating: 5
    },
    {
      id: '4',
      name: 'James Wilson',
      role: 'Data Scientist',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
      content: 'The Python course completely changed my career trajectory. The hands-on projects and real-world applications made all the difference.',
      rating: 5
    }
  ]

  return (
    <section className="py-16 bg-secondary-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            What Our Students Say
          </h2>
          <p className="text-xl text-secondary-300 max-w-3xl mx-auto">
            Join thousands of successful students who have transformed their careers
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div 
              key={testimonial.id}
              className="bg-secondary-800 rounded-xl p-8 relative"
            >
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-20">
                <Quote className="w-8 h-8 text-white" />
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-1 mb-4">
                {[...Array(testimonial.rating)].map((_, index) => (
                  <Star key={index} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Content */}
              <p className="text-secondary-200 text-lg leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <div className="text-white font-semibold">
                    {testimonial.name}
                  </div>
                  <div className="text-secondary-400 text-sm">
                    {testimonial.role}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 pt-16 border-t border-secondary-700">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">4.8/5</div>
            <div className="text-secondary-300">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">50,000+</div>
            <div className="text-secondary-300">Happy Students</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-2">95%</div>
            <div className="text-secondary-300">Completion Rate</div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
