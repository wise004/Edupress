package com.edupress.service;

import com.edupress.model.Course;
import com.edupress.model.User;
import com.edupress.repository.CourseRepository;
import com.edupress.security.UserPrincipal;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class CourseService {

    @Autowired
    private CourseRepository courseRepository;

    public Course createCourse(Course course) {
        course.setCreatedAt(LocalDateTime.now());
        course.setUpdatedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    public Optional<Course> findById(Long id) {
        return courseRepository.findById(id);
    }

    public Page<Course> findAllCourses(Pageable pageable) {
        return courseRepository.findAll(pageable);
    }

    public Page<Course> findPublishedCourses(Pageable pageable) {
        return courseRepository.findPublishedCourses(pageable);
    }

    public Page<Course> findFreeCourses(Pageable pageable) {
        return courseRepository.findFreeCourses(pageable);
    }

    public Page<Course> findCoursesByInstructor(User instructor, Pageable pageable) {
        return courseRepository.findByInstructor(instructor, pageable);
    }

    public Page<Course> findCoursesByCategory(Long categoryId, Pageable pageable) {
        return courseRepository.findByCategoryId(categoryId, pageable);
    }

    public Page<Course> searchCourses(String searchTerm, Pageable pageable) {
        return courseRepository.findPublishedCoursesBySearchTerm(searchTerm, pageable);
    }

    public Course updateCourse(Long id, Course courseDetails) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));

        course.setTitle(courseDetails.getTitle());
        course.setDescription(courseDetails.getDescription());
        course.setPrice(courseDetails.getPrice());
        course.setDuration(courseDetails.getDuration());
        course.setLevel(courseDetails.getLevel());
        course.setThumbnailImage(courseDetails.getThumbnailImage());
        course.setCategory(courseDetails.getCategory());
        course.setUpdatedAt(LocalDateTime.now());

        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        courseRepository.delete(course);
    }

    public Course publishCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        course.setStatus(Course.Status.PUBLISHED);
        course.setUpdatedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    public Course unpublishCourse(Long id) {
        Course course = courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
        course.setStatus(Course.Status.DRAFT);
        course.setUpdatedAt(LocalDateTime.now());
        return courseRepository.save(course);
    }

    public List<Course> findPopularCourses() {
        return courseRepository.findTopCoursesByEnrollment(
                org.springframework.data.domain.PageRequest.of(0, 10));
    }

    public List<Course> findFeaturedCourses() {
        return courseRepository.findTopCoursesByRating(
                org.springframework.data.domain.PageRequest.of(0, 10));
    }

    public long getTotalCourses() {
        return courseRepository.count();
    }

    public long getPublishedCoursesCount() {
        return courseRepository.countPublishedCourses();
    }

    public long getFreeCoursesCount() {
        return courseRepository.countFreeCourses();
    }

    public long getPaidCoursesCount() {
        return courseRepository.countPaidCourses();
    }

    public long getInstructorCoursesCount(Long instructorId) {
        return courseRepository.countByInstructorId(instructorId);
    }

    public long getInstructorPublishedCoursesCount(Long instructorId) {
        return courseRepository.countByInstructorIdAndStatus(instructorId, Course.Status.PUBLISHED);
    }

    public List<Course> getInstructorRecentCourses(Long instructorId, int limit) {
        return courseRepository.findTop5ByInstructorIdOrderByCreatedAtDesc(instructorId);
    }

    public List<Course> getInstructorTopCourses(Long instructorId, int limit) {
        return courseRepository.findTop5ByInstructorIdOrderByEnrollmentCountDesc(instructorId);
    }

    public List<Course> getTopRatedCourses(int limit) {
        return courseRepository.findTopCoursesByRating(org.springframework.data.domain.PageRequest.of(0, limit));
    }

    // Enhanced instructor and student course management methods
    public Page<Course> findCoursesByInstructor(Long instructorId, Pageable pageable) {
        return courseRepository.findByInstructorId(instructorId, pageable);
    }

    public Page<Course> findCurrentInstructorCourses(Pageable pageable) {
        // Get the current authenticated user from security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal)) {
            throw new RuntimeException("Current instructor not found in security context");
        }
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User currentUser = userPrincipal.getUser();
        
        // Verify the user is an instructor
        if (currentUser.getRole() != User.Role.INSTRUCTOR) {
            throw new RuntimeException("Current user is not an instructor");
        }
        
        return courseRepository.findByInstructor(currentUser, pageable);
    }

    public Page<Course> findEnrolledCourses(Pageable pageable) {
        // Get the current authenticated user from security context
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof UserPrincipal)) {
            throw new RuntimeException("Current student not found in security context");
        }
        
        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User currentUser = userPrincipal.getUser();
        
        // Verify the user is a student
        if (currentUser.getRole() != User.Role.STUDENT) {
            throw new RuntimeException("Current user is not a student");
        }
        
        // For now, return an empty page since enrollment logic is not yet implemented
        // TODO: Implement enrollment repository and return actual enrolled courses
        return Page.empty(pageable);
    }

    public void enrollStudent(Long courseId) {
        // In a real implementation, you'd get the current user from security context
        // and create an enrollment record
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        
        if (course.getStatus() != Course.Status.PUBLISHED) {
            throw new RuntimeException("Cannot enroll in unpublished course");
        }
        
        // Create enrollment logic here
        throw new RuntimeException("Enrollment logic not yet implemented");
    }

    public void unenrollStudent(Long courseId) {
        // In a real implementation, you'd get the current user from security context
        // and remove the enrollment record
        throw new RuntimeException("Unenrollment logic not yet implemented");
    }

    public Page<User> getCourseStudents(Long courseId, Pageable pageable) {
        // In a real implementation, you'd get all students enrolled in the course
        throw new RuntimeException("Get course students logic not yet implemented");
    }

    public Object getCourseProgress(Long courseId) {
        final Long id = courseId;
        // In a real implementation, you'd calculate the student's progress in the course
        return new Object() {
            public final Long courseId = id;
            public final int completedLessons = 0;
            public final int totalLessons = 10;
            public final double progressPercentage = 0.0;
        };
    }

    public void rateCourse(Long courseId, int rating, String review) {
        if (rating < 1 || rating > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }
        
        courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        
        // In a real implementation, you'd save the rating and review
        throw new RuntimeException("Rating logic not yet implemented");
    }

    public Page<?> getCourseReviews(Long courseId, Pageable pageable) {
        // In a real implementation, you'd get all reviews for the course
        throw new RuntimeException("Get course reviews logic not yet implemented");
    }

    public Course duplicateCourse(Long courseId) {
        Course originalCourse = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        
        Course duplicatedCourse = new Course();
        duplicatedCourse.setTitle(originalCourse.getTitle() + " (Copy)");
        duplicatedCourse.setDescription(originalCourse.getDescription());
        duplicatedCourse.setPrice(originalCourse.getPrice());
        duplicatedCourse.setDuration(originalCourse.getDuration());
        duplicatedCourse.setLevel(originalCourse.getLevel());
        duplicatedCourse.setThumbnailImage(originalCourse.getThumbnailImage());
        duplicatedCourse.setCategory(originalCourse.getCategory());
        duplicatedCourse.setInstructor(originalCourse.getInstructor());
        duplicatedCourse.setStatus(Course.Status.DRAFT);
        duplicatedCourse.setCreatedAt(LocalDateTime.now());
        duplicatedCourse.setUpdatedAt(LocalDateTime.now());
        
        return courseRepository.save(duplicatedCourse);
    }
}
