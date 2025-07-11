package com.edupress.controller;

import com.edupress.model.Lesson;
import com.edupress.service.LessonService;
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
@RequestMapping("/api/lessons")
public class LessonController {

    @Autowired
    private LessonService lessonService;

    // Lesson CRUD operations
    @GetMapping
    public ResponseEntity<Page<Lesson>> getAllLessons(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Lesson> lessons = lessonService.findAll(pageable);
        return ResponseEntity.ok(lessons);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Lesson> getLessonById(@PathVariable Long id) {
        Optional<Lesson> lesson = lessonService.findById(id);
        return lesson.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Lesson>> getLessonsByCourse(@PathVariable Long courseId) {
        List<Lesson> lessons = lessonService.findByCourseId(courseId);
        return ResponseEntity.ok(lessons);
    }

    @GetMapping("/instructor/{instructorId}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Lesson>> getLessonsByInstructor(@PathVariable Long instructorId) {
        List<Lesson> lessons = lessonService.findByInstructorId(instructorId);
        return ResponseEntity.ok(lessons);
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Lesson>> searchLessons(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Lesson> lessons = lessonService.searchLessons(query, pageable);
        return ResponseEntity.ok(lessons);
    }

    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Lesson> createLesson(@RequestBody Lesson lesson) {
        Lesson createdLesson = lessonService.createLesson(lesson);
        return ResponseEntity.ok(createdLesson);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Lesson> updateLesson(@PathVariable Long id, @RequestBody Lesson lessonDetails) {
        try {
            Lesson updatedLesson = lessonService.updateLesson(id, lessonDetails);
            return ResponseEntity.ok(updatedLesson);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteLesson(@PathVariable Long id) {
        try {
            lessonService.deleteLesson(id);
            return ResponseEntity.ok("Lesson deleted successfully!");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/course/{courseId}/count")
    public ResponseEntity<Long> getLessonCountByCourse(@PathVariable Long courseId) {
        long count = lessonService.countByCourseId(courseId);
        return ResponseEntity.ok(count);
    }

    @PutMapping("/{id}/reorder")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Lesson> reorderLesson(@PathVariable Long id, @RequestParam int newOrder) {
        try {
            Lesson reorderedLesson = lessonService.reorderLesson(id, newOrder);
            return ResponseEntity.ok(reorderedLesson);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Mark lesson as completed for a student
    @PostMapping("/{id}/complete")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> completeLesson(@PathVariable Long id, @RequestParam Long userId) {
        try {
            lessonService.markLessonAsCompleted(id, userId);
            return ResponseEntity.ok("Lesson marked as completed!");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get lesson completion status for a user
    @GetMapping("/{id}/completion-status")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Boolean> getLessonCompletionStatus(@PathVariable Long id, @RequestParam Long userId) {
        boolean isCompleted = lessonService.isLessonCompletedByUser(id, userId);
        return ResponseEntity.ok(isCompleted);
    }
}
