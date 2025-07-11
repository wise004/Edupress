package com.edupress.service;

import com.edupress.dto.request.PaymeRequest;
import com.edupress.dto.response.PaymeResponse;
import com.edupress.model.Course;
import com.edupress.model.PaymeTransaction;
import com.edupress.model.User;
import com.edupress.repository.CourseRepository;
import com.edupress.repository.PaymeTransactionRepository;
import com.edupress.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;

@Service
@Transactional
public class PaymeService {
    
    @Autowired
    private PaymeTransactionRepository paymeTransactionRepository;
    
    @Autowired
    private CourseRepository courseRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private EmailService emailService;
    
    @Value("${payme.merchant.id}")
    private String merchantId;
    
    @Value("${payme.merchant.key}")
    private String merchantKey;
    
    @Value("${payme.test.key}")
    private String testKey;
    
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    // MXIK code for online educational services
    private static final String EDUCATION_SERVICE_MXIK = "62020900";
    private static final String EDUCATION_SERVICE_PACKAGE = "796";
    private static final int VAT_PERCENT = 12; // QQS 12%
    
    // Payme Error Codes
    public static final int ERROR_INSUFFICIENT_PRIVILEGE = -32504;
    public static final int ERROR_INVALID_AMOUNT = -31001;
    public static final int ERROR_TRANSACTION_NOT_FOUND = -31003;
    public static final int ERROR_INVALID_ACCOUNT = -31008;
    public static final int ERROR_TRANSACTION_CANCELLED = -31008;
    public static final int ERROR_TRANSACTION_NOT_CANCELLED = -31007;
    public static final int ERROR_UNABLE_TO_PERFORM_TRANSACTION = -31006;
    public static final int ERROR_TRANSACTION_NOT_PERFORMED = -31023;
    
    public PaymeResponse processRequest(PaymeRequest request) {
        try {
            return switch (request.getMethod()) {
                case "CheckPerformTransaction" -> checkPerformTransaction(request);
                case "CreateTransaction" -> createTransaction(request);
                case "PerformTransaction" -> performTransaction(request);
                case "CancelTransaction" -> cancelTransaction(request);
                case "CheckTransaction" -> checkTransaction(request);
                case "GetStatement" -> getStatement(request);
                default -> new PaymeResponse(
                    new PaymeResponse.PaymeError(-32601, "Method not found"),
                    request.getId()
                );
            };
        } catch (Exception e) {
            return new PaymeResponse(
                new PaymeResponse.PaymeError(-32603, "Internal error: " + e.getMessage()),
                request.getId()
            );
        }
    }
    
    private PaymeResponse checkPerformTransaction(PaymeRequest request) {
        try {
            PaymeRequest.PaymeAccount account = request.getParams().getAccount();
            Long amount = request.getParams().getAmount();
            
            // Validate account parameters
            if (account.getCourseId() == null || account.getUserId() == null) {
                return new PaymeResponse(
                    new PaymeResponse.PaymeError(ERROR_INVALID_ACCOUNT, "Invalid account parameters"),
                    request.getId()
                );
            }
            
            // Check if course exists
            Optional<Course> courseOpt = courseRepository.findById(account.getCourseId());
            if (courseOpt.isEmpty()) {
                return new PaymeResponse(
                    new PaymeResponse.PaymeError(ERROR_INVALID_ACCOUNT, "Course not found"),
                    request.getId()
                );
            }
            
            Course course = courseOpt.get();
            
            // Check if user exists
            Optional<User> userOpt = userRepository.findById(account.getUserId());
            if (userOpt.isEmpty()) {
                return new PaymeResponse(
                    new PaymeResponse.PaymeError(ERROR_INVALID_ACCOUNT, "User not found"),
                    request.getId()
                );
            }
            
            User user = userOpt.get();
            
            // Check if user is already enrolled
            if (user.getEnrolledCourses().contains(course)) {
                return new PaymeResponse(
                    new PaymeResponse.PaymeError(ERROR_UNABLE_TO_PERFORM_TRANSACTION, "User already enrolled"),
                    request.getId()
                );
            }
            
            // Check amount (convert course price to tiyin)
            Long expectedAmount = course.getPrice().multiply(BigDecimal.valueOf(100)).longValue();
            if (!amount.equals(expectedAmount)) {
                return new PaymeResponse(
                    new PaymeResponse.PaymeError(ERROR_INVALID_AMOUNT, 
                        String.format("Invalid amount. Expected: %d, Received: %d", expectedAmount, amount)),
                    request.getId()
                );
            }
            
            // Create detail object for tax purposes
            PaymeResponse.PaymeDetail detail = createDetailForCourse(course);
            
            PaymeResponse.PaymeResult result = new PaymeResponse.PaymeResult("allow");
            result.setDetail(detail);
            
            return new PaymeResponse(result, request.getId());
            
        } catch (Exception e) {
            return new PaymeResponse(
                new PaymeResponse.PaymeError(-32603, "Error checking transaction: " + e.getMessage()),
                request.getId()
            );
        }
    }
    
