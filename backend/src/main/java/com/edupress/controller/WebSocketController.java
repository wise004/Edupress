package com.edupress.controller;

import com.edupress.model.Notification;
import com.edupress.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.annotation.SendToUser;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.Map;

@Controller
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private NotificationService notificationService;

    @MessageMapping("/connect")
    @SendToUser("/queue/connected")
    public Map<String, String> handleConnect(Principal principal) {
        // Send confirmation message when user connects
        return Map.of(
            "type", "connection",
            "message", "Connected to real-time notifications",
            "userId", principal.getName()
        );
    }

    @MessageMapping("/notification/read")
    public void markNotificationAsRead(
            @Payload Map<String, Object> message,
            Principal principal) {
        try {
            Long notificationId = Long.valueOf(message.get("notificationId").toString());
            
            notificationService.markAsRead(notificationId);
            
            // Send confirmation back to user
            messagingTemplate.convertAndSendToUser(
                principal.getName(),
                "/queue/notification-read",
                Map.of(
                    "type", "notification_read",
                    "notificationId", notificationId,
                    "status", "success"
                )
            );
        } catch (Exception e) {
            // Send error back to user
            messagingTemplate.convertAndSendToUser(
                principal.getName(),
                "/queue/error",
                Map.of(
                    "type", "error",
                    "message", "Failed to mark notification as read: " + e.getMessage()
                )
            );
        }
    }

    @MessageMapping("/typing")
    @SendTo("/topic/typing")
    public Map<String, Object> handleTyping(@Payload Map<String, Object> message, Principal principal) {
        // Handle typing indicators for live chat/comments
        return Map.of(
            "type", "typing",
            "userId", principal.getName(),
            "isTyping", message.get("isTyping"),
            "location", message.get("location") // e.g., courseId, lessonId
        );
    }

    // Method to send real-time notifications to specific users
    public void sendNotificationToUser(String userId, Notification notification) {
        messagingTemplate.convertAndSendToUser(
            userId,
            "/queue/notifications",
            Map.of(
                "type", "notification",
                "id", notification.getId(),
                "title", notification.getTitle(),
                "message", notification.getMessage(),
                "notificationType", notification.getType().toString(),
                "actionUrl", notification.getActionUrl(),
                "createdAt", notification.getCreatedAt().toString()
            )
        );
    }

    // Method to send system-wide announcements
    public void sendSystemAnnouncement(String message, String type) {
        messagingTemplate.convertAndSend(
            "/topic/announcements",
            Map.of(
                "type", "system_announcement",
                "message", message,
                "announcementType", type,
                "timestamp", System.currentTimeMillis()
            )
        );
    }

    // Method to send course-specific updates
    public void sendCourseUpdate(String courseId, String message, String updateType) {
        messagingTemplate.convertAndSend(
            "/topic/course/" + courseId,
            Map.of(
                "type", "course_update",
                "courseId", courseId,
                "message", message,
                "updateType", updateType,
                "timestamp", System.currentTimeMillis()
            )
        );
    }

    // Method to send enrollment confirmations
    public void sendEnrollmentConfirmation(String userId, String courseId, String courseName) {
        messagingTemplate.convertAndSendToUser(
            userId,
            "/queue/enrollment",
            Map.of(
                "type", "enrollment_confirmation",
                "courseId", courseId,
                "courseName", courseName,
                "message", "Successfully enrolled in " + courseName,
                "timestamp", System.currentTimeMillis()
            )
        );
    }
}
