package com.edupress.repository;

import com.edupress.model.Video;
import com.edupress.model.Lesson;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {
    
    List<Video> findByLessonOrderByOrderIndexAsc(Lesson lesson);
    
    List<Video> findByIsActiveTrueOrderByOrderIndexAsc();
    
    Page<Video> findByLesson(Lesson lesson, Pageable pageable);
    
    @Query("SELECT v FROM Video v WHERE v.lesson.course.id = :courseId AND v.isActive = true ORDER BY v.lesson.orderIndex, v.orderIndex")
    List<Video> findByCourseIdAndIsActiveTrue(@Param("courseId") Long courseId);
    
    @Query("SELECT v FROM Video v WHERE v.lesson.course.instructor.id = :instructorId ORDER BY v.createdAt DESC")
    List<Video> findByInstructorId(@Param("instructorId") Long instructorId);
    
    @Query("SELECT COUNT(v) FROM Video v WHERE v.lesson.course.id = :courseId AND v.isActive = true")
    long countActiveByCourseId(@Param("courseId") Long courseId);
    
    List<Video> findByTypeAndIsActiveTrue(Video.VideoType type);
    
    @Query("SELECT v FROM Video v WHERE v.title LIKE %:searchTerm% OR v.description LIKE %:searchTerm%")
    Page<Video> searchByTitleOrDescription(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT v FROM Video v WHERE v.averageRating >= :minRating ORDER BY v.averageRating DESC")
    List<Video> findByMinimumRating(@Param("minRating") Double minRating);
}
