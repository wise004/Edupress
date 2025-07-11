// Mock data service for business demo purposes

export interface MockUser {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'STUDENT' | 'INSTRUCTOR' | 'ADMIN';
  profileImage?: string;
  bio?: string;
  phoneNumber?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MockCourse {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  thumbnailUrl: string;
  price: number;
  discountedPrice?: number;
  instructorId: number;
  instructorName: string;
  categoryId: number;
  categoryName: string;
  difficultyLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  duration: number; // in hours
  totalLessons: number;
  enrollmentCount: number;
  rating: number;
  ratingCount: number;
  isPublished: boolean;
  isFree: boolean;
  language: string;
  requirements: string[];
  learningObjectives: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MockEnrollment {
  id: number;
  userId: number;
  courseId: number;
  enrolledAt: string;
  completionPercentage: number;
  lastAccessedAt: string;
  completedAt?: string;
  certificateIssued: boolean;
}

export interface MockLesson {
  id: number;
  courseId: number;
  title: string;
  description: string;
  videoUrl?: string;
  duration: number; // in minutes
  orderIndex: number;
  isPreview: boolean;
  content: string;
  resources: Array<{ id: number; name: string; url: string; type: string }>;
}

export interface MockQuiz {
  id: number;
  lessonId: number;
  title: string;
  description: string;
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    correctAnswers: number[];
    explanation: string;
  }>;
  passingScore: number;
  timeLimit: number; // in minutes
}

export interface MockAssignment {
  id: number;
  lessonId: number;
  title: string;
  description: string;
  instructions: string;
  dueDate: string;
  maxPoints: number;
  submissions: Array<{
    id: number;
    userId: number;
    submittedAt: string;
    content: string;
    attachments: string[];
    grade?: number;
    feedback?: string;
    gradedAt?: string;
  }>;
}

export interface MockTransaction {
  id: number;
  userId: number;
  courseId: number;
  amount: number;
  currency: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paymentMethod: string;
  transactionDate: string;
  paymentGateway: string;
  gatewayTransactionId: string;
}

export interface MockCertificate {
  id: number;
  userId: number;
  courseId: number;
  certificateUrl: string;
  issuedAt: string;
  verificationCode: string;
}

export interface MockNotification {
  id: number;
  userId: number;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface MockAnalytics {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  enrollmentTrends: Array<{ date: string; enrollments: number }>;
  popularCourses: Array<{ courseId: number; title: string; enrollments: number }>;
  userGrowth: Array<{ month: string; newUsers: number; totalUsers: number }>;
  completionRates: Array<{ courseId: number; title: string; completionRate: number }>;
}

// Mock Data
export const mockCourses: MockCourse[] = [
  {
    id: 1,
    title: "Complete React & TypeScript Development",
    description: "Master React and TypeScript from basics to advanced concepts. Build real-world applications with modern development practices and tools.",
    shortDescription: "Master React and TypeScript development",
    thumbnailUrl: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
    price: 149.99,
    discountedPrice: 99.99,
    instructorId: 2,
    instructorName: "Sarah Instructor",
    categoryId: 1,
    categoryName: "Web Development",
    difficultyLevel: "INTERMEDIATE",
    duration: 45,
    totalLessons: 120,
    enrollmentCount: 2847,
    rating: 4.8,
    ratingCount: 423,
    isPublished: true,
    isFree: false,
    language: "English",
    requirements: ["Basic JavaScript knowledge", "HTML & CSS fundamentals", "Code editor"],
    learningObjectives: [
      "Build modern React applications",
      "Master TypeScript for type-safe development",
      "Implement state management with Redux",
      "Deploy applications to production"
    ],
    tags: ["React", "TypeScript", "Frontend", "JavaScript", "Web Development"],
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2025-01-10T00:00:00Z"
  },
  {
    id: 2,
    title: "Data Science with Python & Machine Learning",
    description: "Comprehensive data science course covering Python, pandas, NumPy, matplotlib, scikit-learn, and machine learning algorithms.",
    shortDescription: "Learn data science and machine learning with Python",
    thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
    price: 199.99,
    discountedPrice: 129.99,
    instructorId: 2,
    instructorName: "Sarah Instructor",
    categoryId: 2,
    categoryName: "Data Science",
    difficultyLevel: "INTERMEDIATE",
    duration: 60,
    totalLessons: 85,
    enrollmentCount: 1923,
    rating: 4.9,
    ratingCount: 312,
    isPublished: true,
    isFree: false,
    language: "English",
    requirements: ["Basic Python knowledge", "High school mathematics", "Jupyter Notebook"],
    learningObjectives: [
      "Analyze data with Python libraries",
      "Build machine learning models",
      "Create data visualizations",
      "Deploy ML models to production"
    ],
    tags: ["Python", "Data Science", "Machine Learning", "AI", "Analytics"],
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2025-01-08T00:00:00Z"
  },
  {
    id: 3,
    title: "Digital Marketing Mastery",
    description: "Complete digital marketing course covering SEO, social media marketing, PPC, email marketing, and analytics.",
    shortDescription: "Master all aspects of digital marketing",
    thumbnailUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
    price: 89.99,
    instructorId: 2,
    instructorName: "Sarah Instructor",
    categoryId: 3,
    categoryName: "Marketing",
    difficultyLevel: "BEGINNER",
    duration: 25,
    totalLessons: 65,
    enrollmentCount: 3421,
    rating: 4.7,
    ratingCount: 567,
    isPublished: true,
    isFree: false,
    language: "English",
    requirements: ["Basic computer skills", "Internet access", "Business email account"],
    learningObjectives: [
      "Create effective marketing campaigns",
      "Optimize websites for search engines",
      "Manage social media marketing",
      "Analyze marketing performance"
    ],
    tags: ["Marketing", "SEO", "Social Media", "PPC", "Email Marketing"],
    createdAt: "2024-03-01T00:00:00Z",
    updatedAt: "2025-01-05T00:00:00Z"
  },
  {
    id: 4,
    title: "Introduction to Programming",
    description: "Perfect for beginners! Learn programming fundamentals with Python in this comprehensive introduction course.",
    shortDescription: "Learn programming fundamentals with Python",
    thumbnailUrl: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=400&h=250&fit=crop",
    price: 0,
    instructorId: 2,
    instructorName: "Sarah Instructor",
    categoryId: 1,
    categoryName: "Programming",
    difficultyLevel: "BEGINNER",
    duration: 20,
    totalLessons: 45,
    enrollmentCount: 5672,
    rating: 4.6,
    ratingCount: 891,
    isPublished: true,
    isFree: true,
    language: "English",
    requirements: ["Computer with internet access", "No prior programming experience needed"],
    learningObjectives: [
      "Understand programming concepts",
      "Write basic Python programs",
      "Use variables and data types",
      "Create simple algorithms"
    ],
    tags: ["Python", "Programming", "Beginner", "Fundamentals", "Free"],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 5,
    title: "Advanced Node.js & Express Development",
    description: "Deep dive into Node.js and Express.js for backend development. Learn advanced patterns, security, testing, and deployment.",
    shortDescription: "Master backend development with Node.js and Express",
    thumbnailUrl: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=250&fit=crop",
    price: 179.99,
    discountedPrice: 119.99,
    instructorId: 2,
    instructorName: "Sarah Instructor",
    categoryId: 1,
    categoryName: "Backend Development",
    difficultyLevel: "ADVANCED",
    duration: 40,
    totalLessons: 95,
    enrollmentCount: 1456,
    rating: 4.9,
    ratingCount: 234,
    isPublished: true,
    isFree: false,
    language: "English",
    requirements: ["JavaScript fundamentals", "Basic Node.js knowledge", "Understanding of APIs"],
    learningObjectives: [
      "Build scalable Node.js applications",
      "Implement advanced Express.js patterns",
      "Secure backend applications",
      "Deploy to cloud platforms"
    ],
    tags: ["Node.js", "Express", "Backend", "API", "JavaScript"],
    createdAt: "2024-04-01T00:00:00Z",
    updatedAt: "2025-01-03T00:00:00Z"
  }
];

export const mockEnrollments: MockEnrollment[] = [
  {
    id: 1,
    userId: 1, // Student
    courseId: 1,
    enrolledAt: "2024-12-01T00:00:00Z",
    completionPercentage: 75,
    lastAccessedAt: "2025-01-10T14:30:00Z",
    certificateIssued: false
  },
  {
    id: 2,
    userId: 1, // Student
    courseId: 4,
    enrolledAt: "2024-11-15T00:00:00Z",
    completionPercentage: 100,
    lastAccessedAt: "2024-12-20T16:45:00Z",
    completedAt: "2024-12-20T16:45:00Z",
    certificateIssued: true
  },
  {
    id: 3,
    userId: 1, // Student
    courseId: 3,
    enrolledAt: "2025-01-05T00:00:00Z",
    completionPercentage: 25,
    lastAccessedAt: "2025-01-11T10:15:00Z",
    certificateIssued: false
  }
];

export const mockTransactions: MockTransaction[] = [
  {
    id: 1,
    userId: 1,
    courseId: 1,
    amount: 99.99,
    currency: "USD",
    status: "COMPLETED",
    paymentMethod: "Credit Card",
    transactionDate: "2024-12-01T00:00:00Z",
    paymentGateway: "Stripe",
    gatewayTransactionId: "pi_1234567890"
  },
  {
    id: 2,
    userId: 1,
    courseId: 3,
    amount: 89.99,
    currency: "USD",
    status: "COMPLETED",
    paymentMethod: "PayPal",
    transactionDate: "2025-01-05T00:00:00Z",
    paymentGateway: "PayPal",
    gatewayTransactionId: "PAY-9876543210"
  }
];

export const mockNotifications: MockNotification[] = [
  {
    id: 1,
    userId: 1,
    title: "Course Progress",
    message: "You've completed 75% of 'Complete React & TypeScript Development'",
    type: "SUCCESS",
    isRead: false,
    createdAt: "2025-01-10T14:30:00Z",
    actionUrl: "/dashboard/courses/1"
  },
  {
    id: 2,
    userId: 1,
    title: "New Lesson Available",
    message: "A new lesson has been added to 'Digital Marketing Mastery'",
    type: "INFO",
    isRead: false,
    createdAt: "2025-01-09T10:00:00Z",
    actionUrl: "/dashboard/courses/3"
  },
  {
    id: 3,
    userId: 1,
    title: "Certificate Earned",
    message: "Congratulations! You've earned a certificate for 'Introduction to Programming'",
    type: "SUCCESS",
    isRead: true,
    createdAt: "2024-12-20T16:45:00Z",
    actionUrl: "/dashboard/certificates"
  }
];

export const mockAnalytics: MockAnalytics = {
  totalUsers: 25478,
  totalCourses: 347,
  totalEnrollments: 89234,
  totalRevenue: 2847592.50,
  monthlyRevenue: [
    { month: "Jul 2024", revenue: 185420 },
    { month: "Aug 2024", revenue: 198765 },
    { month: "Sep 2024", revenue: 234567 },
    { month: "Oct 2024", revenue: 267890 },
    { month: "Nov 2024", revenue: 289123 },
    { month: "Dec 2024", revenue: 312456 },
    { month: "Jan 2025", revenue: 342785 }
  ],
  enrollmentTrends: [
    { date: "2025-01-01", enrollments: 145 },
    { date: "2025-01-02", enrollments: 189 },
    { date: "2025-01-03", enrollments: 234 },
    { date: "2025-01-04", enrollments: 167 },
    { date: "2025-01-05", enrollments: 298 },
    { date: "2025-01-06", enrollments: 203 },
    { date: "2025-01-07", enrollments: 176 },
    { date: "2025-01-08", enrollments: 256 },
    { date: "2025-01-09", enrollments: 189 },
    { date: "2025-01-10", enrollments: 234 }
  ],
  popularCourses: [
    { courseId: 4, title: "Introduction to Programming", enrollments: 5672 },
    { courseId: 3, title: "Digital Marketing Mastery", enrollments: 3421 },
    { courseId: 1, title: "Complete React & TypeScript Development", enrollments: 2847 },
    { courseId: 2, title: "Data Science with Python & Machine Learning", enrollments: 1923 },
    { courseId: 5, title: "Advanced Node.js & Express Development", enrollments: 1456 }
  ],
  userGrowth: [
    { month: "Jul 2024", newUsers: 1245, totalUsers: 18765 },
    { month: "Aug 2024", newUsers: 1456, totalUsers: 20221 },
    { month: "Sep 2024", newUsers: 1678, totalUsers: 21899 },
    { month: "Oct 2024", newUsers: 1834, totalUsers: 23733 },
    { month: "Nov 2024", newUsers: 1567, totalUsers: 25300 },
    { month: "Dec 2024", newUsers: 178, totalUsers: 25478 }
  ],
  completionRates: [
    { courseId: 4, title: "Introduction to Programming", completionRate: 78.5 },
    { courseId: 3, title: "Digital Marketing Mastery", completionRate: 65.2 },
    { courseId: 1, title: "Complete React & TypeScript Development", completionRate: 58.7 },
    { courseId: 2, title: "Data Science with Python & Machine Learning", completionRate: 52.1 },
    { courseId: 5, title: "Advanced Node.js & Express Development", completionRate: 49.3 }
  ]
};

// Helper functions
export const getMockCoursesByInstructor = (instructorId: number): MockCourse[] => {
  return mockCourses.filter(course => course.instructorId === instructorId);
};

export const getMockEnrollmentsByUser = (userId: number): MockEnrollment[] => {
  return mockEnrollments.filter(enrollment => enrollment.userId === userId);
};

export const getMockCourseById = (courseId: number): MockCourse | undefined => {
  return mockCourses.find(course => course.id === courseId);
};

export const getMockTransactionsByUser = (userId: number): MockTransaction[] => {
  return mockTransactions.filter(transaction => transaction.userId === userId);
};

export const getMockNotificationsByUser = (userId: number): MockNotification[] => {
  return mockNotifications.filter(notification => notification.userId === userId);
};

export const getStudentStats = (userId: number) => {
  const enrollments = getMockEnrollmentsByUser(userId);
  const completedCourses = enrollments.filter(e => e.completionPercentage === 100);
  const inProgressCourses = enrollments.filter(e => e.completionPercentage > 0 && e.completionPercentage < 100);
  
  return {
    totalEnrollments: enrollments.length,
    completedCourses: completedCourses.length,
    inProgressCourses: inProgressCourses.length,
    certificatesEarned: completedCourses.filter(e => e.certificateIssued).length,
    totalStudyTime: enrollments.reduce((total, enrollment) => {
      const course = getMockCourseById(enrollment.courseId);
      return total + (course ? course.duration * (enrollment.completionPercentage / 100) : 0);
    }, 0)
  };
};

export const getInstructorStats = (instructorId: number) => {
  const courses = getMockCoursesByInstructor(instructorId);
  const totalEnrollments = courses.reduce((total, course) => total + course.enrollmentCount, 0);
  const totalRevenue = courses.reduce((total, course) => {
    const courseEnrollments = course.enrollmentCount;
    const price = course.discountedPrice || course.price;
    return total + (courseEnrollments * price);
  }, 0);
  
  return {
    totalCourses: courses.length,
    totalStudents: totalEnrollments,
    totalRevenue: totalRevenue,
    averageRating: courses.reduce((total, course) => total + course.rating, 0) / courses.length,
    publishedCourses: courses.filter(c => c.isPublished).length
  };
};
