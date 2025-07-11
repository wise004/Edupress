# EduPress - Full-Stack Online Course Platform

Welcome to EduPress, a comprehensive online course platform built with modern web technologies.

## Project Overview

EduPress is a full-stack web application that provides a complete online learning experience. It consists of a React frontend with TypeScript and Tailwind CSS, and a Spring Boot backend with MySQL database.

## Architecture

```
EduPress/
├── Frontend/                    # React + Vite + TypeScript + Tailwind
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/             # Page components
│   │   ├── hooks/             # Custom React hooks
│   │   ├── utils/             # Utility functions
│   │   ├── types/             # TypeScript type definitions
│   │   └── assets/            # Static assets
│   ├── public/                # Public assets
│   ├── package.json           # Frontend dependencies
│   └── vite.config.ts         # Vite configuration
└── Backend/                    # Spring Boot + MySQL
    ├── src/main/java/com/edupress/
    │   ├── controller/        # REST API controllers
    │   ├── service/           # Business logic
    │   ├── repository/        # Data access layer
    │   ├── model/             # Entity models
    │   ├── security/          # Security configuration
    │   └── config/            # Application configuration
    ├── src/main/resources/
    │   └── application.properties
    └── pom.xml                # Backend dependencies
```

## Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3
- **Routing**: React Router DOM
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Build Tool**: Vite

### Backend
- **Framework**: Spring Boot 3.2.1
- **Language**: Java 21
- **Database**: MySQL (production), H2 (development)
- **Security**: Spring Security + JWT
- **ORM**: Spring Data JPA / Hibernate
- **Build Tool**: Maven
- **Documentation**: Spring Doc OpenAPI

## Key Features

### 🎓 Course Management
- Create and publish courses with lessons
- Video content support with preview
- Course categories and difficulty levels
- Student enrollment and progress tracking
- Course reviews and ratings

### 👥 User Management
- User registration and authentication
- Role-based access control (Student, Instructor, Admin)
- User profiles with avatars
- Instructor dashboard

### 📝 Content Management
- Rich text blog system
- SEO-friendly blog posts with slugs
- Featured images and excerpts
- Draft and published states

### 🔐 Security
- JWT-based authentication
- Password encryption with BCrypt
- Role-based authorization
- CORS configuration for cross-origin requests

### 📱 Responsive Design
- Mobile-first responsive design
- Modern UI with Tailwind CSS
- Dark mode support
- Accessible components

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Java 21+
- Maven 3.6+
- MySQL 8.0+ (optional, H2 available for development)

### Frontend Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   
   Frontend will be available at `http://localhost:5173`

3. **Build for production**
   ```bash
   npm run build
   ```

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd Backend
   ```

2. **Configure database** (optional, uses H2 by default)
   Update `src/main/resources/application.properties` for MySQL:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/edupress_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```

3. **Set environment variables**
   ```bash
   export JWT_SECRET=mySecretKey
   export MAIL_USERNAME=your_email@gmail.com
   export MAIL_PASSWORD=your_app_password
   ```

4. **Run the application**
   ```bash
   mvn spring-boot:run
   ```
   
   Backend API will be available at `http://localhost:8080`

### Using VS Code Tasks

The project includes VS Code tasks for common operations:

- **Frontend: Start Dev Server** - Start React development server
- **Frontend: Build** - Build frontend for production
- **Backend: Spring Boot Run** - Start Spring Boot server
- **Backend: Maven Clean Compile** - Compile backend code
- **Backend: Maven Test** - Run backend tests

Access tasks via `Ctrl+Shift+P` → "Tasks: Run Task"

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Courses
- `GET /api/courses/published` - Get published courses
- `GET /api/courses/{id}` - Get course details
- `POST /api/courses` - Create course (Instructor/Admin)
- `PUT /api/courses/{id}` - Update course
- `GET /api/courses/search?query={term}` - Search courses

### Users
- `GET /api/users/{id}` - Get user profile
- `PUT /api/users/{id}` - Update profile
- `GET /api/users/check-email/{email}` - Check email availability

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin)

### Blog
- `GET /api/blog/posts/published` - Get published blog posts
- `GET /api/blog/posts/{id}` - Get blog post
- `POST /api/blog/posts` - Create blog post (Instructor/Admin)

## Database Schema

### Core Entities
- **User**: User accounts with roles (STUDENT, INSTRUCTOR, ADMIN)
- **Course**: Course information with instructor and category
- **Category**: Course categories for organization
- **Lesson**: Individual lessons within courses
- **Review**: Course reviews and ratings
- **BlogPost**: Blog posts with SEO-friendly slugs

### Relationships
- User → Course (One-to-Many: instructor relationship)
- User ↔ Course (Many-to-Many: enrollment relationship)
- Course → Category (Many-to-One)
- Course → Lesson (One-to-Many)
- Course → Review (One-to-Many)
- User → BlogPost (Many-to-One: author relationship)

## Development Workflow

1. **Frontend Development**
   - Make changes to React components
   - Use TypeScript for type safety
   - Style with Tailwind CSS classes
   - Test in browser at `localhost:5173`

2. **Backend Development**
   - Update controllers, services, or models
   - Test with H2 console at `localhost:8080/h2-console`
   - Use Postman or similar for API testing

3. **Full-Stack Testing**
   - Start both frontend and backend servers
   - Frontend will proxy API requests to backend
   - Test complete user flows

## Deployment

### Frontend Deployment
```bash
npm run build
# Deploy dist/ folder to your static hosting service
```

### Backend Deployment
```bash
mvn clean package
# Deploy the generated JAR file to your server
java -jar target/edupress-backend-1.0.0.jar
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit changes: `git commit -am 'Add my feature'`
4. Push to branch: `git push origin feature/my-feature`
5. Submit a pull request

## Project Status

✅ **Completed:**
- Complete React frontend with TypeScript and Tailwind CSS
- Spring Boot backend with REST APIs
- User authentication and authorization
- Course and category management
- Blog system
- Security configuration with JWT
- Database models and repositories

🚀 **Next Steps:**
- File upload functionality for course materials
- Email service integration
- Payment gateway integration
- Advanced search and filtering
- Real-time notifications
- Mobile app development

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation in README files
- Review the API documentation at `localhost:8080/swagger-ui.html`
