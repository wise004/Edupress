package com.edupress.controller;

import com.edupress.model.Course;
import com.edupress.model.User;
import com.edupress.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/courses")
public class CourseController {

    @Autowired
    private CourseService courseService;

    @GetMapping
    public ResponseEntity<Page<Course>> getAllCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Course> courses = courseService.findAllCourses(pageable);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/published")
    public ResponseEntity<Page<Course>> getPublishedCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Course> courses = courseService.findPublishedCourses(pageable);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Optional<Course> course = courseService.findById(id);
        return course.map(ResponseEntity::ok)
                     .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Course>> searchCourses(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Course> courses = courseService.searchCourses(query, pageable);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/category/{categoryId}")
    public ResponseEntity<Page<Course>> getCoursesByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Course> courses = courseService.findCoursesByCategory(categoryId, pageable);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/popular")
    public ResponseEntity<List<Course>> getPopularCourses() {
        List<Course> courses = courseService.findPopularCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Course>> getFeaturedCourses() {
        List<Course> courses = courseService.findFeaturedCourses();
        return ResponseEntity.ok(courses);
    }

    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        Course createdCourse = courseService.createCourse(course);
        return ResponseEntity.ok(createdCourse);
    }

    @PostMapping("/free")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Course> createFreeCourse(@RequestBody Course course) {
        // Set course as free
        course.setIsFree(true);
        course.setPrice(java.math.BigDecimal.ZERO);
        Course createdCourse = courseService.createCourse(course);
        return ResponseEntity.ok(createdCourse);
    }

    @GetMapping("/free")
    public ResponseEntity<Page<Course>> getFreeCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Course> courses = courseService.findFreeCourses(pageable);
        return ResponseEntity.ok(courses);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @RequestBody Course courseDetails) {
        try {
            Course updatedCourse = courseService.updateCourse(id, courseDetails);
            return ResponseEntity.ok(updatedCourse);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        try {
            courseService.deleteCourse(id);
            return ResponseEntity.ok("Course deleted successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/publish")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Course> publishCourse(@PathVariable Long id) {
        try {
            Course publishedCourse = courseService.publishCourse(id);
            return ResponseEntity.ok(publishedCourse);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/unpublish")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Course> unpublishCourse(@PathVariable Long id) {
        try {
            Course unpublishedCourse = courseService.unpublishCourse(id);
            return ResponseEntity.ok(unpublishedCourse);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/stats/total")
    public ResponseEntity<Long> getTotalCourses() {
        long total = courseService.getTotalCourses();
        return ResponseEntity.ok(total);
    }

    @GetMapping("/stats/published")
    public ResponseEntity<Long> getPublishedCoursesCount() {
        long count = courseService.getPublishedCoursesCount();
        return ResponseEntity.ok(count);
    }

    // Enhanced instructor course management
    @GetMapping("/instructor/{instructorId}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Page<Course>> getCoursesByInstructor(
            @PathVariable Long instructorId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Course> courses = courseService.findCoursesByInstructor(instructorId, pageable);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/my-courses")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Page<Course>> getMyInstructorCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Course> courses = courseService.findCurrentInstructorCourses(pageable);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/enrolled")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Page<Course>> getEnrolledCourses(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Course> courses = courseService.findEnrolledCourses(pageable);
        return ResponseEntity.ok(courses);
    }

    @PostMapping("/{courseId}/enroll")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> enrollInCourse(@PathVariable Long courseId) {
        try {
            courseService.enrollStudent(courseId);
            return ResponseEntity.ok("Successfully enrolled in course!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{courseId}/unenroll")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> unenrollFromCourse(@PathVariable Long courseId) {
        try {
            courseService.unenrollStudent(courseId);
            return ResponseEntity.ok("Successfully unenrolled from course!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{courseId}/students")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Page<User>> getCourseStudents(
            @PathVariable Long courseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> students = courseService.getCourseStudents(courseId, pageable);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/{courseId}/progress")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getCourseProgress(@PathVariable Long courseId) {
        try {
            Object progress = courseService.getCourseProgress(courseId);
            return ResponseEntity.ok(progress);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping("/{courseId}/rate")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> rateCourse(@PathVariable Long courseId, @RequestParam int rating, @RequestParam(required = false) String review) {
        try {
            courseService.rateCourse(courseId, rating, review);
            return ResponseEntity.ok("Course rated successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{courseId}/reviews")
    public ResponseEntity<Page<?>> getCourseReviews(
            @PathVariable Long courseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<?> reviews = courseService.getCourseReviews(courseId, pageable);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping("/{courseId}/duplicate")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Course> duplicateCourse(@PathVariable Long courseId) {
        try {
            Course duplicatedCourse = courseService.duplicateCourse(courseId);
            return ResponseEntity.ok(duplicatedCourse);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