    private PaymeResponse createTransaction(PaymeRequest request) {
        try {
            String transactionId = request.getParams().getId();
            Long time = request.getParams().getTime();
            Long amount = request.getParams().getAmount();
            PaymeRequest.PaymeAccount account = request.getParams().getAccount();
            
            // Check if transaction already exists
            Optional<PaymeTransaction> existingTransaction = paymeTransactionRepository.findByPaymeTransactionId(transactionId);
            if (existingTransaction.isPresent()) {
                PaymeTransaction transaction = existingTransaction.get();
                
                // Verify transaction parameters
                if (!transaction.getAmount().equals(BigDecimal.valueOf(amount).divide(BigDecimal.valueOf(100))) ||
                    !transaction.getPaymeTime().equals(time)) {
                    return new PaymeResponse(
                        new PaymeResponse.PaymeError(ERROR_INVALID_AMOUNT, "Transaction parameters mismatch"),
                        request.getId()
                    );
                }
                
                if (transaction.getState() == PaymeTransaction.TransactionState.INITIAL) {
                    PaymeResponse.PaymeResult result = new PaymeResponse.PaymeResult(
                        transactionId, 
                        transaction.getCreateTime(),
                        transaction.getState().getValue()
                    );
                    return new PaymeResponse(result, request.getId());
                }
            }
            
            // Validate account and amount again
            PaymeResponse checkResult = checkPerformTransaction(request);
            if (checkResult.getError() != null) {
                return checkResult;
            }
            
            // Get user and course
            User user = userRepository.findById(account.getUserId()).orElseThrow();
            Course course = courseRepository.findById(account.getCourseId()).orElseThrow();
            
            // Create new transaction
            PaymeTransaction transaction = new PaymeTransaction(
                transactionId,
                time,
                user,
                course,
                BigDecimal.valueOf(amount).divide(BigDecimal.valueOf(100)),
                objectMapper.writeValueAsString(account)
            );
            
            transaction.setState(PaymeTransaction.TransactionState.INITIAL);
            transaction = paymeTransactionRepository.save(transaction);
            
            PaymeResponse.PaymeResult result = new PaymeResponse.PaymeResult(
                transactionId,
                transaction.getCreateTime(),
                transaction.getState().getValue()
            );
            
            return new PaymeResponse(result, request.getId());
            
        } catch (Exception e) {
            return new PaymeResponse(
                new PaymeResponse.PaymeError(-32603, "Error creating transaction: " + e.getMessage()),
                request.getId()
            );
        }
    }
    
