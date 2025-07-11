package com.edupress.dto.request;

public class PaymeRequest {
    private String method;
    private PaymeParams params;
    private int id;
    
    public PaymeRequest() {}
    
    // Getters and Setters
    public String getMethod() {
        return method;
    }
    
    public void setMethod(String method) {
        this.method = method;
    }
    
    public PaymeParams getParams() {
        return params;
    }
    
    public void setParams(PaymeParams params) {
        this.params = params;
    }
    
    public int getId() {
        return id;
    }
    
    public void setId(int id) {
        this.id = id;
    }
    
    public static class PaymeParams {
        private PaymeAccount account;
        private Long amount;
        private Long time;
        private String id; // transaction id
        private Integer reason;
        private Long from;
        private Long to;
        
        // Getters and Setters
        public PaymeAccount getAccount() {
            return account;
        }
        
        public void setAccount(PaymeAccount account) {
            this.account = account;
        }
        
        public Long getAmount() {
            return amount;
        }
        
        public void setAmount(Long amount) {
            this.amount = amount;
        }
        
        public Long getTime() {
            return time;
        }
        
        public void setTime(Long time) {
            this.time = time;
        }
        
        public String getId() {
            return id;
        }
        
        public void setId(String id) {
            this.id = id;
        }
        
        public Integer getReason() {
            return reason;
        }
        
        public void setReason(Integer reason) {
            this.reason = reason;
        }
        
        public Long getFrom() {
            return from;
        }
        
        public void setFrom(Long from) {
            this.from = from;
        }
        
        public Long getTo() {
            return to;
        }
        
        public void setTo(Long to) {
            this.to = to;
        }
    }
    
    public static class PaymeAccount {
        private Long courseId;
        private Long userId;
        
        // Getters and Setters
        public Long getCourseId() {
            return courseId;
        }
        
        public void setCourseId(Long courseId) {
            this.courseId = courseId;
        }
        
        public Long getUserId() {
            return userId;
        }
        
        public void setUserId(Long userId) {
            this.userId = userId;
        }
    }
}
