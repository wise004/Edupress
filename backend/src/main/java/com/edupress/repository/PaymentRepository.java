package com.edupress.repository;

import com.edupress.model.Payment;
import com.edupress.model.User;
import com.edupress.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    Optional<Payment> findByStripePaymentIntentId(String stripePaymentIntentId);
    
    List<Payment> findByUserOrderByCreatedAtDesc(User user);
    
    List<Payment> findByCourseOrderByCreatedAtDesc(Course course);
    
    List<Payment> findByUserAndCourse(User user, Course course);
    
    List<Payment> findByStatus(Payment.PaymentStatus status);
    
    @Query("SELECT p FROM Payment p WHERE p.user.id = :userId ORDER BY p.createdAt DESC")
    List<Payment> findByUserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
    
    @Query("SELECT p FROM Payment p WHERE p.course.id = :courseId ORDER BY p.createdAt DESC")
    List<Payment> findByCourseIdOrderByCreatedAtDesc(@Param("courseId") Long courseId);
    
    @Query("SELECT p FROM Payment p WHERE p.user.id = :userId AND p.course.id = :courseId AND p.status = :status")
    Optional<Payment> findByUserIdAndCourseIdAndStatus(
        @Param("userId") Long userId, 
        @Param("courseId") Long courseId, 
        @Param("status") Payment.PaymentStatus status
    );
    
    @Query("SELECT COUNT(p) FROM Payment p WHERE p.status = 'SUCCEEDED'")
    Long countSuccessfulPayments();
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'SUCCEEDED'")
    Double getTotalRevenue();
    
    boolean existsByUserAndCourseAndStatus(User user, Course course, Payment.PaymentStatus status);
}
