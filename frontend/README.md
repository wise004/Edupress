# EduPress - Full-Stack Online Course Platform

A comprehensive, modern online course platform with a React TypeScript frontend and Spring Boot backend. This project provides a complete learning management system with beautiful design, REST APIs, authentication, and all essential features for students, instructors, and administrators.

## ✨ Features

### Frontend (React + TypeScript + Tailwind CSS)
- 🎨 **Modern Design**: Beautiful, responsive UI with Tailwind CSS design system
- ⚡ **Fast Performance**: Built with Vite for lightning-fast development and builds
- 🔍 **Course Discovery**: Browse courses by category, search, and filter functionality
- 📱 **Mobile Responsive**: Fully responsive design optimized for all devices
- 🎯 **TypeScript**: Type-safe development with comprehensive TypeScript support
- 🧭 **Navigation**: React Router for seamless page transitions
- 🎨 **Icons**: Lucide React icons for consistent iconography
- 🔐 **Authentication**: Complete login, signup, and password reset flows
- 🛒 **Shopping Cart**: Full e-commerce functionality for course purchases
- 📊 **Dashboard**: Student dashboard with progress tracking and certificates
- 👥 **User Profiles**: Instructor profiles with courses and reviews
- 📝 **Blog System**: Comprehensive blog with articles and categories
- 💳 **Pricing Plans**: Multiple subscription tiers with feature comparison
- 📱 **Legal Pages**: Privacy policy, terms of service, and compliance
- 🔍 **Search & Filters**: Advanced filtering and search capabilities

### Backend (Spring Boot + MySQL)
- 🚀 **REST APIs**: Comprehensive RESTful API for all operations
- 🔐 **JWT Security**: Secure authentication with JSON Web Tokens
- 👤 **User Management**: Registration, profiles, role-based access
- 📚 **Course Management**: CRUD operations for courses and lessons
- 🏷️ **Category System**: Organized course categorization
- ⭐ **Reviews & Ratings**: Course feedback and rating system
- 📝 **Blog CMS**: Content management for blog posts
- 📧 **Email Service**: Notification and verification emails
- 🗄️ **Database**: MySQL with JPA/Hibernate ORM
- 🔒 **Security**: BCrypt password encryption and CORS configuration

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS v3
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **HTTP Client**: Axios (ready for API integration)

### Backend
- **Framework**: Spring Boot 3.2.1
- **Language**: Java 21
- **Database**: MySQL (production), H2 (development)
- **Security**: Spring Security + JWT
- **ORM**: Spring Data JPA / Hibernate
- **Build Tool**: Maven

## 🔗 Navigation Routes

The application includes comprehensive routing for all pages:

- `/` - HomePage (Landing page)
- `/courses` - All courses with filters
- `/course/:id` - Individual course details
- `/instructors` - Browse instructors
- `/instructor/:id` - Instructor profile
- `/about` - About us page
- `/contact` - Contact form
- `/pricing` - Subscription plans
- `/blog` - Blog articles
- `/blog/:id` - Individual blog post
- `/login` - User authentication
- `/signup` - User registration
- `/forgot-password` - Password reset
- `/dashboard` - Student dashboard
- `/cart` - Shopping cart
- `/privacy` - Privacy policy
- `/terms` - Terms of service
- `*` - 404 Not Found page

## 🎨 Design System

