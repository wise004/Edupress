package com.edupress.controller;

import com.edupress.model.Notification;
import com.edupress.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    // Get notifications for current user
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<Notification>> getUserNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) Boolean isRead) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notifications;
        
        if (isRead != null) {
            notifications = notificationService.findUserNotificationsByReadStatus(isRead, pageable);
        } else {
            notifications = notificationService.findUserNotifications(pageable);
        }
        
        return ResponseEntity.ok(notifications);
    }

    // Get unread notifications count
    @GetMapping("/unread-count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Long> getUnreadNotificationsCount() {
        long count = notificationService.getUnreadNotificationsCount();
        return ResponseEntity.ok(count);
    }

    // Mark notification as read
    @PutMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id) {
        try {
            Notification notification = notificationService.markAsRead(id);
            return ResponseEntity.ok(notification);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Mark all notifications as read
    @PutMapping("/mark-all-read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> markAllAsRead() {
        try {
            notificationService.markAllAsRead();
            return ResponseEntity.ok("All notifications marked as read");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Delete notification
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
        try {
            notificationService.deleteNotification(id);
            return ResponseEntity.ok("Notification deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Delete all read notifications
    @DeleteMapping("/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteReadNotifications() {
        try {
            notificationService.deleteReadNotifications();
            return ResponseEntity.ok("Read notifications deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Admin endpoints
    @PostMapping("/send")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Notification> sendNotification(@RequestBody Notification notification) {
        try {
            Notification sentNotification = notificationService.sendNotification(notification);
            return ResponseEntity.ok(sentNotification);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/broadcast")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> broadcastNotification(@RequestBody Notification notification) {
        try {
            notificationService.broadcastNotification(notification.getTitle(), notification.getMessage(), notification.getType());
            return ResponseEntity.ok("Notification broadcasted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/send-to-role")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> sendNotificationToRole(
            @RequestParam String role,
            @RequestBody Notification notification) {
        try {
            notificationService.sendNotificationToRole(role, notification.getTitle(), notification.getMessage(), notification.getType());
            return ResponseEntity.ok("Notification sent to " + role + " users successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get all notifications (admin only)
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<Notification>> getAllNotifications(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Notification> notifications = notificationService.findAllNotifications(pageable);
        return ResponseEntity.ok(notifications);
    }

    // Get notification statistics (admin only)
    @GetMapping("/stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getNotificationStats() {
        return ResponseEntity.ok(notificationService.getNotificationStats());
    }
}
