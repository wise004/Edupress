package com.edupress.repository;

import com.edupress.model.PaymeTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymeTransactionRepository extends JpaRepository<PaymeTransaction, Long> {
    
    Optional<PaymeTransaction> findByPaymeTransactionId(String paymeTransactionId);
    
    List<PaymeTransaction> findByUserIdOrderByCreatedAtDesc(Long userId);
    
    List<PaymeTransaction> findByCourseIdOrderByCreatedAtDesc(Long courseId);
    
    List<PaymeTransaction> findByState(PaymeTransaction.TransactionState state);
    
    @Query("SELECT pt FROM PaymeTransaction pt WHERE pt.createTime >= :from AND pt.createTime <= :to ORDER BY pt.createTime DESC")
    List<PaymeTransaction> findByCreateTimeBetween(@Param("from") Long from, @Param("to") Long to);
    
    @Query("SELECT pt FROM PaymeTransaction pt WHERE pt.user.id = :userId AND pt.course.id = :courseId")
    List<PaymeTransaction> findByUserIdAndCourseId(@Param("userId") Long userId, @Param("courseId") Long courseId);
    
    @Query("SELECT COUNT(pt) FROM PaymeTransaction pt WHERE pt.state = :state")
    Long countByState(@Param("state") PaymeTransaction.TransactionState state);
    
    @Query("SELECT SUM(pt.amount) FROM PaymeTransaction pt WHERE pt.state = :state")
    Long getTotalAmountByState(@Param("state") PaymeTransaction.TransactionState state);
    
    boolean existsByUserIdAndCourseIdAndState(Long userId, Long courseId, PaymeTransaction.TransactionState state);
    
    @Query("SELECT pt FROM PaymeTransaction pt WHERE pt.createdAt < :cutoffDate")
    List<PaymeTransaction> findOldTransactions(@Param("cutoffDate") LocalDateTime cutoffDate);
    
    // Admin methods for getting all transactions
    @Query("SELECT pt FROM PaymeTransaction pt ORDER BY pt.createdAt DESC")
    List<PaymeTransaction> findAllOrderByCreatedAtDesc();
    
    @Query("SELECT pt FROM PaymeTransaction pt WHERE pt.state = :state ORDER BY pt.createdAt DESC")
    List<PaymeTransaction> findByStateOrderByCreatedAtDesc(@Param("state") PaymeTransaction.TransactionState state);
}
