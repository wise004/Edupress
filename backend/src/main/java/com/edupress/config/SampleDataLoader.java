package com.edupress.config;

import com.edupress.model.*;
import com.edupress.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@Order(5) // Run after users and categories are created (DataLoader is Order 4)
public class SampleDataLoader implements CommandLineRunner {

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
        System.out.println("SampleDataLoader: Starting sample course creation...");
        
        // Check if sample data already exists
        if (courseRepository.count() > 0) {
            System.out.println("SampleDataLoader: Sample courses already exist, skipping initialization");
            return;
        }

        createSampleCourses();
        System.out.println("SampleDataLoader: Sample course creation completed");
    }

    private void createSampleCourses() {
        // Get instructor user
        User instructor = userRepository.findByEmail("instructor@edupress.com").orElse(null);
        if (instructor == null) {
            System.out.println("SampleDataLoader: Instructor user not found, skipping course creation");
            return;
        }

        // Get categories
        Category webDev = categoryRepository.findByName("Web Development").orElse(null);
        Category dataScience = categoryRepository.findByName("Data Science").orElse(null);
        Category mobileDev = categoryRepository.findByName("Mobile Development").orElse(null);
        Category business = categoryRepository.findByName("Business").orElse(null);
        Category design = categoryRepository.findByName("Design").orElse(null);
        Category programming = categoryRepository.findByName("Programming").orElse(null);

        if (webDev == null || dataScience == null || mobileDev == null) {
            System.out.println("SampleDataLoader: Categories not found, skipping course creation");
            return;
        }

        // Create sample courses
        Course reactCourse = createCourse(
            "Complete React Development Course",
            "Learn React from scratch with modern tools and best practices",
            "Master React development with hands-on projects and real-world examples. This comprehensive course covers everything from basic components to advanced state management, hooks, context API, and modern React patterns. You'll build multiple projects including a task manager, e-commerce site, and social media dashboard.",
            Course.Level.INTERMEDIATE,
            new BigDecimal("99.99"),
            new BigDecimal("149.99"),
            webDev,
            instructor,
            "English",
            "Basic JavaScript knowledge, HTML & CSS fundamentals",
            "Build modern React applications, Master React Hooks, Understand state management, Deploy React apps"
        );

        Course pythonCourse = createCourse(
            "Python for Data Science Masterclass",
            "Complete Python programming for data analysis and machine learning",
            "Learn Python programming specifically for data science applications. This course covers pandas, numpy, matplotlib, seaborn, scikit-learn, and machine learning basics. You'll work with real datasets and build predictive models.",
            Course.Level.BEGINNER,
            new BigDecimal("79.99"),
            new BigDecimal("129.99"),
            dataScience,
            instructor,
            "English",
            "No prior programming experience needed",
            "Master Python fundamentals, Analyze data with pandas, Create visualizations, Build ML models"
        );

        Course flutterCourse = createCourse(
            "Flutter Mobile App Development",
            "Build cross-platform mobile apps with Flutter and Dart",
            "Create beautiful, natively compiled applications for mobile using Flutter. Learn Dart programming language, Flutter widgets, state management, navigation, and how to publish apps to app stores.",
            Course.Level.INTERMEDIATE,
            new BigDecimal("89.99"),
            new BigDecimal("139.99"),
            mobileDev,
            instructor,
            "English",
            "Basic programming knowledge, preferably OOP concepts",
            "Build cross-platform mobile apps, Master Flutter widgets, Understand Dart programming, Publish to app stores"
        );

        Course businessCourse = createCourse(
            "Digital Marketing & Business Growth",
            "Learn digital marketing strategies to grow your business",
            "Comprehensive course covering SEO, social media marketing, content marketing, email marketing, and analytics. Perfect for entrepreneurs and business owners looking to expand their online presence.",
            Course.Level.BEGINNER,
            new BigDecimal("69.99"),
            new BigDecimal("99.99"),
            business,
            instructor,
            "English",
            "No prior marketing experience needed",
            "Master digital marketing, Grow your business online, Understand SEO and social media, Analyze marketing metrics"
        );

        Course designCourse = createCourse(
            "UI/UX Design Fundamentals",
            "Learn user interface and user experience design principles",
            "Master the fundamentals of UI/UX design including design thinking, wireframing, prototyping, and design systems. Use tools like Figma and Adobe XD to create stunning user interfaces.",
            Course.Level.BEGINNER,
            new BigDecimal("59.99"),
            new BigDecimal("89.99"),
            design,
            instructor,
            "English",
            "Basic computer skills, creative mindset",
            "Design beautiful interfaces, Understand UX principles, Master design tools, Create design systems"
        );

        Course javaCourse = createCourse(
            "Java Programming Complete Course",
            "Learn Java programming from basics to advanced concepts",
            "Comprehensive Java course covering OOP principles, data structures, algorithms, Spring Framework, and enterprise application development. Build real-world projects and prepare for Java certifications.",
            Course.Level.INTERMEDIATE,
            new BigDecimal("109.99"),
            new BigDecimal("159.99"),
            programming,
            instructor,
            "English",
            "Basic programming knowledge helpful but not required",
            "Master Java programming, Understand OOP concepts, Build enterprise applications, Learn Spring Framework"
        );

        // Create lessons for each course
        createLessonsForCourse(reactCourse);
        createLessonsForCourse(pythonCourse);
        createLessonsForCourse(flutterCourse);
        createLessonsForCourse(businessCourse);
        createLessonsForCourse(designCourse);
        createLessonsForCourse(javaCourse);

        System.out.println("SampleDataLoader: Created 6 sample courses with lessons");
    }

    private Course createCourse(String title, String description, String fullDescription, 
                               Course.Level level, BigDecimal price, BigDecimal originalPrice, 
                               Category category, User instructor, String language, 
                               String requirements, String whatYouWillLearn) {
        Course course = new Course();
        course.setTitle(title);
        course.setDescription(description);
        course.setFullDescription(fullDescription);
        course.setLevel(level);
        course.setPrice(price);
        course.setOriginalPrice(originalPrice);
        course.setCategory(category);
        course.setInstructor(instructor);
        course.setLanguage(language);
        course.setRequirements(requirements);
        course.setWhatYouWillLearn(whatYouWillLearn);
        course.setStatus(Course.Status.PUBLISHED);
        course.setEnrollmentCount(0);
        course.setAverageRating(0.0);
        course.setTotalRatings(0);
        course.setDuration(0); // Will be calculated from lessons
        
        return courseRepository.save(course);
    }

    private void createLessonsForCourse(Course course) {
        String courseName = course.getTitle();
        
        if (courseName.contains("React")) {
            createLesson("Introduction to React", "Getting started with React and its ecosystem", 15, 1, course, true);
            createLesson("Components and JSX", "Understanding React components and JSX syntax", 25, 2, course, true);
            createLesson("State and Props", "Managing state and passing data with props", 30, 3, course, false);
            createLesson("React Hooks", "Modern React with hooks and functional components", 35, 4, course, false);
            createLesson("Context API", "Global state management with Context API", 40, 5, course, false);
            createLesson("Building a Complete App", "Putting it all together in a real project", 60, 6, course, false);
        } else if (courseName.contains("Python")) {
            createLesson("Python Basics", "Introduction to Python programming", 20, 1, course, true);
            createLesson("Data Structures", "Lists, dictionaries, and data manipulation", 25, 2, course, true);
            createLesson("Pandas and NumPy", "Data analysis with pandas and numerical computing", 40, 3, course, false);
            createLesson("Data Visualization", "Creating charts and graphs with matplotlib", 35, 4, course, false);
            createLesson("Machine Learning Basics", "Introduction to scikit-learn", 45, 5, course, false);
            createLesson("Real World Project", "Complete data science project", 50, 6, course, false);
        } else if (courseName.contains("Flutter")) {
            createLesson("Dart Programming", "Learning Dart language fundamentals", 30, 1, course, true);
            createLesson("Flutter Widgets", "Understanding Flutter's widget system", 35, 2, course, true);
            createLesson("Layouts and Navigation", "Creating layouts and navigation", 40, 3, course, false);
            createLesson("State Management", "Managing app state effectively", 45, 4, course, false);
            createLesson("API Integration", "Connecting to REST APIs", 35, 5, course, false);
            createLesson("Publishing Your App", "Deploy to app stores", 25, 6, course, false);
        } else if (courseName.contains("Marketing")) {
            createLesson("Digital Marketing Overview", "Introduction to digital marketing", 20, 1, course, true);
            createLesson("SEO Fundamentals", "Search engine optimization basics", 30, 2, course, true);
            createLesson("Social Media Marketing", "Leveraging social platforms", 35, 3, course, false);
            createLesson("Content Marketing", "Creating engaging content", 30, 4, course, false);
            createLesson("Email Marketing", "Building and managing email campaigns", 25, 5, course, false);
            createLesson("Analytics and Measurement", "Tracking and analyzing results", 30, 6, course, false);
        } else if (courseName.contains("Design")) {
            createLesson("Design Thinking", "Understanding the design process", 25, 1, course, true);
            createLesson("Wireframing", "Creating wireframes and mockups", 30, 2, course, true);
            createLesson("Prototyping", "Building interactive prototypes", 35, 3, course, false);
            createLesson("Design Systems", "Creating consistent design systems", 40, 4, course, false);
            createLesson("User Testing", "Testing and iterating designs", 30, 5, course, false);
            createLesson("Portfolio Project", "Building your design portfolio", 45, 6, course, false);
        } else if (courseName.contains("Java")) {
            createLesson("Java Fundamentals", "Introduction to Java programming", 30, 1, course, true);
            createLesson("Object-Oriented Programming", "OOP concepts in Java", 40, 2, course, true);
            createLesson("Data Structures and Algorithms", "Essential DS and algorithms", 50, 3, course, false);
            createLesson("Spring Framework", "Building enterprise applications", 60, 4, course, false);
            createLesson("Database Integration", "Working with databases in Java", 45, 5, course, false);
            createLesson("Enterprise Project", "Building a complete enterprise app", 90, 6, course, false);
        }
    }

    private Lesson createLesson(String title, String description, int duration, int orderIndex, Course course, boolean isFree) {
        Lesson lesson = new Lesson();
        lesson.setTitle(title);
        lesson.setDescription(description);
        lesson.setDuration(duration);
        lesson.setOrderIndex(orderIndex);
        lesson.setCourse(course);
        lesson.setIsFree(isFree);
        lesson.setVideoUrl("https://example.com/video/" + orderIndex); // Placeholder URL
        lesson.setContentText("This is the content for " + title + ". " + description);
        
        return lessonRepository.save(lesson);
    }
}
