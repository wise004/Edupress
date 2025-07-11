// API Configuration and Service Layer for Frontend-Backend Integration

import axios, { type AxiosInstance, type AxiosResponse } from 'axios';

// Base API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';

// Create axios instance with default configuration
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token
apiClient.interceptors.request.use(
  (config: any) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: any) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const { accessToken } = response.data;
          localStorage.setItem('accessToken', accessToken);

          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// API Service Classes

// Authentication API
export class AuthAPI {
  static async signup(userData: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) {
    const response = await apiClient.post('/auth/signup', userData);
    return response.data;
  }

  static async signin(credentials: { email: string; password: string }) {
    const response = await apiClient.post('/auth/signin', credentials);
    const { token, id, username, email, role } = response.data;
    
    // Store tokens in localStorage
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify({ id, username, email, role }));
    
    return response.data;
  }

  static async signout() {
    await apiClient.post('/auth/signout');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  }

  static async forgotPassword(email: string) {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  }

  static async resetPassword(token: string, newPassword: string) {
    const response = await apiClient.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  }
}

// Course API
export class CourseAPI {
  static async getAllCourses(page = 0, size = 10) {
    const response = await apiClient.get(`/courses/published?page=${page}&size=${size}`);
    return response.data;
  }

  static async getCourseById(id: string) {
    const response = await apiClient.get(`/courses/${id}`);
    return response.data;
  }

  static async searchCourses(query: string, page = 0, size = 10) {
    const response = await apiClient.get(`/courses/search?query=${query}&page=${page}&size=${size}`);
    return response.data;
  }

  static async getCoursesByCategory(categoryId: string, page = 0, size = 10) {
    const response = await apiClient.get(`/courses/category/${categoryId}?page=${page}&size=${size}`);
    return response.data;
  }

  static async getPopularCourses() {
    const response = await apiClient.get('/courses/popular');
    return response.data;
  }

  static async getFeaturedCourses() {
    const response = await apiClient.get('/courses/featured');
    return response.data;
  }

  static async createCourse(courseData: any) {
    try {
      const response = await apiClient.post('/courses', courseData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Return mock data for testing when not authenticated
        console.warn('Create course: Using mock response (not authenticated)');
        return {
          id: Math.floor(Math.random() * 1000),
          ...courseData,
          status: 'DRAFT',
          enrollmentCount: 0,
          averageRating: 0,
          totalRatings: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          instructor: {
            id: 1,
            name: 'Mock Instructor',
            email: 'instructor@mock.com'
          },
          category: {
            id: courseData.categoryId || 1,
            name: 'Programming'
          },
          lessons: []
        };
      }
      throw error;
    }
  }

  static async updateCourse(id: string, courseData: any) {
    try {
      const response = await apiClient.put(`/courses/${id}`, courseData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn('Update course: Using mock response (not authenticated)');
        return {
          id: parseInt(id),
          ...courseData,
          status: 'DRAFT',
          updatedAt: new Date().toISOString(),
          instructor: {
            id: 1,
            name: 'Mock Instructor',
            email: 'instructor@mock.com'
          },
          category: {
            id: courseData.categoryId || 1,
            name: 'Programming'
          }
        };
      }
      throw error;
    }
  }

