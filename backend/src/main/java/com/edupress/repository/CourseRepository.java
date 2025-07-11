package com.edupress.repository;

import com.edupress.model.Course;
import com.edupress.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    
    Page<Course> findByStatus(Course.Status status, Pageable pageable);
    
    Page<Course> findByCategoryId(Long categoryId, Pageable pageable);
    
    Page<Course> findByInstructor(User instructor, Pageable pageable);
    
    @Query("SELECT c FROM Course c WHERE c.status = 'PUBLISHED'")
    Page<Course> findPublishedCourses(Pageable pageable);
    
    @Query("SELECT c FROM Course c WHERE c.status = 'PUBLISHED' AND c.isFree = true")
    Page<Course> findFreeCourses(Pageable pageable);
    
    @Query("SELECT c FROM Course c WHERE c.status = 'PUBLISHED' AND c.isFree = false")
    Page<Course> findPaidCourses(Pageable pageable);
    
    @Query("SELECT c FROM Course c WHERE c.status = 'PUBLISHED' AND " +
           "(LOWER(c.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Course> findPublishedCoursesBySearchTerm(@Param("searchTerm") String searchTerm, Pageable pageable);
    
    @Query("SELECT c FROM Course c WHERE c.status = 'PUBLISHED' AND " +
           "c.category.id = :categoryId AND " +
           "(LOWER(c.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(c.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Course> findPublishedCoursesByCategoryAndSearchTerm(@Param("categoryId") Long categoryId,
                                                            @Param("searchTerm") String searchTerm,
                                                            Pageable pageable);
    
    @Query("SELECT c FROM Course c WHERE c.status = 'PUBLISHED' AND " +
           "c.level = :level")
    Page<Course> findPublishedCoursesByLevel(@Param("level") Course.Level level, Pageable pageable);
    
    @Query("SELECT c FROM Course c WHERE c.status = 'PUBLISHED' AND " +
           "c.price BETWEEN :minPrice AND :maxPrice")
    Page<Course> findPublishedCoursesByPriceRange(@Param("minPrice") BigDecimal minPrice,
                                                  @Param("maxPrice") BigDecimal maxPrice,
                                                  Pageable pageable);
    
    @Query("SELECT c FROM Course c WHERE c.status = 'PUBLISHED' ORDER BY c.enrollmentCount DESC")
    List<Course> findTopCoursesByEnrollment(Pageable pageable);
    
    @Query("SELECT c FROM Course c WHERE c.status = 'PUBLISHED' ORDER BY c.averageRating DESC")
    List<Course> findTopCoursesByRating(Pageable pageable);
    
    @Query("SELECT c FROM Course c WHERE c.status = 'PUBLISHED' ORDER BY c.createdAt DESC")
    List<Course> findLatestCourses(Pageable pageable);
    
    @Query("SELECT COUNT(c) FROM Course c WHERE c.status = 'PUBLISHED'")
    long countPublishedCourses();
    
    @Query("SELECT COUNT(c) FROM Course c WHERE c.status = 'PUBLISHED' AND c.isFree = true")
    long countFreeCourses();
    
    @Query("SELECT COUNT(c) FROM Course c WHERE c.status = 'PUBLISHED' AND c.isFree = false")
    long countPaidCourses();
    
    @Query("SELECT SUM(c.enrollmentCount) FROM Course c WHERE c.status = 'PUBLISHED'")
    Long getTotalEnrollments();

    // Add missing method for instructor courses
    Page<Course> findByInstructorId(Long instructorId, Pageable pageable);
    
    // Additional instructor-specific methods
    long countByInstructorId(Long instructorId);
    
    long countByInstructorIdAndStatus(Long instructorId, Course.Status status);
    
    List<Course> findTop5ByInstructorIdOrderByCreatedAtDesc(Long instructorId);
    
    List<Course> findTop5ByInstructorIdOrderByEnrollmentCountDesc(Long instructorId);
}