    private PaymeResponse performTransaction(PaymeRequest request) {
        try {
            String transactionId = request.getParams().getId();
            
            Optional<PaymeTransaction> transactionOpt = paymeTransactionRepository.findByPaymeTransactionId(transactionId);
            if (transactionOpt.isEmpty()) {
                return new PaymeResponse(
                    new PaymeResponse.PaymeError(ERROR_TRANSACTION_NOT_FOUND, "Transaction not found"),
                    request.getId()
                );
            }
            
            PaymeTransaction transaction = transactionOpt.get();
            
            if (transaction.getState() == PaymeTransaction.TransactionState.INITIAL) {
                // Perform the transaction
                transaction.setState(PaymeTransaction.TransactionState.PAY_ACCEPTED);
                transaction.setPerformTime(System.currentTimeMillis());
                
                // Enroll user in course
                User user = transaction.getUser();
                Course course = transaction.getCourse();
                user.getEnrolledCourses().add(course);
                course.setEnrollmentCount(course.getEnrollmentCount() + 1);
                
                userRepository.save(user);
                courseRepository.save(course);
                paymeTransactionRepository.save(transaction);
                
                // Send notifications
                sendPaymentSuccessNotifications(transaction);
                
                PaymeResponse.PaymeResult result = new PaymeResponse.PaymeResult(
                    transactionId,
                    transaction.getCreateTime(),
                    transaction.getState().getValue()
                );
                result.setPerform_time(transaction.getPerformTime());
                
                return new PaymeResponse(result, request.getId());
                
            } else if (transaction.getState() == PaymeTransaction.TransactionState.PAY_ACCEPTED) {
                // Transaction already performed
                PaymeResponse.PaymeResult result = new PaymeResponse.PaymeResult(
                    transactionId,
                    transaction.getCreateTime(),
                    transaction.getState().getValue()
                );
                result.setPerform_time(transaction.getPerformTime());
                
                return new PaymeResponse(result, request.getId());
                
            } else {
                return new PaymeResponse(
                    new PaymeResponse.PaymeError(ERROR_TRANSACTION_NOT_PERFORMED, "Transaction cannot be performed"),
                    request.getId()
                );
            }
            
        } catch (Exception e) {
            return new PaymeResponse(
                new PaymeResponse.PaymeError(-32603, "Error performing transaction: " + e.getMessage()),
                request.getId()
            );
        }
    }
    
    private PaymeResponse cancelTransaction(PaymeRequest request) {
        try {
            String transactionId = request.getParams().getId();
            Integer reason = request.getParams().getReason();
            
            Optional<PaymeTransaction> transactionOpt = paymeTransactionRepository.findByPaymeTransactionId(transactionId);
            if (transactionOpt.isEmpty()) {
                return new PaymeResponse(
                    new PaymeResponse.PaymeError(ERROR_TRANSACTION_NOT_FOUND, "Transaction not found"),
                    request.getId()
                );
            }
            
            PaymeTransaction transaction = transactionOpt.get();
            
            if (transaction.getState() == PaymeTransaction.TransactionState.INITIAL) {
                // Cancel during waiting
                transaction.setState(PaymeTransaction.TransactionState.CANCELLED_WHILE_WAITING);
                transaction.setCancelTime(System.currentTimeMillis());
                transaction.setReason(reason);
                
            } else if (transaction.getState() == PaymeTransaction.TransactionState.PAY_ACCEPTED) {
                // Cancel after successful payment - refund
                transaction.setState(PaymeTransaction.TransactionState.CANCELLED_AFTER_SUCCESSFUL);
                transaction.setCancelTime(System.currentTimeMillis());
                transaction.setReason(reason);
                
                // Remove user from course
                User user = transaction.getUser();
                Course course = transaction.getCourse();
                user.getEnrolledCourses().remove(course);
                course.setEnrollmentCount(Math.max(0, course.getEnrollmentCount() - 1));
                
                userRepository.save(user);
                courseRepository.save(course);
                
                // Send cancellation notification
                sendPaymentCancellationNotifications(transaction);
                
            } else {
                return new PaymeResponse(
                    new PaymeResponse.PaymeError(ERROR_TRANSACTION_NOT_CANCELLED, "Transaction cannot be cancelled"),
                    request.getId()
                );
            }
            
            paymeTransactionRepository.save(transaction);
            
            PaymeResponse.PaymeResult result = new PaymeResponse.PaymeResult(
                transactionId,
                transaction.getCreateTime(),
                transaction.getState().getValue()
            );
            result.setCancel_time(transaction.getCancelTime());
            
            return new PaymeResponse(result, request.getId());
            
        } catch (Exception e) {
            return new PaymeResponse(
                new PaymeResponse.PaymeError(-32603, "Error cancelling transaction: " + e.getMessage()),
                request.getId()
            );
        }
    }
    
