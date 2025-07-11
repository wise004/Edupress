package com.edupress.dto.response;

import java.util.List;

public class PaymeResponse {
    private PaymeResult result;
    private PaymeError error;
    private int id;
    
    public PaymeResponse() {}
    
    public PaymeResponse(int id) {
        this.id = id;
    }
    
    // Success response
    public PaymeResponse(PaymeResult result, int id) {
        this.result = result;
        this.id = id;
    }
    
    // Error response
    public PaymeResponse(PaymeError error, int id) {
        this.error = error;
        this.id = id;
    }
    
    // Getters and Setters
    public PaymeResult getResult() {
        return result;
    }
    
    public void setResult(PaymeResult result) {
        this.result = result;
    }
    
    public PaymeError getError() {
        return error;
    }
    
    public void setError(PaymeError error) {
        this.error = error;
    }
    
    public int getId() {
        return id;
    }
    
    public void setId(int id) {
        this.id = id;
    }
    
    // Result classes for different methods
    public static class PaymeResult {
        private String allow;
        private String transaction;
        private Long create_time;
        private Long perform_time;
        private Long cancel_time;
        private Integer state;
        private Integer reason;
        private List<PaymeReceiver> receivers;
        private List<PaymeTransaction> transactions;
        private PaymeDetail detail;
        
        // For CheckPerformTransaction
        public PaymeResult(String allow) {
            this.allow = allow;
        }
        
        // For CreateTransaction
        public PaymeResult(String transaction, Long create_time, Integer state) {
            this.transaction = transaction;
            this.create_time = create_time;
            this.state = state;
        }
        
        public PaymeResult() {}
        
        // Getters and Setters
        public String getAllow() {
            return allow;
        }
        
        public void setAllow(String allow) {
            this.allow = allow;
        }
        
        public String getTransaction() {
            return transaction;
        }
        
        public void setTransaction(String transaction) {
            this.transaction = transaction;
        }
        
        public Long getCreate_time() {
            return create_time;
        }
        
        public void setCreate_time(Long create_time) {
            this.create_time = create_time;
        }
        
        public Long getPerform_time() {
            return perform_time;
        }
        
        public void setPerform_time(Long perform_time) {
            this.perform_time = perform_time;
        }
        
        public Long getCancel_time() {
            return cancel_time;
        }
        
        public void setCancel_time(Long cancel_time) {
            this.cancel_time = cancel_time;
        }
        
        public Integer getState() {
            return state;
        }
        
        public void setState(Integer state) {
            this.state = state;
        }
        
        public Integer getReason() {
            return reason;
        }
        
        public void setReason(Integer reason) {
            this.reason = reason;
        }
        
        public List<PaymeReceiver> getReceivers() {
            return receivers;
        }
        
        public void setReceivers(List<PaymeReceiver> receivers) {
            this.receivers = receivers;
        }
        
        public List<PaymeTransaction> getTransactions() {
            return transactions;
        }
        
        public void setTransactions(List<PaymeTransaction> transactions) {
            this.transactions = transactions;
        }
        
        public PaymeDetail getDetail() {
            return detail;
        }
        
        public void setDetail(PaymeDetail detail) {
            this.detail = detail;
        }
    }
    
    public static class PaymeError {
        private int code;
        private String message;
        private String data;
        
        public PaymeError(int code, String message) {
            this.code = code;
            this.message = message;
        }
        
        public PaymeError(int code, String message, String data) {
            this.code = code;
            this.message = message;
            this.data = data;
        }
        
        // Getters and Setters
        public int getCode() {
            return code;
        }
        
        public void setCode(int code) {
            this.code = code;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
        
        public String getData() {
            return data;
        }
        
        public void setData(String data) {
            this.data = data;
        }
    }
    
    public static class PaymeReceiver {
        private String id;
        private Long amount;
        
        public PaymeReceiver(String id, Long amount) {
            this.id = id;
            this.amount = amount;
        }
        
        // Getters and Setters
        public String getId() {
            return id;
        }
        
        public void setId(String id) {
            this.id = id;
        }
        
        public Long getAmount() {
            return amount;
        }
        
        public void setAmount(Long amount) {
            this.amount = amount;
        }
    }
    
    public static class PaymeTransaction {
        private String id;
        private Long time;
        private Long amount;
        private String account;
        private Long create_time;
        private Long perform_time;
        private Long cancel_time;
        private String transaction;
        private Integer state;
        private Integer reason;
        private List<PaymeReceiver> receivers;
        
        // Getters and Setters
        public String getId() {
            return id;
        }
        
        public void setId(String id) {
            this.id = id;
        }
        
        public Long getTime() {
            return time;
        }
        
        public void setTime(Long time) {
            this.time = time;
        }
        
        public Long getAmount() {
            return amount;
        }
        
        public void setAmount(Long amount) {
            this.amount = amount;
        }
        
        public String getAccount() {
            return account;
        }
        
        public void setAccount(String account) {
            this.account = account;
        }
        
        public Long getCreate_time() {
            return create_time;
        }
        
        public void setCreate_time(Long create_time) {
            this.create_time = create_time;
        }
        
        public Long getPerform_time() {
            return perform_time;
        }
        
        public void setPerform_time(Long perform_time) {
            this.perform_time = perform_time;
        }
        
        public Long getCancel_time() {
            return cancel_time;
        }
        
        public void setCancel_time(Long cancel_time) {
            this.cancel_time = cancel_time;
        }
        
        public String getTransaction() {
            return transaction;
        }
        
        public void setTransaction(String transaction) {
            this.transaction = transaction;
        }
        
        public Integer getState() {
            return state;
        }
        
        public void setState(Integer state) {
            this.state = state;
        }
        
        public Integer getReason() {
            return reason;
        }
        
        public void setReason(Integer reason) {
            this.reason = reason;
        }
        
        public List<PaymeReceiver> getReceivers() {
            return receivers;
        }
        
        public void setReceivers(List<PaymeReceiver> receivers) {
            this.receivers = receivers;
        }
    }
    
    public static class PaymeDetail {
        private List<PaymeItem> items;
        
        public PaymeDetail(List<PaymeItem> items) {
            this.items = items;
        }
        
        // Getters and Setters
        public List<PaymeItem> getItems() {
            return items;
        }
        
        public void setItems(List<PaymeItem> items) {
            this.items = items;
        }
    }
    
    public static class PaymeItem {
        private String title;
        private Long price; // in tiyin
        private Integer count;
        private String code; // MXIK kodi
        private String package_code;
        private Integer vat_percent;
        
        public PaymeItem(String title, Long price, Integer count, String code, String package_code, Integer vat_percent) {
            this.title = title;
            this.price = price;
            this.count = count;
            this.code = code;
            this.package_code = package_code;
            this.vat_percent = vat_percent;
        }
        
        // Getters and Setters
        public String getTitle() {
            return title;
        }
        
        public void setTitle(String title) {
            this.title = title;
        }
        
        public Long getPrice() {
            return price;
        }
        
        public void setPrice(Long price) {
            this.price = price;
        }
        
        public Integer getCount() {
            return count;
        }
        
        public void setCount(Integer count) {
            this.count = count;
        }
        
        public String getCode() {
            return code;
        }
        
        public void setCode(String code) {
            this.code = code;
        }
        
        public String getPackage_code() {
            return package_code;
        }
        
        public void setPackage_code(String package_code) {
            this.package_code = package_code;
        }
        
        public Integer getVat_percent() {
            return vat_percent;
        }
        
        public void setVat_percent(Integer vat_percent) {
            this.vat_percent = vat_percent;
        }
    }
}