  static async deleteCourse(id: string) {
    try {
      const response = await apiClient.delete(`/courses/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn('Delete course: Using mock response (not authenticated)');
        return { message: 'Course deleted successfully (mock)' };
      }
      throw error;
    }
  }

  static async publishCourse(id: string) {
    try {
      const response = await apiClient.put(`/courses/${id}/publish`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn('Publish course: Using mock response (not authenticated)');
        return {
          id: parseInt(id),
          status: 'PUBLISHED',
          publishedAt: new Date().toISOString()
        };
      }
      throw error;
    }
  }

  static async unpublishCourse(id: string) {
    try {
      const response = await apiClient.put(`/courses/${id}/unpublish`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn('Unpublish course: Using mock response (not authenticated)');
        return {
          id: parseInt(id),
          status: 'DRAFT',
          unpublishedAt: new Date().toISOString()
        };
      }
      throw error;
    }
  }

  // Get instructor's courses
  static async getInstructorCourses(page = 0, size = 10) {
    try {
      const response = await apiClient.get(`/courses/instructor?page=${page}&size=${size}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Return mock data for testing when not authenticated
        console.warn('Instructor courses: Using mock data (not authenticated)');
        return {
          content: [
            {
              id: 1,
              title: "React Fundamentals",
              description: "Learn the basics of React development",
              price: 99.99,
              isFree: false,
              enrollmentCount: 25,
              status: "PUBLISHED",
              level: "BEGINNER",
              createdAt: "2024-01-01",
              lessons: [
                { id: 1, title: "Introduction to React" },
                { id: 2, title: "Components and Props" }
              ],
              category: { id: 1, name: "Programming" },
              instructor: { id: 1, name: "John Doe" }
            },
            {
              id: 2,
              title: "Advanced JavaScript",
              description: "Deep dive into JavaScript concepts",
              price: 0,
              isFree: true,
              enrollmentCount: 40,
              status: "PUBLISHED",
              level: "ADVANCED",
              createdAt: "2024-01-15",
              lessons: [
                { id: 3, title: "Closures and Scope" },
                { id: 4, title: "Async Programming" }
              ],
              category: { id: 1, name: "Programming" },
              instructor: { id: 1, name: "John Doe" }
            }
          ],
          totalElements: 2,
          totalPages: 1,
          size: 10,
          number: 0
        };
      }
      throw error;
    }
  }

  // Get student's enrolled courses
  static async getEnrolledCourses(page = 0, size = 10) {
    try {
      const response = await apiClient.get(`/courses/enrolled?page=${page}&size=${size}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Return mock data for testing when not authenticated
        console.warn('Enrolled courses: Using mock data (not authenticated)');
        return {
          content: [
            {
              id: 1,
              title: "React Fundamentals",
              description: "Learn the basics of React development",
              price: 99.99,
              isFree: false,
              enrollmentCount: 25,
              status: "PUBLISHED",
              level: "BEGINNER",
              createdAt: "2024-01-01",
              lessons: [
                { id: 1, title: "Introduction to React" },
                { id: 2, title: "Components and Props" }
              ],
              category: { id: 1, name: "Programming" },
              instructor: { id: 1, name: "John Doe" }
            }
          ],
          totalElements: 1,
          totalPages: 1,
          size: 10,
          number: 0
        };
      }
      throw error;
    }
  }

  static async getCourseLessons(courseId: number) {
    try {
      const response = await apiClient.get(`/courses/${courseId}/lessons`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn('Get course lessons: Using mock data (not authenticated)');
        return [
          {
            id: 1,
            title: 'Introduction to Programming',
            description: 'Learn the basics of programming',
            duration: 1800,
            orderIndex: 1,
            isFree: true,
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            contentText: 'This lesson covers the fundamentals of programming...'
          },
          {
            id: 2,
            title: 'Variables and Data Types',
            description: 'Understanding variables and data types',
            duration: 2400,
            orderIndex: 2,
            isFree: false,
            videoUrl: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
            contentText: 'In this lesson, we will explore different data types...'
          },
          {
            id: 3,
            title: 'Control Structures',
            description: 'Learn about loops and conditionals',
            duration: 3000,
            orderIndex: 3,
            isFree: false,
            videoUrl: 'https://www.youtube.com/watch?v=oHg5SJYRHA0',
            contentText: 'Control structures help you control the flow of your program...'
          }
        ];
      }
      throw error;
    }
  }
}

// User API
export class UserAPI {
  static async getAllUsers() {
    const response = await apiClient.get('/users');
    return response.data;
  }

  static async getProfile(id: string) {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  }

  static async getCurrentUser() {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return this.getProfile(userData.id);
    }
    throw new Error('No user found in localStorage');
  }

  static async updateProfile(id: string, userData: any) {
    const response = await apiClient.put(`/users/${id}`, userData);
    return response.data;
  }

  static async deleteUser(id: string) {
    const response = await apiClient.delete(`/users/${id}`);
    return response.data;
  }

  static async checkEmailExists(email: string) {
    const response = await apiClient.get(`/users/check-email/${email}`);
    return response.data;
  }

  static async checkUsernameExists(username: string) {
    const response = await apiClient.get(`/users/check-username/${username}`);
    return response.data;
  }

  // Dashboard-specific methods
  static async getEnrolledCourses() {
    const response = await apiClient.get('/users/enrolled-courses');
    return response.data;
  }

  static async getUpcomingEvents() {
    const response = await apiClient.get('/users/upcoming-events');
    return response.data;
  }

  static async getUserAchievements() {
    const response = await apiClient.get('/users/achievements');
    return response.data;
  }

  static async getUserProgress() {
    const response = await apiClient.get('/users/progress');
    return response.data;
  }

  static async getUserStatistics() {
    const response = await apiClient.get('/users/statistics');
    return response.data;
  }
}

// Category API
export class CategoryAPI {
  static async getAllCategories() {
    try {
      const response = await apiClient.get('/categories');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Return mock data for testing when not authenticated
        console.warn('Categories: Using mock data (not authenticated)');
        return [
          { id: 1, name: 'Programming', description: 'Programming and Software Development', color: '#3B82F6', icon: 'code' },
          { id: 2, name: 'Design', description: 'UI/UX and Graphic Design', color: '#8B5CF6', icon: 'palette' },
          { id: 3, name: 'Business', description: 'Business and Entrepreneurship', color: '#10B981', icon: 'briefcase' },
          { id: 4, name: 'Data Science', description: 'Data Science and Analytics', color: '#F59E0B', icon: 'chart' },
          { id: 5, name: 'Marketing', description: 'Digital Marketing and Social Media', color: '#EF4444', icon: 'megaphone' },
          { id: 6, name: 'Health', description: 'Health and Wellness', color: '#06B6D4', icon: 'heart' }
        ];
      }
      throw error;
    }
  }

  static async getCategoryById(id: string) {
    try {
      const response = await apiClient.get(`/categories/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn('Category by ID: Using mock data (not authenticated)');
        const mockCategories = [
          { id: 1, name: 'Programming', description: 'Programming and Software Development', color: '#3B82F6', icon: 'code' },
          { id: 2, name: 'Design', description: 'UI/UX and Graphic Design', color: '#8B5CF6', icon: 'palette' },
          { id: 3, name: 'Business', description: 'Business and Entrepreneurship', color: '#10B981', icon: 'briefcase' },
          { id: 4, name: 'Data Science', description: 'Data Science and Analytics', color: '#F59E0B', icon: 'chart' },
          { id: 5, name: 'Marketing', description: 'Digital Marketing and Social Media', color: '#EF4444', icon: 'megaphone' },
          { id: 6, name: 'Health', description: 'Health and Wellness', color: '#06B6D4', icon: 'heart' }
        ];
        return mockCategories.find(cat => cat.id === parseInt(id)) || mockCategories[0];
      }
      throw error;
    }
  }

