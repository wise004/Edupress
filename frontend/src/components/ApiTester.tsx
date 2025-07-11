import { useState } from 'react';
import { 
  AuthAPI, 
  UserAPI, 
  CourseAPI, 
  CategoryAPI, 
  BlogAPI
} from '../services/api';

interface TestResult {
  endpoint: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  data?: any;
}

export default function ApiTester() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [token, setToken] = useState<string>('');
  const [testUser, setTestUser] = useState({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User'
  });

  const addResult = (result: TestResult) => {
    setResults(prev => [...prev, result]);
  };

  const clearResults = () => {
    setResults([]);
  };

  // Test Authentication APIs
  const testAuth = async () => {
    try {
      // Test signup
      addResult({ endpoint: 'POST /auth/signup', status: 'pending', message: 'Testing...' });
      
      const signupResponse = await AuthAPI.signup(testUser);
      addResult({ 
        endpoint: 'POST /auth/signup', 
        status: 'success', 
        message: 'User registered successfully',
        data: signupResponse.data 
      });

      // Test login
      addResult({ endpoint: 'POST /auth/signin', status: 'pending', message: 'Testing...' });
      
      const loginResponse = await AuthAPI.signin({
        email: testUser.email,
        password: testUser.password
      });
      
      setToken(loginResponse.data.token);
      addResult({ 
        endpoint: 'POST /auth/signin', 
        status: 'success', 
        message: 'Login successful',
        data: { token: loginResponse.data.token.substring(0, 20) + '...' }
      });

    } catch (error: any) {
      addResult({ 
        endpoint: 'Auth APIs', 
        status: 'error', 
        message: error.response?.data?.message || error.message 
      });
    }
  };

  // Test User APIs
  const testUsers = async () => {
    if (!token) {
      addResult({ endpoint: 'User APIs', status: 'error', message: 'No token available. Please test auth first.' });
      return;
    }

    try {
      // Set token for authenticated requests
      localStorage.setItem('token', token);

      // Test get all users
      addResult({ endpoint: 'GET /users', status: 'pending', message: 'Testing...' });
      
      const usersResponse = await UserAPI.getAllUsers();
      addResult({ 
        endpoint: 'GET /users', 
        status: 'success', 
        message: `Found ${usersResponse.data.length} users`,
        data: usersResponse.data 
      });

      // Test get current user profile
      addResult({ endpoint: 'GET /users/profile', status: 'pending', message: 'Testing...' });
      
      const profileResponse = await UserAPI.getCurrentUser();
      addResult({ 
        endpoint: 'GET /users/profile', 
        status: 'success', 
        message: 'Profile retrieved successfully',
        data: profileResponse.data 
      });

    } catch (error: any) {
      addResult({ 
        endpoint: 'User APIs', 
        status: 'error', 
        message: error.response?.data?.message || error.message 
      });
    }
  };

  // Test Category APIs
  const testCategories = async () => {
    try {
      // Test get all categories
      addResult({ endpoint: 'GET /categories', status: 'pending', message: 'Testing...' });
      
      const categoriesResponse = await CategoryAPI.getAllCategories();
      addResult({ 
        endpoint: 'GET /categories', 
        status: 'success', 
        message: `Found ${categoriesResponse.data.length} categories`,
        data: categoriesResponse.data 
      });

      // Test create category (if authenticated)
      if (token) {
        localStorage.setItem('token', token);
        
        addResult({ endpoint: 'POST /categories', status: 'pending', message: 'Testing...' });
        
        const newCategory = {
          name: 'Test Category',
          description: 'A test category for API testing',
          color: '#3B82F6',
          icon: 'book'
        };
        
        const createResponse = await CategoryAPI.createCategory(newCategory);
        addResult({ 
          endpoint: 'POST /categories', 
          status: 'success', 
          message: 'Category created successfully',
          data: createResponse.data 
        });
      }

    } catch (error: any) {
      addResult({ 
        endpoint: 'Category APIs', 
        status: 'error', 
        message: error.response?.data?.message || error.message 
      });
    }
  };

  // Test Course APIs
  const testCourses = async () => {
    try {
      // Test get all courses
      addResult({ endpoint: 'GET /courses', status: 'pending', message: 'Testing...' });
      
      const coursesResponse = await CourseAPI.getAllCourses();
      addResult({ 
        endpoint: 'GET /courses', 
        status: 'success', 
        message: `Found ${coursesResponse.data.length} courses`,
        data: coursesResponse.data 
      });

    } catch (error: any) {
      addResult({ 
        endpoint: 'Course APIs', 
        status: 'error', 
        message: error.response?.data?.message || error.message 
      });
    }
  };

  // Test Blog APIs
  const testBlogs = async () => {
    try {
      // Test get all blog posts
      addResult({ endpoint: 'GET /blog', status: 'pending', message: 'Testing...' });
      
      const blogsResponse = await BlogAPI.getPublishedPosts();
      addResult({ 
        endpoint: 'GET /blog', 
        status: 'success', 
        message: `Found ${blogsResponse.data.length} blog posts`,
        data: blogsResponse.data 
      });

    } catch (error: any) {
      addResult({ 
        endpoint: 'Blog APIs', 
        status: 'error', 
        message: error.response?.data?.message || error.message 
      });
    }
  };

  // Test all APIs
  const testAllApis = async () => {
    clearResults();
    await testAuth();
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    await testUsers();
    await testCategories();
    await testCourses();
    await testBlogs();
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">API Integration Tester</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Test Controls</h2>
            <div className="space-y-3">
              <button
                onClick={testAllApis}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Test All APIs
              </button>
              <button
                onClick={testAuth}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Test Authentication
              </button>
              <button
                onClick={testUsers}
                className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                Test User APIs
              </button>
              <button
                onClick={testCategories}
                className="w-full bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
              >
                Test Categories
              </button>
              <button
                onClick={testCourses}
                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Test Courses
              </button>
              <button
                onClick={testBlogs}
                className="w-full bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors"
              >
                Test Blog APIs
              </button>
              <button
                onClick={clearResults}
                className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear Results
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Test User Data</h2>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block text-gray-700 mb-1">Username:</label>
                <input
                  type="text"
                  value={testUser.username}
                  onChange={(e) => setTestUser(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Email:</label>
                <input
                  type="email"
                  value={testUser.email}
                  onChange={(e) => setTestUser(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Password:</label>
                <input
                  type="password"
                  value={testUser.password}
                  onChange={(e) => setTestUser(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Test Results</h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {results.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No tests run yet. Click a test button to start.</p>
            ) : (
              results.map((result, index) => (
                <div
                  key={index}
                  className={`border rounded-lg p-4 ${
                    result.status === 'success' 
                      ? 'border-green-300 bg-green-50' 
                      : result.status === 'error'
                      ? 'border-red-300 bg-red-50'
                      : 'border-yellow-300 bg-yellow-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{result.endpoint}</h3>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        result.status === 'success'
                          ? 'bg-green-100 text-green-800'
                          : result.status === 'error'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {result.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-2">{result.message}</p>
                  {result.data && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-blue-600 text-sm">View Response Data</summary>
                      <pre className="mt-2 bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
