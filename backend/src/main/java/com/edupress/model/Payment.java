package com.edupress.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    @Column(name = "stripe_payment_intent_id", nullable = false, unique = true)
    private String stripePaymentIntentId;
    
    @Column(name = "stripe_payment_method_id")
    private String stripePaymentMethodId;
    
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;
    
    @Column(name = "currency", nullable = false)
    private String currency = "USD";
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private PaymentStatus status;
    
    @Column(name = "description")
    private String description;
    
    @Column(name = "receipt_email")
    private String receiptEmail;
    
    @Column(name = "metadata", columnDefinition = "TEXT")
    private String metadata;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "completed_at")
    private LocalDateTime completedAt;
    
    public enum PaymentStatus {
        REQUIRES_PAYMENT_METHOD,
        REQUIRES_CONFIRMATION,
        REQUIRES_ACTION,
        PROCESSING,
        REQUIRES_CAPTURE,
        CANCELED,
        SUCCEEDED,
        FAILED
    }
    
    // Constructors
    public Payment() {}
    
    public Payment(User user, Course course, BigDecimal amount, String stripePaymentIntentId) {
        this.user = user;
        this.course = course;
        this.amount = amount;
        this.stripePaymentIntentId = stripePaymentIntentId;
        this.status = PaymentStatus.REQUIRES_PAYMENT_METHOD;
        this.description = "Course enrollment: " + course.getTitle();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
    
    public Course getCourse() {
        return course;
    }
    
    public void setCourse(Course course) {
        this.course = course;
    }
    
    public String getStripePaymentIntentId() {
        return stripePaymentIntentId;
    }
    
    public void setStripePaymentIntentId(String stripePaymentIntentId) {
        this.stripePaymentIntentId = stripePaymentIntentId;
    }
    
    public String getStripePaymentMethodId() {
        return stripePaymentMethodId;
    }
    
    public void setStripePaymentMethodId(String stripePaymentMethodId) {
        this.stripePaymentMethodId = stripePaymentMethodId;
    }
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public String getCurrency() {
        return currency;
    }
    
    public void setCurrency(String currency) {
        this.currency = currency;
    }
    
    public PaymentStatus getStatus() {
        return status;
    }
    
    public void setStatus(PaymentStatus status) {
        this.status = status;
        if (status == PaymentStatus.SUCCEEDED && this.completedAt == null) {
            this.completedAt = LocalDateTime.now();
        }
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getReceiptEmail() {
        return receiptEmail;
    }
    
    public void setReceiptEmail(String receiptEmail) {
        this.receiptEmail = receiptEmail;
    }
    
    public String getMetadata() {
        return metadata;
    }
    
    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
    
    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