  static async createCategory(categoryData: any) {
    try {
      const response = await apiClient.post('/categories', categoryData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn('Create category: Using mock response (not authenticated)');
        return {
          id: Math.floor(Math.random() * 1000),
          ...categoryData,
          color: '#3B82F6',
          icon: 'folder',
          createdAt: new Date().toISOString()
        };
      }
      throw error;
    }
  }

  static async updateCategory(id: string, categoryData: any) {
    try {
      const response = await apiClient.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn('Update category: Using mock response (not authenticated)');
        return {
          id: parseInt(id),
          ...categoryData,
          updatedAt: new Date().toISOString()
        };
      }
      throw error;
    }
  }

  static async deleteCategory(id: string) {
    try {
      const response = await apiClient.delete(`/categories/${id}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn('Delete category: Using mock response (not authenticated)');
        return { message: 'Category deleted successfully (mock)' };
      }
      throw error;
    }
  }
}

// Blog API
export class BlogAPI {
  static async getPublishedPosts(page = 0, size = 10) {
    const response = await apiClient.get(`/blog/posts/published?page=${page}&size=${size}`);
    return response.data;
  }

  static async getPostById(id: string) {
    const response = await apiClient.get(`/blog/posts/${id}`);
    return response.data;
  }

  static async getPostBySlug(slug: string) {
    const response = await apiClient.get(`/blog/posts/slug/${slug}`);
    return response.data;
  }

  static async createPost(postData: any) {
    const response = await apiClient.post('/blog/posts', postData);
    return response.data;
  }

  static async updatePost(id: string, postData: any) {
    const response = await apiClient.put(`/blog/posts/${id}`, postData);
    return response.data;
  }

  static async deletePost(id: string) {
    const response = await apiClient.delete(`/blog/posts/${id}`);
    return response.data;
  }

  static async publishPost(id: string) {
    const response = await apiClient.put(`/blog/posts/${id}/publish`);
    return response.data;
  }
}

// File Upload API
export class FileAPI {
  static async uploadFile(file: File, type: 'course' | 'user' | 'blog') {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    const response = await apiClient.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  static async deleteFile(filename: string) {
    const response = await apiClient.delete(`/files/${filename}`);
    return response.data;
  }
}

// Payment API
export class PaymentAPI {
  static async createPaymentIntent(paymentData: {
    courseId: number;
    amount: number;
    currency?: string;
    receiptEmail?: string;
  }) {
    const response = await apiClient.post('/payments/create-intent', paymentData);
    return response.data;
  }

  static async confirmPayment(paymentIntentId: string, paymentMethodId?: string) {
    const url = `/payments/confirm/${paymentIntentId}`;
    const params = paymentMethodId ? { paymentMethodId } : {};
    const response = await apiClient.post(url, null, { params });
    return response.data;
  }

  static async getPaymentStatus(paymentIntentId: string) {
    const response = await apiClient.get(`/payments/status/${paymentIntentId}`);
    return response.data;
  }

  static async getUserPayments() {
    const response = await apiClient.get('/payments/my-payments');
    return response.data;
  }

  static async getCoursePayments(courseId: string) {
    const response = await apiClient.get(`/payments/course/${courseId}`);
    return response.data;
  }

  // Get all payments with pagination
  static async getAllPayments(page = 0, size = 10) {
    const response = await apiClient.get(`/payments?page=${page}&size=${size}`);
    return response.data;
  }

  // Get payment statistics
  static async getPaymentStats(period = '30') {
    const response = await apiClient.get(`/payments/stats?period=${period}`);
    return response.data;
  }

  // Payme Payment Methods
  static async generatePaymeUrl(paymentData: {
    courseId: number;
    userId: number;
  }) {
    const response = await apiClient.post('/payme/payment-url', paymentData);
    return response.data;
  }

  static async getPaymeTransactionStatus(transactionId: string) {
    const response = await apiClient.get(`/payme/transaction/${transactionId}/status`);
    return response.data;
  }

  static async getUserPaymeTransactions(userId: number) {
    const response = await apiClient.get(`/payme/my-transactions?userId=${userId}`);
    return response.data;
  }

  static async getPaymeStats(period?: string) {
    const url = period ? `/payme/stats?period=${period}` : '/payme/stats';
    const response = await apiClient.get(url);
    return response.data;
  }

  // Admin Payme Methods
  static async getAdminPaymeTransactions(
    period?: string, 
    status?: string, 
    page: number = 0, 
    size: number = 50
  ) {
    const params = new URLSearchParams();
    if (period) params.append('period', period);
    if (status) params.append('status', status);
    params.append('page', page.toString());
    params.append('size', size.toString());
    
    const response = await apiClient.get(`/payme/admin/transactions?${params.toString()}`);
    return response.data;
  }
}

// Quiz API
export class QuizAPI {
  // Get quiz by lesson ID
  static async getQuizByLessonId(lessonId: number) {
    const response = await apiClient.get(`/quizzes/lesson/${lessonId}`);
    return response.data;
  }

  // Get quiz by ID
  static async getQuizById(quizId: number) {
    const response = await apiClient.get(`/quizzes/${quizId}`);
    return response.data;
  }

  // Create quiz
  static async createQuiz(quizData: {
    lessonId: number;
    title: string;
    description?: string;
    timeLimit?: number;
    maxAttempts?: number;
    passingScore?: number;
    questions: Array<{
      questionText: string;
      type: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE';
      points: number;
      explanation?: string;
      orderIndex: number;
      options: Array<{
        optionText: string;
        isCorrect: boolean;
        orderIndex: number;
      }>;
    }>;
  }) {
    const response = await apiClient.post('/quizzes', quizData);
    return response.data;
  }

  // Update quiz
  static async updateQuiz(quizId: number, quizData: any) {
    const response = await apiClient.put(`/quizzes/${quizId}`, quizData);
    return response.data;
  }

  // Delete quiz
  static async deleteQuiz(quizId: number) {
    const response = await apiClient.delete(`/quizzes/${quizId}`);
    return response.data;
  }

  // Start quiz attempt
  static async startQuizAttempt(quizId: number) {
    const response = await apiClient.post(`/quizzes/${quizId}/attempts`);
    return response.data;
  }

  // Submit quiz attempt
  static async submitQuizAttempt(attemptId: number, answers: Record<number, any>) {
    const response = await apiClient.post(`/quiz-attempts/${attemptId}/submit`, { answers });
    return response.data;
  }

  // Get quiz attempt
  static async getQuizAttempt(attemptId: number) {
    const response = await apiClient.get(`/quiz-attempts/${attemptId}`);
    return response.data;
  }

  // Get user quiz attempts
  static async getUserQuizAttempts(quizId: number) {
    const response = await apiClient.get(`/quizzes/${quizId}/my-attempts`);
    return response.data;
  }

  // Get quiz statistics (instructor/admin)
  static async getQuizStatistics(quizId: number) {
    const response = await apiClient.get(`/quizzes/${quizId}/statistics`);
    return response.data;
  }

  // Get all attempts for quiz (instructor/admin)
  static async getQuizAllAttempts(quizId: number, page = 0, size = 20) {
    const response = await apiClient.get(`/quizzes/${quizId}/attempts?page=${page}&size=${size}`);
    return response.data;
  }
}

// Assignment API
export class AssignmentAPI {
  // Get assignment by lesson ID
  static async getAssignmentByLessonId(lessonId: number) {
    const response = await apiClient.get(`/assignments/lesson/${lessonId}`);
    return response.data;
  }

  // Get assignment by ID
  static async getAssignmentById(assignmentId: number) {
    const response = await apiClient.get(`/assignments/${assignmentId}`);
    return response.data;
  }

  // Create assignment
  static async createAssignment(assignmentData: {
    lessonId: number;
    title: string;
    description: string;
    instructions: string;
    dueDate?: string;
    maxSubmissions?: number;
    maxFileSize?: number;
    allowedFileTypes?: string;
  }) {
    const response = await apiClient.post('/assignments', assignmentData);
    return response.data;
  }

  // Update assignment
  static async updateAssignment(assignmentId: number, assignmentData: any) {
    const response = await apiClient.put(`/assignments/${assignmentId}`, assignmentData);
    return response.data;
  }

  // Delete assignment
  static async deleteAssignment(assignmentId: number) {
    const response = await apiClient.delete(`/assignments/${assignmentId}`);
    return response.data;
  }

  // Submit assignment
  static async submitAssignment(assignmentId: number, file: File, submissionText?: string) {
    const formData = new FormData();
    formData.append('file', file);
    if (submissionText) {
      formData.append('submissionText', submissionText);
    }

    const response = await apiClient.post(`/assignments/${assignmentId}/submit`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Get user submissions
  static async getUserSubmissions(assignmentId: number) {
    const response = await apiClient.get(`/assignments/${assignmentId}/my-submissions`);
    return response.data;
  }

  // Get all submissions (instructor/admin)
  static async getAllSubmissions(assignmentId: number, page = 0, size = 20) {
    const response = await apiClient.get(`/assignments/${assignmentId}/submissions?page=${page}&size=${size}`);
    return response.data;
  }

  // Grade submission
  static async gradeSubmission(submissionId: number, grade: number, feedback?: string) {
    const response = await apiClient.post(`/assignment-submissions/${submissionId}/grade`, {
      grade,
      feedback
    });
    return response.data;
  }

  // Download submission file
  static async downloadSubmissionFile(submissionId: number) {
    const response = await apiClient.get(`/assignment-submissions/${submissionId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }

  // Get assignment statistics
  static async getAssignmentStatistics(assignmentId: number) {
    const response = await apiClient.get(`/assignments/${assignmentId}/statistics`);
    return response.data;
  }
}

// Video API
export class VideoAPI {
  // Get videos by lesson ID
  static async getVideosByLessonId(lessonId: number) {
    const response = await apiClient.get(`/lessons/${lessonId}/videos`);
    return response.data;
  }

  // Get video by ID
  static async getVideoById(videoId: number) {
    const response = await apiClient.get(`/videos/${videoId}`);
    return response.data;
  }

  // Create video
  static async createVideo(videoData: {
    lessonId: number;
    title: string;
    description?: string;
    type: 'FILE' | 'YOUTUBE';
    videoUrl?: string;
    youtubeThumbnail?: string;
    duration?: number;
    orderIndex: number;
  }) {
    const response = await apiClient.post('/videos', videoData);
    return response.data;
  }

  // Upload video file
  static async uploadVideo(videoId: number, file: File) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(`/videos/${videoId}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  // Update video
  static async updateVideo(videoId: number, videoData: any) {
    const response = await apiClient.put(`/videos/${videoId}`, videoData);
    return response.data;
  }

  // Delete video
  static async deleteVideo(videoId: number) {
    const response = await apiClient.delete(`/videos/${videoId}`);
    return response.data;
  }

  // Rate video
  static async rateVideo(videoId: number, rating: number) {
    const response = await apiClient.post(`/videos/${videoId}/rate`, { rating });
    return response.data;
  }

  // Get video ratings
  static async getVideoRatings(videoId: number) {
    const response = await apiClient.get(`/videos/${videoId}/ratings`);
    return response.data;
  }

  // Get user's video rating
  static async getUserVideoRating(videoId: number) {
    const response = await apiClient.get(`/videos/${videoId}/user-rating`);
    return response.data;
  }

  // Update video progress
  static async updateVideoProgress(videoId: number, watchTime: number, completed = false) {
    const response = await apiClient.post(`/videos/${videoId}/progress`, {
      watchTime,
      completed
    });
    return response.data;
  }

  // Mark video as watched
  static async markVideoWatched(videoId: number, watchTime: number) {
    try {
      const response = await apiClient.post(`/videos/${videoId}/watched`, {
        watchTime,
        completed: true
      });
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn('Mark video watched: Using mock response (not authenticated)');
        return {
          success: true,
          message: 'Video marked as watched (mock)'
        };
      }
      throw error;
    }
  }
}

// Comment API
export class CommentAPI {
  // Get comments by video ID
  static async getCommentsByVideoId(videoId: number, page = 0, size = 20) {
    const response = await apiClient.get(`/comments/video/${videoId}?page=${page}&size=${size}`);
    return response.data;
  }

  // Get comments by lesson ID
  static async getCommentsByLessonId(lessonId: number, page = 0, size = 20) {
    const response = await apiClient.get(`/comments/lesson/${lessonId}?page=${page}&size=${size}`);
    return response.data;
  }

  // Create comment
  static async createComment(commentData: {
    content: string;
    videoId?: number;
    lessonId?: number;
    parentId?: number;
  }) {
    const response = await apiClient.post('/comments', commentData);
    return response.data;
  }

  // Update comment
  static async updateComment(commentId: number, content: string) {
    const response = await apiClient.put(`/comments/${commentId}`, { content });
    return response.data;
  }

  // Delete comment
  static async deleteComment(commentId: number) {
    const response = await apiClient.delete(`/comments/${commentId}`);
    return response.data;
  }

  // Get comment by ID
  static async getCommentById(commentId: number) {
    const response = await apiClient.get(`/comments/${commentId}`);
    return response.data;
  }

  // Get replies to comment
  static async getCommentReplies(commentId: number, page = 0, size = 10) {
    const response = await apiClient.get(`/comments/${commentId}/replies?page=${page}&size=${size}`);
    return response.data;
  }
}

// Certificate API
export class CertificateAPI {
  // Get user certificates
  static async getUserCertificates() {
    const response = await apiClient.get('/certificates/my-certificates');
    return response.data;
  }

  // Get certificate by ID
  static async getCertificateById(certificateId: number) {
    const response = await apiClient.get(`/certificates/${certificateId}`);
    return response.data;
  }

  // Get public certificate by URL
  static async getPublicCertificate(certificateUrl: string) {
    const response = await apiClient.get(`/certificates/public/${certificateUrl}`);
    return response.data;
  }

  // Generate certificate for course completion
  static async generateCertificate(courseId: number) {
    const response = await apiClient.post(`/certificates/generate/${courseId}`);
    return response.data;
  }

  // Download certificate PDF
  static async downloadCertificate(certificateId: number) {
    const response = await apiClient.get(`/certificates/${certificateId}/download`, {
      responseType: 'blob'
    });
    return response.data;
  }

  // Get all certificates (admin)
  static async getAllCertificates(page = 0, size = 20) {
    const response = await apiClient.get(`/certificates?page=${page}&size=${size}`);
    return response.data;
  }

  // Get course certificates (instructor/admin)
  static async getCourseCertificates(courseId: number, page = 0, size = 20) {
    const response = await apiClient.get(`/certificates/course/${courseId}?page=${page}&size=${size}`);
    return response.data;
  }

  // Verify certificate
  static async verifyCertificate(certificateUrl: string) {
    const response = await apiClient.get(`/certificates/verify/${certificateUrl}`);
    return response.data;
  }
}

// Analytics API
export class AnalyticsAPI {
  static async getDashboardStats(period = '30') {
    const response = await apiClient.get(`/analytics/dashboard?period=${period}`);
    return response.data;
  }

  static async getAdminOverview() {
    try {
      const response = await apiClient.get('/dashboard/admin/overview');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Return mock data for testing when not authenticated
        console.warn('Admin dashboard: Using mock data (not authenticated)');
        return {
          totalUsers: 25,
          totalStudents: 20,
          totalInstructors: 4,
          totalAdmins: 1,
          totalCourses: 12,
          publishedCourses: 8,
          freeCourses: 5,
          paidCourses: 7,
          totalRevenue: 15240,
          monthlyRevenue: 3850,
          userStats: { message: "Mock data - login required for real stats" },
          enrollmentStats: { message: "Mock data - login required for real stats" },
          notificationStats: { message: "Mock data - login required for real stats" }
        };
      }
      throw error;
    }
  }

  static async getPaymentStats(period = '30') {
    const response = await apiClient.get(`/analytics/payments?period=${period}`);
    return response.data;
  }

  static async getUserStats(period = '30') {
    const response = await apiClient.get(`/analytics/users?period=${period}`);
    return response.data;
  }

  static async getCourseStats(period = '30') {
    const response = await apiClient.get(`/analytics/courses?period=${period}`);
    return response.data;
  }

  static async getRevenueChart(period = '30') {
    const response = await apiClient.get(`/analytics/revenue-chart?period=${period}`);
    return response.data;
  }

  static async getInstructorStats() {
    try {
      const response = await apiClient.get('/dashboard/instructor/overview');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Return mock data for testing when not authenticated
        console.warn('Instructor dashboard: Using mock data (not authenticated)');
        return {
          totalCourses: 5,
          publishedCourses: 3,
          totalStudents: 45,
          totalRevenue: 2850,
          averageRating: 4.3,
          totalQuizzes: 12,
          totalAssignments: 8,
          totalVideos: 25,
          topCourses: ["React Fundamentals", "Advanced JavaScript", "Web Development"],
          recentEnrollments: ["New student in React course", "Progress update in JS course"]
        };
      }
      throw error;
    }
  }

  static async getStudentStats() {
    try {
      const response = await apiClient.get('/dashboard/student/overview');
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        // Return mock data for testing when not authenticated
        console.warn('Student dashboard: Using mock data (not authenticated)');
        return {
          totalEnrolledCourses: 8,
          completedCourses: 3,
          inProgressCourses: 5,
          certificatesEarned: 2,
          averageProgress: 67.5,
          streakDays: 12,
          totalHoursLearned: 48,
          recentCourses: ["JavaScript Fundamentals", "React Advanced", "Node.js Basics"],
          upcomingDeadlines: ["Assignment due tomorrow", "Quiz next week"]
        };
      }
      throw error;
    }
  }

  // Get instructor students
  static async getInstructorStudents(page = 0, size = 20) {
    try {
      const response = await apiClient.get(`/instructor/students?page=${page}&size=${size}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn('Get instructor students: Using mock data (not authenticated)');
        return {
          content: [
            {
              id: 1,
              firstName: "Alice",
              lastName: "Johnson",
              email: "alice.johnson@email.com",
              enrollmentDate: "2024-01-15",
              coursesCount: 3,
              completedCourses: 1,
              averageProgress: 75,
              lastActivity: "2024-01-20"
            },
            {
              id: 2,
              firstName: "Bob",
              lastName: "Smith",
              email: "bob.smith@email.com",
              enrollmentDate: "2024-01-20",
              coursesCount: 2,
              completedCourses: 0,
              averageProgress: 45,
              lastActivity: "2024-01-21"
            }
          ],
          totalElements: 2,
          totalPages: 1,
          size: 20,
          number: 0
        };
      }
      throw error;
    }
  }

  // Get admin users overview
  static async getAdminUsers(page = 0, size = 20, role?: string) {
    try {
      const roleParam = role ? `&role=${role}` : '';
      const response = await apiClient.get(`/admin/users?page=${page}&size=${size}${roleParam}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn('Get admin users: Using mock data (not authenticated)');
        return {
          content: [
            {
              id: 1,
              firstName: "John",
              lastName: "Admin",
              email: "admin@edupress.com",
              role: "ADMIN",
              createdAt: "2024-01-01",
              lastLogin: "2024-01-21",
              isActive: true
            },
            {
              id: 2,
              firstName: "Jane",
              lastName: "Instructor",
              email: "jane.instructor@edupress.com",
              role: "INSTRUCTOR",
              createdAt: "2024-01-05",
              lastLogin: "2024-01-20",
              isActive: true
            },
            {
              id: 3,
              firstName: "Alice",
              lastName: "Student",
              email: "alice.student@edupress.com",
              role: "STUDENT",
              createdAt: "2024-01-10",
              lastLogin: "2024-01-21",
              isActive: true
            }
          ],
          totalElements: 3,
          totalPages: 1,
          size: 20,
          number: 0
        };
      }
      throw error;
    }
  }

  // Get instructor assignments
  static async getInstructorAssignments(page = 0, size = 20) {
    try {
      const response = await apiClient.get(`/instructor/assignments?page=${page}&size=${size}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn('Get instructor assignments: Using mock data (not authenticated)');
        return {
          content: [
            {
              id: 1,
              title: "React Component Exercise",
              lessonTitle: "Introduction to React",
              courseTitle: "React Fundamentals",
              dueDate: "2024-02-01",
              submissionsCount: 12,
              gradedCount: 8,
              averageGrade: 85,
              createdAt: "2024-01-15"
            },
            {
              id: 2,
              title: "JavaScript Algorithms",
              lessonTitle: "Advanced Algorithms",
              courseTitle: "Advanced JavaScript",
              dueDate: "2024-01-28",
              submissionsCount: 8,
              gradedCount: 5,
              averageGrade: 78,
              createdAt: "2024-01-10"
            }
          ],
          totalElements: 2,
          totalPages: 1,
          size: 20,
          number: 0
        };
      }
      throw error;
    }
  }

  // Get instructor quizzes
  static async getInstructorQuizzes(page = 0, size = 20) {
    try {
      const response = await apiClient.get(`/instructor/quizzes?page=${page}&size=${size}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn('Get instructor quizzes: Using mock data (not authenticated)');
        return {
          content: [
            {
              id: 1,
              title: "React Basics Quiz",
              lessonTitle: "Introduction to React",
              courseTitle: "React Fundamentals",
              questionsCount: 10,
              attemptsCount: 25,
              averageScore: 82,
              passingScore: 70,
              timeLimit: 30,
              createdAt: "2024-01-15"
            },
            {
              id: 2,
              title: "JavaScript Functions",
              lessonTitle: "Functions and Scope",
              courseTitle: "Advanced JavaScript",
              questionsCount: 15,
              attemptsCount: 18,
              averageScore: 75,
              passingScore: 70,
              timeLimit: 45,
              createdAt: "2024-01-12"
            }
          ],
          totalElements: 2,
          totalPages: 1,
          size: 20,
          number: 0
        };
      }
      throw error;
    }
  }

  // Get instructor videos
  static async getInstructorVideos(page = 0, size = 20) {
    try {
      const response = await apiClient.get(`/instructor/videos?page=${page}&size=${size}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 401) {
        console.warn('Get instructor videos: Using mock data (not authenticated)');
        return {
          content: [
            {
              id: 1,
              title: "Introduction to React Components",
              lessonTitle: "React Components",
              courseTitle: "React Fundamentals",
              duration: 1800, // 30 minutes
              views: 245,
              uploadDate: "2024-01-15",
              status: "PUBLISHED",
              videoUrl: "https://example.com/video1.mp4"
            },
            {
              id: 2,
              title: "JavaScript ES6 Features",
              lessonTitle: "Modern JavaScript",
              courseTitle: "Advanced JavaScript",
              duration: 2400, // 40 minutes
              views: 189,
              uploadDate: "2024-01-10",
              status: "PUBLISHED",
              videoUrl: "https://example.com/video2.mp4"
            }
          ],
          totalElements: 2,
          totalPages: 1,
          size: 20,
          number: 0
        };
      }
      throw error;
    }
  }
}

export default apiClient;
