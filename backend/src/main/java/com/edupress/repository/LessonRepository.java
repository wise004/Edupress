package com.edupress.repository;

import com.edupress.model.Lesson;
import com.edupress.model.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    
    List<Lesson> findByCourseOrderByOrderIndexAsc(Course course);
    
    Page<Lesson> findByCourse(Course course, Pageable pageable);
    
    @Query("SELECT l FROM Lesson l WHERE l.course.id = :courseId ORDER BY l.orderIndex ASC")
    List<Lesson> findByCourseId(@Param("courseId") Long courseId);
    
    @Query("SELECT l FROM Lesson l WHERE l.course.instructor.id = :instructorId ORDER BY l.course.title, l.orderIndex")
    List<Lesson> findByInstructorId(@Param("instructorId") Long instructorId);
    
    @Query("SELECT COUNT(l) FROM Lesson l WHERE l.course.id = :courseId")
    long countByCourseId(@Param("courseId") Long courseId);
    
    @Query("SELECT l FROM Lesson l WHERE l.title LIKE %:searchTerm% OR l.description LIKE %:searchTerm%")
    Page<Lesson> searchLessons(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT l FROM Lesson l WHERE l.title LIKE %:searchTerm% OR l.description LIKE %:searchTerm%")
    Page<Lesson> searchByTitleOrDescription(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    List<Lesson> findByIsFreeTrue();
}
