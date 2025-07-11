package com.edupress.service;

import com.edupress.model.Notification;
import com.edupress.model.User;
import com.edupress.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    // Using @Lazy to avoid circular dependency with WebSocketController
    @Autowired
    @Lazy
    private com.edupress.controller.WebSocketController webSocketController;

    public Notification createNotification(User user, String title, String message, 
                                         Notification.Type type, String actionUrl) {
        Notification notification = new Notification(title, message, type, user);
        notification.setActionUrl(actionUrl);
        notification = notificationRepository.save(notification);
        
        // Send real-time notification via WebSocket
        try {
            if (webSocketController != null) {
                webSocketController.sendNotificationToUser(user.getId().toString(), notification);
            }
        } catch (Exception e) {
            // Log error but don't fail the notification creation
            System.err.println("Failed to send real-time notification: " + e.getMessage());
        }
        
        return notification;
    }

    public Notification createNotification(User user, String title, String message, Notification.Type type) {
        return createNotification(user, title, message, type, null);
    }

    public Page<Notification> getNotificationsByUser(User user, Pageable pageable) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user, pageable);
    }

    public Page<Notification> getUnreadNotificationsByUser(User user, Pageable pageable) {
        return notificationRepository.findByUserAndIsReadOrderByCreatedAtDesc(user, false, pageable);
    }

    public List<Notification> getRecentNotificationsByUser(User user) {
        return notificationRepository.findTop10ByUserAndIsReadFalseOrderByCreatedAtDesc(user);
    }

    public long getUnreadCountByUser(User user) {
        return notificationRepository.countUnreadByUser(user);
    }

    public Optional<Notification> findById(Long id) {
        return notificationRepository.findById(id);
    }

    public Notification markAsRead(Long notificationId) {
        Optional<Notification> notificationOpt = notificationRepository.findById(notificationId);
        if (notificationOpt.isPresent()) {
            Notification notification = notificationOpt.get();
            notification.setIsRead(true);
            notification.setReadAt(LocalDateTime.now());
            return notificationRepository.save(notification);
        }
        throw new RuntimeException("Notification not found with id: " + notificationId);
    }

    public int markAllAsReadByUser(User user) {
        return notificationRepository.markAllAsReadByUser(user, LocalDateTime.now());
    }

    public void deleteNotification(Long notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    // Additional methods for NotificationController
    public Page<Notification> findUserNotifications(Pageable pageable) {
        // In a real implementation, you'd get the current user from security context
        throw new RuntimeException("Current user not found in security context");
    }

    public Page<Notification> findUserNotificationsByReadStatus(Boolean isRead, Pageable pageable) {
        // In a real implementation, you'd get the current user from security context
        throw new RuntimeException("Current user not found in security context");
    }

    public long getUnreadNotificationsCount() {
        // In a real implementation, you'd get the current user from security context
        throw new RuntimeException("Current user not found in security context");
    }

    public void markAllAsRead() {
        // In a real implementation, you'd get the current user from security context
        // and mark all their notifications as read
        throw new RuntimeException("Current user not found in security context");
    }

    public void deleteReadNotifications() {
        // In a real implementation, you'd get the current user from security context
        // and delete all their read notifications
        throw new RuntimeException("Current user not found in security context");
    }

    public Notification sendNotification(Notification notification) {
        notification.setCreatedAt(LocalDateTime.now());
        return notificationRepository.save(notification);
    }

    public void broadcastNotification(String title, String message, Notification.Type type) {
        // In a real implementation, you'd send notification to all users
        throw new RuntimeException("Broadcast notification logic not yet implemented");
    }

    public void sendNotificationToRole(String role, String title, String message, Notification.Type type) {
        // In a real implementation, you'd send notification to all users with specific role
        throw new RuntimeException("Send notification to role logic not yet implemented");
    }

    public Page<Notification> findAllNotifications(Pageable pageable) {
        return notificationRepository.findAll(pageable);
    }

    public int cleanupOldNotifications(User user, int daysOld) {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        return notificationRepository.deleteOldNotificationsByUser(user, cutoffDate);
    }

    // Specific notification types
    public void notifyEnrollment(User user, String courseName) {
        createNotification(
            user,
            "Course Enrollment Successful",
            "You have successfully enrolled in: " + courseName,
            Notification.Type.SUCCESS,
            "/dashboard/courses"
        );
    }

    public void notifyCourseCompletion(User user, String courseName) {
        createNotification(
            user,
            "Course Completed!",
            "Congratulations! You have completed: " + courseName,
            Notification.Type.SUCCESS,
            "/dashboard/certificates"
        );
    }

    public void notifyPaymentSuccess(User user, String courseName, double amount) {
        createNotification(
            user,
            "Payment Successful",
            String.format("Payment of $%.2f for %s has been processed successfully", amount, courseName),
            Notification.Type.PAYMENT,
            "/dashboard/purchases"
        );
    }

    public void notifyPaymentFailed(User user, String courseName) {
        createNotification(
            user,
            "Payment Failed",
            "Payment for " + courseName + " could not be processed. Please try again.",
            Notification.Type.ERROR,
            "/dashboard/cart"
        );
    }

    public void notifyCourseUpdate(User user, String courseName) {
        createNotification(
            user,
            "Course Updated",
            "New content has been added to: " + courseName,
            Notification.Type.COURSE_UPDATE,
            "/courses"
        );
    }

    public void notifyInstructorCourseApproval(User instructor, String courseName, boolean approved) {
        if (approved) {
            createNotification(
                instructor,
                "Course Approved",
                "Your course '" + courseName + "' has been approved and is now live!",
                Notification.Type.SUCCESS,
                "/instructor/courses"
            );
        } else {
            createNotification(
                instructor,
                "Course Needs Revision",
                "Your course '" + courseName + "' needs some changes before approval.",
                Notification.Type.WARNING,
                "/instructor/courses"
            );
        }
    }

    public void notifySystemMaintenance(User user, String maintenanceMessage) {
        createNotification(
            user,
            "System Maintenance",
            maintenanceMessage,
            Notification.Type.SYSTEM
        );
    }

    public void notifyPasswordChanged(User user) {
        createNotification(
            user,
            "Password Changed",
            "Your password has been successfully changed.",
            Notification.Type.INFO,
            "/profile/security"
        );
    }

    public void notifyProfileUpdated(User user) {
        createNotification(
            user,
            "Profile Updated",
            "Your profile information has been successfully updated.",
            Notification.Type.INFO,
            "/profile"
        );
    }

    public Object getNotificationStats() {
        return new Object() {
            public final long totalNotifications = notificationRepository.count();
            public final long unreadNotifications = notificationRepository.countByIsReadFalse();
            public final long readNotifications = notificationRepository.countByIsReadTrue();
        };
    }

    public Object getRecentNotifications(User user, int limit) {
        return notificationRepository.findTop10ByUserAndIsReadFalseOrderByCreatedAtDesc(user);
    }

    public long getUnreadNotificationsCount(User user) {
        return notificationRepository.countUnreadByUser(user);
    }
}
