package com.edupress.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

public class PaymentRequest {
    
    @NotNull(message = "Course ID is required")
    private Long courseId;
    
    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;
    
    private String currency = "USD";
    
    private String receiptEmail;
    
    private String paymentMethodId;
    
    private boolean confirmPayment = true;
    
    // Constructors
    public PaymentRequest() {}
    
    public PaymentRequest(Long courseId, BigDecimal amount) {
        this.courseId = courseId;
        this.amount = amount;
    }
    
    // Getters and Setters
    public Long getCourseId() {
        return courseId;
    }
    
    public void setCourseId(Long courseId) {
        this.courseId = courseId;
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
    
    public String getReceiptEmail() {
        return receiptEmail;
    }
    
    public void setReceiptEmail(String receiptEmail) {
        this.receiptEmail = receiptEmail;
    }
    
    public String getPaymentMethodId() {
        return paymentMethodId;
    }
    
    public void setPaymentMethodId(String paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }
    
    public boolean isConfirmPayment() {
        return confirmPayment;
    }
    
    public void setConfirmPayment(boolean confirmPayment) {
        this.confirmPayment = confirmPayment;
    }
}
