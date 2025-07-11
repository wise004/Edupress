package com.edupress.controller;

import com.edupress.model.*;
import com.edupress.service.AssignmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Path;
import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/assignments")
public class AssignmentController {

    @Autowired
    private AssignmentService assignmentService;

    // Assignment CRUD operations
    @GetMapping
    public ResponseEntity<Page<Assignment>> getAllAssignments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Assignment> assignments = assignmentService.findAll(pageable);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Assignment> getAssignmentById(@PathVariable Long id) {
        Optional<Assignment> assignment = assignmentService.findById(id);
        return assignment.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/lesson/{lessonId}")
    public ResponseEntity<List<Assignment>> getAssignmentsByLesson(@PathVariable Long lessonId) {
        List<Assignment> assignments = assignmentService.findByLesson(lessonId);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Assignment>> getAssignmentsByCourse(@PathVariable Long courseId) {
        List<Assignment> assignments = assignmentService.findByCourse(courseId);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/instructor/{instructorId}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Assignment>> getAssignmentsByInstructor(@PathVariable Long instructorId) {
        List<Assignment> assignments = assignmentService.findByInstructor(instructorId);
        return ResponseEntity.ok(assignments);
    }

    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Assignment> createAssignment(@RequestBody Assignment assignment) {
        Assignment createdAssignment = assignmentService.createAssignment(assignment);
        return ResponseEntity.ok(createdAssignment);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Assignment> updateAssignment(@PathVariable Long id, @RequestBody Assignment assignmentDetails) {
        try {
            Assignment updatedAssignment = assignmentService.updateAssignment(id, assignmentDetails);
            return ResponseEntity.ok(updatedAssignment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteAssignment(@PathVariable Long id) {
        try {
            assignmentService.deleteAssignment(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<Page<Assignment>> searchAssignments(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Assignment> assignments = assignmentService.searchAssignments(query, pageable);
        return ResponseEntity.ok(assignments);
    }

    // Assignment submission operations
    @PostMapping("/{assignmentId}/submit")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<AssignmentSubmission> submitAssignment(
            @PathVariable Long assignmentId,
            @RequestParam Long studentId,
            @RequestParam("file") MultipartFile file) {
        try {
            AssignmentSubmission submission = assignmentService.submitAssignment(assignmentId, studentId, file);
            return ResponseEntity.ok(submission);
        } catch (IOException e) {
            return ResponseEntity.badRequest().body(null);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @PostMapping("/submissions/{submissionId}/grade")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<AssignmentSubmission> gradeSubmission(
            @PathVariable Long submissionId,
            @RequestParam BigDecimal score,
            @RequestParam(required = false) String feedback,
            @RequestParam Long graderId) {
        try {
            AssignmentSubmission gradedSubmission = assignmentService.gradeSubmission(submissionId, score, feedback, graderId);
            return ResponseEntity.ok(gradedSubmission);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/submissions/student/{studentId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<AssignmentSubmission>> getStudentSubmissions(@PathVariable Long studentId) {
        List<AssignmentSubmission> submissions = assignmentService.getSubmissionsByStudent(studentId);
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/{assignmentId}/submissions")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<AssignmentSubmission>> getAssignmentSubmissions(@PathVariable Long assignmentId) {
        List<AssignmentSubmission> submissions = assignmentService.getSubmissionsByAssignment(assignmentId);
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/submissions/instructor/{instructorId}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<AssignmentSubmission>> getInstructorSubmissions(
            @PathVariable Long instructorId,
            @RequestParam(required = false, defaultValue = "SUBMITTED") String status) {
        AssignmentSubmission.SubmissionStatus submissionStatus;
        try {
            submissionStatus = AssignmentSubmission.SubmissionStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            submissionStatus = AssignmentSubmission.SubmissionStatus.SUBMITTED;
        }
        
        List<AssignmentSubmission> submissions = assignmentService.getSubmissionsByInstructorAndStatus(instructorId, submissionStatus);
        return ResponseEntity.ok(submissions);
    }

    @GetMapping("/submissions/grader/{graderId}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<AssignmentSubmission>> getGraderSubmissions(@PathVariable Long graderId) {
        List<AssignmentSubmission> submissions = assignmentService.getSubmissionsByGrader(graderId);
        return ResponseEntity.ok(submissions);
    }

    // File download
    @GetMapping("/submissions/{submissionId}/download")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Resource> downloadSubmissionFile(@PathVariable Long submissionId) {
        try {
            Path filePath = assignmentService.getSubmissionFilePath(submissionId);
            Resource resource = new UrlResource(filePath.toUri());
            
            if (resource.exists() && resource.isReadable()) {
                return ResponseEntity.ok()
                        .contentType(MediaType.APPLICATION_OCTET_STREAM)
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filePath.getFileName().toString() + "\"")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // Assignment statistics
    @GetMapping("/{assignmentId}/stats/average-score")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Double> getAverageScore(@PathVariable Long assignmentId) {
        Double averageScore = assignmentService.getAverageScore(assignmentId);
        return ResponseEntity.ok(averageScore != null ? averageScore : 0.0);
    }

    @GetMapping("/{assignmentId}/stats/submission-count")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Long> getSubmissionCount(@PathVariable Long assignmentId) {
        long count = assignmentService.getSubmissionCount(assignmentId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/{assignmentId}/stats/graded-count")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Long> getGradedCount(@PathVariable Long assignmentId) {
        long count = assignmentService.getGradedCount(assignmentId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/course/{courseId}/count")
    public ResponseEntity<Long> getAssignmentCountByCourse(@PathVariable Long courseId) {
        long count = assignmentService.countActiveByCourse(courseId);
        return ResponseEntity.ok(count);
    }

    @GetMapping("/overdue")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Assignment>> getOverdueAssignments() {
        List<Assignment> assignments = assignmentService.findOverdueAssignments();
        return ResponseEntity.ok(assignments);
    }

    // Enhanced assignment management
    @PostMapping("/{assignmentId}/duplicate")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Assignment> duplicateAssignment(@PathVariable Long assignmentId) {
        try {
            Assignment duplicated = assignmentService.duplicateAssignment(assignmentId);
            return ResponseEntity.ok(duplicated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/my-assignments")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<Page<Assignment>> getMyAssignments(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Assignment> assignments = assignmentService.findInstructorAssignments(pageable);
        return ResponseEntity.ok(assignments);
    }

    @GetMapping("/my-submissions")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Page<?>> getMySubmissions(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(assignmentService.findStudentSubmissions(pageable));
    }

    @PostMapping("/{assignmentId}/bulk-grade")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> bulkGradeSubmissions(
            @PathVariable Long assignmentId,
            @RequestBody List<Object> gradingData) {
        try {
            assignmentService.bulkGradeSubmissions(assignmentId, gradingData);
            return ResponseEntity.ok("Bulk grading completed successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{assignmentId}/export-grades")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> exportGrades(@PathVariable Long assignmentId) {
        try {
            Object exportData = assignmentService.exportGrades(assignmentId);
            return ResponseEntity.ok(exportData);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{assignmentId}/extend-deadline")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Assignment> extendDeadline(
            @PathVariable Long assignmentId,
            @RequestParam String newDeadline) {
        try {
            Assignment assignment = assignmentService.extendDeadline(assignmentId, newDeadline);
            return ResponseEntity.ok(assignment);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/{assignmentId}/detailed-stats")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> getDetailedAssignmentStats(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(assignmentService.getDetailedAssignmentStats(assignmentId));
    }
}
