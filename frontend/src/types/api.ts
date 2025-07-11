// TypeScript Type Definitions for EduPress API

// User Types
export interface User {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  bio?: string;
  profileImage?: string;
  phoneNumber?: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  role: string;
}

export interface SignupRequest {
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

// Course Types
export interface Course {
  id: number;
  title: string;
  description: string;
  fullDescription?: string;
  price: number;
  originalPrice?: number;
  isFree: boolean;
  thumbnailImage?: string;
  videoPreviewUrl?: string;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  duration: number;
  enrollmentCount: number;
  averageRating: number;
  totalRatings: number;
  language: string;
  requirements?: string;
  whatYouWillLearn?: string;
  instructor: User;
  category: Category;
  lessons: Lesson[];
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  fullDescription?: string;
  price: number;
  originalPrice?: number;
  isFree: boolean;
  level: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  duration: number;
  language: string;
  requirements?: string;
  whatYouWillLearn?: string;
  categoryId: number;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  courseCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Lesson Types
export interface Lesson {
  id: number;
  title: string;
  description?: string;
  contentText?: string;
  videoUrl?: string;
  duration: number;
  orderIndex: number;
  isFree: boolean;
  courseId: number;
  createdAt: string;
  updatedAt: string;
}

// Review Types
export interface Review {
  id: number;
  rating: number;
  comment?: string;
  user: User;
  courseId: number;
  createdAt: string;
  updatedAt: string;
}

// Blog Types
export interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  featuredImage?: string;
  tags?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  viewCount: number;
  readTime: number;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogPostRequest {
  title: string;
  content: string;
  excerpt?: string;
  slug: string;
  featuredImage?: string;
  tags?: string;
  status: 'DRAFT' | 'PUBLISHED';
}

// Pagination Types
export interface PageRequest {
  page: number;
  size: number;
  sort?: string;
  direction?: 'ASC' | 'DESC';
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  empty: boolean;
}

// File Upload Types
export interface FileUploadResponse {
  filename: string;
  originalFilename: string;
  url: string;
  contentType: string;
  size: number;
  uploadedAt: string;
}

// Error Types
export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
  path: string;
}

// Dashboard Types
export interface StudentDashboard {
  enrolledCourses: Course[];
  completedCourses: Course[];
  inProgressCourses: Course[];
  certificates: Certificate[];
  totalHoursLearned: number;
  streakDays: number;
}

export interface InstructorDashboard {
  courses: Course[];
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
  recentReviews: Review[];
  monthlyEarnings: MonthlyEarning[];
}

export interface Certificate {
  id: number;
  courseId: number;
  courseName: string;
  studentName: string;
  instructorName: string;
  completionDate: string;
  certificateUrl?: string;
}

export interface MonthlyEarning {
  month: string;
  year: number;
  amount: number;
  studentCount: number;
}

// Notification Types
export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  read: boolean;
  userId: number;
  createdAt: string;
}

// Payment Types
export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  clientSecret: string;
}

// Payme Transaction Types
export interface PaymeTransaction {
  id?: number;
  paycomTransactionId: string;
  paycomTime: number;
  paycomTimeDateTime: string;
  amount: number;
  account: string;
  state: number;
  reason?: number;
  createTime?: number;
  performTime?: number;
  cancelTime?: number;
  orderId?: string;
  courseId?: number;
  userId?: number;
  createdAt?: string;
  updatedAt?: string;
}

// Quiz Types
export interface Quiz {
  id: number;
  title: string;
  description?: string;
  maxScore: number;
  passingScore: number;
  maxAttempts: number;
  timeLimit: number; // in minutes
  isActive: boolean;
  lessonId: number;
  questions: QuizQuestion[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizQuestion {
  id: number;
  questionText: string;
  type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
  points: number;
  explanation?: string;
  orderIndex: number;
  options: QuizOption[];
  createdAt: string;
  updatedAt: string;
}

export interface QuizOption {
  id: number;
  optionText: string;
  isCorrect: boolean;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuizAttempt {
  id: number;
  score: number;
  timeSpent: number; // in seconds
  status: 'IN_PROGRESS' | 'COMPLETED' | 'TIMEOUT' | 'CANCELLED';
  answers?: string; // JSON string
  startedAt: string;
  completedAt?: string;
  quizId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// Assignment Types
export interface Assignment {
  id: number;
  title: string;
  description: string;
  instructions?: string;
  maxScore: number;
  maxAttempts: number;
  maxFileSize: number; // in MB
  allowedFileTypes: string; // comma separated
  dueDate?: string;
  isActive: boolean;
  lessonId: number;
  submissions: AssignmentSubmission[];
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentSubmission {
  id: number;
  fileName: string;
  filePath: string;
  fileSize: number; // in bytes
  fileType?: string;
  submissionText?: string; // optional text submission
  score?: number;
  feedback?: string;
  status: 'SUBMITTED' | 'GRADED' | 'RETURNED' | 'LATE';
  gradedAt?: string;
  assignmentId: number;
  studentId: number;
  gradedById?: number;
  createdAt: string;
  updatedAt: string;
}

// Video Types
export interface Video {
  id: number;
  title: string;
  description?: string;
  duration: number; // in seconds
  type: 'FILE' | 'YOUTUBE' | 'EXTERNAL_LINK';
  videoUrl?: string;
  filePath?: string;
  thumbnailUrl?: string;
  orderIndex: number;
  fileSize?: number; // in bytes
  averageRating: number;
  totalRatings: number;
  isActive: boolean;
  lessonId: number;
  ratings: VideoRating[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
}

export interface VideoRating {
  id: number;
  rating: number; // 1-5
  videoId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

// Comment Types
export interface Comment {
  id: number;
  content: string;
  type: 'VIDEO' | 'LESSON';
  isActive: boolean;
  videoId?: number;
  lessonId?: number;
  userId: number;
  parentCommentId?: number;
  replies: Comment[];
  user: User;
  createdAt: string;
  updatedAt: string;
}

// Certificate Types
export interface Certificate {
  id: number;
  certificateId: string;
  studentName: string;
  courseName: string;
  instructorName: string;
  completionDate: string;
  issueDate: string;
  certificateUrl?: string;
  publicShareUrl?: string;
  pdfFilePath?: string;
  isActive: boolean;
  courseId: number;
  studentId: number;
  createdAt: string;
  updatedAt: string;
}

// Learning Progress Types
export interface LearningProgress {
  courseId: number;
  userId: number;
  overallProgress: number; // percentage
  videosCompleted: number;
  quizzesCompleted: number;
  assignmentsCompleted: number;
  certificateEarned: boolean;
  lastAccessedAt: string;
}

// Search Types
export interface SearchFilters {
  query?: string;
  category?: string;
  level?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: number;
  duration?: {
    min: number;
    max: number;
  };
  language?: string;
  sortBy?: 'title' | 'price' | 'rating' | 'students' | 'date';
  sortDirection?: 'ASC' | 'DESC';
}

export interface SearchResponse {
  courses: Course[];
  totalResults: number;
  facets: {
    categories: CategoryFacet[];
    levels: LevelFacet[];
    priceRanges: PriceRangeFacet[];
    languages: LanguageFacet[];
  };
}

export interface CategoryFacet {
  categoryId: number;
  categoryName: string;
  count: number;
}

export interface LevelFacet {
  level: string;
  count: number;
}

export interface PriceRangeFacet {
  range: string;
  min: number;
  max: number;
  count: number;
}

export interface LanguageFacet {
  language: string;
  count: number;
}