    private PaymeResponse checkTransaction(PaymeRequest request) {
        try {
            String transactionId = request.getParams().getId();
            
            Optional<PaymeTransaction> transactionOpt = paymeTransactionRepository.findByPaymeTransactionId(transactionId);
            if (transactionOpt.isEmpty()) {
                return new PaymeResponse(
                    new PaymeResponse.PaymeError(ERROR_TRANSACTION_NOT_FOUND, "Transaction not found"),
                    request.getId()
                );
            }
            
            PaymeTransaction transaction = transactionOpt.get();
            
            PaymeResponse.PaymeResult result = new PaymeResponse.PaymeResult(
                transactionId,
                transaction.getCreateTime(),
                transaction.getState().getValue()
            );
            
            if (transaction.getPerformTime() != null) {
                result.setPerform_time(transaction.getPerformTime());
            }
            
            if (transaction.getCancelTime() != null) {
                result.setCancel_time(transaction.getCancelTime());
            }
            
            if (transaction.getReason() != null) {
                result.setReason(transaction.getReason());
            }
            
            return new PaymeResponse(result, request.getId());
            
        } catch (Exception e) {
            return new PaymeResponse(
                new PaymeResponse.PaymeError(-32603, "Error checking transaction: " + e.getMessage()),
                request.getId()
            );
        }
    }
    
    private PaymeResponse getStatement(PaymeRequest request) {
        try {
            Long from = request.getParams().getFrom();
            Long to = request.getParams().getTo();
            
            List<PaymeTransaction> transactions = paymeTransactionRepository.findByCreateTimeBetween(from, to);
            
            List<PaymeResponse.PaymeTransaction> paymeTransactions = transactions.stream()
                .map(this::convertToPaymeTransaction)
                .toList();
            
            PaymeResponse.PaymeResult result = new PaymeResponse.PaymeResult();
            result.setTransactions(paymeTransactions);
            
            return new PaymeResponse(result, request.getId());
            
        } catch (Exception e) {
            return new PaymeResponse(
                new PaymeResponse.PaymeError(-32603, "Error getting statement: " + e.getMessage()),
                request.getId()
            );
        }
    }
    
    private PaymeResponse.PaymeDetail createDetailForCourse(Course course) {
        PaymeResponse.PaymeItem item = new PaymeResponse.PaymeItem(
            "Онлайн курс: " + course.getTitle(),
            course.getPrice().multiply(BigDecimal.valueOf(100)).longValue(), // Convert to tiyin
            1,
            EDUCATION_SERVICE_MXIK,
            EDUCATION_SERVICE_PACKAGE,
            VAT_PERCENT
        );
        
        return new PaymeResponse.PaymeDetail(List.of(item));
    }
    
    private PaymeResponse.PaymeTransaction convertToPaymeTransaction(PaymeTransaction transaction) {
        PaymeResponse.PaymeTransaction paymeTransaction = new PaymeResponse.PaymeTransaction();
        paymeTransaction.setId(transaction.getPaymeTransactionId());
        paymeTransaction.setTime(transaction.getPaymeTime());
        paymeTransaction.setAmount(transaction.getAmount().multiply(BigDecimal.valueOf(100)).longValue());
        paymeTransaction.setAccount(transaction.getAccount());
        paymeTransaction.setCreate_time(transaction.getCreateTime());
        paymeTransaction.setPerform_time(transaction.getPerformTime());
        paymeTransaction.setCancel_time(transaction.getCancelTime());
        paymeTransaction.setTransaction(transaction.getPaymeTransactionId());
        paymeTransaction.setState(transaction.getState().getValue());
        paymeTransaction.setReason(transaction.getReason());
        
        return paymeTransaction;
    }
    
