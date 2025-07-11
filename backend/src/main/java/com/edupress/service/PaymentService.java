package com.edupress.service;

import com.edupress.dto.request.PaymentRequest;
import com.edupress.dto.response.PaymentResponse;
import com.edupress.model.Course;
import com.edupress.model.Notification;
import com.edupress.model.Payment;
import com.edupress.model.User;
import com.edupress.repository.CourseRepository;
import com.edupress.repository.PaymentRepository;
import com.edupress.repository.UserRepository;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.PaymentIntentConfirmParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PaymentService {
    
    @Autowired
    private PaymentRepository paymentRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private EmailService emailService;
    
    @Value("${stripe.api.key}")
    private String stripeSecretKey;
    
    public double getInstructorEarnings(Long instructorId) {
        // Calculate total earnings for instructor across all their courses
        // In a real implementation, this would sum up all successful payments
        // for courses taught by this instructor
        return Math.random() * 10000 + 1000; // Simulated earnings between $1000-$11000
    }
    
    public PaymentService() {
        // Stripe.apiKey will be set in @PostConstruct method
    }
    
    @jakarta.annotation.PostConstruct
    public void init() {
        Stripe.apiKey = stripeSecretKey;
    }
    
    public PaymentResponse createPaymentIntent(Long userId, PaymentRequest request) throws StripeException {
        // Fetch user and course
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));
        
        // Check if user already has access to this course
        if (user.getEnrolledCourses().contains(course)) {
            throw new RuntimeException("User already enrolled in this course");
        }
        
        // Check if there's already a successful payment for this course
        if (paymentRepository.existsByUserAndCourseAndStatus(user, course, Payment.PaymentStatus.SUCCEEDED)) {
            throw new RuntimeException("Payment already completed for this course");
        }
        
        // Create Stripe PaymentIntent
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(request.getAmount().multiply(BigDecimal.valueOf(100)).longValue()) // Convert to cents
                .setCurrency(request.getCurrency().toLowerCase())
                .setDescription("Course enrollment: " + course.getTitle())
                .setReceiptEmail(request.getReceiptEmail() != null ? request.getReceiptEmail() : user.getEmail())
                .putMetadata("user_id", user.getId().toString())
                .putMetadata("course_id", course.getId().toString())
                .putMetadata("user_email", user.getEmail())
                .putMetadata("course_title", course.getTitle())
                .build();
        
        PaymentIntent intent = PaymentIntent.create(params);
        
        // Save payment record
        Payment payment = new Payment(user, course, request.getAmount(), intent.getId());
        payment.setReceiptEmail(request.getReceiptEmail() != null ? request.getReceiptEmail() : user.getEmail());
        payment.setCurrency(request.getCurrency());
        payment.setStatus(mapStripeStatusToPaymentStatus(intent.getStatus()));
        
        payment = paymentRepository.save(payment);
        
        // Create response
        PaymentResponse response = new PaymentResponse(payment);
        response.setClientSecret(intent.getClientSecret());
        
        return response;
    }
    
    public PaymentResponse confirmPayment(Long userId, String paymentIntentId, String paymentMethodId) throws StripeException {
        // Find payment record
        Payment payment = paymentRepository.findByStripePaymentIntentId(paymentIntentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        
        // Verify user ownership
        if (!payment.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to payment");
        }
        
        // Confirm payment with Stripe
        PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);
        
        if (paymentMethodId != null && !paymentMethodId.isEmpty()) {
            PaymentIntentConfirmParams confirmParams = PaymentIntentConfirmParams.builder()
                    .setPaymentMethod(paymentMethodId)
                    .build();
            intent = intent.confirm(confirmParams);
        } else {
            intent = intent.confirm();
        }
        
        // Update payment record
        payment.setStripePaymentMethodId(paymentMethodId);
        payment.setStatus(mapStripeStatusToPaymentStatus(intent.getStatus()));
        payment = paymentRepository.save(payment);
        
        // If payment succeeded, enroll user in course
        if (payment.getStatus() == Payment.PaymentStatus.SUCCEEDED) {
            enrollUserInCourse(payment.getUser(), payment.getCourse());
            
            // Send success notifications
            sendPaymentSuccessNotifications(payment);
        }
        
        PaymentResponse response = new PaymentResponse(payment);
        response.setClientSecret(intent.getClientSecret());
        
        return response;
    }
    
    public PaymentResponse getPaymentStatus(Long userId, String paymentIntentId) throws StripeException {
        Payment payment = paymentRepository.findByStripePaymentIntentId(paymentIntentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        
        // Verify user ownership
        if (!payment.getUser().getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to payment");
        }
        
        // Get latest status from Stripe
        PaymentIntent intent = PaymentIntent.retrieve(paymentIntentId);
        
        // Update local payment status
        payment.setStatus(mapStripeStatusToPaymentStatus(intent.getStatus()));
        payment = paymentRepository.save(payment);
        
        // If payment succeeded, enroll user in course
        if (payment.getStatus() == Payment.PaymentStatus.SUCCEEDED && 
            !payment.getUser().getEnrolledCourses().contains(payment.getCourse())) {
            enrollUserInCourse(payment.getUser(), payment.getCourse());
            sendPaymentSuccessNotifications(payment);
        }
        
        PaymentResponse response = new PaymentResponse(payment);
        response.setClientSecret(intent.getClientSecret());
        
        return response;
    }
    
    public List<PaymentResponse> getUserPayments(Long userId) {
        List<Payment> payments = paymentRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return payments.stream()
                .map(PaymentResponse::new)
                .collect(Collectors.toList());
    }
    
    public List<PaymentResponse> getCoursePayments(Long courseId) {
        List<Payment> payments = paymentRepository.findByCourseIdOrderByCreatedAtDesc(courseId);
        return payments.stream()
                .map(PaymentResponse::new)
                .collect(Collectors.toList());
    }
    
    public Map<String, Object> getPaymentStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalPayments", paymentRepository.count());
        stats.put("successfulPayments", paymentRepository.countSuccessfulPayments());
        stats.put("totalRevenue", paymentRepository.getTotalRevenue());
        return stats;
    }
    
    private void enrollUserInCourse(User user, Course course) {
        user.getEnrolledCourses().add(course);
        course.setEnrollmentCount(course.getEnrollmentCount() + 1);
        
        userRepository.save(user);
        courseRepository.save(course);
    }
    
    private void sendPaymentSuccessNotifications(Payment payment) {
        try {
            // Send in-app notification
            notificationService.createNotification(
                payment.getUser(),
                "Payment Successful",
                "Your payment for \"" + payment.getCourse().getTitle() + "\" was successful. You now have access to the course!",
                Notification.Type.SUCCESS,
                "/courses/" + payment.getCourse().getId()
            );
            
            // Send email notification
            String subject = "Payment Confirmation - " + payment.getCourse().getTitle();
            String body = String.format(
                "Dear %s,\n\n" +
                "Your payment for the course \"%s\" has been processed successfully.\n\n" +
                "Payment Details:\n" +
                "- Amount: %s %s\n" +
                "- Course: %s\n" +
                "- Payment ID: %s\n\n" +
                "You now have full access to the course. Start learning today!\n\n" +
                "Best regards,\n" +
                "The EduPress Team",
                payment.getUser().getFirstName(),
                payment.getCourse().getTitle(),
                payment.getAmount(),
                payment.getCurrency().toUpperCase(),
                payment.getCourse().getTitle(),
                payment.getStripePaymentIntentId()
            );
            
            emailService.sendSimpleEmail(payment.getReceiptEmail(), subject, body);
            
        } catch (Exception e) {
            // Log error but don't fail the payment process
            System.err.println("Failed to send payment success notifications: " + e.getMessage());
        }
    }
    
    private Payment.PaymentStatus mapStripeStatusToPaymentStatus(String stripeStatus) {
        return switch (stripeStatus) {
            case "requires_payment_method" -> Payment.PaymentStatus.REQUIRES_PAYMENT_METHOD;
            case "requires_confirmation" -> Payment.PaymentStatus.REQUIRES_CONFIRMATION;
            case "requires_action" -> Payment.PaymentStatus.REQUIRES_ACTION;
            case "processing" -> Payment.PaymentStatus.PROCESSING;
            case "requires_capture" -> Payment.PaymentStatus.REQUIRES_CAPTURE;
            case "canceled" -> Payment.PaymentStatus.CANCELED;
            case "succeeded" -> Payment.PaymentStatus.SUCCEEDED;
            default -> Payment.PaymentStatus.FAILED;
        };
    }
}
