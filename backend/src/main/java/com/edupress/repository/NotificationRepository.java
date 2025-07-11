package com.edupress.repository;

import com.edupress.model.Notification;
import com.edupress.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    
    Page<Notification> findByUserOrderByCreatedAtDesc(User user, Pageable pageable);
    
    Page<Notification> findByUserAndIsReadOrderByCreatedAtDesc(User user, Boolean isRead, Pageable pageable);
    
    List<Notification> findTop10ByUserAndIsReadFalseOrderByCreatedAtDesc(User user);
    
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.user = :user AND n.isRead = false")
    long countUnreadByUser(@Param("user") User user);
    
    @Modifying
    @Query("UPDATE Notification n SET n.isRead = true, n.readAt = :readAt WHERE n.user = :user AND n.isRead = false")
    int markAllAsReadByUser(@Param("user") User user, @Param("readAt") LocalDateTime readAt);
    
    @Modifying
    @Query("DELETE FROM Notification n WHERE n.user = :user AND n.createdAt < :before")
    int deleteOldNotificationsByUser(@Param("user") User user, @Param("before") LocalDateTime before);
    
    @Query("SELECT n FROM Notification n WHERE n.type = :type AND n.createdAt >= :after")
    List<Notification> findByTypeAndCreatedAfter(@Param("type") Notification.Type type, 
                                                @Param("after") LocalDateTime after);

    // Add missing method for statistics
    long countByIsRead(boolean isRead);
    
    long countByIsReadFalse();
    
    long countByIsReadTrue();
}