    private void sendPaymentSuccessNotifications(PaymeTransaction transaction) {
        try {
            User user = transaction.getUser();
            Course course = transaction.getCourse();
            
            // Send in-app notification
            notificationService.createNotification(
                user,
                "To'lov muvaffaqiyatli amalga oshirildi",
                "\"" + course.getTitle() + "\" kursi uchun to'lovingiz muvaffaqiyatli qabul qilindi. Endi kursga kirish huquqiga egasiz!",
                com.edupress.model.Notification.Type.SUCCESS,
                "/courses/" + course.getId()
            );
            
            // Send email
            String subject = "To'lov tasdiqlandi - " + course.getTitle();
            String body = String.format(
                "Hurmatli %s,\n\n" +
                "\"%s\" kursi uchun to'lovingiz muvaffaqiyatli amalga oshirildi.\n\n" +
                "To'lov ma'lumotlari:\n" +
                "- Summa: %s so'm\n" +
                "- Kurs: %s\n" +
                "- To'lov ID: %s\n\n" +
                "Endi kursga to'liq kirish huquqiga egasiz. Bugundan o'qishni boshlang!\n\n" +
                "Hurmat bilan,\n" +
                "EduPress jamoasi",
                user.getFirstName(),
                course.getTitle(),
                transaction.getAmount(),
                course.getTitle(),
                transaction.getPaymeTransactionId()
            );
            
            emailService.sendSimpleEmail(user.getEmail(), subject, body);
            
        } catch (Exception e) {
            System.err.println("Failed to send payment success notifications: " + e.getMessage());
        }
    }
    
    private void sendPaymentCancellationNotifications(PaymeTransaction transaction) {
        try {
            User user = transaction.getUser();
            Course course = transaction.getCourse();
            
            notificationService.createNotification(
                user,
                "To'lov bekor qilindi",
                "\"" + course.getTitle() + "\" kursi uchun to'lovingiz bekor qilindi. Kursga kirish huquqi olib tashlandi.",
                com.edupress.model.Notification.Type.WARNING,
                "/dashboard/purchases"
            );
            
        } catch (Exception e) {
            System.err.println("Failed to send payment cancellation notifications: " + e.getMessage());
        }
    }
    
    // Utility methods for frontend integration
    public String generatePaymentUrl(Long courseId, Long userId) {
        try {
            Course course = courseRepository.findById(courseId).orElseThrow();
            User user = userRepository.findById(userId).orElseThrow();
            
            Long amount = course.getPrice().multiply(BigDecimal.valueOf(100)).longValue();
            
            String baseUrl = "https://checkout.paycom.uz";
            String params = String.format(
                "m=%s&ac.course_id=%d&ac.user_id=%d&a=%d&c=%s",
                merchantId,
                courseId,
                userId,
                amount,
                "https://edupress.uz/payment/return" // return URL
            );
            
            return baseUrl + "?" + params;
            
        } catch (Exception e) {
            throw new RuntimeException("Error generating payment URL: " + e.getMessage());
        }
    }
    
