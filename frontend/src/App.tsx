import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { DashboardProvider } from './contexts/DashboardContext'
import LoadingSpinner from './components/LoadingSpinner'
import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/Header'
import Footer from './components/Footer'

// Lazy load components for better performance
const HomePage = lazy(() => import('./pages/HomePage'))
const CoursePage = lazy(() => import('./pages/CoursePage'))
const AllCoursesPage = lazy(() => import('./pages/AllCoursesPage'))
const AboutPage = lazy(() => import('./pages/AboutPage'))
const ContactPage = lazy(() => import('./pages/ContactPage'))
const InstructorsPage = lazy(() => import('./pages/InstructorsPage'))
const InstructorDetailPage = lazy(() => import('./pages/InstructorDetailPage'))
const PricingPage = lazy(() => import('./pages/PricingPage'))
const BlogPage = lazy(() => import('./pages/BlogPage'))
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'))
const LoginPage = lazy(() => import('./pages/LoginPage'))
const SignupPage = lazy(() => import('./pages/SignupPage'))
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const InstructorDashboard = lazy(() => import('./pages/InstructorDashboard'))
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'))
const LessonPage = lazy(() => import('./pages/LessonPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))
const TermsPage = lazy(() => import('./pages/TermsPage'))
const CookiesPage = lazy(() => import('./pages/CookiesPage'))
const CartPage = lazy(() => import('./pages/CartPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'))
const ApiTester = lazy(() => import('./components/ApiTester'))

// Layout component to conditionally show navbar/footer
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  // Dashboard pages shouldn't show navbar/footer
  const isDashboardPage = location.pathname.includes('dashboard');
  
  if (isDashboardPage) {
    return <>{children}</>;
  }
  
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <DashboardProvider>
            <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <LoadingSpinner size="xl" />
                </div>
              }>
                <Layout>
                  <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/courses" element={<AllCoursesPage />} />
                  <Route path="/course/:id" element={<CoursePage />} />
                  <Route path="/course/:courseId/lesson/:lessonId" element={<LessonPage />} />
                  <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/instructors" element={<InstructorsPage />} />
                <Route path="/instructor/:id" element={<InstructorDetailPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/blog/:id" element={<BlogPostPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route 
                  path="/dashboard" 
                  element={<StudentDashboard />} 
                />
                <Route 
                  path="/student-dashboard" 
                  element={<StudentDashboard />} 
                />
                <Route 
                  path="/admin-dashboard" 
                  element={<AdminDashboard />} 
                />
                <Route 
                  path="/instructor-dashboard" 
                  element={<InstructorDashboard />} 
                />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/cookies" element={<CookiesPage />} />
                <Route path="/api-test" element={<ApiTester />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
              </Layout>
              </Suspense>
            </div>
          </Router>
        </DashboardProvider>
      </AuthProvider>
    </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App
