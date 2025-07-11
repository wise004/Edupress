package com.edupress.service;

import com.edupress.model.*;
import com.edupress.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private AssignmentSubmissionRepository submissionRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private UserRepository userRepository;

    private final String uploadDir = "uploads/assignments/";

    // Assignment CRUD operations
    public Assignment createAssignment(Assignment assignment) {
        return assignmentRepository.save(assignment);
    }

    public Optional<Assignment> findById(Long id) {
        return assignmentRepository.findById(id);
    }

    public List<Assignment> findAll() {
        return assignmentRepository.findAll();
    }

    public Page<Assignment> findAll(Pageable pageable) {
        return assignmentRepository.findAll(pageable);
    }

    public Assignment updateAssignment(Long id, Assignment assignmentDetails) {
        Assignment assignment = assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + id));

        assignment.setTitle(assignmentDetails.getTitle());
        assignment.setDescription(assignmentDetails.getDescription());
        assignment.setInstructions(assignmentDetails.getInstructions());
        assignment.setMaxScore(assignmentDetails.getMaxScore());
        assignment.setMaxAttempts(assignmentDetails.getMaxAttempts());
        assignment.setMaxFileSize(assignmentDetails.getMaxFileSize());
        assignment.setAllowedFileTypes(assignmentDetails.getAllowedFileTypes());
        assignment.setDueDate(assignmentDetails.getDueDate());
        assignment.setIsActive(assignmentDetails.getIsActive());

        return assignmentRepository.save(assignment);
    }

    public void deleteAssignment(Long id) {
        assignmentRepository.deleteById(id);
    }

    // Business logic methods
    public List<Assignment> findByLesson(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));
        return assignmentRepository.findByLessonOrderByCreatedAtDesc(lesson);
    }

    public List<Assignment> findByCourse(Long courseId) {
        return assignmentRepository.findByCourseIdAndIsActiveTrue(courseId);
    }

    public List<Assignment> findByInstructor(Long instructorId) {
        return assignmentRepository.findByInstructorId(instructorId);
    }

    public long countActiveByCourse(Long courseId) {
        return assignmentRepository.countActiveByCourseId(courseId);
    }

    // Assignment submission operations
    public AssignmentSubmission submitAssignment(Long assignmentId, Long studentId, MultipartFile file) 
            throws IOException {
        Assignment assignment = findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + assignmentId));
        
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + studentId));

        // Check if student has reached max attempts
        long submissionCount = submissionRepository.countByStudentAndAssignment(student, assignment);
        if (submissionCount >= assignment.getMaxAttempts()) {
            throw new RuntimeException("Maximum attempts exceeded for this assignment");
        }

        // Validate file size (convert MB to bytes)
        long maxSizeInBytes = assignment.getMaxFileSize() * 1024 * 1024;
        if (file.getSize() > maxSizeInBytes) {
            throw new RuntimeException("File size exceeds maximum allowed size: " + assignment.getMaxFileSize() + "MB");
        }

        // Validate file type
        String fileName = file.getOriginalFilename();
        if (fileName == null || fileName.isEmpty()) {
            throw new RuntimeException("Invalid file name");
        }
        
        String fileExtension = fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
        String[] allowedTypes = assignment.getAllowedFileTypes().split(",");
        boolean isValidType = false;
        for (String type : allowedTypes) {
            if (type.trim().equals(fileExtension)) {
                isValidType = true;
                break;
            }
        }
        if (!isValidType) {
            throw new RuntimeException("File type not allowed. Allowed types: " + assignment.getAllowedFileTypes());
        }

        // Save file
        String uniqueFileName = UUID.randomUUID().toString() + "_" + fileName;
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        Path filePath = uploadPath.resolve(uniqueFileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Create submission record
        AssignmentSubmission submission = new AssignmentSubmission(
                fileName, 
                filePath.toString(), 
                file.getSize(), 
                assignment, 
                student
        );
        submission.setFileType(fileExtension);

        // Check if submitted after due date
        if (assignment.getDueDate() != null && LocalDateTime.now().isAfter(assignment.getDueDate())) {
            submission.setStatus(AssignmentSubmission.SubmissionStatus.LATE);
        }

        return submissionRepository.save(submission);
    }

    public AssignmentSubmission gradeSubmission(Long submissionId, BigDecimal score, String feedback, Long graderId) {
        AssignmentSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found with id: " + submissionId));

        User grader = userRepository.findById(graderId)
                .orElseThrow(() -> new RuntimeException("Grader not found with id: " + graderId));

        submission.setScore(score);
        submission.setFeedback(feedback);
        submission.setGradedBy(grader);
        submission.setGradedAt(LocalDateTime.now());
        submission.setStatus(AssignmentSubmission.SubmissionStatus.GRADED);

        return submissionRepository.save(submission);
    }

    public List<AssignmentSubmission> getSubmissionsByStudent(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + studentId));
        return submissionRepository.findByStudentOrderByCreatedAtDesc(student);
    }

    public List<AssignmentSubmission> getSubmissionsByAssignment(Long assignmentId) {
        Assignment assignment = findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + assignmentId));
        return submissionRepository.findByAssignmentOrderByCreatedAtDesc(assignment);
    }

    public List<AssignmentSubmission> getSubmissionsByInstructorAndStatus(Long instructorId, AssignmentSubmission.SubmissionStatus status) {
        return submissionRepository.findByInstructorIdAndStatus(instructorId, status);
    }

    public List<AssignmentSubmission> getSubmissionsByGrader(Long graderId) {
        return submissionRepository.findByGraderId(graderId);
    }

    public Double getAverageScore(Long assignmentId) {
        return submissionRepository.getAverageScoreByAssignmentId(assignmentId);
    }

    public long getSubmissionCount(Long assignmentId) {
        return submissionRepository.countByAssignmentId(assignmentId);
    }

    public long getGradedCount(Long assignmentId) {
        return submissionRepository.countGradedByAssignmentId(assignmentId);
    }

    public List<Assignment> findOverdueAssignments() {
        return assignmentRepository.findByDueDateBeforeAndIsActiveTrue(LocalDateTime.now());
    }

    public Page<Assignment> searchAssignments(String searchTerm, Pageable pageable) {
        return assignmentRepository.searchByTitleOrDescription(searchTerm, pageable);
    }

    // File download method
    public Path getSubmissionFilePath(Long submissionId) {
        AssignmentSubmission submission = submissionRepository.findById(submissionId)
                .orElseThrow(() -> new RuntimeException("Submission not found with id: " + submissionId));
        return Paths.get(submission.getFilePath());
    }

    // Enhanced assignment management methods
    public Assignment duplicateAssignment(Long assignmentId) {
        Assignment original = findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + assignmentId));
        
        Assignment duplicate = new Assignment();
        duplicate.setTitle(original.getTitle() + " (Copy)");
        duplicate.setDescription(original.getDescription());
        duplicate.setInstructions(original.getInstructions());
        duplicate.setMaxScore(original.getMaxScore());
        duplicate.setMaxAttempts(original.getMaxAttempts());
        duplicate.setMaxFileSize(original.getMaxFileSize());
        duplicate.setAllowedFileTypes(original.getAllowedFileTypes());
        duplicate.setLesson(original.getLesson());
        duplicate.setIsActive(false); // Start as inactive
        duplicate.setCreatedAt(LocalDateTime.now());
        duplicate.setUpdatedAt(LocalDateTime.now());
        
        return assignmentRepository.save(duplicate);
    }

    public Page<Assignment> findInstructorAssignments(Pageable pageable) {
        // TODO: Get current user from security context
        // For now, return all assignments
        return assignmentRepository.findAll(pageable);
    }

    public Page<AssignmentSubmission> findStudentSubmissions(Pageable pageable) {
        // TODO: Get current user from security context
        // For now, return all submissions
        return submissionRepository.findAll(pageable);
    }

    public void bulkGradeSubmissions(Long assignmentId, List<Object> gradingData) {
        Assignment assignment = findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + assignmentId));
        
        // TODO: Implement bulk grading logic
        // This would iterate through gradingData and update submissions
        // For now, this is a placeholder implementation
        throw new RuntimeException("Bulk grading not yet implemented");
    }

    public Object getDetailedAssignmentStats(Long assignmentId) {
        Assignment assignment = findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + assignmentId));
        
        // TODO: Implement detailed statistics gathering
        // This would return comprehensive assignment statistics
        return "Detailed stats not yet implemented for assignment: " + assignment.getTitle();
    }

    public Object exportAssignmentResults(Long assignmentId) {
        Assignment assignment = findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + assignmentId));
        
        // TODO: Implement export functionality
        // This would export assignment results to CSV, Excel, etc.
        return "Export functionality not yet implemented for assignment: " + assignment.getTitle();
    }

    public Object exportGrades(Long assignmentId) {
        Assignment assignment = findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + assignmentId));
        
        // TODO: Implement grades export functionality
        // This would export assignment grades to CSV, Excel, etc.
        return "Grades export functionality not yet implemented for assignment: " + assignment.getTitle();
    }

    public Assignment extendDeadline(Long assignmentId, String newDeadline) {
        Assignment assignment = findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + assignmentId));
        
        // TODO: Parse newDeadline string to LocalDateTime
        // For now, this is a placeholder implementation
        assignment.setUpdatedAt(LocalDateTime.now());
        return assignmentRepository.save(assignment);
    }
}
