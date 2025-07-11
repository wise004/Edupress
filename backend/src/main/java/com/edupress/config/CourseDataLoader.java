package com.edupress.config;

import com.edupress.model.*;
import com.edupress.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@Order(3) // Run after DataLoader (which is Order(1))
public class CourseDataLoader implements CommandLineRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("CourseDataLoader: Starting course data initialization...");
        
        // Check if data already exists
        if (categoryRepository.count() > 0 || courseRepository.count() > 0) {
            System.out.println("CourseDataLoader: Course data already exists, skipping initialization");
            return;
        }

        createSampleData();
        System.out.println("CourseDataLoader: Course data initialization completed");
    }

    private void createSampleData() {
        // Create categories first (independent of users)
        Category webDev = createCategory("Web Development", "Modern web development technologies", "#3B82F6", "💻");
        Category dataScience = createCategory("Data Science", "Data analysis and machine learning", "#EF4444", "📊");
        Category mobileDev = createCategory("Mobile Development", "iOS and Android app development", "#10B981", "📱");
        Category businessDev = createCategory("Business", "Business and entrepreneurship skills", "#F59E0B", "📈");
        Category designDev = createCategory("Design", "Graphic design and UI/UX", "#8B5CF6", "🎨");
        Category programmingDev = createCategory("Programming", "Programming languages and software development", "#06B6D4", "🔧");

        // Get instructor user for courses
        User instructor = userRepository.findByEmail("instructor@edupress.com").orElse(null);
        if (instructor == null) {
            System.out.println("CourseDataLoader: Instructor user not found, created categories only");
            return;
        }

        // Create courses
        Course reactCourse = createCourse(
            "Complete React Development Course",
            "Learn React from scratch with modern tools and best practices",
            "Master React development with hands-on projects and real-world examples. This comprehensive course covers everything from basic components to advanced state management.",
            Course.Level.INTERMEDIATE,
            new BigDecimal("99.99"),
            new BigDecimal("149.99"),
            webDev,
            instructor
        );

        Course pythonCourse = createCourse(
            "Python for Data Science",
            "Complete Python programming for data analysis and visualization",
            "Learn Python programming specifically for data science applications. Covers pandas, numpy, matplotlib, and machine learning basics.",
            Course.Level.BEGINNER,
            new BigDecimal("79.99"),
            new BigDecimal("129.99"),
            dataScience,
            instructor
        );

        Course flutterCourse = createCourse(
            "Flutter Mobile App Development",
            "Build cross-platform mobile apps with Flutter and Dart",
            "Create beautiful, natively compiled applications for mobile using Flutter. Learn Dart programming and Flutter widgets.",
            Course.Level.INTERMEDIATE,
            new BigDecimal("89.99"),
            new BigDecimal("139.99"),
            mobileDev,
            instructor
        );

        // Create lessons for React course
        createLesson("Introduction to React", "Getting started with React and its ecosystem", 15, 1, reactCourse, true);
        createLesson("Components and JSX", "Understanding React components and JSX syntax", 25, 2, reactCourse, true);
        createLesson("State Management", "Managing state in React applications", 30, 3, reactCourse, false);
        createLesson("React Hooks", "Modern React with hooks and functional components", 35, 4, reactCourse, false);

        // Create lessons for Python course
        createLesson("Python Basics", "Introduction to Python programming", 20, 1, pythonCourse, true);
        createLesson("Data Structures", "Lists, dictionaries, and data manipulation", 25, 2, pythonCourse, true);
        createLesson("Pandas and NumPy", "Data analysis with pandas and numerical computing", 40, 3, pythonCourse, false);
        createLesson("Data Visualization", "Creating charts and graphs with matplotlib", 35, 4, pythonCourse, false);

        // Create lessons for Flutter course
        createLesson("Flutter Introduction", "Getting started with Flutter development", 18, 1, flutterCourse, true);
        createLesson("Dart Programming", "Learning Dart language fundamentals", 22, 2, flutterCourse, true);
        createLesson("Widgets and UI", "Building user interfaces with Flutter widgets", 45, 3, flutterCourse, false);
        createLesson("State Management in Flutter", "Managing app state with Provider and Bloc", 40, 4, flutterCourse, false);

        System.out.println("CourseDataLoader: Created sample courses and lessons");
    }

    private Category createCategory(String name, String description, String color, String icon) {
        Category category = new Category();
        category.setName(name);
        category.setDescription(description);
        category.setColor(color);
        category.setIcon(icon);
        category.setIsActive(true);
        category.setCourseCount(0);
        return categoryRepository.save(category);
    }

    private Course createCourse(String title, String description, String fullDescription,
                               Course.Level level, BigDecimal price, BigDecimal originalPrice,
                               Category category, User instructor) {
        Course course = new Course();
        course.setTitle(title);
        course.setDescription(description);
        course.setFullDescription(fullDescription);
        course.setLevel(level);
        course.setPrice(price);
        course.setOriginalPrice(originalPrice);
        course.setCategory(category);
        course.setInstructor(instructor);
        course.setStatus(Course.Status.PUBLISHED);
        course.setLanguage("English");
        course.setRequirements("Basic computer knowledge");
        course.setWhatYouWillLearn("Practical skills and real-world projects");
        course.setEnrollmentCount(0);
        course.setAverageRating(4.5);
        course.setTotalRatings(0);
        
        return courseRepository.save(course);
    }

    private Lesson createLesson(String title, String description, int duration,
                               int orderIndex, Course course, boolean isFree) {
        Lesson lesson = new Lesson();
        lesson.setTitle(title);
        lesson.setDescription(description);
        lesson.setDuration(duration);
        lesson.setOrderIndex(orderIndex);
        lesson.setCourse(course);
        lesson.setIsFree(isFree);
        lesson.setContentText("This lesson covers " + title.toLowerCase());
        lesson.setVideoUrl("https://example.com/video/" + orderIndex);
        
        return lessonRepository.save(lesson);
    }
}
