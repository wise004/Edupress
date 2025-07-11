# EduPress Backend API

This is the backend API for the EduPress online course platform, built with Spring Boot 3.2.1 and Java 21.

## Features

- **User Management**: Registration, authentication, profile management
- **Course Management**: Create, update, publish courses with lessons and reviews
- **Category Management**: Organize courses by categories
- **Blog System**: Content management for blog posts
- **Security**: JWT-based authentication with role-based access control
- **Database**: MySQL/H2 database with JPA/Hibernate
- **File Upload**: Support for course thumbnails and user profile images
- **Email Service**: Email notifications and verification

## Technology Stack

- **Framework**: Spring Boot 3.2.1
- **Language**: Java 21
- **Database**: MySQL (production), H2 (development)
- **Security**: Spring Security with JWT
- **Build Tool**: Maven
- **ORM**: Spring Data JPA / Hibernate

## Project Structure

```
src/
├── main/
│   ├── java/com/edupress/
│   │   ├── EdupressBackendApplication.java    # Main application class
│   │   ├── config/                            # Configuration classes
│   │   ├── controller/                        # REST controllers
│   │   │   ├── AuthController.java
│   │   │   ├── UserController.java
│   │   │   ├── CourseController.java
│   │   │   ├── CategoryController.java
│   │   │   └── BlogPostController.java
│   │   ├── dto/                               # Data Transfer Objects
│   │   │   ├── request/
│   │   │   └── response/
│   │   ├── model/                             # Entity models
│   │   │   ├── User.java
│   │   │   ├── Course.java
│   │   │   ├── Category.java
│   │   │   ├── Lesson.java
│   │   │   ├── Review.java
│   │   │   └── BlogPost.java
│   │   ├── repository/                        # Data repositories
│   │   ├── security/                          # Security configuration
│   │   └── service/                          # Business logic
│   └── resources/
│       ├── application.properties             # Application configuration
│       └── static/                           # Static resources
└── test/                                     # Test files
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout

### Users
- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/{id}` - Get user by ID
- `PUT /api/users/{id}` - Update user profile
- `DELETE /api/users/{id}` - Delete user (Admin only)

### Courses
- `GET /api/courses` - Get all courses (paginated)
- `GET /api/courses/published` - Get published courses
- `GET /api/courses/{id}` - Get course by ID
- `POST /api/courses` - Create new course (Instructor/Admin)
- `PUT /api/courses/{id}` - Update course (Instructor/Admin)
- `DELETE /api/courses/{id}` - Delete course (Instructor/Admin)
- `PUT /api/courses/{id}/publish` - Publish course
- `GET /api/courses/search?query={term}` - Search courses
- `GET /api/courses/category/{categoryId}` - Get courses by category

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/{id}` - Update category (Admin only)
- `DELETE /api/categories/{id}` - Delete category (Admin only)

### Blog Posts
- `GET /api/blog/posts/published` - Get published blog posts
- `GET /api/blog/posts/{id}` - Get blog post by ID
- `POST /api/blog/posts` - Create blog post (Instructor/Admin)
- `PUT /api/blog/posts/{id}` - Update blog post (Instructor/Admin)

## Getting Started

### Prerequisites

- Java 21 or higher
- Maven 3.6+
- MySQL 8.0+ (for production) or H2 (for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd edupress-backend
   ```

2. **Configure the database**
   
   For MySQL (production):
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/edupress_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   ```
   
   For H2 (development):
   ```properties
   spring.datasource.url=jdbc:h2:mem:testdb
   spring.h2.console.enabled=true
   ```

3. **Set environment variables**
   ```bash
   export JWT_SECRET=mySecretKey
   export MAIL_USERNAME=your_email@gmail.com
   export MAIL_PASSWORD=your_email_password
   ```

4. **Build and run**
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

The application will start on `http://localhost:8080`

### Development with VS Code

Use the provided VS Code tasks:

- **Backend: Spring Boot Run** - Start the backend server
- **Backend: Maven Clean Compile** - Compile the project
- **Backend: Maven Install** - Build and install dependencies
- **Backend: Maven Test** - Run tests

### Database Setup

The application uses JPA/Hibernate for database operations. On first run, it will automatically create the required tables.

For H2 in-memory database (development):
- Access H2 console at: `http://localhost:8080/h2-console`
- JDBC URL: `jdbc:h2:mem:testdb`
- Username: `sa`
- Password: (leave empty)

## Configuration

Key configuration properties in `application.properties`:

```properties
# Server configuration
server.port=8080

# Database configuration
spring.datasource.url=jdbc:h2:mem:testdb
spring.jpa.hibernate.ddl-auto=update

# JWT configuration
app.jwt.secret=mySecretKey
app.jwt.expiration=86400000

# Mail configuration
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME}
spring.mail.password=${MAIL_PASSWORD}

# File upload configuration
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=10MB

# CORS configuration
app.cors.allowed-origins=http://localhost:3000,http://localhost:5173
```

## Security

The application uses JWT (JSON Web Tokens) for authentication:

- **Access Token**: Valid for 24 hours
- **Refresh Token**: Valid for 7 days
- **Roles**: STUDENT, INSTRUCTOR, ADMIN
- **Password Encryption**: BCrypt

## User Roles and Permissions

- **STUDENT**: Can enroll in courses, view content, leave reviews
- **INSTRUCTOR**: Can create and manage courses, create blog posts
- **ADMIN**: Full system access, user management, content moderation

## Testing

Run the test suite:

```bash
mvn test
```

## API Documentation

Once the application is running, you can access:
- Swagger UI: `http://localhost:8080/swagger-ui.html` (if configured)
- H2 Console: `http://localhost:8080/h2-console` (development only)

## Production Deployment

1. **Build production JAR**
   ```bash
   mvn clean package -Pprod
   ```

2. **Set production environment variables**
   ```bash
   export SPRING_PROFILES_ACTIVE=prod
   export DB_URL=jdbc:mysql://localhost:3306/edupress_prod
   export DB_USERNAME=prod_user
   export DB_PASSWORD=prod_password
   export JWT_SECRET=your_super_secret_key
   ```

3. **Run the application**
   ```bash
   java -jar target/edupress-backend-1.0.0.jar
   ```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

This project is licensed under the MIT License.
