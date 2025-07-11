# EduPress Deployment Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Java 21+ and Maven 3.6+
- MySQL 8.0+ (optional, H2 available for development)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd EduPress
```

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Start development server
npm run dev
# Frontend: http://localhost:5173
```

### 3. Backend Setup
```bash
cd Backend

# Configure application.properties
# Edit src/main/resources/application.properties

# Start Spring Boot
mvn spring-boot:run
# Backend: http://localhost:8081
```

## 🌐 Production Deployment

### Frontend (React)
```bash
# Build for production
npm run build

# Deploy dist/ folder to:
# - Vercel, Netlify, or AWS S3 + CloudFront
# - nginx with proper routing for SPA
```

### Backend (Spring Boot)
```bash
# Build JAR
mvn clean package

# Run in production
java -jar target/edupress-backend-1.0.0.jar

# Or deploy to:
# - AWS Elastic Beanstalk
# - Heroku
# - Docker container
```

## 🔧 Configuration

### Environment Variables

#### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:8081/api
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
VITE_PAYME_MERCHANT_ID=your_merchant_id
```

#### Backend (application.properties)
```properties
# Database
spring.datasource.url=jdbc:mysql://localhost:3306/edupress
spring.datasource.username=root
spring.datasource.password=password

# File Upload
spring.servlet.multipart.max-file-size=140MB
spring.servlet.multipart.max-request-size=140MB

# JWT
app.jwtSecret=your-secret-key
app.jwtExpirationMs=86400000

# Payme
payme.merchant.id=your_merchant_id
payme.merchant.key=your_merchant_key
```

## 🔐 Security Setup

### SSL/HTTPS
```bash
# Generate SSL certificate
certbot --nginx -d yourdomain.com

# Or use CloudFlare for SSL termination
```

### Database Security
```sql
-- Create dedicated database user
CREATE USER 'edupress'@'%' IDENTIFIED BY 'strong-password';
GRANT ALL PRIVILEGES ON edupress.* TO 'edupress'@'%';
FLUSH PRIVILEGES;
```

## 📊 Monitoring

### Application Monitoring
```bash
# Add to application.properties
management.endpoints.web.exposure.include=health,info,metrics
management.endpoint.health.show-details=always
```

### Logging
```bash
# Configure logback-spring.xml for structured logging
# Send logs to CloudWatch, Splunk, or ELK stack
```

## 🎯 Testing

### Frontend Testing
```bash
npm run test
npm run e2e
```

### Backend Testing
```bash
mvn test
mvn integration-test
```

## 📦 Docker Deployment

### Dockerfile (Frontend)
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

### Dockerfile (Backend)
```dockerfile
FROM openjdk:21-jdk-slim
COPY target/edupress-backend-1.0.0.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

### Docker Compose
```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "3000:80"
    environment:
      - VITE_API_BASE_URL=http://backend:8080/api

  backend:
    build: ./Backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_PROFILES_ACTIVE=production
    depends_on:
      - database

  database:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: edupress
      MYSQL_ROOT_PASSWORD: rootpassword
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy EduPress
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Build Frontend
        run: |
          npm ci
          npm run build
          
      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          java-version: '21'
          
      - name: Build Backend
        run: |
          cd Backend
          mvn clean package
          
      - name: Deploy to Production
        # Add your deployment steps here
```

## 📈 Performance Optimization

### Frontend Optimization
```bash
# Code splitting
# Lazy loading
# Image optimization
# Bundle analysis
npm run build --analyze
```

### Backend Optimization
```properties
# Connection pooling
spring.datasource.hikari.maximum-pool-size=20

# Caching
spring.cache.type=redis
spring.redis.host=localhost
spring.redis.port=6379
```

## 🛠 Maintenance

### Database Backups
```bash
# Automated MySQL backups
mysqldump -u root -p edupress > backup_$(date +%Y%m%d).sql

# S3 backup
aws s3 cp backup.sql s3://your-backup-bucket/
```

### Updates
```bash
# Security updates
npm audit fix
mvn versions:display-dependency-updates

# Regular maintenance
# - Monitor logs
# - Check performance metrics
# - Update dependencies
# - Review security advisories
```

## 🚨 Troubleshooting

### Common Issues

#### Frontend build fails
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Backend won't start
```bash
# Check Java version
java -version

# Check port conflicts
netstat -tlnp | grep 8080
```

#### Database connection issues
```bash
# Test connection
mysql -h localhost -u root -p edupress

# Check configuration
cat src/main/resources/application.properties
```

### Performance Issues
```bash
# Monitor memory usage
free -h
top

# Check database performance
SHOW FULL PROCESSLIST;
EXPLAIN SELECT * FROM courses;
```

## 📞 Support

For deployment support:
1. Check logs first: `tail -f application.log`
2. Verify configuration files
3. Test API endpoints manually
4. Check database connections
5. Monitor resource usage

## 🎯 Production Checklist

- [ ] SSL certificate configured
- [ ] Database secured and backed up
- [ ] Environment variables set
- [ ] Payment gateways configured
- [ ] Monitoring and logging active
- [ ] Error tracking implemented
- [ ] Performance optimized
- [ ] Security hardened
- [ ] Documentation updated
- [ ] Team trained on operations

Your EduPress platform is ready for production! 🚀
