package com.edupress.repository;

import com.edupress.model.Quiz;
import com.edupress.model.Lesson;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {
    
    List<Quiz> findByLessonOrderByCreatedAtDesc(Lesson lesson);
    
    List<Quiz> findByIsActiveTrueOrderByCreatedAtDesc();
    
    Page<Quiz> findByLesson(Lesson lesson, Pageable pageable);
    
    @Query("SELECT q FROM Quiz q WHERE q.lesson.course.id = :courseId AND q.isActive = true ORDER BY q.lesson.orderIndex, q.title")
    List<Quiz> findByCourseIdAndIsActiveTrue(@Param("courseId") Long courseId);
    
    @Query("SELECT q FROM Quiz q WHERE q.lesson.course.instructor.id = :instructorId ORDER BY q.createdAt DESC")
    List<Quiz> findByInstructorId(@Param("instructorId") Long instructorId);
    
    @Query("SELECT COUNT(q) FROM Quiz q WHERE q.lesson.course.id = :courseId AND q.isActive = true")
    long countActiveByCourseId(@Param("courseId") Long courseId);
    
    @Query("SELECT q FROM Quiz q WHERE q.title LIKE %:searchTerm% OR q.description LIKE %:searchTerm%")
    Page<Quiz> searchByTitleOrDescription(@Param("searchTerm") String searchTerm, Pageable pageable);
}
