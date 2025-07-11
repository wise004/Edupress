package com.edupress.service;

import com.edupress.model.*;
import com.edupress.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private UserRepository userRepository;

    // Quiz CRUD operations
    public Quiz createQuiz(Quiz quiz) {
        return quizRepository.save(quiz);
    }

    public Optional<Quiz> findById(Long id) {
        return quizRepository.findById(id);
    }

    public List<Quiz> findAll() {
        return quizRepository.findAll();
    }

    public Page<Quiz> findAll(Pageable pageable) {
        return quizRepository.findAll(pageable);
    }

    public Quiz updateQuiz(Long id, Quiz quizDetails) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + id));

        quiz.setTitle(quizDetails.getTitle());
        quiz.setDescription(quizDetails.getDescription());
        quiz.setMaxScore(quizDetails.getMaxScore());
        quiz.setPassingScore(quizDetails.getPassingScore());
        quiz.setMaxAttempts(quizDetails.getMaxAttempts());
        quiz.setTimeLimit(quizDetails.getTimeLimit());
        quiz.setIsActive(quizDetails.getIsActive());

        return quizRepository.save(quiz);
    }

    public void deleteQuiz(Long id) {
        quizRepository.deleteById(id);
    }

    // Business logic methods
    public List<Quiz> findByLesson(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));
        return quizRepository.findByLessonOrderByCreatedAtDesc(lesson);
    }

    public List<Quiz> findByCourse(Long courseId) {
        return quizRepository.findByCourseIdAndIsActiveTrue(courseId);
    }

    public List<Quiz> findByInstructor(Long instructorId) {
        return quizRepository.findByInstructorId(instructorId);
    }

    public long countActiveByCourse(Long courseId) {
        return quizRepository.countActiveByCourseId(courseId);
    }

    // Quiz attempt operations
    public QuizAttempt startQuizAttempt(Long quizId, Long userId) {
        Quiz quiz = findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Check if user has reached max attempts
        long attemptCount = quizAttemptRepository.countByUserAndQuiz(user, quiz);
        if (attemptCount >= quiz.getMaxAttempts()) {
            throw new RuntimeException("Maximum attempts exceeded for this quiz");
        }

        QuizAttempt attempt = new QuizAttempt(quiz, user);
        return quizAttemptRepository.save(attempt);
    }

    public QuizAttempt submitQuizAttempt(Long attemptId, String answers, Integer timeSpent) {
        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Quiz attempt not found with id: " + attemptId));

        if (attempt.getStatus() != QuizAttempt.AttemptStatus.IN_PROGRESS) {
            throw new RuntimeException("Quiz attempt is not in progress");
        }

        attempt.setAnswers(answers);
        attempt.setTimeSpent(timeSpent);
        attempt.setStatus(QuizAttempt.AttemptStatus.COMPLETED);
        attempt.setCompletedAt(LocalDateTime.now());

        // Calculate score based on answers
        Integer score = calculateScore(attempt, answers);
        attempt.setScore(score);

        return quizAttemptRepository.save(attempt);
    }

    private Integer calculateScore(QuizAttempt attempt, String answers) {
        // Calculate score based on quiz questions and answers
        // In a real implementation, this would parse the JSON answers and compare with correct answers
        Quiz quiz = attempt.getQuiz();
        if (quiz == null) return 0;
        
        // Simulate scoring logic - in real implementation would parse answers JSON
        return (int) (Math.random() * quiz.getMaxScore());
    }

    public List<QuizAttempt> getAttemptsByUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        return quizAttemptRepository.findByUserOrderByCreatedAtDesc(user);
    }

    public List<QuizAttempt> getAttemptsByQuiz(Long quizId) {
        Quiz quiz = findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));
        return quizAttemptRepository.findByQuizOrderByCreatedAtDesc(quiz);
    }

    public List<QuizAttempt> getAttemptsByUserAndQuiz(Long userId, Long quizId) {
        return quizAttemptRepository.findByQuizIdAndUserId(quizId, userId);
    }

    public Double getAverageScore(Long quizId) {
        return quizAttemptRepository.getAverageScoreByQuizId(quizId);
    }

    public long getPassedCount(Long quizId) {
        return quizAttemptRepository.countPassedAttemptsByQuizId(quizId);
    }

    public Page<Quiz> searchQuizzes(String searchTerm, Pageable pageable) {
        return quizRepository.searchByTitleOrDescription(searchTerm, pageable);
    }

    // Enhanced quiz management methods
    public List<Quiz> createBulkQuizzes(List<Quiz> quizzes) {
        for (Quiz quiz : quizzes) {
            quiz.setCreatedAt(LocalDateTime.now());
            quiz.setUpdatedAt(LocalDateTime.now());
        }
        return quizRepository.saveAll(quizzes);
    }

    public Quiz duplicateQuiz(Long quizId) {
        Quiz original = findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));
        
        Quiz duplicate = new Quiz();
        duplicate.setTitle(original.getTitle() + " (Copy)");
        duplicate.setDescription(original.getDescription());
        duplicate.setMaxScore(original.getMaxScore());
        duplicate.setPassingScore(original.getPassingScore());
        duplicate.setMaxAttempts(original.getMaxAttempts());
        duplicate.setTimeLimit(original.getTimeLimit());
        duplicate.setLesson(original.getLesson());
        duplicate.setIsActive(false); // Start as inactive
        duplicate.setCreatedAt(LocalDateTime.now());
        duplicate.setUpdatedAt(LocalDateTime.now());
        
        return quizRepository.save(duplicate);
    }

    public Quiz activateQuiz(Long quizId) {
        Quiz quiz = findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));
        quiz.setIsActive(true);
        quiz.setUpdatedAt(LocalDateTime.now());
        return quizRepository.save(quiz);
    }

    public Quiz deactivateQuiz(Long quizId) {
        Quiz quiz = findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));
        quiz.setIsActive(false);
        quiz.setUpdatedAt(LocalDateTime.now());
        return quizRepository.save(quiz);
    }

    public Object getDetailedQuizStats(Long quizId) {
        Quiz quiz = findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));
        
        // TODO: Implement detailed statistics gathering
        // This would return comprehensive quiz statistics
        return "Detailed stats not yet implemented for quiz: " + quiz.getTitle();
    }

    public Object getQuestionAnalytics(Long questionId) {
        // TODO: Implement question analytics
        // This would return analytics for a specific question
        return "Question analytics not yet implemented for question ID: " + questionId;
    }

    public Object exportQuizResults(Long quizId) {
        Quiz quiz = findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found with id: " + quizId));
        
        // TODO: Implement export functionality
        // This would export quiz results to CSV, Excel, etc.
        return "Export functionality not yet implemented for quiz: " + quiz.getTitle();
    }

    public Page<Quiz> findInstructorQuizzes(Pageable pageable) {
        // TODO: Get current user from security context
        // For now, return all quizzes
        return quizRepository.findAll(pageable);
    }

    public List<Quiz> getQuizTemplates() {
        // TODO: Implement quiz templates functionality
        // This would return predefined quiz templates
        return List.of();
    }

    public Quiz createFromTemplate(Long templateId, Quiz quizDetails) {
        // TODO: Implement template-based quiz creation
        // For now, just create a regular quiz
        quizDetails.setCreatedAt(LocalDateTime.now());
        quizDetails.setUpdatedAt(LocalDateTime.now());
        return quizRepository.save(quizDetails);
    }
}
