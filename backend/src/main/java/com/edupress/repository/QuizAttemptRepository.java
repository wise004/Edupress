package com.edupress.repository;

import com.edupress.model.QuizAttempt;
import com.edupress.model.Quiz;
import com.edupress.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {
    
    List<QuizAttempt> findByUserAndQuizOrderByCreatedAtDesc(User user, Quiz quiz);
    
    List<QuizAttempt> findByUserOrderByCreatedAtDesc(User user);
    
    List<QuizAttempt> findByQuizOrderByCreatedAtDesc(Quiz quiz);
    
    Page<QuizAttempt> findByQuiz(Quiz quiz, Pageable pageable);
    
    Page<QuizAttempt> findByUser(User user, Pageable pageable);
    
    long countByUserAndQuiz(User user, Quiz quiz);
    
    @Query("SELECT qa FROM QuizAttempt qa WHERE qa.quiz.id = :quizId AND qa.user.id = :userId ORDER BY qa.createdAt DESC")
    List<QuizAttempt> findByQuizIdAndUserId(@Param("quizId") Long quizId, @Param("userId") Long userId);
    
    Optional<QuizAttempt> findFirstByUserAndQuizAndStatusOrderByCreatedAtDesc(User user, Quiz quiz, QuizAttempt.AttemptStatus status);
    
    @Query("SELECT qa FROM QuizAttempt qa WHERE qa.quiz.lesson.course.id = :courseId AND qa.user.id = :userId")
    List<QuizAttempt> findByCourseIdAndUserId(@Param("courseId") Long courseId, @Param("userId") Long userId);
    
    @Query("SELECT AVG(qa.score) FROM QuizAttempt qa WHERE qa.quiz.id = :quizId")
    Double getAverageScoreByQuizId(@Param("quizId") Long quizId);
    
    @Query("SELECT COUNT(qa) FROM QuizAttempt qa WHERE qa.quiz.id = :quizId AND qa.score >= qa.quiz.passingScore")
    long countPassedAttemptsByQuizId(@Param("quizId") Long quizId);
}
