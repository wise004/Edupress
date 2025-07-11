package com.edupress.service;

import com.edupress.model.Lesson;
import com.edupress.model.Course;
import com.edupress.repository.LessonRepository;
import com.edupress.repository.CourseRepository;
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
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CourseRepository courseRepository;

    // Lesson CRUD operations
    public Lesson createLesson(Lesson lesson) {
        lesson.setCreatedAt(LocalDateTime.now());
        lesson.setUpdatedAt(LocalDateTime.now());
        return lessonRepository.save(lesson);
    }

    public Optional<Lesson> findById(Long id) {
        return lessonRepository.findById(id);
    }

    public List<Lesson> findAll() {
        return lessonRepository.findAll();
    }

    public Page<Lesson> findAll(Pageable pageable) {
        return lessonRepository.findAll(pageable);
    }

    public Lesson updateLesson(Long id, Lesson lessonDetails) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));

        lesson.setTitle(lessonDetails.getTitle());
        lesson.setDescription(lessonDetails.getDescription());
        lesson.setContentText(lessonDetails.getContentText());
        lesson.setVideoUrl(lessonDetails.getVideoUrl());
        lesson.setDuration(lessonDetails.getDuration());
        lesson.setOrderIndex(lessonDetails.getOrderIndex());
        lesson.setIsFree(lessonDetails.getIsFree());
        lesson.setUpdatedAt(LocalDateTime.now());

        return lessonRepository.save(lesson);
    }

    public void deleteLesson(Long id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + id));
        lessonRepository.delete(lesson);
    }

    // Business logic methods
    public List<Lesson> findByCourseId(Long courseId) {
        return lessonRepository.findByCourseId(courseId);
    }

    public List<Lesson> findByInstructorId(Long instructorId) {
        return lessonRepository.findByInstructorId(instructorId);
    }

    public long countByCourseId(Long courseId) {
        return lessonRepository.countByCourseId(courseId);
    }

    public Page<Lesson> searchLessons(String searchTerm, Pageable pageable) {
        return lessonRepository.searchLessons(searchTerm, pageable);
    }

    public Lesson reorderLesson(Long lessonId, int newOrder) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + lessonId));

        // Get all lessons in the same course
        List<Lesson> courseLessons = lessonRepository.findByCourseOrderByOrderIndexAsc(lesson.getCourse());

        // Remove the lesson from its current position
        courseLessons.remove(lesson);

        // Insert it at the new position
        courseLessons.add(newOrder, lesson);

        // Update order indices
        for (int i = 0; i < courseLessons.size(); i++) {
            courseLessons.get(i).setOrderIndex(i + 1);
            lessonRepository.save(courseLessons.get(i));
        }

        return lesson;
    }

    // Student progress tracking
    public void markLessonAsCompleted(Long lessonId, Long userId) {
        // TODO: Implement lesson completion tracking in a separate entity
        // For now, we'll just mark as completed in a simple way
        // In a real application, you'd have a LessonProgress entity
        System.out.println("Lesson " + lessonId + " marked as completed for user " + userId);
    }

    public boolean isLessonCompletedByUser(Long lessonId, Long userId) {
        // TODO: Implement lesson completion checking
        // For now, returning false
        // In a real application, you'd check the LessonProgress entity
        return false;
    }

    // Get lessons by course with pagination
    public Page<Lesson> findByCourse(Long courseId, Pageable pageable) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with id: " + courseId));
        return lessonRepository.findByCourse(course, pageable);
    }

    // Get next lesson in course
    public Optional<Lesson> getNextLesson(Long currentLessonId) {
        Lesson currentLesson = lessonRepository.findById(currentLessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + currentLessonId));

        List<Lesson> courseLessons = lessonRepository.findByCourseOrderByOrderIndexAsc(currentLesson.getCourse());
        
        for (int i = 0; i < courseLessons.size(); i++) {
            if (courseLessons.get(i).getId().equals(currentLessonId)) {
                if (i + 1 < courseLessons.size()) {
                    return Optional.of(courseLessons.get(i + 1));
                }
                break;
            }
        }
        return Optional.empty();
    }

    // Get previous lesson in course
    public Optional<Lesson> getPreviousLesson(Long currentLessonId) {
        Lesson currentLesson = lessonRepository.findById(currentLessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found with id: " + currentLessonId));

        List<Lesson> courseLessons = lessonRepository.findByCourseOrderByOrderIndexAsc(currentLesson.getCourse());
        
        for (int i = 0; i < courseLessons.size(); i++) {
            if (courseLessons.get(i).getId().equals(currentLessonId)) {
                if (i > 0) {
                    return Optional.of(courseLessons.get(i - 1));
                }
                break;
            }
        }
        return Optional.empty();
    }
}
