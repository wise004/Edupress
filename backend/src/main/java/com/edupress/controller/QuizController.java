package com.edupress.controller;

import com.edupress.model.*;
import com.edupress.service.QuizService;
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
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    // Quiz CRUD operations
    @GetMapping
    public ResponseEntity<Page<Quiz>> getAllQuizzes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Quiz> quizzes = quizService.findAll(pageable);
        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Quiz> getQuizById(@PathVariable Long id) {
        Optional<Quiz> quiz = quizService.findById(id);
        return quiz.map(ResponseEntity::ok)
                   .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<List<Quiz>> getQuizzesByLesson(@PathVariable Long lessonId) {
        List<Quiz> quizzes = quizService.findByLesson(lessonId);
        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Quiz>> getQuizzesByCourse(@PathVariable Long courseId) {
        List<Quiz> quizzes = quizService.findByCourse(courseId);
        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/instructor/{instructorId}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Quiz>> getQuizzesByInstructor(@PathVariable Long instructorId) {
        List<Quiz> quizzes = quizService.findByInstructor(instructorId);
        return ResponseEntity.ok(quizzes);
    }

    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Quiz> createQuiz(@RequestBody Quiz quiz) {
        Quiz createdQuiz = quizService.createQuiz(quiz);
        return ResponseEntity.ok(createdQuiz);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Quiz> updateQuiz(@PathVariable Long id, @RequestBody Quiz quizDetails) {
        try {
            Quiz updatedQuiz = quizService.updateQuiz(id, quizDetails);
            return ResponseEntity.ok(updatedQuiz);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteQuiz(@PathVariable Long id) {
        try {
            quizService.deleteQuiz(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Quiz>> searchQuizzes(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Quiz> quizzes = quizService.searchQuizzes(query, pageable);
        return ResponseEntity.ok(quizzes);
    }

    // Quiz attempt operations
    @PostMapping("/{quizId}/start")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<QuizAttempt> startQuizAttempt(
            @PathVariable Long quizId,
            @RequestParam Long userId) {
        try {
            QuizAttempt attempt = quizService.startQuizAttempt(quizId, userId);
            return ResponseEntity.ok(attempt);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/attempts/{attemptId}/submit")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<QuizAttempt> submitQuizAttempt(
            @PathVariable Long attemptId,
            @RequestParam String answers,
            @RequestParam Integer timeSpent) {
        try {
            QuizAttempt attempt = quizService.submitQuizAttempt(attemptId, answers, timeSpent);
            return ResponseEntity.ok(attempt);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/attempts/user/{userId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<QuizAttempt>> getUserAttempts(@PathVariable Long userId) {
        List<QuizAttempt> attempts = quizService.getAttemptsByUser(userId);
        return ResponseEntity.ok(attempts);
    }

    @GetMapping("/{quizId}/attempts")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<QuizAttempt>> getQuizAttempts(@PathVariable Long quizId) {
        List<QuizAttempt> attempts = quizService.getAttemptsByQuiz(quizId);
        return ResponseEntity.ok(attempts);
    }

    @GetMapping("/{quizId}/attempts/user/{userId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<QuizAttempt>> getUserQuizAttempts(
            @PathVariable Long quizId,
            @PathVariable Long userId) {
        List<QuizAttempt> attempts = quizService.getAttemptsByUserAndQuiz(userId, quizId);
        return ResponseEntity.ok(attempts);
    }

    // Quiz statistics
    @GetMapping("/{quizId}/stats/average-score")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Double> getAverageScore(@PathVariable Long quizId) {
        Double averageScore = quizService.getAverageScore(quizId);
        return ResponseEntity.ok(averageScore != null ? averageScore : 0.0);
    }

    @GetMapping("/{quizId}/stats/passed-count")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Long> getPassedCount(@PathVariable Long quizId) {
        long passedCount = quizService.getPassedCount(quizId);
        return ResponseEntity.ok(passedCount);
    }

    @GetMapping("/course/{courseId}/count")
    public ResponseEntity<Long> getQuizCountByCourse(@PathVariable Long courseId) {
        long count = quizService.countActiveByCourse(courseId);
        return ResponseEntity.ok(count);
    }

    // Enhanced quiz management for instructors and admins
    @PostMapping("/bulk-create")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> createBulkQuizzes(@RequestBody List<Quiz> quizzes) {
        try {
            List<Quiz> createdQuizzes = quizService.createBulkQuizzes(quizzes);
            return ResponseEntity.ok(createdQuizzes);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{quizId}/duplicate")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Quiz> duplicateQuiz(@PathVariable Long quizId) {
        try {
            Quiz duplicatedQuiz = quizService.duplicateQuiz(quizId);
            return ResponseEntity.ok(duplicatedQuiz);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{quizId}/activate")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Quiz> activateQuiz(@PathVariable Long quizId) {
        try {
            Quiz quiz = quizService.activateQuiz(quizId);
            return ResponseEntity.ok(quiz);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{quizId}/deactivate")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Quiz> deactivateQuiz(@PathVariable Long quizId) {
        try {
            Quiz quiz = quizService.deactivateQuiz(quizId);
            return ResponseEntity.ok(quiz);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{quizId}/detailed-stats")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> getDetailedQuizStats(@PathVariable Long quizId) {
        return ResponseEntity.ok(quizService.getDetailedQuizStats(quizId));
    }

    @PostMapping("/{quizId}/questions/{questionId}/analytics")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> getQuestionAnalytics(@PathVariable Long quizId, @PathVariable Long questionId) {
        return ResponseEntity.ok(quizService.getQuestionAnalytics(questionId));
    }

    @PostMapping("/{quizId}/export")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> exportQuizResults(@PathVariable Long quizId) {
        try {
            Object exportData = quizService.exportQuizResults(quizId);
            return ResponseEntity.ok(exportData);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/my-quizzes")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Page<Quiz>> getMyQuizzes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Quiz> quizzes = quizService.findInstructorQuizzes(pageable);
        return ResponseEntity.ok(quizzes);
    }

    @GetMapping("/templates")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Quiz>> getQuizTemplates() {
        List<Quiz> templates = quizService.getQuizTemplates();
        return ResponseEntity.ok(templates);
    }

    @PostMapping("/template/{templateId}/use")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Quiz> createFromTemplate(@PathVariable Long templateId, @RequestBody Quiz quizDetails) {
        try {
            Quiz quiz = quizService.createFromTemplate(templateId, quizDetails);
            return ResponseEntity.ok(quiz);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
