package com.edupress.repository;

import com.edupress.model.AssignmentSubmission;
import com.edupress.model.Assignment;
import com.edupress.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;


@Repository
public interface AssignmentSubmissionRepository extends JpaRepository<AssignmentSubmission, Long> {
    
    List<AssignmentSubmission> findByStudentAndAssignmentOrderByCreatedAtDesc(User student, Assignment assignment);
    
    List<AssignmentSubmission> findByStudentOrderByCreatedAtDesc(User student);
    
    List<AssignmentSubmission> findByAssignmentOrderByCreatedAtDesc(Assignment assignment);
    
    Page<AssignmentSubmission> findByAssignment(Assignment assignment, Pageable pageable);
    
    Page<AssignmentSubmission> findByStudent(User student, Pageable pageable);
    
    long countByStudentAndAssignment(User student, Assignment assignment);
    
    @Query("SELECT asub FROM AssignmentSubmission asub WHERE asub.assignment.id = :assignmentId AND asub.student.id = :studentId ORDER BY asub.createdAt DESC")
    List<AssignmentSubmission> findByAssignmentIdAndStudentId(@Param("assignmentId") Long assignmentId, @Param("studentId") Long studentId);
    
    @Query("SELECT asub FROM AssignmentSubmission asub WHERE asub.assignment.lesson.course.id = :courseId AND asub.student.id = :studentId")
    List<AssignmentSubmission> findByCourseIdAndStudentId(@Param("courseId") Long courseId, @Param("studentId") Long studentId);
    
    @Query("SELECT asub FROM AssignmentSubmission asub WHERE asub.assignment.lesson.course.instructor.id = :instructorId AND asub.status = :status")
    List<AssignmentSubmission> findByInstructorIdAndStatus(@Param("instructorId") Long instructorId, @Param("status") AssignmentSubmission.SubmissionStatus status);
    
    @Query("SELECT asub FROM AssignmentSubmission asub WHERE asub.gradedBy.id = :graderId ORDER BY asub.gradedAt DESC")
    List<AssignmentSubmission> findByGraderId(@Param("graderId") Long graderId);
    
    @Query("SELECT COUNT(asub) FROM AssignmentSubmission asub WHERE asub.assignment.id = :assignmentId")
    long countByAssignmentId(@Param("assignmentId") Long assignmentId);
    
    @Query("SELECT COUNT(asub) FROM AssignmentSubmission asub WHERE asub.assignment.id = :assignmentId AND asub.status = 'GRADED'")
    long countGradedByAssignmentId(@Param("assignmentId") Long assignmentId);
    
    @Query("SELECT AVG(asub.score) FROM AssignmentSubmission asub WHERE asub.assignment.id = :assignmentId AND asub.score IS NOT NULL")
    Double getAverageScoreByAssignmentId(@Param("assignmentId") Long assignmentId);
}
