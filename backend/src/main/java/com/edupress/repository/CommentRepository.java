package com.edupress.repository;

import com.edupress.model.Comment;
import com.edupress.model.Video;
import com.edupress.model.Lesson;
import com.edupress.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    
    List<Comment> findByVideoAndIsActiveTrueOrderByCreatedAtDesc(Video video);
    
    List<Comment> findByLessonAndIsActiveTrueOrderByCreatedAtDesc(Lesson lesson);
    
    List<Comment> findByUserOrderByCreatedAtDesc(User user);
    
    Page<Comment> findByVideo(Video video, Pageable pageable);
    
    Page<Comment> findByLesson(Lesson lesson, Pageable pageable);
    
    // Top-level comments (not replies)
    @Query("SELECT c FROM Comment c WHERE c.video = :video AND c.parentComment IS NULL AND c.isActive = true ORDER BY c.createdAt DESC")
    List<Comment> findTopLevelCommentsByVideo(@Param("video") Video video);
    
    @Query("SELECT c FROM Comment c WHERE c.lesson = :lesson AND c.parentComment IS NULL AND c.isActive = true ORDER BY c.createdAt DESC")
    List<Comment> findTopLevelCommentsByLesson(@Param("lesson") Lesson lesson);
    
    // Replies to a comment
    List<Comment> findByParentCommentAndIsActiveTrueOrderByCreatedAtAsc(Comment parentComment);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.video.id = :videoId AND c.isActive = true")
    long countByVideoId(@Param("videoId") Long videoId);
    
    @Query("SELECT COUNT(c) FROM Comment c WHERE c.lesson.id = :lessonId AND c.isActive = true")
    long countByLessonId(@Param("lessonId") Long lessonId);
    
    @Query("SELECT c FROM Comment c WHERE c.video.lesson.course.instructor.id = :instructorId OR c.lesson.course.instructor.id = :instructorId ORDER BY c.createdAt DESC")
    List<Comment> findByInstructorId(@Param("instructorId") Long instructorId);
    
    @Query("SELECT c FROM Comment c WHERE c.content LIKE %:searchTerm% AND c.isActive = true")
    Page<Comment> searchByContent(@Param("searchTerm") String searchTerm, Pageable pageable);
}
