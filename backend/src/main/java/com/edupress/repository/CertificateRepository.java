package com.edupress.repository;

import com.edupress.model.Certificate;
import com.edupress.model.Course;
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
public interface CertificateRepository extends JpaRepository<Certificate, Long> {
    
    List<Certificate> findByStudentOrderByCreatedAtDesc(User student);
    
    List<Certificate> findByCourseOrderByCreatedAtDesc(Course course);
    
    Page<Certificate> findByStudent(User student, Pageable pageable);
    
    Page<Certificate> findByCourse(Course course, Pageable pageable);
    
    Optional<Certificate> findByCertificateId(String certificateId);
    
    Optional<Certificate> findByStudentAndCourse(User student, Course course);
    
    boolean existsByStudentAndCourse(User student, Course course);
    
    @Query("SELECT c FROM Certificate c WHERE c.course.instructor.id = :instructorId ORDER BY c.createdAt DESC")
    List<Certificate> findByInstructorId(@Param("instructorId") Long instructorId);
    
    @Query("SELECT COUNT(c) FROM Certificate c WHERE c.course.id = :courseId")
    long countByCourseId(@Param("courseId") Long courseId);
    
    @Query("SELECT COUNT(c) FROM Certificate c WHERE c.student.id = :studentId")
    long countByStudentId(@Param("studentId") Long studentId);
    
    @Query("SELECT c FROM Certificate c WHERE c.publicShareUrl = :shareUrl AND c.isActive = true")
    Optional<Certificate> findByPublicShareUrl(@Param("shareUrl") String shareUrl);
    
    @Query("SELECT c FROM Certificate c WHERE c.studentName LIKE %:searchTerm% OR c.courseName LIKE %:searchTerm%")
    Page<Certificate> searchByStudentNameOrCourseName(@Param("searchTerm") String searchTerm, Pageable pageable);
}