    public Map<String, Object> getPaymentStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTransactions", paymeTransactionRepository.count());
        stats.put("successfulPayments", paymeTransactionRepository.countByState(PaymeTransaction.TransactionState.PAY_ACCEPTED));
        stats.put("cancelledPayments", paymeTransactionRepository.countByState(PaymeTransaction.TransactionState.CANCELLED_AFTER_SUCCESSFUL));
        stats.put("totalRevenue", paymeTransactionRepository.getTotalAmountByState(PaymeTransaction.TransactionState.PAY_ACCEPTED));
        return stats;
    }
    
    public Map<String, Object> getPaymentStats(String period) {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTransactions", paymeTransactionRepository.count());
        stats.put("successfulPayments", paymeTransactionRepository.countByState(PaymeTransaction.TransactionState.PAY_ACCEPTED));
        stats.put("cancelledPayments", paymeTransactionRepository.countByState(PaymeTransaction.TransactionState.CANCELLED_AFTER_SUCCESSFUL));
        stats.put("totalRevenue", paymeTransactionRepository.getTotalAmountByState(PaymeTransaction.TransactionState.PAY_ACCEPTED));
        
        // Add period-based filtering if needed
        if (period != null) {
            // Add period-specific logic here if required
            stats.put("period", period);
        }
        
        return stats;
    }
    
    public List<Map<String, Object>> getUserTransactions(Long userId) {
        List<PaymeTransaction> transactions = paymeTransactionRepository.findByUserIdOrderByCreatedAtDesc(userId);
        
        return transactions.stream().map(transaction -> {
            Map<String, Object> transactionMap = new HashMap<>();
            transactionMap.put("id", transaction.getId());
            transactionMap.put("paymeTransactionId", transaction.getPaymeTransactionId());
            transactionMap.put("courseId", transaction.getCourse().getId());
            transactionMap.put("courseTitle", transaction.getCourse().getTitle());
            transactionMap.put("amount", transaction.getAmount());
            transactionMap.put("state", transaction.getState().name());
            transactionMap.put("createdAt", transaction.getCreatedAt());
            transactionMap.put("createTime", transaction.getCreateTime());
            transactionMap.put("performTime", transaction.getPerformTime());
            transactionMap.put("cancelTime", transaction.getCancelTime());
            transactionMap.put("reason", transaction.getReason());
            return transactionMap;
        }).toList();
    }
    
    public Map<String, Object> getTransactionStatus(String transactionId) {
        Optional<PaymeTransaction> transactionOpt = paymeTransactionRepository.findByPaymeTransactionId(transactionId);
        
        if (transactionOpt.isEmpty()) {
            throw new RuntimeException("Transaction not found");
        }
        
        PaymeTransaction transaction = transactionOpt.get();
        Map<String, Object> status = new HashMap<>();
        status.put("transactionId", transaction.getPaymeTransactionId());
        status.put("state", transaction.getState().name());
        status.put("amount", transaction.getAmount());
        status.put("courseId", transaction.getCourse().getId());
        status.put("courseTitle", transaction.getCourse().getTitle());
        status.put("createTime", transaction.getCreateTime());
        status.put("performTime", transaction.getPerformTime());
        status.put("cancelTime", transaction.getCancelTime());
        status.put("reason", transaction.getReason());
        
        // Add user-friendly status message
        String statusMessage = switch (transaction.getState()) {
            case INITIAL -> "Boshlangan";
            case WAITING_PAY -> "To'lov kutilmoqda";
            case PAY_ACCEPTED -> "To'lov muvaffaqiyatli o'tdi";
            case CANCELLED_WHILE_WAITING -> "To'lov bekor qilindi";
            case CANCELLED_AFTER_SUCCESSFUL -> "To'lov bekor qilindi (to'lovdan keyin)";
        };
        status.put("statusMessage", statusMessage);
        
        return status;
    }
    
    public List<Map<String, Object>> getAllTransactionsForAdmin(String period, String status, int page, int size) {
        List<PaymeTransaction> transactions;
        
        // Filter by status if provided
        if (status != null && !status.equals("all")) {
            try {
                PaymeTransaction.TransactionState state = PaymeTransaction.TransactionState.valueOf(status);
                transactions = paymeTransactionRepository.findByStateOrderByCreatedAtDesc(state);
            } catch (IllegalArgumentException e) {
                transactions = paymeTransactionRepository.findAllOrderByCreatedAtDesc();
            }
        } else {
            transactions = paymeTransactionRepository.findAllOrderByCreatedAtDesc();
        }
        
        // Apply pagination
        int start = page * size;
        int end = Math.min(start + size, transactions.size());
        if (start > transactions.size()) {
            transactions = new ArrayList<>();
        } else {
            transactions = transactions.subList(start, end);
        }
        
        // Convert to admin-friendly format
        List<Map<String, Object>> result = new ArrayList<>();
        for (PaymeTransaction transaction : transactions) {
            Map<String, Object> adminTransaction = new HashMap<>();
            adminTransaction.put("id", transaction.getId());
            adminTransaction.put("paymeTransactionId", transaction.getPaymeTransactionId());
            adminTransaction.put("courseId", transaction.getCourse().getId());
            adminTransaction.put("courseName", transaction.getCourse().getTitle());
            adminTransaction.put("userId", transaction.getUser().getId());
            adminTransaction.put("userEmail", transaction.getUser().getEmail());
            adminTransaction.put("amount", transaction.getAmount());
            adminTransaction.put("state", transaction.getState().name());
            adminTransaction.put("reason", transaction.getReason());
            adminTransaction.put("createTime", transaction.getCreateTime());
            adminTransaction.put("performTime", transaction.getPerformTime());
            adminTransaction.put("cancelTime", transaction.getCancelTime());
            adminTransaction.put("createdAt", transaction.getCreatedAt());
            adminTransaction.put("updatedAt", transaction.getUpdatedAt());
            
            result.add(adminTransaction);
        }
        
        return result;
    }
}
