package com.edupress.repository;

import com.edupress.model.Assignment;
import com.edupress.model.Lesson;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    
    List<Assignment> findByLessonOrderByCreatedAtDesc(Lesson lesson);
    
    List<Assignment> findByIsActiveTrueOrderByCreatedAtDesc();
    
    Page<Assignment> findByLesson(Lesson lesson, Pageable pageable);
    
    @Query("SELECT a FROM Assignment a WHERE a.lesson.course.id = :courseId AND a.isActive = true ORDER BY a.lesson.orderIndex, a.title")
    List<Assignment> findByCourseIdAndIsActiveTrue(@Param("courseId") Long courseId);
    
    @Query("SELECT a FROM Assignment a WHERE a.lesson.course.instructor.id = :instructorId ORDER BY a.createdAt DESC")
    List<Assignment> findByInstructorId(@Param("instructorId") Long instructorId);
    
    @Query("SELECT COUNT(a) FROM Assignment a WHERE a.lesson.course.id = :courseId AND a.isActive = true")
    long countActiveByCourseId(@Param("courseId") Long courseId);
    
    List<Assignment> findByDueDateBeforeAndIsActiveTrue(LocalDateTime dueDate);
    
    @Query("SELECT a FROM Assignment a WHERE a.title LIKE %:searchTerm% OR a.description LIKE %:searchTerm%")
    Page<Assignment> searchByTitleOrDescription(@Param("searchTerm") String searchTerm, Pageable pageable);
}
