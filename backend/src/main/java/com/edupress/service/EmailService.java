package com.edupress.service;

import com.edupress.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.name:EduPress}")
    private String appName;

    @Value("${app.url:http://localhost:3000}")
    private String appUrl;

    public void sendSimpleEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            
            mailSender.send(message);
            logger.info("Simple email sent successfully to: {}", to);
        } catch (Exception e) {
            logger.error("Error sending simple email to {}: ", to, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }

    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            logger.info("HTML email sent successfully to: {}", to);
        } catch (MessagingException e) {
            logger.error("Error sending HTML email to {}: ", to, e);
            throw new RuntimeException("Failed to send email", e);
        }
    }

    // Welcome email for new users
    public void sendWelcomeEmail(User user) {
        String subject = "Welcome to " + appName + "!";
        String content = String.format(
            "Dear %s,\n\n" +
            "Welcome to %s! We're excited to have you join our learning community.\n\n" +
            "You can start exploring courses and begin your learning journey right away.\n\n" +
            "Visit our platform: %s\n\n" +
            "If you have any questions, feel free to contact our support team.\n\n" +
            "Best regards,\n" +
            "The %s Team",
            user.getFirstName(), appName, appUrl, appName
        );
        
        sendSimpleEmail(user.getEmail(), subject, content);
    }

    // Course enrollment confirmation
    public void sendEnrollmentConfirmation(User user, String courseName) {
        String subject = "Course Enrollment Confirmation - " + courseName;
        String content = String.format(
            "Dear %s,\n\n" +
            "Congratulations! You have successfully enrolled in the course: %s\n\n" +
            "You can access your course materials anytime from your dashboard.\n\n" +
            "Visit your dashboard: %s/dashboard\n\n" +
            "Happy learning!\n\n" +
            "Best regards,\n" +
            "The %s Team",
            user.getFirstName(), courseName, appUrl, appName
        );
        
        sendSimpleEmail(user.getEmail(), subject, content);
    }

    // Course completion certificate
    public void sendCertificateEmail(User user, String courseName, String certificateUrl) {
        String subject = "Certificate of Completion - " + courseName;
        String content = String.format(
            "Dear %s,\n\n" +
            "Congratulations on completing the course: %s!\n\n" +
            "Your certificate of completion is ready. You can download it from the link below:\n" +
            "%s\n\n" +
            "We're proud of your achievement and wish you continued success in your learning journey.\n\n" +
            "Best regards,\n" +
            "The %s Team",
            user.getFirstName(), courseName, certificateUrl, appName
        );
        
        sendSimpleEmail(user.getEmail(), subject, content);
    }

    // Password reset email
    public void sendPasswordResetEmail(User user, String resetToken) {
        String subject = "Password Reset Request - " + appName;
        String resetUrl = appUrl + "/reset-password?token=" + resetToken;
        String content = String.format(
            "Dear %s,\n\n" +
            "You have requested to reset your password for your %s account.\n\n" +
            "Please click the link below to reset your password:\n" +
            "%s\n\n" +
            "This link will expire in 24 hours for security reasons.\n\n" +
            "If you did not request this password reset, please ignore this email.\n\n" +
            "Best regards,\n" +
            "The %s Team",
            user.getFirstName(), appName, resetUrl, appName
        );
        
        sendSimpleEmail(user.getEmail(), subject, content);
    }

    // Email verification
    public void sendEmailVerification(User user, String verificationToken) {
        String subject = "Verify Your Email - " + appName;
        String verificationUrl = appUrl + "/verify-email?token=" + verificationToken;
        String content = String.format(
            "Dear %s,\n\n" +
            "Thank you for registering with %s!\n\n" +
            "Please click the link below to verify your email address:\n" +
            "%s\n\n" +
            "This link will expire in 24 hours.\n\n" +
            "If you did not create this account, please ignore this email.\n\n" +
            "Best regards,\n" +
            "The %s Team",
            user.getFirstName(), appName, verificationUrl, appName
        );
        
        sendSimpleEmail(user.getEmail(), subject, content);
    }

    // Instructor course approval notification
    public void sendCourseApprovalEmail(User instructor, String courseName, boolean approved) {
        String subject = approved ? 
            "Course Approved - " + courseName : 
            "Course Needs Revision - " + courseName;
        
        String content = approved ?
            String.format(
                "Dear %s,\n\n" +
                "Great news! Your course '%s' has been approved and is now live on %s.\n\n" +
                "Students can now enroll and start learning from your course.\n\n" +
                "View your course: %s/courses\n\n" +
                "Best regards,\n" +
                "The %s Team",
                instructor.getFirstName(), courseName, appName, appUrl, appName
            ) :
            String.format(
                "Dear %s,\n\n" +
                "Your course '%s' needs some revisions before it can be published.\n\n" +
                "Please review the feedback in your instructor dashboard and make the necessary changes.\n\n" +
                "Visit your dashboard: %s/instructor/dashboard\n\n" +
                "Best regards,\n" +
                "The %s Team",
                instructor.getFirstName(), courseName, appUrl, appName
            );
        
        sendSimpleEmail(instructor.getEmail(), subject, content);
    }

    // Contact form notification
    public void sendContactFormNotification(String name, String email, String subject, String message) {
        String adminSubject = "New Contact Form Submission - " + subject;
        String adminContent = String.format(
            "New contact form submission received:\n\n" +
            "Name: %s\n" +
            "Email: %s\n" +
            "Subject: %s\n\n" +
            "Message:\n%s\n\n" +
            "Please respond to the user at: %s",
            name, email, subject, message, email
        );
        
        // Send to admin (you would configure admin email)
        sendSimpleEmail(fromEmail, adminSubject, adminContent);
        
        // Send confirmation to user
        String userSubject = "Thank you for contacting " + appName;
        String userContent = String.format(
            "Dear %s,\n\n" +
            "Thank you for contacting us. We have received your message and will get back to you as soon as possible.\n\n" +
            "Your message:\n%s\n\n" +
            "Best regards,\n" +
            "The %s Team",
            name, message, appName
        );
        
        sendSimpleEmail(email, userSubject, userContent);
    }
}
