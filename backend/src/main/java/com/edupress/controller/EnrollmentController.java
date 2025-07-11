package com.edupress.controller;

import com.edupress.model.User;
import com.edupress.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {

    @Autowired
    private EnrollmentService enrollmentService;

    // Student endpoints
    @PostMapping("/enroll/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> enrollInCourse(@PathVariable Long courseId) {
        try {
            enrollmentService.enrollInCourse(courseId);
            return ResponseEntity.ok("Successfully enrolled in course!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/unenroll/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> unenrollFromCourse(@PathVariable Long courseId) {
        try {
            enrollmentService.unenrollFromCourse(courseId);
            return ResponseEntity.ok("Successfully unenrolled from course!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-enrollments")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getMyEnrollments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(enrollmentService.getStudentEnrollments(pageable));
    }

    @GetMapping("/check/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Boolean> checkEnrollment(@PathVariable Long courseId) {
        boolean isEnrolled = enrollmentService.isEnrolled(courseId);
        return ResponseEntity.ok(isEnrolled);
    }

    @GetMapping("/progress/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> getCourseProgress(@PathVariable Long courseId) {
        try {
            Object progress = enrollmentService.getCourseProgress(courseId);
            return ResponseEntity.ok(progress);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Instructor endpoints
    @GetMapping("/course/{courseId}/students")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Page<User>> getCourseStudents(
            @PathVariable Long courseId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<User> students = enrollmentService.getCourseStudents(courseId, pageable);
        return ResponseEntity.ok(students);
    }

    @GetMapping("/course/{courseId}/stats")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> getCourseEnrollmentStats(@PathVariable Long courseId) {
        return ResponseEntity.ok(enrollmentService.getCourseEnrollmentStats(courseId));
    }

    // Admin endpoints
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllEnrollments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(enrollmentService.getAllEnrollments(pageable));
    }

    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getEnrollmentStats() {
        return ResponseEntity.ok(enrollmentService.getGlobalEnrollmentStats());
    }

    @DeleteMapping("/{enrollmentId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> removeEnrollment(@PathVariable Long enrollmentId) {
        try {
            enrollmentService.removeEnrollment(enrollmentId);
            return ResponseEntity.ok("Enrollment removed successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
