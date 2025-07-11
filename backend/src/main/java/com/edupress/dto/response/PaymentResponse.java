package com.edupress.dto.response;

import com.edupress.model.Payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class PaymentResponse {
    
    private Long id;
    private String stripePaymentIntentId;
    private String clientSecret;
    private BigDecimal amount;
    private String currency;
    private Payment.PaymentStatus status;
    private String description;
    private Long courseId;
    private String courseTitle;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
    
    // Constructors
    public PaymentResponse() {}
    
    public PaymentResponse(Payment payment) {
        this.id = payment.getId();
        this.stripePaymentIntentId = payment.getStripePaymentIntentId();
        this.amount = payment.getAmount();
        this.currency = payment.getCurrency();
        this.status = payment.getStatus();
        this.description = payment.getDescription();
        this.createdAt = payment.getCreatedAt();
        this.completedAt = payment.getCompletedAt();
        
        if (payment.getCourse() != null) {
            this.courseId = payment.getCourse().getId();
            this.courseTitle = payment.getCourse().getTitle();
        }
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getStripePaymentIntentId() {
        return stripePaymentIntentId;
    }
    
    public void setStripePaymentIntentId(String stripePaymentIntentId) {
        this.stripePaymentIntentId = stripePaymentIntentId;
    }
    
    public String getClientSecret() {
        return clientSecret;
    }
    
    public void setClientSecret(String clientSecret) {
        this.clientSecret = clientSecret;
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
    
    public Payment.PaymentStatus getStatus() {
        return status;
    }
    
    public void setStatus(Payment.PaymentStatus status) {
        this.status = status;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Long getCourseId() {
        return courseId;
    }
    
    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }
    
    public String getCourseTitle() {
        return courseTitle;
    }
    
    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getCompletedAt() {
        return completedAt;
    }
    
    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }
}