- **Primary Colors**: Blue color palette (primary-50 to primary-950)
- **Secondary Colors**: Slate color palette (secondary-50 to secondary-950)  
- **Typography**: Inter font family
- **Components**: Custom button styles and utility classes

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header with auth links
│   ├── Hero.tsx        # Landing page hero section
│   ├── CourseCard.tsx  # Reusable course display component
│   ├── FeaturedCourses.tsx # Featured courses grid
│   ├── Categories.tsx  # Course category browsing
│   ├── Stats.tsx       # Platform statistics display
│   ├── Testimonials.tsx # Student reviews section
│   └── Footer.tsx      # Site footer with newsletter
├── pages/              # Page components
│   ├── HomePage.tsx    # Landing page (embedded in App.tsx)
│   ├── AllCoursesPage.tsx # Course browsing with filters
│   ├── CoursePage.tsx  # Individual course details
│   ├── AboutPage.tsx   # About us page
│   ├── ContactPage.tsx # Contact form and info
│   ├── InstructorsPage.tsx # Instructor listings
│   ├── InstructorDetailPage.tsx # Individual instructor profile
│   ├── PricingPage.tsx # Subscription plans
│   ├── BlogPage.tsx    # Blog article listings
│   ├── BlogPostPage.tsx # Individual blog post
│   ├── LoginPage.tsx   # User authentication
│   ├── SignupPage.tsx  # User registration
│   ├── ForgotPasswordPage.tsx # Password reset
│   ├── DashboardPage.tsx # Student dashboard
│   ├── CartPage.tsx    # Shopping cart
│   ├── PrivacyPage.tsx # Privacy policy
│   ├── TermsPage.tsx   # Terms of service
│   └── NotFoundPage.tsx # 404 error page
├── types/              # TypeScript type definitions
│   └── index.ts        # Course, User, and component types
└── App.tsx             # Main application with routing
```

## 🎨 Key Components

- **Header**: Navigation with search, cart, authentication, and responsive menu
- **Hero**: Landing page hero section with CTA buttons and value proposition
- **CourseCard**: Reusable course display component with ratings and pricing
- **FeaturedCourses**: Course listings with grid layout and filtering
- **Categories**: Course category browsing with icons and descriptions
- **Stats**: Platform statistics display with animated counters
- **Testimonials**: Student reviews and feedback carousel
- **Footer**: Site footer with links, newsletter signup, and social media

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📄 Pages

- **HomePage**: Main landing page with hero, stats, categories, featured courses, and testimonials
- **AllCoursesPage**: Course browsing with advanced filters, search, and grid/list views
- **CoursePage**: Individual course detail page with curriculum, instructor info, and enrollment
- **AboutPage**: About us page with mission, team, and company values
- **ContactPage**: Contact form with office locations and support information
- **InstructorsPage**: Browse all instructors with ratings and specializations
- **InstructorDetailPage**: Individual instructor profile with courses and reviews
- **PricingPage**: Subscription plans with feature comparison and FAQ
- **BlogPage**: Blog article listings with categories and search
- **BlogPostPage**: Individual blog post with comments and related articles
- **LoginPage**: User authentication with social login options
- **SignupPage**: User registration with benefits showcase
- **ForgotPasswordPage**: Password reset flow with email verification
- **DashboardPage**: Student dashboard with course progress, certificates, and stats
- **CartPage**: Shopping cart with checkout flow and recommendations
- **PrivacyPage**: Comprehensive privacy policy with clear sections
- **TermsPage**: Terms of service with legal information
- **NotFoundPage**: 404 error page with helpful navigation suggestions

## Future Enhancements

- User authentication and profiles
- Course enrollment and progress tracking
- Payment integration
- Video player for course content
- Interactive quizzes and assignments
- Instructor dashboard
- Real-time notifications
- Mobile app development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## 💳 Payment Integration

### Payme (Paycom) Integration
EduPress platformasida Payme to'lov tizimi to'liq integratsiya qilingan:

- ✅ **Merchant API Protocol** - Barcha kerakli methodlar implementatsiya qilingan
- ✅ **CheckPerformTransaction** - To'lov imkoniyatini tekshirish
- ✅ **CreateTransaction** - Idempotent tranzaksiya yaratish  
- ✅ **PerformTransaction** - To'lovni amalga oshirish va user enrollment
- ✅ **CancelTransaction** - To'lovni bekor qilish va cleanup
- ✅ **CheckTransaction** - Tranzaksiya holatini tekshirish
- ✅ **GetStatement** - Davr bo'yicha hisobot
- ✅ **Tax Detail Fields** - Soliq hisob-kitoblari uchun detail object
- ✅ **Real-time Notifications** - To'lov holati o'zgarishi haqida notifications
- ✅ **Security** - IP whitelist, authentication, va validation
- ✅ **Frontend Components** - Uzbek tilida to'lov interfeysi

Batafsil ma'lumot uchun: [PAYME_INTEGRATION.md](./PAYME_INTEGRATION.md)

### Stripe Integration
- Card payments for international users
- Secure payment processing
- Subscription management
- Webhooks for payment events
