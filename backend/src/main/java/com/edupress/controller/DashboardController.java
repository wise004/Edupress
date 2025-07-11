package com.edupress.controller;

import com.edupress.dto.response.StudentDashboardResponse;
import com.edupress.dto.response.InstructorDashboardResponse;
import com.edupress.model.User;
import com.edupress.service.*;
import com.edupress.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private CourseService courseService;

    @Autowired
    private UserService userService;

    @Autowired
    private QuizService quizService;

    @Autowired
    private AssignmentService assignmentService;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EnrollmentService enrollmentService;

    @Autowired
    private CertificateService certificateService;

    @Autowired
    private LessonService lessonService;

    // Test endpoint - no authentication required
    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        return ResponseEntity.ok("Backend is working! Current time: " + java.time.LocalDateTime.now());
    }

    // Admin Dashboard
    @GetMapping("/admin/overview")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminOverview() {
        return ResponseEntity.ok(new Object() {
            public final long totalUsers = userService.getTotalUsers();
            public final long totalCourses = courseService.getTotalCourses();
            public final long publishedCourses = courseService.getPublishedCoursesCount();
            public final long freeCourses = courseService.getFreeCoursesCount();
            public final long paidCourses = courseService.getPaidCoursesCount();
            public final long totalStudents = userService.countUsersByRole(User.Role.STUDENT);
            public final long totalInstructors = userService.countUsersByRole(User.Role.INSTRUCTOR);
            public final long totalAdmins = userService.countUsersByRole(User.Role.ADMIN);
            public final Object userStats = userService.getUserStatsByRole();
            public final Object enrollmentStats = enrollmentService.getGlobalEnrollmentStats();
            public final Object notificationStats = notificationService.getNotificationStats();
        });
    }

    @GetMapping("/admin/recent-activity")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAdminRecentActivity() {
        return ResponseEntity.ok(new Object() {
            public final String message = "Recent activity data would be implemented here";
            // In real implementation, you'd fetch recent enrollments, new users, course publications, etc.
        });
    }

    @GetMapping("/admin/revenue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getRevenueStats() {
        return ResponseEntity.ok(new Object() {
            public final double totalRevenue = 0.0; // paymentService.getTotalRevenue();
            public final double monthlyRevenue = 0.0; // paymentService.getMonthlyRevenue();
            public final String message = "Revenue stats would be implemented with PaymentService";
        });
    }

    // Instructor Dashboard
    @GetMapping("/instructor/overview")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<InstructorDashboardResponse> getInstructorOverview(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Long instructorId = userPrincipal.getId();
        
        InstructorDashboardResponse response = new InstructorDashboardResponse();
        response.setTotalCourses(courseService.getInstructorCoursesCount(instructorId));
        response.setPublishedCourses(courseService.getInstructorPublishedCoursesCount(instructorId));
        response.setTotalStudents(enrollmentService.getInstructorStudentsCount(instructorId));
        response.setTotalRevenue((long) paymentService.getInstructorEarnings(instructorId));
        
        // Convert Course lists to String lists for the DTO
        List<String> recentCourseNames = courseService.getInstructorRecentCourses(instructorId, 5)
            .stream().map(course -> course.getTitle()).collect(Collectors.toList());
        response.setTopCourses(recentCourseNames);
        
        List<String> topCourseNames = courseService.getInstructorTopCourses(instructorId, 5)
            .stream().map(course -> course.getTitle()).collect(Collectors.toList());
        response.setRecentEnrollments(topCourseNames);
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/instructor/my-courses-stats")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<?> getInstructorCoursesStats() {
        return ResponseEntity.ok(new Object() {
            public final String message = "Instructor courses statistics would be implemented here";
        });
    }

    @GetMapping("/instructor/students")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<?> getInstructorStudents() {
        return ResponseEntity.ok(new Object() {
            public final String message = "Instructor students overview would be implemented here";
        });
    }

    // Student Dashboard
    @GetMapping("/student/overview")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<StudentDashboardResponse> getStudentOverview(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Long studentId = userPrincipal.getId();
        
        StudentDashboardResponse response = new StudentDashboardResponse();
        response.setTotalEnrolledCourses(enrollmentService.getStudentEnrolledCoursesCount(studentId));
        response.setCompletedCourses(enrollmentService.getStudentCompletedCoursesCount(studentId));
        response.setInProgressCourses(enrollmentService.getStudentInProgressCoursesCount(studentId));
        response.setCertificatesEarned(certificateService.getStudentCertificatesCount(studentId));
        
        // Convert course objects to String lists for the DTO
        List<String> recentCourseNames = enrollmentService.getStudentRecentCourses(studentId, 5)
            .stream().map(course -> course.getTitle()).collect(Collectors.toList());
        response.setRecentCourses(recentCourseNames);
        
        // Set upcoming deadlines as empty for now
        response.setUpcomingDeadlines(List.of());
        response.setAverageProgress(enrollmentService.getStudentOverallProgress(studentId));
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/student/progress")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getStudentProgress() {
        return ResponseEntity.ok(new Object() {
            public final String message = "Student progress across all courses would be implemented here";
        });
    }

    @GetMapping("/student/achievements")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getStudentAchievements() {
        return ResponseEntity.ok(new Object() {
            public final String message = "Student achievements and certificates would be implemented here";
        });
    }

    // Common endpoints for all authenticated users
    @GetMapping("/notifications/recent")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getRecentNotifications(Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userPrincipal.getUser();
        
        return ResponseEntity.ok(new Object() {
            public final Object notifications = notificationService.getRecentNotifications(user, 10);
            public final long unreadCount = notificationService.getUnreadNotificationsCount(user);
        });
    }

    @GetMapping("/profile/completion")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getProfileCompletion() {
        return ResponseEntity.ok(new Object() {
            public final double completionPercentage = 85.0;
            public final String message = "Profile completion percentage would be calculated here";
        });
    }

    @GetMapping("/quick-stats")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getQuickStats() {
        return ResponseEntity.ok(new Object() {
            public final String message = "Quick stats based on user role would be implemented here";
        });
    }

    // Public stats - no authentication required (for testing)
    @GetMapping("/public/stats")
    public ResponseEntity<?> getPublicStats() {
        return ResponseEntity.ok(new Object() {
            public final String message = "Backend is working!";
            public final String timestamp = java.time.LocalDateTime.now().toString();
            public final boolean apiWorking = true;
        });
    }

    // Comprehensive dashboard data endpoint for optimized frontend loading
    @GetMapping("/comprehensive/{role}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getComprehensiveDashboard(@PathVariable String role, Authentication authentication) {
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        Long userId = userPrincipal.getId();
        
        switch (role.toUpperCase()) {
            case "ADMIN":
                return ResponseEntity.ok(new Object() {
                    public final Object overview = getAdminOverview().getBody();
                    public final Object userStats = userService.getUserStatsByRole();
                    public final Object courseStats = new Object() {
                        public final long total = courseService.getTotalCourses();
                        public final long published = courseService.getPublishedCoursesCount();
                    };
                    public final Object recentActivity = new Object() {
                        public final String message = "Recent user registrations, course creations, enrollments";
                    };
                });
                
            case "INSTRUCTOR":
                return ResponseEntity.ok(new Object() {
                    public final Object overview = getInstructorOverview(authentication).getBody();
                    public final Object courseStats = new Object() {
                        public final long totalCourses = courseService.getInstructorCoursesCount(userId);
                        public final long publishedCourses = courseService.getInstructorPublishedCoursesCount(userId);
                    };
                    public final Object recentActivity = new Object() {
                        public final String message = "Recent enrollments, student activity, quiz submissions";
                    };
                });
                
            case "STUDENT":
                return ResponseEntity.ok(new Object() {
                    public final Object overview = getStudentOverview(authentication).getBody();
                    public final Object progress = new Object() {
                        public final double overall = enrollmentService.getStudentOverallProgress(userId);
                        public final long enrolled = enrollmentService.getStudentEnrolledCoursesCount(userId);
                        public final long completed = enrollmentService.getStudentCompletedCoursesCount(userId);
                    };
                    public final Object achievements = new Object() {
                        public final long certificates = certificateService.getStudentCertificatesCount(userId);
                        public final String message = "Student achievements and milestones";
                    };
                });
                
            default:
                return ResponseEntity.badRequest().body("Invalid role: " + role);
        }
    }
}
