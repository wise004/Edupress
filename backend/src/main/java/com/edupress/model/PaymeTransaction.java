package com.edupress.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payme_transactions")
public class PaymeTransaction {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "payme_transaction_id", unique = true)
    private String paymeTransactionId;
    
    @Column(name = "payme_time")
    private Long paymeTime;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;
    
    @Column(name = "amount", nullable = false)
    private BigDecimal amount; // in tiyin (1 so'm = 100 tiyin)
    
    @Column(name = "account", columnDefinition = "TEXT")
    private String account; // JSON string with account parameters
    
    @Enumerated(EnumType.ORDINAL)
    @Column(name = "state", nullable = false)
    private TransactionState state;
    
    @Column(name = "create_time")
    private Long createTime;
    
    @Column(name = "perform_time")
    private Long performTime;
    
    @Column(name = "cancel_time")
    private Long cancelTime;
    
    @Column(name = "reason")
    private Integer reason;
    
    @Column(name = "receivers", columnDefinition = "TEXT")
    private String receivers;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    public enum TransactionState {
        INITIAL(1),
        WAITING_PAY(2),
        PAY_ACCEPTED(3),
        CANCELLED_WHILE_WAITING(4),
        CANCELLED_AFTER_SUCCESSFUL(5);
        
        private final int value;
        
        TransactionState(int value) {
            this.value = value;
        }
        
        public int getValue() {
            return value;
        }
        
        public static TransactionState fromValue(int value) {
            for (TransactionState state : values()) {
                if (state.value == value) {
                    return state;
                }
            }
            throw new IllegalArgumentException("Unknown state value: " + value);
        }
    }
    
    // Constructors
    public PaymeTransaction() {}
    
    public PaymeTransaction(String paymeTransactionId, Long paymeTime, User user, Course course, 
                          BigDecimal amount, String account) {
        this.paymeTransactionId = paymeTransactionId;
        this.paymeTime = paymeTime;
        this.user = user;
        this.course = course;
        this.amount = amount;
        this.account = account;
        this.state = TransactionState.INITIAL;
        this.createTime = System.currentTimeMillis();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getPaymeTransactionId() {
        return paymeTransactionId;
    }
    
    public void setPaymeTransactionId(String paymeTransactionId) {
        this.paymeTransactionId = paymeTransactionId;
    }
    
    public Long getPaymeTime() {
        return paymeTime;
    }
    
    public void setPaymeTime(Long paymeTime) {
        this.paymeTime = paymeTime;
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
    
    public BigDecimal getAmount() {
        return amount;
    }
    
    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }
    
    public String getAccount() {
        return account;
    }
    
    public void setAccount(String account) {
        this.account = account;
    }
    
    public TransactionState getState() {
        return state;
    }
    
    public void setState(TransactionState state) {
        this.state = state;
    }
    
    public Long getCreateTime() {
        return createTime;
    }
    
    public void setCreateTime(Long createTime) {
        this.createTime = createTime;
    }
    
    public Long getPerformTime() {
        return performTime;
    }
    
    public void setPerformTime(Long performTime) {
        this.performTime = performTime;
    }
    
    public Long getCancelTime() {
        return cancelTime;
    }
    
    public void setCancelTime(Long cancelTime) {
        this.cancelTime = cancelTime;
    }
    
    public Integer getReason() {
        return reason;
    }
    
    public void setReason(Integer reason) {
        this.reason = reason;
    }
    
    public String getReceivers() {
        return receivers;
    }
    
    public void setReceivers(String receivers) {
        this.receivers = receivers;
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
}
